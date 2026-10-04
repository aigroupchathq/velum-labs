// Universal Compatibility & Matching Platform: Core Deterministic Engine
// Governing Standards: Master Build Specification §7, §8, §9, §10, §11, §12, §13, §14, §15

import type {
  UniversalUserProfile,
  MatchEvaluation,
  DimensionResult,
  HardConflict,
  PreferenceContradiction,
  MatchExplanation,
} from '../types'

/**
 * Calculates Great-Circle distance (in kilometers) between two coordinates using the Haversine formula
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371 // Earth's mean radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(R * c * 10) / 10
}

/**
 * Checks for logical contradictions in a user's stated preferences (Spec §14)
 */
export function detectUserContradictions(user: UniversalUserProfile): PreferenceContradiction[] {
  const contradictions: PreferenceContradiction[] = []

  // Check 1: Distance Neutral vs Tiny Hard Radius
  if (
    user.geography.maxDistanceKm > 0 &&
    user.geography.maxDistanceKm <= 10 &&
    user.geography.openToLongDistance
  ) {
    contradictions.push({
      code: 'DISTANCE_LONG_DISTANCE_BUT_TIGHT_RADIUS',
      message: `Open to long-distance relationships, but maximum discovery distance is set to only ${user.geography.maxDistanceKm} km.`,
      fields: ['geography.openToLongDistance', 'geography.maxDistanceKm'],
      suggestedFix: 'Increase maximum distance radius or disable the long-distance preference flag.',
    })
  }

  // Check 2: Diet Requirement Level MUST but 100% flexibility
  if (
    user.preferences.dietPreference.requirementLevel === 'MUST' &&
    user.preferences.dietPreference.flexibility > 50
  ) {
    contradictions.push({
      code: 'MUST_WITH_HIGH_FLEXIBILITY',
      message: `Diet requirement is set to MUST, yet flexibility is set to ${user.preferences.dietPreference.flexibility}%. A hard requirement cannot be flexible.`,
      fields: ['dietPreference.requirementLevel', 'dietPreference.flexibility'],
      suggestedFix: 'Change requirement level to PREFERENCE or reduce flexibility to 0%.',
    })
  }

  // Check 3: Relationship structure mismatch in own declaration vs preferences
  if (
    user.intention.relationshipStructure === 'monogamous' &&
    user.preferences.structurePreference.requirementLevel === 'MUST' &&
    user.preferences.structurePreference.acceptableStructures.includes('polyamorous') &&
    !user.preferences.structurePreference.acceptableStructures.includes('monogamous')
  ) {
    contradictions.push({
      code: 'SELF_STRUCTURE_CONTRADICTS_REQUIRED_STRUCTURE',
      message: 'You self-identify as strictly monogamous, but your required partner structure only allows polyamorous partners.',
      fields: ['intention.relationshipStructure', 'preferences.structurePreference'],
      suggestedFix: 'Include monogamous in acceptable partner relationship structures.',
    })
  }

  return contradictions
}

/**
 * Evaluates unidirectional alignment from Evaluator to Target
 */
