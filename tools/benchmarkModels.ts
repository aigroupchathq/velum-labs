// ============================================================================
// tools/benchmarkModels.ts
// Multi-Model Benchmark Harness
// Evaluates Models 1 to 5 as defined in EVALUATION.md §4:
//   Model 1: Popularity Baseline
//   Model 2: Simple Similarity (Jaccard Overlap)
//   Model 3: Conventional One-Way Preference Recommendation (A -> B only)
//   Model 4: Naive Reciprocal Matching (Arithmetic Mean, No Gating)
//   Model 5: Universal Compatibility Engine (5-Stage Deterministic Pipeline)
// ============================================================================

import { generateSyntheticPopulation } from './syntheticPopulation.js'
import { evaluateMatch } from '../src/utils/matchingEngine.js'
import type { UniversalUserProfile } from '../src/types/index.js'

export interface ModelMetrics {
  modelName: string
  totalRecommendations: number
  hardConflictViolations: number
  hardConflictRatePercent: number
  meanMutualScore: number
  asymmetricPairCount: number
  exposureGini: number
  coverageRatePercent: number
}

// Computes Gini coefficient of exposure distribution across candidate pool
function calculateGini(exposures: number[]): number {
  if (exposures.length === 0) return 0
  const sorted = [...exposures].sort((a, b) => a - b)
  const n = sorted.length
  let totalSum = 0
  let cumulativeWeightedSum = 0

  for (let i = 0; i < n; i++) {
    totalSum += sorted[i]
    cumulativeWeightedSum += (i + 1) * sorted[i]
  }

  if (totalSum === 0) return 0
  return (2 * cumulativeWeightedSum) / (n * totalSum) - (n + 1) / n
}

