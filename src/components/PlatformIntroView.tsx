// ============================================================================
// src/components/PlatformIntroView.tsx
// Wingman / Connect: Universe of Possibilities & Simplified Math Simulation
// Multi-Dimensional Reciprocal Matching Network in a Clean, Apple-Grade UI
// Inspired by: Connect Universe Architecture & The Mathematics of Love
// ============================================================================

import React, { useState } from 'react'
import {
  Sparkles,
  ArrowRight,
  Check,
  AlertCircle,
  HelpCircle,
  Heart,
  Activity,
  Compass,
  MapPin,
  Flame,
  Home,
  MessageSquare,
  ChevronDown,
  Infinity as InfinityIcon,
  RotateCcw,
} from 'lucide-react'
import { sounds } from '../utils/sound'

interface PlatformIntroViewProps {
  onEnterDiscovery: () => void
  onExploreAuditor: () => void
}

// 8 Core Dimension Satellites in the Universe
interface DimensionSatellite {
  id: string
  label: string
  scoreDiff: string
  icon: React.FC<{ className?: string }>
  colorHex: string
  glowClass: string
  angleDeg: number // Angular placement on ellipse
  distRadius: number // Distance from center
  description: string
  associatedCandidateId: string
}

const DIMENSION_SATELLITES: DimensionSatellite[] = [
  {
    id: 'values',
    label: 'Shared Values',
    scoreDiff: '+89%',
    icon: Heart,
    colorHex: '#f43f5e',
    glowClass: 'shadow-[0_0_20px_rgba(244,63,94,0.35)] border-rose-500/50',
    angleDeg: -110,
    distRadius: 185,
    description: 'Philosophical ethics, long-term morality, and interpersonal trust',
    associatedCandidateId: 'alex',
  },
  {
    id: 'lifestyle',
    label: 'Lifestyle Fit',
    scoreDiff: '+76%',
    icon: Activity,
    colorHex: '#06b6d4',
    glowClass: 'shadow-[0_0_20px_rgba(6,182,212,0.35)] border-cyan-500/50',
    angleDeg: -65,
    distRadius: 195,
    description: 'Circadian rhythms, dietary habits, and domestic cadence',
    associatedCandidateId: 'maya',
  },
  {
    id: 'longterm',
    label: 'Long-Term Potential',
    scoreDiff: '+82%',
    icon: Sparkles,
    colorHex: '#eab308',
    glowClass: 'shadow-[0_0_20px_rgba(234,179,8,0.35)] border-amber-500/50',
    angleDeg: -20,
    distRadius: 180,
    description: 'Shared vision for life trajectory, partnership, and stability',
    associatedCandidateId: 'julian',
  },
  {
    id: 'culture',
    label: 'Cultural Alignment',
    scoreDiff: '+81%',
    icon: Compass,
    colorHex: '#10b981',
    glowClass: 'shadow-[0_0_20px_rgba(16,185,129,0.35)] border-emerald-500/50',
    angleDeg: 25,
    distRadius: 190,
    description: 'Shared intellectual language, humor, and cultural references',
    associatedCandidateId: 'priya',
  },
  {
    id: 'geography',
    label: 'Geographic Feasibility',
    scoreDiff: '+74%',
    icon: MapPin,
    colorHex: '#a855f7',
    glowClass: 'shadow-[0_0_20px_rgba(168,85,247,0.35)] border-purple-500/50',
    angleDeg: 70,
    distRadius: 185,
    description: 'Spatial feasibility across urban transit corridors and commute zones',
    associatedCandidateId: 'alex',
  },
  {
    id: 'attraction',
    label: 'Mutual Attraction',
    scoreDiff: '+68%',
    icon: Flame,
    colorHex: '#ec4899',
    glowClass: 'shadow-[0_0_20px_rgba(236,72,153,0.35)] border-pink-500/50',
    angleDeg: 115,
    distRadius: 180,
    description: 'Reciprocal aesthetic appreciation and emotional warmth',
    associatedCandidateId: 'marcus',
  },
  {
    id: 'family',
    label: 'Family Goals',
    scoreDiff: '+77%',
    icon: Home,
    colorHex: '#f59e0b',
    glowClass: 'shadow-[0_0_20px_rgba(245,158,11,0.35)] border-amber-500/50',
    angleDeg: 160,
    distRadius: 195,
    description: 'Reproductive timeline, parenting philosophies, and elder care',
    associatedCandidateId: 'priya',
  },
  {
    id: 'communication',
    label: 'Communication Style',
    scoreDiff: '+88%',
    icon: MessageSquare,
    colorHex: '#0284c7',
    glowClass: 'shadow-[0_0_20px_rgba(2,132,199,0.35)] border-sky-500/50',
    angleDeg: -160,
    distRadius: 190,
    description: 'Conflict repair latency, emotional openness, and digital cadence',
    associatedCandidateId: 'maya',
  },
]

