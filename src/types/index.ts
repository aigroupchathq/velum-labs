// Universal Compatibility Platform: Core Type Definitions
// Governing Standards: Master Build Specification §1, §4, §5, §6, §7, §11, §12, §13, §14, §15

export type RequirementLevel =
  | 'MUST'
  | 'STRONG_PREFERENCE'
  | 'PREFERENCE'
  | 'NEUTRAL'
  | 'AVOID'
  | 'UNKNOWN'

export type AttractionModality =
  | 'physical'
  | 'emotional'
  | 'intellectual'
  | 'romantic'
  | 'sexual'
  | 'social'

// --- PHASE 2 EPISTEMIC MEASUREMENT & PROVENANCE TYPES ---
export type ObservationState =
  | 'observed'
  | 'not_observed'
  | 'declined'
  | 'not_applicable'

export type AttributeProvenance =
  | 'self_report'
  | 'behavioral_inference'
  | 'third_party_verified'

export interface AttributeObservation<T = any> {
  value: T
  state: ObservationState
  provenance: AttributeProvenance
  confidence: number // 0.0 to 1.0 epistemic measurement confidence
  observedAt?: string
}

export interface DistanceCoarseningZone {
  exactDistanceKm: number
  coarsenedBand: '< 5 km' | '5–15 km' | '15–30 km' | '30–50 km' | '50+ km'
  fuzzedCoordinates: { lat: number; lng: number }
}

export interface AttractionProfile {
  physical: number // 1 to 5 importance
  emotional: number
  intellectual: number
  romantic: number
  sexual: number
  social: number
}

export interface PreferenceItem<T = any> {
  attributeId: string
  targetValue: T
  importance: number // 1 to 5
  requirementLevel: RequirementLevel
  flexibility: number // 0 to 100%
  dealbreaker: boolean
  privacySetting?: 'private' | 'matches_only' | 'public'
}

export interface UserAttributeDeclaration<T = any> {
  attributeId: string
  value: T
  permDisplay: boolean
  permMatchable: boolean
  permSearchable: boolean
  isSensitive?: boolean
}

// Full Structured User Model (Spec §6)
export interface UniversalUserProfile {
  id: string
  completionStage: number
  // 1. Identity
  identity: {
    name: string
    age: number
    gender: string
    genderPresentation?: string
    pronouns: string
    bio: string
    photos: string[]
    verified: boolean
    ethnicity?: string
    culturalBackground?: string
    languages: { code: string; name: string; proficiency: 'native' | 'fluent' | 'conversational' }[]
  }
  
  // 2. Relationship Objective & Intention
  intention: {
    primaryIntent: string
    relationshipStructure: 'monogamous' | 'polyamorous' | 'enm' | 'flexible' | 'undecided'
    intentFlexibility: number
  }

  // 3. Attraction Preferences
  attractionPreferences: AttractionProfile

  // 4. Family Plans
  family: {
    hasChildren: 'none' | 'has_custodial' | 'has_shared' | 'has_adult'
    wantsChildren: 'definitely_yes' | 'leaning_yes' | 'unsure' | 'leaning_no' | 'definitely_not'
  }

  // 5. Lifestyle & Daily Ecology
  lifestyle: {
    diet: 'omnivore' | 'vegetarian' | 'vegan' | 'pescatarian' | 'other'
    smoking: 'never' | 'socially' | 'regularly' | 'quitting'
    alcohol: 'sober' | 'occasional' | 'moderate' | 'frequent'
    cannabis: 'never' | 'socially' | 'regularly'
    cleanlinessStandard: 1 | 2 | 3 | 4 | 5
    pets: string[]
    petAllergies: string[]
  }

  // 6. Values & Philosophy
  values: {
    coreValues: string[]
    religion?: string
    religiousObservance?: 1 | 2 | 3 | 4 | 5
    worldview?: string
    politicalCivic?: string
  }

  // 7. Communication & Cognition
  communication: {
    conflictStyle: 'direct_immediate' | 'reflective_deliberate' | 'space_first' | 'diplomatic'
    digitalCadence: 'frequent' | 'regular_intervals' | 'end_of_day' | 'minimal_in_person'
    loveLanguages: string[]
    neurotype?: string[]
  }

  // 8. Accessibility & Health
  accessibility: {
    stepFreeRequired: boolean
    sensoryCalmRequired: boolean
    aslRequired: boolean
    sleepChronotype: 'morning_lark' | 'intermediate' | 'night_owl'
  }

  // 9. Geography & Mobility
  geography: {
    cityName: string
    coordinates: { lat: number; lng: number }
    maxDistanceKm: number
    distanceFlexibilityKm: number
    openToRelocation: boolean
    openToLongDistance: boolean
  }

  // 10. Availability & Temporal
  availability: {
    workSchedule: 'standard_daytime' | 'night_shift' | 'rotating_shifts' | 'flexible'
    freeHoursPerWeek: number
    preferredMeetingFormat: 'direct_coffee' | 'video_call_first' | 'thoughtful_messaging_first'
  }

  // 11. Stated Preferences (Targeting Partners)
  preferences: {
    gendersSought: string[]
    ethnicitiesSought?: string[]
    minAge: number
    maxAge: number
    ageFlexibilityYears: number
    acceptablePartnerAgeRange?: { min: number; max: number }
    
    dietPreference: {
      preferredDiets: string[]
      requirementLevel: RequirementLevel
      flexibility: number
    }

    smokingPreference: {
      allowedSmoking: string[]
      requirementLevel: RequirementLevel
      dealbreaker: boolean
    }

    wantsChildrenPreference: {
      acceptableAnswers: string[]
      requirementLevel: RequirementLevel
      dealbreaker: boolean
    }

    structurePreference: {
      acceptableStructures: string[]
      requirementLevel: RequirementLevel
      dealbreaker: boolean
    }

    valuesWeight: number
    communicationWeight: number
  }

