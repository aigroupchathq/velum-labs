// ============================================================================
// tools/generateGoldenMaster.ts
// Generates and freezes deterministic Golden Master regression fixtures
// for current matching engine behavior (Gate 1 Baseline Lock)
// ============================================================================

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { evaluateMatch, detectUserContradictions } from '../src/utils/matchingEngine.js'
import { currentUser, mockCandidates } from '../src/data/mockProfiles.js'
import { generateSyntheticPopulation } from './syntheticPopulation.js'
import type { UniversalUserProfile } from '../src/types/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const syntheticPool = generateSyntheticPopulation({ count: 20, seed: 999 })

// 1. Clearly Eligible Pair (Elena & Maya)
const pair1_ElenaMaya = { id: 'clearly_eligible', userA: currentUser, userB: mockCandidates[0] } // Maya

// 2. Smoking Dealbreaker Conflict (Elena & Liam)
const pair2_SmokingConflict = { id: 'smoking_dealbreaker', userA: currentUser, userB: mockCandidates[1] } // Liam (smoker)

// 3. Children Intention Conflict (Elena vs Definite No Children)
const noKidsUser: UniversalUserProfile = JSON.parse(JSON.stringify(currentUser))
noKidsUser.id = 'usr_no_kids'
noKidsUser.family.wantsChildren = 'definitely_not'
noKidsUser.preferences.wantsChildrenPreference = {
  dealbreaker: true,
  requirementLevel: 'MUST',
  acceptableAnswers: ['definitely_not'],
}
const pair3_ChildrenConflict = { id: 'children_intention_conflict', userA: currentUser, userB: noKidsUser }

// 4. Relationship Structure Conflict (Elena & Devon)
const pair4_StructureConflict = { id: 'structure_conflict', userA: currentUser, userB: mockCandidates[3] } // Devon (polyamorous)

// 5. High Reciprocal Score (Elena & Synthetic high fit)
const pair5_HighReciprocal = { id: 'high_reciprocal_score', userA: currentUser, userB: syntheticPool[0] }

// 6. Highly Asymmetric Score (User A loves B's traits, B dislikes A's traits)
const asymUserA: UniversalUserProfile = JSON.parse(JSON.stringify(currentUser))
asymUserA.id = 'usr_asym_a'
asymUserA.preferences.dietPreference = { requirementLevel: 'PREFERENCE', preferredDiets: ['omnivore', 'vegetarian', 'vegan'], flexibility: 100 }

const asymUserB: UniversalUserProfile = JSON.parse(JSON.stringify(syntheticPool[2]))
asymUserB.id = 'usr_asym_b'
asymUserB.preferences.dietPreference = { requirementLevel: 'MUST', preferredDiets: ['vegan'], flexibility: 0 }
asymUserB.lifestyle.diet = 'vegan'
asymUserA.lifestyle.diet = 'omnivore' // B will score A low on diet MUST requirement!
const pair6_AsymmetricScore = { id: 'highly_asymmetric_score', userA: asymUserA, userB: asymUserB }

// 7. Low-Score Eligible Pair
const pair7_LowScoreEligible = { id: 'low_score_eligible', userA: currentUser, userB: syntheticPool[5] }

// 8. Maximum Distance Boundary
const farUser: UniversalUserProfile = JSON.parse(JSON.stringify(currentUser))
farUser.id = 'usr_max_dist'
farUser.geography.coordinates = { lat: 37.7749 + 0.49, lng: -122.4194 + 0.49 } // ~65km away
farUser.geography.maxDistanceKm = 70
farUser.geography.distanceFlexibilityKm = 0
farUser.geography.openToLongDistance = false
const pair8_MaxDistanceBoundary = { id: 'max_distance_boundary', userA: currentUser, userB: farUser }

// 9. Sparse Profile
const sparseUser: UniversalUserProfile = JSON.parse(JSON.stringify(mockCandidates[4])) // Nadia (sparse/unknowns)
const pair9_SparseProfile = { id: 'sparse_profile', userA: currentUser, userB: sparseUser }