// Simulation Candidate Dossiers for the Right-Side Inspector
interface SimulationCandidate {
  id: string
  name: string
  age: number
  location: string
  avatar: string
  mutualScore: number
  compatibilityCategory: string
  vector: {
    values: number
    lifestyle: number
    communication: number
    family: number
    attraction: number
    geography: number
    mutuality: number
  }
  whyThisMatch: {
    strongAlignment: string[]
    potentialFriction: string[]
    unknown: string[]
  }
}

const SIMULATION_CANDIDATES: Record<string, SimulationCandidate> = {
  alex: {
    id: 'alex',
    name: 'Alex Rivera',
    age: 27,
    location: 'London · Shoreditch',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    mutualScore: 92,
    compatibilityCategory: 'High Mutual Compatibility',
    vector: {
      values: 96,
      lifestyle: 88,
      communication: 91,
      family: 84,
      attraction: 78,
      geography: 72,
      mutuality: 92,
    },
    whyThisMatch: {
      strongAlignment: [
        'Shared values and life goals (Progressive humanist)',
        'Similar communication style (Low latency, direct)',
        'Compatible lifestyle preferences (Plant-based focus)',
      ],
      potentialFriction: [
        'Distance (25 km transit commute)',
        'Different dietary preferences (Flexitarian overlap)',
      ],
      unknown: [
        'Religious practice observance',
        'Extended family holiday rituals',
      ],
    },
  },
  maya: {
    id: 'maya',
    name: 'Maya Lin',
    age: 31,
    location: 'London · Bloomsbury',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    mutualScore: 94,
    compatibilityCategory: 'Rare, Beautiful Connection',
    vector: {
      values: 95,
      lifestyle: 84,
      communication: 92,
      family: 80,
      attraction: 88,
      geography: 94,
      mutuality: 94,
    },
    whyThisMatch: {
      strongAlignment: [
        'Shared aesthetic architecture and spatial design passion',
        'Synchronized sleep chronotype and morning tempo',
        'High mutual desire and rapid repair within 15 mins',
      ],
      potentialFriction: [
        'Introvert social recovery hours on alternate weekends',
      ],
      unknown: [
        'Pets cohabitation (Cats vs hypoallergenic dogs)',
      ],
    },
  },
  julian: {
    id: 'julian',
    name: 'Julian Vance',
    age: 29,
    location: 'London · Camden',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    mutualScore: 88,
    compatibilityCategory: 'High Cognitive Resonance',
    vector: {
      values: 85,
      lifestyle: 90,
      communication: 88,
      family: 88,
      attraction: 82,
      geography: 75,
      mutuality: 88,
    },
    whyThisMatch: {
      strongAlignment: [
        'Cognitive science research and speculative literature synergy',
        'Identical long-term intention for domestic stability',
        'Gottman 5.8:1 emotional equilibrium during debate',
      ],
      potentialFriction: [
        'Weekend writing immersion periods require independent time',
      ],
      unknown: [
        'International relocation openness after 5 years',
      ],
    },
  },
  priya: {
    id: 'priya',
    name: 'Priya Sharma',
    age: 28,
    location: 'London · Hackney',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    mutualScore: 86,
    compatibilityCategory: 'Strong Family & Cultural Fit',
    vector: {
      values: 90,
      lifestyle: 80,
      communication: 85,
      family: 92,
      attraction: 80,
      geography: 85,
      mutuality: 86,
    },
    whyThisMatch: {
      strongAlignment: [
        'Aligned family goals and long-term child-rearing plans',
        'High moral integrity and progressive civic values',
        'Shared passion for environmental urban planning',
      ],
      potentialFriction: [
        'Busy evening schedule during festival seasons',
      ],
      unknown: [
        'Specific extended family co-living preferences',
      ],
    },
  },
  marcus: {
    id: 'marcus',
    name: 'Marcus Chen',
    age: 28,
    location: 'London · Shoreditch',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    mutualScore: 82,
    compatibilityCategory: 'High Creative Synergy',
    vector: {
      values: 80,
      lifestyle: 82,
      communication: 80,
      family: 75,
      attraction: 85,
      geography: 88,
      mutuality: 82,
    },
    whyThisMatch: {
      strongAlignment: [
        'Art exhibition visits and electronic synthesizer design',
        'High physical and intellectual attraction overlap',
        'Low distance gap (15 mins on Central line)',
      ],
      potentialFriction: [
        'Flexible schedule conflicts with strict calendar planning',
      ],
      unknown: [
        'Long-term career relocation desires',
      ],
    },
  },
}

