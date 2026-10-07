// ============================================================================
// test/verifyGoldenMaster.ts
// Golden Master Verification Test Suite (Gate 1 & Gate 6 Regression Lock)
// Asserts that matching engine behavior remains 100% identical before and after security changes.
// ============================================================================

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { evaluateMatch, detectUserContradictions } from '../src/utils/matchingEngine.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const fixturePath = path.resolve(__dirname, 'fixtures/goldenMasterFixtures.json')
if (!fs.existsSync(fixturePath)) {
  throw new Error(`Golden Master fixture file missing at ${fixturePath}. Run tools/generateGoldenMaster.ts first.`)
}

const goldenSnapshots = JSON.parse(fs.readFileSync(fixturePath, 'utf8'))

console.log('===============================================================')
console.log('RUNNING GOLDEN MASTER MATCHING BEHAVIOR REGRESSION TEST')
console.log('===============================================================\n')

let failures = 0

for (const snapshot of goldenSnapshots) {
  const userA = snapshot.userAProfile
  const userB = snapshot.userBProfile

  const currentResult = evaluateMatch(userA, userB)
  const currentContradictionsA = detectUserContradictions(userA)
  const currentContradictionsB = detectUserContradictions(userB)

  let fixtureFailed = false

  // 1. Eligibility Check
  if (currentResult.eligible !== snapshot.isEligible) {
    console.error(`❌ Eligibility Mismatch for ${snapshot.fixtureId}: Expected ${snapshot.isEligible}, got ${currentResult.eligible}`)
    failures++
    fixtureFailed = true
  }

  // 2. Harmonic Score Check
  if (currentResult.mutuality.score !== snapshot.harmonicScore) {
    console.error(`❌ Harmonic Score Mismatch for ${snapshot.fixtureId}: Expected ${snapshot.harmonicScore}, got ${currentResult.mutuality.score}`)
    failures++
    fixtureFailed = true
  }

  // 3. Directional Scores Check
  if (
    currentResult.compatibility.aToB !== snapshot.directionalScores.aToB ||
    currentResult.compatibility.bToA !== snapshot.directionalScores.bToA
  ) {
    console.error(`❌ Directional Score Mismatch for ${snapshot.fixtureId}: Expected A->B ${snapshot.directionalScores.aToB} / B->A ${snapshot.directionalScores.bToA}, got A->B ${currentResult.compatibility.aToB} / B->A ${currentResult.compatibility.bToA}`)
    failures++
    fixtureFailed = true
  }

  // 4. Asymmetric Flag Check
  if (currentResult.mutuality.asymmetric !== snapshot.asymmetric) {
    console.error(`❌ Asymmetric Flag Mismatch for ${snapshot.fixtureId}: Expected ${snapshot.asymmetric}, got ${currentResult.mutuality.asymmetric}`)
    failures++
    fixtureFailed = true
  }

  // 5. Confidence Check
  if (currentResult.confidence.score !== snapshot.confidence.score) {
    console.error(`❌ Confidence Score Mismatch for ${snapshot.fixtureId}: Expected ${snapshot.confidence.score}, got ${currentResult.confidence.score}`)
    failures++
    fixtureFailed = true
  }

  // 6. Facet Breakdown Check
  const currentFacets = {
    relationship: currentResult.relationshipAlignment.score,
    family: currentResult.familyAlignment.score,
    lifestyle: currentResult.lifestyleAlignment.score,
    values: currentResult.valueAlignment.score,
    attraction: currentResult.attraction.score,
    communication: currentResult.communicationAlignment.score,
    geography: currentResult.geographicFeasibility.score,
    temporal: currentResult.temporalFeasibility.score,
  }

  for (const [facetKey, expectedScore] of Object.entries(snapshot.facets)) {
    if (currentFacets[facetKey as keyof typeof currentFacets] !== expectedScore) {
      console.error(`❌ Facet Mismatch for ${snapshot.fixtureId} [${facetKey}]: Expected ${expectedScore}, got ${currentFacets[facetKey as keyof typeof currentFacets]}`)
      failures++
      fixtureFailed = true
    }
  }

  // 7. Contradictions Count Check
  if (
    currentContradictionsA.length !== snapshot.userAContradictionsCount ||
    currentContradictionsB.length !== snapshot.userBContradictionsCount
  ) {
    console.error(`❌ Contradictions Count Mismatch for ${snapshot.fixtureId}`)
    failures++
    fixtureFailed = true
  }

  if (!fixtureFailed) {
    console.log(`✅ Fixture [${snapshot.fixtureId}] verified 100% parity.`)
  }
}

console.log('\n===============================================================')
if (failures === 0) {
  console.log(`✅ GOLDEN MASTER REGRESSION TEST PASSED: ALL ${goldenSnapshots.length} FIXTURES VERIFIED WITH 100% PARITY.`)
  console.log('===============================================================')
} else {
  console.error(`❌ GOLDEN MASTER REGRESSION TEST FAILED WITH ${failures} MISMATCHES.`)
  console.log('===============================================================')
  process.exit(1)
}