// 10. Identical Profiles
const pair10_Identical = { id: 'identical_profiles', userA: currentUser, userB: JSON.parse(JSON.stringify(currentUser)) }

// 11. Intentionally Contradictory Profile
const contradictoryUser: UniversalUserProfile = JSON.parse(JSON.stringify(currentUser))
contradictoryUser.id = 'usr_contradictory'
contradictoryUser.geography.maxDistanceKm = 5
contradictoryUser.geography.openToLongDistance = true
contradictoryUser.preferences.dietPreference.requirementLevel = 'MUST'
contradictoryUser.preferences.dietPreference.flexibility = 95
const pair11_Contradictory = { id: 'contradictory_profile', userA: currentUser, userB: contradictoryUser }

const allTestCases = [
  pair1_ElenaMaya,
  pair2_SmokingConflict,
  pair3_ChildrenConflict,
  pair4_StructureConflict,
  pair5_HighReciprocal,
  pair6_AsymmetricScore,
  pair7_LowScoreEligible,
  pair8_MaxDistanceBoundary,
  pair9_SparseProfile,
  pair10_Identical,
  pair11_Contradictory,
]

const goldenMasterSnapshot: Array<{
  fixtureId: string
  userAProfile: UniversalUserProfile
  userBProfile: UniversalUserProfile
  isEligible: boolean
  hardConflicts: any[]
  directionalScores: { aToB: number | null; bToA: number | null }
  harmonicScore: number | null
  asymmetric: boolean
  confidence: { score: number; rating: string }
  facets: {
    relationship: number | null
    family: number | null
    lifestyle: number | null
    values: number | null
    attraction: number | null
    communication: number | null
    geography: number | null
    temporal: number | null
  }
  explanation: {
    strongAlignment: string[]
    potentialFrictions: string[]
    summaryText: string
  }
  userAContradictionsCount: number
  userBContradictionsCount: number
}> = []

console.log('Generating Golden Master Snapshot for 11 test cases...')

for (const testCase of allTestCases) {
  const result = evaluateMatch(testCase.userA, testCase.userB)
  const contradictionsA = detectUserContradictions(testCase.userA)
  const contradictionsB = detectUserContradictions(testCase.userB)

  goldenMasterSnapshot.push({
    fixtureId: testCase.id,
    userAProfile: testCase.userA,
    userBProfile: testCase.userB,
    isEligible: result.eligible,
    hardConflicts: result.hardConflicts,
    directionalScores: {
      aToB: result.compatibility.aToB,
      bToA: result.compatibility.bToA,
    },
    harmonicScore: result.mutuality.score,
    asymmetric: result.mutuality.asymmetric,
    confidence: {
      score: result.confidence.score,
      rating: result.confidence.rating,
    },
    facets: {
      relationship: result.relationshipAlignment.score,
      family: result.familyAlignment.score,
      lifestyle: result.lifestyleAlignment.score,
      values: result.valueAlignment.score,
      attraction: result.attraction.score,
      communication: result.communicationAlignment.score,
      geography: result.geographicFeasibility.score,
      temporal: result.temporalFeasibility.score,
    },
    explanation: {
      strongAlignment: result.explanation.strongAlignment,
      potentialFrictions: result.explanation.potentialFrictions,
      summaryText: result.explanation.summaryText,
    },
    userAContradictionsCount: contradictionsA.length,
    userBContradictionsCount: contradictionsB.length,
  })
}

const outDir = path.resolve(__dirname, '../test/fixtures')
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true })
}

const outFile = path.join(outDir, 'goldenMasterFixtures.json')
fs.writeFileSync(outFile, JSON.stringify(goldenMasterSnapshot, null, 2), 'utf8')
console.log(`✅ Golden Master Snapshot written successfully to ${outFile}`)
