// ============================================================================
// src/components/FirstDateBriefView.tsx
// Wingman: Psychological First-Date Blueprint & Interactive Sensory Simulator
// Grounded in Gottman 5:1 Ratio, Emotion-Focused Therapy, & Fast Friends Protocol
// Enhanced with Real-World London Transit Near-Miss Midpoints & Acoustic Controls
// ============================================================================

import React, { useState } from 'react'
import {
  ShieldCheck,
  Coffee,
  CheckCircle2,
  Brain,
  Scale,
  Sun,
  Volume2,
  Sparkles,
  Zap,
  Music,
  MapPin,
  Navigation,
  Compass,
} from 'lucide-react'
import type { UniversalUserProfile } from '../types'
import { mockCandidates } from '../data/mockProfiles'
import { evaluateMatch } from '../utils/matchingEngine'
import { sounds } from '../utils/sound'

interface FirstDateBriefViewProps {
  currentUser: UniversalUserProfile
  onSelectCandidate?: (candidate: UniversalUserProfile) => void
}

interface MidpointVenue {
  name: string
  neighborhood: string
  travelTimes: string
  lightingK: number
  noiseDb: number
  suitabilityRationale: string
}

export const FirstDateBriefView: React.FC<FirstDateBriefViewProps> = ({
  currentUser,
}) => {
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>(mockCandidates[0].id)
  const candidate = mockCandidates.find((c) => c.id === selectedCandidateId) || mockCandidates[0]
  const evaluation = evaluateMatch(currentUser, candidate)

  // Interactive sensory ambiance controls
  const [lightingTemp, setLightingTemp] = useState<number>(2700) // 2200K to 4000K
  const [decibelTarget, setDecibelTarget] = useState<number>(42) // 35 to 65 dB
  const [selectedVenue, setSelectedVenue] = useState<string>('coffee')
  const [flippedCardId, setFlippedCardId] = useState<number | null>(null)
  const [selectedMidpointIndex, setSelectedMidpointIndex] = useState<number>(0)

  // Real-World London Transit Midpoints Derived from Convenient Travel Overlaps
  const candidateMidpoints: Record<string, MidpointVenue[]> = {
    usr_maya_01: [
      {
        name: 'Monmouth Coffee Company',
        neighborhood: 'Borough Market / Southwark',
        travelTimes: 'Elena: 9m (Northern) · Maya: 12m (Jubilee)',
        lightingK: 2600,
        noiseDb: 42,
        suitabilityRationale: 'Cozy timber booths, warm natural daylight, and quiet corners where you can hear every laugh without shouting.',
      },
      {
        name: 'Tate Modern Espresso Pavilion',
        neighborhood: 'Bankside / Thames Path',
        travelTimes: 'Elena: 14m (Thames Path) · Maya: 15m (Blackfriars)',
        lightingK: 2800,
        noiseDb: 38,
        suitabilityRationale: 'Scenic riverfront views and calming art spaces; perfect for an unhurried, side-by-side walk where silence never feels awkward.',
      },
    ],
    usr_liam_02: [
      {
        name: 'Whitechapel Gallery Cafe',
        neighborhood: 'Aldgate East',
        travelTimes: 'Elena: 15m (District) · Liam: 8m (Walk)',
        lightingK: 2700,
        noiseDb: 40,
        suitabilityRationale: 'Peaceful gallery hideaway; gentle background ambiance, warm pots of tea, and zero noisy distractions.',
      },
      {
        name: 'Town Hall Hotel Tea Lounge',
        neighborhood: 'Bethnal Green',
        travelTimes: 'Elena: 18m (Central) · Liam: 12m (Overground)',
        lightingK: 2400,
        noiseDb: 36,
        suitabilityRationale: 'Intimate vintage tea lounge with plush velvet armchairs, soft lighting, and an unhurried afternoon vibe.',
      },
    ],
    usr_priya_03: [
      {
        name: 'Wellcome Collection Reading Room Cafe',
        neighborhood: 'Euston Road',
        travelTimes: 'Elena: 11m (Northern) · Priya: 14m (Victoria)',
        lightingK: 2700,
        noiseDb: 35,
        suitabilityRationale: 'A quiet, thoughtful bookshop cafe with comfy chairs, warm mugs, and a calm, unpretentious atmosphere.',
      },
      {
        name: 'Brunswick Centre Courtyard Tea Room',
        neighborhood: 'Bloomsbury',
        travelTimes: 'Elena: 13m (Russell Sq) · Priya: 16m (King’s Cross)',
        lightingK: 3000,
        noiseDb: 44,
        suitabilityRationale: 'Sunny pedestrian plaza with open sky, peaceful outdoor tables, and relaxed foot traffic.',
      },
    ],
    usr_marcus_04: [
      {
        name: 'E5 Bakehouse & Coffee Shed',
        neighborhood: 'London Fields',
        travelTimes: 'Elena: 22m (Overground) · Marcus: 6m (Walk)',
        lightingK: 2800,
        noiseDb: 46,
        suitabilityRationale: 'Fresh warm sourdough bakery with outdoor bench seating; honest, relaxed, and wonderfully laid-back.',
      },
    ],
    usr_sofia_05: [
      {
        name: 'Canal Steps Espresso Kiosk',
        neighborhood: 'Granary Square / King’s Cross',
        travelTimes: 'Elena: 16m (Northern) · Sofia: 12m (St Pancras)',
        lightingK: 3200,
        noiseDb: 42,
        suitabilityRationale: 'Breezy steps right beside the canal; grab a flat white and enjoy an effortless walk in the afternoon sun.',
      },
    ],
    usr_chloe_06: [
      {
        name: 'Barbican Centre Conservatory Terrace',
        neighborhood: 'City of London',
        travelTimes: 'Elena: 18m (Moorgate) · Chloe: 8m (Barbican)',
        lightingK: 2900,
        noiseDb: 34,
        suitabilityRationale: 'A hidden glasshouse paradise of tropical ferns and exotic flora; peaceful, romantic, and breathtakingly unique.',
      },
    ],
  }

  const activeMidpoints = candidateMidpoints[candidate.id] || candidateMidpoints.usr_maya_01
  const activeMidpoint = activeMidpoints[selectedMidpointIndex] || activeMidpoints[0]

  // Psychological Dyad Computations
  const isHighFit = evaluation.eligible && (evaluation.mutuality.score || 0) >= 80

  // Lighting tint calculated from Kelvin
  const getLightingTint = (kelvin: number) => {
    if (kelvin < 2500)
      return {
        bg: 'rgba(255,147,41,0.12)',
        border: 'rgba(255,147,41,0.3)',
        label: 'Candlelight Warm (2200K)',
        glow: '#ff9729',
      }
    if (kelvin < 3200)
      return {
        bg: 'rgba(251,191,36,0.12)',
        border: 'rgba(251,191,36,0.3)',
        label: 'Soft Diffuse Amber (2700K)',
        glow: '#fbbf24',
      }
    return {
      bg: 'rgba(56,189,248,0.12)',
      border: 'rgba(56,189,248,0.3)',
      label: 'Bright Daylight (4000K)',
      glow: '#38bdf8',
    }
  }

  const lightStyle = getLightingTint(lightingTemp)

  // Icebreaker Cards
  const icebreakers = [
    {
      id: 1,
      level: 'Level 1 • Domestic Rhythm',
      title: 'The Ecology of a Perfect Tuesday',
      front: '“When you have an unscheduled day with zero obligations, what does your rhythm look like?”',
      back: `Tailored for ${candidate.identity.name.split(' ')[0]}: Focuses on their ${candidate.lifestyle.diet} lifestyle, favorite tea/coffee rituals, and quiet domestic harmony.`,
    },
    {
      id: 2,
      level: 'Level 2 • Value & Craft',
      title: 'The Non-Negotiable Pursuit',
      front: '“What is a creative craft or value you fiercely protect even if others misunderstand it?”',
      back: `Tailored for ${candidate.identity.name.split(' ')[0]}: Surfaces core values around ${candidate.values.coreValues.slice(0, 2).join(' & ')}. Bypasses superficial small talk!`,
    },
    {
      id: 3,
      level: 'Level 3 • Emotional Safe Harbor',
      title: 'What Comfort Looks Like',
      front: '“When life gets heavy, what helps you feel grounded—a quiet evening to decompress, or someone holding your hand?”',
      back: `Connects to how they handle stress (${candidate.communication.conflictStyle}). Shows genuine care for how they recharge.`,
    },
  ]

  const handleApplyMidpointPreset = (idx: number) => {
    sounds.playTap()
    setSelectedMidpointIndex(idx)
    const m = activeMidpoints[idx]
    if (m) {
      setLightingTemp(m.lightingK)
      setDecibelTarget(m.noiseDb)
    }
  }

  return (
    <div className="space-y-10 py-4 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-zinc-100 font-sans">
      {/* 1. HEADER / EDITORIAL OVERVIEW */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>First Date Planner</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mt-1">
            Planning Your First Real Date
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl font-light leading-relaxed">
            First dates shouldn’t feel like stressful job interviews or shouting over loud pub noise. We help you pick calm, intimate spots where you can both relax, hear each other laugh, and let a real connection unfold naturally.
          </p>
        </div>

        {/* Candidate Selector Capsule */}
        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-xs text-neutral-400 font-mono">Plan date with:</span>
          <div className="flex p-1.5 rounded-full bg-zinc-950 border border-white/[0.08] backdrop-blur-md">
            {mockCandidates.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  sounds.playTap()
                  setSelectedCandidateId(c.id)
                  setSelectedMidpointIndex(0)
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  c.id === candidate.id
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {c.identity.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. CANDIDATE PROFILE SUMMARY STRIP */}
      <div
        className="rounded-[2.5rem] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border transition-all duration-500"
        style={{
          background: '#0c0c10',
          backdropFilter: 'blur(36px)',
          borderColor: isHighFit ? 'rgba(192,132,252,0.3)' : 'rgba(255,255,255,0.08)',
          boxShadow: isHighFit ? '0 0 40px rgba(192,132,252,0.15)' : 'none',
        }}
      >
        <div className="flex items-center space-x-5">
          <div className="relative">
            <img
              src={candidate.identity.photos[0]}
              alt={candidate.identity.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-white/20 shadow-lg"
            />
            {candidate.identity.verified && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                <ShieldCheck className="w-3.5 h-3.5 text-white" />
              </div>
            )}
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {currentUser.identity.name.split(' ')[0]} &amp; {candidate.identity.name.split(' ')[0]}
              </h2>
            </div>
            <p className="text-xs text-neutral-400 font-light">
              {candidate.identity.age} y/o • {candidate.identity.bio}
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="px-2.5 py-0.5 rounded-full bg-zinc-900 border border-white/[0.08] text-[10px] text-neutral-300 font-mono">
                {candidate.lifestyle.diet}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-zinc-900 border border-white/[0.08] text-[10px] text-neutral-300 font-mono">
                {candidate.communication.conflictStyle.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>

        <div className="text-right flex flex-col items-center md:items-end space-y-1.5 shrink-0">
          <span className="text-3xl font-bold font-mono text-purple-300 tracking-tight">
            {evaluation.eligible ? `${evaluation.mutuality.score}%` : 'Disqualified'}
          </span>
          <span className="text-xs font-mono text-neutral-400">
            {isHighFit ? '✦ Rare Heartfelt Spark' : 'Reciprocal Mutual Fit'}
          </span>
        </div>
      </div>

      {/* 3. REAL-WORLD TRANSIT MIDPOINT VENUES */}
      <div className="bg-[#121216] border border-white/[0.08] rounded-[2.5rem] p-6 sm:p-8 space-y-5 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-bold block">
                Fair &amp; Easy Meeting Spots
              </span>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Convenient Midpoints for {candidate.identity.name.split(' ')[0]}
              </h3>
            </div>
          </div>

          <span className="text-xs font-mono px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
            Halfway Between Both of You
          </span>
        </div>

        {/* Midpoint Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {activeMidpoints.map((midpoint, idx) => {
            const isSelected = selectedMidpointIndex === idx
            return (
              <div
                key={midpoint.name}
                onClick={() => handleApplyMidpointPreset(idx)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? 'bg-purple-950/40 border-purple-500/60 shadow-lg ring-1 ring-purple-500/30'
                    : 'bg-zinc-950/60 border-white/[0.06] hover:border-white/15 hover:bg-zinc-900/60'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-purple-400" />
                      <span>{midpoint.name}</span>
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-white/5">
                      {midpoint.noiseDb} dB · {midpoint.lightingK}K
                    </span>
                  </div>

                  <p className="text-xs text-purple-300 font-mono">
                    {midpoint.travelTimes}
                  </p>

                  <p className="text-xs text-neutral-300 font-light leading-relaxed">
                    {midpoint.suitabilityRationale}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-[11px] font-mono">
                  <span className="text-neutral-400">{midpoint.neighborhood}</span>
                  <span className={isSelected ? 'text-purple-300 font-bold' : 'text-neutral-500'}>
                    {isSelected ? '✓ Active Sensory Preset' : 'Tap to sync controls'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 4. INTERACTIVE SENSORY AMBIANCE SIMULATOR */}
      <div
        className="rounded-[2.5rem] p-6 sm:p-8 space-y-6 border transition-all duration-500 relative overflow-hidden"
        style={{
          background: lightStyle.bg,
          borderColor: lightStyle.border,
          boxShadow: `0 0 60px ${lightStyle.glow}20`,
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
          <div className="flex items-center space-x-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ background: `${lightStyle.glow}25`, border: `1px solid ${lightStyle.glow}50` }}
            >
              <Sun className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider block" style={{ color: lightStyle.glow }}>
                Atmosphere &amp; Comfort
              </span>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Setting the Scene: {activeMidpoint.name}
              </h3>
            </div>
          </div>

          <span
            className="px-3 py-1 rounded-full text-xs font-mono font-bold"
            style={{ background: `${lightStyle.glow}20`, color: '#ffffff', border: `1px solid ${lightStyle.glow}40` }}
          >
            {lightStyle.label}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Lighting Kelvin Slider */}
          <div className="p-5 rounded-2xl bg-black/50 border border-white/10 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-neutral-300 flex items-center space-x-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-300" />
                <span>Lighting Temperature (Kelvin)</span>
              </span>
              <span className="font-bold font-mono text-white">{lightingTemp}K</span>
            </div>
            {/* Tactile Stepper + High-Visibility Lighting Slider */}
            <div className="flex items-center space-x-2.5">
              <button
                type="button"
                onClick={() => setLightingTemp(Math.max(2200, lightingTemp - 100))}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 text-white font-bold text-sm flex items-center justify-center shrink-0 cursor-pointer shadow-sm transition"
                aria-label="Decrease lighting temperature"
              >
                -
              </button>

              <div className="relative flex-1 flex items-center h-11 group select-none">
                <div className="relative w-full h-3 rounded-full bg-white/20 border border-white/30 overflow-hidden shadow-inner">
                  <div
                    className="absolute left-0 top-0 h-full rounded-full transition-all duration-150"
                    style={{
                      width: `${((lightingTemp - 2200) / 1800) * 100}%`,
                      background: 'linear-gradient(90deg, #ff9729, #fbbf24)',
                      boxShadow: '0 0 14px rgba(251, 191, 36, 0.6)',
                    }}
                  />
                </div>
                <div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none transition-transform duration-100 ease-out group-active:scale-115"
                  style={{ left: `${((lightingTemp - 2200) / 1800) * 100}%` }}
                >
                  <div className="w-7 h-7 rounded-full bg-white border-2 border-white shadow-lg flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-amber-400" />
                  </div>
                </div>
                <input
                  type="range"
                  min="2200"
                  max="4000"
                  step="100"
                  value={lightingTemp}
                  onChange={(e) => setLightingTemp(+e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  aria-label="Lighting Temperature"
                />
              </div>

              <button
                type="button"
                onClick={() => setLightingTemp(Math.min(4000, lightingTemp + 100))}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 text-white font-bold text-sm flex items-center justify-center shrink-0 cursor-pointer shadow-sm transition"
                aria-label="Increase lighting temperature"
              >
                +
              </button>
            </div>
            <p className="text-[11px] text-neutral-400 font-light">
              Soft, warm candlelight glow. Gentle ambient light helps you let your guard down, eases nervous jitters, and makes conversation flow with natural warmth.
            </p>
          </div>

          {/* Acoustic Decibel Equalizer */}
          <div className="p-5 rounded-2xl bg-black/50 border border-white/10 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-neutral-300 flex items-center space-x-1.5">
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Acoustic Decibel Level</span>
              </span>
              <span className="font-bold font-mono text-emerald-400">≤ {decibelTarget} dB</span>
            </div>
            <div className="flex items-end space-x-1.5 h-7 py-1">
              {Array.from({ length: 14 }).map((_, i) => (
                <span
                  key={i}
                  className="waveform-bar"
                  style={{
                    backgroundColor: decibelTarget <= 45 ? '#34d399' : '#fbbf24',
                    height: `${Math.min(100, 20 + Math.sin(i * 0.8) * 40 + (decibelTarget / 65) * 40)}%`,
                    animationPlayState: 'running',
                  }}
                />
              ))}
            </div>

            {/* Tactile Stepper + High-Visibility Decibel Slider */}
            <div className="flex items-center space-x-2.5">
              <button
                type="button"
                onClick={() => setDecibelTarget(Math.max(35, decibelTarget - 5))}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 text-white font-bold text-sm flex items-center justify-center shrink-0 cursor-pointer shadow-sm transition"
                aria-label="Decrease decibel target"
              >
                -
              </button>

              <div className="relative flex-1 flex items-center h-11 group select-none">
                <div className="relative w-full h-3 rounded-full bg-white/20 border border-white/30 overflow-hidden shadow-inner">
                  <div
                    className="absolute left-0 top-0 h-full rounded-full transition-all duration-150"
                    style={{
                      width: `${((decibelTarget - 35) / 30) * 100}%`,
                      background: 'linear-gradient(90deg, #34d399, #10b981)',
                      boxShadow: '0 0 14px rgba(52, 211, 153, 0.6)',
                    }}
                  />
                </div>
                <div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none transition-transform duration-100 ease-out group-active:scale-115"
                  style={{ left: `${((decibelTarget - 35) / 30) * 100}%` }}
                >
                  <div className="w-7 h-7 rounded-full bg-white border-2 border-white shadow-lg flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                </div>
                <input
                  type="range"
                  min="35"
                  max="65"
                  value={decibelTarget}
                  onChange={(e) => setDecibelTarget(+e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  aria-label="Acoustic Decibel Target"
                />
              </div>

              <button
                type="button"
                onClick={() => setDecibelTarget(Math.min(65, decibelTarget + 5))}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 text-white font-bold text-sm flex items-center justify-center shrink-0 cursor-pointer shadow-sm transition"
                aria-label="Increase decibel target"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Venue Format Buttons */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-bold text-neutral-300 block">Thoughtful Date Settings</span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { id: 'coffee', label: 'Craft Tea & Coffee', icon: Coffee, desc: 'Quiet booth · ≤45 dB' },
              { id: 'jazz', label: 'Acoustic Jazz Club', icon: Music, desc: 'Warm 2400K · Diffuse' },
              { id: 'botanical', label: 'Botanical Walk', icon: Sparkles, desc: 'Nature path · Zero noise' },
              { id: 'gallery', label: 'Art Gallery Walk', icon: Zap, desc: 'Paced movement · High EQ' },
            ].map((v) => {
              const Icon = v.icon
              const isSel = selectedVenue === v.id
              return (
                <button
                  key={v.id}
                  onClick={() => {
                    sounds.playTap()
                    setSelectedVenue(v.id)
                  }}
                  className="p-3.5 rounded-2xl border text-left transition-all duration-300 space-y-1"
                  style={{
                    background: isSel ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.4)',
                    borderColor: isSel ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.08)',
                    boxShadow: isSel ? '0 0 20px rgba(255,255,255,0.1)' : 'none',
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <Icon className="w-3.5 h-3.5 text-amber-300" />
                    <span className="text-xs font-bold text-white">{v.label}</span>
                  </div>
                  <span className="text-[10px] text-neutral-400 block font-mono">{v.desc}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* 5. FLIPPABLE ICEBREAKER PROMPT CARDS */}
      <div className="bg-[#121216] border border-white/[0.08] rounded-[2.5rem] p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">
              Skip The Small Talk
            </span>
            <h3 className="text-xl font-bold text-white">
              3 Genuine Conversation Starters
            </h3>
            <p className="text-xs text-neutral-400 font-light">
              Tap any card to see why this question sparks warmth with {candidate.identity.name.split(' ')[0]}.
            </p>
          </div>
          <Brain className="w-5 h-5 text-emerald-400" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {icebreakers.map((card) => {
            const isFlipped = flippedCardId === card.id
            return (
              <div
                key={card.id}
                onClick={() => {
                  sounds.playTap()
                  setFlippedCardId(isFlipped ? null : card.id)
                }}
                className="group p-6 rounded-2xl border transition-all duration-500 cursor-pointer relative overflow-hidden min-h-[190px] flex flex-col justify-between"
                style={{
                  background: isFlipped ? 'rgba(52,211,153,0.08)' : 'rgba(255,255,255,0.025)',
                  borderColor: isFlipped ? 'rgba(52,211,153,0.35)' : 'rgba(255,255,255,0.07)',
                  boxShadow: isFlipped ? '0 0 24px rgba(52,211,153,0.15)' : 'none',
                  transform: isFlipped ? 'scale(0.99)' : 'scale(1)',
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                      {card.level}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-neutral-300">
                      {isFlipped ? 'Why this matters' : 'Tap to Flip ↻'}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white mb-2">{card.title}</h4>

                  <p className="text-xs text-neutral-300 font-light leading-relaxed italic">
                    {isFlipped ? card.back : card.front}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/[0.05] flex items-center justify-between text-[10px] text-neutral-400 font-mono">
                  <span>{isFlipped ? 'Deep Alignment' : 'Tap to flip card'}</span>
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 6. GHOSTING & SAFETY DISCLOSURE */}
      <div className="bg-[#121216] border border-white/[0.08] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Scale className="w-4 h-4 text-purple-400" />
            <h4 className="text-sm font-bold text-white tracking-tight">
              Kindness, Even When It&apos;s Not a Match
            </h4>
          </div>
          <p className="text-xs text-neutral-400 font-light max-w-xl leading-relaxed">
            If the spark isn&apos;t there after meeting, no one is ever left guessing or ghosted. Send a gracious, respectful note with one tap so both of you leave with closure, dignity, and zero bitter feelings.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <div className="text-right">
            <span className="text-[10px] font-mono text-neutral-400 uppercase block">Respectful Closure</span>
            <span className="text-sm font-semibold text-emerald-400 font-mono">Zero Ghosting Culture</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default FirstDateBriefView
