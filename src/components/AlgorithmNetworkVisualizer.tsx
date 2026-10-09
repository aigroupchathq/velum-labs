// ============================================================================
// src/components/AlgorithmNetworkVisualizer.tsx
// Wingman: Constellation & Encounter Odds Visualizer
// Physics-Grade 5-Facet Gravitational Pull & 30-Day Spacetime Encounter Manifold
// Enhanced with Onlook Studio Architecture:
// - 3-Zone Studio Workspace (Facet Hierarchy, Gravitational Canvas, Telemetry Dossier)
// - Floating Canvas HUD Dock with Spacetime Scrubber, Pole Focus, & Orbit Modes
// - Deep Zinc-950 Tokens, Micro-Borders, and Monospace Telemetry Badges
//
// References:
// - Spatiotemporal Poisson Point Processes for Urban Mobility (Brockmann / Gonzalez et al.)
// - Barycentric Potential Wells & Metric Multidimensional Scaling (MDS)
// - Kuramoto Circadian Phase Synchronization & Gottman Dyadic Differential Equations
// - Optimal Stopping 37% & Aron's Self-Expansion Model
// ============================================================================

import React, { useState, useMemo, useEffect } from 'react'
import {
  Compass,
  Sparkles,
  MapPin,
  ShieldCheck,
  Brain,
  TrendingUp,
  Flame,
  X,
  FileText,
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2,
  PanelLeft,
  PanelRight,
  Search,
  SlidersHorizontal,
  Layers,
  Activity,
  Filter,
  ChevronRight,
  Focus,
} from 'lucide-react'
import type { UniversalUserProfile, MatchEvaluation } from '../types'
import { evaluateMatch } from '../utils/matchingEngine'
import { mockCandidates } from '../data/mockProfiles'
import { sounds } from '../utils/sound'

// ==========================================
// 1. DATA TYPES & 5 CORE GRAVITATIONAL FACETS
// ==========================================

export type FacetKey = 'crossing' | 'rhythm' | 'values' | 'interests' | 'mutual'

export interface FacetDefinition {
  key: FacetKey
  label: string
  shortSymbol: string
  colorHex: string
  badgeBg: string
  badgeText: string
  angleRad: number // Barycentric pole angle on unit circle
  scientificName: string
  appliedTheory: string
  description: string
}

const FACETS: Record<FacetKey, FacetDefinition> = {
  crossing: {
    key: 'crossing',
    label: 'Paths crossing',
    shortSymbol: 'λ_transit',
    colorHex: '#c084fc', // Vibrant purple
    badgeBg: 'bg-purple-500/20',
    badgeText: 'text-purple-300',
    angleRad: -Math.PI / 2, // 12 o'clock (top)
    scientificName: 'Spacetime Poisson Transit Intensity',
    appliedTheory: 'Urban Mobility Overlap & Continuous Poisson Process',
    description: 'Physical & transit route overlap across London transport and hubs',
  },
  rhythm: {
    key: 'rhythm',
    label: 'Daily rhythm',
    shortSymbol: 'ω_circadian',
    colorHex: '#34d399', // Emerald green
    badgeBg: 'bg-emerald-500/20',
    badgeText: 'text-emerald-300',
    angleRad: -Math.PI * 0.1, // ~2 o'clock
    scientificName: 'Kuramoto Phase Synchronization',
    appliedTheory: 'Sleep Chronotype & Peak Energy Phase Coherence',
    description: 'Sleep chronotype, peak active hours, weekend downtime synchronization',
  },
  values: {
    key: 'values',
    label: 'Shared values',
    shortSymbol: 'H_gottman',
    colorHex: '#fb7185', // Rose / coral
    badgeBg: 'bg-rose-500/20',
    badgeText: 'text-rose-300',
    angleRad: Math.PI * 0.35, // ~4:30 o'clock
    scientificName: 'Gottman Stability Invariant',
    appliedTheory: '5:1 Positivity Ratio & Low Negativity Threshold',
    description: 'Gottman 5:1 ratio, attachment safety, long-term life trajectory alignment',
  },
  interests: {
    key: 'interests',
    label: 'Interests',
    shortSymbol: 'E_aron',
    colorHex: '#fbbf24', // Amber
    badgeBg: 'bg-amber-500/20',
    badgeText: 'text-amber-300',
    angleRad: Math.PI * 0.82, // ~7:30 o'clock
    scientificName: 'Aron Self-Expansion Tensor',
    appliedTheory: 'Cognitive Horizon Growth & Mutual Novelty',
    description: 'Aron self-expansion topics: books, arts, architecture, passions',
  },
  mutual: {
    key: 'mutual',
    label: 'Mutual Interest',
    shortSymbol: 'S_reciprocal',
    colorHex: '#38bdf8', // Sky cyan
    badgeBg: 'bg-sky-500/20',
    badgeText: 'text-sky-300',
    angleRad: -Math.PI * 0.9, // ~10 o'clock
    scientificName: 'Leary Sociometer & Harmonic Mutuality',
    appliedTheory: 'Reciprocal Attraction & Low Rejection Latency',
    description: 'Sociometer reciprocity, low rejection latency, warm conversational tempo',
  },
}

export interface NearMissLog {
  time: string
  description: string
  venue: string
}

export interface CandidateNetworkItem {
  profile: UniversalUserProfile
  evaluation: MatchEvaluation
  pairTitle: string
  jobTitle: string
  scores: Record<FacetKey, number> // 0 to 100
  oddsBase: number // 30-day encounter probability % (e.g. 45)
  oddsRange: [number, number] // [34, 54] 95% Credible Interval
  nearMisses: NearMissLog[]
  poissonIntensity: number // lambda per day
  circadianPhaseGapHours: number
  psychology: {
    attachment: 'Secure' | 'Earned Secure' | 'Growth Anxious'
    selfExpansionScore: number
    gottmanRatio: string
    lowNegativityThreshold: string
    decisionPhase: string
  }
}

interface AlgorithmNetworkVisualizerProps {
  currentUser: UniversalUserProfile
  onSelectCandidate?: (candidate: UniversalUserProfile, evaluation: MatchEvaluation) => void
}

// Preset configurations for facet weights
const FACET_PRESETS: { name: string; description: string; weights: Record<FacetKey, number> }[] = [
  {
    name: 'Balanced Field',
    description: 'Equal 20% distribution across all 5 dimensions',
    weights: { crossing: 20, rhythm: 20, values: 20, interests: 20, mutual: 20 },
  },
  {
    name: 'Transit & Routine',
    description: 'Prioritise serendipitous physical and temporal intersection',
    weights: { crossing: 45, rhythm: 25, values: 15, interests: 5, mutual: 10 },
  },
  {
    name: 'Gottman Sanctuary',
    description: 'Deep core values and reciprocal conflict resilience',
    weights: { values: 45, mutual: 25, rhythm: 15, crossing: 10, interests: 5 },
  },
  {
    name: 'Aron Self-Expansion',
    description: 'Novelty, passions, and reciprocal psychological expansion',
    weights: { interests: 40, values: 25, rhythm: 15, mutual: 10, crossing: 10 },
  },
]

// ==========================================
// 2. MAIN COMPONENT IMPLEMENTATION
// ==========================================

