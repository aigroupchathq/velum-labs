// ============================================================================
// server/src/workers/matchPool.ts
// Worker Thread Pool Manager for Offloading CPU-Bound O(N) Match Evaluation
// Conforms to: Master Build Specification §2, §7, §31, ARCHITECTURE_REVIEW.md
// ============================================================================

import { Worker } from 'worker_threads'
import path from 'path'
import os from 'os'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { performance } from 'perf_hooks'
import type { UniversalUserProfile, CompatibilityResult } from '../../../src/types/index.js'
import {
  processCandidateBatch,
  processPair,
  type ScoredRecommendation,
} from './matchWorker.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface PendingTask {
  id: string
  type: 'EVALUATE_CANDIDATE_BATCH' | 'EVALUATE_PAIR'
  payload: any
  resolve: (value: any) => void
  reject: (reason?: any) => void
  startTime: number
}

interface WorkerInstance {
  id: number
  worker: Worker
  isBusy: boolean
  currentTask: PendingTask | null
}

export interface MatchPoolMetrics {
  poolSize: number
  activeWorkers: number
  idleWorkers: number
  queuedTasks: number
  totalTasksProcessed: number
  totalEvaluations: number
  avgLatencyMs: number
  workerThreadsActive: boolean
}

export class MatchWorkerPool {
  private workers: WorkerInstance[] = []
  private taskQueue: PendingTask[] = []
  private nextTaskId = 1
  private poolSize: number
  private workerFilePath: string
  private isShuttingDown = false
  private useWorkers = true

  // Telemetry
  private totalTasksProcessed = 0
  private totalEvaluations = 0
  private totalDurationMs = 0

  constructor(customPoolSize?: number) {
    const cpuCount = os.cpus()?.length || 2
    this.poolSize = customPoolSize || Math.min(4, Math.max(2, Math.floor(cpuCount / 2)))

    // Determine target worker script path (.ts or .js)
    const tsWorker = path.join(__dirname, 'matchWorker.ts')
    const jsWorker = path.join(__dirname, 'matchWorker.js')
    this.workerFilePath = fs.existsSync(tsWorker) ? tsWorker : jsWorker

    this.initPool()
  }

  private initPool(): void {
    const isTs = this.workerFilePath.endsWith('.ts')
    const execArgv = isTs ? ['--import', 'tsx'] : []

    for (let i = 0; i < this.poolSize; i++) {
      try {
        const worker = new Worker(this.workerFilePath, { execArgv })
        const workerEntry: WorkerInstance = {
          id: i + 1,
          worker,
          isBusy: false,
          currentTask: null,
        }

        this.attachWorkerListeners(workerEntry)
        this.workers.push(workerEntry)
      } catch (err: any) {
        console.warn(`[MATCH-POOL WARN] Worker thread initialization failed (${err.message}). Falling back to async microtasks.`)
        this.useWorkers = false
        break
      }
    }

    if (this.workers.length > 0) {
      console.log(`[MATCH-POOL INIT] Successfully initialized ${this.workers.length} background worker threads for match evaluation.`)
    }
  }

  private attachWorkerListeners(entry: WorkerInstance): void {
    entry.worker.on('message', (response: { id: string; success: boolean; result?: any; error?: string }) => {
      const task = entry.currentTask
      if (!task || task.id !== response.id) {
        return
      }

      const duration = performance.now() - task.startTime
      this.totalTasksProcessed++
      this.totalDurationMs += duration

      entry.isBusy = false
      entry.currentTask = null

      if (response.success) {
        task.resolve(response.result)
      } else {
        task.reject(new Error(response.error || 'Worker evaluation failed.'))
      }

      // Check if tasks are waiting in queue
      this.dispatchNext(entry)
    })

    entry.worker.on('error', (err) => {
      console.error(`[MATCH-POOL ERROR] Worker ${entry.id} encountered an error:`, err.message)
      if (entry.currentTask) {
        entry.currentTask.reject(err)
        entry.currentTask = null
        entry.isBusy = false
      }
      this.replaceWorker(entry)
    })

    entry.worker.on('exit', (code) => {
      if (code !== 0 && !this.isShuttingDown) {
        console.warn(`[MATCH-POOL WARN] Worker ${entry.id} exited with code ${code}. Re-spawning...`)
        this.replaceWorker(entry)
      }
    })
  }

  private replaceWorker(oldEntry: WorkerInstance): void {
    const index = this.workers.findIndex((w) => w.id === oldEntry.id)
    if (index === -1 || this.isShuttingDown) return

    try {
      const isTs = this.workerFilePath.endsWith('.ts')
      const execArgv = isTs ? ['--import', 'tsx'] : []
      const newWorker = new Worker(this.workerFilePath, { execArgv })

      const newEntry: WorkerInstance = {
        id: oldEntry.id,
        worker: newWorker,
        isBusy: false,
        currentTask: null,
      }

      this.attachWorkerListeners(newEntry)
      this.workers[index] = newEntry
      this.dispatchNext(newEntry)
    } catch (err: any) {
      console.error('[MATCH-POOL] Failed to restart worker thread:', err.message)
    }
  }

