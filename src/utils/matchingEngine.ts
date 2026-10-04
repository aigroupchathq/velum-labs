import type {
  Profile,
  UserProfile,
  UserPreferences,
  CompatibilityReport,
  EvaluatedCriterion,
  ConflictItem,
} from '../types'

// Weights per tier
const WEIGHT_HARD = 5.0
const WEIGHT_STRONG = 3.0
const WEIGHT_NORMAL = 1.0

/**
 * Evaluates unidirectional compatibility from Evaluator (A) to Target (B)
 */
function evaluateDirection(
  evaluator: {
    age?: number
    distance?: number
    passions?: string[]
    smoking?: string
    drinking?: string
    workout?: string
    intent?: string
    partnerCriteria?: {
      minAge?: number
      maxAge?: number
      maxDistance?: number
      acceptableIntents?: string[]
      strictNonSmoker?: boolean
      preferredPassions?: string[]
    }
  },
  evaluatorPreferences: {
    minAge: number
    maxAge: number
    maxDistance: number
    hardRequirements: {
      ageRange: boolean
      distance: boolean
      nonSmoker: boolean
      relationshipIntent: boolean
    }
    flexibilityMargins: {
      age: number
      distance: number
    }
    strongPreferences: {
      intent: boolean
      lifestyle: boolean
    }
  },
  target: {
    name: string
    age: number
    distance: number
    passions?: string[]
    smoking?: string
    drinking?: string
    workout?: string
    intent?: string
    verified?: boolean
  },
  directionLabel: 'A_to_B' | 'B_to_A'
): {
  isExcluded: boolean
  exclusionReasons: string[]
  criteria: EvaluatedCriterion[]
  conflicts: ConflictItem[]
  weightedScoreSum: number
  totalKnownWeight: number
  unknownAttributes: string[]
} {
  const criteria: EvaluatedCriterion[] = []
  const conflicts: ConflictItem[] = []
  const exclusionReasons: string[] = []
  const unknownAttributes: string[] = []

  let isExcluded = false
  let weightedScoreSum = 0
  let totalKnownWeight = 0

  // 1. AGE EVALUATION
  const ageHard = evaluatorPreferences.hardRequirements.ageRange
  const ageFlex = evaluatorPreferences.flexibilityMargins.age
  const targetAge = target.age

  if (targetAge !== undefined && targetAge !== null) {
    const minAge = evaluatorPreferences.minAge
    const maxAge = evaluatorPreferences.maxAge

    let ageScore = 1.0
    let ageRelaxed = false
    let ageExcluded = false
    let detail = `Age ${targetAge} is within desired range [${minAge}-${maxAge}]`

    if (targetAge < minAge) {
      const diff = minAge - targetAge
      if (diff <= ageFlex) {
        // Controlled relaxation
        ageRelaxed = true
        ageScore = Math.max(0.3, 1 - (diff / (ageFlex + 1)) * 0.6)
        detail = `Age ${targetAge} is ${diff} yr below preferred range [${minAge}-${maxAge}], within ±${ageFlex} yr flexibility`
      } else {
        ageScore = 0
        if (ageHard) {
          ageExcluded = true
          isExcluded = true
          exclusionReasons.push(`Age ${targetAge} violates hard age requirement [${minAge}-${maxAge}]`)
          conflicts.push({
            id: `conflict-age-${directionLabel}`,
            field: 'age',
            severity: 'dealbreaker',
            message: `Target age (${targetAge}) is outside hard range [${minAge}-${maxAge}]`,
            side: directionLabel,
          })
        } else {
          conflicts.push({
            id: `conflict-age-${directionLabel}`,
            field: 'age',
            severity: 'strong_conflict',
            message: `Target age (${targetAge}) is outside preferred range [${minAge}-${maxAge}]`,
            side: directionLabel,
          })
        }
      }
    } else if (targetAge > maxAge) {
      const diff = targetAge - maxAge
      if (diff <= ageFlex) {
        // Controlled relaxation
        ageRelaxed = true
        ageScore = Math.max(0.3, 1 - (diff / (ageFlex + 1)) * 0.6)
        detail = `Age ${targetAge} is ${diff} yr above preferred range [${minAge}-${maxAge}], within ±${ageFlex} yr flexibility`
      } else {
        ageScore = 0
        if (ageHard) {
          ageExcluded = true
          isExcluded = true
          exclusionReasons.push(`Age ${targetAge} violates hard age requirement [${minAge}-${maxAge}]`)
          conflicts.push({
            id: `conflict-age-${directionLabel}`,
            field: 'age',
            severity: 'dealbreaker',
            message: `Target age (${targetAge}) is outside hard range [${minAge}-${maxAge}]`,
            side: directionLabel,
          })
        } else {
          conflicts.push({
            id: `conflict-age-${directionLabel}`,
            field: 'age',
            severity: 'strong_conflict',
            message: `Target age (${targetAge}) is outside preferred range [${minAge}-${maxAge}]`,
            side: directionLabel,
          })
        }
      }
    }

    const weight = ageHard ? WEIGHT_HARD : WEIGHT_STRONG
    criteria.push({
      field: 'age',
      label: 'Age Range',
      tier: ageHard ? 'HARD_REQUIREMENT' : 'STRONG_PREFERENCE',
      score: ageScore,
      weight,
      isKnown: true,
      isExcluded: ageExcluded,
      relaxed: ageRelaxed,
      detail,
    })

    weightedScoreSum += ageScore * weight
    totalKnownWeight += weight
  } else {
    // UNKNOWN: do not treat as incompatibility
    unknownAttributes.push('Age')
  }

  // 2. DISTANCE EVALUATION
  const distHard = evaluatorPreferences.hardRequirements.distance
  const distFlex = evaluatorPreferences.flexibilityMargins.distance
  const targetDist = target.distance

  if (targetDist !== undefined && targetDist !== null) {
    const maxDist = evaluatorPreferences.maxDistance
    let distScore = 1.0
    let distRelaxed = false
    let distExcluded = false
    let detail = `Distance ${targetDist} mi is within limit of ${maxDist} mi`

    if (targetDist > maxDist) {
      const excess = targetDist - maxDist
      if (excess <= distFlex) {
        // Controlled relaxation
        distRelaxed = true
        distScore = Math.max(0.2, 1 - (excess / (distFlex + 1)) * 0.7)
        detail = `Distance ${targetDist} mi exceeds ${maxDist} mi limit by ${excess} mi, within ±${distFlex} mi flexibility`
      } else {
        distScore = 0
        if (distHard) {
          distExcluded = true
          isExcluded = true
          exclusionReasons.push(`Distance ${targetDist} mi violates hard limit of ${maxDist} mi`)
          conflicts.push({
            id: `conflict-dist-${directionLabel}`,
            field: 'distance',
            severity: 'dealbreaker',
            message: `Target distance (${targetDist} mi) exceeds hard limit (${maxDist} mi)`,
            side: directionLabel,
          })
        } else {
          conflicts.push({
            id: `conflict-dist-${directionLabel}`,
            field: 'distance',
            severity: 'moderate_conflict',
            message: `Target distance (${targetDist} mi) is further than preferred (${maxDist} mi)`,
            side: directionLabel,
          })
        }
      }
    } else {
      // Proximity bonus: closer is better
      distScore = 1 - (targetDist / Math.max(maxDist, 1)) * 0.2
    }

    const weight = distHard ? WEIGHT_HARD : WEIGHT_STRONG
    criteria.push({
      field: 'distance',
      label: 'Distance Proximity',
      tier: distHard ? 'HARD_REQUIREMENT' : 'STRONG_PREFERENCE',
      score: distScore,
      weight,
      isKnown: true,
      isExcluded: distExcluded,
      relaxed: distRelaxed,
      detail,
    })

    weightedScoreSum += distScore * weight
    totalKnownWeight += weight
  } else {
    // UNKNOWN: do not treat as incompatibility
    unknownAttributes.push('Distance')
  }

  // 3. SMOKING HABIT EVALUATION
  const nonSmokerHard = evaluatorPreferences.hardRequirements.nonSmoker
  const targetSmoking = target.smoking

  if (targetSmoking !== undefined && targetSmoking !== null && targetSmoking !== '') {
    const isSmoker = targetSmoking.toLowerCase().includes('yes') ||
      targetSmoking.toLowerCase().includes('socially') ||
      targetSmoking.toLowerCase().includes('vape') ||
      targetSmoking.toLowerCase().includes('smoke')

    let smokingScore = 1.0
    let smokingExcluded = false
    let detail = `Smoking habit: "${targetSmoking}" matches preferences`

    if (isSmoker && nonSmokerHard) {
      smokingScore = 0
      smokingExcluded = true
      isExcluded = true
      exclusionReasons.push(`Candidate is a smoker (${targetSmoking}), which violates hard requirement`)
      conflicts.push({
        id: `conflict-smoking-${directionLabel}`,
        field: 'smoking',
        severity: 'dealbreaker',
        message: `Candidate smokes (${targetSmoking}), violating hard requirement`,
        side: directionLabel,
      })
      detail = `Smokes (${targetSmoking}) — HARD REQUIREMENT VIOLATION`
    } else if (isSmoker) {
      smokingScore = 0.4
      detail = `Smokes (${targetSmoking}) — minor penalty`
      conflicts.push({
        id: `conflict-smoking-${directionLabel}`,
        field: 'smoking',
        severity: 'moderate_conflict',
        message: `Candidate smokes (${targetSmoking})`,
        side: directionLabel,
      })
    }

    const weight = nonSmokerHard ? WEIGHT_HARD : WEIGHT_STRONG
    criteria.push({
      field: 'smoking',
      label: 'Non-Smoker Policy',
      tier: nonSmokerHard ? 'HARD_REQUIREMENT' : 'STRONG_PREFERENCE',
      score: smokingScore,
      weight,
      isKnown: true,
      isExcluded: smokingExcluded,
      relaxed: false,
      detail,
    })

    weightedScoreSum += smokingScore * weight
    totalKnownWeight += weight
  } else {
    // UNKNOWN: do not treat as incompatibility!
    unknownAttributes.push('Smoking Habit')
  }

  // 4. RELATIONSHIP INTENT EVALUATION (STRONG PREFERENCE or HARD)
  const intentHard = evaluatorPreferences.hardRequirements.relationshipIntent
  const intentStrong = evaluatorPreferences.strongPreferences.intent
  const evaluatorIntent = evaluator.intent
  const targetIntent = target.intent

  if (targetIntent && evaluatorIntent) {
    const cleanEval = evaluatorIntent.toLowerCase()
    const cleanTarget = targetIntent.toLowerCase()

    let intentScore = 0.5
    let detail = `Intent: Evaluator wants "${evaluatorIntent}", Target has "${targetIntent}"`

    const isBothLongTerm = (cleanEval.includes('long-term') || cleanEval.includes('partner') || cleanEval.includes('relationship')) &&
      (cleanTarget.includes('long-term') || cleanTarget.includes('partner') || cleanTarget.includes('relationship'))

    const isBothCasual = (cleanEval.includes('casual') || cleanEval.includes('short') || cleanEval.includes('fun')) &&
      (cleanTarget.includes('casual') || cleanTarget.includes('short') || cleanTarget.includes('fun'))

    const isContradiction = (cleanEval.includes('long-term') && cleanTarget.includes('casual') && !cleanTarget.includes('long')) ||
      (cleanEval.includes('casual') && cleanTarget.includes('long-term') && !cleanEval.includes('long'))

    if (isBothLongTerm || isBothCasual) {
      intentScore = 1.0
      detail = `Relationship intentions are aligned: "${evaluatorIntent}"`
    } else if (isContradiction) {
      intentScore = 0.1
      if (intentHard) {
        isExcluded = true
        exclusionReasons.push(`Conflicting relationship goals: wants ${evaluatorIntent} vs ${targetIntent}`)
        conflicts.push({
          id: `conflict-intent-${directionLabel}`,
          field: 'intent',
          severity: 'dealbreaker',
          message: `Incompatible relationship goals (${evaluatorIntent} vs ${targetIntent})`,
          side: directionLabel,
        })
      } else {
        conflicts.push({
          id: `conflict-intent-${directionLabel}`,
          field: 'intent',
          severity: 'strong_conflict',
          message: `Divergent relationship intentions (${evaluatorIntent} vs ${targetIntent})`,
          side: directionLabel,
        })
      }
    } else {
      intentScore = 0.7
      detail = `Compatible flexible relationship intentions`
    }

    const weight = intentHard ? WEIGHT_HARD : intentStrong ? WEIGHT_STRONG : WEIGHT_NORMAL
    criteria.push({
      field: 'intent',
      label: 'Relationship Goals',
      tier: intentHard ? 'HARD_REQUIREMENT' : intentStrong ? 'STRONG_PREFERENCE' : 'NORMAL_PREFERENCE',
      score: intentScore,
      weight,
      isKnown: true,
      isExcluded: intentHard && intentScore < 0.2,
      relaxed: false,
      detail,
    })

    weightedScoreSum += intentScore * weight
    totalKnownWeight += weight
  } else {
    // UNKNOWN: do not treat as incompatibility
    unknownAttributes.push('Relationship Intent')
  }

  // 5. PASSIONS & INTERESTS (NORMAL PREFERENCE)
  const evalPassions = evaluator.passions || []
  const targetPassions = target.passions || []

  if (evalPassions.length > 0 && targetPassions.length > 0) {
    const shared = evalPassions.filter((p) =>
      targetPassions.some((tp) => tp.toLowerCase() === p.toLowerCase())
    )

    const matchRatio = Math.min(shared.length / 2, 1.0) // 2+ shared passions = 100% score
    const passionScore = shared.length > 0 ? 0.5 + matchRatio * 0.5 : 0.3
    const weight = WEIGHT_NORMAL

    criteria.push({
      field: 'passions',
      label: 'Shared Passions',
      tier: 'NORMAL_PREFERENCE',
      score: passionScore,
      weight,
      isKnown: true,
      isExcluded: false,
      relaxed: false,
      detail: shared.length > 0
        ? `${shared.length} shared interests (${shared.join(', ')})`
        : `Diverse interests (No direct overlap, adds conversational curiosity)`,
    })

    weightedScoreSum += passionScore * weight
    totalKnownWeight += weight
  } else {
    unknownAttributes.push('Passions & Interests')
  }

  // 6. WORKOUT / LIFESTYLE (NORMAL PREFERENCE)
  const targetWorkout = target.workout
  if (targetWorkout) {
    const workoutScore = 0.9
    const weight = WEIGHT_NORMAL
    criteria.push({
      field: 'workout',
      label: 'Active Lifestyle',
      tier: 'NORMAL_PREFERENCE',
      score: workoutScore,
      weight,
      isKnown: true,
      isExcluded: false,
      relaxed: false,
      detail: `Activity profile noted: ${targetWorkout}`,
    })

    weightedScoreSum += workoutScore * weight
    totalKnownWeight += weight
  } else {
    unknownAttributes.push('Workout Lifestyle')
  }

  return {
    isExcluded,
    exclusionReasons,
    criteria,
    conflicts,
    weightedScoreSum,
    totalKnownWeight,
    unknownAttributes,
  }
}

