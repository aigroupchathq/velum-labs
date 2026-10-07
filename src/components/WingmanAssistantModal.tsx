// ============================================================================
// src/components/WingmanAssistantModal.tsx
// Wingman: Cinematic Intelligence Suite — Full Rebuild
// Persona-calibrated tone · NLP parser · Live leaderboard · Particle effects
// ============================================================================

import React, { useState, useEffect, useRef } from 'react'
import {
  Send,
  Zap,
  Target,
  UserCheck,
  X,
  ChevronRight,
  ChevronLeft,
  MessageCircle,
  Flame,
  Heart,
  Star,
  TrendingUp,
  Crosshair,
} from 'lucide-react'
import type { UniversalUserProfile, MatchEvaluation } from '../types'
import { evaluateMatch } from '../utils/matchingEngine'
import { mockCandidates } from '../data/mockProfiles'

interface WingmanAssistantModalProps {
  currentUser: UniversalUserProfile
  onClose: () => void
  onApplyIntentUpdate: (updatedUser: UniversalUserProfile, predictionSummary: string) => void
  onInspectCandidate: (candidate: UniversalUserProfile, evaluation: MatchEvaluation) => void
}

interface WingmanQuestion {
  id: string
  wingmanHook: string
  subtext: string
  icon: React.ReactNode
  simpleOptions: {
    label: string
    clarifier: string
    emoji: string
    apply: (user: UniversalUserProfile) => UniversalUserProfile
  }[]
}

// ── Animated counter hook ──────────────────────────────────────────────────
function useCount(target: number, duration = 500) {
  const [val, setVal] = useState(target)
  const raf = useRef<number | null>(null)
  const startVal = useRef(val)
  const startTime = useRef<number | null>(null)

  useEffect(() => {
    startVal.current = val
    startTime.current = null
    if (raf.current) cancelAnimationFrame(raf.current)
    const animate = (now: number) => {
      if (!startTime.current) startTime.current = now
      const p = Math.min((now - startTime.current) / duration, 1)
      const e = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(startVal.current + (target - startVal.current) * e))
      if (p < 1) raf.current = requestAnimationFrame(animate)
    }
    raf.current = requestAnimationFrame(animate)
    return () => { if (raf.current) cancelAnimationFrame(raf.current) }
  }, [target]) // eslint-disable-line

  return val
}

