export interface Profile {
  id: string
  name: string
  age: number
  bio: string
  distance: number
  location: string
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
}

export interface UserProfile {
  name: string
  age: number
  bio: string
  photos: string[]
  occupation: string
  school: string
  passions: string[]
}

export type SwipeAction = 'like' | 'nope' | 'superlike'
export type ActiveTab = 'recs' | 'explore' | 'likes' | 'profile'
