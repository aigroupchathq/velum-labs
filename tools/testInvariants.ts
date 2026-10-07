// ============================================================================
// tools/testInvariants.ts
// Apple Zero-Tolerance Invariant Assertions Test Harness
// "Treat any invariant failure like a Kernel Panic: an automatic build breaker."
// ============================================================================

import { generateSyntheticPopulation } from './syntheticPopulation.js'
import { evaluateMatch } from '../src/utils/matchingEngine.js'
import { db } from '../server/src/data/dbStore.js'
import { fieldEncryptionService } from '../server/src/security/encryption.js'
import { processCandidateBatch } from '../server/src/workers/matchWorker.js'

function triggerAppleKernelPanic(code: string, message: string): never {
  console.error(`\n🚨 ===============================================================`)
  console.error(`APPLE KERNEL PANIC: ZERO-TOLERANCE INVARIANT VIOLATION`)
  console.error(`INVARIANT: [${code}]`)
  console.error(`FAILURE: ${message}`)
  console.error(`===============================================================\n`)
  throw new Error(`[APPLE KERNEL PANIC] Invariant ${code} violated: ${message}`)
}

export async function runInvariantTests(): Promise<void> {
  console.log('===============================================================')
  console.log('APPLE ZERO-TOLERANCE INVARIANT-DRIVEN AUDIT')
  console.log('===============================================================')

  // --------------------------------------------------------------------------
  // 1. INVARIANT D-14: ZERO HARD CONFLICT DEALBREAKER VIOLATIONS (0.000% TOLERANCE)
  // --------------------------------------------------------------------------
  console.log('\n[1/5] Auditing Invariant D-14: Hard Conflict Dealbreaker Integrity...')
  const popD14 = generateSyntheticPopulation({ count: 200, seed: 999 })
  let checkedPairs = 0
  let d14Violations = 0

  for (let i = 0; i < 40; i++) {
    for (let j = 0; j < 40; j++) {
      if (i === j) continue
      const res = evaluateMatch(popD14[i], popD14[j])
      checkedPairs++

      if (res.eligible && res.hardConflicts.length > 0) {
        d14Violations++
      }
      if (!res.eligible && res.hardConflicts.length === 0) {
        d14Violations++
      }
    }
  }

  if (d14Violations > 0) {
    triggerAppleKernelPanic(
      'D-14',
      `Found ${d14Violations} dealbreaker violations across ${checkedPairs} pairs. Hard conflict rate must be 0.000%.`
    )
  }
  console.log(`  ✅ Invariant D-14 Verified: 0.000% violations across ${checkedPairs.toLocaleString()} audited candidate pairs.`)

  // --------------------------------------------------------------------------
  // 2. INVARIANT D-23: ZERO PAY-TO-WIN LEAKAGE (0.000% TOLERANCE)
  // --------------------------------------------------------------------------
  console.log('\n[2/5] Auditing Invariant D-23: Pay-to-Win Algorithmic Isolation...')
  const testUser = popD14[0]
  const candidatePool = popD14.slice(1, 30)

  // Subscriptions isolation check
  db.setSubscription(testUser.id, { plan: 'free', status: 'active' })
  const freeBatch = processCandidateBatch(testUser, candidatePool)

  db.setSubscription(testUser.id, { plan: 'supporter', status: 'active' })
  const paidBatch = processCandidateBatch(testUser, candidatePool)

  if (freeBatch.length !== paidBatch.length) {
    triggerAppleKernelPanic('D-23', 'Candidate slate count differed between Free and Supporter tiers.')
  }

  for (let i = 0; i < freeBatch.length; i++) {
    const f = freeBatch[i]
    const p = paidBatch[i]

    if (f.candidateId !== p.candidateId) {
      triggerAppleKernelPanic('D-23', `Rank position altered at index ${i} between free and supporter tier.`)
    }
    if (f.evaluation.mutualScore !== p.evaluation.mutualScore) {
      triggerAppleKernelPanic('D-23', `Mutual score deviated for ${f.candidate.name} (${f.evaluation.mutualScore} vs ${p.evaluation.mutualScore}).`)
    }
    if (f.evaluation.eligible !== p.evaluation.eligible) {
      triggerAppleKernelPanic('D-23', `Eligibility altered for ${f.candidate.name} across tiers.`)
    }
  }
  console.log(`  ✅ Invariant D-23 Verified: 0.000% score or rank deviation between Free and Supporter monetization tiers.`)

  // --------------------------------------------------------------------------
  // 3. INVARIANT S-01: BIDIRECTIONAL SAFETY QUARANTINE
  // --------------------------------------------------------------------------
  console.log('\n[3/5] Auditing Invariant S-01: Bidirectional Safety Block Quarantine...')
  const aliceId = 'usr_alice_sim_01'
  const bobId = 'usr_bob_sim_02'

  db.addBlock(aliceId, bobId)
  if (!db.isBlocked(aliceId, bobId) || !db.isBlocked(bobId, aliceId)) {
    triggerAppleKernelPanic('S-01', 'Block failed bidirectional symmetry check.')
  }

  // Self-block prevention invariant
  const selfBlockSuccess = db.addBlock(aliceId, aliceId)
  if (selfBlockSuccess) {
    triggerAppleKernelPanic('S-01', 'System permitted anti-pattern self-block.')
  }
  console.log(`  ✅ Invariant S-01 Verified: Safety blocks strictly symmetric, anti-self-block enforced.`)

  // --------------------------------------------------------------------------
  // 4. INVARIANT P-02: ANTI-TRILATERATION DISTANCE PRECISION GATE
  // --------------------------------------------------------------------------
  console.log('\n[4/5] Auditing Invariant P-02: Anti-Trilateration Privacy Gate...')
  const sampleRecommendations = processCandidateBatch(popD14[1], popD14.slice(2, 20))

  sampleRecommendations.forEach((rec) => {
    const profile = rec.profile as any
    if (profile.latitude !== undefined || profile.longitude !== undefined || profile.coordinates !== undefined) {
      triggerAppleKernelPanic('P-02', `Candidate ${rec.candidateId} leaked raw GPS coordinates over recommendation wire!`)
    }
    if (typeof profile.distanceKm === 'number') {
      triggerAppleKernelPanic('P-02', `Candidate ${rec.candidateId} leaked raw uncoarsened distance float!`)
    }
    const validBands = [
      'Local (< 10 km)', 'Metro (10–25 km)', 'Regional (25–50 km)', 'Over 50 km',
      'Local (< 10 km / ~6 mi)', 'Metro (10–25 km / 6–15 mi)', 'Regional (25–50 km / 15–30 mi)', 'Over 50 km / 30+ mi',
    ]
    if (!profile.distanceBand || !validBands.includes(profile.distanceBand)) {
      triggerAppleKernelPanic('P-02', `Invalid or missing coarse distance band: ${profile.distanceBand}`)
    }
  })
  console.log(`  ✅ Invariant P-02 Verified: 100% of candidate recommendations guarded by coarse distance bands.`)

  // --------------------------------------------------------------------------
  // 5. INVARIANT FLE-03: FIELD-LEVEL ENCRYPTION AUTHENTICITY
  // --------------------------------------------------------------------------
  console.log('\n[5/5] Auditing Invariant FLE-03: AES-256-GCM Authenticated Encryption...')
  const secretData = { sensoryAccommodations: ['dim_lights', 'low_noise'], condition: 'sensory_processing' }
  const encrypted = fieldEncryptionService.encrypt(secretData)

  // Verify authentic decryption
  const decrypted = fieldEncryptionService.decrypt(encrypted)
  if (JSON.stringify(decrypted) !== JSON.stringify(secretData)) {
    triggerAppleKernelPanic('FLE-03', 'Decrypted payload did not match plaintext source.')
  }

  // Tamper with ciphertext by altering a single hex byte
  const tamperedCipher = encrypted.ciphertext.slice(0, -2) + (encrypted.ciphertext.endsWith('0') ? '1' : '0')
  const tamperedPayload = { ...encrypted, ciphertext: tamperedCipher }

  let caughtTampering = false
  try {
    fieldEncryptionService.decrypt(tamperedPayload)
  } catch {
    caughtTampering = true
  }

  if (!caughtTampering) {
    triggerAppleKernelPanic('FLE-03', 'AES-256-GCM auth tag failed to reject tampered ciphertext payload!')
  }
  console.log(`  ✅ Invariant FLE-03 Verified: AES-256-GCM rejects tampered ciphertext with 100% cryptographic certainty.`)

  console.log('\n===============================================================')
  console.log('ALL 5 APPLE ZERO-TOLERANCE INVARIANTS CERTIFIED: 0 DEFECTS')
  console.log('===============================================================')
}

// Direct execution
if (process.argv[1]?.includes('testInvariants')) {
  runInvariantTests().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