function evaluateDirection(
  evaluator: UniversalUserProfile,
  target: UniversalUserProfile,
  side: 'A_to_B' | 'B_to_A'
): {
  hardConflicts: HardConflict[]
  dimensionResults: {
    relationship: DimensionResult
    family: DimensionResult
    lifestyle: DimensionResult
    values: DimensionResult
    attraction: DimensionResult
    communication: DimensionResult
    geography: DimensionResult
    temporal: DimensionResult
  }
  totalDirectionalScore: number
  knownWeightTotal: number
  allPossibleWeightTotal: number
  unknownAttributes: string[]
} {
  const hardConflicts: HardConflict[] = []
  const unknownAttributes: string[] = []

  // --- 1. AGE & GENDER ELIGIBILITY ---
  const minAge = evaluator.preferences.minAge
  const maxAge = evaluator.preferences.maxAge
  const ageFlex = evaluator.preferences.ageFlexibilityYears
  const targetAge = target.identity.age

  if (targetAge < minAge - ageFlex || targetAge > maxAge + ageFlex) {
    hardConflicts.push({
      field: 'age',
      evaluatorSide: side,
      evaluatorRequirement: `Age between ${minAge} and ${maxAge} (±${ageFlex} yr flex)`,
      targetValue: `Age ${targetAge}`,
      message: `${evaluator.identity.name} seeks ages ${minAge}–${maxAge}, but ${target.identity.name} is ${targetAge}.`,
    })
  }

  // Gender orientation eligibility
  if (
    evaluator.preferences.gendersSought.length > 0 &&
    !evaluator.preferences.gendersSought.includes(target.identity.gender) &&
    !evaluator.preferences.gendersSought.includes('all')
  ) {
    hardConflicts.push({
      field: 'gender',
      evaluatorSide: side,
      evaluatorRequirement: `Sought genders: ${evaluator.preferences.gendersSought.join(', ')}`,
      targetValue: target.identity.gender,
      message: `${evaluator.identity.name} does not include ${target.identity.gender} in sought genders.`,
    })
  }

  // --- 2. RELATIONSHIP DIMENSION ---
  let relScore = 0.5
  let relSummary = ''
  const relSynergies: string[] = []
  const relFrictions: string[] = []

  const evalIntent = evaluator.intention.primaryIntent.toLowerCase()
  const targetIntent = target.intention.primaryIntent.toLowerCase()

  const structPref = evaluator.preferences.structurePreference
  const targetStruct = target.intention.relationshipStructure

  if (structPref.dealbreaker && !structPref.acceptableStructures.includes(targetStruct)) {
    hardConflicts.push({
      field: 'relationship_structure',
      evaluatorSide: side,
      evaluatorRequirement: `Structure must be in: [${structPref.acceptableStructures.join(', ')}]`,
      targetValue: targetStruct,
      message: `${evaluator.identity.name} has a dealbreaker requiring [${structPref.acceptableStructures.join(', ')}], but ${target.identity.name} is ${targetStruct}.`,
    })
  }

  if (evalIntent === targetIntent) {
    relScore = 1.0
    relSummary = `Aligned intention: ${evaluator.intention.primaryIntent}`
    relSynergies.push(`Identical primary intention (${evaluator.intention.primaryIntent})`)
  } else if (
    (evalIntent.includes('long-term') && targetIntent.includes('casual')) ||
    (evalIntent.includes('casual') && targetIntent.includes('long-term'))
  ) {
    relScore = 0.2
    relSummary = `Divergent intentions (${evaluator.intention.primaryIntent} vs ${target.intention.primaryIntent})`
    relFrictions.push(`Opposite relationship horizons (${evaluator.intention.primaryIntent} vs ${target.intention.primaryIntent})`)
  } else {
    relScore = 0.7
    relSummary = 'Complementary exploratory intentions'
    relSynergies.push('Compatible relational pacing')
  }

  const relationshipDim: DimensionResult = {
    dimensionId: 'relationship',
    name: 'Relationship Alignment',
    score: Math.round(relScore * 100),
    status: 'KNOWN',
    knownWeight: 5,
    statedWeight: 5,
    summary: relSummary,
    synergies: relSynergies,
    frictions: relFrictions,
    unknowns: [],
  }

  // --- 3. FAMILY DIMENSION (Spec §8) ---
  const kidsPref = evaluator.preferences.wantsChildrenPreference
  const targetWantsKids = target.family.wantsChildren
  let familyScore = 0.7
  const famSynergies: string[] = []
  const famFrictions: string[] = []

  if (kidsPref.requirementLevel === 'MUST' || kidsPref.dealbreaker) {
    if (!kidsPref.acceptableAnswers.includes(targetWantsKids)) {
      hardConflicts.push({
        field: 'family_wants_children',
        evaluatorSide: side,
        evaluatorRequirement: `Wants children must be in: [${kidsPref.acceptableAnswers.join(', ')}]`,
        targetValue: targetWantsKids,
        message: `${evaluator.identity.name} strictly requires partner children plans in [${kidsPref.acceptableAnswers.join(', ')}], but ${target.identity.name} is ${targetWantsKids}.`,
      })
    }
  }

  if (evaluator.family.wantsChildren === targetWantsKids) {
    familyScore = 1.0
    famSynergies.push(`Identical family intentions (${targetWantsKids.replace('_', ' ')})`)
  } else if (
    (evaluator.family.wantsChildren === 'definitely_yes' && targetWantsKids === 'definitely_not') ||
    (evaluator.family.wantsChildren === 'definitely_not' && targetWantsKids === 'definitely_yes')
  ) {
    familyScore = 0.1
    famFrictions.push('Irreconcilable children plans (Definite yes vs Definite not)')
  } else {
    familyScore = 0.6
    famFrictions.push('Different but flexible stances on future children')
  }

  const familyDim: DimensionResult = {
    dimensionId: 'family',
    name: 'Family & Children Alignment',
    score: Math.round(familyScore * 100),
    status: 'KNOWN',
    knownWeight: 5,
    statedWeight: 5,
    summary: `Children stance: ${evaluator.family.wantsChildren.replace('_', ' ')} vs ${targetWantsKids.replace('_', ' ')}`,
    synergies: famSynergies,
    frictions: famFrictions,
    unknowns: [],
  }

  // --- 4. LIFESTYLE DIMENSION (Spec §5: Vegetarian distinction) ---
  const smokingPref = evaluator.preferences.smokingPreference
  const targetSmoking = target.lifestyle.smoking

  if (
    (smokingPref.requirementLevel === 'MUST' || smokingPref.dealbreaker) &&
    !smokingPref.allowedSmoking.includes(targetSmoking)
  ) {
    hardConflicts.push({
      field: 'smoking',
      evaluatorSide: side,
      evaluatorRequirement: `Smoking must be in: [${smokingPref.allowedSmoking.join(', ')}]`,
      targetValue: targetSmoking,
      message: `${evaluator.identity.name} has a dealbreaker against smoking (${targetSmoking}).`,
    })
  }

  const dietPref = evaluator.preferences.dietPreference
  const targetDiet = target.lifestyle.diet
  let dietScore = 1.0
  const lifeSynergies: string[] = []
  const lifeFrictions: string[] = []

  if (dietPref.requirementLevel === 'MUST' && !dietPref.preferredDiets.includes(targetDiet)) {
    hardConflicts.push({
      field: 'diet',
      evaluatorSide: side,
      evaluatorRequirement: `Requires diet in: [${dietPref.preferredDiets.join(', ')}]`,
      targetValue: targetDiet,
      message: `${evaluator.identity.name} requires a partner who is ${dietPref.preferredDiets.join('/')}, but ${target.identity.name} is ${targetDiet}.`,
    })
  } else if (dietPref.requirementLevel === 'PREFERENCE') {
    if (dietPref.preferredDiets.includes(targetDiet)) {
      dietScore = 1.0
      lifeSynergies.push(`Shared dietary lifestyle (${targetDiet})`)
    } else {
      // Controlled relaxation based on flexibility (0 to 100)
      const flexDecay = (100 - dietPref.flexibility) / 100
      dietScore = Math.max(0.2, 1.0 - flexDecay * 0.7)
      lifeFrictions.push(`Diet divergence (${evaluator.lifestyle.diet} vs ${targetDiet}, within stated flexibility)`)
    }
  } else if (dietPref.requirementLevel === 'NEUTRAL') {
    dietScore = 1.0 // "I don't care"
  }

  // Pets & Cleanliness
  let petScore = 1.0
  if (
    evaluator.lifestyle.petAllergies.length > 0 &&
    target.lifestyle.pets.some((p) => evaluator.lifestyle.petAllergies.includes(p))
  ) {
    petScore = 0.3
    lifeFrictions.push(`Pet allergy tension (${evaluator.lifestyle.petAllergies.join(', ')} allergy vs pet owner)`)
  }

  const cleanDiff = Math.abs(evaluator.lifestyle.cleanlinessStandard - target.lifestyle.cleanlinessStandard)
  const cleanScore = Math.max(0.3, 1.0 - cleanDiff * 0.2)

  const combinedLifestyleScore = (dietScore * 4 + cleanScore * 3 + petScore * 3) / 10
  const lifestyleDim: DimensionResult = {
    dimensionId: 'lifestyle',
    name: 'Lifestyle & Habits',
    score: Math.round(combinedLifestyleScore * 100),
    status: 'KNOWN',
    knownWeight: 4,
    statedWeight: 4,
    summary: `Diet: ${targetDiet}, Smoking: ${targetSmoking}, Cleanliness: ${target.lifestyle.cleanlinessStandard}/5`,
    synergies: lifeSynergies,
    frictions: lifeFrictions,
    unknowns: [],
  }

  // --- 5. VALUES DIMENSION ---
  const evalValues = evaluator.values.coreValues
  const targetValues = target.values.coreValues
  const sharedValues = evalValues.filter((v) => targetValues.includes(v))
  const valueSynergies: string[] = []
  const valueFrictions: string[] = []

  let valScore = 0.5
  if (sharedValues.length >= 3) {
    valScore = 1.0
    valueSynergies.push(`Strong overlap in core values (${sharedValues.join(', ')})`)
  } else if (sharedValues.length > 0) {
    valScore = 0.75
    valueSynergies.push(`Shared values: ${sharedValues.join(', ')}`)
  } else {
    valScore = 0.4
    valueFrictions.push('Different philosophical & value priorities')
  }

  const valuesDim: DimensionResult = {
    dimensionId: 'values',
    name: 'Core Values & Philosophy',
    score: Math.round(valScore * 100),
    status: 'KNOWN',
    knownWeight: evaluator.preferences.valuesWeight || 4,
    statedWeight: evaluator.preferences.valuesWeight || 4,
    summary: `${sharedValues.length} shared core values (${sharedValues.join(', ') || 'Independent paths'})`,
    synergies: valueSynergies,
    frictions: valueFrictions,
    unknowns: [],
  }

  // --- 6. ATTRACTION MODALITIES (Spec §12) ---
  const attrA = evaluator.attractionPreferences
  const attrB = target.attractionPreferences
  // Dot product of attraction weights normalized
  const modalities = ['physical', 'emotional', 'intellectual', 'romantic', 'sexual', 'social'] as const
  let attrDot = 0
  let attrMax = 0
  const attrSynergies: string[] = []

  modalities.forEach((m) => {
    const diff = Math.abs(attrA[m] - attrB[m])
    const match = 1.0 - diff / 4
    attrDot += match * attrA[m]
    attrMax += attrA[m]
  })
  const attractionScore = attrMax > 0 ? attrDot / attrMax : 0.8
  if (attrA.intellectual >= 4 && attrB.intellectual >= 4) {
    attrSynergies.push('Mutual high value on intellectual resonance')
  }
  if (attrA.emotional >= 4 && attrB.emotional >= 4) {
    attrSynergies.push('Shared prioritization of emotional depth')
  }

  const attractionDim: DimensionResult = {
    dimensionId: 'attraction',
    name: 'Multi-Modal Attraction',
    score: Math.round(attractionScore * 100),
    status: 'KNOWN',
    knownWeight: 3,
    statedWeight: 3,
    summary: 'Harmonious multi-modal attraction profile across 6 dimensions',
    synergies: attrSynergies,
    frictions: [],
    unknowns: [],
  }

  // --- 7. COMMUNICATION DIMENSION ---
  let commScore = 0.6
  const commSynergies: string[] = []
  const commFrictions: string[] = []

  if (evaluator.communication.conflictStyle === target.communication.conflictStyle) {
    commScore = 1.0
    commSynergies.push(`Compatible conflict resolution style (${evaluator.communication.conflictStyle.replace('_', ' ')})`)
  } else if (
    (evaluator.communication.conflictStyle === 'direct_immediate' &&
      target.communication.conflictStyle === 'space_first') ||
    (evaluator.communication.conflictStyle === 'space_first' &&
      target.communication.conflictStyle === 'direct_immediate')
  ) {
    commScore = 0.5
    commFrictions.push('Differing pacing in conflict: immediate vs needing initial space')
  } else {
    commScore = 0.8
    commSynergies.push('Complementary communication cadences')
  }

  const communicationDim: DimensionResult = {
    dimensionId: 'communication',
    name: 'Communication & Conflict',
    score: Math.round(commScore * 100),
    status: 'KNOWN',
    knownWeight: evaluator.preferences.communicationWeight || 4,
    statedWeight: evaluator.preferences.communicationWeight || 4,
    summary: `Conflict style: ${evaluator.communication.conflictStyle.replace('_', ' ')} vs ${target.communication.conflictStyle.replace('_', ' ')}`,
    synergies: commSynergies,
    frictions: commFrictions,
    unknowns: [],
  }

  // --- 8. GEOGRAPHIC FEASIBILITY ---
  const distanceKm = calculateHaversineDistance(
    evaluator.geography.coordinates.lat,
    evaluator.geography.coordinates.lng,
    target.geography.coordinates.lat,
    target.geography.coordinates.lng
  )

  const maxDist = evaluator.geography.maxDistanceKm
  const flexDist = evaluator.geography.distanceFlexibilityKm
  let geoScore = 1.0
  const geoFrictions: string[] = []
  const geoSynergies: string[] = []

  if (distanceKm > maxDist + flexDist && !evaluator.geography.openToLongDistance) {
    hardConflicts.push({
      field: 'distance',
      evaluatorSide: side,
      evaluatorRequirement: `Max distance ${maxDist} km (+${flexDist} km flex)`,
      targetValue: `${distanceKm} km`,
      message: `${target.identity.name} is ${distanceKm} km away, exceeding ${evaluator.identity.name}'s maximum boundary of ${maxDist + flexDist} km.`,
    })
  }

  if (distanceKm <= maxDist) {
    geoScore = 1.0 - 0.2 * (distanceKm / Math.max(maxDist, 1))
    geoSynergies.push(`Proximate location (${distanceKm} km away)`)
  } else if (distanceKm <= maxDist + flexDist) {
    const excess = distanceKm - maxDist
    geoScore = Math.max(0.2, 0.8 - (excess / (flexDist + 1)) * 0.6)
    geoFrictions.push(`Distance (${distanceKm} km) exceeds standard limit of ${maxDist} km, within ±${flexDist} km flexibility`)
  } else {
    geoScore = 0.1
    geoFrictions.push(`Significant distance (${distanceKm} km away)`)
  }

  const geographyDim: DimensionResult = {
    dimensionId: 'geography',
    name: 'Geographic Feasibility',
    score: Math.round(geoScore * 100),
    status: 'KNOWN',
    knownWeight: 5,
    statedWeight: 5,
    summary: `${distanceKm} km distance between ${evaluator.geography.cityName} and ${target.geography.cityName}`,
    synergies: geoSynergies,
    frictions: geoFrictions,
    unknowns: [],
  }

  // --- 9. TEMPORAL FEASIBILITY ---
  let tempScore = 0.8
  const tempSynergies: string[] = []
  const tempFrictions: string[] = []

  if (evaluator.accessibility.sleepChronotype === target.accessibility.sleepChronotype) {
    tempScore = 1.0
    tempSynergies.push(`Synchronized sleep chronotype (${target.accessibility.sleepChronotype.replace('_', ' ')})`)
  } else if (
    (evaluator.accessibility.sleepChronotype === 'morning_lark' &&
      target.accessibility.sleepChronotype === 'night_owl') ||
    (evaluator.accessibility.sleepChronotype === 'night_owl' &&
      target.accessibility.sleepChronotype === 'morning_lark')
  ) {
    tempScore = 0.5
    tempFrictions.push('Asymmetric diurnal rhythms (Morning lark vs Night owl)')
  }

  const temporalDim: DimensionResult = {
    dimensionId: 'temporal',
    name: 'Temporal Feasibility & Rhythm',
    score: Math.round(tempScore * 100),
    status: 'KNOWN',
    knownWeight: 2,
    statedWeight: 2,
    summary: `Chronotype: ${evaluator.accessibility.sleepChronotype.replace('_', ' ')} vs ${target.accessibility.sleepChronotype.replace('_', ' ')}`,
    synergies: tempSynergies,
    frictions: tempFrictions,
    unknowns: [],
  }

  // Calculate Weighted Sum for Direction
  const dims = [
    relationshipDim,
    familyDim,
    lifestyleDim,
    valuesDim,
    attractionDim,
    communicationDim,
    geographyDim,
    temporalDim,
  ]

  let weightedSum = 0
  let knownWeight = 0
  let possibleWeight = 0

  dims.forEach((d) => {
    possibleWeight += d.statedWeight
    if (d.score !== null) {
      weightedSum += d.score * d.knownWeight
      knownWeight += d.knownWeight
    }
  })

  const totalDirectionalScore = knownWeight > 0 ? Math.round(weightedSum / knownWeight) : 50

  return {
    hardConflicts,
    dimensionResults: {
      relationship: relationshipDim,
      family: familyDim,
      lifestyle: lifestyleDim,
      values: valuesDim,
      attraction: attractionDim,
      communication: communicationDim,
      geography: geographyDim,
      temporal: temporalDim,
    },
    totalDirectionalScore,
    knownWeightTotal: knownWeight,
    allPossibleWeightTotal: possibleWeight,
    unknownAttributes,
  }
}

