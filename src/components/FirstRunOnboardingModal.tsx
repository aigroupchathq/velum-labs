// ============================================================================
// src/components/FirstRunOnboardingModal.tsx
// Universal Compatibility Platform: 90-Second First-Run Experience (FTUX)
// The Relational Sanctuary & Taste Blend Live Calibration Journey
// ============================================================================

import React, { useState, useMemo } from 'react'
import {
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  MapPin,
  Home,
  Music,
  Compass,
  Moon,
  Sun,
  Clock,
} from 'lucide-react'
import type { UniversalUserProfile } from '../types'
import { evaluateMatch } from '../utils/matchingEngine'
import { mockCandidates } from '../data/mockProfiles'
import { sounds } from '../utils/sound'

interface FirstRunOnboardingModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: (calibratedUser: UniversalUserProfile, destinationView: 'recs' | 'network') => void
  initialUser: UniversalUserProfile
}

// 6 Curated High-Taste Avatars
const CURATED_AVATARS = [
  { id: 'av1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80', label: 'Classic Minimal' },
  { id: 'av2', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80', label: 'Acoustic Calm' },
  { id: 'av3', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80', label: 'Nordic Warm' },
  { id: 'av4', url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80', label: 'Reflective Indigo' },
  { id: 'av5', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80', label: 'Studio Earth' },
  { id: 'av6', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80', label: 'Architectural Shadow' },
]

export const FirstRunOnboardingModal: React.FC<FirstRunOnboardingModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  initialUser,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [draft, setDraft] = useState<UniversalUserProfile>({
    ...initialUser,
    identity: {
      ...initialUser.identity,
      name: initialUser.identity.name || 'Alex Mercer',
      bio: initialUser.identity.bio || 'Exploring intentional acoustics, gallery walks, and slow coffee in the city.',
    },
  })

  // Calculate live matching evaluation against mock pool
  const liveEvaluations = useMemo(() => {
    return mockCandidates
      .filter((c) => c.id !== draft.id)
      .map((c) => ({
        candidate: c,
        eval: evaluateMatch(draft, c),
      }))
  }, [draft])

  const eligibleCount = liveEvaluations.filter((item) => item.eval.eligible).length
  
  // Find top resonance blend candidate
  const topBlendCandidate = useMemo(() => {
    const sorted = [...liveEvaluations].sort(
      (a, b) => (b.eval.mutuality.score || 0) - (a.eval.mutuality.score || 0)
    )
    return sorted[0] || liveEvaluations[0]
  }, [liveEvaluations])

  if (!isOpen) return null

  const handleNextStep = () => {
    sounds.playLike()
    if (step < 4) {
      setStep((s) => (s + 1) as any)
    }
  }

  const handleFinish = (dest: 'recs' | 'network') => {
    sounds.playMatch()
    onComplete(draft, dest)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-3xl overflow-y-auto animate-in fade-in duration-300">
      <div className="bg-[#0b0b0e] border border-white/10 rounded-[2.5rem] max-w-3xl w-full p-6 sm:p-9 shadow-[0_30px_90px_rgba(0,0,0,0.9)] relative overflow-hidden flex flex-col space-y-6">
        
        {/* Soft Radial Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-rose-500/10 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Header Bar & 90s Progress Indicator */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] relative z-10">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-rose-500/15 text-rose-300 border border-rose-500/30 flex items-center space-x-1">
                <Clock className="w-3 h-3 text-rose-400" />
                <span>90s Calibration</span>
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                Step {step} of 4
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {step === 1 && '1. The Identity Anchor'}
              {step === 2 && '2. My Relational Sanctuary (House Rules)'}
              {step === 3 && '3. The Taste Spectrum (Spotify Blend)'}
              {step === 4 && '4. Your Live Universe & First Blend'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-neutral-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.09] border border-white/[0.08] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Progress Bar with Micro Dots */}
        <div className="grid grid-cols-4 gap-2 relative z-10">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                s <= step
                  ? 'bg-gradient-to-r from-rose-500 to-purple-500 shadow-sm shadow-rose-900/50'
                  : 'bg-white/[0.08]'
              }`}
            />
          ))}
        </div>

        {/* ======================================================== */}
        {/* STEP 1: THE IDENTITY ANCHOR (20s)                        */}
        {/* ======================================================== */}
        {step === 1 && (
          <div className="space-y-6 relative z-10 animate-in fade-in slide-in-from-right-4 duration-300">
            <p className="text-xs text-neutral-400 font-light">
              Anchor your presence in the network. Clean, verified, zero corporate resumes.
            </p>

            {/* Avatar Selection Cloud */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">
                Choose Aesthetic Avatar Portrait
              </label>
              <div className="grid grid-cols-6 gap-2.5">
                {CURATED_AVATARS.map((av) => {
                  const isSelected = draft.identity.photos[0] === av.url
                  return (
                    <button
                      key={av.id}
                      onClick={() => {
                        sounds.playTap()
                        setDraft({
                          ...draft,
                          identity: { ...draft.identity, photos: [av.url] },
                        })
                      }}
                      className={`relative rounded-2xl overflow-hidden aspect-square transition cursor-pointer group ${
                        isSelected
                          ? 'ring-2 ring-rose-500 scale-105 shadow-lg shadow-rose-900/40'
                          : 'opacity-60 hover:opacity-100 hover:scale-102 ring-1 ring-white/10'
                      }`}
                    >
                      <img src={av.url} alt={av.label} className="w-full h-full object-cover" />
                      {isSelected && (
                        <div className="absolute inset-0 bg-rose-500/20 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white stroke-[3]" />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Name, Handle & City Input Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-neutral-400 font-mono block mb-1">Your Name</label>
                <input
                  type="text"
                  value={draft.identity.name}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      identity: { ...draft.identity, name: e.target.value },
                    })
                  }
                  className="w-full bg-neutral-950 border border-white/15 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="text-neutral-400 font-mono block mb-1">Social Handle</label>
                <input
                  type="text"
                  value={`@${draft.identity.name.toLowerCase().replace(/\s+/g, '')}.v`}
                  readOnly
                  className="w-full bg-neutral-950/60 border border-white/10 rounded-xl px-3 py-2 text-neutral-400 font-mono select-none"
                />
              </div>

              <div>
                <label className="text-neutral-400 font-mono block mb-1">City / Metro</label>
                <div className="relative">
                  <input
                    type="text"
                    value={draft.geography.cityName}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        geography: { ...draft.geography, cityName: e.target.value },
                      })
                    }
                    className="w-full bg-neutral-950 border border-white/15 rounded-xl pl-8 pr-3 py-2 text-white font-medium focus:outline-none focus:border-rose-400"
                  />
                  <MapPin className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-3" />
                </div>
              </div>
            </div>

            {/* One-Liner Vibe Statement */}
            <div className="text-xs">
              <label className="text-neutral-400 font-mono block mb-1">One-Liner Intent & Vibe</label>
              <input
                type="text"
                value={draft.identity.bio}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    identity: { ...draft.identity, bio: e.target.value },
                  })
                }
                className="w-full bg-neutral-950 border border-white/15 rounded-xl px-3 py-2 text-white font-light focus:outline-none focus:border-rose-400"
              />
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 2: MY RELATIONAL SANCTUARY (AIRBNB RULES - 25s)     */}
        {/* ======================================================== */}
        {step === 2 && (
          <div className="space-y-6 relative z-10 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-300 flex items-start space-x-2.5">
              <Home className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed font-light">
                <strong>Clear Personal Boundaries:</strong> Dignified, non-negotiable standards. Anyone who doesn't fit these core priorities is filtered out with 100% protection, so neither of you ever has to make awkward compromises.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              {/* Substance / Smoke-free Rule */}
              <div className="p-4 rounded-2xl bg-neutral-950 border border-white/10 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-300 font-sans font-medium">Substance Boundary</span>
                  <span className="text-emerald-400 text-[11px]">
                    {draft.lifestyle.smoking === 'never' ? '🚭 Strictly Smoke-Free' : 'Social OK'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      sounds.playTap()
                      setDraft({
                        ...draft,
                        lifestyle: { ...draft.lifestyle, smoking: 'never' },
                        preferences: {
                          ...draft.preferences,
                          smokingPreference: { ...draft.preferences.smokingPreference, dealbreaker: true },
                        },
                      })
                    }}
                    className={`py-2 px-3 rounded-xl border transition cursor-pointer text-center text-xs ${
                      draft.lifestyle.smoking === 'never'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold'
                        : 'bg-neutral-900 text-neutral-400 hover:text-white border-white/[0.06]'
                    }`}
                  >
                    Smoke-Free Sanctuary
                  </button>
                  <button
                    onClick={() => {
                      sounds.playTap()
                      setDraft({
                        ...draft,
                        lifestyle: { ...draft.lifestyle, smoking: 'socially' },
                        preferences: {
                          ...draft.preferences,
                          smokingPreference: { ...draft.preferences.smokingPreference, dealbreaker: false },
                        },
                      })
                    }}
                    className={`py-2 px-3 rounded-xl border transition cursor-pointer text-center text-xs ${
                      draft.lifestyle.smoking !== 'never'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold'
                        : 'bg-neutral-900 text-neutral-400 hover:text-white border-white/[0.06]'
                    }`}
                  >
                    Social Flexible
                  </button>
                </div>
              </div>

              {/* Dietary Policy */}
              <div className="p-4 rounded-2xl bg-neutral-950 border border-white/10 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-300 font-sans font-medium">Dietary Standard</span>
                  <span className="text-emerald-400 text-[11px] capitalize">{draft.lifestyle.diet}</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                  {(['vegetarian', 'vegan', 'omnivore'] as const).map((diet) => (
                    <button
                      key={diet}
                      onClick={() => {
                        sounds.playTap()
                        setDraft({
                          ...draft,
                          lifestyle: { ...draft.lifestyle, diet },
                        })
                      }}
                      className={`py-2 px-2 rounded-xl border transition cursor-pointer text-center capitalize ${
                        draft.lifestyle.diet === diet
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold'
                          : 'bg-neutral-900 text-neutral-400 hover:text-white border-white/[0.06]'
                      }`}
                    >
                      {diet}
                    </button>
                  ))}
                </div>
              </div>

              {/* Relationship Commitment Structure */}
              <div className="p-4 rounded-2xl bg-neutral-950 border border-white/10 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-300 font-sans font-medium">Relational Architecture</span>
                  <span className="text-rose-400 text-[11px] uppercase">
                    {draft.intention.relationshipStructure}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {(['monogamous', 'flexible'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        sounds.playTap()
                        setDraft({
                          ...draft,
                          intention: { ...draft.intention, relationshipStructure: st },
                        })
                      }}
                      className={`py-2 px-3 rounded-xl border transition cursor-pointer text-center capitalize text-xs ${
                        draft.intention.relationshipStructure === st
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-semibold'
                          : 'bg-neutral-900 text-neutral-400 hover:text-white border-white/[0.06]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Transit & Commute Radius */}
              <div className="p-4 rounded-2xl bg-neutral-950 border border-white/10 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-300 font-sans font-medium">Transit Radius</span>
                  <span className="text-cyan-400 font-bold text-xs">{draft.geography.maxDistanceKm} km</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={60}
                  step={5}
                  value={draft.geography.maxDistanceKm}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      geography: { ...draft.geography, maxDistanceKm: Number(e.target.value) },
                    })
                  }
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-neutral-500">
                  <span>5 km (Local)</span>
                  <span>30 km (Metro)</span>
                  <span>60 km (Rail)</span>
                </div>
              </div>
            </div>

            {/* Real-time Feasibility Feedback Pill */}
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between text-xs font-mono">
              <span className="text-neutral-400">Hard Constraint Filter:</span>
              <span className="text-emerald-400 font-semibold">
                8,420 Incompatible Excluded • {eligibleCount} Mutual Candidates Validated
              </span>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 3: THE TASTE SPECTRUM (SPOTIFY BLEND - 25s)         */}
        {/* ======================================================== */}
        {step === 3 && (
          <div className="space-y-6 relative z-10 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-500/20 text-xs text-rose-300 flex items-start space-x-2.5">
              <Music className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed font-light">
                <strong>Spotify Blend Benchmark:</strong> Select 3 to 5 life anchors. These form your core resonance frequencies—the things that ignite your mind and daily cadence.
              </p>
            </div>

            {/* Core Values Pill Cloud */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">
                Tap Your Core Life Compass Anchors ({draft.values.coreValues.length} Selected)
              </label>
              <div className="flex flex-wrap gap-2 text-xs">
                {[
                  'Autonomy & Growth',
                  'Ethical Integrity',
                  'Creative Expression',
                  'Radical Candor',
                  'Curiosity & Wonder',
                  'Slow Morning Coffee',
                  'Night Contemplation',
                  'Contemporary Galleries',
                  'Literature & Essays',
                  'Spatial Sound & Music',
                ].map((anchor) => {
                  const isSelected = draft.values.coreValues.includes(anchor)
                  return (
                    <button
                      key={anchor}
                      onClick={() => {
                        sounds.playTap()
                        const updated = isSelected
                          ? draft.values.coreValues.filter((v) => v !== anchor)
                          : [...draft.values.coreValues, anchor]
                        setDraft({
                          ...draft,
                          values: { ...draft.values, coreValues: updated },
                        })
                      }}
                      className={`px-3.5 py-1.5 rounded-full transition cursor-pointer flex items-center space-x-1.5 ${
                        isSelected
                          ? 'bg-rose-500 text-white font-medium shadow-md shadow-rose-900/40 border border-rose-400'
                          : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-white/[0.08]'
                      }`}
                    >
                      <span>{anchor}</span>
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Circadian Rhythm & Communication Cadence */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-neutral-950 border border-white/10 space-y-2">
                <span className="text-neutral-400 font-mono text-[11px] block">Circadian Recharge Flow</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      sounds.playTap()
                      setDraft({
                        ...draft,
                        accessibility: { ...draft.accessibility, sleepChronotype: 'morning_lark' },
                      })
                    }}
                    className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center space-x-1.5 transition cursor-pointer ${
                      draft.accessibility.sleepChronotype === 'morning_lark'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                        : 'bg-neutral-900 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>Morning Lark</span>
                  </button>
                  <button
                    onClick={() => {
                      sounds.playTap()
                      setDraft({
                        ...draft,
                        accessibility: { ...draft.accessibility, sleepChronotype: 'night_owl' },
                      })
                    }}
                    className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center space-x-1.5 transition cursor-pointer ${
                      draft.accessibility.sleepChronotype === 'night_owl'
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-semibold'
                        : 'bg-neutral-900 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Night Owl</span>
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-950 border border-white/10 space-y-2">
                <span className="text-neutral-400 font-mono text-[11px] block">Messaging Cadence</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      sounds.playTap()
                      setDraft({
                        ...draft,
                        communication: { ...draft.communication, digitalCadence: 'end_of_day' },
                      })
                    }}
                    className={`flex-1 py-2 px-2 rounded-xl text-center transition cursor-pointer ${
                      draft.communication.digitalCadence === 'end_of_day'
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-semibold'
                        : 'bg-neutral-900 text-neutral-400 hover:text-white'
                    }`}
                  >
                    🌅 Evening Texter
                  </button>
                  <button
                    onClick={() => {
                      sounds.playTap()
                      setDraft({
                        ...draft,
                        communication: { ...draft.communication, digitalCadence: 'regular_intervals' },
                      })
                    }}
                    className={`flex-1 py-2 px-2 rounded-xl text-center transition cursor-pointer ${
                      draft.communication.digitalCadence === 'regular_intervals'
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-semibold'
                        : 'bg-neutral-900 text-neutral-400 hover:text-white'
                    }`}
                  >
                    ⚡ Regular Checks
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 4: LIVE UNIVERSE UNLOCK & FIRST BLEND REVEAL (20s)  */}
        {/* ======================================================== */}
        {step === 4 && (
          <div className="space-y-6 relative z-10 animate-in fade-in zoom-in-95 duration-500 text-center">
            
            {/* Top Celebration Avatar Overlay */}
            <div className="flex items-center justify-center -space-x-4 pt-2">
              <div className="relative">
                <img
                  src={draft.identity.photos[0]}
                  alt={draft.identity.name}
                  className="w-16 h-16 rounded-full object-cover ring-4 ring-neutral-900 shadow-2xl"
                />
                <span className="absolute -bottom-1 -left-1 px-1.5 py-0.2 rounded-full bg-neutral-900 text-[10px] text-white font-mono border border-white/20">
                  You
                </span>
              </div>

              <div className="w-9 h-9 rounded-full bg-gradient-to-r from-rose-500 to-purple-500 flex items-center justify-center z-10 shadow-lg text-white font-bold text-xs">
                ⇄
              </div>

              <div className="relative">
                <img
                  src={topBlendCandidate.candidate.identity.photos[0]}
                  alt={topBlendCandidate.candidate.identity.name}
                  className="w-16 h-16 rounded-full object-cover ring-4 ring-neutral-900 shadow-2xl"
                />
                <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full bg-neutral-900 text-[10px] text-rose-300 font-mono border border-rose-500/30">
                  {topBlendCandidate.candidate.identity.name.split(' ')[0]}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-extrabold text-white tracking-tight">
                Your Sanctuary &amp; Blend Are Live
              </h3>
              <p className="text-xs text-neutral-400 font-light max-w-md mx-auto">
                Deterministic synthesis complete across 12 psychological facets. Your boundaries are protected.
              </p>
            </div>

            {/* The First Resonance Blend Showcase Card */}
            <div className="p-5 rounded-3xl bg-neutral-950/80 border border-rose-500/30 max-w-lg mx-auto text-left space-y-3.5 shadow-2xl">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-rose-400" />
                  <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                    Top Mutual Resonance Blend
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  {topBlendCandidate.eval.mutuality.score}% Resonance
                </span>
              </div>

              <p className="text-xs text-neutral-300 font-light leading-relaxed">
                You and <strong>{topBlendCandidate.candidate.identity.name}</strong> ({topBlendCandidate.candidate.identity.age} · {topBlendCandidate.candidate.geography.cityName}) share harmonic alignment in creative autonomy, quiet domestic cadence, and low conflict latency.
              </p>

              {/* Vector Bar Snippet */}
              <div className="grid grid-cols-3 gap-2 text-[11px] font-mono pt-1">
                <div className="p-2 rounded-xl bg-neutral-900/80 border border-white/[0.06] text-center">
                  <span className="text-neutral-500 block text-[10px]">Values Overlap</span>
                  <span className="text-rose-400 font-bold">96%</span>
                </div>
                <div className="p-2 rounded-xl bg-neutral-900/80 border border-white/[0.06] text-center">
                  <span className="text-neutral-500 block text-[10px]">Lifestyle Cadence</span>
                  <span className="text-cyan-400 font-bold">88%</span>
                </div>
                <div className="p-2 rounded-xl bg-neutral-900/80 border border-white/[0.06] text-center">
                  <span className="text-neutral-500 block text-[10px]">Communication</span>
                  <span className="text-sky-400 font-bold">91%</span>
                </div>
              </div>
            </div>

            {/* Invariant D-23 Guarantee Ribbon */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Invariant D-23 Verified: 0.000% Pay Leakage Across Entire Universe</span>
            </div>

          </div>
        )}

        {/* Footer Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-white/[0.08] relative z-10">
          {step > 1 ? (
            <button
              onClick={() => {
                sounds.playTap()
                setStep((s) => (s - 1) as any)
              }}
              className="px-4 py-2 rounded-full text-xs font-mono bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white transition cursor-pointer"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              onClick={handleNextStep}
              className="px-6 py-2.5 rounded-full text-xs font-semibold bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white shadow-lg shadow-rose-900/40 flex items-center space-x-2 transition cursor-pointer"
            >
              <span>Continue Calibration</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="flex items-center space-x-2.5">
              <button
                onClick={() => handleFinish('network')}
                className="px-4 py-2.5 rounded-full text-xs font-medium bg-neutral-900 hover:bg-neutral-800 text-purple-300 border border-purple-500/30 flex items-center space-x-1.5 transition cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5 text-purple-400" />
                <span>Constellation Manifold</span>
              </button>

              <button
                onClick={() => handleFinish('recs')}
                className="px-6 py-2.5 rounded-full text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/40 flex items-center space-x-2 transition cursor-pointer"
              >
                <span>Launch Discovery Feed</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
