// ============================================================================
// src/components/MatchCard.tsx
// Universal Compatibility Platform: Apple-Grade Thoughtful Candidate Profile Card
// Designed with Deep Psychological Rigor, Emotional Dignity & Aesthetic Care:
// - Benchmark A: Spotify "Blend" Harmonic Taste Overlap & Dyadic Sparks
// - Benchmark B: Airbnb Host & Guest Profiles ("House Rules" with Compassion)
// - Steam Profile Structure: Featured Badges & Calibrated Milestones
// - Thoughtful Interior Life: Daily rituals, sensory needs & intentional prompts
// - Interactive Photo Carousel: Multi-photo switching with Apple-style indicators
// - Thoughtful Handshake Composer: Context-aware opening sparks & ethical pledge
// ============================================================================

import React, { useState } from 'react'
import {
  ShieldCheck,
  MapPin,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  UserX,
  Send,
  SlidersHorizontal,
  Heart,
  Music,
  Home,
  Award,
  Volume2,
  Layers,
  Check,
  BookOpen,
  Coffee,
  Moon,
  X,
  MessageCircle,
  ChevronDown,
} from 'lucide-react'
import type { UniversalUserProfile, MatchEvaluation } from '../types'
import { sounds } from '../utils/sound'
import { coarsenDistanceKm } from '../utils/matchingEngine'

interface MatchCardProps {
  candidate: UniversalUserProfile
  evaluation: MatchEvaluation
  onInspectDeepReport: (candidate: UniversalUserProfile, evaluation: MatchEvaluation) => void
  onInitiateHandshake: (candidate: UniversalUserProfile) => void
  onPass: (candidate: UniversalUserProfile) => void
}

type CardTab = 'overview' | 'blend' | 'rules' | 'interior' | 'badges'