/**
 * Evaluates bidirectional compatibility between User A and User B (Spec §7, §10, §15)
 */
export function evaluateMatch(
  userA: UniversalUserProfile,
  userB: UniversalUserProfile
): MatchEvaluation {
  // Check preference contradictions for User A
  const contradictionsA = detectUserContradictions(userA)

  // Direction A -> B
  const evalAtoB = evaluateDirection(userA, userB, 'A_to_B')
  // Direction B -> A
  const evalBtoA = evaluateDirection(userB, userA, 'B_to_A')

  // Combine Hard Conflicts
  const hardConflicts = [...evalAtoB.hardConflicts, ...evalBtoA.hardConflicts]
  const eligible = hardConflicts.length === 0

  const scoreAtoB = eligible ? evalAtoB.totalDirectionalScore : 0
  const scoreBtoA = eligible ? evalBtoA.totalDirectionalScore : 0

  // Mutuality Aggregation using Harmonic Mean (Spec §10)
  // H(A, B) = 2 * (A * B) / (A + B)
  let mutualScore: number | null = 0
  if (eligible && scoreAtoB > 0 && scoreBtoA > 0) {
    mutualScore = Math.round((2 * scoreAtoB * scoreBtoA) / (scoreAtoB + scoreBtoA))
  } else {
    mutualScore = 0
  }

  const gap = Math.abs(scoreAtoB - scoreBtoA)
  const asymmetric = gap >= 25

  // Epistemic Confidence Calculation (Spec §11)
  const ratioA = evalAtoB.knownWeightTotal / Math.max(evalAtoB.allPossibleWeightTotal, 1)
  const ratioB = evalBtoA.knownWeightTotal / Math.max(evalBtoA.allPossibleWeightTotal, 1)
  const minRatio = Math.min(ratioA, ratioB)
  const verificationFactor = userA.identity.verified && userB.identity.verified ? 1.0 : 0.85
  const confidenceScore = Math.round(minRatio * 100 * verificationFactor)

  let confidenceRating: 'LOW' | 'MODERATE' | 'HIGH' = 'MODERATE'
  if (confidenceScore >= 75) confidenceRating = 'HIGH'
  else if (confidenceScore < 50) confidenceRating = 'LOW'

  // Synthesize Dimensions (Average scores, aggregate synergies and frictions)
  const mergeDim = (dA: DimensionResult, dB: DimensionResult): DimensionResult => ({
    dimensionId: dA.dimensionId,
    name: dA.name,
    score: dA.score !== null && dB.score !== null ? Math.round((dA.score + dB.score) / 2) : dA.score,
    status: dA.status === 'KNOWN' && dB.status === 'KNOWN' ? 'KNOWN' : 'PARTIAL',
    knownWeight: dA.knownWeight,
    statedWeight: dA.statedWeight,
    summary: dA.summary,
    synergies: Array.from(new Set([...dA.synergies, ...dB.synergies])),
    frictions: Array.from(new Set([...dA.frictions, ...dB.frictions])),
    unknowns: Array.from(new Set([...dA.unknowns, ...dB.unknowns])),
  })

  const relationshipAlignment = mergeDim(evalAtoB.dimensionResults.relationship, evalBtoA.dimensionResults.relationship)
  const familyAlignment = mergeDim(evalAtoB.dimensionResults.family, evalBtoA.dimensionResults.family)
  const lifestyleAlignment = mergeDim(evalAtoB.dimensionResults.lifestyle, evalBtoA.dimensionResults.lifestyle)
  const valueAlignment = mergeDim(evalAtoB.dimensionResults.values, evalBtoA.dimensionResults.values)
  const attraction = mergeDim(evalAtoB.dimensionResults.attraction, evalBtoA.dimensionResults.attraction)
  const communicationAlignment = mergeDim(evalAtoB.dimensionResults.communication, evalBtoA.dimensionResults.communication)
  const geographicFeasibility = mergeDim(evalAtoB.dimensionResults.geography, evalBtoA.dimensionResults.geography)
  const temporalFeasibility = mergeDim(evalAtoB.dimensionResults.temporal, evalBtoA.dimensionResults.temporal)

  // Preference Alignment synthesized
  const preferenceAlignment: DimensionResult = {
    dimensionId: 'preferences',
    name: 'General Preference Alignment',
    score: Math.round((lifestyleAlignment.score! + relationshipAlignment.score!) / 2),
    status: 'KNOWN',
    knownWeight: 4,
    statedWeight: 4,
    summary: 'Consolidated alignment across stated partner criteria',
    synergies: [...lifestyleAlignment.synergies],
    frictions: [...lifestyleAlignment.frictions],
    unknowns: [],
  }

  // Construct Structured Explanation (Spec §15)
  const allSynergies = [
    ...relationshipAlignment.synergies,
    ...valueAlignment.synergies,
    ...lifestyleAlignment.synergies,
    ...communicationAlignment.synergies,
    ...geographicFeasibility.synergies,
    ...temporalFeasibility.synergies,
    ...attraction.synergies,
  ]

  const allFrictions = [
    ...relationshipAlignment.frictions,
    ...familyAlignment.frictions,
    ...lifestyleAlignment.frictions,
    ...communicationAlignment.frictions,
    ...geographicFeasibility.frictions,
    ...temporalFeasibility.frictions,
  ]

  let whyRecommended = ''
  if (!eligible) {
    whyRecommended = `Not recommended due to ${hardConflicts.length} hard boundary exclusion(s).`
  } else if (asymmetric) {
    whyRecommended = `Asymmetric compatibility noted: strong satisfaction in one direction (${Math.max(scoreAtoB, scoreBtoA)}%) with divergent criteria in the reverse (${Math.min(scoreAtoB, scoreBtoA)}%).`
  } else if (mutualScore >= 80) {
    whyRecommended = `High mutual alignment in ${relationshipAlignment.name.toLowerCase()} and shared core values with compatible life rhythms.`
  } else {
    whyRecommended = 'Moderate mutual alignment with complementary growth perspectives and shared conversational openness.'
  }

  const explanation: MatchExplanation = {
    whyRecommended,
    strongAlignment: allSynergies.slice(0, 5),
    potentialFriction: allFrictions.slice(0, 3),
    unknownInformation: [...evalAtoB.unknownAttributes, ...evalBtoA.unknownAttributes],
    confidenceRationale: `Evaluation backed by ${confidenceScore}% profile completeness with ${userB.identity.verified ? 'verified' : 'unverified'} identity data.`,
  }

  return {
    eligible,
    hardConflicts,
    compatibility: {
      aToB: scoreAtoB,
      bToA: scoreBtoA,
    },
    mutuality: {
      score: mutualScore,
      method: 'harmonic_mean',
      asymmetric,
      gap,
    },
    attraction,
    preferenceAlignment,
    valueAlignment,
    lifestyleAlignment,
    relationshipAlignment,
    familyAlignment,
    communicationAlignment,
    geographicFeasibility,
    temporalFeasibility,
    uncertainty: {
      unknownAttributes: Array.from(new Set([...evalAtoB.unknownAttributes, ...evalBtoA.unknownAttributes])),
      coverageAtoB: ratioA,
      coverageBtoA: ratioB,
    },
    confidence: {
      score: confidenceScore,
      rating: confidenceRating,
    },
    contradictions: contradictionsA,
    explanation,
  }
}
