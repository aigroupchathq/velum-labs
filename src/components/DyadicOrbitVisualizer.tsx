// ============================================================================
// src/components/DyadicOrbitVisualizer.tsx
// Wingman: Cinematic Dyadic Resonance Orbit – Full Interactive Visual Suite
// Animated orbital rings, particle trails, glowing beam, live physics sliders
// ============================================================================

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Sparkles, Activity, Zap } from 'lucide-react'

interface DyadicOrbitVisualizerProps {
  scoreAtoB: number
  scoreBtoA: number
  nameA: string
  nameB: string
  photoA?: string
  photoB?: string
}

interface Particle {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
  opacity: number
}

function useAnimatedValue(target: number, duration = 600) {
  const [current, setCurrent] = useState(target)
  const animRef = useRef<number | null>(null)
  const startRef = useRef(current)
  const startTimeRef = useRef<number | null>(null)

  useEffect(() => {
    startRef.current = current
    startTimeRef.current = null
    if (animRef.current) cancelAnimationFrame(animRef.current)

    const animate = (now: number) => {
      if (!startTimeRef.current) startTimeRef.current = now
      const elapsed = now - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3)
      setCurrent(Math.round(startRef.current + (target - startRef.current) * ease))
      if (progress < 1) animRef.current = requestAnimationFrame(animate)
    }
    animRef.current = requestAnimationFrame(animate)
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [target]) // eslint-disable-line

  return current
}

export const DyadicOrbitVisualizer: React.FC<DyadicOrbitVisualizerProps> = ({
  scoreAtoB: initialAtoB,
  scoreBtoA: initialBtoA,
  nameA,
  nameB,
  photoA,
  photoB,
}) => {
  const [aToB, setAToB] = useState(initialAtoB)
  const [bToA, setBToA] = useState(initialBtoA)
  const [isHovered, setIsHovered] = useState(false)
  const [particles, setParticles] = useState<Particle[]>([])
  const [activePreset, setActivePreset] = useState<string | null>('twin')
  const particleIdRef = useRef(0)

  // Animated score counter
  const harmonicRaw = aToB > 0 && bToA > 0 ? Math.round((2 * aToB * bToA) / (aToB + bToA)) : 0
  const displayScore = useAnimatedValue(harmonicRaw)
  const asymmetryDelta = Math.abs(aToB - bToA)

  // Color system based on score
  const getScoreColor = useCallback(() => {
    if (harmonicRaw >= 85) return { ring: '#ffffff', glow: 'rgba(255,255,255,0.7)', accent: '#e8e4d8', label: 'Twin Resonance', beam: '#c8c0b0' }
    if (harmonicRaw >= 65) return { ring: '#34d399', glow: 'rgba(52,211,153,0.8)', accent: '#6ee7b7', label: 'Strong Affinity', beam: '#34d399' }
    if (harmonicRaw >= 40) return { ring: '#fbbf24', glow: 'rgba(251,191,36,0.8)', accent: '#fcd34d', label: 'Moderate Tension', beam: '#f59e0b' }
    return { ring: '#f87171', glow: 'rgba(248,113,113,0.8)', accent: '#fca5a5', label: 'Low Resonance', beam: '#ef4444' }
  }, [harmonicRaw])

  const colors = getScoreColor()

  // Orbital geometry
  const orbitDistance = Math.max(34, Math.round(138 - (harmonicRaw / 100) * 100))
  const ringRadiusA = 46 + (aToB / 100) * 16
  const ringRadiusB = 46 + (bToA / 100) * 16

  // Particle system – spawn on score change
  useEffect(() => {
    if (harmonicRaw < 5) return
    const count = Math.max(3, Math.floor(harmonicRaw / 15))
    const newParticles: Particle[] = Array.from({ length: count }, (_, i) => ({
      id: ++particleIdRef.current,
      x: 38 + Math.random() * 24,
      y: 35 + Math.random() * 30,
      size: 2 + Math.random() * 3,
      duration: 1.4 + Math.random() * 1.4,
      delay: i * 0.18,
      opacity: 0.5 + Math.random() * 0.5,
    }))
    setParticles(prev => [...prev.slice(-18), ...newParticles])
    const timeout = setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)))
    }, 3200)
    return () => clearTimeout(timeout)
  }, [harmonicRaw])

  const presets = [
    { id: 'twin', label: 'Twin Resonance', icon: '◈', aToB: 96, bToA: 94 },
    { id: 'unrequited', label: 'Unrequited', icon: '⟢', aToB: 92, bToA: 28 },
    { id: 'zero', label: 'Zero-Floor', icon: '✕', aToB: 88, bToA: 0 },
    { id: 'open', label: 'Open', icon: '○', aToB: 55, bToA: 60 },
  ]

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative rounded-[2.5rem] overflow-hidden border transition-all duration-700"
      style={{
        background: 'rgba(14, 14, 18, 0.92)',
        backdropFilter: 'blur(40px)',
        borderColor: isHovered ? `rgba(255,255,255,0.18)` : `rgba(255,255,255,0.08)`,
        boxShadow: isHovered
          ? `0 0 0 1px rgba(255,255,255,0.06), 0 40px 80px -20px rgba(0,0,0,0.85), 0 0 80px -30px ${colors.glow}`
          : `0 20px 60px -20px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)`,
      }}
    >
      {/* ── Ambient radial glow (background layer) ── */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-1000"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 50% 45%, ${colors.glow.replace('0.8', isHovered ? '0.18' : '0.1')} 0%, transparent 70%)`,
        }}
      />

      {/* ── Header ── */}
      <div className="relative z-10 px-6 sm:px-8 pt-6 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.07]">
        <div className="flex items-center space-x-3">
          {/* Live status beacon */}
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ backgroundColor: colors.ring }} />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ backgroundColor: colors.ring }} />
          </span>
          <div>
            <span className="apple-subhead">{colors.label}</span>
            <h3 className="text-sm sm:text-base font-semibold text-white tracking-tight">
              Two Gravitational Horizons · One Resonant Centre
            </h3>
          </div>
        </div>

        {/* Tension badge */}
        <div
          className="flex items-center space-x-2 px-3.5 py-2 rounded-2xl backdrop-blur border transition-colors duration-500"
          style={{
            background: asymmetryDelta > 20 ? 'rgba(251,191,36,0.08)' : 'rgba(255,255,255,0.04)',
            borderColor: asymmetryDelta > 20 ? 'rgba(251,191,36,0.25)' : 'rgba(255,255,255,0.08)',
          }}
        >
          <Activity className="w-3.5 h-3.5" style={{ color: asymmetryDelta > 20 ? '#fbbf24' : '#a1a1aa' }} />
          <span className="text-xs font-mono" style={{ color: asymmetryDelta > 20 ? '#fcd34d' : '#a1a1aa' }}>
            Δ {asymmetryDelta}% {asymmetryDelta > 20 ? 'Directional Gap' : asymmetryDelta > 5 ? 'Near Balanced' : 'Perfectly Balanced'}
          </span>
        </div>
      </div>

      {/* ── MAIN CANVAS AREA ── */}
      <div className="relative flex flex-col items-center py-10 sm:py-14 min-h-[320px]">

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {particles.map(p => (
            <div
              key={p.id}
              className="particle-dot"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.size,
                height: p.size,
                backgroundColor: colors.ring,
                opacity: p.opacity,
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`,
                boxShadow: `0 0 ${p.size * 3}px ${colors.ring}`,
              }}
            />
          ))}
        </div>

        {/* SVG Orbital Canvas */}
        <div className="relative w-full max-w-[500px] h-[230px] sm:h-[260px] flex items-center justify-center mx-auto">
          <svg
            className="w-full h-full overflow-visible"
            viewBox="0 0 500 260"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Ring gradient A */}
              <radialGradient id="rgA" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={colors.ring} stopOpacity="0.95" />
                <stop offset="100%" stopColor="#818cf8" stopOpacity="0.2" />
              </radialGradient>
              {/* Ring gradient B */}
              <radialGradient id="rgB" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.2" />
                <stop offset="100%" stopColor={colors.ring} stopOpacity="0.95" />
              </radialGradient>
              {/* Beam gradient */}
              <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="#a78bfa" stopOpacity="0.5" />
                <stop offset="30%"  stopColor={colors.beam} stopOpacity="0.9" />
                <stop offset="50%"  stopColor="#ffffff"  stopOpacity="1" />
                <stop offset="70%"  stopColor={colors.beam} stopOpacity="0.9" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.5" />
              </linearGradient>
              {/* Center lens gradient */}
              <radialGradient id="lensGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%"   stopColor={colors.ring} stopOpacity="0.35" />
                <stop offset="50%"  stopColor={colors.ring} stopOpacity="0.08" />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </radialGradient>
              {/* Glow filter A */}
              <filter id="glowA" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              {/* Glow filter B */}
              <filter id="glowB" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              {/* Beam blur */}
              <filter id="beamBlur" x="-20%" y="-100%" width="140%" height="300%">
                <feGaussianBlur stdDeviation="2.5" />
              </filter>
            </defs>

            {/* ── Orbit A (Left) ── */}
            <g transform={`translate(${250 - orbitDistance}, 130)`}>
              {/* Outer ripple ring 1 */}
              <circle r={ringRadiusA + 28} stroke={colors.ring} strokeWidth="0.5" strokeOpacity="0.12" className="ring-ripple" />
              {/* Outer ripple ring 2 */}
              <circle r={ringRadiusA + 14} stroke={colors.ring} strokeWidth="0.8" strokeOpacity="0.18" className="ring-ripple" style={{ animationDelay: '1s' }} />
              {/* Faint rotation dashes */}
              <circle
                r={ringRadiusA + 6}
                stroke={colors.ring}
                strokeWidth="0.5"
                strokeOpacity="0.15"
                strokeDasharray="4 8"
                className="harmonic-orbit-slow"
              />
              {/* Core glowing ring */}
              <circle
                r={ringRadiusA}
                stroke={`url(#rgA)`}
                strokeWidth={Math.max(1.8, (aToB / 100) * 3.5)}
                filter="url(#glowA)"
                style={{ transition: 'r 0.6s cubic-bezier(0.16,1,0.3,1), stroke-width 0.6s' }}
              />
              {/* Orbit beacon node */}
              <circle
                cx={ringRadiusA}
                cy="0"
                r="4"
                fill={colors.ring}
                className="glow-flicker"
                style={{ filter: `drop-shadow(0 0 8px ${colors.ring})` }}
              />
              <circle cx={ringRadiusA} cy="0" r="2" fill="#fff" />
            </g>

            {/* ── Orbit B (Right) ── */}
            <g transform={`translate(${250 + orbitDistance}, 130)`}>
              {/* Ripple rings */}
              <circle r={ringRadiusB + 28} stroke={colors.ring} strokeWidth="0.5" strokeOpacity="0.12" className="ring-ripple" style={{ animationDelay: '0.5s' }} />
              <circle r={ringRadiusB + 14} stroke={colors.ring} strokeWidth="0.8" strokeOpacity="0.18" className="ring-ripple" style={{ animationDelay: '1.5s' }} />
              {/* Dash ring */}
              <circle
                r={ringRadiusB + 6}
                stroke={colors.ring}
                strokeWidth="0.5"
                strokeOpacity="0.15"
                strokeDasharray="4 8"
                className="harmonic-orbit-reverse"
              />
              {/* Core ring */}
              <circle
                r={ringRadiusB}
                stroke={`url(#rgB)`}
                strokeWidth={Math.max(1.8, (bToA / 100) * 3.5)}
                filter="url(#glowA)"
                style={{ transition: 'r 0.6s cubic-bezier(0.16,1,0.3,1), stroke-width 0.6s' }}
              />
              {/* Beacon */}
              <circle
                cx={-ringRadiusB}
                cy="0"
                r="4"
                fill={colors.ring}
                className="glow-flicker"
                style={{ filter: `drop-shadow(0 0 8px ${colors.ring})`, animationDelay: '1.2s' }}
              />
              <circle cx={-ringRadiusB} cy="0" r="2" fill="#fff" />
            </g>

            {/* ── Connection Beam ── */}
            {harmonicRaw > 0 && (
              <>
                {/* Blurred glow version */}
                <line
                  x1={250 - orbitDistance}
                  y1="130"
                  x2={250 + orbitDistance}
                  y2="130"
                  stroke="url(#beamGrad)"
                  strokeWidth="6"
                  strokeOpacity="0.25"
                  filter="url(#beamBlur)"
                />
                {/* Crisp beam */}
                <line
                  x1={250 - orbitDistance}
                  y1="130"
                  x2={250 + orbitDistance}
                  y2="130"
                  stroke="url(#beamGrad)"
                  strokeWidth={Math.max(1, (harmonicRaw / 100) * 2.5)}
                  strokeDasharray={`${Math.max(4, harmonicRaw / 10)} ${Math.max(3, 12 - harmonicRaw / 12)}`}
                  className="beam-pulse"
                />
              </>
            )}

            {/* ── Central Lens ── */}
            <circle
              cx="250"
              cy="130"
              r={Math.max(10, (harmonicRaw / 100) * 44)}
              fill="url(#lensGrad)"
              filter="url(#glowB)"
              style={{ transition: 'r 0.7s cubic-bezier(0.16,1,0.3,1)' }}
            />
          </svg>

          {/* ── Avatar A ── */}
          <div
            className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none transition-all duration-700"
            style={{ left: `calc(50% - ${orbitDistance}px - 32px)` }}
          >
            <div
              className="w-16 h-16 rounded-full overflow-hidden transition-all duration-500"
              style={{
                boxShadow: `0 0 0 2px ${colors.ring}55, 0 0 20px ${colors.glow}`,
              }}
            >
              {photoA ? (
                <img src={photoA} alt={nameA} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-sm font-bold text-white">{nameA[0]}</div>
              )}
            </div>
            <span className="text-[11px] font-semibold text-white/90 mt-2 drop-shadow-md">{nameA}</span>
            <span className="text-[10px] font-mono tabular-nums" style={{ color: colors.accent }}>{aToB}%</span>
          </div>

          {/* ── Central Score Badge ── */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
            <div
              className="px-4 py-2.5 rounded-2xl flex flex-col items-center transition-all duration-500"
              style={{
                background: 'rgba(8,8,12,0.88)',
                backdropFilter: 'blur(20px)',
                border: `1px solid ${colors.ring}44`,
                boxShadow: `0 0 0 1px ${colors.ring}22, 0 8px 32px rgba(0,0,0,0.8), 0 0 40px ${colors.glow.replace('0.8','0.3')}`,
              }}
            >
              <span
                className="text-3xl sm:text-4xl font-bold tracking-tight font-mono score-pulse shimmer-text leading-none"
                style={{ '--shimmer-color': colors.ring } as React.CSSProperties}
              >
                {displayScore}%
              </span>
              <div className="flex items-center space-x-1 mt-1">
                <Sparkles className="w-2.5 h-2.5" style={{ color: colors.accent }} />
                <span className="text-[9px] uppercase tracking-widest font-semibold" style={{ color: colors.accent }}>
                  Resonance
                </span>
              </div>
            </div>
          </div>

          {/* ── Avatar B ── */}
          <div
            className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none transition-all duration-700"
            style={{ left: `calc(50% + ${orbitDistance}px - 32px)` }}
          >
            <div
              className="w-16 h-16 rounded-full overflow-hidden transition-all duration-500"
              style={{ boxShadow: `0 0 0 2px ${colors.ring}33, 0 0 20px ${colors.glow}` }}
            >
              {photoB ? (
                <img src={photoB} alt={nameB} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-sm font-bold text-white">{nameB[0]}</div>
              )}
            </div>
            <span className="text-[11px] font-semibold text-white/90 mt-2 drop-shadow-md">{nameB}</span>
            <span className="text-[10px] font-mono tabular-nums" style={{ color: colors.accent }}>{bToA}%</span>
          </div>
        </div>

        {/* ── Waveform Coherence Bar ── */}
        <div className="flex flex-col items-center space-y-2 mt-6">
          <div className="flex items-end space-x-[3px] h-7">
            {Array.from({ length: 11 }).map((_, i) => (
              <span
                key={i}
                className="waveform-bar"
                style={{
                  backgroundColor: colors.ring,
                  opacity: 0.3 + (harmonicRaw / 100) * 0.7,
                  animationPlayState: harmonicRaw > 0 ? 'running' : 'paused',
                  filter: `drop-shadow(0 0 4px ${colors.ring})`,
                }}
              />
            ))}
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
            Harmonic Coherence · {displayScore}%
          </span>
        </div>
      </div>

      {/* ── Controls: Tactile Sliders ── */}
      <div className="px-6 sm:px-8 pb-8 space-y-6">
        <div className="h-px bg-white/[0.06]" />

        <div className="text-center space-y-0.5">
          <p className="text-xs text-neutral-400 font-light">
            Drag to observe zero-floor harmonic physics live — if either side reaches 0%, total connection collapses.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Slider A → B */}
          <div
            className="p-4 rounded-2xl space-y-3 border transition-all duration-300"
            style={{
              background: 'rgba(255,255,255,0.025)',
              borderColor: 'rgba(255,255,255,0.06)',
            }}
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-neutral-300">{nameA} → {nameB}</span>
              <span
                className="font-bold font-mono text-sm tabular-nums transition-colors duration-300"
                style={{ color: aToB > 50 ? colors.ring : '#f87171' }}
              >
                {aToB}%
              </span>
            </div>
            {/* Progress track */}
            <div className="relative h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full rounded-full transition-all duration-300"
                style={{
                  width: `${aToB}%`,
                  background: `linear-gradient(90deg, ${colors.ring}88, ${colors.ring})`,
                  boxShadow: `0 0 10px ${colors.glow}`,
                }}
              />
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={aToB}
              onChange={e => { setAToB(+e.target.value); setActivePreset(null) }}
              className="cinematic-slider w-full"
              style={{
                background: `linear-gradient(90deg, ${colors.ring} ${aToB}%, rgba(255,255,255,0.1) ${aToB}%)`,
              }}
            />
          </div>

          {/* Slider B → A */}
          <div
            className="p-4 rounded-2xl space-y-3 border transition-all duration-300"
            style={{
              background: 'rgba(255,255,255,0.025)',
              borderColor: 'rgba(255,255,255,0.06)',
            }}
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-neutral-300">{nameB} → {nameA}</span>
              <span
                className="font-bold font-mono text-sm tabular-nums transition-colors duration-300"
                style={{ color: bToA > 50 ? colors.ring : '#f87171' }}
              >
                {bToA}%
              </span>
            </div>
            <div className="relative h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full rounded-full transition-all duration-300"
                style={{
                  width: `${bToA}%`,
                  background: `linear-gradient(90deg, ${colors.ring}88, ${colors.ring})`,
                  boxShadow: `0 0 10px ${colors.glow}`,
                }}
              />
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={bToA}
              onChange={e => { setBToA(+e.target.value); setActivePreset(null) }}
              className="cinematic-slider w-full"
              style={{
                background: `linear-gradient(90deg, ${colors.ring} ${bToA}%, rgba(255,255,255,0.1) ${bToA}%)`,
              }}
            />
          </div>
        </div>

        {/* Preset scenario tiles */}
        <div className="flex flex-wrap gap-2 justify-center pt-1">
          {presets.map(p => {
            const isActive = activePreset === p.id
            return (
              <button
                key={p.id}
                onClick={() => {
                  setAToB(p.aToB)
                  setBToA(p.bToA)
                  setActivePreset(p.id)
                }}
                className="group flex items-center space-x-1.5 px-3.5 py-2 rounded-2xl text-[11px] font-semibold transition-all duration-300 border"
                style={{
                  background: isActive ? `${colors.ring}18` : 'rgba(255,255,255,0.03)',
                  borderColor: isActive ? `${colors.ring}55` : 'rgba(255,255,255,0.08)',
                  color: isActive ? colors.ring : '#a1a1aa',
                  boxShadow: isActive ? `0 0 16px ${colors.glow.replace('0.8', '0.25')}` : 'none',
                  transform: isActive ? 'translateY(-1px)' : 'none',
                }}
              >
                <span className="text-sm">{p.icon}</span>
                <span>{p.label}</span>
                {isActive && <Zap className="w-2.5 h-2.5 ml-0.5" />}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