export const MatchCard: React.FC<MatchCardProps> = ({
  candidate,
  evaluation,
  onInspectDeepReport,
  onInitiateHandshake,
  onPass,
}) => {
  const {
    eligible,
    mutuality,
    confidence,
    compatibility,
    explanation,
    hardConflicts,
    geographicFeasibility,
  } = evaluation

  // Anti-Trilateration Distance Coarsening (Privacy P-02)
  const rawDistanceKm = parseFloat(geographicFeasibility.summary.split(' ')[0]) || 10
  const coarseDistance = `Location Band: ${coarsenDistanceKm(rawDistanceKm)}`

  const isLowConfidence = confidence.score < 60

  // Interactive UI State
  const [isCardHovered, setIsCardHovered] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [activeTab, setActiveTab] = useState<CardTab>('overview')
  const [activePhotoIndex, setActivePhotoIndex] = useState(0)
  const [isHandshakeComposerOpen, setIsHandshakeComposerOpen] = useState(false)
  const [handshakeNote, setHandshakeNote] = useState('')
  const [handshakeSent, setHandshakeSent] = useState(false)
  const [isPassed, setIsPassed] = useState(false)
  const [isMobileDetailsExpanded, setIsMobileDetailsExpanded] = useState(false)

  const photos =
    candidate.identity.photos && candidate.identity.photos.length > 0
      ? candidate.identity.photos
      : ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80']

  const scoreColor = !eligible
    ? '#f87171'
    : (mutuality.score || 0) >= 80
    ? '#c084fc'
    : (mutuality.score || 0) >= 60
    ? '#34d399'
    : '#fbbf24'

  // Shared Taste & Habits Overlap
  const blendTastes = [
    {
      title: 'Quiet Conversations & Relaxed Vibe',
      description: 'Both prioritize calm, cozy spaces, peaceful music, and genuine unhurried conversation.',
      pct: Math.min(98, (mutuality.score || 80) + 6),
      tag: 'Shared Vibe',
    },
    {
      title: 'Weekend & Daily Living Habits',
      description: `Aligned on ${candidate.lifestyle.diet} food, morning tea/coffee rituals, and restorative weekends.`,
      pct: Math.min(95, (mutuality.score || 78) + 2),
      tag: 'Daily Habits',
    },
    {
      title: 'Passions & Lifelong Curiosity',
      description: `Shared enthusiasm for ${candidate.values.coreValues.slice(0, 3).join(', ')} and creative projects.`,
      pct: Math.min(94, (mutuality.score || 75) + 4),
      tag: 'Shared Passions',
    },
  ]

  // Conversation Starter Sparks (Friendly Openers)
  const conversationSparks = [
    `I loved seeing your appreciation for ${candidate.lifestyle.diet} food and slow weekend mornings.`,
    `Curious about what you enjoy most about ${candidate.values.coreValues[0]}—what does a great day look like for you?`,
    `Would love to check out a quiet, cozy cafe for an unhurried conversation sometime.`,
  ]

  // Dignified "House Rules" & Mutual Boundaries
  const houseRules = [
    {
      title: 'Smoke-Free Living',
      rule: '100% tobacco and vape-free lifestyle & personal space.',
      aligned: candidate.lifestyle.smoking === 'never',
    },
    {
      title: 'Calm, Low-Pressure First Date',
      rule: 'First meetup in a peaceful public spot (artisan cafe, gallery, or botanical garden).',
      aligned: true,
    },
    {
      title: 'No Instant-Reply Pressure',
      rule: 'Zero pressure for immediate text replies; taking time to thoughtfully respond is welcomed.',
      aligned: true,
    },
    {
      title: 'Mutual Privacy First',
      rule: 'Phone numbers & private social handles shared only after you both feel comfortable.',
      aligned: true,
    },
  ]

  // Thoughtful Personal Prompts (Daily Life & Rituals)
  const interiorPrompts = [
    {
      prompt: 'A small ritual that anchors my week',
      response: `Slow morning pour-over coffee, listening to vinyl records, and reading without phone notifications.`,
      icon: Coffee,
    },
    {
      prompt: 'How I recharge my batteries',
      response: `Warm lighting, stepping away from screens, cooking fresh seasonal food, and long peaceful walks.`,
      icon: Moon,
    },
    {
      prompt: 'What emotional safety means to me',
      response: `Room to breathe and speak honestly during disagreement, where independence and closeness support each other.`,
      icon: Heart,
    },
  ]

  // Featured Values & Milestone Badges
  const badges = [
    {
      name: 'Verified Human',
      desc: 'Confirmed authentic identity & boundary settings',
      icon: ShieldCheck,
      color: '#34d399',
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-500/10',
    },
    {
      name: 'Calm Communicator',
      desc: 'De-escalating, respectful communication style',
      icon: Heart,
      color: '#fb7185',
      border: 'border-rose-500/30',
      bg: 'bg-rose-500/10',
    },
    {
      name: 'Honest & Direct',
      desc: 'Committed to open, respectful closure without ghosting',
      icon: Award,
      color: '#c084fc',
      border: 'border-purple-500/30',
      bg: 'bg-purple-500/10',
    },
    {
      name: 'Lifelong Learner',
      desc: 'Loves discovering new ideas, creative hobbies & books',
      icon: Sparkles,
      color: '#38bdf8',
      border: 'border-sky-500/30',
      bg: 'bg-sky-500/10',
    },
  ]

  const handleTabChange = (tab: CardTab) => {
    sounds.playTap()
    setActiveTab(tab)
  }

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation()
    sounds.playTap()
    setActivePhotoIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1))
  }

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation()
    sounds.playTap()
    setActivePhotoIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0))
  }

  const handleSendHandshake = () => {
    sounds.playLike()
    setHandshakeSent(true)
    onInitiateHandshake(candidate)
    setTimeout(() => {
      setIsHandshakeComposerOpen(false)
    }, 2200)
  }

  // Mobile 2-3 key mutual alignment reasons (Amendment 1)
  const mobileAlignmentReasons = [
    ...explanation.strongAlignment.slice(0, 2),
    explanation.whyRecommended || `${candidate.intention.relationshipStructure} • ${candidate.lifestyle.diet}`,
  ].slice(0, 3)

  const renderTabsCapsule = () => (
    <div className="inline-flex p-1 bg-zinc-950 rounded-full border border-white/[0.08] text-xs font-medium overflow-x-auto max-w-full no-scrollbar space-x-0.5">
      <button
        type="button"
        onClick={() => handleTabChange('overview')}
        className={`px-3 py-1 rounded-full transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
          activeTab === 'overview'
            ? 'bg-zinc-800 text-white shadow-sm font-semibold'
            : 'text-neutral-400 hover:text-white'
        }`}
      >
        <Layers className="w-3 h-3 text-purple-400" />
        <span>Overview</span>
      </button>
      <button
        type="button"
        onClick={() => handleTabChange('blend')}
        className={`px-3 py-1 rounded-full transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
          activeTab === 'blend'
            ? 'bg-purple-600 text-white shadow-sm font-semibold'
            : 'text-neutral-400 hover:text-white'
        }`}
      >
        <Music className="w-3 h-3 text-purple-200" />
        <span>Shared Rhythms</span>
      </button>
      <button
        type="button"
        onClick={() => handleTabChange('rules')}
        className={`px-3 py-1 rounded-full transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
          activeTab === 'rules'
            ? 'bg-emerald-600 text-white shadow-sm font-semibold'
            : 'text-neutral-400 hover:text-white'
        }`}
      >
        <Home className="w-3 h-3 text-emerald-200" />
        <span>Boundaries &amp; Rules</span>
      </button>
      <button
        type="button"
        onClick={() => handleTabChange('interior')}
        className={`px-3 py-1 rounded-full transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
          activeTab === 'interior'
            ? 'bg-indigo-600 text-white shadow-sm font-semibold'
            : 'text-neutral-400 hover:text-white'
        }`}
      >
        <BookOpen className="w-3 h-3 text-indigo-200" />
        <span>Daily Life</span>
      </button>
      <button
        type="button"
        onClick={() => handleTabChange('badges')}
        className={`px-3 py-1 rounded-full transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
          activeTab === 'badges'
            ? 'bg-sky-600 text-white shadow-sm font-semibold'
            : 'text-neutral-400 hover:text-white'
        }`}
      >
        <Award className="w-3 h-3 text-sky-200" />
        <span>Milestones</span>
      </button>
    </div>
  )

  const renderHandshakeComposer = () => (
    <div className="p-4 rounded-2xl bg-zinc-950 border border-purple-500/30 space-y-3 animate-in fade-in zoom-in-95 duration-200">
      <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
        <div className="flex items-center space-x-2 text-xs font-semibold text-white">
          <Send className="w-3.5 h-3.5 text-purple-400" />
          <span>Initiate Thoughtful Handshake with {candidate.identity.name}</span>
        </div>
        <button
          type="button"
          onClick={() => setIsHandshakeComposerOpen(false)}
          className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {handshakeSent ? (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-1">
          <div className="flex items-center justify-center space-x-2 text-emerald-300 font-semibold text-xs">
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Thoughtful Handshake Dispatched</span>
          </div>
          <p className="text-[11px] text-neutral-400 font-light">
            Your invitation is private and reciprocal. When {candidate.identity.name} accepts, your conversation will unlock in Sanctuary Dialogue.
          </p>
        </div>
      ) : (
        <>
          <p className="text-xs text-neutral-400 font-light leading-relaxed">
            Handshakes are intentional agreements. No random notifications are sent; dialogue only unlocks when both parties reciprocate.
          </p>

          <textarea
            value={handshakeNote}
            onChange={(e) => setHandshakeNote(e.target.value)}
            placeholder="Attach an optional warm note or question about their profile..."
            rows={2}
            maxLength={280}
            className="w-full p-2.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-400 transition"
          />

          <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-1">
            <span>Protected by Invariant S-01 • Take all the time you need</span>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setIsHandshakeComposerOpen(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendHandshake}
                className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 transition shadow-md shadow-purple-900/30 flex items-center space-x-1.5 cursor-pointer"
              >
                <Send className="w-3 h-3" />
                <span>Send Handshake</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )

  const renderTabContent = () => (
    <>
      {/* TAB 1: OVERVIEW & MULTI-OBJECTIVE COMPATIBILITY */}
      {activeTab === 'overview' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Dual-Track Reciprocal Affinity */}
          {eligible && (
            <div className="p-3.5 rounded-2xl bg-zinc-950/60 border border-white/[0.06] space-y-2.5">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400">
                    Your affinity for {candidate.identity.name}
                  </span>
                  <span className="font-semibold text-white font-mono">
                    {compatibility.aToB}%
                  </span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-purple-400 h-1.5 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${compatibility.aToB}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400">
                    {candidate.identity.name}&apos;s affinity for you
                  </span>
                  <span
                    className={`font-semibold font-mono ${
                      mutuality.asymmetric ? 'text-amber-300' : 'text-white'
                    }`}
                  >
                    {compatibility.bToA}%
                  </span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-700 ease-out ${
                      mutuality.asymmetric ? 'bg-amber-400' : 'bg-sky-400'
                    }`}
                    style={{ width: `${compatibility.bToA}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Ineligibility Alert */}
          {!eligible && hardConflicts.length > 0 && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-200 space-y-2">
              <div className="flex items-center space-x-2 font-semibold text-rose-300">
                <ShieldCheck className="w-4 h-4" />
                <span>Boundary Safeguard (Invariant D-14 Active)</span>
              </div>
              <p className="text-neutral-300 leading-relaxed font-light">
                {hardConflicts[0]?.message}
              </p>
              <p className="text-[11px] text-neutral-400 italic">
                Incompatibility is healthy and protective. Check guarantees 0.00% leakage across non-negotiable boundaries.
              </p>
            </div>
          )}

          {/* Structured Alignment Triad (Resonance, Friction, Discovery) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            <div className="p-3 rounded-2xl bg-zinc-950/60 border border-white/[0.06] space-y-1.5">
              <div className="flex items-center space-x-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                  Resonance
                </span>
              </div>
              <ul className="text-xs text-neutral-300 space-y-1 leading-relaxed">
                {explanation.strongAlignment.length > 0 ? (
                  explanation.strongAlignment.slice(0, 2).map((item, idx) => (
                    <li key={idx} className="line-clamp-2">
                      {item}
                    </li>
                  ))
                ) : (
                  <li className="text-neutral-500 italic">No primary synergies</li>
                )}
              </ul>
            </div>

            <div className="p-3 rounded-2xl bg-zinc-950/60 border border-white/[0.06] space-y-1.5">
              <div className="flex items-center space-x-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-bold">
                  Growth Area
                </span>
              </div>
              <ul className="text-xs text-neutral-300 space-y-1 leading-relaxed">
                {explanation.potentialFriction.length > 0 ? (
                  explanation.potentialFriction.slice(0, 2).map((item, idx) => (
                    <li key={idx} className="line-clamp-2">
                      {item}
                    </li>
                  ))
                ) : (
                  <li className="text-neutral-500 italic">Zero friction points</li>
                )}
              </ul>
            </div>

            <div className="p-3 rounded-2xl bg-zinc-950/60 border border-white/[0.06] space-y-1.5">
              <div className="flex items-center space-x-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-sky-300 font-bold">
                  Discovery
                </span>
              </div>
              <ul className="text-xs text-neutral-300 space-y-1 leading-relaxed">
                {explanation.unknownInformation.length > 0 ? (
                  explanation.unknownInformation.slice(0, 2).map((item, idx) => (
                    <li key={idx} className="line-clamp-2">
                      {item}
                    </li>
                  ))
                ) : (
                  <li className="text-neutral-500 italic">Fully declared</li>
                )}
              </ul>
            </div>
          </div>

          {/* Why Recommended Quote */}
          <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-white/[0.06] text-xs text-neutral-300 flex items-start space-x-2.5">
            <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed font-light">{explanation.whyRecommended}</p>
          </div>
        </div>
      )}

      {/* TAB 2: SPOTIFY "BLEND" & HARMONIC TASTE OVERLAP */}
      {activeTab === 'blend' && (
        <div className="space-y-3.5 animate-in fade-in duration-200">
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-zinc-950 to-sky-950/40 border border-purple-500/30 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300">
                <Music className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">
                  Taste &amp; Ecology Blend with {candidate.identity.name.split(' ')[0]}
                </h4>
                <p className="text-[10px] text-neutral-400">
                  High-dimensional lifestyle, sound, and curiosity overlap
                </p>
              </div>
            </div>
            <span className="text-xl font-bold font-mono text-purple-300">
              {mutuality.score}%
            </span>
          </div>

          {/* Blend Taste Items */}
          <div className="space-y-2">
            {blendTastes.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-zinc-950/80 border border-white/[0.06] space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white flex items-center space-x-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-purple-400" />
                    <span>{item.title}</span>
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                    {item.pct}% match
                  </span>
                </div>
                <p className="text-xs text-neutral-300 font-light leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* Dyadic Conversation Sparks (Click to pre-fill handshake note) */}
          <div className="p-3 rounded-2xl bg-zinc-950/80 border border-white/[0.06] space-y-2">
            <span className="text-[11px] font-semibold text-neutral-300 flex items-center space-x-1.5">
              <MessageCircle className="w-3.5 h-3.5 text-purple-400" />
              <span>Thoughtful Opening Sparks (Click to use in Handshake):</span>
            </span>
            <div className="space-y-1.5">
              {conversationSparks.map((spark, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    sounds.playTap()
                    setHandshakeNote(spark)
                    setIsHandshakeComposerOpen(true)
                  }}
                  className="w-full text-left p-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.04] text-xs text-neutral-300 transition flex items-center justify-between group/spark cursor-pointer"
                >
                  <span className="line-clamp-1 italic font-light">&ldquo;{spark}&rdquo;</span>
                  <span className="text-[10px] text-purple-400 opacity-0 group-hover/spark:opacity-100 transition font-mono shrink-0 ml-2">
                    Use →
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AIRBNB "HOUSE RULES" & SANCTUARY BOUNDARIES */}
      {activeTab === 'rules' && (
        <div className="space-y-3 animate-in fade-in duration-200">
          <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-300">
                <Home className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">
                  {candidate.identity.name.split(' ')[0]}&apos;s Sanctuary House Rules
                </h4>
                <p className="text-[10px] text-neutral-400">
                  Clear, non-hostile boundaries for emotional and physical safety
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              4/4 Aligned
            </span>
          </div>

          <div className="space-y-2">
            {houseRules.map((rule, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-zinc-950/80 border border-white/[0.06] flex items-start space-x-3"
              >
                <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                  <Check className="w-3 h-3 stroke-[2.5]" />
                </div>
                <div className="space-y-0.5 text-xs">
                  <span className="font-semibold text-white block">{rule.title}</span>
                  <p className="text-neutral-400 font-light">{rule.rule}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: INTERIOR WORLD & THOUGHTFUL PROMPTS */}
      {activeTab === 'interior' && (
        <div className="space-y-3 animate-in fade-in duration-200">
          <div className="p-3 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 rounded-xl bg-indigo-500/20 text-indigo-300">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">
                  {candidate.identity.name.split(' ')[0]}&apos;s Interior World
                </h4>
                <p className="text-[10px] text-neutral-400">
                  Anchors, nervous system recovery &amp; personal philosophy
                </p>
              </div>
            </div>
            <span className="text-xs font-mono text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-full border border-indigo-500/30">
              Depth First
            </span>
          </div>

          <div className="space-y-2.5">
            {interiorPrompts.map((p, idx) => {
              const Icon = p.icon
              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-zinc-950/80 border border-white/[0.06] space-y-1.5"
                >
                  <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-300">
                    <Icon className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{p.prompt}</span>
                  </div>
                  <p className="text-xs text-neutral-300 font-light leading-relaxed pl-5">
                    &ldquo;{p.response}&rdquo;
                  </p>
                </div>
              )
            })}
          </div>

          <div className="p-3 rounded-2xl bg-zinc-950/60 border border-white/[0.06] flex flex-wrap gap-2 text-xs text-neutral-400 items-center">
            <span className="text-neutral-500 font-mono text-[10px] uppercase">Core Values:</span>
            {candidate.values.coreValues.map((val, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-white/[0.04] text-neutral-300 border border-white/[0.06] text-[11px]"
              >
                {val}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: STEAM SHOWCASE BADGES & ACHIEVEMENTS */}
      {activeTab === 'badges' && (
        <div className="space-y-3 animate-in fade-in duration-200">
          <div className="p-3 rounded-2xl bg-sky-950/30 border border-sky-500/30 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 rounded-xl bg-sky-500/20 text-sky-300">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">
                  Recognized Relational Milestones
                </h4>
                <p className="text-[10px] text-neutral-400">
                  Calibrated merits &amp; mutual relationship readiness
                </p>
              </div>
            </div>
            <span className="text-xs font-mono text-sky-300 bg-sky-500/20 px-2 py-0.5 rounded-full border border-sky-500/30 font-bold">
              Tier 3
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {badges.map((b, idx) => {
              const Icon = b.icon
              return (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl bg-zinc-950/80 border ${b.border} flex items-start space-x-2.5`}
                >
                  <div className={`p-1.5 rounded-xl ${b.bg} shrink-0 mt-0.5`}>
                    <Icon className="w-3.5 h-3.5" style={{ color: b.color }} />
                  </div>
                  <div className="space-y-0.5 text-xs">
                    <span className="font-semibold text-white block">{b.name}</span>
                    <p className="text-neutral-400 text-[11px] leading-tight font-light">
                      {b.desc}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </>
  )

  if (isPassed) {
    return (
      <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.05] text-center space-y-2 text-xs text-neutral-400 animate-fade-out">
        <p>You respectfully passed on {candidate.identity.name}.</p>
        <p className="text-[11px] text-neutral-500">
          This profile has been removed from today&apos;s slate. You may revisit archives anytime under Sanctuary settings.
        </p>
      </div>
    )
  }

  return (
    <div
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseLeave={() => setIsCardHovered(false)}
      className={`relative rounded-[2rem] overflow-hidden transition-all duration-500 ${
        !eligible ? 'opacity-75 saturate-50' : ''
      }`}
      style={{
        background: '#0c0c10',
        backdropFilter: 'blur(32px)',
        border: `1px solid ${
          isCardHovered && eligible ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.08)'
        }`,
        boxShadow:
          isCardHovered && eligible
            ? `0 0 0 1px rgba(255,255,255,0.08), 0 32px 64px -20px rgba(0,0,0,0.9), 0 0 50px -25px ${scoreColor}44`
            : '0 16px 40px -12px rgba(0,0,0,0.6)',
        transform: isCardHovered ? 'translateY(-3px)' : 'translateY(0)',
      }}
    >
      {/* Ambient glow layer on hover */}
      {eligible && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-700"
          style={{
            background: `radial-gradient(ellipse 55% 45% at 75% 50%, ${scoreColor}0c 0%, transparent 70%)`,
            opacity: isCardHovered ? 1 : 0,
          }}
        />
      )}

      {/* ==================================================== */}
      {/* 1. MOBILE VIEWPORT SECTION (block lg:hidden)         */}
      {/* Fulfills Amendment 1: First viewport exposes photo,  */}
      {/* name/context, distance band, 2-3 alignment reasons,  */}
      {/* primary action, and secondary pass action without    */}
      {/* requiring scrolling. Progressive disclosure below.   */}
      {/* ==================================================== */}
      <div className="block lg:hidden">
        {/* Mobile Photo Hero with Overlaid Context */}
        <div className="relative h-64 sm:h-72 bg-black/40 overflow-hidden flex flex-col justify-between group">
          <img
            src={photos[activePhotoIndex]}
            alt={candidate.identity.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#101014] via-[#101014]/25 to-black/40" />

          {/* Top Progress Dashes */}
          {photos.length > 1 && (
            <div className="relative top-3 left-3 right-3 z-20 flex gap-1.5 px-1">
              {photos.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    sounds.playTap()
                    setActivePhotoIndex(idx)
                  }}
                  className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                    idx === activePhotoIndex
                      ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]'
                      : 'bg-white/30'
                  }`}
                  aria-label={`View photo ${idx + 1}`}
                />
              ))}
            </div>
          )}

          {/* Top Badges */}
          <div className="relative top-3 left-3 right-3 flex items-center justify-between z-10 px-1">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium flex items-center space-x-1 backdrop-blur-xl border ${
                candidate.identity.verified
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-black/60 text-neutral-300 border-white/10'
              }`}
            >
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>{candidate.identity.verified ? 'Verified Human' : 'Self-Declared'}</span>
            </span>

            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-black/60 text-neutral-300 border border-white/10 backdrop-blur-xl flex items-center space-x-1">
                <MapPin className="w-3 h-3 text-neutral-400" />
                <span>{coarseDistance}</span>
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  sounds.playTap()
                  setIsFavorite(!isFavorite)
                }}
                className="w-7 h-7 rounded-full bg-black/60 border border-white/20 backdrop-blur-xl flex items-center justify-center transition active:scale-90 cursor-pointer"
                title={isFavorite ? 'Saved to Bookmarks' : 'Bookmark Profile'}
              >
                <Heart
                  className="w-3.5 h-3.5"
                  style={{
                    color: isFavorite ? '#fb7185' : '#ffffff',
                    fill: isFavorite ? '#fb7185' : 'transparent',
                  }}
                />
              </button>
            </div>
          </div>

          {/* Overlaid Name, Age & Tags */}
          <div className="relative bottom-3 left-3 right-3 z-10 mt-auto px-1">
            <div className="flex items-baseline space-x-2">
              <h3 className="text-xl font-bold text-white tracking-tight">
                {candidate.identity.name}
              </h3>
              <span className="text-base font-light text-neutral-300">{candidate.identity.age}</span>
              <span className="text-[11px] text-neutral-400 font-mono">
                {candidate.identity.pronouns}
              </span>
            </div>
            <p className="text-xs text-neutral-300/90 line-clamp-1 mt-0.5 font-light">
              {candidate.identity.bio}
            </p>
            <div className="flex flex-wrap gap-1 mt-1.5">
              <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[9px] font-mono">
                {candidate.lifestyle.diet}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[9px] font-mono">
                {candidate.intention.relationshipStructure}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-mono">
                {candidate.accessibility?.sleepChronotype === 'night_owl' ? '🌙 Night Owl' : '☀️ Early Riser'}
              </span>
            </div>
          </div>
        </div>

        {/* Mobile First Viewport Body */}
        <div className="p-4 space-y-3 bg-[#101014]">
          {/* Resonance Pill & Distance Band */}
          <div className="flex items-center justify-between">
            <div className={`px-2.5 py-1 rounded-xl border flex items-center space-x-2 ${
              !eligible
                ? 'bg-rose-500/10 border-rose-500/25 text-rose-300'
                : (mutuality.score || 0) >= 80
                ? 'bg-purple-950/40 border-purple-500/40 text-purple-200'
                : 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300'
            }`}>
              <span className="text-base font-bold font-mono">
                {eligible ? `${mutuality.score}%` : 'Ineligible'}
              </span>
              <span className="text-[10px] font-medium tracking-wide">
                {eligible ? 'Mutual Compatibility' : 'Boundary Protected'}
              </span>
            </div>

            <span className="text-[10px] text-neutral-400 font-mono">
              {coarseDistance}
            </span>
          </div>

          {/* 2–3 Meaningful Alignment Reasons */}
          <div className="p-3 rounded-2xl bg-zinc-950/80 border border-white/[0.06] space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">
              Key Mutual Alignments
            </span>
            <ul className="text-xs text-neutral-200 space-y-1 leading-snug">
              {eligible ? (
                mobileAlignmentReasons.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-1.5">
                    <span className="text-emerald-400 font-bold shrink-0">•</span>
                    <span className="line-clamp-2">{item}</span>
                  </li>
                ))
              ) : (
                <li className="text-rose-300 text-xs">
                  {hardConflicts[0]?.message || 'Does not match your stated boundary requirements.'}
                </li>
              )}
            </ul>
          </div>

          {/* Inline Handshake Composer Drawer on Mobile */}
          {isHandshakeComposerOpen && renderHandshakeComposer()}

          {/* Primary Action & Secondary Pass Action in First Viewport (44px+ touch targets) */}
          <div className="flex items-center space-x-2 pt-0.5">
            <button
              type="button"
              onClick={() => {
                sounds.playNope()
                setIsPassed(true)
                onPass(candidate)
              }}
              className="min-h-[46px] px-3.5 py-2 rounded-xl text-xs font-medium text-neutral-400 hover:text-white bg-white/[0.04] active:bg-white/10 border border-white/10 flex items-center justify-center space-x-1.5 cursor-pointer transition active:scale-95 shrink-0"
              title="Respectfully pass on this profile"
            >
              <UserX className="w-3.5 h-3.5" />
              <span>Pass</span>
            </button>

            {eligible ? (
              <button
                type="button"
                onClick={() => {
                  sounds.playTap()
                  setIsHandshakeComposerOpen(!isHandshakeComposerOpen)
                }}
                className={`min-h-[46px] flex-1 px-4 py-2 rounded-xl text-xs font-bold text-white transition active:scale-95 flex items-center justify-center space-x-2 cursor-pointer ${
                  isHandshakeComposerOpen
                    ? 'bg-zinc-800 border border-white/20'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-900/30'
                }`}
              >
                <Send className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{isHandshakeComposerOpen ? 'Close Note' : 'Initiate Handshake'}</span>
              </button>
            ) : (
              <div className="flex-1 text-center py-2.5 text-xs text-rose-300 font-medium bg-rose-500/10 rounded-xl border border-rose-500/20">
                Filtered by Boundary Setting
              </div>
            )}
          </div>

          {/* Progressive Disclosure Toggle */}
          <div className="pt-1.5 border-t border-white/[0.06]">
            <button
              type="button"
              onClick={() => {
                sounds.playTap()
                setIsMobileDetailsExpanded(!isMobileDetailsExpanded)
              }}
              className="w-full min-h-[44px] py-2 px-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] active:bg-white/[0.08] border border-white/[0.06] text-xs text-neutral-300 flex items-center justify-between cursor-pointer transition"
            >
              <span className="flex items-center space-x-1.5 font-medium">
                <SlidersHorizontal className="w-3.5 h-3.5 text-purple-400" />
                <span>{isMobileDetailsExpanded ? 'Hide Deep Details' : 'Explore Deep Details & Shared Rhythms (5 Facets)'}</span>
              </span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isMobileDetailsExpanded ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Expanded Tab Content on Mobile */}
          {isMobileDetailsExpanded && (
            <div className="space-y-3 pt-2 border-t border-white/[0.06] animate-in fade-in duration-200">
              {renderTabsCapsule()}
              {renderTabContent()}
              <button
                type="button"
                onClick={() => {
                  sounds.playTap()
                  onInspectDeepReport(candidate, evaluation)
                }}
                className="w-full min-h-[44px] py-2.5 px-3 rounded-xl text-xs font-medium text-neutral-300 hover:text-white bg-zinc-900 border border-white/[0.08] flex items-center justify-center space-x-1.5 transition cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-purple-400" />
                <span>Open Full 12-Dimension Report</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ==================================================== */}
      {/* 2. DESKTOP VIEWPORT SECTION (hidden lg:grid)         */}
      {/* ==================================================== */}
      <div className="hidden lg:grid lg:grid-cols-12 gap-0">
        {/* ==================================================== */}
        {/* LEFT COLUMN: PHOTOGRAPHIC IDENTITY & CAROUSEL        */}
        {/* ==================================================== */}
        <div className="lg:col-span-4 relative min-h-[380px] lg:min-h-full bg-black/40 overflow-hidden flex flex-col justify-between group">
          <img
            src={photos[activePhotoIndex]}
            alt={candidate.identity.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out"
            style={{ transform: isCardHovered ? 'scale(1.03)' : 'scale(1)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/40 to-black/40" />

          {/* Top Progress Dashes for Multi-Photo Carousel */}
          {photos.length > 1 && (
            <div className="relative top-3 left-4 right-4 z-20 flex gap-1.5 px-1">
              {photos.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation()
                    sounds.playTap()
                    setActivePhotoIndex(idx)
                  }}
                  className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                    idx === activePhotoIndex
                      ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]'
                      : 'bg-white/25 hover:bg-white/40'
                  }`}
                  aria-label={`View photo ${idx + 1}`}
                />
              ))}
            </div>
          )}

          {/* Minimal Floating Status Badges */}
          <div className="relative top-4 left-4 right-4 flex items-center justify-between z-10">
            <span
              className={`px-3 py-1 rounded-full text-[11px] font-medium flex items-center space-x-1.5 backdrop-blur-xl border ${
                candidate.identity.verified
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 shadow-sm'
                  : 'bg-black/50 text-neutral-300 border-white/10'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]" />
              <span>{candidate.identity.verified ? '✓ Verified Identity' : 'Self-Declared'}</span>
            </span>

            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-medium bg-black/50 text-neutral-300 border border-white/10 backdrop-blur-xl flex items-center space-x-1.5">
                <MapPin className="w-3 h-3 text-neutral-400 stroke-[2]" />
                <span>{coarseDistance}</span>
              </span>

              {/* Heart Bookmark Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  sounds.playTap()
                  setIsFavorite(!isFavorite)
                }}
                className="w-8 h-8 rounded-full bg-black/60 border border-white/15 backdrop-blur-xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90"
                style={{
                  borderColor: isFavorite ? '#fb7185' : 'rgba(255,255,255,0.15)',
                  boxShadow: isFavorite ? '0 0 16px rgba(251,113,133,0.5)' : 'none',
                }}
                title={isFavorite ? 'Saved to Bookmarks' : 'Bookmark Profile'}
              >
                <Heart
                  className="w-4 h-4 transition-all duration-300"
                  style={{
                    color: isFavorite ? '#fb7185' : '#ffffff',
                    fill: isFavorite ? '#fb7185' : 'transparent',
                  }}
                />
              </button>
            </div>
          </div>

          {/* Photo Carousel Navigation Arrows (Hover-Revealed) */}
          {photos.length > 1 && (
            <div className="absolute inset-y-0 inset-x-2 z-10 flex items-center justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={handlePrevPhoto}
                className="w-8 h-8 rounded-full bg-black/60 border border-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/80 hover:scale-110 transition pointer-events-auto"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextPhoto}
                className="w-8 h-8 rounded-full bg-black/60 border border-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/80 hover:scale-110 transition pointer-events-auto"
                aria-label="Next photo"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Name & Identity Description */}
          <div className="relative bottom-4 left-4 right-4 z-10 mt-auto">
            <div className="flex items-baseline space-x-2">
              <h3 className="text-2xl font-bold text-white tracking-tight">
                {candidate.identity.name}
              </h3>
              <span className="text-lg font-light text-neutral-300">{candidate.identity.age}</span>
              <span className="text-xs text-neutral-400 font-mono tracking-tight">
                {candidate.identity.pronouns}
              </span>
            </div>

            <p className="text-xs text-neutral-300/90 line-clamp-2 mt-1.5 leading-relaxed font-normal">
              {candidate.identity.bio}
            </p>

            {/* Thoughtful Identity & Lifestyle Badges */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-mono">
                {candidate.lifestyle.diet}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-mono">
                {candidate.intention.relationshipStructure}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono">
                {candidate.accessibility?.sleepChronotype === 'night_owl' ? '🌙 Night Owl' : '☀️ Early Riser'}
              </span>
              {candidate.accessibility?.sensoryCalmRequired && (
                <span className="px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[10px] font-mono">
                  🌿 Low-Stimulus
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ==================================================== */}
        {/* RIGHT COLUMN: COMPATIBILITY INTELLIGENCE & TABS      */}
        {/* ==================================================== */}
        <div className="lg:col-span-8 p-5 sm:p-6 lg:p-7 flex flex-col justify-between space-y-5 bg-[#101014]">
          <div className="space-y-4">
            {/* Top Score, Epistemic Certainty, & Segmented Sub-Nav */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
              {/* Minimalist Score Pill */}
              <div
                className={`px-3.5 py-1.5 rounded-2xl border flex items-center space-x-2.5 backdrop-blur-md ${
                  !eligible
                    ? 'bg-rose-500/10 border-rose-500/25 text-rose-300'
                    : isLowConfidence
                    ? 'bg-zinc-800 border-white/10 text-neutral-300'
                    : mutuality.score! >= 80
                    ? 'bg-purple-950/40 border-purple-500/40 text-purple-200 shadow-sm'
                    : 'bg-amber-500/10 border-amber-500/25 text-amber-200'
                }`}
              >
                <span className="text-2xl font-bold tracking-tight">
                  {eligible ? `${mutuality.score}%` : 'Ineligible'}
                </span>
                <div className="flex flex-col text-left">
                  <span className="text-[11px] font-semibold tracking-wide uppercase text-neutral-200">
                    {isLowConfidence ? 'Provisional' : 'Mutual Resonance'}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    {eligible ? 'Overall Compatibility' : 'Boundary Exclusion'}
                  </span>
                </div>
              </div>

              {renderTabsCapsule()}
            </div>

            {renderTabContent()}
          </div>

          {/* INLINE THOUGHTFUL HANDSHAKE COMPOSER DRAWER */}
          {isHandshakeComposerOpen && renderHandshakeComposer()}

          {/* ==================================================== */}
          {/* TACTILE ACTION BAR (APPLE-GRADE PUSH BUTTONS)        */}
          {/* ==================================================== */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3.5 border-t border-white/[0.08]">
            <button
              onClick={() => {
                sounds.playTap()
                onInspectDeepReport(candidate, evaluation)
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-medium text-neutral-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-white/[0.08] flex items-center space-x-1.5 transition"
            >
              <SlidersHorizontal className="w-3 h-3 text-purple-400" />
              <span>Full 12-Dimension Report</span>
              <ChevronRight className="w-3 h-3 opacity-60" />
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  sounds.playNope()
                  setIsPassed(true)
                  onPass(candidate)
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-medium text-neutral-400 hover:text-white bg-transparent hover:bg-zinc-900 border border-white/[0.08] flex items-center space-x-1.5 transition"
                title="Respectfully pass on this profile"
              >
                <UserX className="w-3 h-3" />
                <span>Respectful Pass</span>
              </button>

              {eligible && (
                <button
                  onClick={() => {
                    sounds.playTap()
                    setIsHandshakeComposerOpen(!isHandshakeComposerOpen)
                  }}
                  className={`px-5 py-2 rounded-xl text-xs font-bold text-white transition active:scale-95 flex items-center space-x-1.5 ${
                    isHandshakeComposerOpen
                      ? 'bg-zinc-800 border border-white/20'
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-900/30'
                  }`}
                >
                  <Send className="w-3 h-3 stroke-[2.5]" />
                  <span>{isHandshakeComposerOpen ? 'Close Handshake' : 'Initiate Handshake'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MatchCard
