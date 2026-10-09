// ============================================================================
// src/components/NaturalPreferenceBar.tsx
// Desktop Discovery Intent & Preference Refinement Panel
// Consumer experience first: Clean browsing criteria, tactile touch steppers,
// 44px+ touch targets. Demographic filtering and free-text targeting quarantined
// into research mode (Amendment 4).
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
  FlaskConical,
} from 'lucide-react'
import type { UniversalUserProfile } from '../types'

interface NaturalPreferenceBarProps {
  currentUser: UniversalUserProfile
  onUpdatePreferences: (updatedUser: UniversalUserProfile) => void
  totalMatchesCount: number
  eligibleMatchesCount: number
  isResearchMode?: boolean
}

export const NaturalPreferenceBar: React.FC<NaturalPreferenceBarProps> = ({
  currentUser,
  onUpdatePreferences,
  totalMatchesCount,
  eligibleMatchesCount,
  isResearchMode = false,
}) => {
  const [isOpen, setIsOpen] = useState(false) // Default closed on desktop to preserve candidate prominence
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

  // Clean Consumer Cohort Presets (Amendment 4: No demographic/ethnicity targeting in consumer mode)
  const consumerScenarioPresets = [
    {
      id: 'contemporary',
      title: 'Contemporary Cohort',
      tag: '25 – 35 Cohort',
      description: 'Peer cohort with similar generational life stage',
      min: 25,
      max: 35,
      gender: 'all',
    },
    {
      id: 'distinguished',
      title: 'Distinguished Chapter',
      tag: '45 – 65 Cohort',
      description: 'Mature life stage seeking grounded companionship',
      min: 45,
      max: 65,
      gender: 'all',
    },
    {
      id: 'broad_horizon',
      title: 'Open Horizon',
      tag: '18 – 80 Universal',
      description: 'Unbounded discovery across all age ranges',
      min: 18,
      max: 80,
      gender: 'all',
    },
  ]

  // Quarantined Research / Testing Presets (Accessible ONLY when isResearchMode = true)
  const researchScenarioPresets = [
    {
      id: 'arthur_chloe_research',
      title: 'Research Model Fixture 1',
      tag: '66 ➔ 20 Caucasian (Bench)',
      description: 'Quarantined benchmark test case for cross-generational models',
      min: 19,
      max: 26,
      ethnicity: 'Caucasian / White',
      gender: 'woman',
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

  // Interactive Consumer Scenario Trigger
  const handleSelectConsumerScenario = (sc: typeof consumerScenarioPresets[0]) => {
    setActiveScenarioId(sc.id)
    setMinAge(sc.min)
    setMaxAge(sc.max)
    setSelectedGender(sc.gender)
    emitUpdate(
      sc.min,
      sc.max,
      'all',
      sc.gender,
      `Preference Applied: ${sc.title} (Ages ${sc.min}–${sc.max})`
    )
  }

  // Quarantined Research Scenario Trigger
  const handleSelectResearchScenario = (sc: typeof researchScenarioPresets[0]) => {
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
      `Research Fixture Applied: ${sc.title}`
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
  const handleSelectGender = (genId: string) => {
    setSelectedGender(genId)
    setActiveScenarioId(null)
    emitUpdate(minAge, maxAge, selectedEthnicity, genId)
  }

  const handleSelectEthnicity = (ethId: string) => {
    setSelectedEthnicity(ethId)
    setActiveScenarioId(null)
    emitUpdate(minAge, maxAge, ethId, selectedGender)
  }

  // Quarantined Natural Language Input Processor (Research mode only)
  const handleNaturalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!naturalPrompt.trim()) return

    const lower = naturalPrompt.toLowerCase()
    let parsedMin = minAge
    let parsedMax = maxAge
    let parsedEth = selectedEthnicity
    let parsedGen = selectedGender

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

    if (lower.includes('woman') || lower.includes('female')) {
      parsedGen = 'woman'
    } else if (lower.includes('man') || lower.includes('male')) {
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
      `Parsed: "${naturalPrompt}" ➔ Ages ${parsedMin}–${parsedMax}, ${parsedGen}`
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
                Discovery Preferences
              </span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs font-medium text-white">
              <span>Looking for:</span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-white font-mono text-[11px] border border-white/20">
                {selectedGender === 'all' ? 'All Genders' : selectedGender}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-white font-mono text-[11px] border border-white/20">
                {minAge} – {maxAge} y/o
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-neutral-300 font-mono text-[11px] border border-white/15">
                London Area
              </span>
            </div>
          </div>
        </div>

        {/* Right: Drawer Toggle & Optional Research Prompt */}
        <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
          {/* Quarantined Free-Text Input: Only rendered in research mode */}
          {isResearchMode && (
            <form onSubmit={handleNaturalSubmit} className="flex-1 md:w-72 relative">
              <input
                type="text"
                value={naturalPrompt}
                onChange={(e) => setNaturalPrompt(e.target.value)}
                placeholder="Research query parser..."
                className="w-full bg-white/[0.05] hover:bg-white/[0.08] focus:bg-white/[0.1] border border-amber-500/30 rounded-full py-1.5 pl-3.5 pr-8 text-xs text-white placeholder-neutral-500 focus:outline-none"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-amber-400 font-mono">
                LABS
              </span>
            </form>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`apple-pill-btn px-4 py-2 text-xs font-medium flex items-center space-x-1.5 transition-all cursor-pointer ${
              isOpen
                ? 'bg-white text-black font-semibold shadow-md'
                : 'text-neutral-300 hover:text-white bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{isOpen ? 'Close Preferences' : 'Adjust Preferences'}</span>
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

      {/* 2. INTERACTIVE INTENT MATRIX (Desktop Refinement Panel) */}
      {isOpen && (
        <div className="apple-panel rounded-3xl p-6 sm:p-7 space-y-6 border-white/10 shadow-2xl backdrop-blur-2xl animate-in fade-in duration-200">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
            <div>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-neutral-300" />
                <h3 className="text-base font-semibold text-white tracking-tight">
                  Preference Refinement
                </h3>
              </div>
              <p className="text-xs text-neutral-400 font-light mt-0.5">
                Adjust criteria to explore candidates matching your boundaries and horizon.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <div className="text-right">
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
                  Eligible Queue
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

          {/* Section A: Consumer Cohort Presets */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
              Quick Cohort Horizons
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {consumerScenarioPresets.map((sc) => {
                const isSelected = activeScenarioId === sc.id
                return (
                  <div
                    key={sc.id}
                    onClick={() => handleSelectConsumerScenario(sc)}
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
                      <h4 className="text-xs font-semibold text-white tracking-tight">
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

          {/* Quarantined Research Scenarios: Rendered only in Research Mode */}
          {isResearchMode && (
            <div className="p-3.5 rounded-2xl bg-amber-500/[0.05] border border-amber-500/20 space-y-2">
              <div className="flex items-center space-x-2 text-amber-400 text-xs font-semibold">
                <FlaskConical className="w-3.5 h-3.5" />
                <span>Quarantined Research Benchmarks (Labs Only)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {researchScenarioPresets.map((sc) => (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => handleSelectResearchScenario(sc)}
                    className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-amber-500/20 text-left text-xs text-neutral-300 cursor-pointer"
                  >
                    <div className="font-semibold text-white">{sc.title}</div>
                    <div className="text-[11px] text-neutral-400">{sc.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Section B: Sliders & Controls */}
          <div className={`grid grid-cols-1 ${isResearchMode ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-6 pt-2`}>
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

              <div className="space-y-4 pt-1">
                <div>
                  <div className="flex justify-between text-[11px] text-neutral-300 font-medium mb-1.5">
                    <span>Minimum Age: <strong className="text-white font-mono">{minAge}</strong></span>
                    <span className="text-neutral-500 font-mono text-[10px]">Min 18</span>
                  </div>
                  <div className="flex items-center space-x-2.5">
                    <button
                      type="button"
                      onClick={() => handleMinAgeChange(Math.max(18, minAge - 1))}
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 text-white font-bold text-sm flex items-center justify-center shrink-0 cursor-pointer"
                      aria-label="Decrease minimum age"
                    >
                      -
                    </button>
                    <input
                      type="range"
                      min="18"
                      max="80"
                      value={minAge}
                      onChange={(e) => handleMinAgeChange(Number(e.target.value))}
                      className="flex-1 cursor-pointer"
                    />
                    <button
                      type="button"
                      onClick={() => handleMinAgeChange(Math.min(maxAge, minAge + 1))}
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 text-white font-bold text-sm flex items-center justify-center shrink-0 cursor-pointer"
                      aria-label="Increase minimum age"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-neutral-300 font-medium mb-1.5">
                    <span>Maximum Age: <strong className="text-white font-mono">{maxAge}</strong></span>
                    <span className="text-neutral-500 font-mono text-[10px]">Max 80</span>
                  </div>
                  <div className="flex items-center space-x-2.5">
                    <button
                      type="button"
                      onClick={() => handleMaxAgeChange(Math.max(minAge, maxAge - 1))}
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 text-white font-bold text-sm flex items-center justify-center shrink-0 cursor-pointer"
                      aria-label="Decrease maximum age"
                    >
                      -
                    </button>
                    <input
                      type="range"
                      min="18"
                      max="80"
                      value={maxAge}
                      onChange={(e) => handleMaxAgeChange(Number(e.target.value))}
                      className="flex-1 cursor-pointer"
                    />
                    <button
                      type="button"
                      onClick={() => handleMaxAgeChange(Math.min(80, maxAge + 1))}
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 text-white font-bold text-sm flex items-center justify-center shrink-0 cursor-pointer"
                      aria-label="Increase maximum age"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Gender Identified Interactive Selector */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-white flex items-center space-x-1.5">
                  <Users className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Gender Alignment</span>
                </span>
                <span className="text-[10px] font-mono text-neutral-400">Reciprocal</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                {genderOptions.map((g) => {
                  const isAct = selectedGender === g.id
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => handleSelectGender(g.id)}
                      className={`min-h-[44px] p-2 rounded-xl text-xs font-medium text-center transition-all cursor-pointer ${
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

            {/* 3. Quarantined Ethnicity Multi-Option: Rendered only in Research Mode */}
            {isResearchMode && (
              <div className="p-4 rounded-2xl bg-amber-500/[0.03] border border-amber-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-amber-300 flex items-center space-x-1.5">
                    <Layers className="w-3.5 h-3.5 text-amber-400" />
                    <span>Quarantined Background Filter</span>
                  </span>
                  <span className="text-[10px] font-mono text-amber-400">LABS ONLY</span>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {ethnicOptions.map((eth) => {
                    const isAct = selectedEthnicity === eth.id
                    return (
                      <button
                        key={eth.id}
                        type="button"
                        onClick={() => handleSelectEthnicity(eth.id)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
                          isAct
                            ? 'bg-amber-400 text-black font-semibold shadow-sm'
                            : 'bg-white/[0.04] hover:bg-white/[0.08] text-neutral-400 hover:text-white border border-white/[0.06]'
                        }`}
                      >
                        {eth.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
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
              <span>Real-time client-side dynamic matching</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
