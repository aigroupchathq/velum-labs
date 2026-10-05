// ============================================================================
// server/src/routes/matching.ts
// Matching & Recommendation Routes (API_SPEC.md §3)
// ============================================================================

import { Router, Request, Response } from 'express'
import { db } from '../data/dbStore.js'
import { evaluateMatch, calculateHaversineDistance } from '../../../src/utils/matchingEngine.js'

export const matchingRouter = Router()

// POST /api/v1/matching/evaluate (Spec §3.2)
// Evaluate compatibility between two designated profiles with deep explainability
matchingRouter.post('/evaluate', (req: Request, res: Response): void => {
  const { userAId, userBId } = req.body

  if (!userAId || !userBId) {
    res.status(400).json({ error: 'Both userAId and userBId are required.' })
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

  const evaluation = evaluateMatch(userA, userB)

  // Audit evaluation snapshot
  db.logAudit(userAId, 'system', 'EVALUATE_MATCH', 'evaluation', null, {
    targetId: userBId,
    eligible: evaluation.eligible,
    mutualScore: evaluation.mutuality.score,
    confidence: evaluation.confidence.score,
  })

  res.json({
    userA: { id: userA.id, name: userA.identity.name },
    userB: { id: userB.id, name: userB.identity.name },
    evaluation,
  })
})

// GET /api/v1/recommendations (Spec §3.1)
// Return curated recommendations for the current active user with anti-trilateration distance bands
const getRecommendationsHandler = (req: Request, res: Response): void => {
  const currentUserId = (req.query.userId as string) || 'usr_elena_current'
  const currentUser = db.getUser(currentUserId)

  if (!currentUser) {
    res.status(404).json({ error: 'User profile not found.' })
    return
  }

  const allUsers = db.getAllUsers()
  const candidatePool = allUsers.filter((u) => u.id !== currentUser.id && !db.isBlocked(currentUser.id, u.id))

  const evaluated = candidatePool.map((candidate) => {
    const evaluation = evaluateMatch(currentUser, candidate)

    // Coarsen distance to prevent adversarial geometric trilateration
    const rawDist = calculateHaversineDistance(
      currentUser.geography.latitude,
      currentUser.geography.longitude,
      candidate.geography.latitude,
      candidate.geography.longitude
    )

    let coarseDistanceBand = 'Over 50 km'
    if (rawDist <= 10) coarseDistanceBand = 'Local (< 10 km)'
    else if (rawDist <= 25) coarseDistanceBand = 'Metro (10–25 km)'
    else if (rawDist <= 50) coarseDistanceBand = 'Regional (25–50 km)'

    return {
      candidateId: candidate.id,
      profile: {
        name: candidate.identity.name,
        age: candidate.identity.age,
        pronouns: candidate.identity.pronouns,
        bio: candidate.identity.bio,
        photos: candidate.identity.photos,
        verified: candidate.identity.verified,
        distanceBand: coarseDistanceBand,
        relationshipIntention: candidate.intention.primaryIntent,
        relationshipStructure: candidate.intention.relationshipStructure,
      },
      evaluation: {
        eligible: evaluation.eligible,
        mutualScore: evaluation.mutuality.score,
        scoreAtoB: evaluation.compatibility.aToB,
        scoreBtoA: evaluation.compatibility.bToA,
        confidence: evaluation.confidence,
        hardConflicts: evaluation.hardConflicts,
        topSynergies: evaluation.explanation.strongAlignment,
        potentialFrictions: evaluation.explanation.potentialFriction,
        unknowns: evaluation.uncertainty.unknownAttributes,
        whyRecommended: evaluation.explanation.whyRecommended,
      },
    }
  })

  // Sort: Eligible first, then descending by harmonic mutual score
  evaluated.sort((a, b) => {
    if (a.evaluation.eligible !== b.evaluation.eligible) {
      return a.evaluation.eligible ? -1 : 1
    }
    return (b.evaluation.mutualScore ?? 0) - (a.evaluation.mutualScore ?? 0)
  })

  db.logAudit(currentUserId, 'system', 'FETCH_RECOMMENDATIONS', 'recommendations', null, {
    count: evaluated.length,
    eligibleCount: evaluated.filter((e) => e.evaluation.eligible).length,
  })

  res.json({
    userId: currentUser.id,
    recommendations: evaluated,
  })
}

matchingRouter.get('/recommendations', getRecommendationsHandler)
matchingRouter.get('/', getRecommendationsHandler)
