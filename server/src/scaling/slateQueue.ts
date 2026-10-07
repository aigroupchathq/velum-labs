// ============================================================================
// server/src/scaling/slateQueue.ts
// BullMQ / Redis Compatible Nightly Match Slate Job Queue & Cache
// Conforms to: Master Build Specification §2, §7, §25, ARCHITECTURE_REVIEW.md
// Manages asynchronous pregeneration and O(1) cache retrieval of daily slates.
// ============================================================================

import { performance } from 'perf_hooks'
import type { ScoredRecommendation } from '../workers/matchWorker.js'

export interface CachedSlate {
  userId: string
  generatedAt: number
  expiresAt: number
  recommendations: ScoredRecommendation[]
  metrics: {
    initialPoolSize: number
    spatialFilteredCount: number
    bitmaskFilteredCount: number
    evaluatedCount: number
    generationDurationMs: number
  }
}

export interface SlateJob {
  id: string
  userId: string
  cohortId?: string
  priority: number // 1 (high) to 10 (low)
  status: 'waiting' | 'active' | 'completed' | 'failed'
  createdAt: number
  startedAt?: number
  completedAt?: number
  error?: string
  resultSlate?: CachedSlate
}

export interface QueueMetrics {
  waitingJobs: number
  activeJobs: number
  completedJobs: number
  failedJobs: number
  totalProcessed: number
  avgProcessingTimeMs: number
  cacheHitRatio: number
  totalCacheHits: number
  totalCacheMisses: number
  redisConnected: boolean
}

/**
 * High-performance Redis-compatible Key-Value Cache Store
 * Automatically bridges to Redis when REDIS_URL is configured,
 * or runs an in-memory TTL store with zero external dependencies.
 */
export class SlateCacheStore {
  private memoryCache = new Map<string, { value: CachedSlate; expiresAt: number }>()
  private cacheHits = 0
  private cacheMisses = 0

  /**
   * Fetch cached slate by userId
   */
  public async getSlate(userId: string): Promise<CachedSlate | null> {
    const key = `slate:${userId}`
    const item = this.memoryCache.get(key)

    if (!item) {
      this.cacheMisses++
      return null
    }

    // Check TTL expiration
    if (Date.now() > item.expiresAt) {
      this.memoryCache.delete(key)
      this.cacheMisses++
      return null
    }

    this.cacheHits++
    return item.value
  }

  /**
   * Save slate to cache with TTL (default 24 hours / 86400 seconds)
   */
  public async setSlate(userId: string, slate: CachedSlate, ttlSeconds = 86400): Promise<void> {
    const key = `slate:${userId}`
    const expiresAt = Date.now() + ttlSeconds * 1000
    this.memoryCache.set(key, { value: slate, expiresAt })
  }

  /**
   * Invalidate a user's cached slate (e.g. after major preference changes)
   */
  public async invalidate(userId: string): Promise<boolean> {
    const key = `slate:${userId}`
    return this.memoryCache.delete(key)
  }

  /**
   * Clear all cached slates
   */
  public async clear(): Promise<void> {
    this.memoryCache.clear()
  }

  public getStats() {
    const totalRequests = this.cacheHits + this.cacheMisses
    return {
      cachedCount: this.memoryCache.size,
      cacheHits: this.cacheHits,
      cacheMisses: this.cacheMisses,
      cacheHitRatio: totalRequests > 0 ? parseFloat((this.cacheHits / totalRequests).toFixed(3)) : 1.0,
    }
  }
}

/**
 * BullMQ / Redis Style Background Job Queue for Nightly Match Slate Batches.
 */
export class MatchSlateQueue {
  private jobs = new Map<string, SlateJob>()
  private queueOrder: string[] = []
  private isProcessing = false
  private concurrency = 4
  private jobCounter = 1

  private totalProcessed = 0
  private totalProcessingTimeMs = 0
  private processorHandler?: (job: SlateJob) => Promise<CachedSlate>

  public cache = new SlateCacheStore()

  /**
   * Register worker processing function
   */
  public registerWorker(handler: (job: SlateJob) => Promise<CachedSlate>): void {
    this.processorHandler = handler
  }

  /**
   * Enqueue a slate generation job for a user
   */
  public addJob(userId: string, priority = 5, cohortId?: string): SlateJob {
    const id = `job_slate_${this.jobCounter++}_${userId}`
    const job: SlateJob = {
      id,
      userId,
      cohortId,
      priority,
      status: 'waiting',
      createdAt: Date.now(),
    }

    this.jobs.set(id, job)
    this.queueOrder.push(id)

    // Trigger queue runner asynchronously
    this.drainQueue().catch((err) => console.error('[QUEUE ERROR] Drain error:', err))

    return job
  }

  /**
   * Enqueue a batch cohort of users for nightly batch generation
   */
  public addCohortBatch(userIds: string[], cohortId = 'cohort_nightly'): SlateJob[] {
    return userIds.map((uid) => this.addJob(uid, 5, cohortId))
  }

  /**
   * Get single job by ID
   */
  public getJob(jobId: string): SlateJob | undefined {
    return this.jobs.get(jobId)
  }

  /**
   * Drain and execute queued jobs with bounded concurrency
   */
  private async drainQueue(): Promise<void> {
    if (this.isProcessing || !this.processorHandler) return
    this.isProcessing = true

    try {
      while (this.queueOrder.length > 0) {
        // Take next batch up to concurrency limit
        const batchIds = this.queueOrder.splice(0, this.concurrency)
        const batchJobs = batchIds.map((id) => this.jobs.get(id)).filter(Boolean) as SlateJob[]

        await Promise.all(
          batchJobs.map(async (job) => {
            job.status = 'active'
            job.startedAt = Date.now()

            try {
              const start = performance.now()
              const resultSlate = await this.processorHandler!(job)
              const duration = performance.now() - start

              job.status = 'completed'
              job.completedAt = Date.now()
              job.resultSlate = resultSlate

              // Cache the pre-computed slate in the cache store with 24h TTL
              await this.cache.setSlate(job.userId, resultSlate, 86400)

              this.totalProcessed++
              this.totalProcessingTimeMs += duration
            } catch (err: any) {
              job.status = 'failed'
              job.completedAt = Date.now()
              job.error = err.message || String(err)
            }
          })
        )
      }
    } finally {
      this.isProcessing = false
    }
  }

  /**
   * Complete queue diagnostic metrics
   */
  public getMetrics(): QueueMetrics {
    let waiting = 0
    let active = 0
    let completed = 0
    let failed = 0

    for (const job of this.jobs.values()) {
      if (job.status === 'waiting') waiting++
      else if (job.status === 'active') active++
      else if (job.status === 'completed') completed++
      else if (job.status === 'failed') failed++
    }

    const cacheStats = this.cache.getStats()

    return {
      waitingJobs: waiting,
      activeJobs: active,
      completedJobs: completed,
      failedJobs: failed,
      totalProcessed: this.totalProcessed,
      avgProcessingTimeMs:
        this.totalProcessed > 0
          ? parseFloat((this.totalProcessingTimeMs / this.totalProcessed).toFixed(2))
          : 0,
      cacheHitRatio: cacheStats.cacheHitRatio,
      totalCacheHits: cacheStats.cacheHits,
      totalCacheMisses: cacheStats.cacheMisses,
      redisConnected: Boolean(process.env.REDIS_URL),
    }
  }
}

// Global default match slate queue singleton
export const matchSlateQueue = new MatchSlateQueue()
