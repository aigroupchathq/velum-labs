// ============================================================================
// server/src/workers/matchWorker.ts
// Background Worker Thread: Offloaded O(N) Pair Evaluation & Batch Matching
// Conforms to: Master Build Specification §2, §7, ARCHITECTURE_REVIEW.md
// ============================================================================

import { parentPort, isMainThread } from 'worker_threads'
import { evaluateMatch, calculateHaversineDistance } from '../../../src/utils/matchingEngine.js'
import type { UniversalUserProfile, CompatibilityResult } from '../../../src/types/index.js'

export interface ScoredRecommendation {
  candidateId: string
  candidate: {
    id: string
    name: string
  }
  profile: {
    name: string
    age: number
    pronouns: string
    bio: string
    photos: string[]
    verified: boolean
    distanceBand: string
    relationshipIntention: string
    relationshipStructure: string
  }
  evaluation: {
    eligible: boolean
    mutualScore: number
    mutuality: CompatibilityResult['mutuality']
    scoreAtoB: number
    scoreBtoA: number
    confidence: CompatibilityResult['confidence']
    hardConflicts: CompatibilityResult['hardConflicts']
    topSynergies: CompatibilityResult['explanation']['strongAlignment']
    potentialFrictions: CompatibilityResult['explanation']['potentialFriction']
    unknowns: CompatibilityResult['uncertainty']['unknownAttributes']
    whyRecommended: string
  }
}

export function processCandidateBatch(
  currentUser: UniversalUserProfile,
  candidates: UniversalUserProfile[]
): ScoredRecommendation[] {
  const scored = candidates.map((candidate) => {
    const evaluation = evaluateMatch(currentUser, candidate)

    // Coarsen distance to prevent adversarial geometric trilateration
    const lat1 = currentUser.geography?.coordinates?.lat ?? (currentUser.geography as any)?.latitude ?? 0
    const lon1 = currentUser.geography?.coordinates?.lng ?? (currentUser.geography as any)?.longitude ?? 0
    const lat2 = candidate.geography?.coordinates?.lat ?? (candidate.geography as any)?.latitude ?? 0
    const lon2 = candidate.geography?.coordinates?.lng ?? (candidate.geography as any)?.longitude ?? 0
    const rawDist = calculateHaversineDistance(lat1, lon1, lat2, lon2)

    let coarseDistanceBand = 'Over 50 km / 30+ mi'
    if (rawDist <= 10) coarseDistanceBand = 'Local (< 10 km / ~6 mi)'
    else if (rawDist <= 25) coarseDistanceBand = 'Metro (10–25 km / 6–15 mi)'
    else if (rawDist <= 50) coarseDistanceBand = 'Regional (25–50 km / 15–30 mi)'

    return {
      candidateId: candidate.id,
      candidate: {
        id: candidate.id,
        name: candidate.identity.name,
      },
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
        mutuality: evaluation.mutuality,
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

  // Sort in background thread: Eligible first, then descending by mutual score
  scored.sort((a, b) => {
    if (a.evaluation.eligible !== b.evaluation.eligible) {
      return a.evaluation.eligible ? -1 : 1
    }
    return (b.evaluation.mutualScore ?? 0) - (a.evaluation.mutualScore ?? 0)
  })

  return scored
}

export function processPair(
  userA: UniversalUserProfile,
  userB: UniversalUserProfile
): CompatibilityResult {
  return evaluateMatch(userA, userB)
}

// When executing inside a Node.js worker thread
if (!isMainThread && parentPort) {
  parentPort.on('message', (message: { id: string; type: string; payload: any }) => {
    const { id, type, payload } = message

    try {
      if (type === 'EVALUATE_CANDIDATE_BATCH') {
        const { currentUser, candidates } = payload
        const result = processCandidateBatch(currentUser, candidates)
        parentPort?.postMessage({ id, success: true, result })
      } else if (type === 'EVALUATE_PAIR') {
        const { userA, userB } = payload
        const result = processPair(userA, userB)
        parentPort?.postMessage({ id, success: true, result })
      } else {
        parentPort?.postMessage({ id, success: false, error: `Unknown task type: ${type}` })
      }
    } catch (err: any) {
      parentPort?.postMessage({ id, success: false, error: err.message || String(err) })
    }
  })
}