export const WingmanAssistantModal: React.FC<WingmanAssistantModalProps> = ({
  currentUser,
  onClose,
  onApplyIntentUpdate,
  onInspectCandidate,
}) => {
  const isSenior = currentUser.identity.age >= 60
  const isYoung = currentUser.identity.age <= 25
  const firstName = currentUser.identity.name.split(' ')[0]

  const persona = isSenior
    ? {
        role: 'Distinguished Wingman',
        tagline: 'Discreet. Direct. Zero games.',
        greeting: `${firstName}, let's cut right to it. You know exactly what peace, style, and beauty look like in your world. I'll handle the rest — tell me what we're after.`,
        badge: '◈ Refined',
        badgeColor: '#d4af7a',
        accentColor: '#d4af7a',
        glowColor: 'rgba(212,175,122,0.35)',
        icon: '♟',
      }
    : isYoung
    ? {
        role: 'Real-Talk Wingman',
        tagline: 'Zero fluff. Just what actually clicks.',
        greeting: `${firstName}, real talk — no algorithm jargon, no fake compatibility scores. Tell me what actually matters to you and I'll find who actually matches.`,
        badge: '◈ Direct',
        badgeColor: '#34d399',
        accentColor: '#34d399',
        glowColor: 'rgba(52,211,153,0.35)',
        icon: '⚡',
      }
    : {
        role: 'Strategic Wingman',
        tagline: 'High-signal. High-EQ. Zero noise.',
        greeting: `${firstName}, I've already read your profile. The algorithm knows what you look for. Now let me ask the questions it can't — to find someone who actually keeps pace with your rhythm.`,
        badge: '◈ Strategic',
        badgeColor: '#818cf8',
        accentColor: '#818cf8',
        glowColor: 'rgba(129,140,248,0.35)',
        icon: '◎',
      }

  // ── Questions per persona ───────────────────────────────────────────────
  const questions: WingmanQuestion[] = isSenior
    ? [
        {
          id: 'energy',
          wingmanHook: `What kind of energy do you actually want walking into the room?`,
          subtext: 'This is about presence, not just personality.',
          icon: <Flame className="w-4 h-4" />,
          simpleOptions: [
            {
              label: 'Youthful elegance — light, curious, effortlessly beautiful',
              clarifier: 'Partners 20–35 who carry themselves with grace and genuine interest.',
              emoji: '✦',
              apply: (u) => ({ ...u, preferences: { ...u.preferences, minAge: 20, maxAge: 35 } }),
            },
            {
              label: 'Quiet sophistication — settled, warm, no drama',
              clarifier: 'Partners 38–55 with grounded emotional intelligence.',
              emoji: '◈',
              apply: (u) => ({ ...u, preferences: { ...u.preferences, minAge: 38, maxAge: 55 } }),
            },
            {
              label: "I'm completely open — let the resonance decide",
              clarifier: 'Wide aperture. The algorithm finds the harmonic centre.',
              emoji: '○',
              apply: (u) => ({ ...u, preferences: { ...u.preferences, minAge: 18, maxAge: 80 } }),
            },
          ],
        },
        {
          id: 'background',
          wingmanHook: `Does cultural background matter to you — honestly?`,
          subtext: 'Your honest answer sharpens the prediction. No judgment here.',
          icon: <Target className="w-4 h-4" />,
          simpleOptions: [
            {
              label: 'Yes — I specifically want a Caucasian partner',
              clarifier: 'Ethnicity preference encoded directly into matching.',
              emoji: '◈',
              apply: (u) => ({ ...u, preferences: { ...u.preferences, ethnicitiesSought: ['Caucasian / White'] } }),
            },
            {
              label: 'Open to any background with matching values',
              clarifier: 'Values alignment is the primary filter.',
              emoji: '○',
              apply: (u) => ({ ...u, preferences: { ...u.preferences, ethnicitiesSought: [] } }),
            },
          ],
        },
        {
          id: 'dealbreaker',
          wingmanHook: `What is the one thing that instantly ends it for you?`,
          subtext: 'This becomes a hard exclusion at the engine level — not a preference.',
          icon: <Crosshair className="w-4 h-4" />,
          simpleOptions: [
            {
              label: 'Smoking / nicotine of any kind — hard no',
              clarifier: 'Zero tolerance dealbreaker applied immediately.',
              emoji: '✗',
              apply: (u) => ({ ...u, preferences: { ...u.preferences, smokingPreference: { ...u.preferences.smokingPreference, allowedSmoking: ['never'], dealbreaker: true } } }),
            },
            {
              label: "Emotional immaturity — I'm done raising adults",
              clarifier: 'Emotional intelligence weighting boosted in personality scoring.',
              emoji: '✗',
              apply: (u) => ({ ...u, values: { ...u.values, coreValues: Array.from(new Set([...u.values.coreValues, 'Emotional Maturity', 'Self-Awareness'])) } }),
            },
            {
              label: 'Dishonesty or performative personas',
              clarifier: 'Authenticity signals weight boosted. Verified profiles prioritised.',
              emoji: '✗',
              apply: (u) => ({ ...u, values: { ...u.values, coreValues: Array.from(new Set([...u.values.coreValues, 'Authenticity', 'Trust'])) } }),
            },
          ],
        },
      ]
    : isYoung
    ? [
        {
          id: 'vibe',
          wingmanHook: `What's the actual vibe you're after?`,
          subtext: 'Skip the dating-app clichés. What would make you text your best friend about them?',
          icon: <Flame className="w-4 h-4" />,
          simpleOptions: [
            {
              label: 'Someone who challenges me intellectually — deep conversations',
              clarifier: 'Intellectual resonance and curiosity weighted heavily.',
              emoji: '◎',
              apply: (u) => ({ ...u, values: { ...u.values, coreValues: Array.from(new Set([...u.values.coreValues, 'Intellectual Curiosity', 'Deep Dialogue'])) } }),
            },
            {
              label: 'Creative energy — artists, builders, thinkers',
              clarifier: 'Creative profession and aesthetic values prioritised.',
              emoji: '✦',
              apply: (u) => ({ ...u, values: { ...u.values, coreValues: Array.from(new Set([...u.values.coreValues, 'Art & Aesthetics', 'Creativity'])) } }),
            },
            {
              label: 'Someone older and more experienced — I like that grounded quality',
              clarifier: 'Age range expanded to 35–70 with maturity signals weighted.',
              emoji: '◈',
              apply: (u) => ({ ...u, preferences: { ...u.preferences, minAge: 35, maxAge: 70 } }),
            },
          ],
        },
        {
          id: 'dealbreaker',
          wingmanHook: `What gives you the immediate ick? No filter.`,
          subtext: 'Your Wingman will permanently block that from your matches.',
          icon: <Crosshair className="w-4 h-4" />,
          simpleOptions: [
            {
              label: "Smokers — can't stand it",
              clarifier: 'Hard dealbreaker encoded.',
              emoji: '✗',
              apply: (u) => ({ ...u, preferences: { ...u.preferences, smokingPreference: { ...u.preferences.smokingPreference, allowedSmoking: ['never'], dealbreaker: true } } }),
            },
            {
              label: "People who can't communicate — ghosters, game players",
              clarifier: 'Communication style compatibility heavily weighted.',
              emoji: '✗',
              apply: (u) => ({ ...u, values: { ...u.values, coreValues: Array.from(new Set([...u.values.coreValues, 'Directness', 'Reliability'])) } }),
            },
          ],
        },
      ]
    : [
        {
          id: 'intellectual',
          wingmanHook: `What level of intellectual engagement are you looking for?`,
          subtext: 'Be precise. This directly shapes the resonance scoring.',
          icon: <Star className="w-4 h-4" />,
          simpleOptions: [
            {
              label: 'Genuine depth — I want to be challenged, not just entertained',
              clarifier: 'Intellectual curiosity and philosophical alignment weighted at max.',
              emoji: '◎',
              apply: (u) => ({ ...u, values: { ...u.values, coreValues: Array.from(new Set([...u.values.coreValues, 'Intellectual Curiosity', 'Critical Thinking'])) } }),
            },
            {
              label: 'Creative and emotionally literate — art, music, culture',
              clarifier: 'Aesthetic values and emotional intelligence prioritised.',
              emoji: '✦',
              apply: (u) => ({ ...u, values: { ...u.values, coreValues: Array.from(new Set([...u.values.coreValues, 'Art & Aesthetics', 'Emotional Intelligence'])) } }),
            },
            {
              label: 'Pragmatic warmth — grounded, reliable, no drama',
              clarifier: 'Stability, consistency and warmth signals weighted.',
              emoji: '◈',
              apply: (u) => ({ ...u, values: { ...u.values, coreValues: Array.from(new Set([...u.values.coreValues, 'Reliability', 'Warmth'])) } }),
            },
          ],
        },
        {
          id: 'lifestyle',
          wingmanHook: `What does your ideal Saturday look like — and who fits into it?`,
          subtext: 'Lifestyle compatibility is the silent predictor of long-term success.',
          icon: <Heart className="w-4 h-4" />,
          simpleOptions: [
            {
              label: 'Quiet, intentional, possibly no alcohol — shared space feels sacred',
              clarifier: 'Introvert-leaning and wellness lifestyle signals weighted.',
              emoji: '◈',
              apply: (u) => ({ ...u, values: { ...u.values, coreValues: Array.from(new Set([...u.values.coreValues, 'Mindfulness', 'Intentional Living'])) } }),
            },
            {
              label: 'Outward, social, adventurous — life should feel alive',
              clarifier: 'Social energy, curiosity and spontaneity signals weighted.',
              emoji: '✦',
              apply: (u) => ({ ...u, values: { ...u.values, coreValues: Array.from(new Set([...u.values.coreValues, 'Adventure', 'Social Energy'])) } }),
            },
          ],
        },
        {
          id: 'dealbreaker',
          wingmanHook: `What is the absolute line you will not cross?`,
          subtext: 'This is encoded as a mathematical zero — not a preference penalty.',
          icon: <Crosshair className="w-4 h-4" />,
          simpleOptions: [
            {
              label: "Smoking — I won't compromise on this",
              clarifier: 'Zero-floor dealbreaker. Engine collapses score to 0% immediately.',
              emoji: '✗',
              apply: (u) => ({ ...u, preferences: { ...u.preferences, smokingPreference: { ...u.preferences.smokingPreference, allowedSmoking: ['never'], dealbreaker: true } } }),
            },
            {
              label: 'Avoidant communicators — I need to actually talk',
              clarifier: 'Communication style compatibility threshold raised.',
              emoji: '✗',
              apply: (u) => ({ ...u, values: { ...u.values, coreValues: Array.from(new Set([...u.values.coreValues, 'Open Communication', 'Directness'])) } }),
            },
          ],
        },
      ]

  // ── State ───────────────────────────────────────────────────────────────
  const [activeQ, setActiveQ] = useState(0)
  const [customPrompt, setCustomPrompt] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [inputFocused, setInputFocused] = useState(false)

  const computeRankings = (u: UniversalUserProfile) =>
    mockCandidates
      .filter((c) => c.id !== u.id)
      .map((candidate) => ({ candidate, evaluation: evaluateMatch(u, candidate) }))
      .sort((a, b) => {
        if (a.evaluation.eligible !== b.evaluation.eligible) return a.evaluation.eligible ? -1 : 1
        return (b.evaluation.mutuality.score || 0) - (a.evaluation.mutuality.score || 0)
      })

  const [rankings, setRankings] = useState(() => computeRankings(currentUser))
  const topScore = useCount(rankings[0]?.evaluation.mutuality.score || 0)
  const eligibleCount = rankings.filter(r => r.evaluation.eligible).length

  const handleOption = (opt: WingmanQuestion['simpleOptions'][0]) => {
    setSelectedOption(opt.label)
    const updated = opt.apply(currentUser)
    const newR = computeRankings(updated)
    setRankings(newR)
    const top = newR[0]
    const msg = `Engine tuned: "${opt.label}". Best dyad: ${top?.candidate.identity.name} at ${top?.evaluation.mutuality.score}% mutual resonance.`
    setFeedback(msg)
    onApplyIntentUpdate(updated, msg)
    setTimeout(() => setSelectedOption(null), 2000)
  }

  const handlePrompt = () => {
    if (!customPrompt.trim()) return
    const lower = customPrompt.toLowerCase()
    let updated = { ...currentUser }
    let msg = ''

    if (lower.includes('white') || lower.includes('caucasian') || lower.includes('blonde')) {
      updated = { ...updated, preferences: { ...updated.preferences, ethnicitiesSought: ['Caucasian / White'] } }
      msg += 'Ethnicity: Caucasian. '
    }
    if (lower.includes('black') || lower.includes('african')) {
      updated = { ...updated, preferences: { ...updated.preferences, ethnicitiesSought: ['Black / African Descent'] } }
      msg += 'Ethnicity: Black/African. '
    }
    if (lower.includes('asian') || lower.includes('east asian')) {
      updated = { ...updated, preferences: { ...updated.preferences, ethnicitiesSought: ['East Asian'] } }
      msg += 'Ethnicity: East Asian. '
    }
    if (lower.includes('latina') || lower.includes('hispanic') || lower.includes('latin')) {
      updated = { ...updated, preferences: { ...updated.preferences, ethnicitiesSought: ['Hispanic / Latino'] } }
      msg += 'Ethnicity: Hispanic/Latino. '
    }
    if (/\b(2[0-9]|30|31|32|33)\b/.test(lower) || lower.includes('young') || lower.includes('twenties')) {
      updated = { ...updated, preferences: { ...updated.preferences, minAge: 20, maxAge: 33 } }
      msg += 'Age: 20–33. '
    }
    if (lower.includes('40') || lower.includes('forties') || lower.includes('mid-30')) {
      updated = { ...updated, preferences: { ...updated.preferences, minAge: 35, maxAge: 49 } }
      msg += 'Age: 35–49. '
    }
    if (lower.includes('mature') || lower.includes('older') || lower.includes('60') || lower.includes('distinguished') || lower.includes('senior')) {
      updated = { ...updated, preferences: { ...updated.preferences, minAge: 55, maxAge: 72 } }
      msg += 'Age: 55–72. '
    }
    if (lower.includes('art') || lower.includes('creat') || lower.includes('design') || lower.includes('music')) {
      updated = { ...updated, values: { ...updated.values, coreValues: Array.from(new Set([...updated.values.coreValues, 'Art & Aesthetics', 'Creativity'])) } }
      msg += 'Creative values activated. '
    }
    if (lower.includes('nonsmoker') || lower.includes('no smoke') || lower.includes('non-smoker') || lower.includes('hates smoking')) {
      updated = { ...updated, preferences: { ...updated.preferences, smokingPreference: { ...updated.preferences.smokingPreference, allowedSmoking: ['never'], dealbreaker: true } } }
      msg += 'Non-smoker dealbreaker: LOCKED. '
    }
    if (lower.includes('vegan') || lower.includes('plant')) {
      updated = { ...updated, lifestyle: { ...updated.lifestyle, diet: 'vegan' } }
      msg += 'Diet: Vegan aligned. '
    }
    if (lower.includes('vegetarian')) {
      updated = { ...updated, lifestyle: { ...updated.lifestyle, diet: 'vegetarian' } }
      msg += 'Diet: Vegetarian aligned. '
    }

    const newR = computeRankings(updated)
    setRankings(newR)
    const top = newR[0]
    const finalMsg = `Wingman parsed: "${customPrompt}". ${msg}Best prediction: ${top?.candidate.identity.name} (${top?.evaluation.mutuality.score}% resonance).`
    setFeedback(finalMsg)
    onApplyIntentUpdate(updated, finalMsg)
    setCustomPrompt('')
  }

  const currentQ = questions[activeQ]

  const quickPills = isSenior
    ? ['20yo white creative woman', '30–40 with quiet elegance', 'Open — best resonance wins', 'Caucasian non-smoker']
    : isYoung
    ? ['Older distinguished man', 'Intellectual 35+ creative', 'Non-smoker open to any age', 'Artist who challenges me']
    : ['Non-smoker vegetarian', '20yo white artist', 'Mature companion 55+', 'Any background — resonance only']

  // Colour system for leaderboard rank badges
  const rankColors = ['#d4af7a', '#a8a8b3', '#b87333']

  // Typing animation for greeting
  const [prevGreeting, setPrevGreeting] = useState(persona.greeting)
  const [visibleChars, setVisibleChars] = useState(0)

  if (prevGreeting !== persona.greeting) {
    setPrevGreeting(persona.greeting)
    setVisibleChars(0)
  }

  useEffect(() => {
    const full = persona.greeting.length
    let i = 0
    const interval = setInterval(() => {
      i++
      setVisibleChars(i)
      if (i >= full) clearInterval(interval)
    }, 18)
    return () => clearInterval(interval)
  }, [persona.greeting])

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6"
      style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(28px)' }}
    >
      <div
        className="w-full sm:max-w-3xl sm:max-h-[90vh] max-h-[95vh] flex flex-col rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden"
        style={{
          background: 'rgba(11,11,15,0.97)',
          backdropFilter: 'blur(60px)',
          border: `1px solid ${persona.accentColor}22`,
          boxShadow: `0 0 0 1px rgba(255,255,255,0.06), 0 -4px 80px rgba(0,0,0,0.9), 0 0 100px -40px ${persona.glowColor}`,
        }}
      >
        {/* ── Drag handle (mobile) ── */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* ── Header ── */}
        <div
          className="relative px-6 pt-5 pb-5 flex items-start justify-between"
          style={{
            borderBottom: `1px solid ${persona.accentColor}18`,
            background: `linear-gradient(135deg, ${persona.accentColor}06 0%, transparent 60%)`,
          }}
        >
          {/* Ambient glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse 60% 80% at 0% 0%, ${persona.glowColor.replace('0.35','0.12')} 0%, transparent 60%)` }}
          />

          <div className="flex items-start space-x-4 relative z-10">
            {/* W monogram */}
            <div
              className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center shrink-0 font-bold text-2xl"
              style={{
                background: `radial-gradient(circle at 30% 30%, ${persona.accentColor}30, ${persona.accentColor}08)`,
                border: `1.5px solid ${persona.accentColor}50`,
                boxShadow: `0 0 28px ${persona.glowColor}, inset 0 1px 0 ${persona.accentColor}30`,
                color: persona.accentColor,
                fontFamily: 'Georgia, serif',
              }}
            >
              {persona.icon}
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2.5 flex-wrap gap-1">
                <h2 className="text-lg font-bold text-white tracking-tight">Wingman</h2>
                <span
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider"
                  style={{
                    background: `${persona.accentColor}18`,
                    border: `1px solid ${persona.accentColor}40`,
                    color: persona.accentColor,
                  }}
                >
                  {persona.badge}
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 font-light">{persona.role} · {persona.tagline}</p>

              {/* Live stats pills */}
              <div className="flex items-center space-x-2 pt-1">
                <span
                  className="flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
                  style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.25)', color: '#6ee7b7' }}
                >
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </span>
                  <span>{eligibleCount} Eligible Dyads</span>
                </span>
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                  style={{ background: `${persona.accentColor}12`, border: `1px solid ${persona.accentColor}30`, color: persona.accentColor }}
                >
                  Top {topScore}% Resonance
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="relative z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-white/10"
            style={{ border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <X className="w-4 h-4 text-neutral-400" />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-7 py-6 space-y-6">

          {/* 1. Wingman greeting with typewriter effect */}
          <div
            className="relative p-5 rounded-2xl overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${persona.accentColor}08, rgba(255,255,255,0.02))`,
              border: `1px solid ${persona.accentColor}20`,
            }}
          >
            <div className="flex items-start space-x-3">
              <div className="mt-0.5">
                <MessageCircle className="w-4 h-4" style={{ color: persona.accentColor }} />
              </div>
              <div className="space-y-1 flex-1">
                <span className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: persona.accentColor }}>
                  {persona.role}
                </span>
                <p className="text-sm sm:text-base text-neutral-200 leading-relaxed font-light min-h-[3rem]">
                  {persona.greeting.slice(0, visibleChars)}
                  {visibleChars < persona.greeting.length && (
                    <span
                      className="inline-block w-0.5 h-4 ml-0.5 rounded-full animate-pulse align-middle"
                      style={{ backgroundColor: persona.accentColor }}
                    />
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* 2. Question module */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              border: `1px solid ${persona.accentColor}20`,
              background: 'rgba(255,255,255,0.02)',
            }}
          >
            {/* Question nav header */}
            <div className="px-5 py-4 flex items-center justify-between border-b border-white/[0.05]">
              <div className="flex items-center space-x-2">
                <span style={{ color: persona.accentColor }}>{currentQ.icon}</span>
                <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-500">
                  Question {activeQ + 1} of {questions.length}
                </span>
              </div>
              {/* Dot navigation */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveQ(Math.max(0, activeQ - 1))}
                  disabled={activeQ === 0}
                  className="w-7 h-7 rounded-full flex items-center justify-center transition-all disabled:opacity-30 hover:bg-white/10"
                >
                  <ChevronLeft className="w-3.5 h-3.5 text-white" />
                </button>
                <div className="flex items-center space-x-1.5">
                  {questions.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveQ(i)}
                      className="rounded-full transition-all duration-300"
                      style={{
                        width: activeQ === i ? 20 : 6,
                        height: 6,
                        background: activeQ === i ? persona.accentColor : 'rgba(255,255,255,0.2)',
                      }}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setActiveQ(Math.min(questions.length - 1, activeQ + 1))}
                  disabled={activeQ === questions.length - 1}
                  className="w-7 h-7 rounded-full flex items-center justify-center transition-all disabled:opacity-30 hover:bg-white/10"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            </div>

            {/* Question body */}
            <div className="p-5 space-y-4">
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-semibold text-white tracking-tight leading-snug">
                  {currentQ.wingmanHook}
                </h3>
                <p className="text-xs text-neutral-500 font-light">{currentQ.subtext}</p>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {currentQ.simpleOptions.map((opt, i) => {
                  const isSelected = selectedOption === opt.label
                  return (
                    <button
                      key={i}
                      onClick={() => handleOption(opt)}
                      className="group relative text-left p-4 rounded-xl flex items-start justify-between gap-4 transition-all duration-300 overflow-hidden"
                      style={{
                        background: isSelected ? `${persona.accentColor}15` : 'rgba(255,255,255,0.025)',
                        border: `1px solid ${isSelected ? persona.accentColor + '50' : 'rgba(255,255,255,0.06)'}`,
                        transform: isSelected ? 'scale(0.99)' : 'scale(1)',
                        boxShadow: isSelected ? `0 0 20px ${persona.glowColor}` : 'none',
                      }}
                    >
                      {/* Hover glow */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"
                        style={{ background: `linear-gradient(135deg, ${persona.accentColor}08, transparent)` }}
                      />

                      <div className="relative flex items-start space-x-3 flex-1">
                        <span
                          className="text-base font-bold mt-0.5 shrink-0"
                          style={{ color: isSelected ? persona.accentColor : 'rgba(255,255,255,0.4)' }}
                        >
                          {opt.emoji}
                        </span>
                        <div>
                          <span
                            className="text-sm font-semibold transition-colors duration-200"
                            style={{ color: isSelected ? persona.accentColor : 'white' }}
                          >
                            {opt.label}
                          </span>
                          <p className="text-[11px] text-neutral-500 font-light mt-0.5 leading-relaxed">{opt.clarifier}</p>
                        </div>
                      </div>

                      <div
                        className="relative shrink-0 flex items-center space-x-1 text-[10px] font-bold tracking-wider opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: persona.accentColor }}
                      >
                        <Zap className="w-3 h-3" />
                        <span>APPLY</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* 3. Natural language input */}
          <div
            className="rounded-2xl p-5 space-y-4 transition-all duration-300"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: `1px solid ${inputFocused ? persona.accentColor + '40' : 'rgba(255,255,255,0.06)'}`,
              boxShadow: inputFocused ? `0 0 30px ${persona.glowColor}` : 'none',
            }}
          >
            <div className="flex items-center space-x-2">
              <Target className="w-3.5 h-3.5" style={{ color: persona.accentColor }} />
              <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-500">Plain English · Anything You Want</span>
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-white">Tell Wingman exactly what you want</h4>
              <p className="text-[11px] text-neutral-500 font-light">
                Say it naturally — <em>"20yo white artist who doesn't smoke"</em> or <em>"Mature Black woman 45+ who loves jazz"</em>. Wingman decodes it.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handlePrompt()}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                placeholder={
                  isSenior
                    ? "e.g. 20yo caucasian woman who appreciates architecture and quiet evenings..."
                    : isYoung
                    ? "e.g. distinguished older man who loves jazz and doesn't smoke..."
                    : "e.g. 28yo creative non-smoker who loves ambient music and art..."
                }
                className="flex-1 px-4 py-3 text-sm text-white placeholder-neutral-600 rounded-xl focus:outline-none transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: `1px solid ${inputFocused ? persona.accentColor + '60' : 'rgba(255,255,255,0.08)'}`,
                }}
              />
              <button
                onClick={handlePrompt}
                disabled={!customPrompt.trim()}
                className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 shrink-0 disabled:opacity-40"
                style={{
                  background: customPrompt.trim() ? persona.accentColor : 'rgba(255,255,255,0.06)',
                  boxShadow: customPrompt.trim() ? `0 0 20px ${persona.glowColor}` : 'none',
                }}
              >
                <Send className="w-4 h-4 text-black" />
              </button>
            </div>

            {/* Quick pills */}
            <div className="flex flex-wrap gap-1.5">
              {quickPills.map((pill, i) => (
                <button
                  key={i}
                  onClick={() => setCustomPrompt(pill)}
                  className="px-3 py-1.5 rounded-full text-[11px] font-medium transition-all duration-200 hover:scale-105"
                  style={{
                    background: `${persona.accentColor}0a`,
                    border: `1px solid ${persona.accentColor}28`,
                    color: persona.accentColor,
                  }}
                >
                  {pill}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Feedback bar */}
          {feedback && (
            <div
              className="p-4 rounded-xl flex items-start space-x-3 text-xs fade-in-up"
              style={{
                background: `${persona.accentColor}0e`,
                border: `1px solid ${persona.accentColor}30`,
                color: persona.accentColor,
              }}
            >
              <TrendingUp className="w-4 h-4 mt-0.5 shrink-0" />
              <p className="leading-relaxed">{feedback}</p>
            </div>
          )}

          {/* 5. Live Prediction Leaderboard */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div
              className="px-5 py-4 flex items-center justify-between"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}
            >
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-3.5 h-3.5" style={{ color: persona.accentColor }} />
                <div>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-500 block">Live Prediction Engine</span>
                  <span className="text-sm font-semibold text-white">Best Predicted Dyads</span>
                </div>
              </div>
              <span
                className="text-[10px] font-mono px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(255,255,255,0.05)', color: '#a1a1aa', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                {eligibleCount} eligible of {rankings.length}
              </span>
            </div>

            <div className="p-4 space-y-2.5">
              {rankings.slice(0, 4).map(({ candidate, evaluation }, i) => {
                const score = evaluation.mutuality.score || 0
                const isTop = i === 0 && evaluation.eligible
                const color = rankColors[i] || 'rgba(255,255,255,0.6)'
                return (
                  <div
                    key={candidate.id}
                    className="group flex items-center justify-between p-3.5 rounded-xl transition-all duration-300 cursor-pointer hover:-translate-y-0.5"
                    style={{
                      background: isTop ? `${persona.accentColor}0a` : 'rgba(255,255,255,0.025)',
                      border: `1px solid ${isTop ? persona.accentColor + '25' : 'rgba(255,255,255,0.05)'}`,
                      boxShadow: isTop ? `0 0 20px ${persona.glowColor.replace('0.35','0.12')}` : 'none',
                    }}
                    onClick={() => { onInspectCandidate(candidate, evaluation); onClose() }}
                  >
                    <div className="flex items-center space-x-3">
                      {/* Rank */}
                      <div
                        className="w-6 text-center text-[10px] font-bold shrink-0"
                        style={{ color }}
                      >
                        {i === 0 ? '◈' : i === 1 ? '◇' : i === 2 ? '◆' : `${i + 1}`}
                      </div>

                      {/* Photo */}
                      <div className="relative shrink-0">
                        <img
                          src={candidate.identity.photos[0]}
                          alt={candidate.identity.name}
                          className="w-11 h-11 rounded-xl object-cover"
                          style={{
                            boxShadow: isTop ? `0 0 12px ${persona.glowColor}` : 'none',
                            border: `1.5px solid ${isTop ? persona.accentColor + '40' : 'rgba(255,255,255,0.08)'}`,
                          }}
                        />
                        {candidate.identity.verified && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                            <UserCheck className="w-2.5 h-2.5 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className="text-sm font-semibold text-white">{candidate.identity.name}</span>
                          {isTop && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: `${persona.accentColor}20`, color: persona.accentColor }}>
                              Best Match
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-neutral-500">
                          {candidate.identity.age} y/o · {candidate.identity.ethnicity || 'Open'} · {candidate.lifestyle.diet}
                        </span>
                      </div>
                    </div>

                    {/* Score + action */}
                    <div className="flex flex-col items-end space-y-1.5 shrink-0">
                      <span
                        className="text-base font-bold font-mono tabular-nums"
                        style={{ color: evaluation.eligible ? (isTop ? persona.accentColor : 'white') : '#f87171' }}
                      >
                        {evaluation.eligible ? `${score}%` : 'N/E'}
                      </span>
                      {/* Mini score bar */}
                      <div className="w-16 h-0.5 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${score}%`,
                            background: evaluation.eligible ? persona.accentColor : '#f87171',
                          }}
                        />
                      </div>
                      <span
                        className="text-[9px] font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: persona.accentColor }}
                      >
                        Tap to inspect →
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}
        >
          <p className="text-[10px] text-neutral-600 font-light">
            Zero pay-to-win · Invariant D-23 verified · Harmonic reciprocal engine
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-2xl text-xs font-bold transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{
              background: persona.accentColor,
              color: '#000',
              boxShadow: `0 0 20px ${persona.glowColor}`,
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
