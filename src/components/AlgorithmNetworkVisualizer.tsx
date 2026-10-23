// ============================================================================
// src/components/AlgorithmNetworkVisualizer.tsx
// Living Resonance Radar: Ambient Spatial Compatibility Field
// Redesigned with Ultimate Intelligence and Human Logic
// ============================================================================

import React, { useState, useMemo } from 'react'
import {
  Sparkles,
  ShieldCheck,
  HeartHandshake,
  MapPin,
  ChevronRight,
  CheckCircle2,
  Heart,
  Coffee,
  Compass,
  Check,
} from 'lucide-react'
import type { UniversalUserProfile, MatchEvaluation } from '../types'
import { evaluateMatch } from '../utils/matchingEngine'
import { mockCandidates } from '../data/mockProfiles'
import { sounds } from '../utils/sound'

export type ResonanceLens = 'holistic' | 'values' | 'rhythm'

interface AlgorithmNetworkVisualizerProps {
  currentUser: UniversalUserProfile
  onSelectCandidate?: (candidate: UniversalUserProfile, evaluation: MatchEvaluation) => void
  onInitiateHandshake?: (candidate: UniversalUserProfile) => void
}

interface RadarCandidateNode {
  candidate: UniversalUserProfile
  evaluation: MatchEvaluation
  overallScore: number
  effectiveScore: number
  distanceKm: number
  r: number
  theta: number
  x: number
  y: number
  sharedValues: string[]
  conflictSummary: string
  lifestyleSummary: string
  humanEssence: string
  colorHex: string
}