/**
 * Evaluates bidirectional compatibility between User A and Candidate B
 * applying:
 * - HARD REQUIREMENTS (exclusion if violated)
 * - STRONG PREFERENCES (high weighting)
 * - NORMAL PREFERENCES (moderate weighting)
 * - FLEXIBILITY (controlled relaxation)
 * - UNKNOWN (neutral, does not penalize compatibility, adjusts confidence)
 * - MUTUALITY (evaluates A->B and B->A, computes harmonic mutual score)
 * - CONFLICT (explicitly identifies and categorizes)
 * - CONFIDENCE (separate metric from compatibility)
 */
export function evaluateMatchCompatibility(
  user: UserProfile,
  preferences: UserPreferences,
  candidate: Profile
): CompatibilityReport {
  // 1. Evaluate A -> B (How well Candidate meets User's criteria)
  const evalAtoB = evaluateDirection(
    {
      age: user.age,
      distance: 0,
      passions: user.passions,
      smoking: user.smoking || 'never',
      drinking: user.drinking || 'socially',
      workout: user.workout || 'yoga',
      intent: user.intent || 'Looking for long-term partner 💘',
    },
    {
      minAge: preferences.minAge,
      maxAge: preferences.maxAge,
      maxDistance: preferences.maxDistance,
      hardRequirements: preferences.hardRequirements,
      flexibilityMargins: preferences.flexibilityMargins,
      strongPreferences: preferences.strongPreferences,
    },
    {
      name: candidate.name,
      age: candidate.age,
      distance: candidate.distance,
      passions: candidate.passions,
      smoking: candidate.basics?.smoking,
      drinking: candidate.basics?.drinking,
      workout: candidate.basics?.workout,
      intent: candidate.intent,
      verified: candidate.verified,
    },
    'A_to_B'
  )

  // 2. Evaluate B -> A (How well User meets Candidate's partner criteria)
  const candidateExpectations = candidate.partnerCriteria || {
    minAge: 20,
    maxAge: 32,
    maxDistance: 25,
    acceptableIntents: candidate.intent ? [candidate.intent] : ['Looking for long-term partner 💘'],
    strictNonSmoker: candidate.basics?.smoking === 'Never 🚭',
  }

  const evalBtoA = evaluateDirection(
    {
      age: candidate.age,
      distance: candidate.distance,
      passions: candidate.passions,
      smoking: candidate.basics?.smoking,
      drinking: candidate.basics?.drinking,
      workout: candidate.basics?.workout,
      intent: candidate.intent,
    },
    {
      minAge: candidateExpectations.minAge || 20,
      maxAge: candidateExpectations.maxAge || 35,
      maxDistance: candidateExpectations.maxDistance || 30,
      hardRequirements: {
        ageRange: true,
        distance: false,
        nonSmoker: !!candidateExpectations.strictNonSmoker,
        relationshipIntent: false,
      },
      flexibilityMargins: {
        age: 2,
        distance: 5,
      },
      strongPreferences: {
        intent: true,
        lifestyle: true,
      },
    },
    {
      name: user.name,
      age: user.age,
      distance: candidate.distance,
      passions: user.passions,
      smoking: user.smoking || 'never',
      drinking: user.drinking || 'socially',
      workout: user.workout || 'yoga',
      intent: user.intent || 'Looking for long-term partner 💘',
      verified: true,
    },
    'B_to_A'
  )

  // 3. Compute Scores
  const isExcluded = evalAtoB.isExcluded || evalBtoA.isExcluded
  const exclusionReasons = [...evalAtoB.exclusionReasons, ...evalBtoA.exclusionReasons]

  // Unidirectional scores
  const scoreAtoB = isExcluded
    ? 0
    : evalAtoB.totalKnownWeight > 0
    ? Math.round((evalAtoB.weightedScoreSum / evalAtoB.totalKnownWeight) * 100)
    : 75

  const scoreBtoA = isExcluded
    ? 0
    : evalBtoA.totalKnownWeight > 0
    ? Math.round((evalBtoA.weightedScoreSum / evalBtoA.totalKnownWeight) * 100)
    : 75

  // MUTUALITY: Harmonic mean ensures mutual compatibility
  // H = 2 * (A * B) / (A + B)
  let mutualScore = 0
  if (!isExcluded && scoreAtoB > 0 && scoreBtoA > 0) {
    mutualScore = Math.round((2 * scoreAtoB * scoreBtoA) / (scoreAtoB + scoreBtoA))
  }

  // 4. CONFIDENCE: Evaluated separately from compatibility
  // Total potential criteria weight = 6 criteria * average weight (~2.0) = ~12
  const maxPossibleWeight = 14
  const knownRatio = Math.min(evalAtoB.totalKnownWeight / maxPossibleWeight, 1.0)
  
  // Verification and photo count quality factors
  const photoBonus = Math.min((candidate.photos?.length || 1) / 3, 1.0) * 15
  const verifiedBonus = candidate.verified ? 15 : 0
  const baseConfidence = Math.round(knownRatio * 70 + photoBonus + verifiedBonus)
  const confidenceScore = Math.min(Math.max(baseConfidence, 20), 100)

  let confidenceRating: 'High' | 'Moderate' | 'Low' = 'Moderate'
  if (confidenceScore >= 75) confidenceRating = 'High'
  else if (confidenceScore < 50) confidenceRating = 'Low'

  // Combine and categorize criteria
  const hardRequirements = evalAtoB.criteria.filter((c) => c.tier === 'HARD_REQUIREMENT')
  const strongPreferences = evalAtoB.criteria.filter((c) => c.tier === 'STRONG_PREFERENCE')
  const normalPreferences = evalAtoB.criteria.filter((c) => c.tier === 'NORMAL_PREFERENCE')

  // Combine conflicts
  const conflicts: ConflictItem[] = [...evalAtoB.conflicts, ...evalBtoA.conflicts]

  return {
    isExcluded,
    exclusionReasons,
    scoreAtoB,
    scoreBtoA,
    mutualScore,
    confidenceScore,
    confidenceRating,
    knownCriteriaCount: evalAtoB.criteria.length,
    totalCriteriaCount: evalAtoB.criteria.length + evalAtoB.unknownAttributes.length,
    unknownAttributes: evalAtoB.unknownAttributes,
    hardRequirements,
    strongPreferences,
    normalPreferences,
    conflicts,
  }
}