  // 12. Privacy Controls & Safety Settings
  privacy: {
    incognitoMode: boolean
    fuzzLocationRadiusKm: number
  }

  // 13. Behavioral History
  behaviour: {
    responseRatePercent: number
    averageResponseHours: number
    ghostingReportsCount: number
    handshakesInitiated: number
  }
}

// --- PHASE 2 DECOUPLED PROFILES (Y_i Self-Supply vs X_i Partner-Demand) ---

export interface SelfSupplyProfile {
  identity: UniversalUserProfile['identity']
  intention: UniversalUserProfile['intention']
  family: UniversalUserProfile['family']
  lifestyle: UniversalUserProfile['lifestyle']
  values: UniversalUserProfile['values']
  communication: UniversalUserProfile['communication']
  accessibility: UniversalUserProfile['accessibility']
  geography: UniversalUserProfile['geography']
  availability: UniversalUserProfile['availability']
}

export interface PartnerDemandProfile {
  attractionPreferences: AttractionProfile
  preferences: UniversalUserProfile['preferences']
}

export interface DecoupledUserProfile {
  userId: string
  completionStage: number
  selfSupply: SelfSupplyProfile // Y_i
  partnerDemand: PartnerDemandProfile // X_i
  privacy: UniversalUserProfile['privacy']
  behaviour: UniversalUserProfile['behaviour']
}

/**
 * Decouples a monolithic profile into explicit Self-Supply (Y_i) and Partner-Demand (X_i)
 */
export function decoupleProfile(profile: UniversalUserProfile): DecoupledUserProfile {
  return {
    userId: profile.id,
    completionStage: profile.completionStage,
    selfSupply: {
      identity: profile.identity,
      intention: profile.intention,
      family: profile.family,
      lifestyle: profile.lifestyle,
      values: profile.values,
      communication: profile.communication,
      accessibility: profile.accessibility,
      geography: profile.geography,
      availability: profile.availability,
    },
    partnerDemand: {
      attractionPreferences: profile.attractionPreferences,
      preferences: profile.preferences,
    },
    privacy: profile.privacy,
    behaviour: profile.behaviour,
  }
}

/**
 * Reconstitutes a DecoupledUserProfile back into a UniversalUserProfile
 */
export function reconstituteProfile(decoupled: DecoupledUserProfile): UniversalUserProfile {
  return {
    id: decoupled.userId,
    completionStage: decoupled.completionStage,
    identity: decoupled.selfSupply.identity,
    intention: decoupled.selfSupply.intention,
    attractionPreferences: decoupled.partnerDemand.attractionPreferences,
    family: decoupled.selfSupply.family,
    lifestyle: decoupled.selfSupply.lifestyle,
    values: decoupled.selfSupply.values,
    communication: decoupled.selfSupply.communication,
    accessibility: decoupled.selfSupply.accessibility,
    geography: decoupled.selfSupply.geography,
    availability: decoupled.selfSupply.availability,
    preferences: decoupled.partnerDemand.preferences,
    privacy: decoupled.privacy,
    behaviour: decoupled.behaviour,
  }
}

// --- EVALUATION OUTPUT STRUCTURES (Spec §7, §11, §15) ---

export interface DimensionResult {
  dimensionId: string
  name: string
  score: number | null
  status: 'KNOWN' | 'PARTIAL' | 'UNKNOWN'
  knownWeight: number
  statedWeight: number
  summary: string
  synergies: string[]
  frictions: string[]
  unknowns: string[]
}

export interface HardConflict {
  field: string
  evaluatorSide: 'A_to_B' | 'B_to_A'
  evaluatorRequirement: string
  targetValue: string
  message: string
}

export interface PreferenceContradiction {
  code: string
  message: string
  fields: string[]
  suggestedFix: string
}

export interface MatchExplanation {
  whyRecommended: string
  strongAlignment: string[]
  potentialFriction: string[]
  unknownInformation: string[]
  confidenceRationale: string
}

export interface MatchEvaluation {
  eligible: boolean
  hardConflicts: HardConflict[]
  compatibility: {
    aToB: number | null
    bToA: number | null
  }
  mutuality: {
    score: number | null
    method: 'harmonic_mean' | 'geometric_mean' | 'arithmetic_mean' | 'minimum'
    asymmetric: boolean
    gap: number | null
  }
  attraction: DimensionResult
  preferenceAlignment: DimensionResult
  valueAlignment: DimensionResult
  lifestyleAlignment: DimensionResult
  relationshipAlignment: DimensionResult
  familyAlignment: DimensionResult
  communicationAlignment: DimensionResult
  geographicFeasibility: DimensionResult
  temporalFeasibility: DimensionResult
  uncertainty: {
    unknownAttributes: string[]
    coverageAtoB: number
    coverageBtoA: number
  }
  confidence: {
    score: number
    rating: 'LOW' | 'MODERATE' | 'HIGH'
  }
  contradictions: PreferenceContradiction[]
  explanation: MatchExplanation
}

export interface RecommendedCandidate {
  candidate: UniversalUserProfile
  evaluation: MatchEvaluation
}

export interface DyadMessage {
  id: string
  senderId: string
  recipientId: string
  content: string
  timestamp: string
  isPromptAnswer?: boolean
  promptTopic?: string
}

export interface DyadConversation {
  id: string
  partnerId: string
  status: 'pending_consent' | 'active' | 'closed_gracefully'
  createdAt: string
  lastActivity: string
  consentGivenBy: string[]
  sharedPrompts: string[]
  messages: DyadMessage[]
  closureReason?: string
}
