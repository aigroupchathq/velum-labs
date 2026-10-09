// ============================================================================
// src/utils/exposureBalancer.ts
// Exposure Equity & Candidate Fair Distribution Optimization Engine
// Calculates Gini Concentration Index & Applies Anti-Starvation Re-ranking
// ============================================================================

import type { RecommendedCandidate } from '../types'

export interface ExposureMetrics {
  totalCandidatesEvaluated: number
  totalRecommendationsServed: number
  exposureGiniIndex: number // 0.0 (perfect equality) to 1.0 (extreme concentration)
  coverageRatePercent: number // Target >= 95%
  underExposedCandidatesCount: number
}

/**
 * Calculates Gini Coefficient of candidate exposure distribution array
 */
export function calculateExposureGini(exposures: number[]): number {
  if (!exposures || exposures.length === 0) return 0.0
  const sorted = [...exposures].sort((a, b) => a - b)
  const n = sorted.length
  let totalSum = 0.0
  let cumulativeWeightedSum = 0.0

  for (let i = 0; i < n; i++) {
    totalSum += sorted[i]
    cumulativeWeightedSum += (i + 1) * sorted[i]
  }

  if (totalSum === 0) return 0.0
  const gini = (2.0 * cumulativeWeightedSum) / (n * totalSum) - (n + 1.0) / n
  return Math.max(0.0, Math.min(1.0, Math.round(gini * 100) / 100))
}

/**
 * Re-ranks candidate slates to maintain exposure equity and prevent candidate starvation
 * while preserving 100% hard constraint Veto gating (\Gamma).
 */
export function balanceSlateExposure(
  candidates: RecommendedCandidate[],
  exposureTracker: Map<string, number>,
  topK = 5
): RecommendedCandidate[] {
  // Filter eligible candidates only (Invariant: Veto gating must NEVER be bypassed for exposure!)
  const eligible = candidates.filter((item) => item.evaluation.eligible)

  // Sort eligible candidates balancing mutual score H(A, B) with anti-starvation boost
  const reRanked = [...eligible].sort((a, b) => {
    const scoreA = a.evaluation.mutuality.score || 0
    const scoreB = b.evaluation.mutuality.score || 0

    const countA = exposureTracker.get(a.candidate.id) || 0
    const countB = exposureTracker.get(b.candidate.id) || 0

    // Anti-starvation boost: subtract 2 points per prior exposure count
    const adjustedScoreA = scoreA - countA * 2.0
    const adjustedScoreB = scoreB - countB * 2.0

    return adjustedScoreB - adjustedScoreA
  })

  const selectedSlate = reRanked.slice(0, topK)

  // Increment exposure counter for selected candidates
  selectedSlate.forEach((item) => {
    const current = exposureTracker.get(item.candidate.id) || 0
    exposureTracker.set(item.candidate.id, current + 1)
  })

  return selectedSlate
}

/**
 * Computes exposure health metrics across total candidate pool
 */
export function computeExposureMetrics(
  totalCandidateIds: string[],
  exposureTracker: Map<string, number>
): ExposureMetrics {
  const exposures = totalCandidateIds.map((id) => exposureTracker.get(id) || 0)
  const totalServed = exposures.reduce((acc, val) => acc + val, 0)
  const exposedCount = exposures.filter((val) => val > 0).length
  const coverageRate = Math.round((exposedCount / Math.max(totalCandidateIds.length, 1)) * 100)
  const giniIndex = calculateExposureGini(exposures)

  const meanExposure = totalServed / Math.max(totalCandidateIds.length, 1)
  const underExposedCount = exposures.filter((val) => val < Math.max(1, Math.floor(meanExposure / 2))).length

  return {
    totalCandidatesEvaluated: totalCandidateIds.length,
    totalRecommendationsServed: totalServed,
    exposureGiniIndex: giniIndex,
    coverageRatePercent: coverageRate,
    underExposedCandidatesCount: underExposedCount,
  }
}