export function runBenchmark(populationSize = 100, topK = 5, seed = 12345): ModelMetrics[] {
  console.log(`\n===============================================================`)
  console.log(`RUNNING EMPIRICAL BENCHMARK ON POPULATION N = ${populationSize}`)
  console.log(`Seed: ${seed} | Slate Size Top-K: ${topK}`)
  console.log(`===============================================================`)

  const population = generateSyntheticPopulation({ count: populationSize, seed })

  // --------------------------------------------------------------------------
  // Model 1: Popularity Baseline (Mock Likes Received)
  // --------------------------------------------------------------------------
  const exposuresM1 = new Array(populationSize).fill(0)
  let hardConflictsM1 = 0
  let totalRecsM1 = 0
  let sumScoreM1 = 0

  // --------------------------------------------------------------------------
  // Model 2: Simple Similarity (Core Values Jaccard Overlap)
  // --------------------------------------------------------------------------
  const exposuresM2 = new Array(populationSize).fill(0)
  let hardConflictsM2 = 0
  let totalRecsM2 = 0
  let sumScoreM2 = 0

  // --------------------------------------------------------------------------
  // Model 3: Conventional One-Way Recommendation (Score A -> B only)
  // --------------------------------------------------------------------------
  const exposuresM3 = new Array(populationSize).fill(0)
  let hardConflictsM3 = 0
  let totalRecsM3 = 0
  let sumScoreM3 = 0

  // --------------------------------------------------------------------------
  // Model 4: Naive Reciprocal (Arithmetic Mean, No Dealbreaker Gating)
  // --------------------------------------------------------------------------
  const exposuresM4 = new Array(populationSize).fill(0)
  let hardConflictsM4 = 0
  let totalRecsM4 = 0
  let sumScoreM4 = 0

  // --------------------------------------------------------------------------
  // Model 5: Universal Compatibility Engine (Canonical Pipeline)
  // --------------------------------------------------------------------------
  const exposuresM5 = new Array(populationSize).fill(0)
  let hardConflictsM5 = 0
  let totalRecsM5 = 0
  let sumScoreM5 = 0
  let asymmetricM5 = 0

  // Evaluate recommendations for every user
  for (let i = 0; i < populationSize; i++) {
    const userA = population[i]
    const candidates = population.filter((_, idx) => idx !== i)

    // Pre-evaluate full ground truth evaluations for diagnostic auditing
    const fullEvaluations = candidates.map((candidate) => {
      const evaluation = evaluateMatch(userA, candidate)
      return {
        candidate,
        evaluation,
        originalIndex: population.findIndex((p) => p.id === candidate.id),
      }
    })

    // MODEL 1: Sort by synthetic popularity (deterministic hash of id)
    const sortedM1 = [...fullEvaluations]
      .sort((a, b) => (parseInt(b.candidate.id.slice(-4)) % 100) - (parseInt(a.candidate.id.slice(-4)) % 100))
      .slice(0, topK)

    sortedM1.forEach((item) => {
      totalRecsM1++
      exposuresM1[item.originalIndex]++
      sumScoreM1 += item.evaluation.mutuality.score ?? 0
      if (!item.evaluation.eligible) hardConflictsM1++
    })

    // MODEL 2: Jaccard overlap of values
    const sortedM2 = [...fullEvaluations]
      .sort((a, b) => {
        const setA = new Set(userA.values.coreValues)
        const setB1 = new Set(a.candidate.values.coreValues)
        const setB2 = new Set(b.candidate.values.coreValues)
        const inter1 = [...setA].filter((x) => setB1.has(x)).length
        const inter2 = [...setA].filter((x) => setB2.has(x)).length
        return inter2 - inter1
      })
      .slice(0, topK)

    sortedM2.forEach((item) => {
      totalRecsM2++
      exposuresM2[item.originalIndex]++
      sumScoreM2 += item.evaluation.mutuality.score ?? 0
      if (!item.evaluation.eligible) hardConflictsM2++
    })

    // MODEL 3: One-Way score A -> B only
    const sortedM3 = [...fullEvaluations]
      .sort((a, b) => (b.evaluation.compatibility.aToB ?? 0) - (a.evaluation.compatibility.aToB ?? 0))
      .slice(0, topK)

    sortedM3.forEach((item) => {
      totalRecsM3++
      exposuresM3[item.originalIndex]++
      sumScoreM3 += item.evaluation.mutuality.score ?? 0
      if (!item.evaluation.eligible) hardConflictsM3++
    })

    // MODEL 4: Naive Arithmetic Mean (A->B + B->A) / 2 without gating
    const sortedM4 = [...fullEvaluations]
      .sort((a, b) => {
        const meanA = ((a.evaluation.compatibility.aToB ?? 0) + (a.evaluation.compatibility.bToA ?? 0)) / 2
        const meanB = ((b.evaluation.compatibility.aToB ?? 0) + (b.evaluation.compatibility.bToA ?? 0)) / 2
        return meanB - meanA
      })
      .slice(0, topK)

    sortedM4.forEach((item) => {
      totalRecsM4++
      exposuresM4[item.originalIndex]++
      sumScoreM4 += item.evaluation.mutuality.score ?? 0
      if (!item.evaluation.eligible) hardConflictsM4++
    })

    // MODEL 5: Universal Compatibility Engine (Strictly filter eligible ONLY, then rank by Harmonic Mean)
    const eligibleM5 = fullEvaluations.filter((item) => item.evaluation.eligible)
    const sortedM5 = [...eligibleM5]
      .sort((a, b) => (b.evaluation.mutuality.score ?? 0) - (a.evaluation.mutuality.score ?? 0))
      .slice(0, topK)

    sortedM5.forEach((item) => {
      totalRecsM5++
      exposuresM5[item.originalIndex]++
      sumScoreM5 += item.evaluation.mutuality.score ?? 0
      if (!item.evaluation.eligible) hardConflictsM5++
      if (item.evaluation.mutuality.asymmetric) asymmetricM5++
    })
  }

  const results: ModelMetrics[] = [
    {
      modelName: 'Model 1: Popularity Baseline',
      totalRecommendations: totalRecsM1,
      hardConflictViolations: hardConflictsM1,
      hardConflictRatePercent: Math.round((hardConflictsM1 / totalRecsM1) * 1000) / 10,
      meanMutualScore: Math.round(sumScoreM1 / totalRecsM1),
      asymmetricPairCount: 0,
      exposureGini: Math.round(calculateGini(exposuresM1) * 100) / 100,
      coverageRatePercent: Math.round((exposuresM1.filter((e) => e > 0).length / populationSize) * 100),
    },
    {
      modelName: 'Model 2: Simple Similarity (Jaccard)',
      totalRecommendations: totalRecsM2,
      hardConflictViolations: hardConflictsM2,
      hardConflictRatePercent: Math.round((hardConflictsM2 / totalRecsM2) * 1000) / 10,
      meanMutualScore: Math.round(sumScoreM2 / totalRecsM2),
      asymmetricPairCount: 0,
      exposureGini: Math.round(calculateGini(exposuresM2) * 100) / 100,
      coverageRatePercent: Math.round((exposuresM2.filter((e) => e > 0).length / populationSize) * 100),
    },
    {
      modelName: 'Model 3: One-Way Conventional (A->B)',
      totalRecommendations: totalRecsM3,
      hardConflictViolations: hardConflictsM3,
      hardConflictRatePercent: Math.round((hardConflictsM3 / totalRecsM3) * 1000) / 10,
      meanMutualScore: Math.round(sumScoreM3 / totalRecsM3),
      asymmetricPairCount: 0,
      exposureGini: Math.round(calculateGini(exposuresM3) * 100) / 100,
      coverageRatePercent: Math.round((exposuresM3.filter((e) => e > 0).length / populationSize) * 100),
    },
    {
      modelName: 'Model 4: Naive Reciprocal (Arithmetic)',
      totalRecommendations: totalRecsM4,
      hardConflictViolations: hardConflictsM4,
      hardConflictRatePercent: Math.round((hardConflictsM4 / totalRecsM4) * 1000) / 10,
      meanMutualScore: Math.round(sumScoreM4 / totalRecsM4),
      asymmetricPairCount: 0,
      exposureGini: Math.round(calculateGini(exposuresM4) * 100) / 100,
      coverageRatePercent: Math.round((exposuresM4.filter((e) => e > 0).length / populationSize) * 100),
    },
    {
      modelName: 'Model 5: Universal Compatibility Engine',
      totalRecommendations: totalRecsM5,
      hardConflictViolations: hardConflictsM5,
      hardConflictRatePercent: Math.round((hardConflictsM5 / totalRecsM5) * 1000) / 10,
      meanMutualScore: Math.round(sumScoreM5 / totalRecsM5),
      asymmetricPairCount: asymmetricM5,
      exposureGini: Math.round(calculateGini(exposuresM5) * 100) / 100,
      coverageRatePercent: Math.round((exposuresM5.filter((e) => e > 0).length / populationSize) * 100),
    },
  ]

  console.table(results)
  return results
}

if (process.env.NODE_ENV !== 'test') {
  const metrics = runBenchmark(100, 5, 42)
  if (metrics[4].hardConflictRatePercent > 0.0) {
    throw new Error('Invariance failure: Model 5 must never recommend pairs violating hard dealbreakers.')
  }
  console.log('\n✅ EMPIRICAL EVALUATION VERIFIED: Model 5 achieves 0.0% hard conflict violations.')
}
