// ============================================================================
// src/components/UserAccountView.tsx
// Universal Compatibility Platform: Profile Hub & Subview Coordinator
// Designed from Mockup Screen 4 (Profile Hub) & Mockup Screen 4A (More)
// Zero Gimmicks · Zero Dehumanization · 100% Mathematical & Psychological Rigor
// ============================================================================

import React, { useState } from 'react'
import { CheckCircle2, ArrowLeft, Compass, LogOut } from 'lucide-react'
import type { UniversalUserProfile } from '../types'
import { evaluateMatch } from '../utils/matchingEngine'
import { mockCandidates } from '../data/mockProfiles'
import { sounds } from '../utils/sound'
import {
  profileRepository,
  DEFAULT_RELATIONSHIP_VISION,
  DEFAULT_APP_SETTINGS,
} from '../utils/profileRepository'

import { SelfMirrorView } from './SelfMirrorView'
import { AccountSafetyView } from './account/AccountSafetyView'
import { AccountMoreView } from './account/AccountMoreView'
import { AccountPrivacyLocationView } from './account/AccountPrivacyLocationView'
import { AccountHubView, type ProfileMobileSubview } from './account/AccountHubView'
import { AccountAboutMeView } from './account/AccountAboutMeView'
import { AccountLookingForView } from './account/AccountLookingForView'
import { AccountBoundariesView } from './account/AccountBoundariesView'
import { AccountValuesLifestyleView } from './account/AccountValuesLifestyleView'
import { AccountLabsView } from './account/AccountLabsView'
import { AccountNotificationsView } from './account/AccountNotificationsView'
import { AccountAppearanceView } from './account/AccountAppearanceView'
import { AccountPreviewView } from './account/AccountPreviewView'

interface UserAccountViewProps {
  currentUser: UniversalUserProfile
  onUpdateUser: (updated: UniversalUserProfile) => void
  onSwitchPersona?: (user: UniversalUserProfile) => void
  onNavigateToDiscover?: () => void
  onNavigateToNetwork?: () => void
  onNavigateToDialogue?: () => void
  onLaunchFTUX?: () => void
  onNavigateView?: (view: any) => void
  onOpenTerms?: () => void
  onOpenLogin?: () => void
}

