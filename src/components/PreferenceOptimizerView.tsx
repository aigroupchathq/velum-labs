// ============================================================================
// src/components/PreferenceOptimizerView.tsx
// Wingman: Standards, Flexibility & Dating Pattern Decision Mirror
// Helping users understand what works for them, separate dealbreakers from preferences,
// and make grounded dating choices without clinical AI diagnosis or false precision.
// ============================================================================

import React, { useState, useMemo } from 'react'
import {
  RotateCcw,
  Scale,
  CheckCircle2,
  Compass,
  Heart,
  Flame,
  Info,
} from 'lucide-react'
import type { UniversalUserProfile } from '../types'

interface PreferenceOptimizerProps {
  currentUser: UniversalUserProfile
}

// Preset Relaxation Scenarios in Human Language
interface FrontierScenario {
  id: 'current' | 'distance' | 'diet' | 'both'
  title: string
  subtitle: string
  matchesCount: number
  expectedCompatibility: number
  distanceKm: number
  dietFlex: number
  ageMargin: number
  badgeColor: string
}

const PRESET_SCENARIOS: FrontierScenario[] = [
  {
    id: 'current',
    title: 'Current Strict Criteria',
    subtitle: 'Everything set to baseline strict requirements',
    matchesCount: 184,
    expectedCompatibility: 88,
    distanceKm: 0,
    dietFlex: 0,
    ageMargin: 0,
    badgeColor: 'border-white/20 text-white bg-white/10',
  },
  {
    id: 'distance',
    title: 'Open Transit Corridor',
    subtitle: '+25 km regional transit envelope (40 min train)',
    matchesCount: 1240,
    expectedCompatibility: 84,
    distanceKm: 25,
    dietFlex: 0,
    ageMargin: 1,
    badgeColor: 'border-purple-500/30 text-purple-300 bg-purple-500/10',
  },
  {
    id: 'diet',
    title: 'Kitchen Respect (Diet Tolerance)',
    subtitle: 'Open to partners who respect your diet without needing identical plates',
    matchesCount: 2870,
    expectedCompatibility: 82,
    distanceKm: 0,
    dietFlex: 35,
    ageMargin: 0,
    badgeColor: 'border-amber-500/30 text-amber-300 bg-amber-500/10',
  },
  {
    id: 'both',
    title: 'Open Transit + Diet Tolerance',
    subtitle: 'Widest healthy dating landscape preserving all core values',
    matchesCount: 6420,
    expectedCompatibility: 76,
    distanceKm: 30,
    dietFlex: 40,
    ageMargin: 2,
    badgeColor: 'border-cyan-500/30 text-cyan-300 bg-cyan-500/10',
  },
]

type CriterionTier = 'preference' | 'friction' | 'dealbreaker'

interface CriteriaItem {
  id: string
  label: string
  detail: string
  currentTier: CriterionTier
  category: 'lifestyle' | 'values' | 'practical' | 'chemistry'
}

const INITIAL_CRITERIA: CriteriaItem[] = [
  {
    id: 'kids',
    label: 'Family & Children Vision',
    detail: 'Whether you want children, already have them, or are child-free.',
    currentTier: 'dealbreaker',
    category: 'values',
  },
  {
    id: 'substance',
    label: 'Smoke-Free & Substance Habits',
    detail: 'Personal health and environmental comfort at home.',
    currentTier: 'dealbreaker',
    category: 'lifestyle',
  },
  {
    id: 'structure',
    label: 'Monogamous / Relationship Structure',
    detail: 'Exclusive partnership vs polyamorous/ethical non-monogamy.',
    currentTier: 'dealbreaker',
    category: 'values',
  },
  {
    id: 'honesty',
    label: 'Direct Communication & No Ghosting',
    detail: 'Emotional accountability and respect during conflict or closure.',
    currentTier: 'dealbreaker',
    category: 'values',
  },
  {
    id: 'sleep_rhythm',
    label: 'Morning Person vs Night Owl',
    detail: 'Different wake/sleep rhythms and weekend pacing.',
    currentTier: 'friction',
    category: 'lifestyle',
  },
  {
    id: 'social_battery',
    label: 'Social Battery & Introversion',
    detail: 'How much solitude or external socializing each person needs.',
    currentTier: 'friction',
    category: 'lifestyle',
  },
  {
    id: 'texting_cadence',
    label: 'Texting & Check-in Frequency',
    detail: 'Daily constant updates vs thoughtful periodic messages.',
    currentTier: 'friction',
    category: 'chemistry',
  },
  {
    id: 'diet_style',
    label: 'Vegetarian / Dietary Practice',
    detail: 'What you eat at home vs what a partner orders when dining out.',
    currentTier: 'preference',
    category: 'lifestyle',
  },
  {
    id: 'distance_radius',
    label: 'Lives Within 15 km Radius',
    detail: 'Immediate neighborhood proximity vs a short transit ride.',
    currentTier: 'preference',
    category: 'practical',
  },
  {
    id: 'hobbies',
    label: 'Shared Hobbies & Music Taste',
    detail: 'Overlapping Spotify genres, hiking, galleries, or cinema.',
    currentTier: 'preference',
    category: 'chemistry',
  },
]

export const PreferenceOptimizerView: React.FC<PreferenceOptimizerProps> = ({
  currentUser,
}) => {
  // Continuous slider deltas
  const [distanceDelta, setDistanceDelta] = useState<number>(0)
  const [dietFlexDelta, setDietFlexDelta] = useState<number>(0)
  const [ageFlexDelta, setAgeFlexDelta] = useState<number>(0)
  const [activeScenarioId, setActiveScenarioId] = useState<string>('current')

  // Interactive Tri-Tier Sorter State
  const [criteria, setCriteria] = useState<CriteriaItem[]>(INITIAL_CRITERIA)
  const [activeMirrorFilter, setActiveMirrorFilter] = useState<'all' | 'dealbreaker' | 'friction' | 'preference'>('all')

  // Apply scenario preset
  const handleApplyScenario = (scenario: FrontierScenario) => {
    setActiveScenarioId(scenario.id)
    setDistanceDelta(scenario.distanceKm)
    setDietFlexDelta(scenario.dietFlex)
    setAgeFlexDelta(scenario.ageMargin)
  }

  // Count criteria by tier
  const dealbreakerCount = useMemo(() => criteria.filter(c => c.currentTier === 'dealbreaker').length, [criteria])
  const frictionCount = useMemo(() => criteria.filter(c => c.currentTier === 'friction').length, [criteria])
  const preferenceCount = useMemo(() => criteria.filter(c => c.currentTier === 'preference').length, [criteria])

  // Move criterion to another tier
  const handleMoveTier = (id: string, newTier: CriterionTier) => {
    setCriteria(prev => prev.map(c => c.id === id ? { ...c, currentTier: newTier } : c))
  }

  // Live dynamic calculations
  const basePool = 184
  const simulatedPool = useMemo(() => {
    const distMultiplier = 1 + (distanceDelta / 20) * 4.2
    const dietMultiplier = 1 + (dietFlexDelta / 30) * 8.5
    const ageMultiplier = 1 + (ageFlexDelta / 2) * 1.8
    // Dealbreakers restrict, preferences give room
    const tierMultiplier = Math.max(0.4, 1.2 - (dealbreakerCount - 4) * 0.15)
    const total = Math.round(basePool * distMultiplier * dietMultiplier * ageMultiplier * tierMultiplier)
    return Math.min(10000, Math.max(184, total))
  }, [distanceDelta, dietFlexDelta, ageFlexDelta, dealbreakerCount])

  const simulatedExpectedCompatibility = useMemo(() => {
    const drop = (distanceDelta * 0.16) + (dietFlexDelta * 0.18) + (ageFlexDelta * 1.5)
    return Math.max(68, Math.round(88 - drop))
  }, [distanceDelta, dietFlexDelta, ageFlexDelta])

  const handleReset = () => {
    setActiveScenarioId('current')
    setDistanceDelta(0)
    setDietFlexDelta(0)
    setAgeFlexDelta(0)
    setCriteria(INITIAL_CRITERIA)
  }

  // Picky Meter Diagnosis (Need #10 & #4)
  const pickyAnalysis = useMemo(() => {
    if (dealbreakerCount >= 7) {
      return {
        level: 'Potentially Too Rigid',
        color: 'text-amber-400',
        badgeBg: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
        headline: 'You may be treating flexible preferences as absolute dealbreakers.',
        advice: 'When secondary habits (like proximity or identical diet) are treated as non-negotiables, you accidentally filter out emotionally mature people who share your deepest values. Consider keeping dealbreakers reserved for core safety, kids, and relationship structure.',
      }
    }
    if (dealbreakerCount <= 2) {
      return {
        level: 'Risk of Over-Compromising',
        color: 'text-rose-400',
        badgeBg: 'bg-rose-500/10 border-rose-500/30 text-rose-300',
        headline: 'You might not be protecting your boundaries firmly enough.',
        advice: 'If you have very few non-negotiables, you risk entering relationships where you repeatedly abandon your own needs or tolerate core lifestyle mismatches hoping the other person will change.',
      }
    }
    return {
      level: 'Calibrated & Healthy',
      color: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
      headline: 'Balanced standards: Firm on core values, open to human differences.',
      advice: 'You have clear non-negotiables protecting your safety and long-term future, while leaving room for everyday differences and personal growth.',
    }
  }, [dealbreakerCount])

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-4 px-2 sm:px-4 text-neutral-100 font-sans">

      {/* ======================================================== */}
      {/* 1. HEADER & DIGNIFIED CONSUMER PHILOSOPHY                */}
      {/* ======================================================== */}
      <header className="space-y-4 border-b border-white/[0.08] pb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium">
            <Compass className="w-3.5 h-3.5" />
            <span>Relationship Decision Mirror · Pattern Awareness</span>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono text-neutral-400">
            <span className="text-emerald-400 font-semibold">{criteria.length} Calibrated Areas</span>
            <span>•</span>
            <span>Zero Algorithmic Coercion</span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
          My Standards &amp; Decision Mirror
        </h1>
        <p className="text-sm sm:text-base text-neutral-300 font-light max-w-3xl leading-relaxed">
          Check is not here to fix you or diagnose your personality. It is a decision mirror to help you recognize your dating patterns: understand what kind of person actually works with you, separate real dealbreakers from everyday preferences, and avoid burning emotional energy on the wrong dynamics.
        </p>

        {/* The Golden Rule Banner */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-3">
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-300 border border-purple-500/20">
              <Scale className="w-4 h-4" />
            </span>
            <div>
              <span className="font-semibold text-white block">The Golden Dating Distinction</span>
              <span className="text-neutral-400 font-mono text-[11px]">
                Preference ≠ Friction Point ≠ True Dealbreaker
              </span>
            </div>
          </div>
          <span className="text-neutral-400 text-xs italic font-light sm:text-right">
            Confusing these three is why 80% of relationships waste months of energy.
          </span>
        </div>
      </header>

      {/* ======================================================== */}
      {/* 2. THE TRI-TIER SORTER (NEED #3 & #4)                     */}
      {/* ======================================================== */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-purple-400">
              Decision Architecture
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Separate What You Need From What You Like
            </h2>
            <p className="text-xs text-neutral-400 font-light mt-0.5">
              Review how you treat each area of life. Click any tag to reclassify it and observe how your dating pool responds.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-1.5 p-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs">
            <button
              onClick={() => setActiveMirrorFilter('all')}
              className={`px-3 py-1 rounded-full transition cursor-pointer ${
                activeMirrorFilter === 'all'
                  ? 'bg-white/20 text-white font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              All ({criteria.length})
            </button>
            <button
              onClick={() => setActiveMirrorFilter('dealbreaker')}
              className={`px-3 py-1 rounded-full transition cursor-pointer ${
                activeMirrorFilter === 'dealbreaker'
                  ? 'bg-rose-500/30 text-rose-200 font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              🔴 Dealbreakers ({dealbreakerCount})
            </button>
            <button
              onClick={() => setActiveMirrorFilter('friction')}
              className={`px-3 py-1 rounded-full transition cursor-pointer ${
                activeMirrorFilter === 'friction'
                  ? 'bg-amber-500/30 text-amber-200 font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              🟡 Friction ({frictionCount})
            </button>
            <button
              onClick={() => setActiveMirrorFilter('preference')}
              className={`px-3 py-1 rounded-full transition cursor-pointer ${
                activeMirrorFilter === 'preference'
                  ? 'bg-emerald-500/30 text-emerald-200 font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              🟢 Flexible ({preferenceCount})
            </button>
          </div>
        </div>

        {/* The Three Core Definitions Box */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
            <div className="flex items-center space-x-2 text-emerald-300 font-semibold text-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>1. Preference (Flexible)</span>
            </div>
            <p className="text-xs text-neutral-300 font-light leading-relaxed">
              "Nice-to-have qualities that bring joy, but wouldn't end an otherwise wonderful connection."
            </p>
            <span className="text-[11px] text-emerald-400/80 block font-mono">
              Safe to relax · Greatly expands candidate variety
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2">
            <div className="flex items-center space-x-2 text-amber-300 font-semibold text-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span>2. Friction Point (Manageable)</span>
            </div>
            <p className="text-xs text-neutral-300 font-light leading-relaxed">
              "Differences requiring communication and gentle accommodation, but not fundamental incompatibilities."
            </p>
            <span className="text-[11px] text-amber-400/80 block font-mono">
              Talk early · Solved by clear expectations
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-2">
            <div className="flex items-center space-x-2 text-rose-300 font-semibold text-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
              <span>3. True Dealbreaker (Stay Firm)</span>
            </div>
            <p className="text-xs text-neutral-300 font-light leading-relaxed">
              "Fundamental life directions and safety lines that cannot be compromised without resentment or self-loss."
            </p>
            <span className="text-[11px] text-rose-400/80 block font-mono">
              Never compromise · Protects emotional sanity
            </span>
          </div>
        </div>

        {/* Criteria Interactive List */}
        <div className="space-y-3 pt-2">
          {criteria
            .filter(c => activeMirrorFilter === 'all' || c.currentTier === activeMirrorFilter)
            .map((item) => {
              return (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-white/15 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-white text-sm">{item.label}</span>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/[0.05] text-neutral-400">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 font-light leading-relaxed">
                      {item.detail}
                    </p>
                  </div>

                  {/* 3-Tier Switcher Buttons */}
                  <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-neutral-900 border border-white/10 shrink-0 self-start sm:self-center">
                    <button
                      type="button"
                      onClick={() => handleMoveTier(item.id, 'preference')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer flex items-center space-x-1 ${
                        item.currentTier === 'preference'
                          ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                      title="Set as flexible preference"
                    >
                      <span>Flexible</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleMoveTier(item.id, 'friction')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer flex items-center space-x-1 ${
                        item.currentTier === 'friction'
                          ? 'bg-amber-600 text-white font-semibold shadow-sm'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                      title="Set as manageable friction point"
                    >
                      <span>Friction</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleMoveTier(item.id, 'dealbreaker')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer flex items-center space-x-1 ${
                        item.currentTier === 'dealbreaker'
                          ? 'bg-rose-600 text-white font-semibold shadow-sm'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                      title="Set as strict dealbreaker"
                    >
                      <span>Dealbreaker</span>
                    </button>
                  </div>
                </div>
              )
            })}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. "AM I TOO PICKY OR NOT PICKY ENOUGH?" (NEED #10 & #4) */}
      {/* ======================================================== */}
      <section className="p-6 sm:p-8 rounded-3xl bg-neutral-900/70 border border-white/10 space-y-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider font-semibold text-amber-400">
              Self-Understanding Mirror
            </span>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Am I Being Too Picky or Not Picky Enough?
            </h2>
            <p className="text-xs text-neutral-400 font-light">
              Distinguishing high standards for safety from unnecessary restrictions on lifestyle quirks
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className={`px-3.5 py-1.5 rounded-full border text-xs font-semibold ${pickyAnalysis.badgeBg}`}>
              {pickyAnalysis.level}
            </div>
          </div>
        </div>

        {/* Diagnosis Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">
              {pickyAnalysis.headline}
            </h3>
            <p className="text-sm text-neutral-300 font-light leading-relaxed">
              {pickyAnalysis.advice}
            </p>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-2 text-xs">
              <span className="font-semibold text-white block">Key Self-Reflection Question:</span>
              <p className="text-neutral-300 italic">
                "If someone was deeply loving, honest, and shared my future life goals, would I reject them simply because of their diet, music taste, or because they live 20 minutes away?"
              </p>
            </div>
          </div>

          {/* Visual Gauge */}
          <div className="p-6 rounded-2xl bg-black/40 border border-white/10 space-y-5">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-400 font-medium">Standards Health (Core Safety &amp; Integrity)</span>
                <span className="text-emerald-400 font-bold">Strong &amp; Protective</span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '85%' }} />
              </div>
              <p className="text-[11px] text-neutral-400 font-light">
                High standards on kindness, emotional honesty, and kids timeline are healthy. Never lower these.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-400 font-medium">Secondary Rigidity (Habits &amp; Proximity)</span>
                <span className={`font-bold ${dealbreakerCount > 6 ? 'text-rose-400' : 'text-purple-400'}`}>
                  {dealbreakerCount > 6 ? 'High (Constraining)' : 'Open (Flexible)'}
                </span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${dealbreakerCount > 6 ? 'bg-rose-500' : 'bg-purple-500'}`}
                  style={{ width: `${Math.min(100, (dealbreakerCount / 10) * 100)}%` }}
                />
              </div>
              <p className="text-[11px] text-neutral-400 font-light">
                {dealbreakerCount > 6
                  ? 'Notice: Treating habits as dealbreakers cuts out 70%+ of people who share your core values.'
                  : 'Well-calibrated: Leaving room for diverse daily styles and serendipity.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. "WHAT KIND OF PERSON ACTUALLY WORKS WITH ME?" (NEED #1 & #2, #8) */}
      {/* ======================================================== */}
      <section className="space-y-5">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-rose-400">
            Pattern Awareness
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Who You Find Exciting vs. What Actually Works Long-Term
          </h2>
          <p className="text-xs text-neutral-400 font-light mt-0.5">
            Dating apps usually trap people in repeated attraction patterns. Check helps you see the difference between an intense spark and long-term peace.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Box 1: The Spark Trap */}
          <div className="p-6 rounded-3xl bg-white/[0.02] border border-rose-500/20 space-y-4">
            <div className="flex items-center space-x-3 text-rose-300 font-semibold text-base">
              <span className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
                <Flame className="w-5 h-5" />
              </span>
              <div>
                <span>The Intense Attraction Spark</span>
                <span className="text-xs text-neutral-400 block font-normal">What feels instantly magnetic on paper</span>
              </div>
            </div>

            <ul className="space-y-2 text-xs text-neutral-300 font-light">
              <li className="flex items-start space-x-2">
                <span className="text-rose-400 font-bold shrink-0">•</span>
                <span>Highly charismatic, mysterious, or intensely flirtatious banter in the first 24 hours.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-rose-400 font-bold shrink-0">•</span>
                <span>Unpredictable communication rhythms that trigger high emotional adrenaline and anxiety.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-rose-400 font-bold shrink-0">•</span>
                <span>Vague or shifting answers about family plans, monogamy, or long-term vision.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-rose-400 font-bold shrink-0">•</span>
                <span>Believing that strong chemistry will magically resolve conflicting life goals.</span>
              </li>
            </ul>

            <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/20 text-xs text-rose-200 font-light">
              ⚠️ <strong>The Dating Trap:</strong> Confusing the anxiety of seeking validation with genuine romantic compatibility.
            </div>
          </div>

          {/* Box 2: What Actually Works Long-Term */}
          <div className="p-6 rounded-3xl bg-white/[0.02] border border-emerald-500/20 space-y-4">
            <div className="flex items-center space-x-3 text-emerald-300 font-semibold text-base">
              <span className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Heart className="w-5 h-5" />
              </span>
              <div>
                <span>What Actually Sustains You</span>
                <span className="text-xs text-neutral-400 block font-normal">What makes everyday partnership peaceful and secure</span>
              </div>
            </div>

            <ul className="space-y-2 text-xs text-neutral-300 font-light">
              <li className="flex items-start space-x-2">
                <span className="text-emerald-400 font-bold shrink-0">•</span>
                <span>Clear, predictable communication where you never have to wonder if they care or disappeared.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-emerald-400 font-bold shrink-0">•</span>
                <span>Mutual respect for solitude, quiet mornings, and sensory battery recharge.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-emerald-400 font-bold shrink-0">•</span>
                <span>Aligned timelines on home, children, and lifestyle so nobody feels pressured or resentful.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-emerald-400 font-bold shrink-0">•</span>
                <span>Calm conflict resolution where disagreements are handled with care, not stonewalling or anger.</span>
              </li>
            </ul>

            <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-200 font-light">
              ✨ <strong>The Grounded Result:</strong> A relationship that calms your nervous system instead of stressing it.
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. EXPLORE REACHABLE RELATIONSHIP SCENARIOS              */}
      {/* ======================================================== */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-cyan-400">
              Reachable Landscape
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight">
              What Happens When You Relax Secondary Traits?
            </h2>
          </div>
          <span className="text-xs text-neutral-400 font-mono">
            Simulate your dating landscape
          </span>
        </div>

        {/* 4 Scenario Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PRESET_SCENARIOS.map((scenario) => {
            const isSelected = activeScenarioId === scenario.id

            return (
              <div
                key={scenario.id}
                onClick={() => handleApplyScenario(scenario)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-purple-950/40 border-purple-500/60 shadow-[0_0_24px_rgba(168,85,247,0.2)]'
                    : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/10'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${scenario.badgeColor}`}>
                      {scenario.id}
                    </span>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-purple-400" />
                    )}
                  </div>
                  <h3 className="text-sm font-semibold text-white tracking-tight">
                    {scenario.title}
                  </h3>
                  <p className="text-xs text-neutral-400 font-light leading-relaxed">
                    {scenario.subtitle}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/[0.06] space-y-1 font-mono">
                  <div className="flex justify-between items-baseline text-xs">
                    <span className="text-neutral-400">Reachable pool:</span>
                    <span className="text-white font-bold text-sm">
                      {scenario.matchesCount.toLocaleString()} candidates
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline text-xs">
                    <span className="text-neutral-400">Avg fit score:</span>
                    <span className="text-purple-300 font-bold">
                      {scenario.expectedCompatibility}%
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. VISUAL TRADE-OFF CURVE (LANDSCAPE EXPANSION)          */}
      {/* ======================================================== */}
      <section className="apple-panel rounded-3xl p-6 sm:p-8 space-y-6 bg-white/[0.02] border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-purple-400">
              Interactive Landscape Curve
            </span>
            <h3 className="text-xl font-bold text-white tracking-tight">
              The Geometry of Dating Choices
            </h3>
            <p className="text-xs text-neutral-400 font-light mt-0.5">
              Candidate Pool Size (X-Axis) vs. Expected Mutual Quality (Y-Axis)
            </p>
          </div>

          <div className="flex items-center space-x-4 text-xs font-mono">
            <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-right">
              <span className="text-neutral-400 block text-[10px] uppercase">Reachable Candidates</span>
              <strong className="text-white text-base">{simulatedPool.toLocaleString()}</strong> people
            </div>
            <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-right">
              <span className="text-purple-300 block text-[10px] uppercase">Expected Average Fit</span>
              <strong className="text-purple-300 text-base">{simulatedExpectedCompatibility}%</strong>
            </div>
          </div>
        </div>

        {/* SVG Curve */}
        <div className="relative py-2">
          <svg viewBox="0 0 700 240" className="w-full h-auto select-none overflow-visible">
            <defs>
              <linearGradient id="frontierFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Grid Lines */}
            {[50, 100, 150, 200].map(y => (
              <line key={y} x1="50" y1={y} x2="670" y2={y} stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.4" />
            ))}
            {[150, 300, 450, 600].map(x => (
              <line key={x} x1={x} y1="30" x2={x} y2="210" stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.4" />
            ))}

            {/* Axis Labels */}
            <text x="50" y="225" fill="#64748b" fontSize="10" fontFamily="sans-serif">180 people</text>
            <text x="280" y="225" fill="#64748b" fontSize="10" fontFamily="sans-serif">2,500 people</text>
            <text x="490" y="225" fill="#64748b" fontSize="10" fontFamily="sans-serif">5,000 people</text>
            <text x="640" y="225" fill="#64748b" fontSize="10" fontFamily="sans-serif">7,000+</text>

            <text x="42" y="55" fill="#64748b" fontSize="10" fontFamily="sans-serif" textAnchor="end">95%</text>
            <text x="42" y="105" fill="#64748b" fontSize="10" fontFamily="sans-serif" textAnchor="end">85%</text>
            <text x="42" y="155" fill="#64748b" fontSize="10" fontFamily="sans-serif" textAnchor="end">75%</text>

            {/* Curve Path */}
            <path
              d="M 60 55 C 140 70, 220 90, 320 110 C 420 130, 530 150, 660 165 L 660 210 L 60 210 Z"
              fill="url(#frontierFill)"
            />
            <path
              d="M 60 55 C 140 70, 220 90, 320 110 C 420 130, 530 150, 660 165"
              fill="none"
              stroke="#a855f7"
              strokeWidth="2.5"
            />

            {/* Scenario Dots */}
            <circle cx="70" cy="65" r="4" fill="#ffffff" stroke="#a855f7" strokeWidth="2" />
            <text x="75" y="52" fill="#ffffff" fontSize="9" fontWeight="bold">Current Strict (184 · 88%)</text>

            <circle cx="210" cy="92" r="4" fill="#c084fc" />
            <text x="215" y="85" fill="#c084fc" fontSize="9">Open Transit (1,240 · 84%)</text>

            <circle cx="370" cy="110" r="4" fill="#fbbf24" />
            <text x="375" y="103" fill="#fbbf24" fontSize="9">Diet Tolerance (2,870 · 82%)</text>

            <circle cx="620" cy="155" r="4" fill="#38bdf8" />
            <text x="560" y="175" fill="#38bdf8" fontSize="9">Open Both (6,420 · 76%)</text>

            {/* Live Operational Point Marker */}
            {(() => {
              const normX = Math.min(640, Math.max(65, 70 + ((simulatedPool - 184) / 6236) * 550))
              const normY = Math.min(170, Math.max(55, 210 - ((simulatedExpectedCompatibility - 65) / 30) * 150))
              return (
                <g>
                  <circle cx={normX} cy={normY} r="12" fill="#a855f7" fillOpacity="0.3" className="animate-pulse" />
                  <circle cx={normX} cy={normY} r="6" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />
                  <line x1={normX} y1={normY} x2={normX} y2="210" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
                </g>
              )
            })()}
          </svg>
        </div>

        <p className="text-xs text-neutral-300 font-light leading-relaxed">
          <strong>The Insight:</strong> Notice how gently widening secondary traits (like allowing a 30-minute train ride or respecting different meal choices) expands your dating world from 184 to 2,870 people while your core compatibility barely drops from 88% to 82%. You preserve your non-negotiables while vastly improving your odds of finding a true partner.
        </p>
      </section>

      {/* ======================================================== */}
      {/* 7. WHY ONE SCORE FAILS: THE HONEST TRADE-OFF (A vs B)    */}
      {/* ======================================================== */}
      <section className="apple-panel rounded-3xl p-6 sm:p-8 space-y-6 bg-white/[0.02] border border-white/10">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-amber-400">
            Real Decision Case Study
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Why Collapsing Humans Into One Score Fails
          </h2>
          <p className="text-xs text-neutral-400 font-light mt-0.5">
            Two different candidates can both be great matches, but for completely different reasons. An algorithm shouldn't make that choice for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Candidate A Card */}
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-purple-500/30 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-purple-300 font-bold block">
                  Candidate A
                </span>
                <h4 className="text-base font-semibold text-white">Maya Lin</h4>
              </div>
              <span className="px-2.5 py-1 rounded bg-purple-500/20 text-purple-300 text-xs font-semibold">
                High Worldview Alignment
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between text-neutral-300">
                  <span>Core Values &amp; Worldview</span>
                  <span className="text-emerald-400 font-bold">95% (Near Twin)</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '95%' }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-neutral-300">
                  <span>Geographic Proximity</span>
                  <span className="text-purple-300 font-bold">90% (Lives in same borough)</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full" style={{ width: '90%' }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-neutral-300">
                  <span>Family &amp; Kids Timeline</span>
                  <span className="text-amber-300 font-bold">60% (Prefers 4–5 years / flexible)</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: '60%' }} />
                </div>
              </div>
            </div>

            <p className="text-xs text-neutral-300 font-light pt-2 border-t border-white/[0.04] leading-relaxed">
              <strong>The Trade-off:</strong> Maya offers an immediate, magical philosophical and conversational spark close to home, but you would need an early conversation about family pacing.
            </p>
          </div>

          {/* Candidate B Card */}
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-cyan-500/30 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-300 font-bold block">
                  Candidate B
                </span>
                <h4 className="text-base font-semibold text-white">Julian Vance</h4>
              </div>
              <span className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-300 text-xs font-semibold">
                High Domestic &amp; Family Alignment
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between text-neutral-300">
                  <span>Daily Living Rhythm &amp; Quiet Domestic Pace</span>
                  <span className="text-emerald-400 font-bold">92% (Identical rhythm)</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '92%' }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-neutral-300">
                  <span>Family &amp; Children Timeline</span>
                  <span className="text-emerald-400 font-bold">90% (Wants family in 2–3 yrs)</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '90%' }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-neutral-300">
                  <span>Geographic Proximity</span>
                  <span className="text-amber-300 font-bold">50% (Lives 35 km away across town)</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: '50%' }} />
                </div>
              </div>
            </div>

            <p className="text-xs text-neutral-300 font-light pt-2 border-t border-white/[0.04] leading-relaxed">
              <strong>The Trade-off:</strong> Julian matches your long-term domestic life and family dreams seamlessly, but seeing each other requires a train commute across the city.
            </p>
          </div>
        </div>

        {/* Human Agency Takeaway */}
        <div className="p-4 rounded-2xl bg-amber-500/[0.06] border border-amber-500/20 text-xs text-neutral-300 space-y-1.5 leading-relaxed font-light">
          <div className="flex items-center space-x-2 text-amber-300 font-semibold text-xs">
            <Info className="w-4 h-4" />
            <span>Check's Commitment to Your Autonomy</span>
          </div>
          <p>
            Neither candidate is "objectively better." Maya offers immediate intellectual and physical closeness; Julian offers deep long-term domestic security. An algorithm shouldn't pretend to know which one you value more today. Check surfaces the genuine trade-off with dignity, so you make your own informed decision.
          </p>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 8. CONTINUOUS TOLERANCE SLIDERS                          */}
      {/* ======================================================== */}
      <section className="apple-panel rounded-3xl p-6 sm:p-7 space-y-6 bg-white/[0.02] border border-white/10">
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
          <div>
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
              Fine-Tune Your Boundaries
            </h2>
            <p className="text-xs text-neutral-400 font-light">
              Adjust individual parameters to see how your reachable dating landscape responds in real-time
            </p>
          </div>
          <button
            onClick={handleReset}
            className="apple-pill-btn px-3 py-1.5 text-xs text-neutral-400 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] flex items-center space-x-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        </div>

        {/* 1. Distance Radius */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-neutral-300 font-medium">Search Distance Tolerance</span>
            <span className="font-mono text-purple-300 font-bold">+{distanceDelta} km ({currentUser.geography.maxDistanceKm + distanceDelta} km total)</span>
          </div>
          <div className="flex items-center space-x-2.5">
            <button
              type="button"
              onClick={() => {
                setDistanceDelta(Math.max(0, distanceDelta - 5))
                setActiveScenarioId('custom')
              }}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 text-white font-bold text-sm flex items-center justify-center shrink-0 cursor-pointer"
              aria-label="Decrease radius flexibility"
            >
              -
            </button>
            <input
              type="range"
              min="0"
              max="60"
              step="5"
              value={distanceDelta}
              onChange={(e) => {
                setDistanceDelta(parseInt(e.target.value, 10))
                setActiveScenarioId('custom')
              }}
              className="flex-1 accent-purple cursor-pointer"
            />
            <button
              type="button"
              onClick={() => {
                setDistanceDelta(Math.min(60, distanceDelta + 5))
                setActiveScenarioId('custom')
              }}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 text-white font-bold text-sm flex items-center justify-center shrink-0 cursor-pointer"
              aria-label="Increase radius flexibility"
            >
              +
            </button>
          </div>
          <div className="flex justify-between text-[11px] text-neutral-400 font-mono">
            <span>Tight neighborhood ({currentUser.geography.maxDistanceKm} km)</span>
            <span>Wider regional transit ({currentUser.geography.maxDistanceKm + 60} km)</span>
          </div>
        </div>

        {/* 2. Dietary Practice Tolerance */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-neutral-300 font-medium">Dietary Practice Flexibility</span>
            <span className="font-mono text-amber-300 font-bold">+{dietFlexDelta}%</span>
          </div>
          <div className="flex items-center space-x-2.5">
            <button
              type="button"
              onClick={() => {
                setDietFlexDelta(Math.max(0, dietFlexDelta - 5))
                setActiveScenarioId('custom')
              }}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 text-white font-bold text-sm flex items-center justify-center shrink-0 cursor-pointer"
              aria-label="Decrease diet flexibility"
            >
              -
            </button>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={dietFlexDelta}
              onChange={(e) => {
                setDietFlexDelta(parseInt(e.target.value, 10))
                setActiveScenarioId('custom')
              }}
              className="flex-1 accent-amber cursor-pointer"
            />
            <button
              type="button"
              onClick={() => {
                setDietFlexDelta(Math.min(50, dietFlexDelta + 5))
                setActiveScenarioId('custom')
              }}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 text-white font-bold text-sm flex items-center justify-center shrink-0 cursor-pointer"
              aria-label="Increase diet flexibility"
            >
              +
            </button>
          </div>
          <div className="flex justify-between text-[11px] text-neutral-400 font-mono">
            <span>Strict identical diet (0%)</span>
            <span>Kitchen respect allowed (50%)</span>
          </div>
        </div>

        {/* 3. Age Tolerance Margin */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-neutral-300 font-medium">Age Tolerance Margin</span>
            <span className="font-mono text-cyan-300 font-bold">±{ageFlexDelta} yrs</span>
          </div>
          <div className="flex items-center space-x-2.5">
            <button
              type="button"
              onClick={() => {
                setAgeFlexDelta(Math.max(0, ageFlexDelta - 1))
                setActiveScenarioId('custom')
              }}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 text-white font-bold text-sm flex items-center justify-center shrink-0 cursor-pointer"
              aria-label="Decrease age margin"
            >
              -
            </button>
            <input
              type="range"
              min="0"
              max="5"
              step="1"
              value={ageFlexDelta}
              onChange={(e) => {
                setAgeFlexDelta(parseInt(e.target.value, 10))
                setActiveScenarioId('custom')
              }}
              className="flex-1 accent-cyan cursor-pointer"
            />
            <button
              type="button"
              onClick={() => {
                setAgeFlexDelta(Math.min(5, ageFlexDelta + 1))
                setActiveScenarioId('custom')
              }}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 text-white font-bold text-sm flex items-center justify-center shrink-0 cursor-pointer"
              aria-label="Increase age margin"
            >
              +
            </button>
          </div>
          <div className="flex justify-between text-[11px] text-neutral-400 font-mono">
            <span>Exact target: [{currentUser.preferences.minAge}–{currentUser.preferences.maxAge}]</span>
            <span>Simulated: [{currentUser.preferences.minAge - ageFlexDelta}–{currentUser.preferences.maxAge + ageFlexDelta}]</span>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 9. FAIR DISCOVERY & ZERO PAY-TO-WIN SAFEGUARDS           */}
      {/* ======================================================== */}
      <section className="apple-panel rounded-3xl p-6 sm:p-8 space-y-6 bg-white/[0.02] border border-white/10">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400">
            Platform Protection Pledge
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Fair Discovery &amp; Anti-Monopoly Guarantees
          </h2>
          <p className="text-xs text-neutral-400 font-light mt-0.5">
            How Check protects regular people from algorithmic popularity contests and pay-to-win mechanics
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          {/* Anti-Hoarding */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">Equal Attention Distribution</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <p className="text-neutral-400 font-light mt-1">
                Conventional apps give 80% of views to the top 2% of profiles. Check enforces fair rotation so every verified person gets seen by genuinely compatible partners.
              </p>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 font-semibold">
              Active · No Attention Monopolies
            </span>
          </div>

          {/* Reciprocal Mutuality */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">Mutual Desire Protection</span>
                <span className="w-2 h-2 rounded-full bg-purple-400" />
              </div>
              <p className="text-neutral-400 font-light mt-1">
                You are only introduced to people whose criteria you also meet. Zero asymmetric dead-ends where someone likes you but you can never match their lifestyle.
              </p>
            </div>
            <span className="text-[11px] font-mono text-purple-400 font-semibold">
              Active · Zero Asymmetric Waste
            </span>
          </div>

          {/* Zero Pay-To-Win */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">Strict Zero Pay-to-Win</span>
                <span className="w-2 h-2 rounded-full bg-rose-400" />
              </div>
              <p className="text-neutral-400 font-light mt-1">
                Nobody can purchase "Super Likes" or "Boosts" to bypass your dealbreakers or force themselves into your messages. Boundaries are absolute.
              </p>
            </div>
            <span className="text-[11px] font-mono text-rose-400 font-semibold">
              Statutory Invariant D-23 Enforced
            </span>
          </div>
        </div>
      </section>

    </div>
  )
}

export default PreferenceOptimizerView
