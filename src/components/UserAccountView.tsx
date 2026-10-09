// ============================================================================
// src/components/UserAccountView.tsx
// Universal Compatibility Platform: Profile Hub & Subview Architecture
// Designed from Mockup Screen 4 (Profile Hub) & Mockup Screen 4A (More)
// Zero Gimmicks · Zero Dehumanization · 100% Mathematical & Psychological Rigor
// ============================================================================

import React, { useState } from 'react'
import {
  ShieldCheck,
  Heart,
  Sliders,
  Check,
  MapPin,
  Sparkles,
  MessageSquare,
  Compass,
  Moon,
  Sun,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Lock,
  User,
  Settings,
  Eye,
  ChevronRight,
  Crown,
  Bell,
  HelpCircle,
  FlaskConical,
  FileText,
  LogOut,
  Shield,
  SlidersHorizontal,
  PhoneCall,
} from 'lucide-react'
import type { UniversalUserProfile } from '../types'
import { evaluateMatch } from '../utils/matchingEngine'
import { mockCandidates } from '../data/mockProfiles'
import { sounds } from '../utils/sound'

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

type ProfileMobileSubview =
  | 'hub'
  | 'about_me'
  | 'looking_for'
  | 'boundaries'
  | 'values_lifestyle'
  | 'privacy_location'
  | 'preview'
  | 'more'
  | 'safety'
  | 'notifications'
  | 'appearance'
  | 'labs'

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
  // Local editable draft state
  const [profile, setProfile] = useState<UniversalUserProfile>(currentUser)
  const [subview, setSubview] = useState<ProfileMobileSubview>('hub')
  const [saveToast, setSaveToast] = useState<string | null>(null)
  const [selectedBlendCandidateId, setSelectedBlendCandidateId] = useState<string>(mockCandidates[0]?.id || '')

  // Relationship Vision & Self-Mirror State
  const [partnershipType, setPartnershipType] = useState<string>('Deep Companionship & Co-Creation')
  const [cohabitationVision, setCohabitationVision] = useState<string>('Shared home with dedicated quiet nooks')
  const [financePhilosophy, setFinancePhilosophy] = useState<string>('Proportional shared pool with open transparency')
  const [reassuranceCadence, setReassuranceCadence] = useState<string>('Warm daily check-ins (1–2 thoughtful messages)')
  const [conflictStyle, setConflictStyle] = useState<string>('Needs 20-min cool-down before speaking calmly')
  const [rechargeStyle, setRechargeStyle] = useState<string>('Parallel play (reading/working quietly in the same room)')
  const [acknowledgedPatterns, setAcknowledgedPatterns] = useState<string[]>([
    'Confusing emotional adrenaline with genuine long-term fit',
    'Ignoring mismatched family timelines early on',
  ])

  // Notification toggles state
  const [notificationsState, setNotificationsState] = useState({
    mutualAlignments: true,
    thoughtfulMessages: true,
    dateProposals: true,
    dailySanctuaryDigest: false,
  })

  // Theme selection state
  const [themeMode, setThemeMode] = useState<'dark' | 'midnight' | 'contrast'>('dark')

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
    onUpdateUser(profile)
    triggerToast(customMsg || 'Profile configuration saved.')
  }

  // Selected candidate for live Spotify-style Blend
  const blendCandidate =
    mockCandidates.find((c) => c.id === selectedBlendCandidateId) || mockCandidates[0]

  const blendEvaluation = blendCandidate
    ? evaluateMatch(profile, blendCandidate)
    : null

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

      {/* ======================================================== */}
      {/* 1. SCREEN 4: PROFILE HUB (MAIN VIEW)                      */}
      {/* ======================================================== */}
      {subview === 'hub' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Top Header matching Mockup Screen 4 */}
          <div className="flex items-center justify-between pt-2 pb-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              My Profile
            </h1>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSubview('preview')}
                className="px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.12] text-xs font-medium text-neutral-300 hover:text-white flex items-center space-x-1.5 transition cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-[#F472B6]" />
                <span>Preview</span>
              </button>

              <button
                onClick={() => setSubview('more')}
                className="p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.12] text-neutral-300 hover:text-white transition cursor-pointer"
                aria-label="Account Settings & More"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* User Summary Card (Mockup Screen 4 Hero) */}
          <div className="bg-[#17161A] border border-white/[0.08] rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden space-y-5">
            <div className="flex items-center space-x-4">
              <div className="relative shrink-0">
                <img
                  src={profile.identity.photos[0]}
                  alt={profile.identity.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover ring-2 ring-[#F472B6]/30 shadow-md"
                />
                {profile.identity.verified && (
                  <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-emerald-500 ring-2 ring-[#17161A] flex items-center justify-center">
                    <Check className="w-3 h-3 text-white stroke-[3]" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-white truncate">
                    {profile.identity.name}
                  </h2>
                  {profile.identity.verified && (
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-semibold">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Verified</span>
                    </span>
                  )}
                </div>

                <p className="text-xs text-neutral-400 mt-0.5">
                  {profile.identity.age} years old • 📍 {profile.geography.cityName}
                </p>

                <div className="inline-flex items-center mt-2 px-2.5 py-0.5 rounded-full bg-[#F472B6]/15 border border-[#F472B6]/30 text-[#F472B6] text-[11px] font-medium">
                  {profile.intention.primaryIntent}
                </div>
              </div>
            </div>

            {/* Profile Completeness Bar */}
            <div className="pt-2 border-t border-white/[0.06] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-300 font-medium">Profile completeness</span>
                <span className="text-[#F472B6] font-mono font-bold">{completenessPercent}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-neutral-900 overflow-hidden border border-white/[0.04]">
                <div
                  className="h-full bg-gradient-to-r from-[#F472B6] to-rose-400 rounded-full transition-all duration-500"
                  style={{ width: `${completenessPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-neutral-400 font-light">
                {eligibleCandidatesCount} mutually compatible candidates currently aligned with your standards.
              </p>
            </div>
          </div>

          {/* Persona Switcher for Live Evaluation */}
          {onSwitchPersona && (
            <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
              <span className="text-[11px] font-mono text-neutral-500 shrink-0">Persona:</span>
              {demoPersonas.map((dp) => (
                <button
                  key={dp.id}
                  onClick={() => {
                    onSwitchPersona(dp.profile)
                    setProfile(dp.profile)
                    triggerToast(`Switched active view to ${dp.name} (${dp.role})`)
                  }}
                  className={`px-2.5 py-1 rounded-full text-xs font-mono cursor-pointer transition shrink-0 ${
                    profile.id === dp.id
                      ? 'bg-white/20 text-white font-semibold'
                      : 'bg-white/[0.04] text-neutral-400 hover:text-white hover:bg-white/[0.08]'
                  }`}
                >
                  {dp.name}
                </button>
              ))}
            </div>
          )}

          {/* Navigation List matching Mockup Screen 4 */}
          <div className="bg-[#17161A] border border-white/[0.08] rounded-3xl divide-y divide-white/[0.06] overflow-hidden shadow-xl">
            
            {/* 1. About Me */}
            <button
              onClick={() => setSubview('about_me')}
              className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-white/[0.02] active:bg-white/[0.04] transition cursor-pointer"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-[#F472B6]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">About Me</h3>
                  <p className="text-xs text-neutral-400 font-light">Your story, interests and lifestyle</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-500 shrink-0 ml-2" />
            </button>

            {/* 2. What I'm Looking For */}
            <button
              onClick={() => setSubview('looking_for')}
              className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-white/[0.02] active:bg-white/[0.04] transition cursor-pointer"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
                  <Heart className="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">What I'm Looking For</h3>
                  <p className="text-xs text-neutral-400 font-light">Relationship goals and preferences</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-500 shrink-0 ml-2" />
            </button>

            {/* 3. My Boundaries */}
            <button
              onClick={() => setSubview('boundaries')}
              className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-white/[0.02] active:bg-white/[0.04] transition cursor-pointer"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">My Boundaries</h3>
                  <p className="text-xs text-neutral-400 font-light">Non-negotiables and dealbreakers</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-500 shrink-0 ml-2" />
            </button>

            {/* 4. Values & Lifestyle */}
            <button
              onClick={() => setSubview('values_lifestyle')}
              className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-white/[0.02] active:bg-white/[0.04] transition cursor-pointer"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Values & Lifestyle</h3>
                  <p className="text-xs text-neutral-400 font-light">Daily life, habits and compatibility</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-500 shrink-0 ml-2" />
            </button>

            {/* 5. Privacy & Location */}
            <button
              onClick={() => setSubview('privacy_location')}
              className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-white/[0.02] active:bg-white/[0.04] transition cursor-pointer"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-sky-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Privacy & Location</h3>
                  <p className="text-xs text-neutral-400 font-light">Visibility and privacy controls</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-500 shrink-0 ml-2" />
            </button>

            {/* 6. More */}
            <button
              onClick={() => setSubview('more')}
              className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-white/[0.02] active:bg-white/[0.04] transition cursor-pointer"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-2xl bg-white/[0.06] border border-white/[0.1] flex items-center justify-center shrink-0">
                  <SlidersHorizontal className="w-5 h-5 text-neutral-300" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">More</h3>
                  <p className="text-xs text-neutral-400 font-light">Membership, safety, settings and more</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-500 shrink-0 ml-2" />
            </button>

          </div>

          {/* Quick Guided Calibration Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/30 to-pink-950/20 border border-purple-500/20 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-semibold text-white">90-Second Guided Calibration</h4>
              <p className="text-[11px] text-neutral-400">Answer 5 core questions to refine your match filter.</p>
            </div>
            <button
              onClick={onLaunchFTUX}
              className="px-3.5 py-1.5 rounded-full bg-[#F472B6] hover:bg-pink-400 text-black font-semibold text-xs transition cursor-pointer"
            >
              Calibrate
            </button>
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* 2. SCREEN 4A: MORE INSIDE PROFILE                         */}
      {/* ======================================================== */}
      {subview === 'more' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Header with Back Button */}
          <div className="flex items-center space-x-3 pt-2 pb-1">
            <button
              onClick={() => setSubview('hub')}
              className="p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.12] text-neutral-300 hover:text-white transition cursor-pointer"
              aria-label="Back to Profile"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">More</h1>
              <p className="text-xs text-neutral-400 font-light">Account preferences, safety & experimental labs</p>
            </div>
          </div>

          {/* List items matching Mockup Screen 4A */}
          <div className="bg-[#17161A] border border-white/[0.08] rounded-3xl divide-y divide-white/[0.06] overflow-hidden shadow-xl">
            
            {/* Membership */}
            <button
              onClick={() => {
                if (onNavigateView) onNavigateView('subscriptions')
                else triggerToast('Opened Membership Plans')
              }}
              className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-white/[0.02] active:bg-white/[0.04] transition cursor-pointer"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                  <Crown className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Membership</h3>
                  <p className="text-xs text-neutral-400 font-light">Manage your plan</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-mono text-[#F472B6] font-semibold">Free Member</span>
                <ChevronRight className="w-4 h-4 text-neutral-500" />
              </div>
            </button>

            {/* Safety Centre */}
            <button
              onClick={() => setSubview('safety')}
              className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-white/[0.02] active:bg-white/[0.04] transition cursor-pointer"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Safety Centre</h3>
                  <p className="text-xs text-neutral-400 font-light">Verification, reporting, meeting safety</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-mono text-emerald-400 font-semibold">Protected</span>
                <ChevronRight className="w-4 h-4 text-neutral-500" />
              </div>
            </button>

            {/* Notifications */}
            <button
              onClick={() => setSubview('notifications')}
              className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-white/[0.02] active:bg-white/[0.04] transition cursor-pointer"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                  <Bell className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Notifications</h3>
                  <p className="text-xs text-neutral-400 font-light">Message and activity settings</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-500" />
            </button>

            {/* Appearance */}
            <button
              onClick={() => setSubview('appearance')}
              className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-white/[0.02] active:bg-white/[0.04] transition cursor-pointer"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                  <Moon className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Appearance</h3>
                  <p className="text-xs text-neutral-400 font-light">Theme and display</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-mono text-neutral-400 capitalize">{themeMode}</span>
                <ChevronRight className="w-4 h-4 text-neutral-500" />
              </div>
            </button>

            {/* Help & FAQ */}
            <button
              onClick={() => {
                if (onNavigateView) onNavigateView('about_faq')
                else triggerToast('Opened Help & FAQ')
              }}
              className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-white/[0.02] active:bg-white/[0.04] transition cursor-pointer"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                  <HelpCircle className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Help & FAQ</h3>
                  <p className="text-xs text-neutral-400 font-light">Support and guidance</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-500" />
            </button>

            {/* Privacy & Data */}
            <button
              onClick={() => setSubview('privacy_location')}
              className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-white/[0.02] active:bg-white/[0.04] transition cursor-pointer"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Privacy & Data</h3>
                  <p className="text-xs text-neutral-400 font-light">Your data and rights</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-500" />
            </button>

            {/* Labs */}
            <button
              onClick={() => setSubview('labs')}
              className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-white/[0.02] active:bg-white/[0.04] transition cursor-pointer"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center shrink-0">
                  <FlaskConical className="w-5 h-5 text-[#F472B6]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Labs</h3>
                  <p className="text-xs text-neutral-400 font-light">Experimental features</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono uppercase bg-[#F472B6]/20 text-[#F472B6] px-2 py-0.5 rounded-full font-semibold">
                  4 Tools
                </span>
                <ChevronRight className="w-4 h-4 text-neutral-500" />
              </div>
            </button>

            {/* Legal */}
            <button
              onClick={() => {
                if (onOpenTerms) onOpenTerms()
                else triggerToast('Opened Legal Terms')
              }}
              className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-white/[0.02] active:bg-white/[0.04] transition cursor-pointer"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-2xl bg-white/[0.06] border border-white/[0.1] flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-neutral-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Legal</h3>
                  <p className="text-xs text-neutral-400 font-light">Terms and privacy charter</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-500" />
            </button>

            {/* Sign Out */}
            <button
              onClick={() => setIsSignOutModalOpen(true)}
              className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-rose-500/[0.05] active:bg-rose-500/[0.1] transition cursor-pointer"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
                  <LogOut className="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-rose-400">Sign Out</h3>
                  <p className="text-xs text-neutral-400 font-light">End session on this device</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-rose-400/50" />
            </button>

          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* 3. LABS SUBVIEW (ACCESSED VIA MORE)                       */}
      {/* ======================================================== */}
      {subview === 'labs' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center space-x-3 pt-2 pb-1">
            <button
              onClick={() => setSubview('more')}
              className="p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.12] text-neutral-300 hover:text-white transition cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Experimental Labs</h1>
              <p className="text-xs text-neutral-400 font-light">
                Deep mathematical models and algorithmic diagnostics
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {[
              {
                id: 'optimizer',
                title: 'Preference Optimizer (Pareto Curve)',
                desc: 'Simulate relaxing rigid preferences to unlock balanced reciprocal candidate pools.',
                icon: <Sliders className="w-5 h-5 text-purple-400" />,
                action: () => onNavigateView && onNavigateView('optimizer'),
              },
              {
                id: 'network',
                title: 'Compatibility Constellation',
                desc: 'Inspect topological clustering, community densities, and dyadic centrality.',
                icon: <Compass className="w-5 h-5 text-cyan-400" />,
                action: () => (onNavigateToNetwork ? onNavigateToNetwork() : (onNavigateView && onNavigateView('network'))),
              },
              {
                id: 'contradictions',
                title: 'Contradiction Auditor',
                desc: 'Audit your boundaries for mathematical impossibilities (e.g. 5km radius with rare diet).',
                icon: <ShieldCheck className="w-5 h-5 text-amber-400" />,
                action: () => onNavigateView && onNavigateView('contradictions'),
              },
              {
                id: 'evaluator',
                title: 'Pair Evaluator Engine',
                desc: 'Inspect full mathematical vector breakdown for any candidate dyad.',
                icon: <Sparkles className="w-5 h-5 text-[#F472B6]" />,
                action: () => onNavigateView && onNavigateView('evaluator'),
              },
            ].map((tool) => (
              <div
                key={tool.id}
                onClick={tool.action}
                className="p-5 rounded-2xl bg-[#17161A] border border-white/[0.08] hover:border-[#F472B6]/40 transition cursor-pointer flex items-center justify-between space-x-4 shadow-lg"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shrink-0">
                    {tool.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{tool.title}</h3>
                    <p className="text-xs text-neutral-400 font-light mt-0.5">{tool.desc}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-500 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. SAFETY CENTRE SUBVIEW                                 */}
      {/* ======================================================== */}
      {subview === 'safety' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center space-x-3 pt-2 pb-1">
            <button
              onClick={() => setSubview('more')}
              className="p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.12] text-neutral-300 hover:text-white transition cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Safety Centre</h1>
              <p className="text-xs text-neutral-400 font-light">Verification, reporting & meeting safety</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Identity Verification Status Card */}
            <div className="p-5 rounded-2xl bg-[#17161A] border border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-mono tracking-wider text-emerald-400 font-semibold">
                  Identity Verification
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-medium">
                  Active
                </span>
              </div>
              <p className="text-xs text-neutral-300 font-light">
                Your profile was verified via biometric liveness proof. We never store raw scans; verification produces a cryptographic hash verifying authentic human identity.
              </p>
            </div>

            {/* Date Safe Check-in Card */}
            <div className="p-5 rounded-2xl bg-[#17161A] border border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">First Date Safety Check-In</h3>
                  <p className="text-xs text-neutral-400 font-light">Share your date venue & check-in time with a trusted friend</p>
                </div>
                <button
                  onClick={() => {
                    setIsSafetyCheckinActive(!isSafetyCheckinActive)
                    triggerToast(isSafetyCheckinActive ? 'Check-in paused.' : 'Safety check-in configured.')
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition ${
                    isSafetyCheckinActive
                      ? 'bg-emerald-500 text-black'
                      : 'bg-white/10 text-white hover:bg-white/15'
                  }`}
                >
                  {isSafetyCheckinActive ? 'Active' : 'Setup'}
                </button>
              </div>
            </div>

            {/* Meeting Ground Rules */}
            <div className="p-5 rounded-2xl bg-[#17161A] border border-white/[0.08] space-y-3">
              <h3 className="text-sm font-semibold text-white">Meeting Ground Rules</h3>
              <ul className="text-xs text-neutral-300 space-y-2 list-disc list-inside font-light">
                <li>Meet in public, well-lit spaces for all first encounters.</li>
                <li>Stay in control of your own transport to and from the venue.</li>
                <li>Never feel pressured to stay if boundaries are breached.</li>
                <li>Check provides discreet exit options inside the Date Plan tool.</li>
              </ul>
            </div>

            {/* Emergency Hotline Assistance */}
            <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-rose-300 block">Emergency SOS Contacts</span>
                <span className="text-[11px] text-neutral-400">Quick-dial emergency services (999 / 112 / 911)</span>
              </div>
              <a
                href="tel:999"
                className="px-3 py-1.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center space-x-1.5 cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call 999</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. NOTIFICATIONS SUBVIEW                                  */}
      {/* ======================================================== */}
      {subview === 'notifications' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center space-x-3 pt-2 pb-1">
            <button
              onClick={() => setSubview('more')}
              className="p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.12] text-neutral-300 hover:text-white transition cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Notifications</h1>
              <p className="text-xs text-neutral-400 font-light">Configure your alert frequency</p>
            </div>
          </div>

          <div className="bg-[#17161A] border border-white/[0.08] rounded-3xl divide-y divide-white/[0.06] overflow-hidden">
            {[
              {
                key: 'mutualAlignments',
                label: 'Mutual Alignments',
                desc: 'Alert me when someone reciprocates my connection request.',
              },
              {
                key: 'thoughtfulMessages',
                label: 'Direct Messages',
                desc: 'Alert me when a conversation partner sends a message.',
              },
              {
                key: 'dateProposals',
                label: 'Date Proposals & Briefs',
                desc: 'Alert me when a date plan is created or modified.',
              },
              {
                key: 'dailySanctuaryDigest',
                label: 'Quiet Evening Digest',
                desc: 'Batch notifications into a single calm summary at 8:00 PM.',
              },
            ].map((n) => {
              const active = notificationsState[n.key as keyof typeof notificationsState]
              return (
                <div key={n.key} className="p-4 sm:p-5 flex items-center justify-between">
                  <div className="pr-4">
                    <h3 className="text-sm font-semibold text-white">{n.label}</h3>
                    <p className="text-xs text-neutral-400 font-light mt-0.5">{n.desc}</p>
                  </div>
                  <button
                    onClick={() => {
                      setNotificationsState((prev) => ({
                        ...prev,
                        [n.key]: !active,
                      }))
                      triggerToast(`${n.label} updated.`)
                    }}
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                      active ? 'bg-[#F472B6]' : 'bg-neutral-800'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                        active ? 'left-7' : 'left-1'
                      }`}
                    />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. APPEARANCE SUBVIEW                                    */}
      {/* ======================================================== */}
      {subview === 'appearance' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center space-x-3 pt-2 pb-1">
            <button
              onClick={() => setSubview('more')}
              className="p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.12] text-neutral-300 hover:text-white transition cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Appearance</h1>
              <p className="text-xs text-neutral-400 font-light">Customise your display theme</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'dark', label: 'Warm Dark (Default)', desc: '#0F0E11 with pink accents' },
              { id: 'midnight', label: 'Midnight Black', desc: 'Pure #000000 OLED contrast' },
              { id: 'contrast', label: 'High Contrast', desc: 'Enhanced accessibility borders' },
            ].map((t) => (
              <div
                key={t.id}
                onClick={() => {
                  setThemeMode(t.id as any)
                  triggerToast(`Theme set to ${t.label}.`)
                }}
                className={`p-4 rounded-2xl border transition cursor-pointer ${
                  themeMode === t.id
                    ? 'bg-[#17161A] border-[#F472B6] shadow-md shadow-[#F472B6]/10'
                    : 'bg-[#17161A]/60 border-white/[0.08] hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between pb-2">
                  <span className="text-sm font-semibold text-white">{t.label}</span>
                  {themeMode === t.id && <CheckCircle2 className="w-4 h-4 text-[#F472B6]" />}
                </div>
                <p className="text-xs text-neutral-400 font-light">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 7. ABOUT ME SUBVIEW                                      */}
      {/* ======================================================== */}
      {subview === 'about_me' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pt-2 pb-1">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSubview('hub')}
                className="p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.12] text-neutral-300 hover:text-white transition cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">About Me</h1>
                <p className="text-xs text-neutral-400 font-light">Your story, interests and lifestyle</p>
              </div>
            </div>

            <button
              onClick={() => handleSaveAll('About Me saved successfully.')}
              className="px-4 py-1.5 rounded-full bg-[#F472B6] hover:bg-pink-400 text-black text-xs font-semibold transition cursor-pointer shadow-md"
            >
              Save
            </button>
          </div>

          <div className="bg-[#17161A] border border-white/[0.08] rounded-3xl p-5 sm:p-6 space-y-5 shadow-xl">
            
            {/* Display Name & Age */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-neutral-400 font-mono block mb-1">Display Name</label>
                <input
                  type="text"
                  value={profile.identity.name}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      identity: { ...profile.identity, name: e.target.value },
                    })
                  }
                  className="w-full bg-neutral-950 border border-white/20 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#F472B6]"
                />
              </div>

              <div>
                <label className="text-xs text-neutral-400 font-mono block mb-1">Age</label>
                <input
                  type="number"
                  value={profile.identity.age}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      identity: { ...profile.identity, age: Number(e.target.value) },
                    })
                  }
                  className="w-full bg-neutral-950 border border-white/20 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#F472B6]"
                />
              </div>
            </div>

            {/* City & Pronouns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-neutral-400 font-mono block mb-1">City Location</label>
                <input
                  type="text"
                  value={profile.geography.cityName}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      geography: { ...profile.geography, cityName: e.target.value },
                    })
                  }
                  className="w-full bg-neutral-950 border border-white/20 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#F472B6]"
                />
              </div>

              <div>
                <label className="text-xs text-neutral-400 font-mono block mb-1">Pronouns</label>
                <input
                  type="text"
                  value={profile.identity.pronouns}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      identity: { ...profile.identity, pronouns: e.target.value },
                    })
                  }
                  className="w-full bg-neutral-950 border border-white/20 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#F472B6]"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="text-xs text-neutral-400 font-mono block mb-1">One-Liner Bio</label>
              <textarea
                rows={3}
                value={profile.identity.bio}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    identity: { ...profile.identity, bio: e.target.value },
                  })
                }
                className="w-full bg-neutral-950 border border-white/20 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#F472B6]"
              />
            </div>

            {/* Interests & Curiosities */}
            <div>
              <label className="text-xs text-neutral-400 font-mono block mb-2">Interests & Curiosities</label>
              <div className="flex flex-wrap gap-2">
                {[
                  'Contemporary Art & Galleries',
                  'Acoustics & Spatial Sound',
                  'Independent Cinema',
                  'Slow Travel & Offbeat Cities',
                  'Culinary Craft & Wine',
                  'Philosophy & Metacognition',
                  'Architecture Walks',
                  'Reading & Bookstores',
                ].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-neutral-950 border border-white/10 text-neutral-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 8. WHAT I'M LOOKING FOR SUBVIEW                          */}
      {/* ======================================================== */}
      {subview === 'looking_for' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pt-2 pb-1">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSubview('hub')}
                className="p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.12] text-neutral-300 hover:text-white transition cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">What I'm Looking For</h1>
                <p className="text-xs text-neutral-400 font-light">Relationship goals and preferences</p>
              </div>
            </div>

            <button
              onClick={() => handleSaveAll('Relationship intentions saved.')}
              className="px-4 py-1.5 rounded-full bg-[#F472B6] hover:bg-pink-400 text-black text-xs font-semibold transition cursor-pointer shadow-md"
            >
              Save
            </button>
          </div>

          <div className="bg-[#17161A] border border-white/[0.08] rounded-3xl p-5 sm:p-6 space-y-6 shadow-xl">
            
            {/* Primary Intent */}
            <div className="space-y-2">
              <label className="text-xs text-neutral-400 font-mono block">Primary Relationship Intent</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  'Long-term relationship',
                  'Marriage',
                  'Companionship',
                  'Open to either',
                ].map((intent) => (
                  <button
                    key={intent}
                    onClick={() =>
                      setProfile({
                        ...profile,
                        intention: { ...profile.intention, primaryIntent: intent as any },
                      })
                    }
                    className={`p-3 rounded-2xl text-xs font-semibold border transition text-center cursor-pointer ${
                      profile.intention.primaryIntent === intent
                        ? 'bg-[#F472B6]/20 text-[#F472B6] border-[#F472B6]/50'
                        : 'bg-neutral-950 text-neutral-400 hover:text-white border-white/[0.06]'
                    }`}
                  >
                    {intent}
                  </button>
                ))}
              </div>
            </div>

            {/* Partnership Architecture (From Spec #5) */}
            <div className="space-y-3">
              <label className="text-xs text-neutral-400 font-mono block">
                Partnership Vision (Need #5: The Kind of Partnership I Am Building)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: 'Deep Companionship & Co-Creation',
                    title: 'Deep Companionship & Co-Creation',
                    desc: 'Shared creative, intellectual, and personal projects. Mutual emotional champions.',
                    icon: '🎨',
                  },
                  {
                    id: 'Quiet Domestic Sanctuary',
                    title: 'Quiet Domestic Sanctuary',
                    desc: 'Restorative home life, slow cooking, gentle rituals, low sensory stimulation.',
                    icon: '🏡',
                  },
                  {
                    id: 'Family & Roots Anchor',
                    title: 'Family & Roots Anchor',
                    desc: 'Committed home-building with shared desire for children and community roots.',
                    icon: '👶',
                  },
                  {
                    id: 'Independent Adventurers',
                    title: 'Independent Adventurers',
                    desc: 'Passionate emotional bond with high individual freedom, travel, and autonomy.',
                    icon: '✈️',
                  },
                ].map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setPartnershipType(item.id)}
                    className={`p-4 rounded-2xl border transition cursor-pointer space-y-2 ${
                      partnershipType === item.id
                        ? 'bg-purple-950/40 border-purple-500/60 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                        : 'bg-neutral-950 border-white/[0.06] hover:border-white/15'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">{item.icon}</span>
                      <h4 className="text-xs font-bold text-white">{item.title}</h4>
                    </div>
                    <p className="text-[11px] text-neutral-400 font-light leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Family & Children Goals */}
            <div className="space-y-2">
              <label className="text-xs text-neutral-400 font-mono block">Family & Children Goals</label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {(['definitely_yes', 'unsure', 'definitely_not'] as const).map((fc) => (
                  <button
                    key={fc}
                    onClick={() =>
                      setProfile({
                        ...profile,
                        family: { ...profile.family, wantsChildren: fc },
                      })
                    }
                    className={`p-2.5 rounded-xl border text-center capitalize cursor-pointer transition ${
                      profile.family.wantsChildren === fc
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-semibold'
                        : 'bg-neutral-950 text-neutral-400 hover:text-white border-white/[0.06]'
                    }`}
                  >
                    {fc.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Cohabitation Vision */}
            <div className="space-y-2">
              <label className="text-xs text-neutral-400 font-mono block">Cohabitation Preference</label>
              <div className="space-y-2 text-xs">
                {[
                  'Shared home with dedicated quiet nooks',
                  'Full full-time cohabitation in shared space',
                  'Living in close proximity (separate homes)',
                ].map((opt) => (
                  <div
                    key={opt}
                    onClick={() => setCohabitationVision(opt)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                      cohabitationVision === opt
                        ? 'bg-purple-950/30 border-purple-500/50 text-white'
                        : 'bg-neutral-950 border-white/[0.06] text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span className="font-light">{opt}</span>
                    {cohabitationVision === opt && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Philosophy (Spec #5) */}
            <div className="space-y-2">
              <label className="text-xs text-neutral-400 font-mono block">Financial Philosophy &amp; Transparency</label>
              <div className="space-y-2 text-xs">
                {[
                  'Proportional shared pool with open transparency',
                  'Equal 50/50 split on household expenses',
                  'Completely independent financial streams',
                ].map((opt) => (
                  <div
                    key={opt}
                    onClick={() => setFinancePhilosophy(opt)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                      financePhilosophy === opt
                        ? 'bg-emerald-950/30 border-emerald-500/50 text-white'
                        : 'bg-neutral-950 border-white/[0.06] text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span className="font-light">{opt}</span>
                    {financePhilosophy === opt && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 9. MY BOUNDARIES SUBVIEW                                  */}
      {/* ======================================================== */}
      {subview === 'boundaries' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pt-2 pb-1">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSubview('hub')}
                className="p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.12] text-neutral-300 hover:text-white transition cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">My Boundaries</h1>
                <p className="text-xs text-neutral-400 font-light">Non-negotiables and dealbreakers</p>
              </div>
            </div>

            <button
              onClick={() => handleSaveAll('Boundaries & dealbreakers saved.')}
              className="px-4 py-1.5 rounded-full bg-[#F472B6] hover:bg-pink-400 text-black text-xs font-semibold transition cursor-pointer shadow-md"
            >
              Save
            </button>
          </div>

          <div className="bg-[#17161A] border border-white/[0.08] rounded-3xl p-5 sm:p-6 space-y-6 shadow-xl">
            
            {/* Smoking Boundary */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs text-neutral-300 font-medium">Smoking Policy</label>
                <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                  {profile.lifestyle.smoking === 'never' ? 'Strictly Smoke-Free' : 'Social Allowed'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                {(['never', 'socially', 'regularly'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() =>
                      setProfile({
                        ...profile,
                        lifestyle: { ...profile.lifestyle, smoking: mode },
                        preferences: {
                          ...profile.preferences,
                          smokingPreference: {
                            ...profile.preferences.smokingPreference,
                            dealbreaker: mode === 'never',
                          },
                        },
                      })
                    }
                    className={`py-2 px-3 rounded-xl border transition cursor-pointer text-center capitalize ${
                      profile.lifestyle.smoking === mode
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold'
                        : 'bg-neutral-950 text-neutral-400 hover:text-white border-white/[0.06]'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Diet Boundary */}
            <div className="space-y-2">
              <label className="text-xs text-neutral-300 font-medium">Dietary Architecture</label>
              <div className="grid grid-cols-4 gap-2 text-xs font-mono">
                {(['vegetarian', 'vegan', 'omnivore', 'pescatarian'] as const).map((diet) => (
                  <button
                    key={diet}
                    onClick={() =>
                      setProfile({
                        ...profile,
                        lifestyle: { ...profile.lifestyle, diet },
                      })
                    }
                    className={`py-2 px-2 rounded-xl border transition cursor-pointer text-center capitalize text-[11px] ${
                      profile.lifestyle.diet === diet
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold'
                        : 'bg-neutral-950 text-neutral-400 hover:text-white border-white/[0.06]'
                    }`}
                  >
                    {diet}
                  </button>
                ))}
              </div>
            </div>

            {/* Alcohol Policy */}
            <div className="space-y-2">
              <label className="text-xs text-neutral-300 font-medium">Alcohol Standard</label>
              <div className="grid grid-cols-4 gap-2 text-xs font-mono">
                {(['sober', 'occasional', 'moderate', 'frequent'] as const).map((alc) => (
                  <button
                    key={alc}
                    onClick={() =>
                      setProfile({
                        ...profile,
                        lifestyle: { ...profile.lifestyle, alcohol: alc },
                      })
                    }
                    className={`py-2 px-2 rounded-xl border transition cursor-pointer text-center capitalize text-[11px] ${
                      profile.lifestyle.alcohol === alc
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold'
                        : 'bg-neutral-950 text-neutral-400 hover:text-white border-white/[0.06]'
                    }`}
                  >
                    {alc}
                  </button>
                ))}
              </div>
            </div>

            {/* Max Transit Radius Slider */}
            <div className="space-y-2.5 pt-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-300 font-medium">Max Transit & Distance Radius</span>
                <span className="text-[#F472B6] font-mono font-bold">{profile.geography.maxDistanceKm} km</span>
              </div>
              <input
                type="range"
                min={5}
                max={80}
                step={5}
                value={profile.geography.maxDistanceKm}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    geography: {
                      ...profile.geography,
                      maxDistanceKm: Number(e.target.value),
                    },
                  })
                }
                className="w-full accent-pink-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                <span>5 km (Local Metro)</span>
                <span>40 km (Greater London)</span>
                <span>80 km (Commuter Rail)</span>
              </div>
            </div>

            {/* Relationship Structure Boundary */}
            <div className="space-y-2">
              <label className="text-xs text-neutral-300 font-medium">Relationship Structure Non-Negotiable</label>
              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                {(['monogamous', 'polyamorous', 'flexible'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() =>
                      setProfile({
                        ...profile,
                        intention: { ...profile.intention, relationshipStructure: st },
                      })
                    }
                    className={`py-2 px-2 rounded-xl border transition cursor-pointer text-center capitalize text-[11px] ${
                      profile.intention.relationshipStructure === st
                        ? 'bg-[#F472B6]/20 text-[#F472B6] border-[#F472B6]/40 font-semibold'
                        : 'bg-neutral-950 text-neutral-400 hover:text-white border-white/[0.06]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 10. VALUES & LIFESTYLE SUBVIEW                           */}
      {/* ======================================================== */}
      {subview === 'values_lifestyle' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pt-2 pb-1">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSubview('hub')}
                className="p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.12] text-neutral-300 hover:text-white transition cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">Values & Lifestyle</h1>
                <p className="text-xs text-neutral-400 font-light">Daily life, habits and compatibility</p>
              </div>
            </div>

            <button
              onClick={() => handleSaveAll('Values & lifestyle saved.')}
              className="px-4 py-1.5 rounded-full bg-[#F472B6] hover:bg-pink-400 text-black text-xs font-semibold transition cursor-pointer shadow-md"
            >
              Save
            </button>
          </div>

          <div className="bg-[#17161A] border border-white/[0.08] rounded-3xl p-5 sm:p-6 space-y-6 shadow-xl">
            
            {/* Core Values Compass */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                  Core Life Compass (Select at least 3)
                </h3>
                <span className="text-[11px] text-[#F472B6] font-mono">
                  {profile.values.coreValues.length} Active
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  'Autonomy & Growth',
                  'Ethical Integrity',
                  'Creative Expression',
                  'Radical Candor',
                  'Curiosity & Wonder',
                  'Emotional Depth',
                  'Compassion',
                  'Intentional Living',
                ].map((val) => {
                  const isSelected = profile.values.coreValues.includes(val)
                  return (
                    <button
                      key={val}
                      onClick={() => {
                        const updated = isSelected
                          ? profile.values.coreValues.filter((v) => v !== val)
                          : [...profile.values.coreValues, val]
                        setProfile({
                          ...profile,
                          values: { ...profile.values, coreValues: updated },
                        })
                      }}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition cursor-pointer flex items-center space-x-1.5 ${
                        isSelected
                          ? 'bg-[#F472B6] text-black font-semibold shadow-md'
                          : 'bg-neutral-950 text-neutral-400 hover:text-white border border-white/[0.08]'
                      }`}
                    >
                      <span>{val}</span>
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Daily Ecology: Sleep Chronotype & Cleanliness */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Sleep */}
              <div className="p-4 rounded-2xl bg-neutral-950 border border-white/[0.08] space-y-2">
                <span className="text-[11px] font-mono text-neutral-400 block">Sleep Chronotype</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      setProfile({
                        ...profile,
                        accessibility: { ...profile.accessibility, sleepChronotype: 'morning_lark' },
                      })
                    }
                    className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-medium flex items-center justify-center space-x-1.5 cursor-pointer ${
                      profile.accessibility.sleepChronotype === 'morning_lark'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-neutral-900 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>Morning Lark</span>
                  </button>

                  <button
                    onClick={() =>
                      setProfile({
                        ...profile,
                        accessibility: { ...profile.accessibility, sleepChronotype: 'night_owl' },
                      })
                    }
                    className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-medium flex items-center justify-center space-x-1.5 cursor-pointer ${
                      profile.accessibility.sleepChronotype === 'night_owl'
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                        : 'bg-neutral-900 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Night Owl</span>
                  </button>
                </div>
              </div>

              {/* Cleanliness */}
              <div className="p-4 rounded-2xl bg-neutral-950 border border-white/[0.08] space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-400 font-mono text-[11px]">Cleanliness Standard</span>
                  <span className="text-white font-mono font-bold">
                    {profile.lifestyle.cleanlinessStandard}/5
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  step={1}
                  value={profile.lifestyle.cleanlinessStandard}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      lifestyle: {
                        ...profile.lifestyle,
                        cleanlinessStandard: Number(e.target.value) as 1 | 2 | 3 | 4 | 5,
                      },
                    })
                  }
                  className="w-full accent-cyan cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                  <span>Relaxed</span>
                  <span>Orderly</span>
                  <span>Immaculate</span>
                </div>
              </div>
            </div>

            {/* Reassurance & Cadence */}
            <div className="space-y-2">
              <label className="text-xs text-neutral-400 font-mono block">Reassurance & Texting Cadence</label>
              <div className="space-y-2 text-xs">
                {[
                  'Warm daily check-ins (1–2 thoughtful messages)',
                  'Thoughtful intermittent (fine with a quiet day)',
                  'In-person centered (low texting between dates)',
                ].map((cad) => (
                  <div
                    key={cad}
                    onClick={() => setReassuranceCadence(cad)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                      reassuranceCadence === cad
                        ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200'
                        : 'bg-neutral-950 border-white/[0.06] text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span className="font-light">{cad}</span>
                    {reassuranceCadence === cad && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Conflict & Repair Protocol */}
            <div className="space-y-2">
              <label className="text-xs text-neutral-400 font-mono block">Conflict &amp; Repair Protocol</label>
              <div className="space-y-2 text-xs">
                {[
                  'Needs 20-min cool-down before speaking calmly',
                  'Prefers talking it through immediately with care',
                  'Drafts thoughts in writing first to avoid reactivity',
                ].map((cStyle) => (
                  <div
                    key={cStyle}
                    onClick={() => setConflictStyle(cStyle)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                      conflictStyle === cStyle
                        ? 'bg-purple-950/30 border-purple-500/50 text-purple-200'
                        : 'bg-neutral-950 border-white/[0.06] text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span className="font-light">{cStyle}</span>
                    {conflictStyle === cStyle && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Sensory Recharge & Solitude */}
            <div className="space-y-2">
              <label className="text-xs text-neutral-400 font-mono block">Sensory Recharge &amp; Solitude</label>
              <div className="space-y-2 text-xs">
                {[
                  'Parallel play (reading/working quietly in the same room)',
                  'Solitary sanctuary (needs 1–2 solo evenings weekly)',
                  'Social host (recharges by hosting and socializing)',
                ].map((rStyle) => (
                  <div
                    key={rStyle}
                    onClick={() => setRechargeStyle(rStyle)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                      rechargeStyle === rStyle
                        ? 'bg-sky-950/30 border-sky-500/50 text-sky-200'
                        : 'bg-neutral-950 border-white/[0.06] text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span className="font-light">{rStyle}</span>
                    {rechargeStyle === rStyle && <CheckCircle2 className="w-4 h-4 text-sky-400" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Dating Traps Being Broken (Need #2, #9) */}
            <div className="space-y-3 pt-2">
              <label className="text-xs text-neutral-400 font-mono block">
                Dating Traps I Am Actively Choosing to Break
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: 'Confusing emotional adrenaline with genuine long-term fit',
                    title: 'Confusing Intensity with Intimacy',
                    trap: 'Chasing unpredictable, aloof partners whose inconsistent replies trigger anxiety.',
                  },
                  {
                    id: 'Ignoring mismatched family timelines early on',
                    title: 'The "They’ll Change Their Mind" Trap',
                    trap: 'Investing months hoping a partner will change mind on marriage, kids, or location.',
                  },
                  {
                    id: 'Compromising boundaries to avoid being alone',
                    title: 'Boundary Slippage',
                    trap: 'Tolerating dealbreaker habits because they look good on paper or feel charming.',
                  },
                  {
                    id: 'Second-guessing your own intuition after bad dates',
                    title: 'Distrusting Your Own Judgment',
                    trap: 'Feeling cynical after ghosting, wondering if you can trust yourself.',
                  },
                ].map((trap) => {
                  const isSelected = acknowledgedPatterns.includes(trap.id)
                  return (
                    <div
                      key={trap.id}
                      onClick={() => {
                        setAcknowledgedPatterns((prev) =>
                          prev.includes(trap.id)
                            ? prev.filter((p) => p !== trap.id)
                            : [...prev, trap.id]
                        )
                      }}
                      className={`p-3.5 rounded-2xl border transition cursor-pointer space-y-1.5 ${
                        isSelected
                          ? 'bg-rose-950/20 border-rose-500/40 text-rose-200'
                          : 'bg-neutral-950 border-white/[0.06] text-neutral-400 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-semibold text-white">{trap.title}</h4>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
                      </div>
                      <p className="text-[11px] font-light leading-relaxed">{trap.trap}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Live Taste Blend Simulator (Spotify Blend Spec) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-neutral-950 border border-white/[0.08] space-y-4 pt-4 border-t border-white/[0.06]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#F472B6]">
                  Live Taste Blend Preview
                </span>
                <span className="text-[11px] font-mono text-neutral-400">
                  {blendCandidate.identity.name.split(' ')[0]} • {blendEvaluation?.mutuality.score || 96}% Resonance
                </span>
              </div>

              <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar">
                {mockCandidates.slice(0, 5).map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedBlendCandidateId(c.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-mono transition cursor-pointer shrink-0 ${
                      blendCandidate.id === c.id
                        ? 'bg-[#F472B6] text-black font-semibold'
                        : 'bg-white/[0.04] text-neutral-400 hover:text-white border border-white/[0.08]'
                    }`}
                  >
                    {c.identity.name.split(' ')[0]}
                  </button>
                ))}
              </div>

              {blendEvaluation && (
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-xs">
                  <span className="text-neutral-300">
                    Values &amp; Lifestyle Overlap with {blendCandidate.identity.name}
                  </span>
                  <span className="font-mono font-bold text-emerald-400">
                    {blendEvaluation.mutuality.score}% Harmonic
                  </span>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 11. PRIVACY & LOCATION SUBVIEW                           */}
      {/* ======================================================== */}
      {subview === 'privacy_location' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pt-2 pb-1">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSubview('hub')}
                className="p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.12] text-neutral-300 hover:text-white transition cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">Privacy & Location</h1>
                <p className="text-xs text-neutral-400 font-light">Visibility and cryptographic privacy controls</p>
              </div>
            </div>

            <button
              onClick={() => handleSaveAll('Privacy settings updated.')}
              className="px-4 py-1.5 rounded-full bg-[#F472B6] hover:bg-pink-400 text-black text-xs font-semibold transition cursor-pointer shadow-md"
            >
              Save
            </button>
          </div>

          <div className="bg-[#17161A] border border-white/[0.08] rounded-3xl p-5 sm:p-6 space-y-5 shadow-xl">
            
            {/* Incognito Discovery Mode */}
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
              <div className="pr-4">
                <span className="text-xs font-semibold text-white block">Incognito Discovery Mode</span>
                <span className="text-[11px] text-neutral-400 font-light">
                  Only profiles you have mutually selected will be able to see your presence.
                </span>
              </div>
              <button
                onClick={() =>
                  setProfile({
                    ...profile,
                    privacy: {
                      ...profile.privacy,
                      incognitoMode: !profile.privacy.incognitoMode,
                    },
                  })
                }
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                  profile.privacy.incognitoMode ? 'bg-[#F472B6]' : 'bg-neutral-800'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                    profile.privacy.incognitoMode ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Location Blur Radius */}
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
              <div>
                <span className="text-xs font-semibold text-white block">Location Blur Radius</span>
                <span className="text-[11px] text-neutral-400 font-light">
                  Randomizes exact coordinates by ±{profile.privacy.fuzzLocationRadiusKm} km to prevent geolocation triangulation.
                </span>
              </div>
              <span className="font-mono text-xs text-[#F472B6] font-bold">
                ±{profile.privacy.fuzzLocationRadiusKm} km
              </span>
            </div>

            {/* Invariant D-23 Verification Badge */}
            <div className="p-4 rounded-2xl bg-neutral-950 border border-white/[0.08] space-y-2 text-xs">
              <div className="flex items-center space-x-2 text-emerald-400 font-semibold font-mono">
                <CheckCircle2 className="w-4 h-4" />
                <span>Invariant D-23 Verified</span>
              </div>
              <p className="text-[11px] text-neutral-400 font-light leading-relaxed">
                Zero pay-to-win ranking. Matching priority is strictly computed from reciprocal compatibility, with zero bidding or paid algorithmic boosts.
              </p>
            </div>

            {/* End-to-End Encryption Badge */}
            <div className="p-4 rounded-2xl bg-neutral-950 border border-white/[0.08] space-y-2 text-xs">
              <div className="flex items-center space-x-2 text-sky-400 font-semibold font-mono">
                <Lock className="w-4 h-4" />
                <span>Field-Level Encryption (AES-256-GCM)</span>
              </div>
              <p className="text-[11px] text-neutral-400 font-light leading-relaxed">
                Sensitive accommodation, family, and health standards are sealed with distinct client keys.
              </p>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 12. PROFILE PREVIEW MODAL/SUBVIEW                         */}
      {/* ======================================================== */}
      {subview === 'preview' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pt-2 pb-1">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSubview('hub')}
                className="p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.12] text-neutral-300 hover:text-white transition cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">Profile Preview</h1>
                <p className="text-xs text-neutral-400 font-light">This is how other candidates see you in Discover</p>
              </div>
            </div>

            <button
              onClick={() => setSubview('hub')}
              className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition cursor-pointer"
            >
              Done
            </button>
          </div>

          {/* Candidate Card Preview */}
          <div className="bg-[#17161A] border border-white/[0.1] rounded-3xl overflow-hidden shadow-2xl space-y-5 pb-6">
            <div className="relative aspect-[4/5] w-full">
              <img
                src={profile.identity.photos[0]}
                alt={profile.identity.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F0E11] via-transparent to-black/30" />

              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full bg-[#F472B6] text-black font-semibold text-xs shadow-md">
                  ✓ Verified Profile
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 space-y-1">
                <div className="flex items-center space-x-2">
                  <h2 className="text-2xl font-bold text-white">{profile.identity.name}</h2>
                  <span className="text-xl text-neutral-300 font-light">{profile.identity.age}</span>
                </div>
                <p className="text-xs text-neutral-300">
                  📍 {profile.geography.cityName} • {profile.identity.pronouns}
                </p>
              </div>
            </div>

            <div className="px-5 space-y-4">
              <p className="text-xs text-neutral-200 font-light italic">
                "{profile.identity.bio}"
              </p>

              <div className="pt-3 border-t border-white/[0.06] space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block">
                  Looking For
                </span>
                <span className="inline-block px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-medium">
                  {profile.intention.primaryIntent}
                </span>
              </div>

              <div className="pt-3 border-t border-white/[0.06] space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block">
                  Core Life Anchors
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {profile.values.coreValues.map((v) => (
                    <span
                      key={v}
                      className="px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-neutral-300 text-xs"
                    >
                      {v}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-white/[0.06] space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block">
                  House Rules &amp; Boundaries
                </span>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    🚭 {profile.lifestyle.smoking === 'never' ? 'Smoke-Free' : 'Social Smoker'}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 capitalize">
                    🥗 {profile.lifestyle.diet}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 capitalize">
                    🍷 {profile.lifestyle.alcohol}
                  </span>
                </div>
              </div>

              {/* Quick Actions from Preview */}
              <div className="pt-4 border-t border-white/[0.06] flex items-center space-x-3">
                <button
                  onClick={() => {
                    if (onNavigateToDiscover) onNavigateToDiscover()
                    else if (onNavigateView) onNavigateView('recs')
                  }}
                  className="flex-1 py-2.5 rounded-full bg-[#F472B6] hover:bg-pink-400 text-black text-xs font-semibold flex items-center justify-center space-x-1.5 transition cursor-pointer shadow-md"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Discover Candidates</span>
                </button>
                <button
                  onClick={() => {
                    if (onNavigateToDialogue) onNavigateToDialogue()
                    else if (onNavigateView) onNavigateView('conversations')
                  }}
                  className="flex-1 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center justify-center space-x-1.5 transition cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
                  <span>Messages</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 13. SIGN OUT CONFIRMATION MODAL                           */}
      {/* ======================================================== */}
      {isSignOutModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#17161A] border border-white/10 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto">
              <LogOut className="w-6 h-6 text-rose-400" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-white">Sign out of Check?</h3>
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
