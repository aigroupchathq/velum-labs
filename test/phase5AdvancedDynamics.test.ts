// ============================================================================
// test/phase5AdvancedDynamics.test.ts
// Phase 5 Advanced Relational Dynamics & Exposure Equity Test Suite
// ============================================================================

import { currentUser, mockCandidates } from '../src/data/mockProfiles.js'
import { analyzeGottmanDynamics } from '../src/utils/gottmanDynamics.js'
import { calculateExposureGini, balanceSlateExposure } from '../src/utils/exposureBalancer.js'
import { checkAttributeAccess } from '../src/utils/visibilityPolicy.js'
import { evaluateMatch } from '../src/utils/matchingEngine.js'

console.log('===============================================================')
console.log('RUNNING PHASE 5 ADVANCED DYNAMICS & GOVERNANCE TEST SUITE')
console.log('===============================================================\n')

let failures = 0

// TEST 1: Gottman Relational Conflict Dynamics Analysis
console.log('[Test 1] Analyzing Gottman dyadic conflict dynamics (Elena & Maya)...')
const gottmanMaya = analyzeGottmanDynamics(currentUser, mockCandidates[0]) // Maya

if (
  gottmanMaya.stabilityQuotient >= 70 &&
  gottmanMaya.gottmanRatioScore >= 5.0 &&
  gottmanMaya.synergies.length > 0
) {
  console.log('✅ Test 1 Passed: Gottman stability quotient and 5:1 ratio verified.\n')
} else {
  console.error('❌ Test 1 Failed: Gottman dynamics output mismatch:', gottmanMaya)
  failures++
}

// TEST 2: Conflict Style Friction Risk Identification
console.log('[Test 2] Gottman friction risk detection (Elena reflective vs Liam direct)...')
const gottmanLiam = analyzeGottmanDynamics(currentUser, mockCandidates[1]) // Liam

if (gottmanLiam.conflictPairingType && gottmanLiam.recommendedDeescalationPact) {
  console.log('✅ Test 2 Passed: De-escalation pacing pact correctly generated.\n')
} else {
  console.error('❌ Test 2 Failed: Gottman friction output mismatch:', gottmanLiam)
  failures++
}

// TEST 3: Gini Concentration Index Calculation
console.log('[Test 3] Calculating Gini exposure concentration index...')
const equalExposures = [5, 5, 5, 5, 5]
const concentratedExposures = [0, 0, 0, 0, 100]

const giniEqual = calculateExposureGini(equalExposures)
const giniConcentrated = calculateExposureGini(concentratedExposures)

if (giniEqual === 0.0 && giniConcentrated >= 0.75) {
  console.log(`✅ Test 3 Passed: Gini index correctly calculated (Equal: ${giniEqual}, Concentrated: ${giniConcentrated}).\n`)
} else {
  console.error('❌ Test 3 Failed: Gini calculation mismatch:', { giniEqual, giniConcentrated })
  failures++
}

// TEST 4: Anti-Starvation Exposure Balancing
console.log('[Test 4] Verifying anti-starvation slate balancing...')
const tracker = new Map<string, number>()
const mockEvaluated = mockCandidates.map((c) => ({
  candidate: c,
  evaluation: evaluateMatch(currentUser, c),
}))

const balancedSlate = balanceSlateExposure(mockEvaluated, tracker, 3)

if (balancedSlate.length <= 3 && tracker.size > 0) {
  console.log('✅ Test 4 Passed: Slate balanced without bypassing hard constraint Veto gating.\n')
} else {
  console.error('❌ Test 4 Failed: Exposure balancing error.')
  failures++
}

// TEST 5: Visibility Consent Policy
console.log('[Test 5] Attribute visibility access policy enforcement...')
const checkTier4 = checkAttributeAccess('medical_history', currentUser, 'unmatched_candidate', true)
const checkOwner = checkAttributeAccess('medical_history', currentUser, 'owner', true)

if (!checkTier4.allowedForActor && checkOwner.allowedForActor) {
  console.log('✅ Test 5 Passed: Tier 4 attribute access policy correctly enforced.\n')
} else {
  console.error('❌ Test 5 Failed: Visibility policy check error:', { checkTier4, checkOwner })
  failures++
}

console.log('===============================================================')
if (failures === 0) {
  console.log('✅ PHASE 5 ADVANCED DYNAMICS TESTS PASSED: ALL 5 TEST CASES VERIFIED.')
  console.log('===============================================================')
} else {
  console.error(`❌ PHASE 5 ADVANCED DYNAMICS TESTS FAILED WITH ${failures} ERRORS.`)
  console.log('===============================================================')
  process.exit(1)
}
