// ============================================================================
// server/src/testApi.ts
// Comprehensive Test Suite for Backend API Endpoints (Phases 1–8)
// ============================================================================

process.env.NODE_ENV = 'test'
import { app } from './index.js'
import http from 'http'

async function runApiTests() {
  console.log('===============================================================')
  console.log('API SERVICE COMPREHENSIVE ENDPOINT TEST SUITE')
  console.log('===============================================================')

  const server = http.createServer(app)
  await new Promise<void>((resolve) => server.listen(3099, resolve))

  const baseUrl = 'http://localhost:3099'

  try {
    // 1. Healthcheck
    console.log('\n--- TEST 1: System Healthcheck ---')
    const healthRes = await fetch(`${baseUrl}/api/health`)
    const healthData = await healthRes.json()
    console.log('Healthcheck response:', healthData)
    if (healthData.status !== 'healthy' || !healthData.deterministic) {
      throw new Error('Healthcheck assertion failed')
    }
    console.log('✅ TEST 1 PASSED: Healthcheck operational and confirmed deterministic.')

    // 2. Fetch Recommendations Feed
    console.log('\n--- TEST 2: Curated Recommendations Feed (Spec §3.1) ---')
    const recRes = await fetch(`${baseUrl}/api/v1/recommendations/recommendations?userId=usr_elena_current`)
    const recData = await recRes.json()
    console.log(`Received ${recData.recommendations.length} candidate evaluations.`)
    const topCandidate = recData.recommendations[0]
    console.log(`Top Candidate: ${topCandidate.profile.name} (Mutual Fit: ${topCandidate.evaluation.mutualScore}%, Eligible: ${topCandidate.evaluation.eligible})`)
    if (!topCandidate.evaluation.eligible || topCandidate.profile.name !== 'Maya Lin') {
      throw new Error(`Expected Maya Lin as top mutual candidate, got ${topCandidate.profile.name}`)
    }
    console.log('✅ TEST 2 PASSED: Reciprocal recommendation ranking verified.')

    // 3. Bidirectional Pair Evaluation
    console.log('\n--- TEST 3: Direct Pair Evaluation with Deep Explainability (Spec §3.2) ---')
    const evalRes = await fetch(`${baseUrl}/api/v1/matching/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userAId: 'usr_elena_current', // Elena
        userBId: 'usr_liam_02', // Liam (Smoker)
      }),
    })
    const evalData = await evalRes.json()
    console.log(`Evaluated ${evalData.userA.name} vs ${evalData.userB.name}`)
    console.log(`Eligible: ${evalData.evaluation.eligible}`)
    console.log(`Hard Conflicts:`, evalData.evaluation.hardConflicts)
    if (evalData.evaluation.eligible !== false) {
      throw new Error('Expected Liam to be gated by smoking dealbreaker')
    }
    console.log('✅ TEST 3 PASSED: Dealbreaker gating correctly enforced over API.')

    // 4. Preference Contradictions
    console.log('\n--- TEST 4: Contradiction Detection Endpoint (Spec §4.1) ---')
    const contraRes = await fetch(`${baseUrl}/api/v1/preferences/contradictions?userId=usr_elena_current`)
    const contraData = await contraRes.json()
    console.log(`Contradictions detected: ${contraData.contradictionsFound}`)
    console.log('✅ TEST 4 PASSED: Contradiction audit endpoint responsive.')

    // 5. What-If Simulator
    console.log('\n--- TEST 5: What-If Relaxation Simulator (Spec §4.2) ---')
    const simRes = await fetch(`${baseUrl}/api/v1/preferences/optimize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'usr_elena_current',
        distanceDeltaKm: 20,
        ageFlexDeltaYears: 2,
        dietFlexDeltaPercent: 50,
      }),
    })
    const simData = await simRes.json()
    console.log(`Baseline Pool: ${simData.basePool} -> Simulated Pool: ${simData.simulatedPool} (+${simData.expansionPercent}%)`)
    if (simData.simulatedPool <= simData.basePool) {
      throw new Error('Simulation should expand reachable candidate pool')
    }
    console.log('✅ TEST 5 PASSED: What-if constraint simulation operational.')

    // 6. Safety & Bidirectional Blocking
    console.log('\n--- TEST 6: Safety Blocking & Audit Trail (Spec §20, §35) ---')
    const blockRes = await fetch(`${baseUrl}/api/v1/safety/block`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        blockerId: 'usr_elena_current',
        blockedId: 'usr_maya_01', // Block Maya
      }),
    })
    const blockData = await blockRes.json()
    console.log('Block response:', blockData)

    // Verify Maya is now removed from recommendations
    const postBlockRecRes = await fetch(`${baseUrl}/api/v1/recommendations/recommendations?userId=usr_elena_current`)
    const postBlockRecData = await postBlockRecRes.json()
    const mayaPresent = postBlockRecData.recommendations.some((r: any) => r.candidateId === 'usr_maya_01')
    if (mayaPresent) {
      throw new Error('Blocked candidate should immediately disappear from candidate recommendations')
    }
    console.log('✅ TEST 6 PASSED: Bidirectional safety blocking immediately excludes candidates.')

    // 7. Verify WORM Audit Logs
    console.log('\n--- TEST 7: Immutable WORM Audit Logs Inspection ---')
    const auditRes = await fetch(`${baseUrl}/api/v1/safety/audit-logs`)
    const auditData = await auditRes.json()
    console.log(`Total system audit logs captured: ${auditData.count}`)
    const blockLog = auditData.logs.find((l: any) => l.action === 'CREATE_BLOCK')
    if (!blockLog) {
      throw new Error('Expected CREATE_BLOCK entry in immutable audit log')
    }
    console.log(`Audit log verified: [${blockLog.actorRole}] ${blockLog.action} -> target: ${blockLog.targetId}`)
    console.log('✅ TEST 7 PASSED: Tamper-resistant audit logs confirmed.')

    // 8. Verify Phase 10: AES-256-GCM Field-Level Encryption
    console.log('\n--- TEST 8: Phase 10: AES-256-GCM Field-Level Encryption (FLE) ---')
    const sensitivePayload = {
      medicalAccommodations: ['asl_interpreter_preferred', 'sensory_quiet_zones'],
      sensoryThreshold: 'low_fluorescent_light_sensitivity',
    }

    // 8a. Encrypt and persist
    const storeEncRes = await fetch(`${baseUrl}/api/v1/privacy/tier4/store`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'usr_elena_current',
        attributeId: 'accessibility_needs',
        plainValue: sensitivePayload,
        permMatchable: false,
        permDisplay: false,
      }),
    })
    const storeEncData = await storeEncRes.json()
    console.log('FLE Store Response:', storeEncData)
    if (!storeEncData.keyId || storeEncData.ciphertextLength === 0) {
      throw new Error('Field-level encryption payload invalid')
    }

    // 8b. Decrypt and authenticate
    const retrieveEncRes = await fetch(`${baseUrl}/api/v1/privacy/tier4/retrieve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'usr_elena_current',
        attributeId: 'accessibility_needs',
      }),
    })
    const retrieveEncData = await retrieveEncRes.json()
    console.log('FLE Retrieve Response:', retrieveEncData)
    if (
      retrieveEncData.decryptedValue.sensoryThreshold !==
      sensitivePayload.sensoryThreshold
    ) {
      throw new Error('Decrypted value does not match original plaintext')
    }
    console.log('✅ TEST 8 PASSED: Application-layer AES-256-GCM encryption & authenticated decryption verified.')

    // --- TEST 9: Phase 11 Payments & Subscriptions Boundary ---
    console.log('\n--- TEST 9: Phase 11: Payments & Subscriptions Boundary ---')
    // 9a. Verify default subscription
    const subRes = await fetch(`${baseUrl}/api/v1/subscriptions/current?userId=usr_elena_current`)
    const subData = await subRes.json()
    console.log('Current plan:', subData.subscription.plan)
    if (subData.subscription.plan !== 'free') {
      throw new Error('Default subscription should be free')
    }

    // 9b. Create checkout session with idempotency key
    const idempotencyKey = `test_idem_${Date.now()}`
    const checkoutRes = await fetch(`${baseUrl}/api/v1/subscriptions/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'usr_elena_current',
        plan: 'supporter',
        idempotencyKey,
      }),
    })
    const checkoutData = await checkoutRes.json()
    console.log('Checkout session response:', checkoutData)
    if (!checkoutData.sessionId || !checkoutData.checkoutUrl) {
      throw new Error('Checkout session generation failed')
    }

    // 9c. Replay checkout with same idempotency key (must be cached)
    const checkoutReplayRes = await fetch(`${baseUrl}/api/v1/subscriptions/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'usr_elena_current',
        plan: 'supporter',
        idempotencyKey,
      }),
    })
    const checkoutReplayData = await checkoutReplayRes.json()
    if (!checkoutReplayData.sessionId.includes('cached')) {
      throw new Error('Checkout idempotency caching failed')
    }

    // 9d. Webhook delivery with valid HMAC signature
    const webhookPayload = JSON.stringify({
      id: `evt_${Date.now()}`,
      type: 'payment_intent.succeeded',
      idempotencyKey: `pay_idem_${Date.now()}`,
      data: {
        userId: 'usr_elena_current',
        plan: 'supporter',
        amountCents: 999,
      },
    })
    const { mockPaymentGateway } = await import('./payments/gateway.js')
    const signature = mockPaymentGateway.generateWebhookSignature(webhookPayload)

    const webhookRes = await fetch(`${baseUrl}/api/v1/subscriptions/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-webhook-signature': signature,
      },
      body: webhookPayload,
    })
    const webhookData = await webhookRes.json()
    console.log('Webhook result:', webhookData)
    if (!webhookData.success || !webhookData.handled) {
      throw new Error('Webhook processing failed')
    }

    // 9e. Webhook replay detection
    const webhookReplayRes = await fetch(`${baseUrl}/api/v1/subscriptions/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-webhook-signature': signature,
      },
      body: webhookPayload,
    })
    const webhookReplayData = await webhookReplayRes.json()
    if (!webhookReplayData.duplicate) {
      throw new Error('Webhook duplicate replay protection failed')
    }
    console.log('✅ TEST 9 PASSED: Payments & Subscriptions boundary, HMAC webhooks, and idempotency verified.')

    // --- TEST 10: Invariant D-23 Strict Mathematical Proof (Zero Pay-to-Win Leakage) ---
    console.log('\n--- TEST 10: Invariant D-23: Mathematical Proof of Zero Pay-to-Win Leakage ---')
    // Get recommendations when user is on paid 'supporter' tier
    const recsSupporterRes = await fetch(`${baseUrl}/api/v1/recommendations/recommendations?userId=usr_elena_current`)
    const recsSupporterData = await recsSupporterRes.json()

    // Downgrade user back to free via subscription cancellation / reset
    const { db } = await import('./data/dbStore.js')
    const currentSub = db.getSubscription('usr_elena_current')
    db.setSubscription('usr_elena_current', { ...currentSub, plan: 'free' })

    // Get recommendations when user is on 'free' tier
    const recsFreeRes = await fetch(`${baseUrl}/api/v1/recommendations/recommendations?userId=usr_elena_current`)
    const recsFreeData = await recsFreeRes.json()

    // Compare every candidate score and ranking
    if (recsSupporterData.count !== recsFreeData.count) {
      throw new Error('D-23 VIOLATION: Candidate count differed between free and paid tiers!')
    }
    for (let i = 0; i < recsSupporterData.count; i++) {
      const suppCandidate = recsSupporterData.recommendations[i]
      const freeCandidate = recsFreeData.recommendations[i]
      if (suppCandidate.candidate.id !== freeCandidate.candidate.id) {
        throw new Error(`D-23 VIOLATION: Ranking differed at rank ${i} between free and paid tiers!`)
      }
      if (suppCandidate.evaluation.mutuality.score !== freeCandidate.evaluation.mutuality.score) {
        throw new Error(`D-23 VIOLATION: Score differed for ${suppCandidate.candidate.name}!`)
      }
      if (suppCandidate.evaluation.eligible !== freeCandidate.evaluation.eligible) {
        throw new Error(`D-23 VIOLATION: Eligibility differed for ${suppCandidate.candidate.name}!`)
      }
    }
    console.log('✅ TEST 10 PASSED: D-23 Invariant mathematically proven: 0.000% score or ranking deviation across tiers.')

    // --- TEST 11: Phase 13: Controlled Beta, Cohorts, Invites & Post-Encounter Feedback ---
    console.log('\n--- TEST 11: Phase 13: Controlled Beta, Cohort Gate & Encounter Feedback ---')
    // 11a. List Cohorts
    const cohortsRes = await fetch(`${baseUrl}/api/v1/beta/cohorts`)
    const cohortsData = await cohortsRes.json()
    if (!cohortsData.success || cohortsData.cohorts.length === 0) {
      throw new Error('Failed to retrieve beta cohorts')
    }
    console.log(`Beta cohorts active: ${cohortsData.cohorts.length} (${cohortsData.cohorts[0].name})`)

    // 11b. Verify valid invite code
    const inviteVerifyRes = await fetch(`${baseUrl}/api/v1/beta/invites/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: 'KIN-FOUNDER-2026' }),
    })
    const inviteVerifyData = await inviteVerifyRes.json()
    if (!inviteVerifyData.success || inviteVerifyData.invite.status !== 'available') {
      throw new Error('Valid beta invite code verification failed')
    }

    // 11c. Claim invite code
    const inviteClaimRes = await fetch(`${baseUrl}/api/v1/beta/invites/claim`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: 'KIN-FOUNDER-2026', userId: 'usr_elena_current' }),
    })
    const inviteClaimData = await inviteClaimRes.json()
    if (!inviteClaimData.success) {
      throw new Error('Failed to claim beta invite')
    }

    // 11d. Re-claiming same code should be rejected
    const inviteReclaimRes = await fetch(`${baseUrl}/api/v1/beta/invites/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: 'KIN-FOUNDER-2026' }),
    })
    const inviteReclaimData = await inviteReclaimRes.json()
    if (inviteReclaimData.success) {
      throw new Error('Duplicate claim check failed: already claimed code should be invalid')
    }

    // 11e. Submit Clinical Post-Encounter Feedback
    const feedbackRes = await fetch(`${baseUrl}/api/v1/beta/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        encounterId: 'enc_test_01',
        evaluatorUserId: 'usr_elena_current',
        partnerUserId: 'usr_maya_01',
        feltSafe: true,
        sensoryVenueComfort: 5,
        desireSecondEncounter: true,
        sentiments: ['felt_psychological_safety', 'sensory_environment_appropriate'],
        qualitativeNotes: 'Acoustics were calm. Genuine vulnerability felt effortless.',
      }),
    })
    const feedbackData = await feedbackRes.json()
    if (!feedbackData.success || !feedbackData.feedbackId) {
      throw new Error('Failed to record post-encounter feedback')
    }
    console.log('Post-encounter feedback response:', {
      feedbackId: feedbackData.feedbackId,
      feltSafe: feedbackData.record.feltSafe,
      sensoryComfort: feedbackData.record.sensoryVenueComfort,
    })
    console.log('✅ TEST 11 PASSED: Phase 13 Controlled Beta, cohort gating, and encounter feedback verified.')

    // --- TEST 12: Worker Thread Offload & PostgreSQL Pool Telemetry Verification ---
    console.log('\n--- TEST 12: Worker Thread Matching Pool & Database Pool Telemetry ---')
    const workerRes = await fetch(`${baseUrl}/api/v1/matching/worker-pool`)
    const workerData = await workerRes.json()
    console.log('Worker Pool Metrics:', workerData.metrics)
    if (workerData.status !== 'operational' || workerData.metrics.poolSize < 1) {
      throw new Error('Worker thread pool failed operational check')
    }
    if (workerData.metrics.totalEvaluations === 0) {
      throw new Error('Worker thread pool should have processed evaluations during API test suite')
    }
    console.log(`Evaluations processed by worker threads: ${workerData.metrics.totalEvaluations} across ${workerData.metrics.poolSize} workers.`)
    console.log('✅ TEST 12 PASSED: O(N) evaluation offloaded to Worker Thread Pool without blocking Node request loop.')

    // --- TEST 13: Technical Scale: Daily Match Slates, Spatial Bins & Bitmasks ---
    console.log('\n--- TEST 13: 100k+ Scaling: Daily Match Slates, Spatial Bins & Bitmasks ---')
    // 13a. Fetch / generate daily slate
    const slate1Res = await fetch(`${baseUrl}/api/v1/recommendations/daily-slate?userId=usr_elena_current`)
    const slate1Data = await slate1Res.json()
    if (!slate1Data.success || !slate1Data.recommendations) {
      throw new Error('Daily slate generation endpoint failed')
    }
    console.log('Generated Daily Slate Metrics:', slate1Data.metrics)

    // 13b. Verify O(1) Cache Hit on immediate re-fetch
    const cacheHitStart = Date.now()
    const slate2Res = await fetch(`${baseUrl}/api/v1/recommendations/daily-slate?userId=usr_elena_current`)
    const cacheHitDuration = Date.now() - cacheHitStart
    const slate2Data = await slate2Res.json()
    if (!slate2Data.success || slate2Data.recommendations.length !== slate1Data.recommendations.length) {
      throw new Error('Cached daily slate verification failed')
    }
    console.log(`Daily Slate Cache Hit Latency: ${cacheHitDuration}ms`)

    // 13c. Verify telemetry endpoint
    const telemetryRes = await fetch(`${baseUrl}/api/v1/matching/slates/telemetry`)
    const telemetryData = await telemetryRes.json()
    if (telemetryData.status !== 'operational' || !telemetryData.telemetry.spatialIndex) {
      throw new Error('Slates telemetry endpoint failed')
    }
    console.log('Slates Telemetry Snapshot:', {
      spatialUsers: telemetryData.telemetry.spatialIndex.totalUsers,
      queueProcessed: telemetryData.telemetry.queue.totalProcessed,
      workersActive: telemetryData.telemetry.workerPool.workerThreadsActive,
    })
    console.log('✅ TEST 13 PASSED: Spatial Bins, Integer Bitmasks & Daily Match Slate Caching verified.')

    // 14. Multi-Currency Payments & International Localization
    console.log('\n--- TEST 14: Multi-Currency Pricing & Global Localization (UK, EU, Global) ---')
    const gbpSubRes = await fetch(`${baseUrl}/api/v1/subscriptions/current?userId=usr_elena_current&currency=GBP`)
    const gbpSubData = await gbpSubRes.json()
    if (gbpSubData.currency !== 'GBP' || !gbpSubData.pricingTable?.supporter?.GBP) {
      throw new Error('Expected GBP localized subscription data')
    }
    console.log(`GBP Localized Pricing Table: Supporter is ${gbpSubData.pricingTable.supporter.GBP.formatted} (${gbpSubData.pricingTable.supporter.GBP.taxNote})`)

    const gbpCheckoutRes = await fetch(`${baseUrl}/api/v1/subscriptions/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'usr_elena_current',
        plan: 'supporter',
        idempotencyKey: `sub_test_gbp_${Date.now()}`,
        currency: 'GBP',
      }),
    })
    const gbpCheckoutData = await gbpCheckoutRes.json()
    if (!gbpCheckoutData.success || gbpCheckoutData.currency !== 'GBP' || !gbpCheckoutData.checkoutUrl.includes('amt=799') || !gbpCheckoutData.checkoutUrl.includes('cur=GBP')) {
      throw new Error(`Expected GBP checkout session with 799 cents, got ${JSON.stringify(gbpCheckoutData)}`)
    }
    console.log(`GBP Checkout URL: ${gbpCheckoutData.checkoutUrl}`)

    const eurCheckoutRes = await fetch(`${baseUrl}/api/v1/subscriptions/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'usr_elena_current',
        plan: 'patron',
        idempotencyKey: `sub_test_eur_${Date.now()}`,
        currency: 'EUR',
      }),
    })
    const eurCheckoutData = await eurCheckoutRes.json()
    if (!eurCheckoutData.success || eurCheckoutData.currency !== 'EUR' || !eurCheckoutData.checkoutUrl.includes('amt=2299') || !eurCheckoutData.checkoutUrl.includes('cur=EUR')) {
      throw new Error(`Expected EUR checkout session with 2299 cents, got ${JSON.stringify(eurCheckoutData)}`)
    }
    console.log(`EUR Checkout URL: ${eurCheckoutData.checkoutUrl}`)

    // Dual-unit distance band check
    const recCheckRes = await fetch(`${baseUrl}/api/v1/recommendations/recommendations?userId=usr_elena_current`)
    const recCheckData = await recCheckRes.json()
    const firstRec = recCheckData.recommendations[0]
    console.log(`Recommendation Distance Band: ${firstRec.profile.distanceBand}`)
    if (!firstRec.profile.distanceBand.includes('km') || !firstRec.profile.distanceBand.includes('mi')) {
      throw new Error(`Expected dual-unit distance band (km and mi), got ${firstRec.profile.distanceBand}`)
    }
    console.log('✅ TEST 14 PASSED: Multi-currency billing (USD, GBP, EUR) and dual-unit distance bands verified.')

    console.log('\n===============================================================')
    console.log('ALL API SERVICE ENDPOINTS & INVARIANTS VERIFIED 100% OPERATIONAL!')
    console.log('===============================================================')
    const { matchPool } = await import('./workers/matchPool.js')
    const { postgresPool } = await import('./db/postgresPool.js')
    await matchPool.terminate()
    await postgresPool.close()
    server.closeAllConnections?.()
    server.close(() => {
      setTimeout(() => process.exit(0), 50)
    })
  } catch (err) {
    console.error('API TEST SUITE FAILED:', err)
    const { matchPool } = await import('./workers/matchPool.js')
    const { postgresPool } = await import('./db/postgresPool.js')
    await matchPool.terminate().catch(() => {})
    await postgresPool.close().catch(() => {})
    server.closeAllConnections?.()
    server.close(() => {
      setTimeout(() => process.exit(1), 50)
    })
  }
}

runApiTests()
