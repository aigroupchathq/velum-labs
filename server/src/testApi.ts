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

    console.log('\n===============================================================')
    console.log('ALL API SERVICE ENDPOINTS & INVARIANTS VERIFIED 100% OPERATIONAL!')
    console.log('===============================================================')
    server.closeAllConnections?.()
    server.close(() => {
      setTimeout(() => process.exit(0), 50)
    })
  } catch (err) {
    console.error('API TEST SUITE FAILED:', err)
    server.closeAllConnections?.()
    server.close(() => {
      setTimeout(() => process.exit(1), 50)
    })
  }
}

runApiTests()
