// ============================================================================
// src/components/UserAccountView.tsx
// Universal Compatibility Platform: The Relational Sanctuary & Taste Blend
// Inspired by: Airbnb (Dignified House Rules) × Spotify Blend (Taste & Chemistry)
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
  Home,
  Compass,
  Activity,
  Music,
  Moon,
  Sun,
  ArrowRight,
  CheckCircle2,
  Lock,
} from 'lucide-react'
import type { UniversalUserProfile } from '../types'
import { evaluateMatch } from '../utils/matchingEngine'
import { mockCandidates } from '../data/mockProfiles'

interface UserAccountViewProps {
  currentUser: UniversalUserProfile
  onUpdateUser: (updated: UniversalUserProfile) => void
  onSwitchPersona?: (user: UniversalUserProfile) => void
  onNavigateToDiscover?: () => void
  onNavigateToNetwork?: () => void
  onNavigateToDialogue?: () => void
  onLaunchFTUX?: () => void
}

export const UserAccountView: React.FC<UserAccountViewProps> = ({
  currentUser,
  onUpdateUser,
  onSwitchPersona,
  onNavigateToDiscover,
  onNavigateToNetwork,
  onNavigateToDialogue,
  onLaunchFTUX,
}) => {
  // Local editable draft state
  const [profile, setProfile] = useState<UniversalUserProfile>(currentUser)
  const [activeTab, setActiveTab] = useState<'vision' | 'sanctuary' | 'blend' | 'security' | 'onboarding'>('vision')
  const [selectedBlendCandidateId, setSelectedBlendCandidateId] = useState<string>(mockCandidates[0]?.id || '')
  const [saveToast, setSaveToast] = useState<string | null>(null)
  const [vibeStatus, setVibeStatus] = useState<string>(
    'Exploring quiet acoustics, gallery walks, and slow coffee in Bloomsbury.'
  )
  const [isEditingVibe, setIsEditingVibe] = useState<boolean>(false)

  // Relationship Vision & Self-Mirror State (Needs #5, #6, #9, #12)
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

  // Onboarding wizard step state (if user runs the 5-step guided journey)
  const [wizardStep, setWizardStep] = useState<number>(1)

  const triggerToast = (msg: string) => {
    setSaveToast(msg)
    setTimeout(() => setSaveToast(null), 3000)
  }

  const handleSaveAll = () => {
    onUpdateUser(profile)
    triggerToast('All changes saved to your Sanctuary & Relationship Vision.')
  }

  // Selected candidate for live Spotify-style Blend
  const blendCandidate =
    mockCandidates.find((c) => c.id === selectedBlendCandidateId) || mockCandidates[0]

  const blendEvaluation = blendCandidate
    ? evaluateMatch(profile, blendCandidate)
    : null

  // Calculate live stats
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

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-4 px-4 sm:px-6 lg:px-8 text-neutral-100 font-sans">
      
      {/* ======================================================== */}
      {/* 1. HERO ACCOUNT BAR (MESSENGER / AIRBNB / SPOTIFY MERGE) */}
      {/* ======================================================== */}
      <section className="bg-neutral-900/80 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
        {/* Subtle decorative radial glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-rose-500/10 via-emerald-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          {/* Avatar & Identity Info */}
          <div className="flex items-center space-x-5">
            <div className="relative">
              <img
                src={profile.identity.photos[0]}
                alt={profile.identity.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover ring-2 ring-white/20 shadow-xl"
              />
              <div
                className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 ring-4 ring-neutral-900 flex items-center justify-center"
                title="Active in London"
              >
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  {profile.identity.name}
                </h1>
                <span className="text-neutral-400 font-mono text-sm">
                  @{profile.identity.name.toLowerCase().replace(/\s+/g, '')}.v
                </span>
                {profile.identity.verified && (
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-medium">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verified</span>
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-400">
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-neutral-500" />
                  <span>{profile.geography.cityName}</span>
                </span>
                <span>•</span>
                <span>{profile.identity.age} years old</span>
                <span>•</span>
                <span>{profile.identity.pronouns}</span>
                <span>•</span>
                <span className="text-neutral-300 font-medium">
                  {profile.intention.primaryIntent}
                </span>
              </div>

              {/* Bio snippet */}
              <p className="text-xs text-neutral-300 font-light max-w-xl pt-1">
                "{profile.identity.bio}"
              </p>
            </div>
          </div>

          {/* Quick Action Buttons & Universe Counter */}
          <div className="flex flex-col sm:items-end space-y-3 w-full md:w-auto">
            <div className="flex items-center space-x-2 text-xs font-mono bg-white/[0.04] border border-white/[0.08] px-3.5 py-1.5 rounded-full">
              <span className="text-emerald-400 font-semibold">{eligibleCandidatesCount} Mutual Candidates</span>
              <span className="text-neutral-500">|</span>
              <span className="text-neutral-300">Sanctuary Open</span>
            </div>

            <div className="flex items-center space-x-2">
              {onNavigateToNetwork && (
                <button
                  onClick={onNavigateToNetwork}
                  className="px-3.5 py-1.5 text-xs font-medium rounded-full bg-purple-950/40 hover:bg-purple-900/60 text-purple-300 border border-purple-500/30 transition flex items-center space-x-1.5 cursor-pointer shadow-[0_0_15px_rgba(192,132,252,0.2)]"
                >
                  <Compass className="w-3.5 h-3.5 text-purple-400" />
                  <span>Constellation</span>
                </button>
              )}

              <button
                onClick={onLaunchFTUX ? onLaunchFTUX : () => setActiveTab('onboarding')}
                className="px-3.5 py-1.5 text-xs font-medium rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/15 transition flex items-center space-x-1.5 cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>90s Guided Calibration</span>
              </button>

              <button
                onClick={handleSaveAll}
                className="px-4 py-1.5 text-xs font-semibold rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30 transition flex items-center space-x-1.5 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Sanctuary</span>
              </button>
            </div>
          </div>
        </div>

        {/* Real-Time "What's On Your Mind / Current Sanctuary Vibe" (Messenger style) */}
        <div className="mt-6 pt-5 border-t border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2.5 w-full sm:w-auto">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-rose-500/10 text-rose-300 border border-rose-500/20">
              Current Vibe
            </span>
            {isEditingVibe ? (
              <input
                type="text"
                value={vibeStatus}
                onChange={(e) => setVibeStatus(e.target.value)}
                onBlur={() => setIsEditingVibe(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingVibe(false)}
                autoFocus
                className="bg-neutral-950 border border-white/20 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-rose-400 w-full sm:w-96 font-light"
              />
            ) : (
              <span
                onClick={() => setIsEditingVibe(true)}
                className="text-neutral-300 hover:text-white cursor-pointer font-light italic"
                title="Click to edit current vibe"
              >
                💭 "{vibeStatus}"
              </span>
            )}
          </div>

          <div className="text-[11px] text-neutral-500 font-mono">
            <span>Matching Engine: Fair &amp; Verified</span>
          </div>
        </div>
      </section>

      {/* Save Toast Notification */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-2xl bg-emerald-600/90 text-white text-xs font-medium shadow-2xl backdrop-blur border border-emerald-400/40 flex items-center space-x-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. DUAL ARCHITECTURE PILL TABS                           */}
      {/* ======================================================== */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 overflow-x-auto no-scrollbar">
        <div className="flex items-center p-1 rounded-full bg-white/[0.04] border border-white/[0.08] shrink-0">
          <button
            onClick={() => setActiveTab('vision')}
            className={`min-h-[44px] px-4 py-2 rounded-full text-xs font-medium transition flex items-center space-x-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'vision'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 shadow-sm font-semibold'
                : 'text-neutral-400 hover:text-white border border-transparent'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span>Relationship Vision <span className="hidden sm:inline">&amp; Self-Mirror</span></span>
          </button>

          <button
            onClick={() => setActiveTab('blend')}
            className={`min-h-[44px] px-4 py-2 rounded-full text-xs font-medium transition flex items-center space-x-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'blend'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 shadow-sm font-semibold'
                : 'text-neutral-400 hover:text-white border border-transparent'
            }`}
          >
            <Music className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span>Shared Chemistry <span className="hidden sm:inline">(Taste Blend)</span></span>
          </button>

          <button
            onClick={() => setActiveTab('sanctuary')}
            className={`min-h-[44px] px-4 py-2 rounded-full text-xs font-medium transition flex items-center space-x-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'sanctuary'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm font-semibold'
                : 'text-neutral-400 hover:text-white border border-transparent'
            }`}
          >
            <Home className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>My Boundaries <span className="hidden sm:inline">(House Rules)</span></span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`min-h-[44px] px-4 py-2 rounded-full text-xs font-medium transition flex items-center space-x-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'security'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30 shadow-sm font-semibold'
                : 'text-neutral-400 hover:text-white border border-transparent'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span>Privacy &amp; Security</span>
          </button>
        </div>

        {/* Persona Quick Switcher */}
        {onSwitchPersona && (
          <div className="hidden lg:flex items-center space-x-1.5 text-xs">
            <span className="text-neutral-500 font-mono text-[11px]">Demo:</span>
            {demoPersonas.map((dp) => (
              <button
                key={dp.id}
                onClick={() => {
                  onSwitchPersona(dp.profile)
                  setProfile(dp.profile)
                  triggerToast(`Switched active view to ${dp.name} (${dp.role})`)
                }}
                className={`px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer transition ${
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
      </div>

      {/* ======================================================== */}
      {/* TAB 0: RELATIONSHIP VISION & SELF-MIRROR (NEEDS #5, #6, #9, #12) */}
      {/* ======================================================== */}
      {activeTab === 'vision' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Editorial Intro Banner */}
          <div className="bg-gradient-to-r from-purple-950/40 via-neutral-900/60 to-emerald-950/40 border border-purple-500/20 rounded-3xl p-6 sm:p-8 backdrop-blur-xl space-y-3">
            <div className="flex items-center space-x-2 text-purple-300 text-xs font-mono font-semibold">
              <Compass className="w-4 h-4" />
              <span>THE RELATIONSHIP DECISION MIRROR</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight">
              Turn &ldquo;I Want Someone Good&rdquo; Into a Concrete Life Vision
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 font-light max-w-3xl leading-relaxed">
              Most dating apps only ask &ldquo;Who do you find attractive?&rdquo; Check acts as a mirror to help you answer the questions that actually determine your future: What kind of relationship are you building? How does your nervous system behave in intimacy? And which dating traps are you choosing to break?
            </p>
          </div>

          {/* Module 1: What Kind of Relationship Am I Building? (Need #5) */}
          <section className="bg-neutral-900/70 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="border-b border-white/[0.08] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-purple-400">
                  Partnership Architecture (Need #5)
                </span>
                <h3 className="text-lg font-bold text-white">
                  The Kind of Partnership I Am Actively Building
                </h3>
              </div>
              <span className="text-xs text-neutral-400 font-mono">
                Active: {partnershipType}
              </span>
            </div>

            {/* Partnership Type Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  id: 'Deep Companionship & Co-Creation',
                  title: 'Deep Companionship & Co-Creation',
                  icon: '🎨',
                  desc: 'Shared creative, intellectual, and personal projects. Mutual emotional champions with deep conversations.',
                },
                {
                  id: 'Quiet Domestic Sanctuary',
                  title: 'Quiet Domestic Sanctuary',
                  icon: '🏡',
                  desc: 'Restorative home life, slow cooking, gentle rituals, low sensory stimulation, and peaceful evenings.',
                },
                {
                  id: 'Family & Roots Anchor',
                  title: 'Family & Roots Anchor',
                  icon: '👶',
                  desc: 'Committed home-building with shared desire for children, community roots, and generational warmth.',
                },
                {
                  id: 'Independent Adventurers',
                  title: 'Independent Adventurers',
                  icon: '✈️',
                  desc: 'Passionate emotional bond with high individual freedom, career autonomy, travel, and separate pursuits.',
                },
              ].map((item) => (
                <div
                  key={item.id}
                  onClick={() => setPartnershipType(item.id)}
                  className={`p-5 rounded-2xl border transition cursor-pointer flex flex-col justify-between space-y-3 ${
                    partnershipType === item.id
                      ? 'bg-purple-950/40 border-purple-500/60 shadow-[0_0_20px_rgba(168,85,247,0.2)]'
                      : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05] hover:border-white/15'
                  }`}
                >
                  <div className="space-y-2">
                    <span className="text-2xl block">{item.icon}</span>
                    <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                    <p className="text-xs text-neutral-400 font-light leading-relaxed">{item.desc}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-xs">
                    <span className="text-[11px] font-mono text-neutral-400">Status:</span>
                    <span className={`text-[11px] font-semibold ${partnershipType === item.id ? 'text-purple-300' : 'text-neutral-500'}`}>
                      {partnershipType === item.id ? 'Selected' : 'Select'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Living Arrangement & Financial Philosophy Selectors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
                <span className="text-xs font-semibold text-white block">Cohabitation &amp; Personal Space</span>
                <div className="space-y-2 text-xs">
                  {[
                    'Shared home with dedicated quiet nooks',
                    'Full full-time cohabitation in shared space',
                    'Living in close proximity (separate homes)',
                  ].map((opt) => (
                    <label
                      key={opt}
                      onClick={() => setCohabitationVision(opt)}
                      className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                        cohabitationVision === opt
                          ? 'bg-purple-950/30 border-purple-500/50 text-white'
                          : 'bg-white/[0.02] border-white/[0.06] text-neutral-400 hover:text-white'
                      }`}
                    >
                      <span className="font-light">{opt}</span>
                      {cohabitationVision === opt && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
                    </label>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
                <span className="text-xs font-semibold text-white block">Financial Philosophy &amp; Transparency</span>
                <div className="space-y-2 text-xs">
                  {[
                    'Proportional shared pool with open transparency',
                    'Equal 50/50 split on household expenses',
                    'Completely independent financial streams',
                  ].map((opt) => (
                    <label
                      key={opt}
                      onClick={() => setFinancePhilosophy(opt)}
                      className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                        financePhilosophy === opt
                          ? 'bg-emerald-950/30 border-emerald-500/50 text-white'
                          : 'bg-white/[0.02] border-white/[0.06] text-neutral-400 hover:text-white'
                      }`}
                    >
                      <span className="font-light">{opt}</span>
                      {financePhilosophy === opt && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Module 2: Self in Relationships — The Mirror (Need #6) */}
          <section className="bg-neutral-900/70 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="border-b border-white/[0.08] pb-4">
              <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400">
                Self-Understanding Mirror (Need #6)
              </span>
              <h3 className="text-lg font-bold text-white">
                How My Nervous System Operates in a Relationship
              </h3>
              <p className="text-xs text-neutral-400 font-light mt-0.5">
                Reflecting your real-life relationship habits: communication reassurance, conflict style, and quiet recharge.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 1. Reassurance Cadence */}
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
                <span className="text-xs font-semibold text-white block">Reassurance &amp; Texting Cadence</span>
                <div className="space-y-2 text-xs">
                  {[
                    'Warm daily check-ins (1–2 thoughtful messages)',
                    'Thoughtful intermittent (fine with a quiet day)',
                    'In-person centered (low texting between dates)',
                  ].map((cad) => (
                    <div
                      key={cad}
                      onClick={() => setReassuranceCadence(cad)}
                      className={`p-2.5 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                        reassuranceCadence === cad
                          ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200'
                          : 'bg-white/[0.02] border-white/[0.05] text-neutral-400 hover:text-white'
                      }`}
                    >
                      <span className="text-xs font-light">{cad}</span>
                      {reassuranceCadence === cad && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-1.5" />}
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-neutral-500 font-light pt-1">
                  Prevents mismatched expectations where one person feels ignored and the other feels overwhelmed.
                </p>
              </div>

              {/* 2. Conflict Style */}
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
                <span className="text-xs font-semibold text-white block">Conflict &amp; Disagreement Response</span>
                <div className="space-y-2 text-xs">
                  {[
                    'Needs 20-min cool-down before speaking calmly',
                    'Prefers talking it through immediately with care',
                    'Drafts thoughts in writing first to avoid reactivity',
                  ].map((cStyle) => (
                    <div
                      key={cStyle}
                      onClick={() => setConflictStyle(cStyle)}
                      className={`p-2.5 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                        conflictStyle === cStyle
                          ? 'bg-purple-950/30 border-purple-500/50 text-purple-200'
                          : 'bg-white/[0.02] border-white/[0.05] text-neutral-400 hover:text-white'
                      }`}
                    >
                      <span className="text-xs font-light">{cStyle}</span>
                      {conflictStyle === cStyle && <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 ml-1.5" />}
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-neutral-500 font-light pt-1">
                  Understanding de-escalation needs prevents 90% of cyclical relationship arguments.
                </p>
              </div>

              {/* 3. Sensory Battery */}
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
                <span className="text-xs font-semibold text-white block">Sensory Recharge &amp; Solitude</span>
                <div className="space-y-2 text-xs">
                  {[
                    'Parallel play (reading/working quietly in the same room)',
                    'Solitary sanctuary (needs 1–2 solo evenings weekly)',
                    'Social host (recharges by hosting and socializing)',
                  ].map((rStyle) => (
                    <div
                      key={rStyle}
                      onClick={() => setRechargeStyle(rStyle)}
                      className={`p-2.5 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                        rechargeStyle === rStyle
                          ? 'bg-sky-950/30 border-sky-500/50 text-sky-200'
                          : 'bg-white/[0.02] border-white/[0.05] text-neutral-400 hover:text-white'
                      }`}
                    >
                      <span className="text-xs font-light">{rStyle}</span>
                      {rechargeStyle === rStyle && <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0 ml-1.5" />}
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-neutral-500 font-light pt-1">
                  Protects your battery from draining without making your partner feel rejected.
                </p>
              </div>
            </div>
          </section>

          {/* Module 3: Dating Pattern Awareness & Breaking Past Traps (Needs #2, #9, #12) */}
          <section className="bg-neutral-900/70 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="border-b border-white/[0.08] pb-4">
              <span className="text-xs uppercase tracking-wider font-semibold text-rose-400">
                Pattern Awareness &amp; Past Lessons (Needs #2, #9, #12)
              </span>
              <h3 className="text-lg font-bold text-white">
                Dating Traps I Am Actively Choosing to Break
              </h3>
              <p className="text-xs text-neutral-400 font-light mt-0.5">
                Pattern awareness leads to better choices. Toggle the traps you recognize to keep Check calibrated as your ally.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  id: 'Confusing emotional adrenaline with genuine long-term fit',
                  title: 'Confusing Intensity with Intimacy',
                  trap: 'Chasing unpredictable, aloof partners whose inconsistent replies trigger anxiety that mimics passion.',
                  antidote: 'Check highlights grounded, consistent partners whose communication calms your nervous system.',
                },
                {
                  id: 'Ignoring mismatched family timelines early on',
                  title: 'The "They’ll Change Their Mind" Trap',
                  trap: 'Investing months in someone whose timeline on marriage, kids, or location differs from yours, hoping love will fix it.',
                  antidote: 'Check makes long-term life intent transparent on Day 1 so you don’t invest emotional energy blindly.',
                },
                {
                  id: 'Compromising boundaries to avoid being alone',
                  title: 'Self-Abandonment & Boundary Slippage',
                  trap: 'Tolerating dealbreaker habits (substances, chaotic boundaries) because they look good on paper or feel charming.',
                  antidote: 'Check strictly enforces your 3-tier dealbreakers with 0% boundary leakage.',
                },
                {
                  id: 'Second-guessing your own intuition after bad dates',
                  title: 'Distrusting Your Own Judgment',
                  trap: 'Feeling cynical or overwhelmed after ghosting or manipulation, wondering if you can trust yourself.',
                  antidote: 'Check never asks you to trust an algorithm. It presents transparent facts so you can trust your own informed decisions.',
                },
              ].map((trapItem) => {
                const isSelected = acknowledgedPatterns.includes(trapItem.id)
                return (
                  <div
                    key={trapItem.id}
                    onClick={() => {
                      setAcknowledgedPatterns((prev) =>
                        prev.includes(trapItem.id)
                          ? prev.filter((p) => p !== trapItem.id)
                          : [...prev, trapItem.id]
                      )
                    }}
                    className={`p-5 rounded-2xl border transition cursor-pointer space-y-3 ${
                      isSelected
                        ? 'bg-rose-950/20 border-rose-500/40 shadow-sm'
                        : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-white">{trapItem.title}</h4>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        isSelected
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                          : 'bg-white/[0.05] text-neutral-400 border-white/[0.08]'
                      }`}>
                        {isSelected ? 'Pattern Active' : 'Tap to Activate'}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-300 font-light leading-relaxed">
                      <strong className="text-rose-300">The Past Habit:</strong> {trapItem.trap}
                    </p>

                    <p className="text-xs text-emerald-300 font-light leading-relaxed pt-2 border-t border-white/[0.06]">
                      <strong className="text-emerald-400">The Check Antidote:</strong> {trapItem.antidote}
                    </p>
                  </div>
                )
              })}
            </div>

            {/* Save Button in Tab */}
            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={handleSaveAll}
                className="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-900/30 transition flex items-center space-x-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Save Relationship Vision &amp; Self-Mirror</span>
              </button>
            </div>
          </section>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 1: THE SPOTIFY BLEND (TASTE & RESONANCE SPECTRUM)     */}
      {/* ======================================================== */}
      {activeTab === 'blend' && (
        <div className="space-y-8">
          {/* Blend Editorial Intro Banner */}
          <div className="bg-gradient-to-r from-rose-950/40 via-neutral-900/60 to-purple-950/40 border border-rose-500/20 rounded-3xl p-6 sm:p-7 backdrop-blur-xl space-y-3">
            <div className="flex items-center space-x-2 text-rose-400 text-xs font-mono font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>THE TASTE & RESONANCE SPECTRUM</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Life Isn’t a Form. It’s an Overlapping Playlist.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 font-light max-w-3xl leading-relaxed">
              Inspired by Spotify Blend: We don't diagnose you with clinical checkboxes. We map your natural life frequencies—your intellectual compass, creative drivers, and daily recharge rhythm—then calculate how your wavelengths harmonize with potential partners.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Your Personal Taste Frequencies */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Core Values Compass (The Life Anchors) */}
              <div className="bg-neutral-900/70 border border-white/10 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
                    <Heart className="w-4 h-4 text-rose-400" />
                    <span>Core Life Compass (Values & Philosophy)</span>
                  </h3>
                  <span className="text-[11px] text-neutral-400 font-mono">
                    {profile.values.coreValues.length} Active Anchors
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
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
                            ? 'bg-rose-500 text-white shadow-md shadow-rose-900/40 border border-rose-400'
                            : 'bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700 border border-neutral-700'
                        }`}
                      >
                        <span>{val}</span>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* What Expands My World (Aron's Self-Expansion Model) */}
              <div className="bg-neutral-900/70 border border-white/10 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
                    <Compass className="w-4 h-4 text-purple-400" />
                    <span>What Expands My World (Self-Expansion Drivers)</span>
                  </h3>
                  <span className="text-[11px] text-purple-300 font-mono">Aron Model</span>
                </div>

                <p className="text-xs text-neutral-400 font-light">
                  What domains ignite your curiosity and create new shared identities with a partner?
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-medium">
                  {[
                    'Contemporary Art & Galleries',
                    'Acoustics & Spatial Sound',
                    'Independent Cinema',
                    'Slow Travel & Offbeat Cities',
                    'Philosophy & Metacognition',
                    'Culinary Craft & Wine',
                    'Literature & Long-form Essays',
                    'Urban Architecture Walks',
                    'Modular Synthesizers',
                  ].map((interest) => (
                    <div
                      key={interest}
                      className="p-3 rounded-2xl bg-neutral-950/60 border border-white/[0.08] hover:border-purple-500/40 text-neutral-300 hover:text-white transition flex items-center space-x-2"
                    >
                      <Sparkles className="w-3 h-3 text-purple-400 shrink-0" />
                      <span className="text-[11px] font-sans">{interest}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Daily Cadence & Circadian Flow */}
              <div className="bg-neutral-900/70 border border-white/10 rounded-3xl p-6 space-y-4">
                <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span>Daily Living Ecology & Circadian Flow</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* Sleep Chronotype */}
                  <div className="p-4 rounded-2xl bg-neutral-950/60 border border-white/[0.08] space-y-2">
                    <span className="text-neutral-400 font-mono text-[11px] block">Sleep Chronotype</span>
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
                            : 'bg-neutral-800 text-neutral-400 hover:text-white'
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
                            : 'bg-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                      >
                        <Moon className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Night Owl</span>
                      </button>
                    </div>
                  </div>

                  {/* Cleanliness Standard */}
                  <div className="p-4 rounded-2xl bg-neutral-950/60 border border-white/[0.08] space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400 font-mono text-[11px]">Cleanliness Standard</span>
                      <span className="text-white font-mono font-bold">
                        {profile.lifestyle.cleanlinessStandard}/5
                      </span>
                    </div>
                    <div className="flex items-center space-x-2.5">
                      <button
                        type="button"
                        onClick={() =>
                          setProfile({
                            ...profile,
                            lifestyle: {
                              ...profile.lifestyle,
                              cleanlinessStandard: Math.max(1, profile.lifestyle.cleanlinessStandard - 1) as 1 | 2 | 3 | 4 | 5,
                            },
                          })
                        }
                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 text-white font-bold text-sm flex items-center justify-center shrink-0 cursor-pointer"
                        aria-label="Decrease cleanliness standard"
                      >
                        -
                      </button>
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
                        className="flex-1 accent-cyan cursor-pointer"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setProfile({
                            ...profile,
                            lifestyle: {
                              ...profile.lifestyle,
                              cleanlinessStandard: Math.min(5, profile.lifestyle.cleanlinessStandard + 1) as 1 | 2 | 3 | 4 | 5,
                            },
                          })
                        }
                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 text-white font-bold text-sm flex items-center justify-center shrink-0 cursor-pointer"
                        aria-label="Increase cleanliness standard"
                      >
                        +
                      </button>
                    </div>
                    <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                      <span>Relaxed</span>
                      <span>Orderly</span>
                      <span>Immaculate</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right: The Live Spotify Blend Simulator */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-gradient-to-b from-neutral-900 via-neutral-900/90 to-neutral-950 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-5 sticky top-24">
                
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400 flex items-center space-x-1.5">
                    <Music className="w-4 h-4" />
                    <span>Live Blend Simulator</span>
                  </span>
                  <span className="text-[11px] text-neutral-400 font-mono">How You Connect</span>
                </div>

                {/* Candidate Selector for Blend */}
                <div className="space-y-2">
                  <label className="text-[11px] text-neutral-400 font-mono block">
                    Choose Candidate to Blend With:
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                    {mockCandidates.slice(0, 6).map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setSelectedBlendCandidateId(c.id)}
                        className={`p-2 rounded-xl text-center transition cursor-pointer border ${
                          blendCandidate?.id === c.id
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm'
                            : 'bg-neutral-950 text-neutral-400 hover:text-white border-white/[0.06]'
                        }`}
                      >
                        <span className="block font-semibold truncate">{c.identity.name.split(' ')[0]}</span>
                        <span className="text-[10px] text-neutral-500">{c.identity.age} y/o</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* The Spotify Blend Visualizer Card */}
                {blendEvaluation && blendCandidate && (
                  <div className="p-5 rounded-2xl bg-neutral-950/80 border border-white/[0.08] space-y-4">
                    
                    {/* The Blend Score Gauge */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="relative w-14 h-14 flex items-center justify-center">
                          <svg className="w-14 h-14 -rotate-90">
                            <circle cx="28" cy="28" r="22" fill="none" stroke="#262626" strokeWidth="4" />
                            <circle
                              cx="28"
                              cy="28"
                              r="22"
                              fill="none"
                              stroke="#f43f5e"
                              strokeWidth="4"
                              strokeDasharray={2 * Math.PI * 22}
                              strokeDashoffset={2 * Math.PI * 22 * (1 - (blendEvaluation.mutuality.score || 0) / 100)}
                              strokeLinecap="round"
                            />
                          </svg>
                          <span className="absolute font-mono text-xs font-bold text-white">
                            {blendEvaluation.mutuality.score}%
                          </span>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-white">
                            Resonance Blend
                          </h4>
                          <span className="text-[11px] text-rose-400 font-medium font-mono">
                            {blendEvaluation.eligible ? 'Harmonic Match' : 'Boundary Excluded'}
                          </span>
                        </div>
                      </div>

                      {/* Dyad Pair Badge */}
                      <div className="text-right text-xs">
                        <span className="text-white font-medium block">You + {blendCandidate.identity.name.split(' ')[0]}</span>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          {blendCandidate.geography.cityName}
                        </span>
                      </div>
                    </div>

                    {/* Shared Frequencies Highlights */}
                    <div className="space-y-2 pt-2 border-t border-white/[0.06] text-xs">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                        Shared Life Frequencies
                      </span>
                      
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-neutral-300 flex items-center space-x-1.5">
                            <Sparkles className="w-3 h-3 text-rose-400" />
                            <span>Values Resonance</span>
                          </span>
                          <span className="text-white font-mono font-bold">96% Overlap</span>
                        </div>
                        <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-rose-500 h-full rounded-full" style={{ width: '96%' }} />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-neutral-300 flex items-center space-x-1.5">
                            <Activity className="w-3 h-3 text-cyan-400" />
                            <span>Lifestyle Cadence</span>
                          </span>
                          <span className="text-white font-mono font-bold">88% Overlap</span>
                        </div>
                        <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-cyan-500 h-full rounded-full" style={{ width: '88%' }} />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-neutral-300 flex items-center space-x-1.5">
                            <MessageSquare className="w-3 h-3 text-sky-400" />
                            <span>Communication Rhythm</span>
                          </span>
                          <span className="text-white font-mono font-bold">91% Overlap</span>
                        </div>
                        <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-sky-500 h-full rounded-full" style={{ width: '91%' }} />
                        </div>
                      </div>
                    </div>

                    {/* Celebratory Qualitative Story */}
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs space-y-1">
                      <span className="text-[10px] font-mono text-rose-400 font-bold block">
                        Why You Two Resonate:
                      </span>
                      <p className="text-[11px] text-neutral-200 font-light leading-relaxed">
                        You both share deep creative autonomy, slow coffee morning rituals, and a low negativity threshold. Neither tolerates lingering passive-aggression.
                      </p>
                    </div>

                    {/* Quick Cross-Tool Navigation */}
                    <div className="pt-2 flex items-center space-x-2">
                      {onNavigateToDialogue && (
                        <button
                          onClick={onNavigateToDialogue}
                          className="flex-1 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-[11px] flex items-center justify-center space-x-1.5 transition cursor-pointer"
                        >
                          <MessageSquare className="w-3 h-3 text-sky-400" />
                          <span>Open Dialogue</span>
                        </button>
                      )}
                      {onNavigateToDiscover && (
                        <button
                          onClick={onNavigateToDiscover}
                          className="flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium text-[11px] flex items-center justify-center space-x-1.5 transition cursor-pointer shadow-md shadow-rose-900/30"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Discovery Feed</span>
                        </button>
                      )}
                    </div>

                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: MY RELATIONAL SANCTUARY (AIRBNB HOUSE RULES)      */}
      {/* ======================================================== */}
      {activeTab === 'sanctuary' && (
        <div className="space-y-8">
          {/* Airbnb Sanctuary Editorial Banner */}
          <div className="bg-gradient-to-r from-emerald-950/40 via-neutral-900/60 to-cyan-950/40 border border-emerald-500/20 rounded-3xl p-6 sm:p-7 backdrop-blur-xl space-y-3">
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-mono font-semibold">
              <Home className="w-4 h-4" />
              <span>THE RELATIONAL SANCTUARY</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Clear, Dignified Boundaries. Zero Hostility.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 font-light max-w-3xl leading-relaxed">
              Clear personal standards for peace of mind. Nobody likes defensive dating bios or bitter demands. When welcoming someone into your world, you set calm, honest foundations: smoke-free living, aligned intentions, and mutual respect. Anyone crossing hard boundaries is filtered out with complete protection, so you never have to make painful compromises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* 1. Living Ecology & Substance Standards */}
            <div className="bg-neutral-900/70 border border-white/10 rounded-3xl p-6 space-y-5">
              <div className="flex items-center space-x-2.5 pb-2 border-b border-white/[0.06]">
                <Home className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white">Living Ecology & Substance Rules</h3>
              </div>

              {/* Smoking Rule */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-neutral-300 flex justify-between">
                  <span>Smoking Policy</span>
                  <span className="text-emerald-400 font-mono text-[11px]">
                    {profile.lifestyle.smoking === 'never' ? '🚭 Strictly Smoke-Free' : 'Social Allowed'}
                  </span>
                </label>
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

              {/* Diet Policy */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-neutral-300 flex justify-between">
                  <span>Dietary Architecture</span>
                  <span className="text-emerald-400 font-mono text-[11px] capitalize">
                    {profile.lifestyle.diet}
                  </span>
                </label>
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
                      className={`py-1.5 px-2 rounded-xl border transition cursor-pointer text-center capitalize text-[11px] ${
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

              {/* Alcohol Consumption */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-neutral-300 flex justify-between">
                  <span>Alcohol Standard</span>
                  <span className="text-emerald-400 font-mono text-[11px] capitalize">
                    {profile.lifestyle.alcohol}
                  </span>
                </label>
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
                      className={`py-1.5 px-2 rounded-xl border transition cursor-pointer text-center capitalize text-[11px] ${
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

            </div>

            {/* 2. Relational Terms & Commitments */}
            <div className="bg-neutral-900/70 border border-white/10 rounded-3xl p-6 space-y-5">
              <div className="flex items-center space-x-2.5 pb-2 border-b border-white/[0.06]">
                <Heart className="w-4 h-4 text-rose-400" />
                <h3 className="text-sm font-semibold text-white">Relational Architecture & Commitment</h3>
              </div>

              {/* Relationship Structure */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-neutral-300 flex justify-between">
                  <span>Relationship Structure</span>
                  <span className="text-rose-400 font-mono text-[11px] uppercase">
                    {profile.intention.relationshipStructure}
                  </span>
                </label>
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
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-semibold'
                          : 'bg-neutral-950 text-neutral-400 hover:text-white border-white/[0.06]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Family & Children Plans */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-neutral-300 flex justify-between">
                  <span>Family & Children Goals</span>
                  <span className="text-amber-400 font-mono text-[11px]">
                    {profile.family.wantsChildren.replace('_', ' ')}
                  </span>
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                  {(['definitely_yes', 'unsure', 'definitely_not'] as const).map((fc) => (
                    <button
                      key={fc}
                      onClick={() =>
                        setProfile({
                          ...profile,
                          family: { ...profile.family, wantsChildren: fc },
                        })
                      }
                      className={`py-2 px-2 rounded-xl border transition cursor-pointer text-center capitalize text-[11px] ${
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

              {/* Transit & Geographic Radius */}
              <div className="space-y-2.5 pt-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-neutral-300">Transit & Distance Radius</span>
                  <span className="text-cyan-400 font-mono font-bold text-xs">
                    {profile.geography.maxDistanceKm} km
                  </span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <button
                    type="button"
                    onClick={() =>
                      setProfile({
                        ...profile,
                        geography: {
                          ...profile.geography,
                          maxDistanceKm: Math.max(5, profile.geography.maxDistanceKm - 5),
                        },
                      })
                    }
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 text-white font-bold text-sm flex items-center justify-center shrink-0 cursor-pointer"
                    aria-label="Decrease distance radius"
                  >
                    -
                  </button>
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
                    className="flex-1 accent-cyan cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setProfile({
                        ...profile,
                        geography: {
                          ...profile.geography,
                          maxDistanceKm: Math.min(80, profile.geography.maxDistanceKm + 5),
                        },
                      })
                    }
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 text-white font-bold text-sm flex items-center justify-center shrink-0 cursor-pointer"
                    aria-label="Increase distance radius"
                  >
                    +
                  </button>
                </div>
                <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                  <span>5 km (Local Metro)</span>
                  <span>40 km (Greater London)</span>
                  <span>80 km (Commuter Rail)</span>
                </div>
              </div>

            </div>

            {/* 3. Communication & Guest Policies */}
            <div className="bg-neutral-900/70 border border-white/10 rounded-3xl p-6 space-y-5 md:col-span-2">
              <div className="flex items-center space-x-2.5 pb-2 border-b border-white/[0.06]">
                <MessageSquare className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-semibold text-white">Communication & Guest Ground Rules</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Digital Response Cadence */}
                <div className="p-4 rounded-2xl bg-neutral-950/70 border border-white/[0.08] space-y-2">
                  <span className="text-neutral-400 font-mono text-[11px] block">Digital Response Cadence</span>
                  <div className="space-y-1.5 font-sans">
                    {[
                      { id: 'end_of_day', label: '🌅 Thoughtful Evening Texter (Low work distraction)' },
                      { id: 'regular_intervals', label: '⚡ Regular Check-Ins Throughout Day' },
                      { id: 'minimal_in_person', label: '☕ Minimal Texting (Prefer Meeting In Person)' },
                    ].map((cad) => (
                      <button
                        key={cad.id}
                        onClick={() =>
                          setProfile({
                            ...profile,
                            communication: {
                              ...profile.communication,
                              digitalCadence: cad.id as any,
                            },
                          })
                        }
                        className={`w-full text-left p-2 rounded-xl text-[11px] transition cursor-pointer ${
                          profile.communication.digitalCadence === cad.id
                            ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-medium'
                            : 'bg-neutral-900 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {cad.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Conflict Resolution Protocol */}
                <div className="p-4 rounded-2xl bg-neutral-950/70 border border-white/[0.08] space-y-2">
                  <span className="text-neutral-400 font-mono text-[11px] block">Conflict & Repair Protocol</span>
                  <div className="space-y-1.5 font-sans">
                    {[
                      { id: 'reflective_deliberate', label: '🕊️ Reflective & Deliberate (Give me 1 hr space)' },
                      { id: 'direct_immediate', label: '⚡ Direct & Immediate (Resolve before bedtime)' },
                      { id: 'space_first', label: '🧘 Space First (Sleep on it, talk next morning)' },
                    ].map((cStyle) => (
                      <button
                        key={cStyle.id}
                        onClick={() =>
                          setProfile({
                            ...profile,
                            communication: {
                              ...profile.communication,
                              conflictStyle: cStyle.id as any,
                            },
                          })
                        }
                        className={`w-full text-left p-2 rounded-xl text-[11px] transition cursor-pointer ${
                          profile.communication.conflictStyle === cStyle.id
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-medium'
                            : 'bg-neutral-900 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {cStyle.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* First Encounter Format */}
                <div className="p-4 rounded-2xl bg-neutral-950/70 border border-white/[0.08] space-y-2">
                  <span className="text-neutral-400 font-mono text-[11px] block">First Encounter Blueprint</span>
                  <div className="space-y-1.5 font-sans">
                    {[
                      { id: 'direct_coffee', label: '☕ Low-Stakes Casual Coffee / Walk' },
                      { id: 'video_call_first', label: '📹 15-Minute Video Vibe Check First' },
                      { id: 'thoughtful_messaging_first', label: '✍️ Extended Thoughtful Texting First' },
                    ].map((fmt) => (
                      <button
                        key={fmt.id}
                        onClick={() =>
                          setProfile({
                            ...profile,
                            availability: {
                              ...profile.availability,
                              preferredMeetingFormat: fmt.id as any,
                            },
                          })
                        }
                        className={`w-full text-left p-2 rounded-xl text-[11px] transition cursor-pointer ${
                          profile.availability.preferredMeetingFormat === fmt.id
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-medium'
                            : 'bg-neutral-900 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {fmt.label}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: PRIVACY & INVARIANTS                              */}
      {/* ======================================================== */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="bg-neutral-900/80 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center space-x-2 text-sky-400 text-xs font-mono font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>CRYPTOGRAPHIC PRIVACY & SYSTEM INVARIANTS</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Privacy That Isn’t a Marketing Slogan.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 font-light max-w-2xl leading-relaxed">
              Check enforces mathematical guarantees: sensitive health & accessibility data is sealed with AES-256-GCM Field-Level Encryption, and matching scores are immune to financial bidding.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono pt-2">
              {/* Invariant D-23 Proof Card */}
              <div className="p-5 rounded-2xl bg-neutral-950/80 border border-white/[0.08] space-y-2">
                <span className="text-emerald-400 font-bold block flex items-center space-x-1.5">
                  <Check className="w-4 h-4" />
                  <span>Invariant D-23: Zero Pay-to-Win</span>
                </span>
                <p className="text-neutral-400 font-sans text-xs">
                  Your rank and visibility in the network graph are strictly determined by mutual compatibility $M_&#123;ij&#125;$. Zero boosts. Zero paywalled exposure.
                </p>
                <span className="inline-block px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-300 text-[10px] border border-emerald-500/20">
                  Verification Audit: 0.000% Pay Leakage
                </span>
              </div>

              {/* AES-256 FLE Card */}
              <div className="p-5 rounded-2xl bg-neutral-950/80 border border-white/[0.08] space-y-2">
                <span className="text-sky-400 font-bold block flex items-center space-x-1.5">
                  <Lock className="w-4 h-4" />
                  <span>Tier 4: Field-Level Encryption</span>
                </span>
                <p className="text-neutral-400 font-sans text-xs">
                  Accessibility needs, sensory thresholds, and medical accommodations are encrypted at the application layer with distinct Key IDs.
                </p>
                <span className="inline-block px-2.5 py-1 rounded bg-sky-500/10 text-sky-300 text-[10px] border border-sky-500/20">
                  Cipher: AES-256-GCM / dek_2026_primary
                </span>
              </div>
            </div>

            {/* Quick Privacy Toggles */}
            <div className="p-5 rounded-2xl bg-neutral-950/80 border border-white/[0.08] space-y-4">
              <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                Discovery Privacy Controls
              </h4>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-white text-xs font-semibold block">Incognito Discovery Mode</span>
                  <span className="text-neutral-400 text-[11px] font-light">
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
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    profile.privacy.incognitoMode ? 'bg-sky-500' : 'bg-neutral-800'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                      profile.privacy.incognitoMode ? 'left-7' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                <div>
                  <span className="text-white text-xs font-semibold block">Location Blur Radius</span>
                  <span className="text-neutral-400 text-[11px] font-light">
                    Randomizes your exact coordinates by {profile.privacy.fuzzLocationRadiusKm} km to prevent geolocation triangulation.
                  </span>
                </div>
                <span className="font-mono text-xs text-sky-400 font-bold">
                  ±{profile.privacy.fuzzLocationRadiusKm} km
                </span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: 5-STEP GUIDED ONBOARDING JOURNEY (MODAL/WIZARD)   */}
      {/* ======================================================== */}
      {activeTab === 'onboarding' && (
        <div className="bg-neutral-900/90 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-6">
          {/* Wizard Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-rose-400 font-semibold block">
                Sanctuary & Blend Guided Calibration
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Step {wizardStep} of 5: {
                  wizardStep === 1
                    ? 'The Identity Anchor'
                    : wizardStep === 2
                    ? 'My Relational Sanctuary (House Rules)'
                    : wizardStep === 3
                    ? 'My Taste & Resonance Spectrum (Blend)'
                    : wizardStep === 4
                    ? 'Guest & Communication Ground Rules'
                    : 'Your Live Sanctuary & Blend Unlocked'
                }
              </h2>
            </div>

            <button
              onClick={() => setActiveTab('blend')}
              className="px-3 py-1.5 rounded-full text-xs font-mono bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white cursor-pointer"
            >
              Exit to Hub
            </button>
          </div>

          {/* Step 1: Identity Anchor */}
          {wizardStep === 1 && (
            <div className="space-y-4 max-w-xl">
              <p className="text-xs text-neutral-300 font-light">
                Let's anchor your profile in the network. Zero long essays. Just who you are.
              </p>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-neutral-400 font-mono block mb-1">Display Name</label>
                  <input
                    type="text"
                    value={profile.identity.name}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        identity: { ...profile.identity, name: e.target.value },
                      })
                    }
                    className="w-full bg-neutral-950 border border-white/20 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="text-neutral-400 font-mono block mb-1">One-Liner Bio</label>
                  <input
                    type="text"
                    value={profile.identity.bio}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        identity: { ...profile.identity, bio: e.target.value },
                      })
                    }
                    className="w-full bg-neutral-950 border border-white/20 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-neutral-400 font-mono block mb-1">Age</label>
                    <input
                      type="number"
                      value={profile.identity.age}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          identity: { ...profile.identity, age: Number(e.target.value) },
                        })
                      }
                      className="w-full bg-neutral-950 border border-white/20 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-400 font-mono block mb-1">City</label>
                    <input
                      type="text"
                      value={profile.geography.cityName}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          geography: { ...profile.geography, cityName: e.target.value },
                        })
                      }
                      className="w-full bg-neutral-950 border border-white/20 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Sanctuary House Rules */}
          {wizardStep === 2 && (
            <div className="space-y-4 max-w-xl">
              <p className="text-xs text-neutral-300 font-light">
                Airbnb House Rules: Calm, clear non-negotiables. What does a healthy relationship space require?
              </p>
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-neutral-950 border border-white/10 flex justify-between items-center">
                  <span>🚭 Strictly Smoke-Free Living</span>
                  <button
                    onClick={() =>
                      setProfile({
                        ...profile,
                        lifestyle: {
                          ...profile.lifestyle,
                          smoking: profile.lifestyle.smoking === 'never' ? 'socially' : 'never',
                        },
                      })
                    }
                    className={`px-3 py-1 rounded-full text-xs font-mono font-medium ${
                      profile.lifestyle.smoking === 'never' ? 'bg-emerald-500 text-white' : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {profile.lifestyle.smoking === 'never' ? 'Non-Negotiable' : 'Flexible'}
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-neutral-950 border border-white/10 flex justify-between items-center">
                  <span>💍 Monogamous Commitment Vision</span>
                  <button
                    onClick={() =>
                      setProfile({
                        ...profile,
                        intention: {
                          ...profile.intention,
                          relationshipStructure:
                            profile.intention.relationshipStructure === 'monogamous' ? 'flexible' : 'monogamous',
                        },
                      })
                    }
                    className={`px-3 py-1 rounded-full text-xs font-mono font-medium ${
                      profile.intention.relationshipStructure === 'monogamous'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {profile.intention.relationshipStructure === 'monogamous' ? 'Required' : 'Flexible'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Spotify Blend Taste Spectrum */}
          {wizardStep === 3 && (
            <div className="space-y-4 max-w-xl">
              <p className="text-xs text-neutral-300 font-light">
                Spotify Blend: What frequencies define your life? Tap the ones that anchor your day.
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                {['Autonomy & Growth', 'Ethical Integrity', 'Creative Expression', 'Curiosity & Wonder', 'Radical Candor', 'Quiet Contemplation'].map((v) => (
                  <button
                    key={v}
                    onClick={() => {
                      const updated = profile.values.coreValues.includes(v)
                        ? profile.values.coreValues.filter((x) => x !== v)
                        : [...profile.values.coreValues, v]
                      setProfile({ ...profile, values: { ...profile.values, coreValues: updated } })
                    }}
                    className={`px-3 py-1.5 rounded-full ${
                      profile.values.coreValues.includes(v)
                        ? 'bg-rose-500 text-white font-medium'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Communication Policy */}
          {wizardStep === 4 && (
            <div className="space-y-4 max-w-xl text-xs">
              <p className="text-neutral-300 font-light">
                How should someone communicate when interacting with your world?
              </p>
              <div className="space-y-2">
                <span className="text-neutral-400 font-mono block">Texting Cadence</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() =>
                      setProfile({
                        ...profile,
                        communication: { ...profile.communication, digitalCadence: 'end_of_day' },
                      })
                    }
                    className={`p-2 rounded-xl text-left ${
                      profile.communication.digitalCadence === 'end_of_day'
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                        : 'bg-neutral-950 text-neutral-400'
                    }`}
                  >
                    🌅 Evening Texter (Low phone distraction)
                  </button>
                  <button
                    onClick={() =>
                      setProfile({
                        ...profile,
                        communication: { ...profile.communication, digitalCadence: 'regular_intervals' },
                      })
                    }
                    className={`p-2 rounded-xl text-left ${
                      profile.communication.digitalCadence === 'regular_intervals'
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                        : 'bg-neutral-950 text-neutral-400'
                    }`}
                  >
                    ⚡ Regular Check-Ins
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Live Blend Reveal */}
          {wizardStep === 5 && (
            <div className="space-y-5 max-w-xl text-center py-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-500 to-emerald-500 flex items-center justify-center mx-auto shadow-xl">
                <Sparkles className="w-8 h-8 text-white" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white">Your Sanctuary & Blend Are Live</h3>
                <p className="text-xs text-neutral-400">
                  Calibrated across 12 psychological and mathematical facets. Your boundaries are protected.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-950 border border-white/10 text-xs font-mono inline-block">
                <span className="text-emerald-400 font-bold">{eligibleCandidatesCount} Mutually Compatible Candidates</span>
                <span className="text-neutral-400 block text-[11px] mt-0.5">
                  Top Blend: 99% with Maya Lin (London)
                </span>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
            <button
              disabled={wizardStep === 1}
              onClick={() => setWizardStep((s) => Math.max(1, s - 1))}
              className="px-4 py-2 rounded-full text-xs font-mono bg-neutral-800 text-neutral-300 disabled:opacity-30 cursor-pointer"
            >
              Back
            </button>

            {wizardStep < 5 ? (
              <button
                onClick={() => setWizardStep((s) => Math.min(5, s + 1))}
                className="px-5 py-2 rounded-full text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white flex items-center space-x-1.5 cursor-pointer shadow-lg shadow-rose-900/30"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => {
                  handleSaveAll()
                  setActiveTab('blend')
                }}
                className="px-5 py-2 rounded-full text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center space-x-1.5 cursor-pointer shadow-lg shadow-emerald-900/30"
              >
                <span>Enter Sanctuary & Blend</span>
                <Check className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  )
}
