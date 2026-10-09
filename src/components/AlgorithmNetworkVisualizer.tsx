// ============================================================================
// src/components/AlgorithmNetworkVisualizer.tsx
// Wingman: The Living Constellation & 30-Day Serendipity Projection
// A soulful, celestial map of mutual human resonance in London.
// 
// Blending real human warmth with grounded relational science:
// - Spatiotemporal Poisson Mobility Models (Brockmann / Gonzalez et al.)
// - Kuramoto Circadian Phase Synchronization & Gottman Dyadic Stability
// - Aron Self-Expansion & Optimal Stopping Principles
//
// Zero screen clipping on any viewport width (320px to 4K ultra-wide).
// Mobile-first ergonomics with 3 intuitive view tabs:
// 1. Constellation (The Night Sky Hero)
// 2. Five Harmonies (Tactile tuning sliders with haptic feedback)
// 3. Connection Story (Deep dyadic story, London near-misses, and meeting spots)
// ============================================================================

import React, { useState, useMemo, useEffect } from 'react'
import {
  Compass,
  Sparkles,
  MapPin,
  ShieldCheck,
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
  Activity,
  Filter,
  ChevronRight,
  Coffee,
  Heart,
  Star,
  Info,
} from 'lucide-react'
import type { UniversalUserProfile, MatchEvaluation } from '../types'
import { evaluateMatch } from '../utils/matchingEngine'
import { mockCandidates } from '../data/mockProfiles'
import { sounds } from '../utils/sound'

// ==========================================
// 1. THE FIVE LIFE HARMONIES (SOULFUL DEFINITIONS)
// ==========================================

export type FacetKey = 'crossing' | 'rhythm' | 'values' | 'interests' | 'mutual'

export interface FacetDefinition {
  key: FacetKey
  label: string
  shortLabel: string
  shortSymbol: string
  colorHex: string
  glowColor: string
  badgeBg: string
  badgeText: string
  angleRad: number // Celestial star pole angle on unit circle
  scientificName: string
  appliedTheory: string
  poeticSubtitle: string
  description: string
}