export const UserAccountView: React.FC<UserAccountViewProps> = ({
  currentUser,
  onUpdateUser,
  onSwitchPersona,
  onNavigateToDiscover,
  onNavigateToNetwork,
  onNavigateToDialogue,
  onLaunchFTUX,
  onNavigateView,
  onOpenTerms,
  onOpenLogin,
}) => {
  // Local editable draft state initialized from local persistence if available
  const [profile, setProfile] = useState<UniversalUserProfile>(() =>
    profileRepository.loadProfile(currentUser)
  )
  const [subview, setSubview] = useState<ProfileMobileSubview>('hub')
  const [saveToast, setSaveToast] = useState<string | null>(null)
  const [selectedBlendCandidateId, setSelectedBlendCandidateId] = useState<string>(
    mockCandidates[0]?.id || ''
  )

  // Relationship Vision & Self-Mirror State
  const [vision, setVision] = useState(() => profileRepository.loadVision(DEFAULT_RELATIONSHIP_VISION))

  // App Settings (Notifications & Theme)
  const [settings, setSettings] = useState(() =>
    profileRepository.loadSettings(DEFAULT_APP_SETTINGS)
  )

  // Sign out confirmation modal
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false)

  // Safety check-in shared state
  const [isSafetyCheckinActive, setIsSafetyCheckinActive] = useState(false)

  const triggerToast = (msg: string) => {
    sounds.playTap()
    setSaveToast(msg)
    setTimeout(() => setSaveToast(null), 3000)
  }

  const handleSaveAll = (customMsg?: string) => {
    sounds.playMatch()
    profileRepository.saveProfile(profile)
    profileRepository.saveVision(vision)
    profileRepository.saveSettings(settings)
    onUpdateUser(profile)
    triggerToast(customMsg || 'Profile configuration saved.')
  }

  const handleResetDemoDefaults = () => {
    profileRepository.resetAllToDemoDefaults()
    setProfile(currentUser)
    setVision(DEFAULT_RELATIONSHIP_VISION)
    setSettings(DEFAULT_APP_SETTINGS)
    onUpdateUser(currentUser)
    triggerToast('Demo defaults restored.')
  }

  // Selected candidate for live Spotify-style Blend
  const blendCandidate =
    mockCandidates.find((c) => c.id === selectedBlendCandidateId) || mockCandidates[0]

  const blendEvaluation = blendCandidate ? evaluateMatch(profile, blendCandidate) : null

  // Calculate live mutual candidates count
  const eligibleCandidatesCount = mockCandidates.filter(
    (c) => c.id !== profile.id && evaluateMatch(profile, c).eligible
  ).length

  // Quick Persona switcher data
  const demoPersonas = [
    { id: 'usr_elena_current', name: 'Elena', role: 'Art Historian (Primary)', profile: currentUser },
    { id: 'usr_maya_01', name: 'Maya', role: 'Acoustician (Harmonic Twin)', profile: mockCandidates[0] },
    { id: 'usr_liam_02', name: 'Liam', role: 'Creative Director (Smoker / Dealbreaker)', profile: mockCandidates[1] },
    { id: 'usr_marcus_03', name: 'Marcus', role: 'Venture Partner (Polyamorous)', profile: mockCandidates[2] },
    { id: 'usr_priya_05', name: 'Priya', role: 'Neuroscience Fellow (High Alignment)', profile: mockCandidates[4] },
  ]

  // Completeness score
  const completenessPercent = 82

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-2 px-3 sm:px-6 text-[#F7F5F8] font-sans pb-28">
      {/* Save Toast Notification */}
      {saveToast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-[#17161A] text-white text-xs font-medium shadow-2xl backdrop-blur border border-[#F472B6]/40 flex items-center space-x-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-[#F472B6]" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* 1. SCREEN 4: PROFILE HUB (MAIN VIEW) */}
      {subview === 'hub' && (
        <AccountHubView
          profile={profile}
          eligibleCandidatesCount={eligibleCandidatesCount}
          completenessPercent={completenessPercent}
          demoPersonas={demoPersonas}
          onSwitchPersona={onSwitchPersona}
          onSetProfile={setProfile}
          onSetSubview={setSubview}
          onLaunchFTUX={onLaunchFTUX}
          onToast={triggerToast}
        />
      )}

      {/* 2. SCREEN 4A: MORE INSIDE PROFILE */}
      {subview === 'more' && (
        <AccountMoreView
          onBack={() => setSubview('hub')}
          onNavigateToMembership={() => {
            if (onNavigateView) onNavigateView('subscriptions')
            else triggerToast('Opened Membership Plans')
          }}
          onNavigateToSafety={() => setSubview('safety')}
          onNavigateToNotifications={() => setSubview('notifications')}
          onNavigateToAppearance={() => setSubview('appearance')}
          onNavigateToLabs={() => setSubview('labs')}
          onOpenLegalTerms={() => {
            if (onOpenTerms) onOpenTerms()
            else if (onNavigateView) onNavigateView('terms')
          }}
          onOpenSignOut={() => setIsSignOutModalOpen(true)}
          onResetDemoDefaults={handleResetDemoDefaults}
        />
      )}

      {/* 3. EXPERIMENTAL LABS SUBVIEW */}
      {subview === 'labs' && (
        <AccountLabsView
          onBack={() => setSubview('more')}
          onNavigateView={onNavigateView}
          onNavigateToNetwork={onNavigateToNetwork}
        />
      )}

      {/* 4. SAFETY CENTRE SUBVIEW */}
      {subview === 'safety' && (
        <AccountSafetyView
          onBack={() => setSubview('more')}
          isSafetyCheckinActive={isSafetyCheckinActive}
          onToggleSafetyCheckin={() => {
            setIsSafetyCheckinActive(!isSafetyCheckinActive)
            triggerToast(isSafetyCheckinActive ? 'Check-in paused.' : 'Safety check-in configured.')
          }}
        />
      )}

      {/* 5. NOTIFICATIONS SUBVIEW */}
      {subview === 'notifications' && (
        <AccountNotificationsView
          notificationsState={settings.notifications}
          onToggleNotification={(key, label) => {
            const next = {
              ...settings.notifications,
              [key]: !settings.notifications[key],
            }
            setSettings({ ...settings, notifications: next })
            profileRepository.saveSettings({ notifications: next })
            triggerToast(`${label} updated.`)
          }}
          onBack={() => setSubview('more')}
        />
      )}

      {/* 6. APPEARANCE SUBVIEW */}
      {subview === 'appearance' && (
        <AccountAppearanceView
          themeMode={settings.themeMode}
          onSelectTheme={(mode, label) => {
            setSettings({ ...settings, themeMode: mode })
            profileRepository.saveSettings({ themeMode: mode })
            triggerToast(`Theme set to ${label}.`)
          }}
          onBack={() => setSubview('more')}
        />
      )}

      {/* 7. ABOUT ME SUBVIEW */}
      {subview === 'about_me' && (
        <AccountAboutMeView
          profile={profile}
          onChangeProfile={setProfile}
          onSave={() => handleSaveAll('About Me saved successfully.')}
          onBack={() => setSubview('hub')}
        />
      )}

      {/* 8. WHAT I'M LOOKING FOR SUBVIEW */}
      {subview === 'looking_for' && (
        <AccountLookingForView
          profile={profile}
          partnershipType={vision.partnershipType}
          cohabitationVision={vision.cohabitationVision}
          financePhilosophy={vision.financePhilosophy}
          onChangeProfile={setProfile}
          onChangePartnershipType={(pt) => setVision({ ...vision, partnershipType: pt })}
          onChangeCohabitationVision={(cv) => setVision({ ...vision, cohabitationVision: cv })}
          onChangeFinancePhilosophy={(fp) => setVision({ ...vision, financePhilosophy: fp })}
          onSave={() => handleSaveAll('Relationship intentions saved.')}
          onBack={() => setSubview('hub')}
        />
      )}

      {/* 9. MY BOUNDARIES SUBVIEW */}
      {subview === 'boundaries' && (
        <AccountBoundariesView
          profile={profile}
          onChangeProfile={setProfile}
          onSave={() => handleSaveAll('Boundaries & dealbreakers saved.')}
          onBack={() => setSubview('hub')}
        />
      )}

      {/* 10. VALUES & LIFESTYLE SUBVIEW */}
      {subview === 'values_lifestyle' && (
        <AccountValuesLifestyleView
          profile={profile}
          reassuranceCadence={vision.reassuranceCadence}
          conflictStyle={vision.conflictStyle}
          rechargeStyle={vision.rechargeStyle}
          acknowledgedPatterns={vision.acknowledgedPatterns}
          blendCandidate={blendCandidate}
          blendEvaluation={blendEvaluation}
          candidates={mockCandidates}
          onSelectBlendCandidate={setSelectedBlendCandidateId}
          onChangeProfile={setProfile}
          onChangeReassuranceCadence={(rc) => setVision({ ...vision, reassuranceCadence: rc })}
          onChangeConflictStyle={(cs) => setVision({ ...vision, conflictStyle: cs })}
          onChangeRechargeStyle={(rs) => setVision({ ...vision, rechargeStyle: rs })}
          onTogglePattern={(trapId) => {
            const next = vision.acknowledgedPatterns.includes(trapId)
              ? vision.acknowledgedPatterns.filter((p) => p !== trapId)
              : [...vision.acknowledgedPatterns, trapId]
            setVision({ ...vision, acknowledgedPatterns: next })
          }}
          onSave={() => handleSaveAll('Values & lifestyle saved.')}
          onBack={() => setSubview('hub')}
        />
      )}

      {/* 11. PRIVACY & LOCATION SUBVIEW */}
      {subview === 'privacy_location' && (
        <AccountPrivacyLocationView
          profile={profile}
          onUpdatePrivacy={setProfile}
          onSave={() => handleSaveAll('Privacy settings updated.')}
          onBack={() => setSubview('hub')}
        />
      )}

      {/* 12. PREVIEW SUBVIEW */}
      {subview === 'preview' && (
        <AccountPreviewView
          profile={profile}
          onBack={() => setSubview('hub')}
          onNavigateToDiscover={onNavigateToDiscover}
          onNavigateToDialogue={onNavigateToDialogue}
          onNavigateView={onNavigateView}
        />
      )}

      {/* 13. RELATIONSHIP SELF-MIRROR SUBVIEW */}
      {subview === 'self_mirror' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pt-2 pb-1">
            <button
              onClick={() => {
                sounds.playTap()
                setSubview('hub')
              }}
              className="px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.12] text-xs font-medium text-neutral-300 hover:text-white flex items-center space-x-1.5 transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Profile Hub</span>
            </button>
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#F472B6]/10 border border-[#F472B6]/25 text-[#F472B6] text-xs font-mono font-medium">
              <Compass className="w-3.5 h-3.5" />
              <span>Decision Engine</span>
            </div>
          </div>

          <SelfMirrorView
            currentUser={profile}
            onUpdateUser={(updated) => {
              setProfile(updated)
              onUpdateUser(updated)
            }}
            onNavigateDiscover={onNavigateToDiscover}
          />
        </div>
      )}

      {/* 14. SIGN OUT CONFIRMATION MODAL */}
      {isSignOutModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#17161A] border border-white/10 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto">
              <LogOut className="w-6 h-6 text-rose-400" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-white">Sign out of Checkmate?</h3>
              <p className="text-xs text-neutral-400 font-light">
                Your profile configuration and active conversation states will remain saved securely.
              </p>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setIsSignOutModalOpen(false)}
                className="flex-1 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsSignOutModalOpen(false)
                  if (onOpenLogin) onOpenLogin()
                  triggerToast('Signed out successfully.')
                }}
                className="flex-1 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition cursor-pointer shadow-lg shadow-rose-900/40"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
