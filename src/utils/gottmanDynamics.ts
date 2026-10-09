// ============================================================================
// src/utils/gottmanDynamics.ts
// Gottman Relational Conflict Stability & De-escalation Repair Predictor
// Evaluates Dyadic Pacing, Conflict Style Pairings, and 5:1 Equilibrium Potential
// ============================================================================

import type { UniversalUserProfile } from '../types'

export interface GottmanDyadAnalysis {
  conflictPairingType: string
  stabilityQuotient: number // 0 to 100
  repairCapacityRating: 'EXCELLENT' | 'HIGH' | 'MODERATE' | 'NEEDS_PACE_AGREEMENT'
  gottmanRatioScore: number // Target 5.0 (5:1 positive-to-negative ratio)
  synergies: string[]
  frictionRisks: string[]
  recommendedDeescalationPact: string
}

/**
 * Computes Gottman Dyadic Conflict Dynamics and Repair Predictor between User A and User B
 */
export function analyzeGottmanDynamics(
  userA: UniversalUserProfile,
  userB: UniversalUserProfile
): GottmanDyadAnalysis {
  const styleA = userA.communication.conflictStyle
  const styleB = userB.communication.conflictStyle

  const synergies: string[] = []
  const frictionRisks: string[] = []

  let baseStability = 75
  let gottmanRatio = 5.0
  let pairingType = `${styleA.replace('_', ' ')} × ${styleB.replace('_', ' ')}`

  // 1. Conflict Style Synergy & Friction Rules
  if (styleA === styleB) {
    baseStability += 15
    gottmanRatio += 0.8
    synergies.push(`Matched conflict resolution style (${styleA.replace('_', ' ')})`)
  } else if (
    (styleA === 'direct_immediate' && styleB === 'space_first') ||
    (styleA === 'space_first' && styleB === 'direct_immediate')
  ) {
    baseStability -= 20
    gottmanRatio -= 1.5
    frictionRisks.push('Immediate response demand vs Needing initial space for de-escalation')
  } else if (styleA === 'reflective_deliberate' || styleB === 'reflective_deliberate') {
    baseStability += 10
    gottmanRatio += 0.5
    synergies.push('Includes reflective & deliberate conflict processing capacity')
  } else if (styleA === 'diplomatic' || styleB === 'diplomatic') {
    baseStability += 8
    synergies.push('Diplomatic communication dampens reactive escalation')
  }

  // 2. Sensory & Neurotype Calibrations
  const neuroA = userA.communication.neurotype || []
  const neuroB = userB.communication.neurotype || []
  const sensoryCalmA = userA.accessibility.sensoryCalmRequired
  const sensoryCalmB = userB.accessibility.sensoryCalmRequired

  if (sensoryCalmA && sensoryCalmB) {
    baseStability += 5
    synergies.push('Mutual requirement for low-sensory, calm environments during repair')
  }

  const sharedNeurotypes = neuroA.filter((n) => neuroB.includes(n))
  if (sharedNeurotypes.length > 0) {
    baseStability += 5
    synergies.push(`Shared cognitive communication framing (${sharedNeurotypes.join(', ')})`)
  }

  const finalStability = Math.max(20, Math.min(100, Math.round(baseStability)))
  const finalRatio = Math.max(1.0, Math.min(8.0, Math.round(gottmanRatio * 10) / 10))

  let repairRating: GottmanDyadAnalysis['repairCapacityRating'] = 'MODERATE'
  if (finalStability >= 85) repairRating = 'EXCELLENT'
  else if (finalStability >= 70) repairRating = 'HIGH'
  else if (finalStability < 60) repairRating = 'NEEDS_PACE_AGREEMENT'

  let recommendedPact = 'Standard reflective check-in protocol after 20-minute pause.'
  if (frictionRisks.length > 0) {
    recommendedPact = 'Explicit Pacing Agreement: Allow 30-minute cooling window before direct discussion.'
  }

  return {
    conflictPairingType: pairingType,
    stabilityQuotient: finalStability,
    repairCapacityRating: repairRating,
    gottmanRatioScore: finalRatio,
    synergies,
    frictionRisks,
    recommendedDeescalationPact: recommendedPact,
  }
}