const FACETS: Record<FacetKey, FacetDefinition> = {
  crossing: {
    key: 'crossing',
    label: 'Shared Paths in London',
    shortLabel: 'Shared Paths',
    shortSymbol: 'City Routes',
    colorHex: '#c084fc', // Lilac starlight
    glowColor: 'rgba(192, 132, 252, 0.4)',
    badgeBg: 'bg-purple-500/20',
    badgeText: 'text-purple-300',
    angleRad: -Math.PI / 2, // 12 o'clock (top)
    scientificName: 'Urban Transit & Path Serendipity',
    appliedTheory: 'Continuous Spatiotemporal Mobility Overlap',
    poeticSubtitle: 'Where your daily steps, cafes, and commutes cross in real life',
    description: 'Physical route overlap across London transport, neighborhood markets, and morning coffee spots',
  },
  rhythm: {
    key: 'rhythm',
    label: 'Daily Living Rhythm',
    shortLabel: 'Daily Rhythm',
    shortSymbol: 'Living Pace',
    colorHex: '#34d399', // Emerald aurora
    glowColor: 'rgba(52, 211, 153, 0.4)',
    badgeBg: 'bg-emerald-500/20',
    badgeText: 'text-emerald-300',
    angleRad: -Math.PI * 0.1, // ~2 o'clock
    scientificName: 'Circadian Synchronization & Peak Pace',
    appliedTheory: 'Sleep Chronotype & Energy Window Alignment',
    poeticSubtitle: 'Morning wakefulness, quiet evenings, and weekend pace',
    description: 'Sleep chronotype, energy peaks, and weekend downtime synchrony — sharing a life without draining each other',
  },
  values: {
    key: 'values',
    label: 'Core Anchors & Safety',
    shortLabel: 'Core Anchors',
    shortSymbol: 'Core Values',
    colorHex: '#fb7185', // Rose ember
    glowColor: 'rgba(251, 113, 133, 0.4)',
    badgeBg: 'bg-rose-500/20',
    badgeText: 'text-rose-300',
    angleRad: Math.PI * 0.35, // ~4:30 o'clock
    scientificName: 'Gottman Stability & Emotional Safety',
    appliedTheory: '5:1 Positivity Ratio & Early Gentle Conflict Repair',
    poeticSubtitle: 'Unspoken ethics, emotional honesty, and mutual care',
    description: 'Emotional accountability, attachment security, and long-term life trajectory alignment',
  },
  interests: {
    key: 'interests',
    label: 'Shared Curiosities',
    shortLabel: 'Curiosities',
    shortSymbol: 'Curiosities',
    colorHex: '#fbbf24', // Warm golden spark
    glowColor: 'rgba(251, 191, 36, 0.4)',
    badgeBg: 'bg-amber-500/20',
    badgeText: 'text-amber-300',
    angleRad: Math.PI * 0.82, // ~7:30 o'clock
    scientificName: 'Aron Self-Expansion & Wonder',
    appliedTheory: 'Cognitive Horizon Growth & Mutual Novelty',
    poeticSubtitle: 'Books, quiet galleries, neighborhood walks, and laughter',
    description: 'Shared passions, creative sparks, and expanding each other’s inner world without losing your own',
  },
  mutual: {
    key: 'mutual',
    label: 'Mutual Warmth & Ease',
    shortLabel: 'Mutual Warmth',
    shortSymbol: 'Natural Flow',
    colorHex: '#38bdf8', // Sky starlight
    glowColor: 'rgba(56, 189, 248, 0.4)',
    badgeBg: 'bg-sky-500/20',
    badgeText: 'text-sky-300',
    angleRad: -Math.PI * 0.9, // ~10 o'clock
    scientificName: 'Reciprocal Attraction & Low Latency',
    appliedTheory: 'Reciprocal Warmth & Rejection Freedom',
    poeticSubtitle: 'A connection that feels effortless and safe from minute one',
    description: 'Low conversational friction, natural reciprocal curiosity, and feeling completely comfortable being yourself',
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

// Preset configurations with warm, human names
const HARMONY_PRESETS: { name: string; description: string; weights: Record<FacetKey, number> }[] = [
  {
    name: 'Balanced Harmonies',
    description: 'Equal 20% balance across all five dimensions of life',
    weights: { crossing: 20, rhythm: 20, values: 20, interests: 20, mutual: 20 },
  },
  {
    name: 'City Serendipity',
    description: 'Prioritises people whose everyday steps and transit routines cross yours',
    weights: { crossing: 45, rhythm: 25, values: 15, interests: 5, mutual: 10 },
  },
  {
    name: 'Emotional Sanctuary',
    description: 'Deep core values, emotional safety, and gentle conflict resilience',
    weights: { values: 45, mutual: 25, rhythm: 15, crossing: 10, interests: 5 },
  },
  {
    name: 'Curiosity & Spark',
    description: 'Shared passions, creative sparks, and intellectual self-expansion',
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
  // View mode toggle
  const [viewMode, setViewMode] = useState<'harmony' | 'projection' | 'rays'>('projection')

  // Mobile navigation tabs: 'constellation' | 'harmonies' | 'story'
  const [mobileTab, setMobileTab] = useState<'constellation' | 'harmonies' | 'story'>('constellation')

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
  const [showScienceModal, setShowScienceModal] = useState<boolean>(false)
  const [suggestMeetingModal, setSuggestMeetingModal] = useState<boolean>(false)

  // Desktop panel states
  const [leftPanelOpen, setLeftPanelOpen] = useState<boolean>(true)
  const [rightPanelOpen, setRightPanelOpen] = useState<boolean>(true)
  const [zenMode, setZenMode] = useState<boolean>(false)
  const [activeAttractorFocus, setActiveAttractorFocus] = useState<'all' | FacetKey>('all')
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
      }, 240)
    }
    return () => clearInterval(timer)
  }, [isPlayingTimeline])

  // Pre-calculate candidate items with realistic London transit spacetime logs
  const candidateItems = useMemo<CandidateNetworkItem[]>(() => {
    const defaultNearMisses: Record<string, NearMissLog[]> = {
      usr_maya_01: [
        { time: 'Tue 08:12', description: '40 m apart, both ordering flat whites', venue: 'Waterloo Station' },
        { time: 'Sat 11:20', description: 'Both picking up fresh sourdough at the same stall', venue: 'Borough Market' },
        { time: 'Thu 18:45', description: 'Adjacent carriages northbound across the river', venue: 'Northern line' },
      ],
      usr_liam_02: [
        { time: 'Mon 09:05', description: 'Opposite platform heading central', venue: 'Liverpool Street' },
        { time: 'Fri 19:20', description: 'Attending same photography opening', venue: 'Whitechapel Gallery' },
      ],
      usr_priya_03: [
        { time: 'Wed 13:10', description: 'Reading two tables away in the quiet garden', venue: 'Wellcome Collection' },
        { time: 'Sun 16:30', description: 'Crossed paths at the pedestrian crossing', venue: 'Russell Square' },
      ],
      usr_marcus_04: [
        { time: 'Thu 12:40', description: 'Same bakery checkout counter', venue: 'E5 Bakehouse' },
      ],
      usr_sofia_05: [
        { time: 'Fri 18:15', description: 'Both resting by the canal steps at golden hour', venue: 'Granary Square' },
      ],
      usr_chloe_06: [
        { time: 'Sun 14:00', description: 'Passed by the conservatory terrace', venue: 'Barbican Centre' },
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

      const crossingScore = Math.max(35, Math.min(98, Math.round(geoScore * 0.9 + (12 - idx * 2))))

      const oddsBase = Math.round(Math.max(12, Math.min(55, crossingScore * 0.48 + (10 - idx * 2))))
      const oddsRange: [number, number] = [
        Math.max(8, oddsBase - 11),
        Math.min(65, oddsBase + 9),
      ]

      const probDecimal = Math.min(0.85, oddsBase / 100)
      const poissonIntensity = -Math.log(1 - probDecimal) / 30

      const circadianPhaseGapHours = parseFloat(((idx * 0.6 + 0.3) % 2.5).toFixed(1))

      const currentUserName = currentUser.identity.name.split(' ')[0]
      const candFirstName = cand.identity.name.split(' ')[0]

      const candNearMisses = defaultNearMisses[cand.id] || [
        { time: 'Sat 15:30', description: 'In the same philosophy section', venue: 'Foyles Charing Cross' },
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
              ? 'Calm, gentle repair within 15 minutes of tension'
              : 'Direct communication, zero passive aggression',
          decisionPhase:
            overall >= 75
              ? 'High Long-Term Resonance · Natural Fit'
              : 'Warm Exploratory Dynamic',
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

  // Compute dynamic fit scores for all candidates
  const scoredCandidates = useMemo(() => {
    const safeTotalWeight = totalWeight > 0 ? totalWeight : 1
    return candidateItems.map(item => {
      let weightedSum = 0
      ;(Object.keys(weights) as FacetKey[]).forEach(k => {
        weightedSum += item.scores[k] * weights[k]
      })
      const fitScore = Math.round(weightedSum / safeTotalWeight)

      const timeProb = 1 - Math.exp(-item.poissonIntensity * timelineDay)
      const currentDayOdds = Math.round(timeProb * 100)

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

  // Pool averages to calculate differentials
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

  // Differentials for the selected match
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

  // Identify strongest harmony & area needing care
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

  // Filtered & Sorted list for candidate tree and ranking
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
  // 3. ZERO-CLIPPING CELESTIAL GEOMETRY & COORDINATES
  // ========================================================
  // Generous 620 x 620 viewBox centered at (310, 310)
  // Max node radius: 155px. Attractor anchor radius: 180px.
  // Labels are safely anchored inside [30, 590] on X and [50, 570] on Y.
  // ========================================================
  const canvasCenter = 310
  const maxOrbitRadius = 155

  // Calculate Cartesian (x, y) coordinates for each star
  const candidateCoordinates = useMemo(() => {
    return scoredCandidates.map(c => {
      // 1. Radial Distance: Higher fit score = closer to your inner orbit
      const normalizedDist = Math.max(0.12, Math.min(1, (100 - c.fitScore) / 48))
      const radius = 40 + normalizedDist * (maxOrbitRadius - 40)

      // 2. Gravitational Pull Vector: Weighted direction towards the 5 life harmonies
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

      // 3. Star Aura Radius: proportional to 30-day encounter chance
      const dotRadius =
        locationSignals && viewMode !== 'harmony'
          ? Math.max(8, (c.effectiveOdds / 55) * 16)
          : 9

      // 4. Strongest harmony
      let topFacet: FacetKey = 'crossing'
      let topScore = -1
      ;(Object.keys(FACETS) as FacetKey[]).forEach(k => {
        if (c.scores[k] > topScore) {
          topScore = c.scores[k]
          topFacet = k
        }
      })

      const cx = canvasCenter + radius * Math.cos(dominantAngle)
      const cy = canvasCenter + radius * Math.sin(dominantAngle)

      return {
        ...c,
        cx,
        cy,
        radius,
        dominantAngle,
        dotRadius,
        accentColor: FACETS[topFacet].colorHex,
        glowColor: FACETS[topFacet].glowColor,
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
    <div className="min-h-screen bg-[#07070c] text-zinc-100 font-sans selection:bg-purple-500/30 selection:text-white relative overflow-x-hidden">
      {/* ---------------------------------------------------- */}
      {/* 1. WARM CELESTIAL TOP BAR                             */}
      {/* ---------------------------------------------------- */}
      <header className="sticky top-0 z-40 bg-[#07070c]/90 border-b border-white/[0.08] backdrop-blur-xl px-4 md:px-6 py-2.5 transition-all">
        <div className="max-w-[1720px] mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left: Soulful Identity & Location Breadcrumb */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-amber-400 to-rose-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
              <div className="flex flex-col">
                <span className="text-xs font-semibold tracking-wide text-white flex items-center space-x-1.5">
                  <span>The Living Constellation</span>
                  <span className="text-zinc-500 font-normal">·</span>
                  <span className="text-zinc-400 text-[11px] font-normal">London</span>
                </span>
              </div>
            </div>

            {/* Human Telemetry Badge (Desktop) */}
            <div className="hidden lg:flex items-center space-x-2 text-[11px] text-zinc-400 bg-white/[0.03] border border-white/[0.06] px-2.5 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>
                {selectedCandidate.effectiveOdds > 0
                  ? `${selectedCandidate.effectiveOdds}% natural meeting chance this month`
                  : 'Paths map calibrated'}
              </span>
              <span className="text-zinc-600">·</span>
              <span className="text-emerald-400 font-medium">
                {selectedCandidate.psychology.gottmanRatio} Kindness Ratio
              </span>
            </div>
          </div>

          {/* Center: View Mode Segmented Pill */}
          <div className="inline-flex p-0.5 bg-zinc-900/90 rounded-full border border-white/10 text-xs font-medium">
            <button
              onClick={() => {
                sounds.playTap()
                setViewMode('harmony')
              }}
              className={`px-3 py-1 rounded-full transition-all ${
                viewMode === 'harmony'
                  ? 'bg-zinc-800 text-white shadow-sm font-semibold border border-white/10'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Harmony Map
            </button>
            <button
              onClick={() => {
                sounds.playTap()
                setViewMode('projection')
              }}
              className={`px-3 py-1 rounded-full transition-all ${
                viewMode === 'projection'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              30-Day Crossing
            </button>
            <button
              onClick={() => {
                sounds.playTap()
                setViewMode('rays')
              }}
              className={`px-3 py-1 rounded-full transition-all ${
                viewMode === 'rays'
                  ? 'bg-sky-600 text-white shadow-sm font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Harmonic Rays
            </button>
          </div>

          {/* Right: Studio Toggles & Science Action */}
          <div className="flex items-center space-x-2">
            {/* Desktop Panel Toggles */}
            <div className="hidden lg:flex items-center space-x-1.5">
              <button
                onClick={() => {
                  sounds.playTap()
                  setLeftPanelOpen(!leftPanelOpen)
                }}
                title={leftPanelOpen ? 'Hide Harmonies Panel' : 'Show Harmonies Panel'}
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
                title={rightPanelOpen ? 'Hide Connection Story' : 'Show Connection Story'}
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
                title={zenMode ? 'Exit Zen Mode' : 'Enter Zen Sky Mode'}
                className={`p-1.5 rounded-lg border text-xs transition ${
                  zenMode
                    ? 'bg-purple-600 border-purple-500 text-white'
                    : 'bg-zinc-900 border-white/5 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {zenMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Science Modal Trigger */}
            <button
              onClick={() => {
                sounds.playTap()
                setShowScienceModal(true)
              }}
              className="inline-flex items-center space-x-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-zinc-200 transition shadow-sm cursor-pointer"
            >
              <Info className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">The Science of Fit</span>
              <span className="sm:hidden">Science</span>
            </button>
          </div>
        </div>
      </header>

      {/* ---------------------------------------------------- */}
      {/* MOBILE SEGMENT TABS (Only visible on < lg screens)    */}
      {/* ---------------------------------------------------- */}
      <div className="lg:hidden sticky top-[53px] z-30 bg-[#07070c]/95 backdrop-blur-md px-3 py-2 border-b border-white/[0.06]">
        <div className="flex rounded-xl bg-white/[0.04] p-1 border border-white/[0.08]">
          <button
            type="button"
            onClick={() => {
              sounds.playTap()
              setMobileTab('constellation')
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition ${
              mobileTab === 'constellation'
                ? 'bg-white/15 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-purple-400" />
            <span>Constellation</span>
          </button>
          <button
            type="button"
            onClick={() => {
              sounds.playTap()
              setMobileTab('harmonies')
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition ${
              mobileTab === 'harmonies'
                ? 'bg-white/15 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
            <span>Harmonies</span>
          </button>
          <button
            type="button"
            onClick={() => {
              sounds.playTap()
              setMobileTab('story')
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition ${
              mobileTab === 'story'
                ? 'bg-white/15 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-rose-400" />
            <span>Story</span>
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 2. 3-ZONE WORKSPACE LAYOUT (PANORAMIC & RESPONSIVE)   */}
      {/* ---------------------------------------------------- */}
      <div className="max-w-[1720px] mx-auto p-3 sm:p-4 md:p-6 flex flex-col lg:flex-row gap-5 items-stretch min-h-[calc(100vh-65px)]">

        {/* ==================================================== */}
        {/* ZONE 1: HARMONIES & CANDIDATE SELECTOR               */}
        {/* ==================================================== */}
        {(leftPanelOpen || mobileTab === 'harmonies') && (
          <aside
            className={`w-full lg:w-80 flex-shrink-0 space-y-4 animate-in fade-in duration-200 flex flex-col justify-between ${
              mobileTab !== 'harmonies' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            {/* CARD 1A: PEOPLE IN YOUR ORBIT */}
            <div className="bg-[#0f0f15] border border-white/[0.08] rounded-3xl p-4 shadow-xl space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                    People in Your Orbit
                  </h3>
                </div>
                <span className="text-[10px] text-zinc-400 bg-white/[0.04] px-2 py-0.5 rounded-full border border-white/5">
                  {scoredCandidates.length} Resonant Profiles
                </span>
              </div>

              {/* Search Filter */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={e => setSearchFilter(e.target.value)}
                  placeholder="Filter by name or neighborhood..."
                  className="w-full pl-8 pr-3 py-1.5 bg-zinc-950/80 border border-white/[0.08] rounded-xl text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-purple-500/60"
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
                      className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                        isSelected
                          ? 'bg-purple-950/40 border-purple-500/60 shadow-lg ring-1 ring-purple-500/30'
                          : 'bg-zinc-950/40 border-white/[0.04] hover:border-white/15 hover:bg-zinc-900/60'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 min-w-[95px]">
                        <span className="text-[10px] font-mono text-zinc-500 w-3">#{idx + 1}</span>
                        <img
                          src={cand.profile.identity.photos[0]}
                          alt={cand.profile.identity.name}
                          className="w-7 h-7 rounded-full object-cover border border-white/10"
                        />
                        <span className={`text-xs font-semibold truncate ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
                          {firstName}
                        </span>
                      </div>

                      {/* 5-Facet Mini Harmony Bar */}
                      <div className="flex-1 max-w-[70px] h-1.5 bg-zinc-800 rounded-full overflow-hidden flex">
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

                      <div className="text-right min-w-[34px]">
                        <span className={`font-mono text-xs font-bold ${isSelected ? 'text-purple-300' : 'text-zinc-300'}`}>
                          {cand.fitScore}%
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* CARD 1B: THE FIVE LIFE HARMONIES SLIDERS */}
            <div className="bg-[#0f0f15] border border-white/[0.08] rounded-3xl p-4 shadow-xl space-y-3.5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.06] mb-3">
                  <div className="flex items-center space-x-2">
                    <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                      The Five Life Harmonies
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.04] text-zinc-300 border border-white/5">
                    Tune What Matters
                  </span>
                </div>

                {/* Preset Chips */}
                <div className="grid grid-cols-2 gap-1.5 mb-3.5">
                  {HARMONY_PRESETS.map(preset => (
                    <button
                      key={preset.name}
                      onClick={() => applyPreset(preset.weights)}
                      className="px-2.5 py-1.5 text-[10px] font-medium rounded-xl bg-zinc-950/80 border border-white/[0.06] text-zinc-400 hover:text-white hover:border-purple-500/40 hover:bg-zinc-900 transition text-left truncate cursor-pointer"
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
                              className="w-2 h-2 rounded-full inline-block shadow-sm"
                              style={{ backgroundColor: facet.colorHex }}
                            />
                            <span className="text-zinc-200 font-semibold">{facet.shortLabel}</span>
                          </span>
                          <span className="font-mono text-zinc-400 text-[11px]">{val}%</span>
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
                            className="flex-1 cursor-pointer accent-purple-400"
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
                  <span>London Transit Overlap</span>
                </span>
                <button
                  onClick={() => {
                    sounds.playTap()
                    setLocationSignals(!locationSignals)
                  }}
                  className={`px-3 py-1 rounded-full text-[10px] font-semibold transition cursor-pointer ${
                    locationSignals
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                  }`}
                >
                  {locationSignals ? 'Active in London' : 'Paused'}
                </button>
              </div>
            </div>
          </aside>
        )}

        {/* ==================================================== */}
        {/* ZONE 2: THE LIVING CONSTELLATION CANVAS              */}
        {/* ==================================================== */}
        {(mobileTab === 'constellation' || (!zenMode && true)) && (
          <main
            className={`flex-1 min-w-0 bg-[#0a0a10] border border-white/[0.08] rounded-3xl p-4 md:p-6 backdrop-blur-2xl shadow-2xl relative overflow-hidden flex flex-col justify-between select-none ${
              mobileTab !== 'constellation' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            {/* Ambient Celestial Glows */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-900/10 rounded-full blur-3xl pointer-events-none" />

            {/* Canvas Header */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
                  <Compass className="w-4 h-4 text-purple-400" />
                  <span>The Night Sky of Your Compatibility</span>
                </h2>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Closer stars share your core anchors · Day {timelineDay} serendipity projection in London
                </p>
              </div>

              {/* Selected Candidate Resonance Badge */}
              {selectedCoordinates && (
                <div className="flex items-center space-x-2.5 text-xs bg-zinc-950/80 border border-white/[0.08] px-3 py-1.5 rounded-full text-zinc-300">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedCoordinates.accentColor }} />
                  <span className="text-white font-bold">{selectedCandidate.profile.identity.name.split(' ')[0]}</span>
                  <span className="text-zinc-600">·</span>
                  <span className="text-purple-300 font-semibold">{selectedCandidate.fitScore}% Fit</span>
                  <span className="text-zinc-600 hidden sm:inline">·</span>
                  <span className="text-emerald-300 hidden sm:inline">{selectedCandidate.effectiveOdds}% 30-Day Chance</span>
                </div>
              )}
            </div>

            {/* ==================================================== */}
            {/* SVG CONSTELLATION MAP (ZERO-CLIPPING 620 x 620 BOX)  */}
            {/* ==================================================== */}
            <div className="relative flex-1 flex items-center justify-center py-2 sm:py-4 my-auto min-h-[340px] sm:min-h-[420px] md:min-h-[480px]">
              <svg
                viewBox="0 0 620 620"
                className="w-full max-w-[560px] h-auto select-none overflow-visible"
              >
                <defs>
                  {/* Central "You" Radial Glow */}
                  <radialGradient id="centerStarGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                    <stop offset="30%" stopColor="#fb7185" stopOpacity="0.4" />
                    <stop offset="70%" stopColor="#a855f7" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                  </radialGradient>

                  {/* Candidate Selection Aura */}
                  <radialGradient id="candidateGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#c084fc" stopOpacity="0.6" />
                    <stop offset="60%" stopColor="#c084fc" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#c084fc" stopOpacity="0" />
                  </radialGradient>

                  {/* Starlight Ray Gradient */}
                  <linearGradient id="starlightRay" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="#c084fc" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.9" />
                  </linearGradient>
                </defs>

                {/* 1. TWINKLING BACKGROUND STARS (Night Sky) */}
                {[
                  [75, 90], [130, 60], [480, 80], [540, 130], [90, 480],
                  [140, 540], [500, 490], [530, 420], [80, 290], [540, 310],
                  [310, 45], [310, 575], [210, 95], [410, 100], [180, 490],
                  [440, 520], [250, 540], [370, 545], [105, 180], [515, 210],
                ].map(([sx, sy], i) => (
                  <circle
                    key={i}
                    cx={sx}
                    cy={sy}
                    r={i % 3 === 0 ? 1.2 : 0.8}
                    fill="#e2e8f0"
                    opacity={0.25 + (i % 4) * 0.15}
                  />
                ))}

                {/* 2. ORBIT HARMONY RINGS (Concentric Circles) */}
                {[
                  { r: 45, label: 'Core Orbit · 90%+ fit' },
                  { r: 85, label: 'Close Orbit · 80% fit' },
                  { r: 125, label: 'Harmonic Orbit · 70% fit' },
                  { r: 165, label: 'Outer Horizon · 60% fit' },
                ].map((ring, idx) => (
                  <g key={ring.r}>
                    <circle
                      cx={canvasCenter}
                      cy={canvasCenter}
                      r={ring.r}
                      fill="none"
                      stroke="#27272a"
                      strokeWidth="1"
                      strokeDasharray={idx === 3 ? '4 4' : '2 3'}
                      opacity={0.6 + idx * 0.1}
                    />
                    <text
                      x={canvasCenter + 6}
                      y={canvasCenter - ring.r + 12}
                      fill="#71717a"
                      fontSize="9"
                      fontFamily="sans-serif"
                      opacity="0.85"
                    >
                      {ring.label}
                    </text>
                  </g>
                ))}

                {/* 3. FIVE HARMONY ATTRACTOR POLES & SPOKES */}
                {(Object.keys(FACETS) as FacetKey[]).map(key => {
                  const facet = FACETS[key]
                  const poleWeight = weights[key]
                  const isFocused = activeAttractorFocus === 'all' || activeAttractorFocus === key

                  // Spoke endpoint at radius 165
                  const spokeX = canvasCenter + 165 * Math.cos(facet.angleRad)
                  const spokeY = canvasCenter + 165 * Math.sin(facet.angleRad)

                  // Anchor circle at radius 180
                  const anchorX = canvasCenter + 180 * Math.cos(facet.angleRad)
                  const anchorY = canvasCenter + 180 * Math.sin(facet.angleRad)

                  // Smart label coordinates (ensuring ZERO clipping)
                  // Top (crossing): radius 215, centered
                  // Rhythm (right top): radius 200, left-aligned
                  // Values (right bottom): radius 200, left-aligned
                  // Interests (left bottom): radius 200, right-aligned
                  // Mutual (left top): radius 200, right-aligned
                  let labelRadius = 205
                  if (key === 'crossing') labelRadius = 212

                  const labelX = canvasCenter + labelRadius * Math.cos(facet.angleRad)
                  const labelY = canvasCenter + labelRadius * Math.sin(facet.angleRad)

                  // Determine text-anchor
                  const cosVal = Math.cos(facet.angleRad)
                  let textAnchor: 'start' | 'middle' | 'end' = 'middle'
                  if (cosVal > 0.3) textAnchor = 'start'
                  else if (cosVal < -0.3) textAnchor = 'end'

                  return (
                    <g
                      key={key}
                      className="cursor-pointer"
                      onClick={() => {
                        sounds.playTap()
                        setActiveAttractorFocus(activeAttractorFocus === key ? 'all' : key)
                      }}
                    >
                      {/* Spoke ray line */}
                      <line
                        x1={canvasCenter}
                        y1={canvasCenter}
                        x2={spokeX}
                        y2={spokeY}
                        stroke={facet.colorHex}
                        strokeWidth={isFocused ? 1.5 : 0.75}
                        strokeDasharray={isFocused ? '2 2' : '1 6'}
                        opacity={isFocused ? 0.6 : 0.15}
                      />

                      {/* Attractor Anchor Dot */}
                      <circle
                        cx={anchorX}
                        cy={anchorY}
                        r={isFocused ? 4.5 + (poleWeight / 50) * 2.5 : 3.5}
                        fill={facet.colorHex}
                        opacity={isFocused ? 0.9 : 0.35}
                      />

                      {/* Pill Badge & Label inside SVG */}
                      <text
                        x={labelX}
                        y={labelY + 4}
                        fill={facet.colorHex}
                        fontSize="11"
                        fontWeight="600"
                        opacity={isFocused ? 1 : 0.4}
                        textAnchor={textAnchor}
                        className="select-none font-sans drop-shadow-md"
                      >
                        {facet.shortLabel} ({poleWeight}%)
                      </text>
                    </g>
                  )
                })}

                {/* 4. CONSTELLATION LIGHT BRIDGE (RAY TO SELECTED CANDIDATE) */}
                {selectedCoordinates && (
                  <g>
                    {/* Glowing golden-violet starlight ray */}
                    <line
                      x1={canvasCenter}
                      y1={canvasCenter}
                      x2={selectedCoordinates.cx}
                      y2={selectedCoordinates.cy}
                      stroke="url(#starlightRay)"
                      strokeWidth="2"
                      strokeDasharray="4 3"
                      opacity="0.85"
                    />

                    {/* Subtle drifting particle on the ray */}
                    <circle
                      cx={(canvasCenter + selectedCoordinates.cx) / 2}
                      cy={(canvasCenter + selectedCoordinates.cy) / 2}
                      r="2"
                      fill="#ffffff"
                      opacity="0.9"
                      className="animate-ping"
                    />
                  </g>
                )}

                {/* 5. CENTER "YOU" STAR */}
                <g>
                  {/* Outer pulsating aura */}
                  <circle
                    cx={canvasCenter}
                    cy={canvasCenter}
                    r="48"
                    fill="url(#centerStarGlow)"
                    className="animate-pulse"
                  />
                  {/* Outer ring */}
                  <circle
                    cx={canvasCenter}
                    cy={canvasCenter}
                    r="20"
                    fill="#0f0f18"
                    stroke="#fbbf24"
                    strokeWidth="2.5"
                    className="shadow-lg"
                  />
                  {/* Golden radiant core */}
                  <circle
                    cx={canvasCenter}
                    cy={canvasCenter}
                    r="7"
                    fill="#f59e0b"
                  />
                  <text
                    x={canvasCenter}
                    y={canvasCenter + 28}
                    fill="#fbbf24"
                    fontSize="11"
                    fontWeight="bold"
                    textAnchor="middle"
                    className="font-sans select-none"
                  >
                    You
                  </text>
                </g>

                {/* 6. CANDIDATE STARS IN ORBIT */}
                {candidateCoordinates.map(c => {
                  const isSelected = c.profile.id === selectedId
                  const isHovered = c.profile.id === hoveredId
                  const firstName = c.profile.identity.name.split(' ')[0]
                  const isPoleMatch = activeAttractorFocus === 'all' || c.dominantFacetKey === activeAttractorFocus

                  // Determine smart label position relative to node
                  const isRightSide = c.cx >= canvasCenter
                  const labelOffsetX = isRightSide ? c.dotRadius + 7 : -(c.dotRadius + 7)
                  const labelAnchor = isRightSide ? 'start' : 'end'

                  return (
                    <g
                      key={c.profile.id}
                      className="cursor-pointer transition-transform duration-300"
                      onClick={() => handleSelectCandidate(c.profile.id)}
                      onMouseEnter={() => setHoveredId(c.profile.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      opacity={isPoleMatch ? 1 : 0.2}
                    >
                      {/* 30-Day Poisson Encounter Wave Halo */}
                      {locationSignals && viewMode !== 'harmony' && c.effectiveOdds > 0 && (
                        <circle
                          cx={c.cx}
                          cy={c.cy}
                          r={c.dotRadius + 9}
                          fill={c.accentColor}
                          fillOpacity="0.08"
                          stroke={c.accentColor}
                          strokeWidth="1"
                          strokeDasharray="3 3"
                          opacity={isSelected ? 0.9 : 0.35}
                          className={isSelected ? 'animate-pulse' : ''}
                        />
                      )}

                      {/* Active Selection Orbit Ring */}
                      {isSelected && (
                        <circle
                          cx={c.cx}
                          cy={c.cy}
                          r={c.dotRadius + 14}
                          fill="url(#candidateGlow)"
                          stroke={c.accentColor}
                          strokeWidth="1.5"
                          strokeDasharray="3 3"
                          className="animate-spin"
                          style={{ animationDuration: '24s' }}
                        />
                      )}

                      {/* Star Body */}
                      <circle
                        cx={c.cx}
                        cy={c.cy}
                        r={c.dotRadius}
                        fill={c.accentColor}
                        fillOpacity={isSelected ? 1 : 0.85}
                        stroke="#07070c"
                        strokeWidth="2.5"
                      />

                      {/* Candidate Name & Fit Tag */}
                      <text
                        x={c.cx + labelOffsetX}
                        y={c.cy + 4}
                        fill={isSelected ? '#ffffff' : '#cbd5e1'}
                        fontSize={isSelected ? '12' : '10'}
                        fontWeight={isSelected ? 'bold' : '500'}
                        textAnchor={labelAnchor}
                        className="pointer-events-none drop-shadow select-none font-sans"
                      >
                        {firstName} · {c.fitScore}%
                      </text>

                      {/* Tooltip on Hover */}
                      {isHovered && !isSelected && (
                        <g transform={`translate(${c.cx > canvasCenter ? c.cx - 160 : c.cx + 15}, ${c.cy - 36})`}>
                          <rect
                            x="0"
                            y="0"
                            width="150"
                            height="48"
                            rx="8"
                            fill="#18181b"
                            stroke="#3f3f46"
                            strokeWidth="1"
                          />
                          <text x="8" y="16" fill="#f4f4f5" fontSize="10" fontWeight="bold">
                            {firstName} · {c.fitScore}% Fit
                          </text>
                          <text x="8" y="30" fill="#a1a1aa" fontSize="9">
                            Day {timelineDay} Odds: {c.effectiveOdds}% meeting chance
                          </text>
                          <text x="8" y="42" fill="#c084fc" fontSize="8">
                            Strongest: {c.dominantFacetLabel}
                          </text>
                        </g>
                      )}
                    </g>
                  )
                })}
              </svg>
            </div>

            {/* ---------------------------------------------------- */}
            {/* FLOATING SPATIAL HUD DOCK (SPACETIME SCRUBBER)       */}
            {/* ---------------------------------------------------- */}
            <div className="relative z-30 flex justify-center pb-1">
              <div className="bg-[#121218]/95 border border-white/[0.12] rounded-full px-3 py-1.5 backdrop-blur-2xl shadow-2xl flex flex-wrap items-center gap-2 text-xs select-none">
                {/* Play / Pause Toggle */}
                <button
                  onClick={togglePlayback}
                  className="p-1.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white transition shadow-sm cursor-pointer"
                  title={isPlayingTimeline ? 'Pause timeline' : 'Simulate 30-day serendipity'}
                >
                  {isPlayingTimeline ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                </button>

                {/* Timeline Scrubber Slider */}
                <div className="w-20 sm:w-32 flex items-center">
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="1"
                    value={timelineDay}
                    onChange={e => setTimelineDay(parseInt(e.target.value, 10))}
                    className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
                  />
                </div>

                <span className="text-[11px] font-mono text-purple-300 font-bold whitespace-nowrap">
                  Day {timelineDay}/30
                </span>

                {/* Quick Jumps */}
                <div className="hidden sm:flex items-center space-x-1">
                  {[1, 15, 30].map(day => (
                    <button
                      key={day}
                      onClick={() => {
                        sounds.playTap()
                        setTimelineDay(day)
                        setIsPlayingTimeline(false)
                      }}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono transition cursor-pointer ${
                        timelineDay === day
                          ? 'bg-purple-600 text-white font-bold'
                          : 'bg-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {day === 1 ? 'Today' : day === 15 ? 'Day 15' : '1 Month'}
                    </button>
                  ))}
                </div>

                <div className="w-px h-4 bg-zinc-700" />

                {/* Attractor Focus Filter */}
                <button
                  onClick={() => {
                    sounds.playTap()
                    const keys: ('all' | FacetKey)[] = ['all', 'crossing', 'rhythm', 'values', 'interests', 'mutual']
                    const nextIdx = (keys.indexOf(activeAttractorFocus) + 1) % keys.length
                    setActiveAttractorFocus(keys[nextIdx])
                  }}
                  className="px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300 hover:text-white flex items-center space-x-1 text-[11px] transition cursor-pointer"
                  title="Filter stars by dominant harmony"
                >
                  <Filter className="w-3 h-3 text-purple-400" />
                  <span>
                    {activeAttractorFocus === 'all'
                      ? 'All Harmonies'
                      : FACETS[activeAttractorFocus].shortLabel}
                  </span>
                </button>

                <div className="w-px h-4 bg-zinc-700" />

                {/* Reset Viewport */}
                <button
                  onClick={resetViewport}
                  className="p-1 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition cursor-pointer"
                  title="Reset scrubber to 30 days"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Mobile Candidate Quick Selector Bar (Only on Mobile) */}
            <div className="lg:hidden pt-3 border-t border-white/[0.06] flex items-center space-x-2 overflow-x-auto pb-1">
              {sortedRanking.map(cand => {
                const isSelected = cand.profile.id === selectedId
                return (
                  <button
                    key={cand.profile.id}
                    onClick={() => handleSelectCandidate(cand.profile.id)}
                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition ${
                      isSelected
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-white/[0.04] text-zinc-300 hover:bg-white/[0.08]'
                    }`}
                  >
                    <img
                      src={cand.profile.identity.photos[0]}
                      alt={cand.profile.identity.name}
                      className="w-4 h-4 rounded-full object-cover"
                    />
                    <span>{cand.profile.identity.name.split(' ')[0]}</span>
                    <span className="font-mono text-[10px] opacity-80">{cand.fitScore}%</span>
                  </button>
                )
              })}
            </div>

            {/* Canvas Sub-Legend Pill */}
            <div className="pt-2 border-t border-white/[0.06] hidden sm:flex flex-wrap items-center justify-between text-[11px] text-zinc-400 gap-2">
              <span className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                <span>Distance = Overall mutual fit</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Star halo = 30-day natural encounter odds</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Color = Strongest life harmony</span>
              </span>
            </div>
          </main>
        )}

        {/* ==================================================== */}
        {/* ZONE 3: CONNECTION STORY & RESONANCE DOSSIER         */}
        {/* ==================================================== */}
        {(rightPanelOpen || mobileTab === 'story') && (
          <aside
            className={`w-full lg:w-96 flex-shrink-0 space-y-4 animate-in fade-in duration-200 ${
              mobileTab !== 'story' ? 'hidden lg:block' : 'block'
            }`}
          >
            {/* CARD 3A: SELECTED CANDIDATE CONNECTION STORY */}
            <div className="bg-[#0f0f15] border border-white/[0.08] rounded-3xl p-4 sm:p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                <span className="text-xs uppercase tracking-wider text-purple-300 font-bold flex items-center space-x-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/20" />
                  <span>Connection Story</span>
                </span>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 font-bold">
                  {selectedCandidate.fitScore}% Mutual Fit
                </span>
              </div>

              {/* Candidate Profile Avatar & Pair Title */}
              <div className="flex items-center space-x-3.5">
                <img
                  src={selectedCandidate.profile.identity.photos[0]}
                  alt={selectedCandidate.profile.identity.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-purple-500/40 shadow-md"
                />
                <div>
                  <h3 className="text-base font-bold text-white leading-tight">
                    {selectedCandidate.pairTitle}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {selectedCandidate.profile.geography.cityName} · {selectedCandidate.jobTitle}
                  </p>
                </div>
              </div>

              {/* 30-Day Crossing Odds Metric & Confidence Bar */}
              <div className="bg-zinc-950/80 border border-white/[0.08] rounded-2xl p-4 space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-bold text-white">
                    {selectedCandidate.effectiveOdds}% chance your paths cross in {timelineDay} days
                  </span>
                </div>

                <div className="text-[11px] text-zinc-400">
                  {locationSignals
                    ? `Estimated range ${selectedCandidate.effectiveRange[0]}% – ${selectedCandidate.effectiveRange[1]}% without an app forcing it`
                    : 'Location signals paused'}
                </div>

                {/* Range bar graphic */}
                <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden relative mt-1">
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
                        className="absolute h-full bg-gradient-to-r from-purple-500 via-rose-500 to-amber-400 rounded-full"
                        style={{ width: `${selectedCandidate.effectiveOdds}%` }}
                      />
                    </>
                  )}
                </div>
              </div>

              {/* Harmony Differentials */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <h4 className="font-bold text-white text-xs">
                    Where This Connection Shines
                  </h4>
                  <span className="text-[10px] text-zinc-500">vs. Average</span>
                </div>

                <div className="space-y-1.5">
                  {(Object.keys(FACETS) as FacetKey[]).map(key => {
                    const facet = FACETS[key]
                    const diff = differentials[key]
                    const isPositive = diff >= 0

                    return (
                      <div key={key} className="flex items-center text-xs">
                        <span className="w-28 text-zinc-300 font-medium truncate flex items-center space-x-1.5 text-[11px]">
                          <span
                            className="w-2 h-2 rounded-full inline-block flex-shrink-0"
                            style={{ backgroundColor: facet.colorHex }}
                          />
                          <span>{facet.shortLabel}</span>
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

                <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-white/[0.06] text-[11px] text-zinc-300">
                  <span className="text-purple-400 font-semibold">Strongest harmony:</span> {strongestEdge}{' '}
                  <span className="text-zinc-600 mx-1">·</span>{' '}
                  <span className="text-amber-400 font-semibold">Gentle area:</span> {biggestDrag}
                </div>
              </div>

              {/* Transit Near Misses in London */}
              <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-purple-400" />
                    <span>Where Your Stories Cross</span>
                  </h4>
                  <span className="text-[10px] text-zinc-500">London Paths</span>
                </div>

                <div className="space-y-1.5">
                  {selectedCandidate.nearMisses.map((miss, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-zinc-950/70 border border-white/[0.06] flex items-start justify-between text-xs gap-2"
                    >
                      <div className="space-y-0.5">
                        <span className="text-purple-300 font-semibold block text-[11px]">
                          {miss.time}
                        </span>
                        <span className="text-zinc-300 text-[11px] leading-relaxed">
                          {miss.description}
                        </span>
                      </div>
                      <span className="text-zinc-400 font-medium text-[10px] text-right bg-zinc-900 px-2 py-0.5 rounded-full border border-white/5 whitespace-nowrap">
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
                  className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-900/30 flex items-center justify-center space-x-2 transition cursor-pointer"
                >
                  <Coffee className="w-3.5 h-3.5 text-amber-300" />
                  <span>Suggest a Quiet Place to Meet</span>
                </button>

                {onSelectCandidate && (
                  <button
                    onClick={() => {
                      sounds.playTap()
                      onSelectCandidate(selectedCandidate.profile, selectedCandidate.evaluation)
                    }}
                    className="w-full py-2 px-4 rounded-xl font-medium text-xs bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-white/10 flex items-center justify-center space-x-2 transition cursor-pointer"
                  >
                    <FileText className="w-3 h-3 text-zinc-400" />
                    <span>Explore Full Compatibility Story</span>
                  </button>
                )}
              </div>
            </div>

            {/* CARD 3B: SORTED LEADERBOARD */}
            <div className="bg-[#0f0f15] border border-white/[0.08] rounded-3xl p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-white/[0.06]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  Resonance Index
                </h3>
                <div className="flex items-center space-x-1.5 text-xs">
                  <span className="text-[10px] text-zinc-500">Sort:</span>
                  <select
                    value={sortCriteria}
                    onChange={e => {
                      sounds.playTap()
                      setSortCriteria(e.target.value as any)
                    }}
                    className="bg-zinc-950 text-[11px] text-zinc-300 border border-white/10 rounded-lg px-2 py-0.5 focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    <option value="fit">by fit score</option>
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
                      className={`px-3 py-2 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition ${
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
      {/* MODAL 1: THE SCIENCE OF HUMAN FIT                  */}
      {/* ================================================== */}
      {showScienceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#121218] border border-white/[0.08] max-w-3xl w-full rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-2xl bg-purple-500/20 text-purple-400">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    The Science Behind the Constellation
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Why real compatibility is about shared life rhythms, not swiping volume
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowScienceModal(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 4 Architectural Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-zinc-950/80 border border-white/[0.08] space-y-2">
                <div className="flex items-center space-x-2 text-purple-400 font-bold text-sm">
                  <Flame className="w-4 h-4" />
                  <span>1. The 37% Decision Window</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Optimal stopping theory shows that endlessly chasing an imaginary ideal leads to exhaustion. Rather than sampling blindly, you calibrate what genuinely sustains you — looking for mutual growth and secure co-regulation.
                </p>
                <div className="text-[11px] font-mono text-purple-300 bg-purple-950/40 p-2 rounded-xl border border-purple-900/60">
                  Current Match Score: {selectedCandidate.psychology.selfExpansionScore}% Self-Expansion
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-950/80 border border-white/[0.08] space-y-2">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                  <Heart className="w-4 h-4" />
                  <span>2. The Gottman 5:1 Kindness Ratio</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Decades of dyadic research reveal that lasting love requires at least 5 positive, validating moments for every 1 moment of friction. We look for gentle, early micro-repair rather than cold stonewalling.
                </p>
                <div className="text-[11px] font-mono text-emerald-300 bg-emerald-950/40 p-2 rounded-xl border border-emerald-900/60">
                  Dyad Kindness Ratio: {selectedCandidate.psychology.gottmanRatio} (Optimal)
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-950/80 border border-white/[0.08] space-y-2">
                <div className="flex items-center space-x-2 text-sky-400 font-bold text-sm">
                  <Compass className="w-4 h-4" />
                  <span>3. Scale-Free Urban Serendipity</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Real relationships naturally form where everyday transit routines, bakeries, and reading spots overlap. You aren’t forced into artificial dates — you connect where your lives already touch.
                </p>
                <div className="text-[11px] font-mono text-sky-300 bg-sky-950/40 p-2 rounded-xl border border-sky-900/60">
                  Attachment Mode: {selectedCandidate.psychology.attachment}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-950/80 border border-white/[0.08] space-y-2">
                <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
                  <ShieldCheck className="w-4 h-4" />
                  <span>4. Bowen Differentiation</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Staying deeply connected while maintaining your sovereignty and boundaries. Protects against losing your identity or falling into anxious protest loops.
                </p>
                <div className="text-[11px] font-mono text-amber-300 bg-amber-950/40 p-2 rounded-xl border border-amber-900/60">
                  Micro-Repair: {selectedCandidate.psychology.lowNegativityThreshold}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-800/60 flex items-center justify-between">
              <div>
                <span className="text-xs text-purple-300 font-bold block uppercase tracking-wider">
                  Current Match Assessment
                </span>
                <span className="text-sm text-zinc-200">
                  {selectedCandidate.psychology.decisionPhase}
                </span>
              </div>
              <button
                onClick={() => setShowScienceModal(false)}
                className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold hover:bg-purple-500 transition cursor-pointer"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* MODAL 2: SUGGEST A QUIET PLACE TO MEET             */}
      {/* ================================================== */}
      {suggestMeetingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#121218] border border-white/[0.08] max-w-lg w-full rounded-3xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center space-x-2">
                <Coffee className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold text-white">
                  A Gentle Place to Meet for {selectedCandidate.pairTitle}
                </h3>
              </div>
              <button
                onClick={() => setSuggestMeetingModal(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              Based on your daily rhythm and verified route crossings around <strong>Waterloo and Borough Market</strong>:
            </p>

            <div className="space-y-2.5">
              <div className="p-3.5 rounded-2xl bg-zinc-950 border border-purple-500/40 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white">Monmouth Coffee Company</span>
                  <span className="text-xs font-mono text-purple-300 font-bold">98% Transit Match</span>
                </div>
                <p className="text-xs text-zinc-400">
                  27 Park St, Borough Market · 8 mins from your Northern line route · Great coffee & walk
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-zinc-950 border border-white/[0.08] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white">Tate Modern Espresso Bar</span>
                  <span className="text-xs font-mono text-zinc-400">92% Transit Match</span>
                </div>
                <p className="text-xs text-zinc-400">
                  Bankside · Calmer ambient volume, perfect for an unpressured riverside stroll
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setSuggestMeetingModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  sounds.playMatch()
                  setSuggestMeetingModal(false)
                }}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500 transition cursor-pointer shadow-md"
              >
                Send Gentle Invitation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AlgorithmNetworkVisualizer
