// ============================================================================
// src/components/PreferenceOptimizerView.tsx
// Wingman: Explore My Compatibility Frontier & Pareto Optimization Engine
// Treating dating as a constrained, reciprocal, multi-objective optimization problem
// ============================================================================

import React, { useState, useMemo } from 'react'
import {
  RotateCcw,
  Sparkles,
  Layers,
  Scale,
  CheckCircle2,
} from 'lucide-react'
import type { UniversalUserProfile } from '../types'

interface PreferenceOptimizerProps {
  currentUser: UniversalUserProfile
}

// Preset Relaxation Scenarios (Exact specification from mathematical framework)
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
    subtitle: 'Baseline hard constraints',
    matchesCount: 184,
    expectedCompatibility: 88,
    distanceKm: 0,
    dietFlex: 0,
    ageMargin: 0,
    badgeColor: 'border-white/20 text-white bg-white/10',
  },
  {
    id: 'distance',
    title: 'Relax Distance',
    subtitle: '+25 km regional transit envelope',
    matchesCount: 1240,
    expectedCompatibility: 84,
    distanceKm: 25,
    dietFlex: 0,
    ageMargin: 1,
    badgeColor: 'border-purple-500/30 text-purple-300 bg-purple-500/10',
  },
  {
    id: 'diet',
    title: 'Relax Vegetarian Requirement',
    subtitle: 'Flexitarian / Shared values with diet tolerance',
    matchesCount: 2870,
    expectedCompatibility: 82,
    distanceKm: 0,
    dietFlex: 35,
    ageMargin: 0,
    badgeColor: 'border-amber-500/30 text-amber-300 bg-amber-500/10',
  },
  {
    id: 'both',
    title: 'Relax Both (Distance + Diet)',
    subtitle: 'Maximized solution space envelope',
    matchesCount: 6420,
    expectedCompatibility: 76,
    distanceKm: 30,
    dietFlex: 40,
    ageMargin: 2,
    badgeColor: 'border-cyan-500/30 text-cyan-300 bg-cyan-500/10',
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

  // Marketplace constraints state
  const [exposureConcentrationTau, setExposureConcentrationTau] = useState<number>(0.35)
  const [diversityDelta, setDiversityDelta] = useState<number>(0.65)
  const [enforceMutualityHarmonic, setEnforceMutualityHarmonic] = useState<boolean>(true)

  // Apply scenario preset
  const handleApplyScenario = (scenario: FrontierScenario) => {
    setActiveScenarioId(scenario.id)
    setDistanceDelta(scenario.distanceKm)
    setDietFlexDelta(scenario.dietFlex)
    setAgeFlexDelta(scenario.ageMargin)
  }

  // Live dynamic calculations
  const basePool = 184
  const simulatedPool = useMemo(() => {
    const distMultiplier = 1 + (distanceDelta / 20) * 4.2
    const dietMultiplier = 1 + (dietFlexDelta / 30) * 8.5
    const ageMultiplier = 1 + (ageFlexDelta / 2) * 1.8
    const total = Math.round(basePool * distMultiplier * dietMultiplier * ageMultiplier)
    return Math.min(10000, Math.max(184, total))
  }, [distanceDelta, dietFlexDelta, ageFlexDelta])

  const simulatedExpectedCompatibility = useMemo(() => {
    const drop = (distanceDelta * 0.16) + (dietFlexDelta * 0.18) + (ageFlexDelta * 1.5)
    return Math.max(68, Math.round(88 - drop))
  }, [distanceDelta, dietFlexDelta, ageFlexDelta])

  const handleReset = () => {
    setActiveScenarioId('current')
    setDistanceDelta(0)
    setDietFlexDelta(0)
    setAgeFlexDelta(0)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-4 px-2 sm:px-4">

      {/* ======================================================== */}
      {/* 1. HEADER & FORMAL MATHEMATICAL FRAMING                  */}
      {/* ======================================================== */}
      <header className="space-y-3 border-b border-white/[0.08] pb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-mono">
            <Layers className="w-3.5 h-3.5" />
            <span>Multi-Objective Constrained Optimisation · Dynamic Graph</span>
          </div>

          <span className="text-xs font-mono text-neutral-400">
            Model: max_π [Compatibility + Mutuality + Welfare]
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white leading-tight">
          Explore My Compatibility Frontier
        </h1>
        <p className="text-sm sm:text-base text-neutral-400 font-light max-w-3xl leading-relaxed">
          Instead of collapsing human complexity into a single superficial compatibility score, the system treats matching as a multi-objective search problem on a dynamic graph. Explore the solution space, understand non-dominated trade-offs, and inspect your Pareto efficiency frontier.
        </p>
      </header>

      {/* ======================================================== */}
      {/* 2. FEATURE 7: EXPLORE COMPATIBILITY FRONTIER SCENARIOS   */}
      {/* ======================================================== */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="apple-subhead text-emerald-400 font-mono">
              Decision-Support Architecture
            </span>
            <h2 className="text-lg font-semibold text-white tracking-tight">
              Frontier Relaxation Scenarios
            </h2>
          </div>
          <span className="text-xs text-neutral-400 font-mono">
            What happens when you relax one preference?
          </span>
        </div>

        {/* 4 Scenario Cards Grid (Exact data from specification) */}
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
                    <span className="text-neutral-400">Potential matches:</span>
                    <span className="text-white font-bold text-sm">
                      {scenario.matchesCount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline text-xs">
                    <span className="text-neutral-400">Expected compatibility:</span>
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
      {/* 3. INTERACTIVE PARETO TRADEOFF CURVE (XY VISUALIZATION) */}
      {/* ======================================================== */}
      <section className="apple-panel rounded-3xl p-6 sm:p-8 space-y-6 bg-white/[0.02] border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
          <div>
            <span className="apple-subhead text-purple-400 font-mono">
              Non-Dominated Solution Manifold
            </span>
            <h3 className="text-xl font-semibold text-white tracking-tight">
              The Pareto Compatibility Frontier
            </h3>
            <p className="text-xs text-neutral-400 font-light mt-0.5">
              Candidate Pool Size (X-Axis) vs. Expected Mutual Compatibility (Y-Axis)
            </p>
          </div>

          <div className="flex items-center space-x-4 text-xs font-mono">
            <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-right">
              <span className="text-neutral-400 block text-[10px] uppercase">Active Solution Pool</span>
              <strong className="text-white text-base">{simulatedPool.toLocaleString()}</strong> matches
            </div>
            <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-right">
              <span className="text-purple-300 block text-[10px] uppercase">Expected Compatibility</span>
              <strong className="text-purple-300 text-base">{simulatedExpectedCompatibility}%</strong>
            </div>
          </div>
        </div>

        {/* SVG Pareto Curve */}
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
            <text x="50" y="225" fill="#64748b" fontSize="10" fontFamily="monospace">100 matches</text>
            <text x="280" y="225" fill="#64748b" fontSize="10" fontFamily="monospace">2,500 matches</text>
            <text x="490" y="225" fill="#64748b" fontSize="10" fontFamily="monospace">5,000 matches</text>
            <text x="640" y="225" fill="#64748b" fontSize="10" fontFamily="monospace">7,000+</text>

            <text x="42" y="55" fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="end">95%</text>
            <text x="42" y="105" fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="end">85%</text>
            <text x="42" y="155" fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="end">75%</text>

            {/* Pareto Frontier Curve Path: (x, y) coordinates */}
            {/* 184 matches -> y: 65 (88%)
                1240 matches -> y: 92 (84%)
                2870 matches -> y: 110 (82%)
                6420 matches -> y: 155 (76%) */}
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

            {/* Scenario Fixed Dots */}
            {/* Current */}
            <circle cx="70" cy="65" r="4" fill="#ffffff" stroke="#a855f7" strokeWidth="2" />
            <text x="75" y="52" fill="#ffffff" fontSize="9" fontWeight="bold">Current (184 · 88%)</text>

            {/* Relax Distance */}
            <circle cx="210" cy="92" r="4" fill="#c084fc" />
            <text x="215" y="85" fill="#c084fc" fontSize="9">Relax Distance (1,240 · 84%)</text>

            {/* Relax Diet */}
            <circle cx="370" cy="110" r="4" fill="#fbbf24" />
            <text x="375" y="103" fill="#fbbf24" fontSize="9">Relax Diet (2,870 · 82%)</text>

            {/* Relax Both */}
            <circle cx="620" cy="155" r="4" fill="#38bdf8" />
            <text x="560" y="175" fill="#38bdf8" fontSize="9">Relax Both (6,420 · 76%)</text>

            {/* Live Operational Point Marker */}
            {(() => {
              // Normalized x: 184 -> 70, 6420 -> 620
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

        <p className="text-xs text-neutral-400 font-light leading-relaxed">
          The downward-sloping Pareto curve demonstrates the fundamental law of choice geometry: widening requirements rapidly increases network liquidity, with a predictable and measured gradient of compatibility decay.
        </p>
      </section>

      {/* ======================================================== */}
      {/* 4. PARETO DOMINANCE INSPECTOR (CANDIDATE A vs B)        */}
      {/* ======================================================== */}
      <section className="apple-panel rounded-3xl p-6 sm:p-8 space-y-6 bg-white/[0.02] border border-white/10">
        <div>
          <span className="apple-subhead text-amber-400 font-mono">
            Pareto Optimality Principle (Section 3)
          </span>
          <h2 className="text-xl font-semibold text-white tracking-tight">
            Non-Dominated Dyad Comparisons
          </h2>
          <p className="text-xs text-neutral-400 font-light mt-0.5">
            Why collapsing multidimensional compatibility into a single scalar destroys crucial information
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Candidate A Card */}
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-purple-500/30 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-purple-300 font-bold block">
                  Pareto-Optimal Candidate A
                </span>
                <h4 className="text-base font-semibold text-white">Maya Lin (Profile A)</h4>
              </div>
              <span className="px-2.5 py-1 rounded bg-purple-500/20 text-purple-300 font-mono text-xs font-bold">
                Non-Dominated
              </span>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="space-y-1">
                <div className="flex justify-between text-neutral-300">
                  <span>Values (C_V)</span>
                  <span className="text-white font-bold">95</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full" style={{ width: '95%' }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-neutral-300">
                  <span>Distance / Geography (C_G)</span>
                  <span className="text-white font-bold">90</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full" style={{ width: '90%' }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-neutral-300">
                  <span>Attraction (C_A)</span>
                  <span className="text-white font-bold">80</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full" style={{ width: '80%' }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-neutral-300">
                  <span>Lifestyle (C_L)</span>
                  <span className="text-white font-bold">72</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full" style={{ width: '72%' }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-neutral-300">
                  <span>Family (C_F)</span>
                  <span className="text-white font-bold">60</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full" style={{ width: '60%' }} />
                </div>
              </div>
            </div>

            <p className="text-[11px] text-neutral-400 font-light pt-2 border-t border-white/[0.04]">
              Excels in shared philosophical values and urban proximity; lower on shared family timeline.
            </p>
          </div>

          {/* Candidate B Card */}
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-cyan-500/30 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-300 font-bold block">
                  Pareto-Optimal Candidate B
                </span>
                <h4 className="text-base font-semibold text-white">Julian Vance (Profile B)</h4>
              </div>
              <span className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold">
                Non-Dominated
              </span>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="space-y-1">
                <div className="flex justify-between text-neutral-300">
                  <span>Lifestyle (C_L)</span>
                  <span className="text-white font-bold">90</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-cyan-500 h-full rounded-full" style={{ width: '90%' }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-neutral-300">
                  <span>Family (C_F)</span>
                  <span className="text-white font-bold">90</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-cyan-500 h-full rounded-full" style={{ width: '90%' }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-neutral-300">
                  <span>Attraction (C_A)</span>
                  <span className="text-white font-bold">85</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-cyan-500 h-full rounded-full" style={{ width: '85%' }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-neutral-300">
                  <span>Values (C_V)</span>
                  <span className="text-white font-bold">82</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-cyan-500 h-full rounded-full" style={{ width: '82%' }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-neutral-300">
                  <span>Distance / Geography (C_G)</span>
                  <span className="text-white font-bold">50</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-cyan-500 h-full rounded-full" style={{ width: '50%' }} />
                </div>
              </div>
            </div>

            <p className="text-[11px] text-neutral-400 font-light pt-2 border-t border-white/[0.04]">
              Excels in daily rhythm and family cohabitation; resides further across the metropolitan zone.
            </p>
          </div>
        </div>

        {/* Mathematical Proof Alert */}
        <div className="p-4 rounded-2xl bg-amber-500/[0.06] border border-amber-500/20 text-xs text-neutral-300 space-y-1.5 leading-relaxed font-light">
          <div className="flex items-center space-x-2 text-amber-300 font-semibold font-mono text-xs">
            <Scale className="w-4 h-4" />
            <span>Mathematical Proof of Non-Domination</span>
          </div>
          <p>
            Candidate A does not dominate Candidate B (C_A ≱ C_B), because Candidate B scores higher on Lifestyle (90 vs 72) and Family (90 vs 60). Conversely, Candidate B does not dominate Candidate A, because Candidate A scores higher on Values (95 vs 82) and Distance (90 vs 50).
          </p>
          <p className="font-mono text-amber-200">
            <strong>Conclusion:</strong> Both candidates belong to your Pareto frontier (P*). Preserving both prevents arbitrary metric flattening and respects individual agency.
          </p>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. CONTINUOUS TOLERANCE SLIDERS & FINE TUNING           */}
      {/* ======================================================== */}
      <section className="apple-panel rounded-3xl p-6 sm:p-7 space-y-6 bg-white/[0.02] border border-white/10">
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
          <div>
            <h2 className="text-xs font-semibold text-white uppercase tracking-wider">
              Continuous Solution Space Sliders
            </h2>
            <p className="text-xs text-neutral-400 font-light">
              Fine-tune your personal constraints to see the immediate expansion of reachable dyads
            </p>
          </div>
          <button
            onClick={handleReset}
            className="apple-pill-btn px-3 py-1.5 text-xs text-neutral-400 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] flex items-center space-x-1.5"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset to Strict</span>
          </button>
        </div>

        {/* 1. Distance Radius */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-neutral-300 font-medium">Search Radius (C_G Relaxation)</span>
            <span className="font-mono text-purple-300 font-bold">+{distanceDelta} km</span>
          </div>
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
            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          <div className="flex justify-between text-[11px] text-neutral-500 font-mono">
            <span>Base: {currentUser.geography.maxDistanceKm} km</span>
            <span>Simulated: {currentUser.geography.maxDistanceKm + distanceDelta} km</span>
          </div>
        </div>

        {/* 2. Dietary Practice Tolerance */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-neutral-300 font-medium">Dietary Practice Flexibility (C_L Relaxation)</span>
            <span className="font-mono text-amber-300 font-bold">+{dietFlexDelta}%</span>
          </div>
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
            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <div className="flex justify-between text-[11px] text-neutral-500 font-mono">
            <span>Strict Vegetarian (0%)</span>
            <span>Flexitarian / Kitchen Respect Allowed (50%)</span>
          </div>
        </div>

        {/* 3. Age Tolerance Margin */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-neutral-300 font-medium">Age Tolerance Margin</span>
            <span className="font-mono text-cyan-300 font-bold">±{ageFlexDelta} yrs</span>
          </div>
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
            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
          <div className="flex justify-between text-[11px] text-neutral-500 font-mono">
            <span>Base: [{currentUser.preferences.minAge}–{currentUser.preferences.maxAge}]</span>
            <span>Simulated: [{currentUser.preferences.minAge - ageFlexDelta}–{currentUser.preferences.maxAge + ageFlexDelta}]</span>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. MARKETPLACE LEVEL REGULARIZATION (SECTION 5)          */}
      {/* ======================================================== */}
      <section className="apple-panel rounded-3xl p-6 sm:p-8 space-y-6 bg-white/[0.02] border border-white/10">
        <div>
          <span className="apple-subhead text-sky-400 font-mono">
            Marketplace Equilibrium & Anti-Concentration (Section 5)
          </span>
          <h2 className="text-xl font-semibold text-white tracking-tight">
            Macro-Marketplace Regularization
          </h2>
          <p className="text-xs text-neutral-400 font-light mt-0.5">
            Preventing superstar attention concentration where 2% of candidates monopolize 80% of exposure
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Exposure Gini Cap tau */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-neutral-300 font-medium">Exposure Gini Cap (τ)</span>
              <span className="font-mono text-purple-300 text-xs font-bold">{exposureConcentrationTau}</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="0.6"
              step="0.05"
              value={exposureConcentrationTau}
              onChange={(e) => setExposureConcentrationTau(parseFloat(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <p className="text-[11px] text-neutral-400 font-light">
              Limits superstar profile hoarding, distributing mutual discovery uniformly across healthy cohorts.
            </p>
          </div>

          {/* Candidate Diversity delta */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-neutral-300 font-medium">Diversity Floor (δ)</span>
              <span className="font-mono text-emerald-300 text-xs font-bold">{diversityDelta}</span>
            </div>
            <input
              type="range"
              min="0.4"
              max="0.9"
              step="0.05"
              value={diversityDelta}
              onChange={(e) => setDiversityDelta(parseFloat(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <p className="text-[11px] text-neutral-400 font-light">
              Guarantees background diversity in discovery feeds, breaking algorithmic echo chambers.
            </p>
          </div>

          {/* Harmonic Mutuality Toggle */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-neutral-300 font-medium">Reciprocal Mutuality</span>
                <input
                  type="checkbox"
                  checked={enforceMutualityHarmonic}
                  onChange={(e) => setEnforceMutualityHarmonic(e.target.checked)}
                  className="rounded bg-slate-800 text-purple-600 focus:ring-0"
                />
              </div>
              <p className="text-[11px] text-neutral-400 font-light mt-1">
                Enforces harmonic mean M_ij = (2 · S_ij · S_ji) / (S_ij + S_ji), ensuring high mutual desire.
              </p>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 uppercase font-semibold">
              {enforceMutualityHarmonic ? 'Active (Zero Asymmetric Waste)' : 'Unconstrained'}
            </span>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 7. THE COMPLETE 8-STAGE MATHEMATICAL PIPELINE (SECTION 8) */}
      {/* ======================================================== */}
      <section className="apple-panel rounded-3xl p-6 sm:p-8 space-y-6 bg-white/[0.02] border border-white/10">
        <div>
          <span className="apple-subhead text-fuchsia-400 font-mono">
            Full Pipeline Architecture (Section 8)
          </span>
          <h2 className="text-xl font-semibold text-white tracking-tight">
            The Algorithmic Pipeline
          </h2>
          <p className="text-xs text-neutral-400 font-light mt-0.5">
            How scarce human attention is allocated among millions of reciprocal dyads without AI guesswork
          </p>
        </div>

        {/* 6 Stage Process Pipeline Horizontal Flow */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-1">
            <span className="text-[10px] text-red-400 font-bold block">1. Constraints</span>
            <span className="text-white font-medium">Feasibility g_k ≤ 0</span>
            <p className="text-[10px] text-neutral-400 font-sans">Removes dealbreaker conflicts (E_ij = 0).</p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-1">
            <span className="text-[10px] text-purple-400 font-bold block">2. Vector</span>
            <span className="text-white font-medium">Vector C_ij</span>
            <p className="text-[10px] text-neutral-400 font-sans">Multi-objective breakdown across 9 facets.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-1">
            <span className="text-[10px] text-sky-400 font-bold block">3. Mutuality</span>
            <span className="text-white font-medium">M_ij = f(S_ij, S_ji)</span>
            <p className="text-[10px] text-neutral-400 font-sans">Harmonic reciprocity balances desire.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-1">
            <span className="text-[10px] text-amber-400 font-bold block">4. Frontier</span>
            <span className="text-white font-medium">Pareto Set P*</span>
            <p className="text-[10px] text-neutral-400 font-sans">Preserves non-dominated variety.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-1">
            <span className="text-[10px] text-emerald-400 font-bold block">5. Market</span>
            <span className="text-white font-medium">Gini Cap τ ≤ 0.35</span>
            <p className="text-[10px] text-neutral-400 font-sans">Prevents attention monopolies.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-1">
            <span className="text-[10px] text-fuchsia-400 font-bold block">6. Learning</span>
            <span className="text-white font-medium">Causal Dyads</span>
            <p className="text-[10px] text-neutral-400 font-sans">Learns from real post-encounter outcomes.</p>
          </div>
        </div>

        {/* Formal Grand Problem Box */}
        <div className="p-5 rounded-2xl bg-black/40 border border-purple-500/30 space-y-2 font-mono text-xs">
          <div className="flex items-center space-x-2 text-purple-300 font-bold">
            <Sparkles className="w-4 h-4" />
            <span>The Platform Matching Policy Objective Function</span>
          </div>
          <div className="text-sm text-white pt-1">
            {'max_π [ Compatibility_ij + Mutuality_ij + Outcome_ij + User Welfare ]'}
          </div>
          <div className="text-neutral-400 text-xs">
            {'subject to [ Hard Constraints g_k ≤ 0 + Safety + Privacy + Fairness (τ ≤ 0.35) + Diversity (δ ≥ 0.65) ]'}
          </div>
        </div>
      </section>

    </div>
  )
}

export default PreferenceOptimizerView
