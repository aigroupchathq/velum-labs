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
  Check,
  Compass,
  Star,
  X,
  Coffee,
  Moon,
  Award,
} from 'lucide-react'
import type { UniversalUserProfile, MatchEvaluation } from '../types'
import { MatchTabsCapsule, type CardTab } from './match/MatchTabsCapsule'
import { MatchHandshakeModal } from './match/MatchHandshakeModal'
import { MatchOverviewTab } from './match/tabs/MatchOverviewTab'
import { MatchDecisionTab } from './match/tabs/MatchDecisionTab'
import { MatchBlendTab } from './match/tabs/MatchBlendTab'
import { MatchRulesTab } from './match/tabs/MatchRulesTab'
import { MatchInteriorTab } from './match/tabs/MatchInteriorTab'
import { MatchBadgesTab } from './match/tabs/MatchBadgesTab'
import { sounds } from '../utils/sound'
import { coarsenDistanceKm } from '../utils/matchingEngine'

interface MatchCardProps {
  candidate: UniversalUserProfile
  evaluation: MatchEvaluation
  onInspectDeepReport: (candidate: UniversalUserProfile, evaluation: MatchEvaluation) => void
  onInitiateHandshake: (candidate: UniversalUserProfile) => void
  onPass: (candidate: UniversalUserProfile) => void
}

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

  // Decision Support Topics (The 2–3 Things Actually Worth Discussing - Need #11)
  const decisionTopics = [
    {
      title: 'Relationship Vision & Future Direction',
      question: `What kind of partnership are you actively trying to build right now, and where do you see your home in 3–5 years?`,
      context: `${candidate.identity.name} is seeking a ${candidate.intention.relationshipStructure} partnership with ${candidate.lifestyle.diet} values.`,
      icon: Compass,
    },
    {
      title: 'Communication Rhythms & Recharge Space',
      question: `How do you typically handle emotional recharge and texting cadence when work or life gets busy?`,
      context: `Pacing difference: ${candidate.accessibility?.sleepChronotype === 'night_owl' ? 'Night owl chronotype' : 'Early morning rhythm'}.`,
      icon: Coffee,
    },
    {
      title: 'Conflict Resolution & Emotional Safety',
      question: `When a disagreement happens, do you prefer taking 20 minutes to process alone first, or talking it through immediately?`,
      context: `Crucial to clarify before emotional attachment develops.`,
      icon: Heart,
    },
  ]

  // Chemistry vs Compatibility Lens (Need #8)
  const sparkScore = Math.min(98, Math.round(((mutuality.score || 80) * 0.9) + 8))
  const fitScore = Math.min(99, Math.round(((compatibility.aToB || mutuality.score || 85) * 0.95) + 4))
  const sparkVsFitVerdict = !eligible
    ? 'Filtered: Stated boundary conflict'
    : sparkScore >= 80 && fitScore >= 80
    ? 'Rare Double Alignment: High mutual spark & strong long-term stability'
    : sparkScore >= 80
    ? 'High Spark: Magnetic connection · Discuss long-term timeline early'
    : 'Deep Grounded Fit: Natural domestic harmony & shared life goals'

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

  const mirrorCheck = evaluation.mirrorCheck

  const handleInspectWithPaige = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    sounds.playTap()
    window.dispatchEvent(
      new CustomEvent('open-page-agent', {
        detail: {
          prompt: `Inspect spark vs practical friction for ${candidate.identity.name}`,
          candidate,
          evaluation,
        },
      })
    )
  }

  const renderMirrorCheckBanner = (isCompact = false) => {
    if (!mirrorCheck || (!mirrorCheck.hasTrapWarning && (!mirrorCheck.frictions || mirrorCheck.frictions.length === 0))) {
      return null
    }

    const hasTrap = mirrorCheck.hasTrapWarning

    return (
      <div
        data-mirror-check="true"
        className={`rounded-2xl border transition-all ${
          hasTrap
            ? 'bg-rose-950/25 border-rose-500/30'
            : 'bg-amber-950/20 border-amber-500/25'
        } ${isCompact ? 'p-3.5 mx-3 my-2' : 'p-3.5'}`}
      >
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center space-x-2 min-w-0">
            <div
              className={`p-1 rounded-lg shrink-0 ${
                hasTrap ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-semibold text-white truncate">Mirror Check</span>
            <span
              className={`text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider shrink-0 ${
                hasTrap
                  ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                  : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
              }`}
            >
              {hasTrap ? 'Pattern Alert' : 'Manageable Friction'}
            </span>
          </div>

          <button
            type="button"
            onClick={handleInspectWithPaige}
            className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-[11px] font-medium text-white flex items-center space-x-1.5 transition cursor-pointer shrink-0 shadow-sm active:scale-95"
            title="Inspect with Paige"
          >
            <Sparkles className="w-3 h-3 text-[#F472B6]" />
            <span>Inspect with Paige</span>
          </button>
        </div>

        <p className="text-xs text-neutral-200 font-light leading-relaxed">
          {mirrorCheck.gentleReflection}
        </p>

        {/* Triggered Traps Pills */}
        {mirrorCheck.triggeredTraps.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-white/[0.06]">
            {mirrorCheck.triggeredTraps.map((trap) => (
              <span
                key={trap.id}
                className="px-2 py-0.5 rounded-md bg-rose-500/15 text-rose-300 border border-rose-500/30 text-[10px] font-mono flex items-center space-x-1"
              >
                <span>⚠️ {trap.title}</span>
              </span>
            ))}
          </div>
        )}

        {/* Friction Notices */}
        {mirrorCheck.frictions.length > 0 && mirrorCheck.triggeredTraps.length === 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-white/[0.06]">
            {mirrorCheck.frictions.slice(0, 2).map((fr, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] font-mono"
              >
                {fr.label}: {fr.protocol}
              </span>
            ))}
          </div>
        )}
      </div>
    )
  }

  const renderTabsCapsule = () => (
    <MatchTabsCapsule activeTab={activeTab} onTabChange={handleTabChange} />
  )

  const renderHandshakeComposer = () => (
    <MatchHandshakeModal
      candidate={candidate}
      isOpen={isHandshakeComposerOpen}
      handshakeSent={handshakeSent}
      handshakeNote={handshakeNote}
      onNoteChange={setHandshakeNote}
      onSend={handleSendHandshake}
      onClose={() => setIsHandshakeComposerOpen(false)}
    />
  )

  const renderTabContent = () => (
    <>
      {activeTab === 'overview' && (
        <MatchOverviewTab candidate={candidate} evaluation={evaluation} />
      )}
      {activeTab === 'decision' && (
        <MatchDecisionTab
          candidate={candidate}
          evaluation={evaluation}
          sparkVsFitVerdict={sparkVsFitVerdict}
          sparkScore={sparkScore}
          fitScore={fitScore}
          mirrorCheck={mirrorCheck}
          decisionTopics={decisionTopics}
          onInspectWithPaige={handleInspectWithPaige}
          onSelectQuestion={(q) => {
            sounds.playTap()
            setHandshakeNote(q)
            setIsHandshakeComposerOpen(true)
          }}
        />
      )}
      {activeTab === 'blend' && (
        <MatchBlendTab
          candidate={candidate}
          evaluation={evaluation}
          blendTastes={blendTastes}
          conversationSparks={conversationSparks}
          onSelectSpark={(spark) => {
            sounds.playTap()
            setHandshakeNote(spark)
            setIsHandshakeComposerOpen(true)
          }}
        />
      )}
      {activeTab === 'rules' && (
        <MatchRulesTab candidate={candidate} houseRules={houseRules} />
      )}
      {activeTab === 'interior' && (
        <MatchInteriorTab candidate={candidate} interiorPrompts={interiorPrompts} />
      )}
      {activeTab === 'badges' && (
        <MatchBadgesTab badges={badges} />
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
      {/* Designed directly from Mockup Screen 1:               */}
      {/* Card photo, pink match badge, name/role/chips,       */}
      {/* 'Why this connection' accordion, 3 circular buttons  */}
      {/* ==================================================== */}
      <div className="block lg:hidden rounded-[2rem] overflow-hidden bg-[#17161A] border border-white/[0.08] shadow-2xl relative mb-6">
        {/* Mobile Photo Hero with Overlaid Context */}
        <div
          onClick={() => {
            sounds.playTap()
            onInspectDeepReport(candidate, evaluation)
          }}
          className="relative h-[390px] sm:h-[430px] bg-black/40 overflow-hidden flex flex-col justify-between cursor-pointer group"
        >
          <img
            src={photos[activePhotoIndex]}
            alt={candidate.identity.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#17161A] via-[#17161A]/35 to-black/30" />

          {/* Top Header: Photo indicators & Pink Match Pill */}
          <div className="relative top-3.5 left-3.5 right-3.5 z-20 flex items-center justify-between px-1">
            {/* Top Carousel Dashes */}
            {photos.length > 1 ? (
              <div className="flex gap-1.5 flex-1 max-w-[120px]">
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
            ) : <div />}

            {/* Top Right Pink Match Badge (Mockup 1) */}
            <div className="px-3 py-1 rounded-full bg-[#F472B6] text-white text-xs font-semibold flex items-center space-x-1 shadow-lg shadow-[#F472B6]/30">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>{mutuality.score || 96}% Match</span>
            </div>
          </div>

          {/* Overlaid Candidate Info at Bottom of Image */}
          <div className="relative bottom-3 left-4 right-4 z-10 mt-auto space-y-1.5">
            <div className="flex items-center space-x-2">
              <h3 className="text-2xl font-bold text-white tracking-tight">
                {candidate.identity.name}, {candidate.identity.age}
              </h3>
              {candidate.identity.verified && (
                <ShieldCheck className="w-5 h-5 text-[#F472B6] fill-[#F472B6]/20 stroke-[2]" />
              )}
            </div>

            {/* Occupation / Subtitle */}
            <div className="flex items-center space-x-1.5 text-xs text-neutral-300">
              <Compass className="w-3.5 h-3.5 text-neutral-400" />
              <span>{candidate.identity.bio.split('.')[0] || 'Architectural acoustician'}</span>
            </div>

            {/* Distance */}
            <div className="flex items-center space-x-1 text-xs text-neutral-400">
              <MapPin className="w-3.5 h-3.5 text-neutral-400" />
              <span>{coarseDistance}</span>
            </div>

            {/* Interest Chips (Mockup 1) */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] text-white">
                Art & Galleries
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] text-white">
                Cafés
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] text-white">
                Travel
              </span>
            </div>
          </div>
        </div>

        {/* Why this connection? Accordion Block (Mockup 1) */}
        <div
          onClick={() => {
            sounds.playTap()
            onInspectDeepReport(candidate, evaluation)
          }}
          className="p-3.5 mx-3 mt-3 mb-2 rounded-2xl bg-[#0F0E11]/80 hover:bg-[#0F0E11] border border-white/[0.06] transition cursor-pointer flex items-center justify-between"
        >
          <div className="space-y-1.5 flex-1 pr-2">
            <span className="text-xs font-semibold text-neutral-200 block">
              Why this connection?
            </span>
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-xs text-neutral-300">
                <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]" />
                <span>Similar long-term direction</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-neutral-300">
                <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]" />
                <span>Compatible daily rhythm</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-neutral-300">
                <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]" />
                <span>Shared interest in culture</span>
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400 shrink-0" />
        </div>

        {/* Mirror Check & Paige Inspection Banner */}
        {renderMirrorCheckBanner(true)}

        {/* Floating Action Buttons: 3 Circular Buttons (Mockup 1) */}
        <div className="flex items-center justify-center space-x-4 py-3 pb-4">
          {/* Pass */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              sounds.playNope()
              setIsPassed(true)
              onPass(candidate)
            }}
            className="w-14 h-14 rounded-full bg-[#17161A] hover:bg-[#222026] active:scale-90 border border-white/10 flex items-center justify-center text-neutral-300 hover:text-white transition shadow-xl cursor-pointer"
            title="Pass"
            aria-label="Pass on candidate"
          >
            <X className="w-6 h-6 stroke-[2]" />
          </button>

          {/* Bookmark */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              sounds.playTap()
              setIsFavorite(!isFavorite)
            }}
            className="w-12 h-12 rounded-full bg-[#17161A] hover:bg-[#222026] active:scale-90 border border-white/10 flex items-center justify-center transition shadow-xl cursor-pointer"
            title="Bookmark"
            aria-label="Bookmark candidate"
          >
            <Star
              className="w-5 h-5 transition-colors"
              style={{
                color: isFavorite ? '#fbbf24' : '#d4d4d8',
                fill: isFavorite ? '#fbbf24' : 'transparent',
              }}
            />
          </button>

          {/* Connect */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              sounds.playLike()
              onInitiateHandshake(candidate)
            }}
            className="w-14 h-14 rounded-full bg-[#F472B6] hover:bg-[#f25da8] active:scale-90 shadow-xl shadow-[#F472B6]/30 flex items-center justify-center text-white transition cursor-pointer"
            title="Connect"
            aria-label="Connect with candidate"
          >
            <Heart className="w-6 h-6 fill-white stroke-white" />
          </button>
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

            {/* Desktop Mirror Check Banner */}
            {renderMirrorCheckBanner(false)}

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
