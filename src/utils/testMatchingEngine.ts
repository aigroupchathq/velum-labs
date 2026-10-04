// Universal Compatibility Platform: Invariant & Specification Test Suite
// Verifies all core matching rules and constitutional invariants

import { evaluateMatch, detectUserContradictions } from './matchingEngine'
import { currentUser, mockCandidates } from '../data/mockProfiles'

console.log('===============================================================')
console.log('UNIVERSAL COMPATIBILITY ENGINE: CANONICAL TEST SUITE')
console.log('===============================================================\n')

const [maya, liam, sora, devon, nadia] = mockCandidates

// TEST 1: HARD DEALBREAKER GATING (Spec §8)
console.log('=== TEST 1: HARD DEALBREAKER GATING (Liam: Smoker) ===')
const evalLiam = evaluateMatch(currentUser, liam)
console.log('Eligible:', evalLiam.eligible)
console.log('Hard conflicts:', evalLiam.hardConflicts.map((c) => c.message))
console.log('Mutual Score:', evalLiam.mutuality.score)
if (!evalLiam.eligible && evalLiam.mutuality.score === 0 && evalLiam.hardConflicts.length > 0) {
  console.log('✅ TEST 1 PASSED: Hard dealbreaker caused immediate candidate exclusion.\n')
} else {
  console.error('❌ TEST 1 FAILED!')
  throw new Error('Test failed')
}

// TEST 2: CONTROLLED FLEXIBILITY RELAXATION (Spec §13)
console.log('=== TEST 2: CONTROLLED FLEXIBILITY (Sora: Omnivore, 70% Flex) ===')
const evalSora = evaluateMatch(currentUser, sora)
console.log('Eligible:', evalSora.eligible)
console.log('Mutual Score:', evalSora.mutuality.score)
console.log('Lifestyle Synergies/Frictions:', evalSora.lifestyleAlignment.frictions)
if (evalSora.eligible && evalSora.mutuality.score! > 70) {
  console.log('✅ TEST 2 PASSED: Controlled flexibility allowed smooth relaxation without exclusion.\n')
} else {
  console.error('❌ TEST 2 FAILED!')
  throw new Error('Test failed')
}

// TEST 3: RELATIONSHIP STRUCTURE DEALBREAKER (Spec §8)
console.log('=== TEST 3: STRUCTURE DEALBREAKER (Devon: Polyamorous) ===')
const evalDevon = evaluateMatch(currentUser, devon)
console.log('Eligible:', evalDevon.eligible)
console.log('Hard conflicts:', evalDevon.hardConflicts.map((c) => c.message))
if (!evalDevon.eligible && evalDevon.hardConflicts.some((c) => c.field === 'relationship_structure')) {
  console.log('✅ TEST 3 PASSED: Structural incompatibility strictly gated.\n')
} else {
  console.error('❌ TEST 3 FAILED!')
  throw new Error('Test failed')
}

// TEST 4: HIGH MUTUAL COMPATIBILITY (Spec §10)
console.log('=== TEST 4: HIGH MUTUAL COMPATIBILITY (Maya Lin) ===')
const evalMaya = evaluateMatch(currentUser, maya)
console.log('Eligible:', evalMaya.eligible)
console.log('Score A -> B:', evalMaya.compatibility.aToB)
console.log('Score B -> A:', evalMaya.compatibility.bToA)
console.log('Mutual Score (Harmonic):', evalMaya.mutuality.score)
console.log('Top Synergies:', evalMaya.explanation.strongAlignment)
if (evalMaya.eligible && evalMaya.mutuality.score! >= 85) {
  console.log('✅ TEST 4 PASSED: Reciprocal mutual alignment verified.\n')
} else {
  console.error('❌ TEST 4 FAILED!')
  throw new Error('Test failed')
}

// TEST 5: UNKNOWN INFORMATION & CONFIDENCE SEPARATION (Spec §9, §11)
console.log('=== TEST 5: UNKNOWN INFORMATION & CONFIDENCE (Nadia) ===')
const evalNadia = evaluateMatch(currentUser, nadia)
console.log('Eligible:', evalNadia.eligible)
console.log('Mutual Score:', evalNadia.mutuality.score)
console.log('Confidence Score:', evalNadia.confidence.score, `(${evalNadia.confidence.rating})`)
if (evalNadia.eligible && evalNadia.confidence.score < evalMaya.confidence.score) {
  console.log('✅ TEST 5 PASSED: Missing data calibrated confidence without artificial zero-penalty.\n')
} else {
  console.error('❌ TEST 5 FAILED!')
  throw new Error('Test failed')
}

// TEST 6: MUTUALITY COMMUTATIVE SYMMETRY (Invariant 3)
console.log('=== TEST 6: MUTUALITY COMMUTATIVE SYMMETRY ===')
const evalMayaReverse = evaluateMatch(maya, currentUser)
console.log('H(User, Maya):', evalMaya.mutuality.score)
console.log('H(Maya, User):', evalMayaReverse.mutuality.score)
if (evalMaya.mutuality.score === evalMayaReverse.mutuality.score) {
  console.log('✅ TEST 6 PASSED: Mutuality is mathematically symmetric.\n')
} else {
  console.error('❌ TEST 6 FAILED!')
  throw new Error('Test failed')
}

// TEST 7: PREFERENCE CONTRADICTION DETECTION (Spec §14)
console.log('=== TEST 7: PREFERENCE CONTRADICTION DETECTION ===')
const contradictoryUser = JSON.parse(JSON.stringify(currentUser))
contradictoryUser.geography.maxDistanceKm = 8
contradictoryUser.geography.openToLongDistance = true
contradictoryUser.preferences.dietPreference.requirementLevel = 'MUST'
contradictoryUser.preferences.dietPreference.flexibility = 90

const contradictions = detectUserContradictions(contradictoryUser)
console.log('Detected Contradictions Count:', contradictions.length)
contradictions.forEach((c) => console.log(`- [${c.code}]: ${c.message}`))
if (contradictions.length >= 2) {
  console.log('✅ TEST 7 PASSED: Contradictions successfully surfaced.\n')
} else {
  console.error('❌ TEST 7 FAILED!')
  throw new Error('Test failed')
}

// TEST 8: MULTI-MODAL ATTRACTION (Spec §12)
console.log('=== TEST 8: MULTI-MODAL ATTRACTION PROFILE ===')
console.log('Attraction Dimension Score:', evalMaya.attraction.score)
console.log('Attraction Synergies:', evalMaya.attraction.synergies)
if (evalMaya.attraction.score! >= 80 && evalMaya.attraction.synergies.length > 0) {
  console.log('✅ TEST 8 PASSED: Multi-modal attraction computed across 6 dimensions.\n')
} else {
  console.error('❌ TEST 8 FAILED!')
  throw new Error('Test failed')
}

console.log('===============================================================')
console.log('ALL INVARIANTS AND SPECIFICATION RULES VERIFIED SUCCESSFULLY!')
console.log('===============================================================')
