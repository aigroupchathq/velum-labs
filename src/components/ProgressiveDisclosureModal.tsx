// ============================================================================
// src/components/ProgressiveDisclosureModal.tsx
// Wingman: Smooth & Editorial Compatibility Guided Journey
// Ultra-smooth step-by-step conversational journey — zero robotic jargon
// ============================================================================

import React, { useState, useEffect } from 'react'
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  User,
  Heart,
  ShieldAlert,
  Sparkles,
  Save,
  MessageCircle,
  Zap,
  Target,
  Flame,
  RotateCcw,
} from 'lucide-react'
import type { UniversalUserProfile } from '../types'
import { evaluateMatch } from '../utils/matchingEngine'
import { mockCandidates } from '../data/mockProfiles'

interface ProgressiveDisclosureProps {
  currentUser: UniversalUserProfile
  onUpdateUser: (updatedUser: UniversalUserProfile) => void
}

export const ProgressiveDisclosureModal: React.FC<ProgressiveDisclosureProps> = ({
  currentUser,
  onUpdateUser,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [userState, setUserState] = useState<UniversalUserProfile>(currentUser)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [selectedQuickPreset, setSelectedQuickPreset] = useState<string | null>(null)

  const isSenior = userState.identity.age >= 60
  const isYoung = userState.identity.age <= 25

  // Tone calibration with warm editorial aesthetics
  const persona = isSenior
    ? {
        role: 'Distinguished Wingman',
        accentColor: '#e2c290',
        glowColor: 'rgba(226,194,144,0.35)',
        badge: '◈ Refined Counsel',
      }
    : isYoung
    ? {
        role: 'Real-Talk Wingman',
        accentColor: '#34d399',
        glowColor: 'rgba(52,211,153,0.35)',
        badge: '◈ Direct & Grounded',
      }
    : {
        role: 'Strategic Wingman',
        accentColor: '#a78bfa',
        glowColor: 'rgba(167,139,250,0.35)',
        badge: '◈ Strategic High-EQ',
      }

  // Calculate live candidate match pool
  const computeLiveStats = (u: UniversalUserProfile) => {
    const candidates = mockCandidates.filter((c) => c.id !== u.id)
    const evaluated = candidates.map((c) => evaluateMatch(u, c))
    const eligible = evaluated.filter((e) => e.eligible)
    const maxScore = eligible.length > 0 ? Math.max(...eligible.map((e) => e.mutuality.score || 0)) : 0
    return { eligibleCount: eligible.length, totalCount: candidates.length, maxScore }
  }

  const liveStats = computeLiveStats(userState)

  const handleSave = () => {
    onUpdateUser(userState)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 2500)
  }

  // 5 Warm Conversational Steps
  const steps = [
    {
      number: 1,
      shortLabel: 'Who to Vibe With',
      title: 'So, who do you feel to meet or vibe with?',
      subtext: 'Set your horizon — age preference, cultural background, and energy.',
      icon: Target,
    },
    {
      number: 2,
      shortLabel: 'Non-Negotiables',
      title: 'What gives you the immediate ick or breaks the vibe?',
      subtext: 'Wingman filters out any matches that cross these lines.',
      icon: ShieldAlert,
    },
    {
      number: 3,
      shortLabel: 'You Never Know',
      title: 'You never know — what wildcards or flexibility are you open to?',
      subtext: 'Open up possibilities for unexpected connections.',
      icon: Sparkles,
    },
    {
      number: 4,
      shortLabel: 'Partnership Rhythm',
      title: 'What kind of relationship architecture are you building?',
      subtext: 'Define your relationship goals, structure, and communication flow.',
      icon: Heart,
    },
    {
      number: 5,
      shortLabel: 'Your Authentic Self',
      title: 'Lastly, how should your partner see you?',
      subtext: 'Your display name, public bio, and personal lifestyle identity.',
      icon: User,
    },
  ]

  // Typing animation for current step question
  const currentStepInfo = steps[currentStep - 1]
  const [prevStep, setPrevStep] = useState(currentStep)
  const [visibleChars, setVisibleChars] = useState(0)

  if (prevStep !== currentStep) {
    setPrevStep(currentStep)
    setVisibleChars(0)
  }

  useEffect(() => {
    const len = currentStepInfo.title.length
    let i = 0
    const interval = setInterval(() => {
      i++
      setVisibleChars(i)
      if (i >= len) clearInterval(interval)
    }, 14)
    return () => clearInterval(interval)
  }, [currentStep, currentStepInfo.title])

  const progressPercent = Math.round((currentStep / steps.length) * 100)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ── Header Card ── */}
      <div
        className="rounded-[2.5rem] p-6 sm:p-8 space-y-6 relative overflow-hidden transition-all duration-500 golden-aura"
        style={{
          background: 'rgba(14,14,18,0.92)',
          backdropFilter: 'blur(36px)',
          border: `1px solid ${persona.accentColor}30`,
          boxShadow: `0 24px 60px -20px rgba(0,0,0,0.85), 0 0 80px -40px ${persona.glowColor}`,
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.07] relative z-10">
          <div className="flex items-start space-x-4">
            <div
              className="w-13 h-13 rounded-2xl flex items-center justify-center shrink-0 font-bold text-2xl font-serif-editorial"
              style={{
                background: `radial-gradient(circle at 30% 30%, ${persona.accentColor}30, ${persona.accentColor}08)`,
                border: `1.5px solid ${persona.accentColor}50`,
                color: persona.accentColor,
                boxShadow: `0 0 24px ${persona.glowColor}`,
              }}
            >
              W
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">
                  Wingman Guided Journey
                </span>
                <span
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                  style={{
                    background: `${persona.accentColor}18`,
                    border: `1px solid ${persona.accentColor}40`,
                    color: persona.accentColor,
                  }}
                >
                  {persona.badge}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-serif-editorial mt-1">
                Designing Your Compatibility Chapter
              </h1>
              <p className="text-xs text-neutral-400 font-light mt-0.5">
                Wingman asks one step at a time — so you can discover who actually clicks with your life.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Live Matches Beacon */}
            <div
              className="px-3.5 py-2 rounded-2xl flex items-center space-x-2 text-xs font-mono"
              style={{
                background: 'rgba(52,211,153,0.08)',
                border: '1px solid rgba(52,211,153,0.25)',
                color: '#6ee7b7',
              }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span>
                {liveStats.eligibleCount} Matches ({liveStats.maxScore}% Top Fit)
              </span>
            </div>

            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-2xl text-xs font-bold text-black transition-all duration-200 hover:opacity-90 active:scale-95 shadow-md flex items-center space-x-1.5 shrink-0"
              style={{
                background: saveSuccess ? '#34d399' : '#ffffff',
                boxShadow: '0 4px 20px rgba(255,255,255,0.15)',
              }}
            >
              <Save className="w-3.5 h-3.5 stroke-[2]" />
              <span>{saveSuccess ? 'Saved to Engine!' : 'Save Preferences'}</span>
            </button>
          </div>
        </div>

        {/* ── Fluid Progress Bar ── */}
        <div className="space-y-2 relative z-10">
          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
            <span>Progress · Step {currentStep} of {steps.length}</span>
            <span style={{ color: persona.accentColor }}>{progressPercent}% Complete</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${progressPercent}%`,
                background: `linear-gradient(90deg, ${persona.accentColor}88, ${persona.accentColor})`,
                boxShadow: `0 0 12px ${persona.glowColor}`,
              }}
            />
          </div>
        </div>

        {/* ── Smooth Step Pill Navigation ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 relative z-10">
          {steps.map((st) => {
            const Icon = st.icon
            const isActive = currentStep === st.number
            const isCompleted = currentStep > st.number

            return (
              <button
                key={st.number}
                onClick={() => setCurrentStep(st.number)}
                className="p-3 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden group"
                style={{
                  background: isActive
                    ? `${persona.accentColor}18`
                    : isCompleted
                    ? 'rgba(255,255,255,0.03)'
                    : 'rgba(255,255,255,0.015)',
                  borderColor: isActive
                    ? `${persona.accentColor}55`
                    : isCompleted
                    ? 'rgba(255,255,255,0.1)'
                    : 'rgba(255,255,255,0.05)',
                  boxShadow: isActive ? `0 0 20px ${persona.glowColor}` : 'none',
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-1">
                    <Icon
                      className="w-3 h-3"
                      style={{ color: isActive ? persona.accentColor : '#a1a1aa' }}
                    />
                    <span
                      className="text-[9px] font-mono font-bold uppercase tracking-wider"
                      style={{ color: isActive ? persona.accentColor : '#71717a' }}
                    >
                      STEP {st.number}
                    </span>
                  </div>
                  {isCompleted && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                </div>
                <div
                  className="text-xs font-semibold truncate"
                  style={{ color: isActive ? '#ffffff' : isCompleted ? '#d4d4d8' : '#71717a' }}
                >
                  {st.shortLabel}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Active Step Container with Slide Animation ── */}
      <div
        key={currentStep}
        className="rounded-[2.5rem] p-6 sm:p-8 space-y-7 relative overflow-hidden transition-all duration-500 step-slide-in"
        style={{
          background: 'rgba(14,14,18,0.92)',
          backdropFilter: 'blur(36px)',
          border: `1px solid ${persona.accentColor}20`,
          boxShadow: '0 20px 60px -20px rgba(0,0,0,0.85)',
        }}
      >
        {/* Wingman Voice Bubble */}
        <div
          className="p-5 rounded-2xl flex items-start space-x-3.5"
          style={{
            background: `linear-gradient(135deg, ${persona.accentColor}0e, rgba(255,255,255,0.02))`,
            border: `1px solid ${persona.accentColor}28`,
          }}
        >
          <MessageCircle className="w-5 h-5 mt-0.5 shrink-0" style={{ color: persona.accentColor }} />
          <div className="space-y-1">
            <span
              className="text-[10px] uppercase font-bold tracking-widest"
              style={{ color: persona.accentColor }}
            >
              {persona.role} · Question {currentStep} of {steps.length}
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-white font-serif-editorial tracking-tight leading-snug">
              &ldquo;{currentStepInfo.title.slice(0, visibleChars)}
              {visibleChars < currentStepInfo.title.length && (
                <span
                  className="inline-block w-0.5 h-4 ml-0.5 rounded-full animate-pulse align-middle"
                  style={{ backgroundColor: persona.accentColor }}
                />
              )}
              &rdquo;
            </h2>
            <p className="text-xs text-neutral-400 font-light">{currentStepInfo.subtext}</p>
          </div>
        </div>

        {/* ── STEP 1: WHO TO VIBE WITH ── */}
        {currentStep === 1 && (
          <div className="space-y-6">
            {/* Quick Match Persona Tiles */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-300 block">
                Popular Scenario Presets (Click to auto-configure)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: 'arthur_chloe',
                    title: 'Arthur & Chloe (66 → 20)',
                    desc: 'Senior gentleman seeking young Caucasian creative partner (20–35).',
                    apply: () => ({
                      ...userState,
                      preferences: {
                        ...userState.preferences,
                        minAge: 20,
                        maxAge: 35,
                        ethnicitiesSought: ['Caucasian / White'],
                      },
                    }),
                  },
                  {
                    id: 'contemporary',
                    title: 'Contemporary Peers (27 → 36)',
                    desc: 'Symmetrical life course, shared aesthetic and intellectual pace.',
                    apply: () => ({
                      ...userState,
                      preferences: {
                        ...userState.preferences,
                        minAge: 27,
                        maxAge: 36,
                        ethnicitiesSought: [],
                      },
                    }),
                  },
                  {
                    id: 'distinguished',
                    title: 'Distinguished Chapter (50 → 75)',
                    desc: 'Mature life partners seeking grounded wisdom and quiet elegance.',
                    apply: () => ({
                      ...userState,
                      preferences: {
                        ...userState.preferences,
                        minAge: 50,
                        maxAge: 75,
                        ethnicitiesSought: [],
                      },
                    }),
                  },
                  {
                    id: 'unbounded',
                    title: 'Unbounded — You Never Know (18 → 80)',
                    desc: 'Unbounded discovery — let true chemistry decide.',
                    apply: () => ({
                      ...userState,
                      preferences: {
                        ...userState.preferences,
                        minAge: 18,
                        maxAge: 80,
                        ethnicitiesSought: [],
                      },
                    }),
                  },
                ].map((preset) => {
                  const isActive = selectedQuickPreset === preset.id
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        setSelectedQuickPreset(preset.id)
                        setUserState(preset.apply())
                      }}
                      className="p-4 rounded-2xl border text-left transition-all duration-300 space-y-1 relative overflow-hidden group"
                      style={{
                        background: isActive ? `${persona.accentColor}15` : 'rgba(255,255,255,0.02)',
                        borderColor: isActive ? `${persona.accentColor}55` : 'rgba(255,255,255,0.07)',
                        boxShadow: isActive ? `0 0 20px ${persona.glowColor}` : 'none',
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className="text-xs font-bold"
                          style={{ color: isActive ? persona.accentColor : '#ffffff' }}
                        >
                          {preset.title}
                        </span>
                        {isActive && <Zap className="w-3.5 h-3.5" style={{ color: persona.accentColor }} />}
                      </div>
                      <p className="text-[11px] text-neutral-400 font-light leading-relaxed">
                        {preset.desc}
                      </p>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Age Horizon Range Sliders */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-neutral-300">Target Age Horizon</span>
                <span
                  className="font-bold font-mono text-sm"
                  style={{ color: persona.accentColor }}
                >
                  {userState.preferences.minAge} – {userState.preferences.maxAge} years old
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] text-neutral-400">
                    <span>Minimum Age</span>
                    <span className="font-mono">{userState.preferences.minAge}</span>
                  </div>
                  <input
                    type="range"
                    min="18"
                    max="80"
                    value={userState.preferences.minAge}
                    onChange={(e) => {
                      const val = Math.min(+e.target.value, userState.preferences.maxAge - 1)
                      setUserState({
                        ...userState,
                        preferences: { ...userState.preferences, minAge: val },
                      })
                      setSelectedQuickPreset(null)
                    }}
                    className="cinematic-slider w-full"
                    style={{
                      background: `linear-gradient(90deg, ${persona.accentColor} ${
                        ((userState.preferences.minAge - 18) / 62) * 100
                      }%, rgba(255,255,255,0.1) 0%)`,
                    }}
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] text-neutral-400">
                    <span>Maximum Age</span>
                    <span className="font-mono">{userState.preferences.maxAge}</span>
                  </div>
                  <input
                    type="range"
                    min="18"
                    max="80"
                    value={userState.preferences.maxAge}
                    onChange={(e) => {
                      const val = Math.max(+e.target.value, userState.preferences.minAge + 1)
                      setUserState({
                        ...userState,
                        preferences: { ...userState.preferences, maxAge: val },
                      })
                      setSelectedQuickPreset(null)
                    }}
                    className="cinematic-slider w-full"
                    style={{
                      background: `linear-gradient(90deg, ${persona.accentColor} ${
                        ((userState.preferences.maxAge - 18) / 62) * 100
                      }%, rgba(255,255,255,0.1) 0%)`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Cultural Background Selector */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
              <span className="text-xs font-bold text-neutral-300 block">
                Cultural & Ethnic Background Preference
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'All Backgrounds', value: [] },
                  { label: 'Caucasian / White', value: ['Caucasian / White'] },
                  { label: 'Black / African Descent', value: ['Black / African Descent'] },
                  { label: 'East Asian', value: ['East Asian'] },
                  { label: 'South Asian', value: ['South Asian'] },
                  { label: 'Hispanic / Latino', value: ['Hispanic / Latino'] },
                ].map((eth) => {
                  const currentList = userState.preferences.ethnicitiesSought || []
                  const isSelected =
                    eth.value.length === 0
                      ? currentList.length === 0
                      : currentList.includes(eth.value[0])

                  return (
                    <button
                      key={eth.label}
                      type="button"
                      onClick={() => {
                        setUserState({
                          ...userState,
                          preferences: {
                            ...userState.preferences,
                            ethnicitiesSought: eth.value,
                          },
                        })
                        setSelectedQuickPreset(null)
                      }}
                      className="px-3.5 py-2 rounded-2xl text-xs font-semibold border transition-all duration-200"
                      style={{
                        background: isSelected ? `${persona.accentColor}20` : 'rgba(255,255,255,0.03)',
                        borderColor: isSelected ? `${persona.accentColor}60` : 'rgba(255,255,255,0.08)',
                        color: isSelected ? persona.accentColor : '#d4d4d8',
                        boxShadow: isSelected ? `0 0 12px ${persona.glowColor}` : 'none',
                      }}
                    >
                      {eth.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2: NON-NEGOTIABLES ── */}
        {currentStep === 2 && (
          <div className="space-y-5">
            <div className="text-xs text-neutral-400 font-light">
              Non-negotiable boundaries. If a partner crosses any of these lines, Wingman automatically filters them out.
            </div>

            <div className="space-y-3">
              {/* Smoking Policy Toggle */}
              <label
                className="flex items-start space-x-3.5 p-5 rounded-2xl border cursor-pointer transition-all duration-300"
                style={{
                  background: userState.preferences.smokingPreference.dealbreaker
                    ? 'rgba(248,113,113,0.08)'
                    : 'rgba(255,255,255,0.02)',
                  borderColor: userState.preferences.smokingPreference.dealbreaker
                    ? 'rgba(248,113,113,0.35)'
                    : 'rgba(255,255,255,0.06)',
                }}
              >
                <input
                  type="checkbox"
                  checked={userState.preferences.smokingPreference.dealbreaker}
                  onChange={(e) =>
                    setUserState({
                      ...userState,
                      preferences: {
                        ...userState.preferences,
                        smokingPreference: {
                          ...userState.preferences.smokingPreference,
                          dealbreaker: e.target.checked,
                          allowedSmoking: e.target.checked ? ['never'] : ['never', 'socially'],
                          requirementLevel: e.target.checked ? 'MUST' : 'PREFERENCE',
                        },
                      },
                    })
                  }
                  className="w-4 h-4 mt-1 accent-rose-500 rounded"
                />
                <div className="space-y-1">
                  <span className="text-sm font-bold text-white block">
                    Strict Non-Smoker Policy (Hard Filter)
                  </span>
                  <p className="text-xs text-neutral-400 font-light leading-relaxed">
                    Filter out anyone who smokes or vapes socially or regularly.
                  </p>
                </div>
              </label>

              {/* Relationship Structure Alignment Toggle */}
              <label
                className="flex items-start space-x-3.5 p-5 rounded-2xl border cursor-pointer transition-all duration-300"
                style={{
                  background: userState.preferences.structurePreference.dealbreaker
                    ? 'rgba(248,113,113,0.08)'
                    : 'rgba(255,255,255,0.02)',
                  borderColor: userState.preferences.structurePreference.dealbreaker
                    ? 'rgba(248,113,113,0.35)'
                    : 'rgba(255,255,255,0.06)',
                }}
              >
                <input
                  type="checkbox"
                  checked={userState.preferences.structurePreference.dealbreaker}
                  onChange={(e) =>
                    setUserState({
                      ...userState,
                      preferences: {
                        ...userState.preferences,
                        structurePreference: {
                          ...userState.preferences.structurePreference,
                          dealbreaker: e.target.checked,
                          requirementLevel: e.target.checked ? 'MUST' : 'PREFERENCE',
                        },
                      },
                    })
                  }
                  className="w-4 h-4 mt-1 accent-rose-500 rounded"
                />
                <div className="space-y-1">
                  <span className="text-sm font-bold text-white block">
                    Strict Relationship Structure Alignment
                  </span>
                  <p className="text-xs text-neutral-400 font-light leading-relaxed">
                    Filter out partners with differing relationship frameworks (e.g. polyamory vs monogamy).
                  </p>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* ── STEP 3: YOU NEVER KNOW (FLEXIBILITY) ── */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-neutral-300">
                  Age Horizon Flexibility Buffer
                </span>
                <span className="font-bold font-mono text-sm" style={{ color: persona.accentColor }}>
                  ±{userState.preferences.ageFlexibilityYears} years
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                value={userState.preferences.ageFlexibilityYears}
                onChange={(e) =>
                  setUserState({
                    ...userState,
                    preferences: {
                      ...userState.preferences,
                      ageFlexibilityYears: parseInt(e.target.value),
                    },
                  })
                }
                className="cinematic-slider w-full"
                style={{
                  background: `linear-gradient(90deg, ${persona.accentColor} ${
                    (userState.preferences.ageFlexibilityYears / 5) * 100
                  }%, rgba(255,255,255,0.1) 0%)`,
                }}
              />
              <p className="text-[11px] text-neutral-400 font-light">
                Gives partial credit to candidates who fall just slightly outside your target age window instead of rejecting them.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-neutral-300">
                  Dietary Compromise Tolerance
                </span>
                <span className="font-bold font-mono text-sm" style={{ color: persona.accentColor }}>
                  {userState.preferences.dietPreference.flexibility}% Compromise
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={userState.preferences.dietPreference.flexibility}
                onChange={(e) =>
                  setUserState({
                    ...userState,
                    preferences: {
                      ...userState.preferences,
                      dietPreference: {
                        ...userState.preferences.dietPreference,
                        flexibility: parseInt(e.target.value),
                      },
                    },
                  })
                }
                className="cinematic-slider w-full"
                style={{
                  background: `linear-gradient(90deg, ${persona.accentColor} ${userState.preferences.dietPreference.flexibility}%, rgba(255,255,255,0.1) 0%)`,
                }}
              />
              <div
                className="p-4 rounded-xl text-xs space-y-1"
                style={{
                  background: `${persona.accentColor}08`,
                  border: `1px solid ${persona.accentColor}20`,
                }}
              >
                <span
                  className="text-[10px] uppercase font-bold tracking-wider block"
                  style={{ color: persona.accentColor }}
                >
                  Your Personal Preference Manifesto
                </span>
                <p className="text-neutral-300 italic leading-relaxed">
                  &ldquo;I eat <strong className="text-white">{userState.lifestyle.diet}</strong>, I prefer <strong className="text-white">{userState.preferences.dietPreference.preferredDiets.join(', ') || 'open'}</strong> partners, and I am open to sharing space with <strong style={{ color: persona.accentColor }}>{userState.preferences.dietPreference.flexibility}%</strong> tolerance.&rdquo;
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 4: PARTNERSHIP RHYTHM ── */}
        {currentStep === 4 && (
          <div className="space-y-6">
            {/* Primary Intent */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-neutral-300 block">
                Primary Relationship Goal
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  'Long-Term Partnership / Marriage',
                  'Long-Term Exploratory',
                  'Short-Term Dating',
                  'Casual Companionship',
                  'Intentional Discovery',
                ].map((intent) => {
                  const isSelected = userState.intention.primaryIntent === intent
                  return (
                    <button
                      key={intent}
                      type="button"
                      onClick={() =>
                        setUserState({
                          ...userState,
                          intention: { ...userState.intention, primaryIntent: intent },
                        })
                      }
                      className="p-3.5 rounded-xl border text-left text-xs font-semibold transition-all duration-200"
                      style={{
                        background: isSelected ? `${persona.accentColor}20` : 'rgba(255,255,255,0.025)',
                        borderColor: isSelected ? `${persona.accentColor}60` : 'rgba(255,255,255,0.07)',
                        color: isSelected ? persona.accentColor : '#d4d4d8',
                        boxShadow: isSelected ? `0 0 12px ${persona.glowColor}` : 'none',
                      }}
                    >
                      {intent}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Relationship Structure */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-neutral-300 block">
                Relationship Structure
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {(['monogamous', 'polyamorous', 'enm', 'flexible'] as const).map((struct) => {
                  const isSelected = userState.intention.relationshipStructure === struct
                  return (
                    <button
                      key={struct}
                      type="button"
                      onClick={() =>
                        setUserState({
                          ...userState,
                          intention: { ...userState.intention, relationshipStructure: struct },
                        })
                      }
                      className="p-3 rounded-xl border text-center text-xs font-semibold capitalize transition-all duration-200"
                      style={{
                        background: isSelected ? `${persona.accentColor}20` : 'rgba(255,255,255,0.025)',
                        borderColor: isSelected ? `${persona.accentColor}60` : 'rgba(255,255,255,0.07)',
                        color: isSelected ? persona.accentColor : '#d4d4d8',
                      }}
                    >
                      {struct}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 5: AUTHENTIC IDENTITY ── */}
        {currentStep === 5 && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300 block">Display Name</label>
                <input
                  type="text"
                  value={userState.identity.name}
                  onChange={(e) =>
                    setUserState({
                      ...userState,
                      identity: { ...userState.identity, name: e.target.value },
                    })
                  }
                  className="w-full px-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-white/30 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300 block">Pronouns</label>
                <input
                  type="text"
                  value={userState.identity.pronouns}
                  onChange={(e) =>
                    setUserState({
                      ...userState,
                      identity: { ...userState.identity, pronouns: e.target.value },
                    })
                  }
                  className="w-full px-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-white/30 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300 block">Public Bio</label>
              <textarea
                rows={3}
                value={userState.identity.bio}
                onChange={(e) =>
                  setUserState({
                    ...userState,
                    identity: { ...userState.identity, bio: e.target.value },
                  })
                }
                className="w-full px-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-white/30 transition-all leading-relaxed"
              />
            </div>

            {/* Dietary Identity */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
              <span className="text-xs font-semibold text-neutral-300 block">
                Dietary Lifestyle
              </span>
              <div className="flex flex-wrap gap-2">
                {(['vegetarian', 'vegan', 'omnivore', 'pescatarian', 'other'] as const).map((diet) => {
                  const isSelected = userState.lifestyle.diet === diet
                  return (
                    <button
                      key={diet}
                      type="button"
                      onClick={() =>
                        setUserState({
                          ...userState,
                          lifestyle: { ...userState.lifestyle, diet },
                        })
                      }
                      className="px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize border transition-all duration-200"
                      style={{
                        background: isSelected ? `${persona.accentColor}20` : 'rgba(255,255,255,0.025)',
                        borderColor: isSelected ? `${persona.accentColor}60` : 'rgba(255,255,255,0.07)',
                        color: isSelected ? persona.accentColor : '#d4d4d8',
                      }}
                    >
                      {diet}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── Stepper Navigation Controls ── */}
        <div className="pt-6 border-t border-white/[0.07] flex items-center justify-between">
          <button
            disabled={currentStep === 1}
            onClick={() => setCurrentStep(currentStep - 1)}
            className="px-5 py-2.5 rounded-2xl text-xs font-semibold text-neutral-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.09] border border-white/[0.08] disabled:opacity-30 flex items-center space-x-1.5 transition-all"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Previous Question</span>
          </button>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono text-neutral-400">
              Step {currentStep} of {steps.length}
            </span>
            <button
              onClick={() => {
                setUserState(currentUser)
                setSelectedQuickPreset(null)
              }}
              className="p-2 rounded-full hover:bg-white/10 text-neutral-500 hover:text-white transition-colors"
              title="Reset to initial preferences"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {currentStep < steps.length ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="px-6 py-2.5 rounded-2xl text-xs font-bold text-black transition-all duration-200 hover:opacity-90 active:scale-95 shadow-md flex items-center space-x-1.5"
              style={{
                background: persona.accentColor,
                boxShadow: `0 0 20px ${persona.glowColor}`,
              }}
            >
              <span>Next Question</span>
              <ChevronRight className="w-3.5 h-3.5 stroke-[2]" />
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="px-6 py-2.5 rounded-2xl text-xs font-bold text-black transition-all duration-200 hover:opacity-90 active:scale-95 shadow-md flex items-center space-x-1.5"
              style={{
                background: '#ffffff',
                boxShadow: '0 0 20px rgba(255,255,255,0.2)',
              }}
            >
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{saveSuccess ? 'Saved to Engine!' : 'Finish & Save Preferences'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
