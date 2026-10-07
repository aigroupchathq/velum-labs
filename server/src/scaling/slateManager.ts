// ============================================================================
// server/src/scaling/slateManager.ts
// Production Slate Manager: Orchestrates Spatial, Bitmask, and Worker Pipeline
// Conforms to: Master Build Specification §2, §7, §25, ARCHITECTURE_REVIEW.md
// Generates and manages daily slates with 100k -> 200 -> 50 -> Top-10 pipeline.
// ============================================================================

import { performance } from 'perf_hooks'
import { spatialIndex } from '../../../src/utils/spatialIndexer.js'
import { cullCandidatesWithBitmask } from '../../../src/utils/bitmaskEngine.js'
import { matchPool } from '../workers/matchPool.js'
import { matchSlateQueue, type CachedSlate, type SlateJob } from './slateQueue.js'
import { db } from '../data/dbStore.js'
import type { UniversalUserProfile } from '../../../src/types/index.js'

export class SlateManager {
  private isInitialized = false

  constructor() {
    // Register worker job processor with the queue
    matchSlateQueue.registerWorker(async (job: SlateJob) => {
      return this.generateSlateForUser(job.userId)
    })
  }

  /**
   * Initialize spatial index with existing database users
   */
  public initializeIndex(users?: UniversalUserProfile[]): void {
    const userList = users || db.getAllUsers()
    spatialIndex.clear()
    spatialIndex.bulkIndex(userList)
    this.isInitialized = true
  }

  /**
   * End-to-end multi-stage pipeline:
   * 1. 100,000 users in database/spatial index
   * 2. Spatial Binning (15km Hex Grid): Culls 100k -> ~200 candidates
   * 3. Integer Bitmask Engine: Culls ~200 -> ~50 candidates in O(1) cycles
   * 4. Background Worker Thread Pool: Evaluates deep 5-stage mutuality
   * 5. Top-K Slice (Top 10) & Caching
   */
  public async generateSlateForUser(userId: string, topK = 10): Promise<CachedSlate> {
    const start = performance.now()
    const currentUser = db.getUser(userId)

    if (!currentUser) {
      throw new Error(`User with ID ${userId} not found in database.`)
    }

    if (!this.isInitialized) {
      this.initializeIndex()
    }

    // Step 1: Spatial Culling (100,000 -> 200)
    // Fast O(1) hash lookup across 15km discrete hex bins + k-rings
    const spatialCandidates = spatialIndex.getCandidatesWithinRadius(currentUser, {
      maxDistanceKm: currentUser.geography?.maxDistanceKm ?? 50,
      includeLongDistance: true,
      candidateLimit: 250,
    })

    // Filter safety blocks
    const unblockedCandidates = spatialCandidates.filter(
      (c) => c.id !== currentUser.id && !db.isBlocked(currentUser.id, c.id)
    )

    // Step 2: Instant Integer Bitmask Dealbreaker Culling (200 -> ~50)
    // Microsecond rejection of lifestyle, smoking, kids, diet, and structure dealbreakers
    const bitmaskSurvivingCandidates = cullCandidatesWithBitmask(currentUser, unblockedCandidates)

    // Step 3: Offloaded Deep 5-Stage Evaluation in Worker Thread Pool
    // Evaluates harmonic mutuality, values, attraction, communication, and confidence
    const evaluated = await matchPool.evaluateCandidatesAsync(currentUser, bitmaskSurvivingCandidates)

    // Step 4: Sort and slice Top-K slate
    const topSlate = evaluated.slice(0, topK)
    const duration = performance.now() - start

    const cachedSlate: CachedSlate = {
      userId,
      generatedAt: Date.now(),
      expiresAt: Date.now() + 86400 * 1000, // 24-hour TTL
      recommendations: topSlate,
      metrics: {
        initialPoolSize: spatialIndex.getStats().totalUsers,
        spatialFilteredCount: unblockedCandidates.length,
        bitmaskFilteredCount: bitmaskSurvivingCandidates.length,
        evaluatedCount: evaluated.length,
        generationDurationMs: parseFloat(duration.toFixed(2)),
      },
    }

    return cachedSlate
  }

  /**
   * Get user's daily slate: Returns from Redis/cache if available (sub-2ms),
   * or computes on-demand and caches for 24 hours.
   */
  public async getOrGenerateDailySlate(userId: string): Promise<CachedSlate> {
    // Check Cache First (O(1) Redis / Memory hit)
    const cached = await matchSlateQueue.cache.getSlate(userId)
    if (cached) {
      return cached
    }

    // Cache Miss: Compute through pipeline and cache
    const freshSlate = await this.generateSlateForUser(userId)
    await matchSlateQueue.cache.setSlate(userId, freshSlate, 86400)
    return freshSlate
  }

  /**
   * Dispatch asynchronous batch slate generation for an entire cohort
   * (e.g. at 02:00 AM UTC nightly cron trigger)
   */
  public dispatchNightlyBatch(userIds?: string[], cohortId = 'nightly_batch'): number {
    const targetUserIds = userIds || db.getAllUsers().map((u) => u.id)
    matchSlateQueue.addCohortBatch(targetUserIds, cohortId)
    return targetUserIds.length
  }

  /**
   * Invalidate cached slate when a user updates critical preferences
   */
  public async invalidateUserSlate(userId: string): Promise<void> {
    await matchSlateQueue.cache.invalidate(userId)
  }

  /**
   * Diagnostic pipeline telemetry
   */
  public getTelemetry() {
    return {
      spatialIndex: spatialIndex.getStats(),
      queue: matchSlateQueue.getMetrics(),
      workerPool: matchPool.getMetrics(),
    }
  }
}

// Global default Slate Manager singleton
export const slateManager = new SlateManager()