  private dispatchNext(entry: WorkerInstance): void {
    if (entry.isBusy || this.taskQueue.length === 0) return

    const task = this.taskQueue.shift()
    if (!task) return

    entry.isBusy = true
    entry.currentTask = task
    entry.worker.postMessage({
      id: task.id,
      type: task.type,
      payload: task.payload,
    })
  }

  private executeTask<T>(type: 'EVALUATE_CANDIDATE_BATCH' | 'EVALUATE_PAIR', payload: any): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      // Fallback if workers are unavailable or disabled
      if (!this.useWorkers || this.workers.length === 0) {
        setImmediate(() => {
          const start = performance.now()
          try {
            if (type === 'EVALUATE_CANDIDATE_BATCH') {
              const res = processCandidateBatch(payload.currentUser, payload.candidates)
              this.totalEvaluations += payload.candidates.length
              this.totalTasksProcessed++
              this.totalDurationMs += (performance.now() - start)
              resolve(res as unknown as T)
            } else {
              const res = processPair(payload.userA, payload.userB)
              this.totalEvaluations++
              this.totalTasksProcessed++
              this.totalDurationMs += (performance.now() - start)
              resolve(res as unknown as T)
            }
          } catch (err) {
            reject(err)
          }
        })
        return
      }

      const taskId = `task_${this.nextTaskId++}_${Date.now()}`
      const task: PendingTask = {
        id: taskId,
        type,
        payload,
        resolve,
        reject,
        startTime: performance.now(),
      }

      // Try finding an idle worker
      const idleWorker = this.workers.find((w) => !w.isBusy)
      if (idleWorker) {
        idleWorker.isBusy = true
        idleWorker.currentTask = task
        idleWorker.worker.postMessage({
          id: task.id,
          type: task.type,
          payload: task.payload,
        })
      } else {
        // Enqueue task for when a worker becomes available
        this.taskQueue.push(task)
      }
    })
  }

  /**
   * Offload candidate pool batch matching off the Node main thread.
   * If the pool size is large (>= 20 candidates) and multiple workers are idle,
   * candidates can be chunked across workers to leverage multiple CPU cores.
   */
  public async evaluateCandidatesAsync(
    currentUser: UniversalUserProfile,
    candidates: UniversalUserProfile[]
  ): Promise<ScoredRecommendation[]> {
    if (candidates.length === 0) return []

    this.totalEvaluations += candidates.length

    let results: ScoredRecommendation[]

    // Multi-worker chunking for larger candidate pools (e.g. N >= 20)
    const availableWorkers = this.workers.filter((w) => !w.isBusy).length
    if (this.useWorkers && availableWorkers > 1 && candidates.length >= 20) {
      const chunkSize = Math.ceil(candidates.length / availableWorkers)
      const chunkPromises: Promise<ScoredRecommendation[]>[] = []

      for (let i = 0; i < candidates.length; i += chunkSize) {
        const chunk = candidates.slice(i, i + chunkSize)
        chunkPromises.push(
          this.executeTask<ScoredRecommendation[]>('EVALUATE_CANDIDATE_BATCH', {
            currentUser,
            candidates: chunk,
          })
        )
      }

      const chunkResults = await Promise.all(chunkPromises)
      results = chunkResults.flat()
      // Sort combined chunks: Eligible first, then descending by harmonic mutual score
      results.sort((a, b) => {
        if (a.evaluation.eligible !== b.evaluation.eligible) {
          return a.evaluation.eligible ? -1 : 1
        }
        return (b.evaluation.mutualScore ?? 0) - (a.evaluation.mutualScore ?? 0)
      })
    } else {
      results = await this.executeTask<ScoredRecommendation[]>('EVALUATE_CANDIDATE_BATCH', {
        currentUser,
        candidates,
      })
    }

    return results
  }

  /**
   * Offload single pair evaluation off the Node main thread
   */
  public async evaluatePairAsync(
    userA: UniversalUserProfile,
    userB: UniversalUserProfile
  ): Promise<CompatibilityResult> {
    this.totalEvaluations++
    return this.executeTask<CompatibilityResult>('EVALUATE_PAIR', { userA, userB })
  }

  public getMetrics(): MatchPoolMetrics {
    const activeWorkers = this.workers.filter((w) => w.isBusy).length
    const idleWorkers = this.workers.length - activeWorkers
    const avgLatencyMs =
      this.totalTasksProcessed > 0
        ? parseFloat((this.totalDurationMs / this.totalTasksProcessed).toFixed(2))
        : 0

    return {
      poolSize: this.poolSize,
      activeWorkers,
      idleWorkers,
      queuedTasks: this.taskQueue.length,
      totalTasksProcessed: this.totalTasksProcessed,
      totalEvaluations: this.totalEvaluations,
      avgLatencyMs,
      workerThreadsActive: this.useWorkers && this.workers.length > 0,
    }
  }

  public async terminate(): Promise<void> {
    this.isShuttingDown = true
    const termPromises = this.workers.map((w) => w.worker.terminate())
    await Promise.all(termPromises)
    this.workers = []
  }
}

export const matchPool = new MatchWorkerPool()
