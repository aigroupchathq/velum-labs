// ============================================================================
// tools/simulateNetworkConditioner.ts
// Apple Network Link Conditioner Simulation Harness
// Simulates London Subway tunnel blackouts, lossy 3G packet drops & state restoration
// ============================================================================

import http from 'http'
import { app } from '../server/src/index.js'

export async function runNetworkConditionerTests(): Promise<void> {
  console.log('===============================================================')
  console.log('APPLE NETWORK LINK CONDITIONER SIMULATION')
  console.log('Testing Degraded Networks: Subway Blackouts & Lossy 3G Handover')
  console.log('===============================================================')

  const server = http.createServer(app)
  const port = 3088
  await new Promise<void>((resolve) => server.listen(port, resolve))
  const baseUrl = `http://localhost:${port}`

  try {
    // ------------------------------------------------------------------------
    // SCENARIO 1: LONDON SUBWAY TUNNEL COMPLETE BLACKOUT (100% PACKET DROP)
    // ------------------------------------------------------------------------
    console.log('\n[1/3] Scenario 1: London Subway Transit Blackout (Simulated Drop)...')
    const tunnelRes = await fetch(`${baseUrl}/api/v1/recommendations/recommendations?userId=usr_elena_current`, {
      headers: { 'x-simulate-network': 'subway_tunnel' },
    })

    const tunnelData = await tunnelRes.json()
    console.log(`Tunnel Response Status: ${tunnelRes.status} (Offline: ${tunnelData.offline})`)

    if (tunnelRes.status !== 503 || !tunnelData.offline) {
      throw new Error('Server failed to cleanly simulate subway tunnel blackout failure.')
    }
    console.log('  ✅ Tunnel Blackout Handled: Safe 503 fallback with offline preservation prompt.')

    // ------------------------------------------------------------------------
    // SCENARIO 2: LOSSY 3G PACKET DROPS & IDEMPOTENT EXPONENTIAL BACKOFF
    // ------------------------------------------------------------------------
    console.log('\n[2/3] Scenario 2: Lossy 3G Jitter & Exponential Backoff Recovery...')
    const idempotencyKey = `idem_apple_net_${Date.now()}`
    let attempts = 0
    let success = false
    let checkoutSessionId: string | null = null

    // Client-side exponential backoff loop simulation (Apple URLSession / retry policy)
    for (let retry = 0; retry < 5; retry++) {
      attempts++
      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          'x-simulate-network': 'lossy_3g',
        }
        if (retry > 0) {
          headers['x-retry-attempt'] = String(retry)
        }

        const res = await fetch(`${baseUrl}/api/v1/subscriptions/checkout`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            userId: 'usr_elena_current',
            plan: 'supporter',
            idempotencyKey,
          }),
        })

        if (res.status === 200 || res.status === 201) {
          const data = await res.json()
          checkoutSessionId = data.sessionId
          success = true
          break
        } else if (res.status === 504) {
          // Simulated 3G packet drop
          const backoffDelay = Math.min(1000, 50 * Math.pow(2, retry))
          await new Promise((r) => setTimeout(r, backoffDelay))
        }
      } catch {
        await new Promise((r) => setTimeout(r, 100))
      }
    }

    if (!success || !checkoutSessionId) {
      throw new Error('Exponential backoff retry failed across simulated lossy 3G.')
    }
    console.log(`  ✅ Lossy 3G Handover Verified: Succeeded on attempt #${attempts} (Session: ${checkoutSessionId}).`)

    // Verify idempotency guarantee: Replay with same key must not create a duplicate charge
    const replayRes = await fetch(`${baseUrl}/api/v1/subscriptions/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'usr_elena_current',
        plan: 'supporter',
        idempotencyKey,
      }),
    })
    const replayData = await replayRes.json()
    if (!replayData.sessionId.includes('cached')) {
      throw new Error('Idempotency violation during degraded network replay!')
    }
    console.log('  ✅ Idempotency Invariant: Zero double-billing risk across network retries.')

    // ------------------------------------------------------------------------
    // SCENARIO 3: FLAPPING NETWORK STATE RESTORATION
    // ------------------------------------------------------------------------
    console.log('\n[3/3] Scenario 3: Rapid Flapping & Health State Restoration...')
    let completedRequests = 0
    for (let i = 0; i < 15; i++) {
      const isBlackout = i % 3 === 0
      const res = await fetch(`${baseUrl}/api/health`, {
        headers: isBlackout ? { 'x-simulate-network': 'subway_tunnel' } : {},
      })
      if (isBlackout) {
        if (res.status === 503) completedRequests++
      } else {
        if (res.status === 200) completedRequests++
      }
    }

    if (completedRequests !== 15) {
      throw new Error(`Flapping network test dropped requests (${completedRequests}/15 completed)`)
    }
    console.log('  ✅ Rapid Flapping Handled: 15/15 requests deterministically resolved without thread lock.')

    console.log('\n===============================================================')
    console.log('ALL NETWORK LINK CONDITIONER SIMULATIONS PASSED 100%')
    console.log('===============================================================')
  } finally {
    server.closeAllConnections?.()
    await new Promise<void>((resolve) => server.close(() => resolve()))
  }
}

// Direct execution
if (process.argv[1]?.includes('simulateNetworkConditioner')) {
  runNetworkConditionerTests()
    .then(async () => {
      const { matchPool } = await import('../server/src/workers/matchPool.js')
      await matchPool.terminate()
      process.exit(0)
    })
    .catch((err) => {
      console.error(err)
      process.exit(1)
    })
}