export const AlgorithmNetworkVisualizer: React.FC<AlgorithmNetworkVisualizerProps> = ({
  currentUser,
  onSelectCandidate,
}) => {
  // Mode toggle: 'Best fit' vs 'Fit + odds' vs 'Field physics'
  const [viewMode, setViewMode] = useState<'best_fit' | 'fit_odds' | 'field_physics'>('fit_odds')

  // Interactive slider weights (summing to ~100)
  const [weights, setWeights] = useState<Record<FacetKey, number>>({
    crossing: 30,
    rhythm: 20,
    values: 25,
    interests: 10,
    mutual: 15,
  })

  // Location signals toggle
  const [locationSignals, setLocationSignals] = useState<boolean>(true)

  // 30-day Spacetime timeline scrubber (Day 1 to 30)
  const [timelineDay, setTimelineDay] = useState<number>(30)
  const [isPlayingTimeline, setIsPlayingTimeline] = useState<boolean>(false)

  // Selected candidate state
  const [selectedId, setSelectedId] = useState<string>(mockCandidates[0]?.id || 'usr_maya_01')
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  // Sorting state for the ranking table
  const [sortCriteria, setSortCriteria] = useState<'fit' | 'odds' | 'name'>('fit')

  // Modals
  const [showPsychologyModal, setShowPsychologyModal] = useState<boolean>(false)
  const [suggestMeetingModal, setSuggestMeetingModal] = useState<boolean>(false)

  // ----------------------------------------------------
  // ONLOOK STUDIO WORKSPACE STATE
  // ----------------------------------------------------
  const [leftPanelOpen, setLeftPanelOpen] = useState<boolean>(true)
  const [rightPanelOpen, setRightPanelOpen] = useState<boolean>(true)
  const [zenMode, setZenMode] = useState<boolean>(false)
  const [activeAttractorFocus, setActiveAttractorFocus] = useState<'all' | FacetKey>('all')
  const [interactionMode, setInteractionMode] = useState<'select' | 'field'>('select')
  const [searchFilter, setSearchFilter] = useState<string>('')

  // Timeline playback loop
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>
    if (isPlayingTimeline) {
      timer = setInterval(() => {
        setTimelineDay(prev => {
          if (prev >= 30) return 1
          return prev + 1
        })
      }, 250)
    }
    return () => clearInterval(timer)
  }, [isPlayingTimeline])

  // Pre-calculate candidate items with deep engine metrics + realistic London transit spacetime logs
  const candidateItems = useMemo<CandidateNetworkItem[]>(() => {
    const defaultNearMisses: Record<string, NearMissLog[]> = {
      usr_maya_01: [
        { time: 'Tue 08:12', description: '40 m apart, same platform', venue: 'Waterloo station' },
        { time: 'Sat 11:20', description: 'Both in the queue', venue: 'Borough Market' },
        { time: 'Thu 18:45', description: 'Adjacent carriage northbound', venue: 'Northern line' },
      ],
      usr_liam_02: [
        { time: 'Mon 09:05', description: 'Opposite platform', venue: 'Liverpool Street' },
        { time: 'Fri 19:20', description: 'Attending same gallery opening', venue: 'Whitechapel Gallery' },
      ],
      usr_priya_03: [
        { time: 'Wed 13:10', description: 'Reading 2 tables away', venue: 'Wellcome Collection Café' },
        { time: 'Sun 16:30', description: 'Crossed paths at pedestrian crossing', venue: 'Russell Square' },
      ],
      usr_marcus_04: [
        { time: 'Thu 12:40', description: 'Same bakery checkout counter', venue: 'E5 Bakehouse' },
      ],
      usr_sofia_05: [
        { time: 'Fri 18:15', description: 'Both waiting outside canal steps', venue: 'Granary Square' },
      ],
      usr_chloe_06: [
        { time: 'Sun 14:00', description: 'Passed by conservatory terrace', venue: 'Barbican Centre' },
      ],
    }

    return mockCandidates.map((cand, idx) => {
      const evaluation = evaluateMatch(currentUser, cand)

      const overall = evaluation.mutuality.score != null ? Math.round(evaluation.mutuality.score * 100) : 75
      const valuesScore = evaluation.valueAlignment?.score != null ? Math.round(evaluation.valueAlignment.score * 100) : 80
      const rhythmScore = evaluation.temporalFeasibility?.score != null ? Math.round(evaluation.temporalFeasibility.score * 100) : 75
      const interestsScore = evaluation.lifestyleAlignment?.score != null ? Math.round(evaluation.lifestyleAlignment.score * 100) : 70
      const mutualScore = evaluation.communicationAlignment?.score != null ? Math.round(evaluation.communicationAlignment.score * 100) : 78
      const geoScore = evaluation.geographicFeasibility?.score != null ? Math.round(evaluation.geographicFeasibility.score * 100) : 85

      // Transit / Paths crossing derived from distance + geography
      const crossingScore = Math.max(35, Math.min(98, Math.round(geoScore * 0.9 + (12 - idx * 2))))

      // 30-Day Poisson base odds P(30d)
      const oddsBase = Math.round(Math.max(12, Math.min(55, crossingScore * 0.48 + (10 - idx * 2))))
      const oddsRange: [number, number] = [
        Math.max(8, oddsBase - 11),
        Math.min(65, oddsBase + 9),
      ]

      // Poisson encounter rate parameter lambda per day: P(30) = 1 - exp(-lambda * 30) => lambda = -ln(1 - P)/30
      const probDecimal = Math.min(0.85, oddsBase / 100)
      const poissonIntensity = -Math.log(1 - probDecimal) / 30

      // Circadian phase difference (hours)
      const circadianPhaseGapHours = parseFloat(((idx * 0.6 + 0.3) % 2.5).toFixed(1))

      const currentUserName = currentUser.identity.name.split(' ')[0]
      const candFirstName = cand.identity.name.split(' ')[0]

      const candNearMisses = defaultNearMisses[cand.id] || [
        { time: 'Sat 15:30', description: 'In the same bookstore aisle', venue: 'Foyles Charing Cross' },
        { time: 'Tue 18:00', description: 'Exiting same underground gate', venue: 'Tottenham Court Road' },
      ]

      return {
        profile: cand,
        evaluation,
        pairTitle: `${currentUserName} and ${candFirstName}`,
        jobTitle: cand.identity.bio.slice(0, 48) + '...',
        scores: {
          crossing: crossingScore,
          rhythm: rhythmScore,
          values: valuesScore,
          interests: interestsScore,
          mutual: mutualScore,
        },
        oddsBase,
        oddsRange,
        nearMisses: candNearMisses,
        poissonIntensity,
        circadianPhaseGapHours,
        psychology: {
          attachment: idx === 0 ? 'Secure' : idx % 2 === 0 ? 'Earned Secure' : 'Growth Anxious',
          selfExpansionScore: Math.min(96, Math.max(62, Math.round(overall * 0.95))),
          gottmanRatio: idx === 0 ? '6.4 : 1' : `${(4.8 + (overall / 100) * 1.5).toFixed(1)} : 1`,
          lowNegativityThreshold:
            idx === 0
              ? 'Calm, rapid micro-repair within 15 mins'
              : 'Direct communication, cognitive reappraisal active',
          decisionPhase:
            overall >= 75
              ? 'Phase 3: High Self-Expansion Commitment Candidate'
              : 'Phase 2: Calibrated Exploratory Stage',
        },
      }
    })
  }, [currentUser])

  // Handle priority slider change
  const handleSliderChange = (key: FacetKey, newValue: number) => {
    setWeights(prev => ({ ...prev, [key]: newValue }))
  }

  const totalWeight = useMemo(() => {
    return Object.values(weights).reduce((a, b) => a + b, 0)
  }, [weights])

  // Compute dynamic fit scores for all candidates based on sliders
  const scoredCandidates = useMemo(() => {
    const safeTotalWeight = totalWeight > 0 ? totalWeight : 1
    return candidateItems.map(item => {
      let weightedSum = 0
      ;(Object.keys(weights) as FacetKey[]).forEach(k => {
        weightedSum += item.scores[k] * weights[k]
      })
      const fitScore = Math.round(weightedSum / safeTotalWeight)

      // Time-evolved Poisson probability for timelineDay t: P(t) = 1 - exp(-lambda * t)
      const timeProb = 1 - Math.exp(-item.poissonIntensity * timelineDay)
      const currentDayOdds = Math.round(timeProb * 100)

      // Modify odds if location signals are disabled
      const effectiveOdds = locationSignals ? currentDayOdds : 0
      const effectiveRange: [number, number] = locationSignals
        ? [
            Math.round(item.oddsRange[0] * (timelineDay / 30)),
            Math.round(item.oddsRange[1] * (timelineDay / 30)),
          ]
        : [0, 0]

      return {
        ...item,
        fitScore,
        effectiveOdds,
        effectiveRange,
      }
    })
  }, [candidateItems, weights, totalWeight, locationSignals, timelineDay])

  // Selected candidate object
  const selectedCandidate = useMemo(() => {
    return scoredCandidates.find(c => c.profile.id === selectedId) || scoredCandidates[0]
  }, [scoredCandidates, selectedId])

  // Pool averages to calculate point differentials
  const poolAverages = useMemo(() => {
    const avgs: Record<FacetKey, number> = {
      crossing: 0,
      rhythm: 0,
      values: 0,
      interests: 0,
      mutual: 0,
    }
    const count = scoredCandidates.length || 1
    scoredCandidates.forEach(c => {
      ;(Object.keys(avgs) as FacetKey[]).forEach(k => {
        avgs[k] += c.scores[k]
      })
    })
    ;(Object.keys(avgs) as FacetKey[]).forEach(k => {
      avgs[k] = avgs[k] / count
    })
    return avgs
  }, [scoredCandidates])

  // Differentials for the selected match (e.g. +9.8, -0.3)
  const differentials = useMemo(() => {
    const diffs: Record<FacetKey, number> = {
      crossing: 0,
      rhythm: 0,
      values: 0,
      interests: 0,
      mutual: 0,
    }
    if (!selectedCandidate) return diffs
    ;(Object.keys(diffs) as FacetKey[]).forEach(k => {
      const delta = (selectedCandidate.scores[k] - poolAverages[k]) / 2.5
      diffs[k] = Math.round(delta * 10) / 10
    })
    return diffs
  }, [selectedCandidate, poolAverages])

  // Identify strongest edge & biggest drag
  const { strongestEdge, biggestDrag } = useMemo(() => {
    let maxK: FacetKey = 'crossing'
    let minK: FacetKey = 'interests'
    let maxVal = -Infinity
    let minVal = Infinity

    ;(Object.keys(differentials) as FacetKey[]).forEach(k => {
      if (differentials[k] > maxVal) {
        maxVal = differentials[k]
        maxK = k
      }
      if (differentials[k] < minVal) {
        minVal = differentials[k]
        minK = k
      }
    })

    return {
      strongestEdge: FACETS[maxK].label,
      biggestDrag: FACETS[minK].label,
    }
  }, [differentials])

  // Filtered & Sorted list for candidate tree and ranking table
  const filteredCandidates = useMemo(() => {
    if (!searchFilter.trim()) return scoredCandidates
    const q = searchFilter.toLowerCase()
    return scoredCandidates.filter(
      c =>
        c.profile.identity.name.toLowerCase().includes(q) ||
        c.profile.geography.cityName.toLowerCase().includes(q) ||
        c.jobTitle.toLowerCase().includes(q)
    )
  }, [scoredCandidates, searchFilter])

  const sortedRanking = useMemo(() => {
    const list = [...filteredCandidates]
    if (sortCriteria === 'fit') {
      list.sort((a, b) => b.fitScore - a.fitScore)
    } else if (sortCriteria === 'odds') {
      list.sort((a, b) => b.effectiveOdds - a.effectiveOdds)
    } else {
      list.sort((a, b) => a.profile.identity.name.localeCompare(b.profile.identity.name))
    }
    return list
  }, [filteredCandidates, sortCriteria])

  // ========================================================
  // 3. BARYCENTRIC GRAVITATIONAL MANIFOLD & RADAR MATH
  // ========================================================
  const radarCenter = 240
  const radarMaxRadius = 180

  // Calculate Cartesian (x, y) coordinates for each candidate node
  const candidateCoordinates = useMemo(() => {
    return scoredCandidates.map(c => {
      // 1. Radial Distance: Ground-state Keplerian potential (Higher fit = tighter inner orbit)
      const normalizedDist = Math.max(0.12, Math.min(1, (100 - c.fitScore) / 52))
      const radius = 34 + normalizedDist * (radarMaxRadius - 42)

      // 2. Barycentric Gravitational Vector Pull: Net force from the 5 poles
      let pullX = 0
      let pullY = 0
      const facetPullStrengths: Record<FacetKey, number> = {} as any

      ;(Object.keys(FACETS) as FacetKey[]).forEach(k => {
        const facet = FACETS[k]
        const poleWeight = weights[k] / (totalWeight || 1)
        const strength = (c.scores[k] / 100) * poleWeight
        facetPullStrengths[k] = strength
        pullX += strength * Math.cos(facet.angleRad)
        pullY += strength * Math.sin(facet.angleRad)
      })

      const dominantAngle = Math.atan2(pullY, pullX)

      // 3. Spacetime Encounter Wave Radius: Proportional to Poisson probability P(t)
      const dotRadius =
        locationSignals && viewMode !== 'best_fit'
          ? Math.max(6, (c.effectiveOdds / 55) * 16)
          : 8

      // 4. Strongest pulling facet for node color & telemetry
      let topFacet: FacetKey = 'crossing'
      let topScore = -1
      ;(Object.keys(FACETS) as FacetKey[]).forEach(k => {
        if (c.scores[k] > topScore) {
          topScore = c.scores[k]
          topFacet = k
        }
      })

      // 5. Polar coordinates & effective gravitational potential U
      const polarR = Math.round(radius)
      const polarThetaDeg = Math.round(((dominantAngle * 180) / Math.PI + 360) % 360)
      const potentialEnergyU = parseFloat((-((c.fitScore / 100) * 5)).toFixed(2))

      return {
        ...c,
        cx: radarCenter + radius * Math.cos(dominantAngle),
        cy: radarCenter + radius * Math.sin(dominantAngle),
        radius,
        dominantAngle,
        polarR,
        polarThetaDeg,
        potentialEnergyU,
        facetPullStrengths,
        dotRadius,
        accentColor: FACETS[topFacet].colorHex,
        dominantFacetLabel: FACETS[topFacet].label,
        dominantFacetKey: topFacet,
      }
    })
  }, [scoredCandidates, weights, totalWeight, locationSignals, viewMode])

  // Selected candidate coordinates
  const selectedCoordinates = useMemo(() => {
    return candidateCoordinates.find(c => c.profile.id === selectedId) || candidateCoordinates[0]
  }, [candidateCoordinates, selectedId])

  // Tactile handlers
  const handleSelectCandidate = (id: string) => {
    sounds.playTap()
    setSelectedId(id)
  }

  const togglePlayback = () => {
    sounds.playTap()
    setIsPlayingTimeline(!isPlayingTimeline)
  }

  const resetViewport = () => {
    sounds.playTap()
    setTimelineDay(30)
    setIsPlayingTimeline(false)
    setActiveAttractorFocus('all')
  }

  const applyPreset = (presetWeights: Record<FacetKey, number>) => {
    sounds.playTap()
    setWeights(presetWeights)
  }

  const toggleZenMode = () => {
    sounds.playTap()
    if (!zenMode) {
      setLeftPanelOpen(false)
      setRightPanelOpen(false)
      setZenMode(true)
    } else {
      setLeftPanelOpen(true)
      setRightPanelOpen(true)
      setZenMode(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-purple-500/30 selection:text-white">
      {/* ---------------------------------------------------- */}
      {/* 1. ONLOOK-GRADE STUDIO TOP BAR                        */}
      {/* ---------------------------------------------------- */}
      <header className="sticky top-0 z-40 bg-[#09090b]/90 border-b border-white/[0.08] backdrop-blur-xl px-4 md:px-6 py-2.5 transition-all">
        <div className="max-w-[1720px] mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left: Studio Identity & Telemetry Monospace Breadcrumb */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold tracking-widest uppercase bg-zinc-900 text-zinc-300 rounded border border-white/10">
                STUDIO // MANIFOLD v2.4
              </span>
            </div>
            <div className="hidden lg:flex items-center space-x-2 text-[11px] font-mono text-zinc-400">
              <span className="text-zinc-600">/</span>
              <span>POISSON λ = {selectedCoordinates?.poissonIntensity.toFixed(3) || '0.041'}/d</span>
              <span className="text-zinc-600">·</span>
              <span className="text-purple-400 font-semibold">GOTTMAN RATIO: {selectedCandidate.psychology.gottmanRatio}</span>
            </div>
          </div>

          {/* Center: View Mode Segmented Pill */}
          <div className="inline-flex p-0.5 bg-zinc-900/90 rounded-full border border-white/10 text-xs font-medium">
            <button
              onClick={() => {
                sounds.playTap()
                setViewMode('best_fit')
              }}
              className={`px-3 py-1 rounded-full transition-all ${
                viewMode === 'best_fit'
                  ? 'bg-zinc-800 text-white shadow-sm font-semibold border border-white/10'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Best fit
            </button>
            <button
              onClick={() => {
                sounds.playTap()
                setViewMode('fit_odds')
              }}
              className={`px-3 py-1 rounded-full transition-all ${
                viewMode === 'fit_odds'
                  ? 'bg-purple-600 text-white shadow-sm font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Fit + odds
            </button>
            <button
              onClick={() => {
                sounds.playTap()
                setViewMode('field_physics')
              }}
              className={`px-3 py-1 rounded-full transition-all ${
                viewMode === 'field_physics'
                  ? 'bg-sky-600 text-white shadow-sm font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Field physics
            </button>
          </div>

          {/* Right: Studio Panel Visibility Toggles & Love Architecture Action */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                sounds.playTap()
                setLeftPanelOpen(!leftPanelOpen)
              }}
              title={leftPanelOpen ? 'Collapse Facet Tree' : 'Expand Facet Tree'}
              className={`p-1.5 rounded-lg border text-xs transition ${
                leftPanelOpen
                  ? 'bg-zinc-800/80 border-white/10 text-white'
                  : 'bg-zinc-900 border-white/5 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <PanelLeft className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                sounds.playTap()
                setRightPanelOpen(!rightPanelOpen)
              }}
              title={rightPanelOpen ? 'Collapse Dossier Inspector' : 'Expand Dossier Inspector'}
              className={`p-1.5 rounded-lg border text-xs transition ${
                rightPanelOpen
                  ? 'bg-zinc-800/80 border-white/10 text-white'
                  : 'bg-zinc-900 border-white/5 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <PanelRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={toggleZenMode}
              title={zenMode ? 'Exit Zen Mode' : 'Enter Zen Canvas Mode'}
              className={`p-1.5 rounded-lg border text-xs transition ${
                zenMode
                  ? 'bg-purple-600 border-purple-500 text-white'
                  : 'bg-zinc-900 border-white/5 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {zenMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => {
                sounds.playTap()
                setShowPsychologyModal(true)
              }}
              className="inline-flex items-center space-x-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-purple-600/30 to-sky-600/30 border border-purple-500/40 text-purple-200 hover:border-purple-400 hover:text-white transition shadow-sm"
            >
              <Brain className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">Fry × Gottman Architecture</span>
              <span className="sm:hidden">Science</span>
            </button>
          </div>
        </div>
      </header>

      {/* ---------------------------------------------------- */}
      {/* 2. 3-ZONE STUDIO WORKSPACE LAYOUT                     */}
      {/* ---------------------------------------------------- */}
      <div className="max-w-[1720px] mx-auto p-3 sm:p-4 md:p-6 flex flex-col lg:flex-row gap-5 items-stretch min-h-[calc(100vh-65px)]">

        {/* ==================================================== */}
        {/* ZONE 1 (LEFT): FACETS & CANDIDATE HIERARCHY TREE     */}
        {/* ==================================================== */}
        {leftPanelOpen && (
          <aside className="w-full lg:w-80 flex-shrink-0 space-y-4 animate-in fade-in duration-200 flex flex-col justify-between">
            {/* CARD 1A: CANDIDATE DIRECTORY & TREE */}
            <div className="bg-[#121216] border border-white/[0.08] rounded-2xl p-4 shadow-xl space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                <div className="flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-purple-400" />
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                    Candidate Graph Tree
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-white/5">
                  {scoredCandidates.length} nodes
                </span>
              </div>

              {/* Micro Search Input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={e => setSearchFilter(e.target.value)}
                  placeholder="Filter by name or neighborhood..."
                  className="w-full pl-8 pr-3 py-1.5 bg-zinc-950/80 border border-white/[0.08] rounded-lg text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-purple-500/60"
                />
              </div>

              {/* Candidate Node Rows */}
              <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1 select-none">
                {sortedRanking.map((cand, idx) => {
                  const isSelected = cand.profile.id === selectedId
                  const firstName = cand.profile.identity.name.split(' ')[0]

                  return (
                    <div
                      key={cand.profile.id}
                      onClick={() => handleSelectCandidate(cand.profile.id)}
                      className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                        isSelected
                          ? 'bg-purple-950/40 border-purple-500/60 shadow-md ring-1 ring-purple-500/30'
                          : 'bg-zinc-950/40 border-white/[0.04] hover:border-white/15 hover:bg-zinc-900/60'
                      }`}
                    >
                      <div className="flex items-center space-x-2 min-w-[90px]">
                        <span className="text-[10px] font-mono text-zinc-500 w-3.5">#{idx + 1}</span>
                        <img
                          src={cand.profile.identity.photos[0]}
                          alt={cand.profile.identity.name}
                          className="w-6 h-6 rounded-full object-cover border border-white/10"
                        />
                        <span className={`text-xs font-semibold truncate ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
                          {firstName}
                        </span>
                      </div>

                      {/* 5-Facet Stacked Mini-Bar */}
                      <div className="flex-1 max-w-[80px] h-1.5 bg-zinc-800 rounded-full overflow-hidden flex">
                        {(Object.keys(FACETS) as FacetKey[]).map(k => {
                          const w = weights[k]
                          const score = cand.scores[k]
                          const segmentShare = (score * w) / (totalWeight || 1)
                          return (
                            <div
                              key={k}
                              style={{
                                width: `${segmentShare}%`,
                                backgroundColor: FACETS[k].colorHex,
                              }}
                              className="h-full"
                            />
                          )
                        })}
                      </div>

                      <div className="text-right min-w-[32px]">
                        <span className={`font-mono text-xs font-bold ${isSelected ? 'text-purple-300' : 'text-zinc-300'}`}>
                          {cand.fitScore}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* CARD 1B: GRAVITATIONAL PRIORITY SLIDERS */}
            <div className="bg-[#121216] border border-white/[0.08] rounded-2xl p-4 shadow-xl space-y-3.5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.06] mb-3">
                  <div className="flex items-center space-x-2">
                    <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                      Field Gravity Poles
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-white/5">
                    Σ <strong className={totalWeight === 100 ? 'text-emerald-400' : 'text-amber-400'}>{totalWeight}</strong>
                  </span>
                </div>

                {/* Preset Chips */}
                <div className="grid grid-cols-2 gap-1.5 mb-3.5">
                  {FACET_PRESETS.map(preset => (
                    <button
                      key={preset.name}
                      onClick={() => applyPreset(preset.weights)}
                      className="px-2 py-1 text-[10px] font-mono font-medium rounded-lg bg-zinc-950 border border-white/[0.06] text-zinc-400 hover:text-white hover:border-purple-500/40 hover:bg-zinc-900 transition text-left truncate"
                      title={preset.description}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>

                {/* 5 Dynamic Sliders */}
                <div className="space-y-3">
                  {(Object.keys(FACETS) as FacetKey[]).map(key => {
                    const facet = FACETS[key]
                    const val = weights[key]
                    return (
                      <div key={key} className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-medium">
                          <span className="flex items-center space-x-1.5">
                            <span
                              className="w-2 h-2 rounded-full inline-block"
                              style={{ backgroundColor: facet.colorHex }}
                            />
                            <span className="text-zinc-300 font-semibold">{facet.label}</span>
                            <span className="text-[9px] text-zinc-500 font-mono">({facet.shortSymbol})</span>
                          </span>
                          <span className="font-mono text-zinc-400 text-[11px]">{val}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => handleSliderChange(key, Math.max(0, val - 5))}
                            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 text-white font-bold text-xs flex items-center justify-center shrink-0 cursor-pointer transition"
                            aria-label={`Decrease ${facet.label} weight`}
                          >
                            -
                          </button>
                          <input
                            type="range"
                            min="0"
                            max="60"
                            step="5"
                            value={val}
                            onChange={e => handleSliderChange(key, parseInt(e.target.value, 10))}
                            className="flex-1 cursor-pointer accent-purple"
                          />
                          <button
                            type="button"
                            onClick={() => handleSliderChange(key, Math.min(60, val + 5))}
                            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 text-white font-bold text-xs flex items-center justify-center shrink-0 cursor-pointer transition"
                            aria-label={`Increase ${facet.label} weight`}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Location Signals Pause Toggle */}
              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                <span className="text-[11px] text-zinc-400 flex items-center space-x-1.5">
                  <Activity className="w-3.5 h-3.5 text-sky-400" />
                  <span>Poisson Transit Overlap</span>
                </span>
                <button
                  onClick={() => {
                    sounds.playTap()
                    setLocationSignals(!locationSignals)
                  }}
                  className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-semibold transition ${
                    locationSignals
                      ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                      : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                  }`}
                >
                  {locationSignals ? 'Active' : 'Paused'}
                </button>
              </div>
            </div>
          </aside>
        )}

        {/* ==================================================== */}
        {/* ZONE 2 (CENTER): GRAVITATIONAL MANIFOLD CANVAS       */}
        {/* ==================================================== */}
        <main className="flex-1 min-w-0 bg-[#0c0c10] border border-white/[0.08] rounded-3xl p-4 md:p-6 backdrop-blur-2xl shadow-2xl relative overflow-hidden flex flex-col justify-between select-none">
          {/* Subtle Dot Grid Background Pattern */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Top Canvas Bar: Telemetry Readouts & Orbit Labels */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
                <Compass className="w-4 h-4 text-purple-400" />
                <span>Celestial Gravitational Manifold</span>
              </h2>
              <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                5-Facet Potential Well · Day {timelineDay} Poisson Forecast · r ∝ (100 - Fit)
              </p>
            </div>

            {/* Live Polar Orbit Telemetry Card */}
            {selectedCoordinates && (
              <div className="flex items-center space-x-3 text-[10px] font-mono bg-zinc-950/80 border border-white/[0.08] px-3 py-1.5 rounded-xl text-zinc-300">
                <div>
                  <span className="text-zinc-500">POLAR: </span>
                  <span className="text-white font-bold">{selectedCoordinates.polarR}px</span> @ {selectedCoordinates.polarThetaDeg}°
                </div>
                <div className="hidden sm:block text-zinc-600">|</div>
                <div className="hidden sm:block">
                  <span className="text-zinc-500">U(r): </span>
                  <span className="text-purple-300 font-semibold">{selectedCoordinates.potentialEnergyU} J</span>
                </div>
                <div className="hidden md:block text-zinc-600">|</div>
                <div className="hidden md:block">
                  <span className="text-zinc-500">Δφ: </span>
                  <span className="text-sky-300">{selectedCoordinates.circadianPhaseGapHours}h</span>
                </div>
              </div>
            )}
          </div>

          {/* SVG RADAR & GRAVITATIONAL PARTICLES */}
          <div className="relative flex-1 flex items-center justify-center py-4 my-auto min-h-[360px] md:min-h-[460px]">
            <svg
              viewBox="0 0 480 480"
              className="w-full max-w-[500px] h-auto select-none overflow-visible"
            >
              <defs>
                <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.5" />
                  <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="selectionHalo" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                </radialGradient>
                <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Cosmic Starfield */}
              {[
                [65, 80], [410, 95], [110, 390], [390, 370], [85, 230],
                [420, 240], [210, 60], [290, 420], [180, 430], [320, 50],
              ].map(([sx, sy], i) => (
                <circle key={i} cx={sx} cy={sy} r="0.75" fill="#94a3b8" opacity={0.3 + (i % 3) * 0.2} />
              ))}

              {/* Keplerian Gravitational Orbit Zones */}
              {[45, 90, 135, 180].map((r, i) => (
                <g key={r}>
                  <circle
                    cx={radarCenter}
                    cy={radarCenter}
                    r={r}
                    fill="none"
                    stroke="#27272a"
                    strokeWidth="1"
                    strokeDasharray={i === 3 ? '4 4' : '2 2'}
                    opacity={0.6 + i * 0.1}
                  />
                  <text
                    x={radarCenter + 6}
                    y={radarCenter - r + 12}
                    fill="#71717a"
                    fontSize="9"
                    fontFamily="monospace"
                    opacity="0.9"
                  >
                    {i === 0 ? '90+ fit' : i === 1 ? '80 fit' : i === 2 ? '70 fit' : '60 fit'}
                  </text>
                </g>
              ))}

              {/* Equipotential Field Lines (Field physics mode) */}
              {(viewMode === 'field_physics' || interactionMode === 'field') && (
                <g opacity="0.4">
                  {[68, 112, 158].map(r => (
                    <circle
                      key={`pot_${r}`}
                      cx={radarCenter}
                      cy={radarCenter}
                      r={r}
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="0.75"
                      strokeDasharray="1 5"
                    />
                  ))}
                </g>
              )}

              {/* 5 Barycentric Attractor Poles & Directional Rays */}
              {(Object.keys(FACETS) as FacetKey[]).map(key => {
                const facet = FACETS[key]
                const poleX = radarCenter + radarMaxRadius * Math.cos(facet.angleRad)
                const poleY = radarCenter + radarMaxRadius * Math.sin(facet.angleRad)
                const labelX = radarCenter + (radarMaxRadius + 32) * Math.cos(facet.angleRad)
                const labelY = radarCenter + (radarMaxRadius + 32) * Math.sin(facet.angleRad)
                const poleWeight = weights[key]
                const isFocusedPole = activeAttractorFocus === 'all' || activeAttractorFocus === key

                return (
                  <g
                    key={key}
                    className="cursor-pointer"
                    onClick={() => {
                      sounds.playTap()
                      setActiveAttractorFocus(activeAttractorFocus === key ? 'all' : key)
                    }}
                  >
                    {/* Spoke line */}
                    <line
                      x1={radarCenter}
                      y1={radarCenter}
                      x2={poleX}
                      y2={poleY}
                      stroke={facet.colorHex}
                      strokeWidth={isFocusedPole ? 1.5 : 0.75}
                      strokeDasharray={isFocusedPole ? '2 2' : '1 6'}
                      opacity={isFocusedPole ? 0.7 : 0.15}
                    />

                    {/* Outer Attractor Anchor */}
                    <circle
                      cx={radarCenter + (radarMaxRadius + 10) * Math.cos(facet.angleRad)}
                      cy={radarCenter + (radarMaxRadius + 10) * Math.sin(facet.angleRad)}
                      r={isFocusedPole ? 5 + (poleWeight / 50) * 3 : 3}
                      fill={facet.colorHex}
                      opacity={isFocusedPole ? 1 : 0.4}
                      className="transition-all duration-300"
                    />

                    {/* Pole Label */}
                    <text
                      x={labelX}
                      y={labelY + 3}
                      fill={facet.colorHex}
                      fontSize="11"
                      fontWeight="600"
                      opacity={isFocusedPole ? 1 : 0.35}
                      textAnchor={
                        Math.abs(Math.cos(facet.angleRad)) < 0.2
                          ? 'middle'
                          : Math.cos(facet.angleRad) > 0
                          ? 'start'
                          : 'end'
                      }
                      className="font-sans drop-shadow-sm select-none"
                    >
                      {facet.label} ({poleWeight})
                    </text>
                  </g>
                )
              })}

              {/* CENTER "YOU" NODE */}
              <circle cx={radarCenter} cy={radarCenter} r="46" fill="url(#centerGlow)" />
              <circle
                cx={radarCenter}
                cy={radarCenter}
                r="18"
                fill="#09090b"
                stroke="#38bdf8"
                strokeWidth="2.5"
              />
              <text
                x={radarCenter}
                y={radarCenter + 4}
                fill="#ffffff"
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
              >
                You
              </text>

              {/* CANDIDATE PARTICLES & GRAVITATIONAL FORCES */}
              {candidateCoordinates.map(c => {
                const isSelected = c.profile.id === selectedId
                const isHovered = c.profile.id === hoveredId
                const firstName = c.profile.identity.name.split(' ')[0]
                const isPoleMatch = activeAttractorFocus === 'all' || c.dominantFacetKey === activeAttractorFocus

                return (
                  <g
                    key={c.profile.id}
                    className="cursor-pointer transition-transform duration-300"
                    onClick={() => handleSelectCandidate(c.profile.id)}
                    onMouseEnter={() => setHoveredId(c.profile.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    opacity={isPoleMatch ? 1 : 0.2}
                  >
                    {/* Gravitational vector line from center to candidate */}
                    {(isSelected || isHovered || viewMode === 'field_physics') && (
                      <line
                        x1={radarCenter}
                        y1={radarCenter}
                        x2={c.cx}
                        y2={c.cy}
                        stroke={c.accentColor}
                        strokeWidth="1.2"
                        strokeDasharray="2 3"
                        opacity={isSelected ? 0.75 : 0.35}
                      />
                    )}

                    {/* Dominant Gravity Pole Vector Ray */}
                    {isSelected && (
                      <line
                        x1={c.cx}
                        y1={c.cy}
                        x2={radarCenter + radarMaxRadius * Math.cos(c.dominantAngle)}
                        y2={radarCenter + radarMaxRadius * Math.sin(c.dominantAngle)}
                        stroke={c.accentColor}
                        strokeWidth="1.5"
                        opacity="0.6"
                      />
                    )}

                    {/* 30-Day Poisson Encounter Halo Wave */}
                    {locationSignals && viewMode !== 'best_fit' && c.effectiveOdds > 0 && (
                      <circle
                        cx={c.cx}
                        cy={c.cy}
                        r={c.dotRadius + 8}
                        fill={c.accentColor}
                        fillOpacity="0.08"
                        stroke={c.accentColor}
                        strokeWidth="1"
                        strokeDasharray="3 3"
                        opacity={isSelected ? 0.9 : 0.4}
                        className={isSelected ? 'animate-pulse' : ''}
                      />
                    )}

                    {/* Active Selection Halo Ring */}
                    {isSelected && (
                      <circle
                        cx={c.cx}
                        cy={c.cy}
                        r={c.dotRadius + 13}
                        fill="url(#selectionHalo)"
                        stroke={c.accentColor}
                        strokeWidth="1.5"
                        strokeDasharray="2 2"
                        className="animate-spin"
                        style={{ animationDuration: '18s' }}
                      />
                    )}

                    {/* Particle Body */}
                    <circle
                      cx={c.cx}
                      cy={c.cy}
                      r={c.dotRadius}
                      fill={c.accentColor}
                      fillOpacity={isSelected ? 1 : 0.85}
                      stroke="#09090b"
                      strokeWidth="2"
                    />

                    {/* Name & Fit Score Label */}
                    <text
                      x={c.cx + c.dotRadius + 6}
                      y={c.cy + 3}
                      fill={isSelected ? '#ffffff' : '#a1a1aa'}
                      fontSize={isSelected ? '12' : '10'}
                      fontWeight={isSelected ? 'bold' : '500'}
                      className="pointer-events-none drop-shadow select-none"
                    >
                      {firstName} ({c.fitScore})
                    </text>

                    {/* Tooltip on Hover */}
                    {isHovered && !isSelected && (
                      <g transform={`translate(${c.cx + 12}, ${c.cy - 34})`}>
                        <rect
                          x="0"
                          y="0"
                          width="150"
                          height="48"
                          rx="6"
                          fill="#18181b"
                          stroke="#3f3f46"
                          strokeWidth="1"
                        />
                        <text x="8" y="16" fill="#f4f4f5" fontSize="10" fontWeight="bold">
                          {firstName} · Fit {c.fitScore}
                        </text>
                        <text x="8" y="30" fill="#a1a1aa" fontSize="9">
                          Day {timelineDay} Odds: {c.effectiveOdds}% (λ={c.poissonIntensity.toFixed(3)})
                        </text>
                        <text x="8" y="42" fill="#c084fc" fontSize="8" fontFamily="monospace">
                          Polar: ({c.polarR}px, {c.polarThetaDeg}°)
                        </text>
                      </g>
                    )}
                  </g>
                )
              })}
            </svg>
          </div>

          {/* ---------------------------------------------------- */}
          {/* FLOATING CANVAS HUD DOCK (ONLOOK SIGNATURE PILL)     */}
          {/* ---------------------------------------------------- */}
          <div className="relative z-30 flex justify-center pb-1">
            <div className="bg-[#18181b]/90 border border-white/[0.12] rounded-full px-3 py-1.5 backdrop-blur-2xl shadow-2xl flex flex-wrap items-center gap-2 text-xs select-none">
              {/* Interaction Mode Toggle */}
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => {
                    sounds.playTap()
                    setInteractionMode(interactionMode === 'select' ? 'field' : 'select')
                  }}
                  className={`px-2 py-1 rounded-full flex items-center space-x-1 text-[11px] font-medium transition ${
                    interactionMode === 'field'
                      ? 'bg-sky-600 text-white'
                      : 'bg-zinc-800 text-zinc-300 hover:text-white'
                  }`}
                  title="Toggle Field Equipotential Vectors"
                >
                  <Focus className="w-3 h-3" />
                  <span>{interactionMode === 'field' ? 'Field Vectors' : 'Interact'}</span>
                </button>
              </div>

              <div className="w-px h-4 bg-zinc-700" />

              {/* Spacetime Timeline Scrubber Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={togglePlayback}
                  className="p-1 rounded-full bg-purple-600 hover:bg-purple-500 text-white transition shadow-sm"
                  title={isPlayingTimeline ? 'Pause time-lapse forecast' : 'Play 30-day encounter forecast'}
                >
                  {isPlayingTimeline ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                </button>

                <div className="w-20 sm:w-28 flex items-center">
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="1"
                    value={timelineDay}
                    onChange={e => setTimelineDay(parseInt(e.target.value, 10))}
                    className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                </div>

                <span className="text-[10px] font-mono text-purple-300 font-bold whitespace-nowrap">
                  Day {timelineDay}/30
                </span>

                {/* Quick Day Presets */}
                <div className="hidden sm:flex items-center space-x-1">
                  {[1, 15, 30].map(day => (
                    <button
                      key={day}
                      onClick={() => {
                        sounds.playTap()
                        setTimelineDay(day)
                        setIsPlayingTimeline(false)
                      }}
                      className={`px-1.5 py-0.5 rounded text-[9px] font-mono transition ${
                        timelineDay === day
                          ? 'bg-purple-600 text-white'
                          : 'bg-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      D{day}
                    </button>
                  ))}
                </div>
              </div>

              <div className="w-px h-4 bg-zinc-700" />

              {/* Attractor Focus Cycle */}
              <button
                onClick={() => {
                  sounds.playTap()
                  const keys: ('all' | FacetKey)[] = ['all', 'crossing', 'rhythm', 'values', 'interests', 'mutual']
                  const nextIdx = (keys.indexOf(activeAttractorFocus) + 1) % keys.length
                  setActiveAttractorFocus(keys[nextIdx])
                }}
                className="px-2 py-1 rounded-full bg-zinc-800 text-zinc-300 hover:text-white flex items-center space-x-1 text-[11px] font-mono transition"
                title="Filter by Gravitational Attractor Pole"
              >
                <Filter className="w-3 h-3 text-purple-400" />
                <span>
                  {activeAttractorFocus === 'all'
                    ? 'All Poles'
                    : FACETS[activeAttractorFocus].shortSymbol}
                </span>
              </button>

              <div className="w-px h-4 bg-zinc-700" />

              {/* Reset Viewport */}
              <button
                onClick={resetViewport}
                className="p-1 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition"
                title="Reset Viewport & Scrubber"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Sub-Legend Pill */}
          <div className="pt-2 border-t border-white/[0.06] flex flex-wrap items-center justify-between text-[11px] text-zinc-400 gap-2">
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              <span>Distance = fit score</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Size = 30-day encounter odds</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Color = dominant gravity attractor</span>
            </span>
          </div>
        </main>

        {/* ==================================================== */}
        {/* ZONE 3 (RIGHT): TELEMETRY DOSSIER & RANKINGS         */}
        {/* ==================================================== */}
        {rightPanelOpen && (
          <aside className="w-full lg:w-96 flex-shrink-0 space-y-4 animate-in fade-in duration-200">
            {/* CARD 3A: SELECTED CANDIDATE DOSSIER */}
            <div className="bg-[#121216] border border-white/[0.08] rounded-2xl p-4 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                <span className="text-[10px] font-mono uppercase tracking-wider text-purple-300 font-bold flex items-center space-x-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  <span>Dyad Dossier // {selectedCandidate.profile.id}</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  {selectedCandidate.fitScore}% Fit
                </span>
              </div>

              {/* Candidate Profile Avatar & Pair Title */}
              <div className="flex items-center space-x-3">
                <img
                  src={selectedCandidate.profile.identity.photos[0]}
                  alt={selectedCandidate.profile.identity.name}
                  className="w-12 h-12 rounded-xl object-cover border border-purple-500/40 shadow-md"
                />
                <div>
                  <h3 className="text-base font-bold text-white leading-tight">
                    {selectedCandidate.pairTitle}
                  </h3>
                  <p className="text-xs text-zinc-400">
                    {selectedCandidate.profile.geography.cityName} · {selectedCandidate.jobTitle}
                  </p>
                </div>
              </div>

              {/* 30-Day Crossing Odds Metric & Confidence Bar */}
              <div className="bg-zinc-950/80 border border-white/[0.08] rounded-xl p-3.5 space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-bold text-white">
                    {selectedCandidate.effectiveOdds}% chance your paths cross in {timelineDay} days
                  </span>
                </div>

                <div className="text-[10px] text-zinc-400 font-mono">
                  {locationSignals
                    ? `range ${selectedCandidate.effectiveRange[0]}–${selectedCandidate.effectiveRange[1]}% (95% CI)`
                    : 'Location signals paused'}
                </div>

                {/* Range bar graphic */}
                <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden relative">
                  {locationSignals && (
                    <>
                      <div
                        className="absolute h-full bg-purple-900/60"
                        style={{
                          left: `${selectedCandidate.effectiveRange[0]}%`,
                          width: `${Math.max(4, selectedCandidate.effectiveRange[1] - selectedCandidate.effectiveRange[0])}%`,
                        }}
                      />
                      <div
                        className="absolute h-full bg-gradient-to-r from-purple-500 to-sky-400 rounded-full"
                        style={{ width: `${selectedCandidate.effectiveOdds}%` }}
                      />
                    </>
                  )}
                </div>
              </div>

              {/* Feature Attribution Differentials */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <h4 className="font-bold text-white text-xs">
                    Points above/below typical match
                  </h4>
                  <span className="text-[10px] text-zinc-500 font-mono">Δ vs Mean</span>
                </div>

                <div className="space-y-1.5">
                  {(Object.keys(FACETS) as FacetKey[]).map(key => {
                    const facet = FACETS[key]
                    const diff = differentials[key]
                    const isPositive = diff >= 0

                    return (
                      <div key={key} className="flex items-center text-xs">
                        <span className="w-24 text-zinc-300 font-medium truncate flex items-center space-x-1.5 text-[11px]">
                          <span
                            className="w-1.5 h-1.5 rounded-full inline-block flex-shrink-0"
                            style={{ backgroundColor: facet.colorHex }}
                          />
                          <span>{facet.label}</span>
                        </span>

                        {/* Divergent Bar */}
                        <div className="flex-1 flex items-center h-3 mx-2 relative">
                          <div className="w-1/2 flex justify-end">
                            {!isPositive && (
                              <div
                                className="h-1.5 rounded-l bg-zinc-600 transition-all duration-300"
                                style={{ width: `${Math.min(100, Math.abs(diff) * 8)}%` }}
                              />
                            )}
                          </div>
                          <div className="w-px h-full bg-zinc-700" />
                          <div className="w-1/2 flex justify-start">
                            {isPositive && (
                              <div
                                className="h-1.5 rounded-r transition-all duration-300"
                                style={{
                                  backgroundColor: facet.colorHex,
                                  width: `${Math.min(100, Math.abs(diff) * 8)}%`,
                                }}
                              />
                            )}
                          </div>
                        </div>

                        <span
                          className={`w-10 text-right font-mono font-semibold text-[11px] ${
                            isPositive ? 'text-purple-300' : 'text-zinc-500'
                          }`}
                        >
                          {isPositive ? `+${diff}` : `${diff}`}
                        </span>
                      </div>
                    )
                  })}
                </div>

                <div className="p-2 rounded-lg bg-zinc-950/80 border border-white/[0.06] text-[11px] text-zinc-300">
                  <span className="text-purple-400 font-semibold">Strongest edge:</span> {strongestEdge}{' '}
                  <span className="text-zinc-600 mx-1">·</span>{' '}
                  <span className="text-amber-400 font-semibold">Biggest drag:</span> {biggestDrag}
                </div>
              </div>

              {/* Spacetime Near Misses */}
              <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-purple-400" />
                    <span>Transit Near-Misses</span>
                  </h4>
                  <span className="text-[10px] text-zinc-500 font-mono">London Route Sync</span>
                </div>

                <div className="space-y-1.5">
                  {selectedCandidate.nearMisses.map((miss, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-xl bg-zinc-950/70 border border-white/[0.06] flex items-start justify-between text-xs gap-2"
                    >
                      <div className="space-y-0.5">
                        <span className="font-mono text-purple-300 font-bold block text-[11px]">
                          {miss.time}
                        </span>
                        <span className="text-zinc-300 text-[11px]">
                          {miss.description}
                        </span>
                      </div>
                      <span className="text-zinc-400 font-medium text-[10px] text-right bg-zinc-900 px-1.5 py-0.5 rounded border border-white/5 whitespace-nowrap">
                        {miss.venue}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => {
                    sounds.playTap()
                    setSuggestMeetingModal(true)
                  }}
                  className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-900/30 flex items-center justify-center space-x-2 transition"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-200" />
                  <span>Suggest Optimal Transit Midpoint</span>
                </button>

                {onSelectCandidate && (
                  <button
                    onClick={() => {
                      sounds.playTap()
                      onSelectCandidate(selectedCandidate.profile, selectedCandidate.evaluation)
                    }}
                    className="w-full py-2 px-4 rounded-xl font-medium text-xs bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-white/10 flex items-center justify-center space-x-2 transition"
                  >
                    <FileText className="w-3 h-3 text-zinc-400" />
                    <span>Inspect 12-Dimension Match Report</span>
                  </button>
                )}
              </div>
            </div>

            {/* CARD 3B: SORTED RANKING CARD */}
            <div className="bg-[#121216] border border-white/[0.08] rounded-2xl p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-white/[0.06]">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                  Leaderboard Index
                </h3>
                <div className="flex items-center space-x-1.5 text-xs">
                  <span className="text-[10px] text-zinc-500 font-mono">Sort:</span>
                  <select
                    value={sortCriteria}
                    onChange={e => {
                      sounds.playTap()
                      setSortCriteria(e.target.value as any)
                    }}
                    className="bg-zinc-950 text-[11px] font-mono text-zinc-300 border border-white/10 rounded-lg px-2 py-0.5 focus:outline-none focus:border-purple-500"
                  >
                    <option value="fit">by fit</option>
                    <option value="odds">by meeting odds</option>
                    <option value="name">by name</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1 max-h-[160px] overflow-y-auto pr-1">
                {sortedRanking.map(cand => {
                  const isSelected = cand.profile.id === selectedId
                  return (
                    <div
                      key={cand.profile.id}
                      onClick={() => handleSelectCandidate(cand.profile.id)}
                      className={`px-2.5 py-1.5 rounded-lg border text-xs flex items-center justify-between cursor-pointer transition ${
                        isSelected
                          ? 'bg-purple-950/40 border-purple-500/50 text-white'
                          : 'bg-zinc-950/40 border-transparent text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                      }`}
                    >
                      <span className="font-medium truncate">{cand.profile.identity.name}</span>
                      <div className="flex items-center space-x-2 font-mono text-[11px]">
                        <span className="text-purple-300 font-bold">{cand.fitScore}%</span>
                        <ChevronRight className="w-3 h-3 text-zinc-600" />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </aside>
        )}

      </div>

      {/* ================================================== */}
      {/* MODAL 1: INTELLIGENT ARCHITECTURE (FRY × PSYCHOLOGY) */}
      {/* ================================================== */}
      {showPsychologyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#121216] border border-white/[0.08] max-w-3xl w-full rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    The Intelligent Love Architecture
                  </h3>
                  <p className="text-xs text-zinc-400 font-mono">
                    Hannah Fry’s Mathematics × Attachment Theory & Gottman Dyadics
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowPsychologyModal(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 4 Architectural Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-zinc-950/80 border border-white/[0.08] space-y-2">
                <div className="flex items-center space-x-2 text-purple-400 font-bold text-sm">
                  <Flame className="w-4 h-4" />
                  <span>1. Upgraded 37% Optimal Stopping</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Rather than sampling blindly in the first 37%, you calibrate your evaluation function against attachment wounds. You do not pick the "best so far" — you select for Aron’s <strong>Self-Expansion</strong> and secure co-regulation.
                </p>
                <div className="text-[11px] font-mono text-purple-300 bg-purple-950/40 p-2 rounded border border-purple-900/60">
                  Current Partner Score: {selectedCandidate.psychology.selfExpansionScore}% Self-Expansion
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950/80 border border-white/[0.08] space-y-2">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>2. Gottman Coupled Equations</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Predicts dyadic stability via non-linear influence functions. Successful relationships maintain a <strong>5:1 positivity ratio</strong> and a low negativity threshold, surfacing micro-friction early without contempt.
                </p>
                <div className="text-[11px] font-mono text-emerald-300 bg-emerald-950/40 p-2 rounded border border-emerald-900/60">
                  Positivity Dyad: {selectedCandidate.psychology.gottmanRatio} (Optimal)
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950/80 border border-white/[0.08] space-y-2">
                <div className="flex items-center space-x-2 text-sky-400 font-bold text-sm">
                  <Compass className="w-4 h-4" />
                  <span>3. Scale-Free Sexual Networks</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Partner networks follow scale-free power laws, not bell curves. By aligning transit routines and circadian rhythms, your node degree expands organically without burnout.
                </p>
                <div className="text-[11px] font-mono text-sky-300 bg-sky-950/40 p-2 rounded border border-sky-900/60">
                  Attachment Mode: {selectedCandidate.psychology.attachment}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950/80 border border-white/[0.08] space-y-2">
                <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
                  <ShieldCheck className="w-4 h-4" />
                  <span>4. Bowen Differentiation</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Staying intimately connected while maintaining self-sovereignty. Prevents dorsal vagal shutdown and anxious protest loops during high-stakes decisions.
                </p>
                <div className="text-[11px] font-mono text-amber-300 bg-amber-950/40 p-2 rounded border border-amber-900/60">
                  Micro-Repair: {selectedCandidate.psychology.lowNegativityThreshold}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-800/60 flex items-center justify-between">
              <div>
                <span className="text-xs text-purple-300 font-bold block uppercase tracking-wider">
                  Recommended Algorithmic Action
                </span>
                <span className="text-sm text-zinc-200">
                  {selectedCandidate.psychology.decisionPhase}
                </span>
              </div>
              <button
                onClick={() => setShowPsychologyModal(false)}
                className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold hover:bg-purple-500 transition"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* MODAL 2: SUGGEST A PLACE TO MEET                   */}
      {/* ================================================== */}
      {suggestMeetingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#121216] border border-white/[0.08] max-w-lg w-full rounded-2xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-bold text-white">
                  Optimal Transit Midpoint for {selectedCandidate.pairTitle}
                </h3>
              </div>
              <button
                onClick={() => setSuggestMeetingModal(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              Based on your daily rhythm synchronization and verified near-misses around <strong>Waterloo and Borough Market</strong>:
            </p>

            <div className="space-y-2.5">
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-purple-500/40 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white">Monmouth Coffee Company</span>
                  <span className="text-xs font-mono text-purple-300 font-bold">98% Midpoint Fit</span>
                </div>
                <p className="text-xs text-zinc-400">
                  27 Park St, Borough Market · 8 mins from your Northern line route
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-950 border border-white/[0.08] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white">Tate Modern Espresso Bar</span>
                  <span className="text-xs font-mono text-zinc-400">92% Midpoint Fit</span>
                </div>
                <p className="text-xs text-zinc-400">
                  Bankside · Calmer ambient volume, optimal for cognitive co-regulation
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setSuggestMeetingModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  sounds.playMatch()
                  setSuggestMeetingModal(false)
                }}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-purple-600 text-white hover:bg-purple-500 transition"
              >
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AlgorithmNetworkVisualizer
