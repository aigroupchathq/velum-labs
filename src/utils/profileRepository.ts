// ============================================================================
// src/utils/profileRepository.ts
// Checkmate Client-First Persistence Layer
// Saves user profile, psychological vision state, and settings to localStorage.
// Provides 1-click restore to demo defaults.
// ============================================================================

import type { UniversalUserProfile } from '../types'

const KEYS = {
  PROFILE: 'checkmate_user_profile_v1',
  VISION: 'checkmate_relationship_vision_v1',
  SETTINGS: 'checkmate_app_settings_v1',
} as const

export interface RelationshipVisionData {
  partnershipType: string
  cohabitationVision: string
  financePhilosophy: string
  reassuranceCadence: string
  conflictStyle: string
  rechargeStyle: string
  acknowledgedPatterns: string[]
}

export interface AppSettingsData {
  themeMode: 'dark' | 'midnight' | 'contrast'
  notifications: {
    mutualAlignments: boolean
    thoughtfulMessages: boolean
    dateProposals: boolean
    dailySanctuaryDigest: boolean
  }
}

export const DEFAULT_RELATIONSHIP_VISION: RelationshipVisionData = {
  partnershipType: 'Deep Companionship & Co-Creation',
  cohabitationVision: 'Shared home with dedicated quiet nooks',
  financePhilosophy: 'Proportional shared pool with open transparency',
  reassuranceCadence: 'Warm daily check-ins (1–2 thoughtful messages)',
  conflictStyle: 'Needs 20-min cool-down before speaking calmly',
  rechargeStyle: 'Parallel play (reading/working quietly in the same room)',
  acknowledgedPatterns: [
    'Confusing emotional adrenaline with genuine long-term fit',
    'Ignoring mismatched family timelines early on',
  ],
}

export const DEFAULT_APP_SETTINGS: AppSettingsData = {
  themeMode: 'dark',
  notifications: {
    mutualAlignments: true,
    thoughtfulMessages: true,
    dateProposals: true,
    dailySanctuaryDigest: false,
  },
}

export const profileRepository = {
  saveProfile(profile: UniversalUserProfile): void {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile))
    } catch (err) {
      console.warn('Could not save user profile to localStorage:', err)
    }
  },

  loadProfile(fallback: UniversalUserProfile): UniversalUserProfile {
    if (typeof window === 'undefined') return fallback
    try {
      const data = localStorage.getItem(KEYS.PROFILE)
      if (!data) return fallback
      const parsed = JSON.parse(data)
      return { ...fallback, ...parsed }
    } catch (err) {
      console.warn('Could not parse user profile from localStorage:', err)
      return fallback
    }
  },

  saveVision(vision: Partial<RelationshipVisionData>): void {
    if (typeof window === 'undefined') return
    try {
      const current = profileRepository.loadVision(DEFAULT_RELATIONSHIP_VISION)
      const merged = { ...current, ...vision }
      localStorage.setItem(KEYS.VISION, JSON.stringify(merged))
    } catch (err) {
      console.warn('Could not save relationship vision to localStorage:', err)
    }
  },

  loadVision(defaults: RelationshipVisionData = DEFAULT_RELATIONSHIP_VISION): RelationshipVisionData {
    if (typeof window === 'undefined') return defaults
    try {
      const data = localStorage.getItem(KEYS.VISION)
      if (!data) return defaults
      return { ...defaults, ...JSON.parse(data) }
    } catch (err) {
      console.warn('Could not parse vision data from localStorage:', err)
      return defaults
    }
  },

  saveSettings(settings: Partial<AppSettingsData>): void {
    if (typeof window === 'undefined') return
    try {
      const current = profileRepository.loadSettings(DEFAULT_APP_SETTINGS)
      const merged = { ...current, ...settings }
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(merged))
    } catch (err) {
      console.warn('Could not save settings to localStorage:', err)
    }
  },

  loadSettings(defaults: AppSettingsData = DEFAULT_APP_SETTINGS): AppSettingsData {
    if (typeof window === 'undefined') return defaults
    try {
      const data = localStorage.getItem(KEYS.SETTINGS)
      if (!data) return defaults
      return { ...defaults, ...JSON.parse(data) }
    } catch (err) {
      console.warn('Could not parse settings from localStorage:', err)
      return defaults
    }
  },

  resetAllToDemoDefaults(): void {
    if (typeof window === 'undefined') return
    try {
      localStorage.removeItem(KEYS.PROFILE)
      localStorage.removeItem(KEYS.VISION)
      localStorage.removeItem(KEYS.SETTINGS)
    } catch (err) {
      console.warn('Could not reset demo defaults in localStorage:', err)
    }
  },
}
