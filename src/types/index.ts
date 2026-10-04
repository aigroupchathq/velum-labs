export interface Profile {
  id: string
  name: string
  age: number
  bio: string
  distance: number
  location: string
  gender?: 'woman' | 'man' | 'nonbinary'
  occupation?: string
  company?: string
  school?: string
  verified: boolean
  photos: string[]
  passions: string[]
  basics?: {
    zodiac?: string
    education?: string
    drinking?: string
    smoking?: string
    workout?: string
    pets?: string
    height?: string
    communication?: string
    loveLanguage?: string
  }
  anthem?: {
    title: string
    artist: string
    coverUrl: string
  }
  intent?: string
  prompts?: {
    question: string
    answer: string
  }[]
  // Candidate's own partner criteria (for Mutuality B -> A)
  partnerCriteria?: {
    minAge?: number
    maxAge?: number
    maxDistance?: number
    acceptableIntents?: string[]
    strictNonSmoker?: boolean
    preferredPassions?: string[]
  }
}

export interface Match {
  id: string
  profile: Profile
  matchedAt: string
  unreadCount: number
  lastMessage?: string
  lastMessageTime?: string
}

export interface Message {
  id: string
  matchId: string
  sender: 'user' | 'match'
  text: string
  timestamp: string
  isGif?: boolean
  mediaUrl?: string
}

export interface UserPreferences {
  maxDistance: number
  minAge: number
  maxAge: number
  showMe: 'women' | 'men' | 'everyone'
  soundEnabled: boolean
  darkMode: boolean
  incognito: boolean
  
  // Advanced Matching Framework Settings
  hardRequirements: {
    ageRange: boolean
    distance: boolean
    nonSmoker: boolean
    relationshipIntent: boolean
  }
  flexibilityMargins: {
    age: number // ± years of controlled relaxation
    distance: number // ± miles of controlled relaxation
  }
  strongPreferences: {
    intent: boolean
    lifestyle: boolean
  }
}

export interface UserProfile {
  name: string
  age: number
  gender?: 'woman' | 'man' | 'nonbinary'
  bio: string
  photos: string[]
  occupation: string
  school: string
  passions: string[]
  smoking?: string
  drinking?: string
  workout?: string
  intent?: string
  distance?: number
}

export type SwipeAction = 'like' | 'nope' | 'superlike'
export type ActiveTab = 'recs' | 'explore' | 'likes' | 'profile'

// --- MATCHING ENGINE FRAMEWORK TYPES ---

export type CriterionTier = 'HARD_REQUIREMENT' | 'STRONG_PREFERENCE' | 'NORMAL_PREFERENCE'

export interface ConflictItem {
  id: string
  field: string
  severity: 'dealbreaker' | 'strong_conflict' | 'moderate_conflict'
  message: string
  side: 'A_to_B' | 'B_to_A' | 'mutual'
}

export interface EvaluatedCriterion {
  field: string
  label: string
  tier: CriterionTier
  score: number // 0 to 1
  weight: number
  isKnown: boolean
  isExcluded: boolean
  relaxed: boolean
  detail: string
}

export interface CompatibilityReport {
  isExcluded: boolean
  exclusionReasons: string[]
  
  // Mutuality Breakdown
  scoreAtoB: number // 0 - 100
  scoreBtoA: number // 0 - 100
  mutualScore: number // 0 - 100 (Harmonic Mean of A->B and B->A)
  
  // Confidence (Evaluated separately from compatibility)
  confidenceScore: number // 0 - 100
  confidenceRating: 'High' | 'Moderate' | 'Low'
  knownCriteriaCount: number
  totalCriteriaCount: number
  unknownAttributes: string[]
  
  // Categorized breakdown
  hardRequirements: EvaluatedCriterion[]
  strongPreferences: EvaluatedCriterion[]
  normalPreferences: EvaluatedCriterion[]
  
  // Explicitly Identified Conflicts
  conflicts: ConflictItem[]
}
