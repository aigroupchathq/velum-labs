// ============================================================================
// tools/testMatchPool.ts
// Test validation of background worker thread pool matching engine
// ============================================================================

import { matchPool } from '../server/src/workers/matchPool.js'
import { currentUser, mockCandidates } from '../src/data/mockProfiles.js'

async function run() {
  console.log('===============================================================')
  console.log('WORKER THREAD MATCHING POOL VALIDATION')
  console.log('===============================================================')

  const metricsBefore = matchPool.getMetrics()
  console.log('Initial Worker Pool Metrics:', metricsBefore)

  // 1. Offload single pair evaluation
  console.log('\n--- 1. Offload Pair Evaluation (Elena vs Maya) ---')
  const pairResult = await matchPool.evaluatePairAsync(currentUser, mockCandidates[0])
  console.log('Pair Mutual Score:', pairResult.mutuality.score, 'Eligible:', pairResult.eligible)
  if (!pairResult.eligible || pairResult.mutuality.score < 80) {
    throw new Error('Pair evaluation unexpected result')
  }

  // 2. Offload candidate batch evaluation
  console.log(`\n--- 2. Offload Candidate Pool Batch Evaluation (N = ${mockCandidates.length}) ---`)
  const batchResult = await matchPool.evaluateCandidatesAsync(currentUser, mockCandidates)
  console.log(`Batch processed: ${batchResult.length} candidate evaluations.`)
  console.log(`Top Candidate: ${batchResult[0]?.profile.name} (Mutual Fit: ${batchResult[0]?.evaluation.mutualScore}%)`)
  
  if (batchResult[0]?.profile.name !== 'Maya Lin') {
    throw new Error(`Expected Maya Lin as top candidate, got ${batchResult[0]?.profile.name}`)
  }

  // 3. Telemetry check
  const metricsAfter = matchPool.getMetrics()
  console.log('\n--- 3. Telemetry & Worker Health ---')
  console.log('Metrics After Workload:', metricsAfter)

  if (metricsAfter.totalTasksProcessed < 2) {
    throw new Error('Expected at least 2 tasks processed')
  }

  await matchPool.terminate()
  console.log('\n✅ WORKER THREAD MATCHING POOL VALIDATED SUCCESSFULLY!')
  process.exit(0)
}

run().catch((err) => {
  console.error('\n❌ Worker pool validation failed:', err)
  process.exit(1)
})
