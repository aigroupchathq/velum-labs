// ============================================================================
// test/phase2DecoupledModel.test.ts
// Phase 2 Decoupled Data Model & Distance Coarsening Verification Test Suite
// ============================================================================

import { currentUser } from '../src/data/mockProfiles.js'
import { decoupleProfile, reconstituteProfile } from '../src/types/index.js'
import { coarsenDistanceKm, fuzzCoordinates } from '../src/utils/matchingEngine.js'

console.log('===============================================================')
console.log('RUNNING PHASE 2 DECOUPLED DATA MODEL & COARSENING TEST SUITE')
console.log('===============================================================\n')

let failures = 0

// TEST 1: Decouple Profile Y_i vs X_i
console.log('[Test 1] Decoupling UniversalUserProfile into Y_i (SelfSupply) and X_i (PartnerDemand)...')
const decoupled = decoupleProfile(currentUser)

if (
  decoupled.userId === 'usr_elena_current' &&
  decoupled.selfSupply.identity.name === 'Elena Rostova' &&
  decoupled.selfSupply.lifestyle.diet === 'vegetarian' && // Y_i self-supply trait
  decoupled.partnerDemand.preferences.smokingPreference.dealbreaker === true // X_i partner-demand criteria
) {
  console.log('✅ Test 1 Passed: Successfully decoupled profile into Y_i and X_i vectors.\n')
} else {
  console.error('❌ Test 1 Failed: Decoupled profile structure mismatch:', decoupled)
  failures++
}

// TEST 2: Reconstitute Profile Round Trip
console.log('[Test 2] Reconstituting DecoupledUserProfile back to UniversalUserProfile...')
const reconstituted = reconstituteProfile(decoupled)

if (JSON.stringify(reconstituted) === JSON.stringify(currentUser)) {
  console.log('✅ Test 2 Passed: 100% lossless round-trip reconstitution verified.\n')
} else {
  console.error('❌ Test 2 Failed: Reconstituted profile does not match original.')
  failures++
}

// TEST 3: Privacy Distance Coarsening Bands (Privacy P-02)
console.log('[Test 3] Verifying privacy distance coarsening bands...')
const band1 = coarsenDistanceKm(3.2)
const band2 = coarsenDistanceKm(12.5)
const band3 = coarsenDistanceKm(22.0)
const band4 = coarsenDistanceKm(42.0)
const band5 = coarsenDistanceKm(85.0)

if (
  band1 === '< 5 km' &&
  band2 === '5–15 km' &&
  band3 === '15–30 km' &&
  band4 === '30–50 km' &&
  band5 === '50+ km'
) {
  console.log('✅ Test 3 Passed: All distance coarsening privacy bands correctly classified.\n')
} else {
  console.error('❌ Test 3 Failed: Distance coarsening band mismatch:', { band1, band2, band3, band4, band5 })
  failures++
}

// TEST 4: Anti-Trilateration Coordinate Fuzzing
console.log('[Test 4] Verifying anti-trilateration coordinate fuzzing...')
const fuzzed = fuzzCoordinates(37.7749, -122.4194, 1.5)

if (
  typeof fuzzed.lat === 'number' &&
  typeof fuzzed.lng === 'number' &&
  (fuzzed.lat !== 37.7749 || fuzzed.lng !== -122.4194) &&
  Math.abs(fuzzed.lat - 37.7749) < 0.05
) {
  console.log('✅ Test 4 Passed: Coordinates successfully fuzzed within safe privacy radius.\n')
} else {
  console.error('❌ Test 4 Failed: Fuzzed coordinates out of expected range:', fuzzed)
  failures++
}

console.log('===============================================================')
if (failures === 0) {
  console.log('✅ PHASE 2 DATA MODEL TESTS PASSED: ALL 4 TEST CASES VERIFIED.')
  console.log('===============================================================')
} else {
  console.error(`❌ PHASE 2 DATA MODEL TESTS FAILED WITH ${failures} ERRORS.`)
  console.log('===============================================================')
  process.exit(1)
}
