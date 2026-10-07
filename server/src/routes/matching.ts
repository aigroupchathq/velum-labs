// ============================================================================
// server/src/routes/matching.ts
// Matching & Recommendation Routes (API_SPEC.md §3)
// Non-Blocking Worker Thread Architecture (Offloaded O(N) Computation)
// Protected with requireAuth & authorization boundaries
// ============================================================================

import { Router, Response } from 'express'
import { db } from '../data/dbStore.js'
import { matchPool } from '../workers/matchPool.js'
import { slateManager } from '../scaling/slateManager.js'
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js'

export const matchingRouter = Router()

// Initialize spatial index on server startup
slateManager.initializeIndex()

// POST /api/v1/matching/evaluate (Spec §3.2)
// Evaluate compatibility between two designated profiles with deep explainability
matchingRouter.post('/evaluate', requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { userAId, userBId } = req.body

  if (!userAId || !userBId) {
    res.status(400).json({ error: 'Both userAId and userBId are required.' })
    return
  }

  // Authorization check: Actor must be one of the evaluation participants
  if (req.actorUserId !== userAId && req.actorUserId !== userBId) {
    res.status(403).json({
      error: `Forbidden: Authenticated actor '${req.actorUserId}' is not authorized to trigger evaluation between external profiles '${userAId}' and '${userBId}'.`,
      code: 'FORBIDDEN_EVALUATION_ACCESS',
    })
    return
  }

  const userA = db.getUser(userAId)
  const userB = db.getUser(userBId)

  if (!userA || !userB) {
    res.status(404).json({ error: 'One or both user profiles not found.' })
    return
  }

  // Check bidirectional blocks
  if (db.isBlocked(userAId, userBId)) {
    res.status(403).json({ error: 'Evaluation restricted due to safety block.' })
    return
  }

  try {
    // Offload single-pair evaluation off the main Node.js event loop
    const evaluation = await matchPool.evaluatePairAsync(userA, userB)

    // Audit evaluation snapshot
    db.logAudit(req.actorUserId!, 'system', 'EVALUATE_MATCH', 'evaluation', null, {
      targetId: req.actorUserId === userAId ? userBId : userAId,
      eligible: evaluation.eligible,
      mutualScore: evaluation.mutuality.score,
      confidence: evaluation.confidence.score,
    })

    res.json({
      userA: { id: userA.id, name: userA.identity.name },
      userB: { id: userB.id, name: userB.identity.name },
      evaluation,
    })
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Worker thread evaluation error' })
  }
})

// GET /api/v1/recommendations/daily-slate (Spec §25, Scaling Architecture)
matchingRouter.get('/daily-slate', requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const currentUserId = req.actorUserId!

  if (req.query.userId && req.query.userId !== currentUserId) {
    res.status(403).json({ error: 'Forbidden: Cannot fetch recommendation slate for another user.' })
    return
  }

  try {
    const slate = await slateManager.getOrGenerateDailySlate(currentUserId)
    res.json({
      success: true,
      userId: slate.userId,
      generatedAt: slate.generatedAt,
      expiresAt: slate.expiresAt,
      metrics: slate.metrics,
      recommendations: slate.recommendations,
    })
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch daily recommendation slate' })
  }
})

// POST /api/v1/matching/slates/dispatch-batch
matchingRouter.post('/slates/dispatch-batch', requireAuth, (req: AuthenticatedRequest, res: Response): void => {
  const { userIds, cohortId } = req.body
  const queuedCount = slateManager.dispatchNightlyBatch(userIds, cohortId)
  res.json({
    success: true,
    message: `Dispatched nightly slate generation for ${queuedCount} users.`,
    queuedCount,
    cohortId: cohortId || 'nightly_batch',
  })
})

// GET /api/v1/matching/slates/telemetry
matchingRouter.get('/slates/telemetry', (_req: AuthenticatedRequest, res: Response): void => {
  res.json({
    status: 'operational',
    telemetry: slateManager.getTelemetry(),
  })
})

// DELETE /api/v1/matching/slates/cache
matchingRouter.delete('/slates/cache', requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.actorUserId!
  await slateManager.invalidateUserSlate(userId)
  res.json({ success: true, message: `Slate cache invalidated for user ${userId}` })
})

// GET /api/v1/recommendations (Spec §3.1)
const getRecommendationsHandler = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const currentUserId = req.actorUserId!

  if (req.query.userId && req.query.userId !== currentUserId) {
    res.status(403).json({ error: 'Forbidden: Cannot fetch recommendations for another user.' })
    return
  }

  const currentUser = db.getUser(currentUserId)

  if (!currentUser) {
    res.status(404).json({ error: 'User profile not found.' })
    return
  }

  const allUsers = db.getAllUsers()
  const candidatePool = allUsers.filter((u) => u.id !== currentUser.id && !db.isBlocked(currentUser.id, u.id))

  try {
    const evaluated = await matchPool.evaluateCandidatesAsync(currentUser, candidatePool)

    db.logAudit(currentUserId, 'system', 'FETCH_RECOMMENDATIONS', 'recommendations', null, {
      count: evaluated.length,
      eligibleCount: evaluated.filter((e) => e.evaluation.eligible).length,
    })

    res.json({
      userId: currentUser.id,
      count: evaluated.length,
      recommendations: evaluated,
    })
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to process recommendation candidates' })
  }
}

matchingRouter.get('/recommendations', requireAuth, getRecommendationsHandler)
matchingRouter.get('/', requireAuth, getRecommendationsHandler)

// GET /api/v1/matching/worker-pool
matchingRouter.get('/worker-pool', (_req: AuthenticatedRequest, res: Response): void => {
  res.json({
    status: 'operational',
    metrics: matchPool.getMetrics(),
  })
})
