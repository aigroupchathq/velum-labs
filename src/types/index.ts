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
    ethnicity?: string // e.g. "Caucasian / White", "Black / African Descent", "East Asian", etc.
    culturalBackground?: string
    languages: { code: string; name: string; proficiency: 'native' | 'fluent' | 'conversational' }[]
  }
  
  // 2. Relationship Objective & Intention
  intention: {
    primaryIntent: string // e.g. "Long-Term Partnership / Marriage", "Intentional Discovery", "Casual"
    relationshipStructure: 'monogamous' | 'polyamorous' | 'enm' | 'flexible' | 'undecided'
    intentFlexibility: number // 0 to 100
  }

  // 3. Attraction Preferences (Spec §12)
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
    cleanlinessStandard: 1 | 2 | 3 | 4 | 5 // 1=relaxed to 5=immaculate
    pets: string[] // e.g. ['dog', 'cat']
    petAllergies: string[]
  }

  // 6. Values & Philosophy
  values: {
    coreValues: string[] // e.g. ['Integrity', 'Autonomy', 'Compassion', 'Growth']
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
    ethnicitiesSought?: string[] // e.g. ["Caucasian / White", "Any"]
    minAge: number
    maxAge: number
    ageFlexibilityYears: number
    acceptablePartnerAgeRange?: { min: number; max: number } // explicitly what user is open to receiving
    
    // Diet preference (Spec §5: distinguish "I am", "I prefer", "I require", "I don't care")
    dietPreference: {
      preferredDiets: string[]
      requirementLevel: RequirementLevel
      flexibility: number // 0 to 100
    }

    // Smoking requirement / preference
    smokingPreference: {
      allowedSmoking: string[]
      requirementLevel: RequirementLevel
      dealbreaker: boolean
    }

    // Family / Children preference
    wantsChildrenPreference: {
      acceptableAnswers: string[]
      requirementLevel: RequirementLevel
      dealbreaker: boolean
    }

    // Relationship Structure preference
    structurePreference: {
      acceptableStructures: string[]
      requirementLevel: RequirementLevel
      dealbreaker: boolean
    }

    // Religion & Values preferences
    valuesWeight: number // 1 to 5
    communicationWeight: number // 1 to 5
  }

  // 12. Privacy Controls & Safety Settings (Spec §19, §20)
  privacy: {
    incognitoMode: boolean
    fuzzLocationRadiusKm: number
  }

  // 13. Behavioral History (System Derived, Spec §22, §45)
  behaviour: {
    responseRatePercent: number
    averageResponseHours: number
    ghostingReportsCount: number
    handshakesInitiated: number
  }
}

// --- EVALUATION OUTPUT STRUCTURES (Spec §7, §11, §15) ---

export interface DimensionResult {
  dimensionId: string
  name: string
  score: number | null // null when UNKNOWN (Spec §9)
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
  consentGivenBy: string[] // user IDs
  sharedPrompts: string[]
  messages: DyadMessage[]
  closureReason?: string
}