export const PlatformIntroView: React.FC<PlatformIntroViewProps> = ({
  onEnterDiscovery,
  onExploreAuditor,
}) => {
  // Selected candidate in the simulation
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>('alex')
  // Active satellite filter
  const [selectedSatelliteId, setSelectedSatelliteId] = useState<string | null>(null)
  // Accordion open/close state
  const [whyMatchOpen, setWhyMatchOpen] = useState<boolean>(true)
  // Resonance orbit wave pulse state
  const [isOrbitPulsing, setIsOrbitPulsing] = useState<boolean>(true)

  const activeCandidate = SIMULATION_CANDIDATES[selectedCandidateId] || SIMULATION_CANDIDATES.alex

  // SVG Center & Dimension Coordinates (Spacious & Uncrowded Canvas)
  const canvasCenter = { x: 300, y: 250 }

  return (
    <div className="space-y-12 py-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-slate-100 font-sans">

      {/* ======================================================== */}
      {/* 1. EDITORIAL HEADER & HIGH-LEVEL MANIFESTO               */}
      {/* ======================================================== */}
      <header className="space-y-4 text-center max-w-3xl mx-auto pt-4 pb-2">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono">
          <InfinityIcon className="w-4 h-4 text-cyan-400" />
          <span>More Than a Match. A Universe of Possibilities.</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
          The Science of Who Fits You.
        </h1>
        <p className="text-sm sm:text-base text-slate-400 font-light leading-relaxed">
          Traditional dating apps reduce human complexity to a 2D photo and an arbitrary percentage. Wingman calculates multi-dimensional compatibility, reciprocal mutuality, and real-world urban feasibility on an uncrowded dynamic graph.
        </p>
      </header>

      {/* ======================================================== */}
      {/* 2. MATCH UNIVERSE TELEMETRY PILL (SPACIOUS & ELEGANT)    */}
      {/* ======================================================== */}
      <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur shadow-xl text-center">
        <div className="space-y-0.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
            Total Possible Matches
          </span>
          <span className="text-xl sm:text-2xl font-bold font-mono text-white flex items-center justify-center space-x-1">
            <InfinityIcon className="w-5 h-5 text-cyan-400 inline" />
          </span>
        </div>

        <div className="space-y-0.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
            High Compatibility Pool
          </span>
          <span className="text-xl sm:text-2xl font-bold font-mono text-purple-300">
            12,480
          </span>
        </div>

        <div className="space-y-0.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
            Mutual Matches
          </span>
          <span className="text-xl sm:text-2xl font-bold font-mono text-emerald-300">
            3,672
          </span>
        </div>

        <div className="space-y-0.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
            New Space-Time Overlaps
          </span>
          <span className="text-xl sm:text-2xl font-bold font-mono text-amber-300">
            284 today
          </span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. MAIN STAGE: THE NETWORK GRAPH & MATCH POTENTIAL CARD  */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* ------------------------------------------------------ */}
        {/* LEFT / CENTER: THE CELESTIAL NETWORK UNIVERSE CANVAS   */}
        {/* ------------------------------------------------------ */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-3xl p-5 md:p-6 backdrop-blur shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
                <Compass className="w-5 h-5 text-cyan-400" />
                <span>Your Compatibility Universe</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Click any satellite or candidate to inspect multi-dimensional resonance
              </p>
            </div>

            <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-950 text-slate-300 border border-slate-800 hidden sm:inline">
              Interactive Simulation
            </span>
          </div>

          {/* SVG Network Graph */}
          <div className="relative py-4 flex items-center justify-center">
            <svg
              viewBox="0 0 600 500"
              className="w-full max-w-[560px] h-auto select-none overflow-visible"
            >
              <defs>
                <radialGradient id="univCenterGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.5" />
                  <stop offset="50%" stopColor="#818cf8" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="activeNodeGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#c084fc" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#c084fc" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Luminous Curved Connection Splines to Satellites */}
              {DIMENSION_SATELLITES.map((sat) => {
                const rad = (sat.angleDeg * Math.PI) / 180
                const sx = canvasCenter.x + sat.distRadius * Math.cos(rad)
                const sy = canvasCenter.y + sat.distRadius * Math.sin(rad)
                const isFocused = selectedSatelliteId === sat.id || selectedSatelliteId === null

                // Control point for smooth curve
                const cpx = (canvasCenter.x + sx) / 2 + Math.sin(rad) * 20
                const cpy = (canvasCenter.y + sy) / 2 - Math.cos(rad) * 20

                return (
                  <path
                    key={`line_${sat.id}`}
                    d={`M ${canvasCenter.x} ${canvasCenter.y} Q ${cpx} ${cpy} ${sx} ${sy}`}
                    fill="none"
                    stroke={sat.colorHex}
                    strokeWidth={isFocused ? 2 : 1}
                    strokeDasharray={isFocused ? 'none' : '3 3'}
                    opacity={isFocused ? 0.75 : 0.25}
                    className="transition-all duration-300"
                  />
                )
              })}

              {/* CENTER "YOU" NODE */}
              <g
                className="cursor-pointer"
                onClick={() => {
                  sounds.playTap()
                  setSelectedSatelliteId(null)
                }}
              >
                <circle cx={canvasCenter.x} cy={canvasCenter.y} r="48" fill="url(#univCenterGlow)" />
                <circle
                  cx={canvasCenter.x}
                  cy={canvasCenter.y}
                  r="22"
                  fill="#090d16"
                  stroke="#38bdf8"
                  strokeWidth="3"
                  className="shadow-lg"
                />
                <text
                  x={canvasCenter.x}
                  y={canvasCenter.y + 4}
                  fill="#ffffff"
                  fontSize="11"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  You
                </text>
                <text
                  x={canvasCenter.x}
                  y={canvasCenter.y + 36}
                  fill="#94a3b8"
                  fontSize="8"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  Your Values &amp; Dreams
                </text>
              </g>

              {/* 8 DIMENSION SATELLITES & ORBITING CANDIDATE NODES */}
              {DIMENSION_SATELLITES.map((sat) => {
                const rad = (sat.angleDeg * Math.PI) / 180
                const sx = canvasCenter.x + sat.distRadius * Math.cos(rad)
                const sy = canvasCenter.y + sat.distRadius * Math.sin(rad)
                const isSelected = selectedSatelliteId === sat.id
                const isAssociatedCandidate = selectedCandidateId === sat.associatedCandidateId

                return (
                  <g
                    key={sat.id}
                    className="cursor-pointer transition-transform duration-300"
                    onClick={() => {
                      sounds.playTap()
                      setSelectedSatelliteId(sat.id)
                      setSelectedCandidateId(sat.associatedCandidateId)
                    }}
                  >
                    {/* Active Halo */}
                    {(isSelected || isAssociatedCandidate) && (
                      <circle
                        cx={sx}
                        cy={sy}
                        r="32"
                        fill={sat.colorHex}
                        fillOpacity="0.2"
                        stroke={sat.colorHex}
                        strokeWidth="1.5"
                        strokeDasharray="2 2"
                        className="animate-pulse"
                      />
                    )}

                    {/* Satellite Node Body */}
                    <circle
                      cx={sx}
                      cy={sy}
                      r="18"
                      fill="#090d16"
                      stroke={sat.colorHex}
                      strokeWidth="2.5"
                    />

                    {/* Orbiting Satellite Score Badge */}
                    <rect
                      x={sx - 18}
                      y={sy - 28}
                      width="36"
                      height="14"
                      rx="4"
                      fill="#0f172a"
                      stroke={sat.colorHex}
                      strokeWidth="1"
                    />
                    <text
                      x={sx}
                      y={sy - 18}
                      fill={sat.colorHex}
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {sat.scoreDiff}
                    </text>

                    {/* Satellite Label */}
                    <text
                      x={sx}
                      y={sy + 26}
                      fill={isSelected ? '#ffffff' : '#cbd5e1'}
                      fontSize="10"
                      fontWeight="600"
                      textAnchor="middle"
                      className="drop-shadow"
                    >
                      {sat.label}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>

          {/* ---------------------------------------------------- */}
          {/* FLOATING CANVAS HUD DOCK (ONLOOK SIGNATURE PILL)     */}
          {/* ---------------------------------------------------- */}
          <div className="relative z-30 flex justify-center pb-2">
            <div className="bg-[#18181b]/90 border border-white/[0.12] rounded-full px-3 py-1.5 backdrop-blur-2xl shadow-2xl flex flex-wrap items-center gap-2 text-xs select-none">
              {/* Satellite Filter Segment */}
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => {
                    sounds.playTap()
                    setSelectedSatelliteId(null)
                  }}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono transition ${
                    selectedSatelliteId === null
                      ? 'bg-cyan-600 text-white font-bold'
                      : 'bg-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  All 8 Satellites
                </button>
              </div>

              <div className="w-px h-3.5 bg-zinc-700" />

              {/* Simulation Candidate Cycler */}
              <div className="flex items-center space-x-1">
                {Object.keys(SIMULATION_CANDIDATES).map(candKey => {
                  const cand = SIMULATION_CANDIDATES[candKey]
                  const isCandActive = selectedCandidateId === candKey
                  return (
                    <button
                      key={candKey}
                      onClick={() => {
                        sounds.playTap()
                        setSelectedCandidateId(candKey)
                      }}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono transition ${
                        isCandActive
                          ? 'bg-purple-600 text-white font-bold'
                          : 'bg-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {cand.name.split(' ')[0]} ({cand.mutualScore}%)
                    </button>
                  )
                })}
              </div>

              <div className="w-px h-3.5 bg-zinc-700" />

              {/* Orbit Wave Pulse Toggle */}
              <button
                onClick={() => {
                  sounds.playTap()
                  setIsOrbitPulsing(!isOrbitPulsing)
                }}
                className={`p-1 rounded-full text-[10px] transition ${
                  isOrbitPulsing ? 'bg-cyan-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
                title="Toggle Resonance Orbit Wave"
              >
                <Activity className="w-3 h-3" />
              </button>

              {/* Reset Viewport */}
              <button
                onClick={() => {
                  sounds.playTap()
                  setSelectedSatelliteId(null)
                  setSelectedCandidateId('alex')
                }}
                className="p-1 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition"
                title="Reset Orbit Viewport"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Bottom Card Summary Pill */}
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>
                Every person is a new connection. Every connection is a multi-dimensional possibility.
              </span>
            </span>

            <button
              onClick={() => {
                sounds.playTap()
                setSelectedSatelliteId(null)
                setSelectedCandidateId('alex')
              }}
              className="px-2.5 py-1 text-[11px] font-mono rounded bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
            >
              Reset View
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------ */}
        {/* RIGHT: MATCH POTENTIAL INSPECTOR DOSSIER              */}
        {/* ------------------------------------------------------ */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 md:p-6 backdrop-blur shadow-2xl space-y-5">

            {/* Dossier Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-mono font-bold tracking-wider uppercase text-cyan-300 flex items-center space-x-1.5">
                <InfinityIcon className="w-4 h-4" />
                <span>Match Potential</span>
              </span>

              <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                Dyad Evaluated
              </span>
            </div>

            {/* Circular Gauge & Pair Nodes */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
              {/* Circular Gauge */}
              <div className="flex items-center space-x-3">
                <div className="relative w-14 h-14 flex items-center justify-center">
                  <svg className="w-14 h-14 -rotate-90">
                    <circle
                      cx="28"
                      cy="28"
                      r="22"
                      fill="none"
                      stroke="#1e293b"
                      strokeWidth="4"
                    />
                    <circle
                      cx="28"
                      cy="28"
                      r="22"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="4"
                      strokeDasharray={2 * Math.PI * 22}
                      strokeDashoffset={2 * Math.PI * 22 * (1 - activeCandidate.mutualScore / 100)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute font-mono text-xs font-bold text-white">
                    {activeCandidate.mutualScore}%
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white">
                    Mutual Compatibility
                  </h4>
                  <span className="text-[11px] text-emerald-400 font-medium">
                    {activeCandidate.compatibilityCategory}
                  </span>
                </div>
              </div>

              {/* Pair Nodes Indicator */}
              <div className="flex items-center space-x-2 text-xs font-medium text-slate-300">
                <div className="text-right">
                  <span className="block font-semibold text-white">You</span>
                  <span className="text-[10px] text-slate-400">28 · London</span>
                </div>
                <span className="text-slate-500 font-mono">⇄</span>
                <div>
                  <span className="block font-semibold text-white">{activeCandidate.name.split(' ')[0]}</span>
                  <span className="text-[10px] text-slate-400">{activeCandidate.age} · Metro</span>
                </div>
              </div>
            </div>

            {/* Multi-Objective Compatibility Vector Bars */}
            <div className="space-y-2.5 pt-1">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block">
                Multi-Dimension Compatibility
              </span>

              <div className="space-y-2 text-xs font-mono">
                {/* Values */}
                <div className="space-y-1">
                  <div className="flex justify-between text-slate-300">
                    <span className="flex items-center space-x-1.5 font-sans">
                      <Heart className="w-3 h-3 text-rose-400" />
                      <span>Values</span>
                    </span>
                    <span className="font-bold text-white">{activeCandidate.vector.values}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full rounded-full" style={{ width: `${activeCandidate.vector.values}%` }} />
                  </div>
                </div>

                {/* Lifestyle */}
                <div className="space-y-1">
                  <div className="flex justify-between text-slate-300">
                    <span className="flex items-center space-x-1.5 font-sans">
                      <Activity className="w-3 h-3 text-cyan-400" />
                      <span>Lifestyle</span>
                    </span>
                    <span className="font-bold text-white">{activeCandidate.vector.lifestyle}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${activeCandidate.vector.lifestyle}%` }} />
                  </div>
                </div>

                {/* Communication */}
                <div className="space-y-1">
                  <div className="flex justify-between text-slate-300">
                    <span className="flex items-center space-x-1.5 font-sans">
                      <MessageSquare className="w-3 h-3 text-sky-400" />
                      <span>Communication</span>
                    </span>
                    <span className="font-bold text-white">{activeCandidate.vector.communication}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-sky-500 h-full rounded-full" style={{ width: `${activeCandidate.vector.communication}%` }} />
                  </div>
                </div>

                {/* Family */}
                <div className="space-y-1">
                  <div className="flex justify-between text-slate-300">
                    <span className="flex items-center space-x-1.5 font-sans">
                      <Home className="w-3 h-3 text-amber-400" />
                      <span>Family Goals</span>
                    </span>
                    <span className="font-bold text-white">{activeCandidate.vector.family}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${activeCandidate.vector.family}%` }} />
                  </div>
                </div>

                {/* Attraction */}
                <div className="space-y-1">
                  <div className="flex justify-between text-slate-300">
                    <span className="flex items-center space-x-1.5 font-sans">
                      <Flame className="w-3 h-3 text-pink-400" />
                      <span>Attraction</span>
                    </span>
                    <span className="font-bold text-white">{activeCandidate.vector.attraction}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-pink-500 h-full rounded-full" style={{ width: `${activeCandidate.vector.attraction}%` }} />
                  </div>
                </div>

                {/* Geography */}
                <div className="space-y-1">
                  <div className="flex justify-between text-slate-300">
                    <span className="flex items-center space-x-1.5 font-sans">
                      <MapPin className="w-3 h-3 text-purple-400" />
                      <span>Geography</span>
                    </span>
                    <span className="font-bold text-white">{activeCandidate.vector.geography}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full rounded-full" style={{ width: `${activeCandidate.vector.geography}%` }} />
                  </div>
                </div>

                {/* Mutuality */}
                <div className="space-y-1">
                  <div className="flex justify-between text-slate-300">
                    <span className="flex items-center space-x-1.5 font-sans">
                      <InfinityIcon className="w-3 h-3 text-emerald-400" />
                      <span>Mutuality M_ij</span>
                    </span>
                    <span className="font-bold text-white">{activeCandidate.vector.mutuality}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${activeCandidate.vector.mutuality}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* "Why This Match?" Accordion Card */}
            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
              <button
                onClick={() => {
                  sounds.playTap()
                  setWhyMatchOpen(!whyMatchOpen)
                }}
                className="w-full flex items-center justify-between text-xs font-bold text-white text-left"
              >
                <span>Why this match?</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${whyMatchOpen ? 'rotate-180' : ''}`} />
              </button>

              {whyMatchOpen && (
                <div className="space-y-3 pt-2 text-xs font-light">
                  {/* Strong Alignment */}
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1.5 text-emerald-400 font-semibold text-[11px]">
                      <Check className="w-3 h-3 stroke-[2.5]" />
                      <span>Strong alignment</span>
                    </div>
                    <ul className="space-y-0.5 text-slate-300 pl-4 list-disc text-[11px]">
                      {activeCandidate.whyThisMatch.strongAlignment.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Potential Friction */}
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1.5 text-amber-400 font-semibold text-[11px]">
                      <AlertCircle className="w-3 h-3 stroke-[2.5]" />
                      <span>Potential friction</span>
                    </div>
                    <ul className="space-y-0.5 text-slate-300 pl-4 list-disc text-[11px]">
                      {activeCandidate.whyThisMatch.potentialFriction.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Unknown */}
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1.5 text-sky-400 font-semibold text-[11px]">
                      <HelpCircle className="w-3 h-3 stroke-[2.5]" />
                      <span>Unknown (Uncertainty U)</span>
                    </div>
                    <ul className="space-y-0.5 text-slate-300 pl-4 list-disc text-[11px]">
                      {activeCandidate.whyThisMatch.unknown.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Action Navigation Buttons */}
            <div className="space-y-2 pt-1">
              <button
                onClick={onEnterDiscovery}
                className="w-full py-3 px-4 rounded-xl font-semibold text-xs bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-lg shadow-cyan-900/30 flex items-center justify-center space-x-2 transition"
              >
                <span>Explore Full Discovery Feed</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onExploreAuditor}
                className="w-full py-2.5 px-4 rounded-xl font-medium text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 flex items-center justify-center space-x-2 transition"
              >
                <span>Inspect Invariant & Parity Auditor</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* 4. BOTTOM BANNER: THE SCIENCE BEHIND YOUR MATCHES        */}
      {/* ======================================================== */}
      <section className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur shadow-2xl space-y-8">
        <div>
          <span className="apple-subhead text-cyan-400 font-mono">
            Applied Algorithmic Foundations
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            The Science Behind Your Matches
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-light mt-1 max-w-2xl">
            A multi-dimensional, reciprocal optimisation model ensuring mutual flourishing rather than one-sided attention extraction.
          </p>
        </div>

        {/* 5-Step Pipeline Strip (Exact Match to Design Reference) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs font-mono">
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-1.5">
            <span className="text-[10px] text-cyan-400 font-bold block">1. Gather Data</span>
            <span className="text-white font-medium block">Multi-Attribute Profile</span>
            <p className="text-[11px] text-slate-400 font-sans">
              Explicit attributes, flexible preferences, and behavioral history.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-1.5">
            <span className="text-[10px] text-rose-400 font-bold block">2. Apply Constraints</span>
            <span className="text-white font-medium block">Hard Feasibility g_k ≤ 0</span>
            <p className="text-[11px] text-slate-400 font-sans">
              Filters dealbreakers unconditionally (E_ij = 0).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-1.5">
            <span className="text-[10px] text-purple-400 font-bold block">3. Multi-Vector Score</span>
            <span className="text-white font-medium block">Core Life Alignment</span>
            <p className="text-[11px] text-slate-400 font-sans">
              Evaluates across 9 distinct compatibility objectives.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-1.5">
            <span className="text-[10px] text-emerald-400 font-bold block">4. Mutual Matches</span>
            <span className="text-white font-medium block">Reciprocal M_ij</span>
            <p className="text-[11px] text-slate-400 font-sans">
              Optimizes both directions (A→B and B→A) via harmonic mean.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-1.5">
            <span className="text-[10px] text-amber-400 font-bold block">5. Rank &amp; Recommend</span>
            <span className="text-white font-medium block">Marketplace Fairness</span>
            <p className="text-[11px] text-slate-400 font-sans">
              Prevents popularity hoarding with Gini exposure caps (τ ≤ 0.35).
            </p>
          </div>
        </div>

        {/* The Math (Simplified) + Optimisation Goals (2 Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">

          {/* The Math (Simplified) Card */}
          <div className="p-5 rounded-2xl bg-slate-950/70 border border-cyan-500/30 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-cyan-300 uppercase tracking-wider text-[11px]">
                The Math (Simplified)
              </span>
              <span className="text-[10px] text-slate-500">Reciprocal Objective Function</span>
            </div>

            <div className="text-sm font-bold text-white py-1">
              M_ij = f( x_i, x_j, P_i, P_j, D_i, D_j, F_i, F_j, I_ij )
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 font-sans pt-1">
              <div><strong>x</strong> = user attributes</div>
              <div><strong>P</strong> = stated preferences</div>
              <div><strong>D</strong> = dealbreakers (hard vetoes)</div>
              <div><strong>F</strong> = flexibility margins</div>
              <div className="col-span-2"><strong>I_ij</strong> = interaction &amp; verification history</div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 font-mono">
              Compatibility Vector: (C_R, C_V, C_L, C_A, C_F, C_G, C_T, C_M, U)
            </div>
          </div>

          {/* Optimisation Goals Checklist */}
          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                Optimisation Goals
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">Active Invariants</span>
            </div>

            <ul className="space-y-1.5 text-slate-300 font-light">
              <li className="flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Maximise mutual compatibility (bidirectional satisfaction)</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Respect hard constraints with 0% tolerance bypasses</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Prevent popularity bias and attention monopolies</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Maintain user privacy through field-level encryption</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Learn from post-encounter outcomes, not session duration</span>
              </li>
            </ul>

            <div className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-800/50 text-[11px] text-purple-200">
              <strong>Result:</strong> The best possible matches for you — not just the most popular ones.
            </div>
          </div>

        </div>

        {/* Footer Guarantee */}
        <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-500 font-mono">
          Universal · Reciprocal · Explainable · Built for Everyone
        </div>
      </section>

    </div>
  )
}

export default PlatformIntroView
