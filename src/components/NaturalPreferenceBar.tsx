// ============================================================================
// src/components/NaturalPreferenceBar.tsx
// Kin: Apple-Grade Interactive Intent & Dynamic Dyad Matrix
// Instant live reactivity, fluid tactile presets, interactive chips, and direct feedback
// ============================================================================

import React, { useState } from 'react'
import {
  Sliders,
  Check,
  RotateCcw,
  Compass,
  Sparkles,
  Users,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react'
import type { UniversalUserProfile } from '../types'

interface NaturalPreferenceBarProps {
  currentUser: UniversalUserProfile
  onUpdatePreferences: (updatedUser: UniversalUserProfile) => void
  totalMatchesCount: number
  eligibleMatchesCount: number
}

export const NaturalPreferenceBar: React.FC<NaturalPreferenceBarProps> = ({
  currentUser,
  onUpdatePreferences,
  totalMatchesCount,
  eligibleMatchesCount,
}) => {
  const [isOpen, setIsOpen] = useState(true) // Open by default for immediate tactile refinement
  const [minAge, setMinAge] = useState<number>(currentUser.preferences.minAge)
  const [maxAge, setMaxAge] = useState<number>(currentUser.preferences.maxAge)
  const [selectedEthnicity, setSelectedEthnicity] = useState<string>(
    currentUser.preferences.ethnicitiesSought?.[0] || 'all'
  )
  const [selectedGender, setSelectedGender] = useState<string>(
    currentUser.preferences.gendersSought[0] || 'all'
  )
  const [naturalPrompt, setNaturalPrompt] = useState<string>('')
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null)
  const [liveFeedback, setLiveFeedback] = useState<string | null>(null)

  // Quick 1-Click Interactive Scenarios
  const scenarioPresets = [
    {
      id: 'arthur_chloe',
      title: 'Arthur Seeking Chloe',
      tag: '66 ➔ 20 Caucasian',
      description: 'Senior gentleman seeking young Caucasian partner',
      min: 19,
      max: 26,
      ethnicity: 'Caucasian / White',
      gender: 'woman',
    },
    {
      id: 'young_professional',
      title: 'Contemporary Dyad',
      tag: '27 – 35 Any',
      description: 'Elena peer cohort with symmetrical life course',
      min: 27,
      max: 35,
      ethnicity: 'all',
      gender: 'all',
    },
    {
      id: 'mature_companionship',
      title: 'Distinguished Chapter',
      tag: '50 – 75 Any',
      description: 'Mature life partners seeking grounded wisdom',
      min: 50,
      max: 75,
      ethnicity: 'all',
      gender: 'man',
    },
    {
      id: 'broad_horizon',
      title: 'Zero Constraints',
      tag: '18 – 80 Universal',
      description: 'Unbounded discovery across all cohorts',
      min: 18,
      max: 80,
      ethnicity: 'all',
      gender: 'all',
    },
  ]

  const ethnicOptions = [
    { id: 'all', label: 'All Backgrounds' },
    { id: 'Caucasian / White', label: 'Caucasian / White' },
    { id: 'Black / African Descent', label: 'Black / African Descent' },
    { id: 'East Asian', label: 'East Asian' },
    { id: 'South Asian', label: 'South Asian' },
    { id: 'Hispanic / Latino', label: 'Hispanic / Latino' },
    { id: 'Middle Eastern', label: 'Middle Eastern' },
  ]

  const genderOptions = [
    { id: 'all', label: 'All Genders' },
    { id: 'woman', label: 'Women' },
    { id: 'man', label: 'Men' },
    { id: 'nonbinary', label: 'Non-Binary' },
  ]

  // Broadcast immediate state change to parent engine
  const emitUpdate = (
    newMin: number,
    newMax: number,
    eth: string,
    gen: string,
    feedbackNote?: string
  ) => {
    const updatedUser: UniversalUserProfile = {
      ...currentUser,
      preferences: {
        ...currentUser.preferences,
        minAge: newMin,
        maxAge: newMax,
        ethnicitiesSought: eth === 'all' ? ['all'] : [eth],
        gendersSought: gen === 'all' ? ['all'] : [gen],
      },
    }
    onUpdatePreferences(updatedUser)
    if (feedbackNote) {
      setLiveFeedback(feedbackNote)
      setTimeout(() => setLiveFeedback(null), 3000)
    }
  }

  // Interactive Scenario Trigger
  const handleSelectScenario = (sc: typeof scenarioPresets[0]) => {
    setActiveScenarioId(sc.id)
    setMinAge(sc.min)
    setMaxAge(sc.max)
    setSelectedEthnicity(sc.ethnicity)
    setSelectedGender(sc.gender)
    emitUpdate(
      sc.min,
      sc.max,
      sc.ethnicity,
      sc.gender,
      `Scenario Applied: ${sc.title} (Ages ${sc.min}–${sc.max}, ${sc.ethnicity === 'all' ? 'Any' : sc.ethnicity})`
    )
  }

  // Interactive Live Slider Update
  const handleMinAgeChange = (val: number) => {
    const safeMin = Math.min(val, maxAge)
    setMinAge(safeMin)
    setActiveScenarioId(null)
    emitUpdate(safeMin, maxAge, selectedEthnicity, selectedGender)
  }

  const handleMaxAgeChange = (val: number) => {
    const safeMax = Math.max(val, minAge)
    setMaxAge(safeMax)
    setActiveScenarioId(null)
    emitUpdate(minAge, safeMax, selectedEthnicity, selectedGender)
  }

  // Interactive Pill Selectors
  const handleSelectEthnicity = (ethId: string) => {
    setSelectedEthnicity(ethId)
    setActiveScenarioId(null)
    emitUpdate(minAge, maxAge, ethId, selectedGender)
  }

  const handleSelectGender = (genId: string) => {
    setSelectedGender(genId)
    setActiveScenarioId(null)
    emitUpdate(minAge, maxAge, selectedEthnicity, genId)
  }

  // Natural Language Input Processor
  const handleNaturalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!naturalPrompt.trim()) return

    const lower = naturalPrompt.toLowerCase()
    let parsedMin = minAge
    let parsedMax = maxAge
    let parsedEth = selectedEthnicity
    let parsedGen = selectedGender

    // Extract numbers for age
    const nums = naturalPrompt.match(/\b(1[8-9]|[2-9][0-9])\b/g)
    if (nums && nums.length >= 2) {
      const sorted = nums.map(Number).sort((a, b) => a - b)
      parsedMin = sorted[0]
      parsedMax = sorted[sorted.length - 1]
    } else if (nums && nums.length === 1) {
      const n = Number(nums[0])
      parsedMin = Math.max(18, n - 2)
      parsedMax = n + 3
    }

    // Extract background
    if (lower.includes('white') || lower.includes('caucasian')) {
      parsedEth = 'Caucasian / White'
    } else if (lower.includes('black') || lower.includes('african')) {
      parsedEth = 'Black / African Descent'
    } else if (lower.includes('asian')) {
      parsedEth = 'East Asian'
    }

    // Extract gender
    if (lower.includes('woman') || lower.includes('girl') || lower.includes('female')) {
      parsedGen = 'woman'
    } else if (lower.includes('man') || lower.includes('guy') || lower.includes('male')) {
      parsedGen = 'man'
    }

    setMinAge(parsedMin)
    setMaxAge(parsedMax)
    setSelectedEthnicity(parsedEth)
    setSelectedGender(parsedGen)
    setActiveScenarioId(null)
    emitUpdate(
      parsedMin,
      parsedMax,
      parsedEth,
      parsedGen,
      `Parsed: "${naturalPrompt}" ➔ Ages ${parsedMin}–${parsedMax}, ${parsedGen}, ${parsedEth}`
    )
    setNaturalPrompt('')
  }

  // Reset to neutral
  const handleReset = () => {
    setMinAge(18)
    setMaxAge(80)
    setSelectedEthnicity('all')
    setSelectedGender('all')
    setActiveScenarioId('broad_horizon')
    emitUpdate(18, 80, 'all', 'all', 'Reset to complete universe.')
  }

  return (
    <div className="space-y-3.5">
      {/* 1. TOP DYNAMIC SUMMARY BAR */}
      <div className="apple-panel rounded-2xl p-4 border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl bg-gradient-to-r from-white/[0.04] via-transparent to-white/[0.02]">
        {/* Left: Active Live Query Status with Interactive Tags */}
        <div className="flex items-center space-x-3.5 w-full md:w-auto">
          <div className="w-10 h-10 rounded-2xl bg-white/[0.08] border border-white/15 flex items-center justify-center shadow-inner shrink-0">
            <Compass className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                Live Intent Vector
              </span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs font-medium text-white">
              <span>Targeting:</span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-white font-mono text-[11px] border border-white/20">
                {selectedGender === 'all' ? 'All Genders' : selectedGender}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-white font-mono text-[11px] border border-white/20">
                {minAge} – {maxAge} y/o
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-white font-mono text-[11px] border border-white/20">
                {selectedEthnicity === 'all' ? 'Any Background' : selectedEthnicity}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Natural Prompt Input & Interactive Drawer Toggle */}
        <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
          <form onSubmit={handleNaturalSubmit} className="flex-1 md:w-80 relative">
            <input
              type="text"
              value={naturalPrompt}
              onChange={(e) => setNaturalPrompt(e.target.value)}
              placeholder="Type intent (e.g. 20yo white girl)..."
              className="w-full bg-white/[0.05] hover:bg-white/[0.08] focus:bg-white/[0.1] border border-white/[0.1] focus:border-white/30 rounded-full py-2 pl-4 pr-9 text-xs text-white placeholder-neutral-500 focus:outline-none transition-all shadow-inner"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-all text-xs font-bold shadow-md"
              title="Parse & Apply Natural Intent"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`apple-pill-btn px-4 py-2 text-xs font-medium flex items-center space-x-1.5 transition-all cursor-pointer ${
              isOpen
                ? 'bg-white text-black font-semibold shadow-md'
                : 'text-neutral-300 hover:text-white bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{isOpen ? 'Close' : 'Refine'}</span>
          </button>
        </div>
      </div>

      {/* Real-time Dynamic Feedback Pill */}
      {liveFeedback && (
        <div className="text-[11px] font-mono text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-xl flex items-center space-x-2 animate-in fade-in slide-in-from-top-1 duration-200">
          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>{liveFeedback}</span>
        </div>
      )}

      {/* 2. INTERACTIVE INTENT MATRIX (Always responsive, live updating) */}
      {isOpen && (
        <div className="apple-panel rounded-3xl p-6 sm:p-7 space-y-6 border-white/10 shadow-2xl backdrop-blur-2xl animate-in fade-in duration-200">
          {/* Header Row: Live Cohort Math */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
            <div>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-neutral-300" />
                <h3 className="text-base font-semibold text-white tracking-tight">
                  Interactive Dyad Matrix
                </h3>
              </div>
              <p className="text-xs text-neutral-400 font-light mt-0.5">
                Every click instantly re-evaluates the mathematical candidate slate without arbitrary limits.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <div className="text-right">
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
                  Eligible Universe
                </span>
                <span className="text-sm font-semibold font-mono text-white">
                  {eligibleMatchesCount} of {totalMatchesCount} Profiles
                </span>
              </div>
              <div
                className={`w-3 h-3 rounded-full ${
                  eligibleMatchesCount > 0 ? 'bg-emerald-400' : 'bg-rose-400'
                }`}
              />
            </div>
          </div>

          {/* Section A: 1-Click Interactive Scenarios (Apple Cards) */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
              Interactive Canonical Scenarios
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {scenarioPresets.map((sc) => {
                const isSelected = activeScenarioId === sc.id
                return (
                  <div
                    key={sc.id}
                    onClick={() => handleSelectScenario(sc)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 select-none group ${
                      isSelected
                        ? 'bg-white/15 border-white/30 shadow-lg scale-[1.02]'
                        : 'bg-white/[0.02] hover:bg-white/[0.06] border-white/[0.06] hover:border-white/15'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-white/[0.08] text-white">
                        {sc.tag}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white tracking-tight group-hover:text-white">
                        {sc.title}
                      </h4>
                      <p className="text-[11px] text-neutral-400 font-light line-clamp-1 mt-0.5">
                        {sc.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Section B: Tactile Sliders & Visual Chips */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
            {/* 1. Age Range Interactive Track */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-white flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Age Horizon</span>
                </span>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-white/[0.08] text-white">
                  {minAge} – {maxAge} y/o
                </span>
              </div>

              <div className="space-y-3 pt-1">
                <div>
                  <div className="flex justify-between text-[10px] text-neutral-400 font-mono mb-1">
                    <span>Minimum: {minAge}</span>
                    <span>18</span>
                  </div>
                  <input
                    type="range"
                    min="18"
                    max="80"
                    value={minAge}
                    onChange={(e) => handleMinAgeChange(Number(e.target.value))}
                    className="w-full accent-white cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[10px] text-neutral-400 font-mono mb-1">
                    <span>Maximum: {maxAge}</span>
                    <span>80</span>
                  </div>
                  <input
                    type="range"
                    min="18"
                    max="80"
                    value={maxAge}
                    onChange={(e) => handleMaxAgeChange(Number(e.target.value))}
                    className="w-full accent-white cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* 2. Ethnicity Interactive Pills */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-white flex items-center space-x-1.5">
                  <Layers className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Cultural Background</span>
                </span>
                <span className="text-[10px] font-mono text-neutral-400">Multi-Option</span>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {ethnicOptions.map((eth) => {
                  const isAct = selectedEthnicity === eth.id
                  return (
                    <button
                      key={eth.id}
                      onClick={() => handleSelectEthnicity(eth.id)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
                        isAct
                          ? 'bg-white text-black font-semibold shadow-sm'
                          : 'bg-white/[0.04] hover:bg-white/[0.08] text-neutral-400 hover:text-white border border-white/[0.06]'
                      }`}
                    >
                      {eth.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 3. Gender Identified Interactive Selector */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-white flex items-center space-x-1.5">
                  <Users className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Gender Alignment</span>
                </span>
                <span className="text-[10px] font-mono text-neutral-400">Strict Match</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                {genderOptions.map((g) => {
                  const isAct = selectedGender === g.id
                  return (
                    <button
                      key={g.id}
                      onClick={() => handleSelectGender(g.id)}
                      className={`p-2 rounded-xl text-xs font-medium text-center transition-all cursor-pointer ${
                        isAct
                          ? 'bg-white text-black font-semibold shadow-sm'
                          : 'bg-white/[0.04] hover:bg-white/[0.08] text-neutral-400 hover:text-white border border-white/[0.06]'
                      }`}
                    >
                      {g.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Bottom Action Footer: Reset / Status */}
          <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
            <button
              onClick={handleReset}
              className="text-xs text-neutral-400 hover:text-white flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Open Horizon (18–80, All)</span>
            </button>

            <div className="text-[11px] font-mono text-neutral-400 flex items-center space-x-1.5">
              <Check className="w-3 h-3 text-emerald-400" />
              <span>Zero-latency local reactive calculus</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