export const AlgorithmNetworkVisualizer: React.FC<AlgorithmNetworkVisualizerProps> = ({
  currentUser,
  onSelectCandidate,
  onInitiateHandshake,
}) => {
  // Resonance perspective lens
  const [activeLens, setActiveLens] = useState<ResonanceLens>('holistic')

  // Gating filter
  const [eligibleOnly, setEligibleOnly] = useState<boolean>(false)

  // Radar sweep animation toggle
  const [isSweeping, setIsSweeping] = useState<boolean>(true)

  // Selected candidate state (defaults to top match Maya Lin if available)
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>(
    mockCandidates[0]?.id || 'usr_maya_01'
  )

  // Track sent handshakes internally for immediate UI feedback
  const [sentHandshakes, setSentHandshakes] = useState<Set<string>>(new Set())

  // Center coordinates in 620x620 SVG viewBox
  const cx = 310
  const cy = 310

  // 1. Process and evaluate all candidates against the current user
  const processedCandidates = useMemo<RadarCandidateNode[]>(() => {
    // Filter candidates based on eligibility gating if requested
    const list = mockCandidates.map((cand, index) => {
      const evaluation = evaluateMatch(currentUser, cand)
      const overallScore = evaluation.mutuality.score ?? 75

      // Calculate lens-weighted score
      let effectiveScore = overallScore
      if (activeLens === 'values') {
        const vScore = evaluation.valueAlignment?.score ? evaluation.valueAlignment.score * 100 : overallScore
        const rScore = evaluation.relationshipAlignment?.score ? evaluation.relationshipAlignment.score * 100 : overallScore
        effectiveScore = Math.round(vScore * 0.6 + rScore * 0.4)
      } else if (activeLens === 'rhythm') {
        const tScore = evaluation.temporalFeasibility?.score ? evaluation.temporalFeasibility.score * 100 : overallScore
        const lScore = evaluation.lifestyleAlignment?.score ? evaluation.lifestyleAlignment.score * 100 : overallScore
        const gScore = evaluation.geographicFeasibility?.score ? evaluation.geographicFeasibility.score * 100 : overallScore
        effectiveScore = Math.round(tScore * 0.4 + lScore * 0.35 + gScore * 0.25)
      }

      // Compute radial distance from center based on score (closer = higher match)
      // Range: 70px (100% fit) to 260px (75% fit)
      let r = 260
      if (effectiveScore >= 95) {
        // Inner Core Orbit: 75px to 110px
        r = 75 + (100 - effectiveScore) * (35 / 5)
      } else if (effectiveScore >= 90) {
        // Harmonic Field: 110px to 185px
        r = 110 + (95 - effectiveScore) * (75 / 5)
      } else {
        // Discovery Orbit: 185px to 260px
        r = 185 + Math.min(10, 90 - effectiveScore) * (75 / 10)
      }

      // Disperse angle so every candidate has a distinct, beautiful position
      const totalCandidates = mockCandidates.length
      const baseAngle = (index * (2 * Math.PI / totalCandidates)) - (Math.PI / 2)
      // Slight harmonic bias to create natural organic clustering
      const theta = baseAngle

      const x = Math.round(cx + r * Math.cos(theta))
      const y = Math.round(cy + r * Math.sin(theta))

      // Identify shared core values
      const userVals = new Set(currentUser.values.coreValues || [])
      const sharedVals = (cand.values.coreValues || []).filter((v: string) => userVals.has(v))

      // Format conflict style
      const rawConflict = cand.communication.conflictStyle || 'reflective_deliberate'
      const conflictSummary =
        rawConflict === 'reflective_deliberate'
          ? 'Reflective & Deliberate (Calm repair)'
          : rawConflict === 'direct_immediate'
          ? 'Direct & Open (Quick resolution)'
          : rawConflict === 'space_first'
          ? 'Space First (Thoughtful processing)'
          : 'Diplomatic & Gentle'

      // Lifestyle summary
      const lifestyleSummary = `${cand.lifestyle.diet} • ${cand.lifestyle.smoking === 'never' ? 'Smoke-Free' : 'Social'} • ${cand.intention.relationshipStructure}`

      // Human Essence narrative
      let humanEssence = 'Emergent Synergy. Aligned foundations with room for mutual growth.'
      if (overallScore >= 95) {
        humanEssence = 'Soul Resonance. Exceptional ethical alignment, calm communication, and zero lifestyle friction.'
      } else if (overallScore >= 90) {
        humanEssence = 'Harmonic Field. Deep shared values with complementary everyday rhythms and conversational warmth.'
      } else if (!evaluation.eligible) {
        humanEssence = 'Lifestyle Divergence. Meaningful intellectual sparks with distinct structural boundaries.'
      }

      // Color coding
      let colorHex = '#38BDF8' // Cyan (discovery)
      if (overallScore >= 95) colorHex = '#F472B6' // Pink (core)
      else if (overallScore >= 90) colorHex = '#C084FC' // Purple (harmonic)

      // Geographic distance
      const distanceKm = evaluation.geographicFeasibility?.score != null
        ? Math.max(1, Math.round(18 * (1 - evaluation.geographicFeasibility.score / 100)))
        : 2.5

      return {
        candidate: cand,
        evaluation,
        overallScore,
        effectiveScore,
        distanceKm,
        r,
        theta,
        x,
        y,
        sharedValues: sharedVals.length > 0 ? sharedVals : ['Integrity', 'Curiosity'],
        conflictSummary,
        lifestyleSummary,
        humanEssence,
        colorHex,
      }
    })

    if (eligibleOnly) {
      return list.filter((item) => item.evaluation.eligible)
    }
    return list
  }, [currentUser, activeLens, eligibleOnly])

  // Active selected candidate node
  const activeNode = useMemo<RadarCandidateNode | undefined>(() => {
    const found = processedCandidates.find((c) => c.candidate.id === selectedCandidateId)
    return found || processedCandidates[0]
  }, [processedCandidates, selectedCandidateId])

  const handleSelectNode = (candidateId: string) => {
    sounds.playTap()
    setSelectedCandidateId(candidateId)
  }

  const handleHandshakeClick = (candidate: UniversalUserProfile) => {
    sounds.playMatch()
    setSentHandshakes((prev) => new Set(prev).add(candidate.id))
    if (onInitiateHandshake) {
      onInitiateHandshake(candidate)
    }
  }

  return (
    <div className="w-full bg-[#0C0B0F] text-white flex flex-col space-y-3.5 pb-2">
      {/* ---------------------------------------------------- */}
      {/* 1. TOP LENS SELECTOR (HUMAN LOGIC CONTROLS)          */}
      {/* ---------------------------------------------------- */}
      <div className="px-3 pt-3 flex flex-col space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <Compass className="w-3.5 h-3.5 text-[#F472B6]" />
            <span className="text-xs font-bold text-white tracking-tight">Resonance Perspective</span>
          </div>

          <button
            type="button"
            onClick={() => {
              sounds.playTap()
              setEligibleOnly(!eligibleOnly)
            }}
            className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition cursor-pointer flex items-center space-x-1 border ${
              eligibleOnly
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-white/[0.04] border-white/10 text-neutral-400 hover:text-white'
            }`}
          >
            <span>Eligible Only</span>
            {eligibleOnly && <Check className="w-2.5 h-2.5 text-emerald-400" />}
          </button>
        </div>

        {/* 3 Human Lenses */}
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/[0.08]">
          <button
            type="button"
            onClick={() => {
              sounds.playTap()
              setActiveLens('holistic')
            }}
            className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold transition-all cursor-pointer flex items-center justify-center space-x-1 ${
              activeLens === 'holistic'
                ? 'bg-[#F472B6] text-black shadow-md font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3 shrink-0" />
            <span className="truncate">Holistic</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playTap()
              setActiveLens('values')
            }}
            className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold transition-all cursor-pointer flex items-center justify-center space-x-1 ${
              activeLens === 'values'
                ? 'bg-[#C084FC] text-black shadow-md font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Heart className="w-3 h-3 shrink-0" />
            <span className="truncate">Life Vision</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playTap()
              setActiveLens('rhythm')
            }}
            className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold transition-all cursor-pointer flex items-center justify-center space-x-1 ${
              activeLens === 'rhythm'
                ? 'bg-[#38BDF8] text-black shadow-md font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Coffee className="w-3 h-3 shrink-0" />
            <span className="truncate">Living Pace</span>
          </button>
        </div>

        {/* Orbital Population Stat */}
        <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 px-0.5">
          <span>{processedCandidates.length} Souls in Orbit</span>
          <span className="text-[#F472B6]">
            {processedCandidates.filter((c) => c.overallScore >= 95).length} in Core Circle (95%+)
          </span>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 2. LIVING RADAR CANVAS (APPLE-GRADE CONCENTRIC SVG)  */}
      {/* ---------------------------------------------------- */}
      <div className="relative w-full max-w-[370px] mx-auto aspect-square select-none px-2">
        <svg
          viewBox="0 0 620 620"
          className="w-full h-full drop-shadow-2xl overflow-visible"
        >
          <defs>
            {/* Dark Celestial Field Gradient */}
            <radialGradient id="radarDarkGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#181524" />
              <stop offset="60%" stopColor="#0F0E17" />
              <stop offset="100%" stopColor="#09080E" />
            </radialGradient>

            {/* Radar Beam Sweep Cone Gradient */}
            <radialGradient id="radarSweepCone" cx="0%" cy="0%" r="100%">
              <stop offset="0%" stopColor="#F472B6" stopOpacity="0.32" />
              <stop offset="70%" stopColor="#A855F7" stopOpacity="0.08" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>

            {/* Glowing Blur Filter */}
            <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* User Avatar Clip Path */}
            <clipPath id="userAvatarClip">
              <circle cx={cx} cy={cy} r="18" />
            </clipPath>

            {/* Candidate Avatar Clip Paths */}
            {processedCandidates.map((node) => (
              <clipPath key={`clip-${node.candidate.id}`} id={`clip-${node.candidate.id}`}>
                <circle cx={node.x} cy={node.y} r="17" />
              </clipPath>
            ))}
          </defs>

          {/* Background Canvas Disc */}
          <circle cx={cx} cy={cy} r="300" fill="url(#radarDarkGrad)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

          {/* Concentric Resonance Rings */}
          {/* 1. Discovery Orbit (80%+) */}
          <circle
            cx={cx}
            cy={cy}
            r="260"
            fill="none"
            stroke="#38BDF8"
            strokeWidth="1"
            strokeOpacity="0.18"
          />
          <text
            x={cx}
            y={cy - 264}
            textAnchor="middle"
            fill="#38BDF8"
            fillOpacity="0.5"
            fontSize="9"
            fontFamily="monospace"
            letterSpacing="0.08em"
          >
            DISCOVERY ORBIT · 80%+
          </text>

          {/* 2. Harmonic Field (90%+) */}
          <circle
            cx={cx}
            cy={cy}
            r="185"
            fill="none"
            stroke="#C084FC"
            strokeWidth="1.2"
            strokeDasharray="4 4"
            strokeOpacity="0.3"
          />
          <text
            x={cx}
            y={cy - 189}
            textAnchor="middle"
            fill="#C084FC"
            fillOpacity="0.6"
            fontSize="9"
            fontFamily="monospace"
            letterSpacing="0.08em"
          >
            HARMONIC FIELD · 90%+
          </text>

          {/* 3. Core Resonance Circle (95%+) */}
          <circle
            cx={cx}
            cy={cy}
            r="110"
            fill="none"
            stroke="#F472B6"
            strokeWidth="1.4"
            strokeDasharray="3 3"
            strokeOpacity="0.55"
            filter="url(#softGlow)"
          />
          <text
            x={cx}
            y={cy - 114}
            textAnchor="middle"
            fill="#F472B6"
            fillOpacity="0.8"
            fontSize="9"
            fontFamily="monospace"
            fontWeight="bold"
            letterSpacing="0.08em"
          >
            CORE RESONANCE · 95%+
          </text>

          {/* Subtle Crosshair Axis Guides */}
          <line x1={cx} y1={25} x2={cx} y2={595} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <line x1={25} y1={cy} x2={595} y2={cy} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

          {/* Axis Cardinal Labels */}
          <text x={cx} y="42" textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="8" fontFamily="monospace">
            LIFE VISION
          </text>
          <text x="585" y={cy + 3} textAnchor="end" fill="rgba(255,255,255,0.25)" fontSize="8" fontFamily="monospace">
            SAFETY
          </text>
          <text x={cx} y="582" textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="8" fontFamily="monospace">
            RHYTHM
          </text>
          <text x="35" y={cy + 3} textAnchor="start" fill="rgba(255,255,255,0.25)" fontSize="8" fontFamily="monospace">
            CURIOSITY
          </text>

          {/* Rotating Living Radar Sweep Beam */}
          {isSweeping && (
            <g className="origin-[310px_310px] animate-[spin_12s_linear_infinite]" pointerEvents="none">
              {/* Radar beam slice */}
              <path
                d="M 310 310 L 310 20 A 290 290 0 0 1 515 105 Z"
                fill="url(#radarSweepCone)"
                opacity="0.6"
              />
              {/* Leading beam ray */}
              <line
                x1={cx}
                y1={cy}
                x2={cx}
                y2={20}
                stroke="#F472B6"
                strokeWidth="1.5"
                strokeOpacity="0.85"
                filter="url(#softGlow)"
              />
            </g>
          )}

          {/* Spoke Line to Active Candidate */}
          {activeNode && (
            <g>
              <line
                x1={cx}
                y1={cy}
                x2={activeNode.x}
                y2={activeNode.y}
                stroke="#F472B6"
                strokeWidth="1.5"
                strokeDasharray="4 3"
                strokeOpacity="0.8"
                filter="url(#softGlow)"
              />
              <circle
                cx={activeNode.x}
                cy={activeNode.y}
                r="26"
                fill="none"
                stroke="#F472B6"
                strokeWidth="1.5"
                strokeOpacity="0.5"
                className="animate-ping origin-center"
              />
            </g>
          )}

          {/* Candidate Orbit Star Blips */}
          {processedCandidates.map((node) => {
            const isSelected = activeNode?.candidate.id === node.candidate.id
            const photoUrl = node.candidate.identity.photos[0]

            return (
              <g
                key={node.candidate.id}
                onClick={() => handleSelectNode(node.candidate.id)}
                className="cursor-pointer transition-transform duration-200 active:scale-95"
              >
                {/* Generous Invisible Touch Target (48px) */}
                <circle cx={node.x} cy={node.y} r="24" fill="transparent" />

                {/* Outer Glow Halo */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isSelected ? 23 : 19}
                  fill="none"
                  stroke={node.colorHex}
                  strokeWidth={isSelected ? 2.5 : 1.5}
                  strokeOpacity={isSelected ? 0.9 : 0.6}
                  filter="url(#softGlow)"
                />

                {/* Avatar Portrait Image */}
                {photoUrl ? (
                  <image
                    href={photoUrl}
                    x={node.x - 17}
                    y={node.y - 17}
                    width="34"
                    height="34"
                    clipPath={`url(#clip-${node.candidate.id})`}
                    preserveAspectRatio="xMidYMid slice"
                  />
                ) : (
                  <circle cx={node.x} cy={node.y} r="17" fill="#1C1B24" />
                )}

                {/* Candidate Match % Tag */}
                <g transform={`translate(${node.x}, ${node.y + 24})`}>
                  <rect
                    x="-14"
                    y="-6"
                    width="28"
                    height="12"
                    rx="6"
                    fill="#0F0E17"
                    stroke={node.colorHex}
                    strokeWidth="0.8"
                  />
                  <text
                    x="0"
                    y="3"
                    textAnchor="middle"
                    fill={node.colorHex}
                    fontSize="8"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {node.overallScore}%
                  </text>
                </g>

                {/* First Name Micro-Label */}
                <text
                  x={node.x}
                  y={node.y + 36}
                  textAnchor="middle"
                  fill={isSelected ? '#FFFFFF' : 'rgba(255,255,255,0.7)'}
                  fontSize="9"
                  fontFamily="sans-serif"
                  fontWeight={isSelected ? 'bold' : 'normal'}
                >
                  {node.candidate.identity.name.split(' ')[0]}
                </text>
              </g>
            )
          })}

          {/* Center Beacon: YOU (Current User) */}
          <g className="cursor-default">
            {/* Ambient Pulse Ripple */}
            <circle
              cx={cx}
              cy={cy}
              r="26"
              fill="none"
              stroke="#F472B6"
              strokeWidth="1.2"
              strokeOpacity="0.4"
              className="animate-pulse"
            />
            <circle
              cx={cx}
              cy={cy}
              r="20"
              fill="#F472B6"
              fillOpacity="0.2"
              filter="url(#softGlow)"
            />

            {/* User Avatar */}
            {currentUser.identity.photos[0] ? (
              <image
                href={currentUser.identity.photos[0]}
                x={cx - 18}
                y={cy - 18}
                width="36"
                height="36"
                clipPath="url(#userAvatarClip)"
                preserveAspectRatio="xMidYMid slice"
              />
            ) : (
              <circle cx={cx} cy={cy} r="18" fill="#F472B6" />
            )}

            {/* Center Outer Ring */}
            <circle cx={cx} cy={cy} r="18" fill="none" stroke="#F472B6" strokeWidth="2" />

            {/* "You" Pill Tag */}
            <g transform={`translate(${cx}, ${cy + 24})`}>
              <rect x="-11" y="-5" width="22" height="10" rx="5" fill="#F472B6" />
              <text
                x="0"
                y="3"
                textAnchor="middle"
                fill="#000000"
                fontSize="7"
                fontFamily="sans-serif"
                fontWeight="800"
                letterSpacing="0.05em"
              >
                YOU
              </text>
            </g>
          </g>
        </svg>

        {/* Sweep Pause / Resume Floating Pill */}
        <button
          type="button"
          onClick={() => {
            sounds.playTap()
            setIsSweeping(!isSweeping)
          }}
          className="absolute bottom-2 right-2 px-2.5 py-1 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/10 text-[9px] font-mono text-neutral-400 hover:text-white transition cursor-pointer"
        >
          {isSweeping ? 'Pause Sweep' : 'Resume Sweep'}
        </button>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 3. DOCKED HUMAN RESONANCE DOSSIER CARD               */}
      {/* ---------------------------------------------------- */}
      {activeNode && (
        <div className="px-3">
          <div className="p-4 rounded-3xl bg-[#14131A] border border-white/10 shadow-2xl space-y-3.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
            {/* Header: Photo, Name, Verified, Fit Pill */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={activeNode.candidate.identity.photos[0]}
                  alt={activeNode.candidate.identity.name}
                  className="w-12 h-12 rounded-2xl object-cover ring-1 ring-white/20 shadow-md shrink-0"
                />
                <div>
                  <div className="flex items-center space-x-1.5">
                    <h3 className="text-base font-bold text-white tracking-tight">
                      {activeNode.candidate.identity.name}
                    </h3>
                    <span className="text-sm text-neutral-400 font-light">
                      {activeNode.candidate.identity.age}
                    </span>
                    {activeNode.candidate.identity.verified && (
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]" />
                    )}
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-neutral-400 font-light mt-0.5">
                    <MapPin className="w-3 h-3 text-[#F472B6]" />
                    <span>
                      {activeNode.distanceKm} km away • {activeNode.candidate.geography.cityName}
                    </span>
                  </div>
                </div>
              </div>

              {/* Match Badge */}
              <div
                className="px-2.5 py-1 rounded-full text-xs font-bold flex items-center space-x-1 border"
                style={{
                  backgroundColor: `${activeNode.colorHex}18`,
                  borderColor: `${activeNode.colorHex}45`,
                  color: activeNode.colorHex,
                }}
              >
                <Sparkles className="w-3 h-3" />
                <span>{activeNode.overallScore}% Fit</span>
              </div>
            </div>

            {/* Human Logic Synthesis Box */}
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-1.5">
              <div className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F472B6]" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">
                  Why you belong in each other's orbit
                </span>
              </div>
              <p className="text-xs text-neutral-300 font-normal leading-relaxed">
                {activeNode.humanEssence}
              </p>
            </div>

            {/* 3 Concrete Human Pillars */}
            <div className="grid grid-cols-3 gap-1.5 text-[10px]">
              {/* Values Overlap */}
              <div className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-0.5">
                <span className="text-neutral-400 font-mono block uppercase text-[9px]">Shared Core</span>
                <span className="text-white font-medium truncate block">
                  {activeNode.sharedValues.slice(0, 2).join(', ')}
                </span>
              </div>

              {/* Conflict Repair */}
              <div className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-0.5">
                <span className="text-neutral-400 font-mono block uppercase text-[9px]">Conflict Pace</span>
                <span className="text-emerald-300 font-medium truncate block">
                  {activeNode.conflictSummary.split(' ')[0]}
                </span>
              </div>

              {/* Lifestyle Habits */}
              <div className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-0.5">
                <span className="text-neutral-400 font-mono block uppercase text-[9px]">Living Style</span>
                <span className="text-purple-300 font-medium truncate block">
                  {activeNode.lifestyleSummary.split('•')[0].trim()}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  sounds.playTap()
                  if (onSelectCandidate) {
                    onSelectCandidate(activeNode.candidate, activeNode.evaluation)
                  }
                }}
                className="w-full py-2.5 px-3 rounded-full bg-white/[0.08] hover:bg-white/[0.14] active:scale-95 border border-white/10 text-white text-xs font-semibold flex items-center justify-center space-x-1.5 transition cursor-pointer"
              >
                <span>Read Full Dossier</span>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
              </button>

              <button
                type="button"
                onClick={() => handleHandshakeClick(activeNode.candidate)}
                disabled={sentHandshakes.has(activeNode.candidate.id)}
                className={`w-full py-2.5 px-3 rounded-full active:scale-95 text-xs font-bold flex items-center justify-center space-x-1.5 transition cursor-pointer ${
                  sentHandshakes.has(activeNode.candidate.id)
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-[#F472B6] hover:bg-[#f689c4] text-black shadow-lg shadow-[#F472B6]/25'
                }`}
              >
                {sentHandshakes.has(activeNode.candidate.id) ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Requested</span>
                  </>
                ) : (
                  <>
                    <HeartHandshake className="w-3.5 h-3.5" />
                    <span>Handshake</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 4. HORIZONTAL QUICK-THUMB REEL (FAST BROWSING)       */}
      {/* ---------------------------------------------------- */}
      <div className="px-3 pt-1">
        <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1.5 px-0.5">
          Tap to focus orbit
        </span>
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
          {processedCandidates.map((node) => {
            const isSelected = activeNode?.candidate.id === node.candidate.id
            return (
              <button
                key={`thumb-${node.candidate.id}`}
                type="button"
                onClick={() => handleSelectNode(node.candidate.id)}
                className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-full border shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white/15 border-[#F472B6] text-white shadow-md'
                    : 'bg-white/[0.03] border-white/10 text-neutral-400 hover:text-white'
                }`}
              >
                <img
                  src={node.candidate.identity.photos[0]}
                  alt={node.candidate.identity.name}
                  className="w-5 h-5 rounded-full object-cover shrink-0"
                />
                <span className="text-xs font-medium">
                  {node.candidate.identity.name.split(' ')[0]}
                </span>
                <span
                  className="text-[10px] font-mono font-bold"
                  style={{ color: node.colorHex }}
                >
                  {node.overallScore}%
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default AlgorithmNetworkVisualizer
