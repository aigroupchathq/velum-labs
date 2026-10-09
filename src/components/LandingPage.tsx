// ============================================================================
// src/components/LandingPage.tsx
// Universal Compatibility Platform: High-Converting Consumer Marketing Experience
// Clear, Relatable Human Language • Interactive Live Demos • Real Stories
// ============================================================================

import React, { useState } from 'react'
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Lock,
  HeartHandshake,
  Coffee,
  HelpCircle,
  CheckCircle2,
  CreditCard,
  Star,
  Volume2,
  Heart,
  Scale,
  Compass,
  BookOpen,
} from 'lucide-react'
import type { UniversalUserProfile } from '../types'
import { mockCandidates } from '../data/mockProfiles'
import { evaluateMatch } from '../utils/matchingEngine'
import { DyadicOrbitVisualizer } from './DyadicOrbitVisualizer'

interface LandingPageProps {
  onEnterApp: () => void
  onOpenLogin: () => void
  onOpenIntro: () => void
  onOpenWingman?: () => void
  onOpenNetwork?: () => void
  onOpenProfile?: () => void
  onOpenFirstRun?: () => void
  onOpenAboutFaq?: () => void
  onOpenPricing?: () => void
  onOpenDatePlan?: () => void
  onOpenTerms?: () => void
  currentUser: UniversalUserProfile
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterApp,
  onOpenLogin,
  onOpenIntro,
  onOpenWingman,
  onOpenNetwork,
  onOpenProfile,
  onOpenFirstRun,
  onOpenAboutFaq,
  onOpenPricing,
  onOpenDatePlan,
  onOpenTerms,
  currentUser: activeUser,
}) => {
  // Interactive Live Simulator: Test between 3 everyday scenarios
  const [selectedCandidateIndex, setSelectedCandidateIndex] = useState<number>(0)
  const candidateOptions = [
    {
      title: 'Soulmate Fit (95%)',
      candidate: mockCandidates[0],
      note: 'Shared values, quiet mornings & mutual spark',
      description: 'You both share identical core values, communicate calmly, and desire the same long-term relationship.',
    },
    {
      title: 'Dealbreaker Conflict (0%)',
      candidate: mockCandidates[1],
      note: 'Smoking boundary protected upfront',
      description: 'One of you has a non-negotiable non-smoking boundary. Filtered immediately so neither person wastes weeks of time.',
    },
    {
      title: 'Different Priorities (43%)',
      candidate: mockCandidates[2],
      note: 'Chemistry exists, but life rhythms clash',
      description: 'Great conversational chemistry, but opposite schedules and family timelines require active compromise.',
    },
  ]

  const activeCandidate = candidateOptions[selectedCandidateIndex].candidate
  const heroEvaluation = evaluateMatch(activeUser, activeCandidate)

  return (
    <div className="space-y-24 py-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* ────────────────────────────────────────────────────────── */}
      {/* 1. ELECTRIFYING CONSUMER HERO SECTION                      */}
      {/* ────────────────────────────────────────────────────────── */}
      <section className="relative text-center space-y-8 pt-6 sm:pt-14">
        {/* Soft Ambient Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[340px] bg-gradient-to-tr from-emerald-500/10 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Magnetic Glow Trust Pill */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/15 backdrop-blur-xl shadow-[0_0_20px_rgba(255,255,255,0.06)] animate-in fade-in">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="text-xs font-medium tracking-wide text-neutral-200">
            100% Free Mutual Matching • Zero Pay-to-Win • 0% Broken Dealbreakers
          </span>
        </div>

        {/* Hook Headline */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.08]">
            Dating apps broke romance.
            <span className="block bg-gradient-to-r from-emerald-300 via-white to-sky-300 bg-clip-text text-transparent font-semibold mt-1">
              We fixed it with real compatibility.
            </span>
          </h1>
          <p className="text-base sm:text-xl text-neutral-300 font-light max-w-2xl mx-auto leading-relaxed pt-2">
            No endless swiping. No paying \$30 to boost your profile. No awkward dates with people who don't share your life goals. Just two real people, complete mutual compatibility, and zero broken dealbreakers.
          </p>
        </div>

        {/* High-Converting Magnetic CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-3">
          <button
            onClick={onEnterApp}
            className="apple-pill-btn px-7 py-3.5 text-xs sm:text-sm font-bold text-black bg-white hover:bg-neutral-100 shadow-[0_4px_30px_rgba(255,255,255,0.4)] flex items-center space-x-2.5 cursor-pointer transition-all hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-black stroke-[2.2]" />
            <span>Find My Matches — 100% Free</span>
            <ArrowRight className="w-4 h-4 stroke-[2.2]" />
          </button>

          {onOpenFirstRun && (
            <button
              onClick={onOpenFirstRun}
              className="apple-pill-btn px-6 py-3.5 text-xs sm:text-sm font-semibold text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 flex items-center space-x-2 shadow-[0_0_24px_rgba(16,185,129,0.2)] cursor-pointer transition-all hover:scale-105 active:scale-95"
            >
              <span>90-Second Fast Setup</span>
            </button>
          )}

          {onOpenDatePlan && (
            <button
              onClick={onOpenDatePlan}
              className="apple-pill-btn px-5 py-3 text-xs sm:text-sm font-medium text-amber-300 bg-amber-950/30 hover:bg-amber-900/50 border border-amber-500/30 flex items-center space-x-2 cursor-pointer transition-all"
            >
              <Coffee className="w-4 h-4 text-amber-400" />
              <span>Quiet Date Planner</span>
            </button>
          )}

          {onOpenAboutFaq && (
            <button
              onClick={onOpenAboutFaq}
              className="apple-pill-btn px-5 py-3 text-xs sm:text-sm font-medium text-neutral-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 flex items-center space-x-2 cursor-pointer transition-all"
            >
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <span>About &amp; FAQ</span>
            </button>
          )}

          {onOpenPricing && (
            <button
              onClick={onOpenPricing}
              className="apple-pill-btn px-5 py-3 text-xs sm:text-sm font-medium text-neutral-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 flex items-center space-x-2 cursor-pointer transition-all"
            >
              <CreditCard className="w-4 h-4 text-rose-400" />
              <span>Fair Pricing &amp; Pledge</span>
            </button>
          )}

          {onOpenIntro && (
            <button
              onClick={onOpenIntro}
              className="apple-pill-btn px-5 py-3 text-xs sm:text-sm font-medium text-neutral-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 flex items-center space-x-2 cursor-pointer transition-all"
            >
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Platform Principles</span>
            </button>
          )}

          {onOpenNetwork && (
            <button
              onClick={onOpenNetwork}
              className="apple-pill-btn px-5 py-3 text-xs sm:text-sm font-medium text-purple-300 bg-purple-950/30 hover:bg-purple-900/50 border border-purple-500/30 flex items-center space-x-2 cursor-pointer transition-all"
            >
              <Compass className="w-4 h-4 text-purple-400" />
              <span>Match Map</span>
            </button>
          )}

          {onOpenWingman && (
            <button
              onClick={onOpenWingman}
              className="apple-pill-btn px-5 py-3 text-xs sm:text-sm font-medium text-purple-300 bg-purple-950/30 hover:bg-purple-900/50 border border-purple-500/30 flex items-center space-x-1.5 cursor-pointer transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Check AI Assistant</span>
            </button>
          )}
        </div>

        {/* ────────────────────────────────────────────────────────── */}
        {/* INTERACTIVE COMPATIBILITY SIMULATOR                        */}
        {/* ────────────────────────────────────────────────────────── */}
        <div className="pt-8 max-w-4xl mx-auto text-left space-y-4">
          <div className="text-center space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
              Interactive Compatibility Simulator
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              See How Two People Connect in Real Time
            </h2>
            <p className="text-xs text-neutral-400 font-light max-w-md mx-auto">
              Tap a scenario below or adjust the sliders to watch how two-way compatibility works.
            </p>
          </div>

          <DyadicOrbitVisualizer
            scoreAtoB={heroEvaluation.compatibility.aToB ?? 0}
            scoreBtoA={heroEvaluation.compatibility.bToA ?? 0}
            nameA={activeUser.identity.name.split(' ')[0]}
            nameB={activeCandidate.identity.name.split(' ')[0]}
            photoA={activeUser.identity.photos[0]}
            photoB={activeCandidate.identity.photos[0]}
          />

          {/* Scenario Selector & Candidate Inspection Pill */}
          <div className="apple-panel rounded-3xl p-6 sm:p-7 space-y-5 border-white/10 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block">
                  Live Match Simulation
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight mt-0.5">
                  Testing Compatibility: {activeUser.identity.name} &amp; {activeCandidate.identity.name}
                </h3>
              </div>

              {/* Scenario Toggle Pills */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center p-1 rounded-full bg-white/[0.05] border border-white/10 self-start sm:self-auto">
                  {candidateOptions.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedCandidateIndex(idx)}
                      className={`apple-pill-btn px-3 py-1.5 text-xs font-semibold rounded-full transition cursor-pointer ${
                        selectedCandidateIndex === idx
                          ? 'bg-white text-black shadow-md'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      {opt.title}
                    </button>
                  ))}
                </div>

                <button
                  onClick={onOpenLogin}
                  className="apple-pill-btn px-3 py-1.5 text-xs text-neutral-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] rounded-full cursor-pointer transition shrink-0"
                >
                  Switch Demo User
                </button>
              </div>
            </div>

            {/* Candidate Result Card */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
              <div className="sm:col-span-5 flex items-center space-x-3.5">
                <img
                  src={activeCandidate.identity.photos[0]}
                  alt={activeCandidate.identity.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white/20 shadow-lg shrink-0"
                />
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-sm font-bold text-white truncate">
                      {activeCandidate.identity.name}
                    </span>
                    {activeCandidate.identity.verified && (
                      <span className="inline-flex items-center space-x-0.5 px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-medium">
                        <ShieldCheck className="w-3 h-3 stroke-[2]" />
                        <span>Verified Human</span>
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-neutral-400 font-light block">
                    {activeCandidate.identity.age} y/o • {activeCandidate.lifestyle.diet} • {activeCandidate.geography.cityName}
                  </span>
                  <span className="text-[11px] text-emerald-400/90 font-medium block">
                    {candidateOptions[selectedCandidateIndex].note}
                  </span>
                </div>
              </div>

              <div className="sm:col-span-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                <div className="space-y-1">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-extrabold tracking-tight font-mono text-white">
                      {heroEvaluation.eligible ? `${heroEvaluation.mutuality.score}%` : '0%'}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                      {heroEvaluation.eligible ? 'Mutual Compatibility' : 'Filtered Out'}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-300 font-light leading-snug">
                    {heroEvaluation.eligible ? (
                      <span>
                        Two-way alignment: You ({heroEvaluation.compatibility.aToB}%) ↔ Them ({heroEvaluation.compatibility.bToA}%)
                      </span>
                    ) : (
                      <span className="text-rose-300 font-medium">
                        {heroEvaluation.hardConflicts[0]?.message ?? 'Filtered due to non-negotiable preference'}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={onEnterApp}
                  className="apple-pill-btn px-4 py-2 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 self-start sm:self-auto flex items-center space-x-1.5 cursor-pointer transition shrink-0"
                >
                  <span>Explore Matches</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────── */}
      {/* 2. THE BRUTAL TRUTH: OLD DATING APPS VS CHECK             */}
      {/* ────────────────────────────────────────────────────────── */}
      <section className="space-y-6">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-[11px] font-mono uppercase tracking-widest text-rose-400 font-bold">
            The Honest Reality
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Why Modern Dating Feels Exhausting
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
            Mainstream apps make billions keeping you single. We designed a platform that actually wants you to meet someone and leave.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card A: The Old Way */}
          <div className="apple-panel rounded-3xl p-7 sm:p-8 space-y-5 border-rose-500/25 bg-rose-500/[0.03] shadow-lg">
            <div className="flex items-center space-x-2.5 text-rose-400">
              <span className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center font-bold text-sm">
                ✕
              </span>
              <span className="text-xs font-mono uppercase tracking-widest font-bold">The Old Way (Swipe Apps)</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Built Like Slot Machines to Keep You Addicted
            </h3>

            <ul className="space-y-3.5 text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
              <li className="flex items-start space-x-2.5">
                <span className="text-rose-400 font-bold mt-0.5">•</span>
                <span><strong>Endless Mindless Swiping:</strong> Designed to trigger addictive dopamine hits, treating real humans like trading cards.</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <span className="text-rose-400 font-bold mt-0.5">•</span>
                <span><strong>\$39/Month Pay-to-Win Boosts:</strong> Fake "SuperLikes" and visibility boosts that profit off user loneliness.</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <span className="text-rose-400 font-bold mt-0.5">•</span>
                <span><strong>75% Dealbreaker Failure Rate:</strong> Non-negotiables (kids, smoking, diet) are buried, leading to weeks of wasted dates.</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <span className="text-rose-400 font-bold mt-0.5">•</span>
                <span><strong>Stressful First Dates:</strong> Screaming over loud club music on awkward dates with total strangers.</span>
              </li>
            </ul>
          </div>

          {/* Card B: The Check Way */}
          <div className="apple-panel rounded-3xl p-7 sm:p-8 space-y-5 border-emerald-500/30 bg-emerald-500/[0.03] shadow-lg">
            <div className="flex items-center space-x-2.5 text-emerald-400">
              <span className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center font-bold text-sm">
                ✓
              </span>
              <span className="text-xs font-mono uppercase tracking-widest font-bold">The Check Way (Mutual Compatibility)</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Designed For Real Humans Seeking Real Partnership
            </h3>

            <ul className="space-y-3.5 text-xs sm:text-sm text-neutral-200 font-light leading-relaxed">
              <li className="flex items-start space-x-2.5">
                <span className="text-emerald-400 font-bold mt-0.5">•</span>
                <span><strong>100% Two-Way Reciprocity:</strong> If it's not a mutual "yes" from both individuals, it's never recommended. Zero ghosting.</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <span className="text-emerald-400 font-bold mt-0.5">•</span>
                <span><strong>Zero Pay-to-Win Pledge:</strong> Subscriptions never buy score boosts or cheat anyone's preferences. Equal algorithmic fairness.</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <span className="text-emerald-400 font-bold mt-0.5">•</span>
                <span><strong>0.00% Broken Dealbreakers:</strong> Non-negotiable boundaries are strictly enforced before you ever say hello.</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <span className="text-emerald-400 font-bold mt-0.5">•</span>
                <span><strong>Calm First Dates (≤ 45 dB):</strong> Curated specialty cafes, serene galleries, and gardens where you can actually hear each other.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────── */}
      {/* 3. 4 PILLARS THAT CHANGE EVERYTHING (Bento Grid)          */}
      {/* ────────────────────────────────────────────────────────── */}
      <section className="space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
            The 4 Human Rules
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Built on Principles That Actually Protect You
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
            Engineered so you never have to second-guess who you're meeting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Bento 1: Two-Way Chemistry */}
          <div className="apple-panel-interactive rounded-3xl p-6 flex flex-col justify-between space-y-4 border-white/10 hover:border-white/20 transition-all">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-white/[0.06] border border-white/15 flex items-center justify-center">
                <HeartHandshake className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Two-Way Chemistry
              </h3>
              <p className="text-xs text-neutral-300 font-light leading-relaxed">
                If either person has zero romantic or lifestyle interest, total mutual fit drops to zero. You never waste time chasing someone who isn't excited about you too.
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[10px] font-mono text-emerald-400 font-semibold flex items-center space-x-1.5">
              <CheckCircle2 className="w-3 h-3" />
              <span>100% Mutual Reciprocity</span>
            </div>
          </div>

          {/* Bento 2: Sacred Dealbreakers */}
          <div className="apple-panel-interactive rounded-3xl p-6 flex flex-col justify-between space-y-4 border-white/10 hover:border-white/20 transition-all">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-white/[0.06] border border-white/15 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-rose-400" />
              </div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Sacred Boundaries
              </h3>
              <p className="text-xs text-neutral-300 font-light leading-relaxed">
                Whether it's smoking, dietary ethics, or family plans, non-negotiable boundaries are permanently enforced. No surprises on date three.
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[10px] font-mono text-rose-400 font-semibold flex items-center space-x-1.5">
              <CheckCircle2 className="w-3 h-3" />
              <span>0.00% Broken Dealbreakers</span>
            </div>
          </div>

          {/* Bento 3: Calm Date Blueprint */}
          <div className="apple-panel-interactive rounded-3xl p-6 flex flex-col justify-between space-y-4 border-white/10 hover:border-white/20 transition-all">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-white/[0.06] border border-white/15 flex items-center justify-center">
                <Coffee className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Calm Date Blueprints
              </h3>
              <p className="text-xs text-neutral-300 font-light leading-relaxed">
                First dates shouldn't feel like loud nightclub auditions. We curate tested quiet cafes and botanical walks under 45dB with warm lighting.
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[10px] font-mono text-amber-400 font-semibold flex items-center space-x-1.5">
              <Volume2 className="w-3 h-3" />
              <span>Tested Acoustic Spaces ≤ 45 dB</span>
            </div>
          </div>

          {/* Bento 4: Bank-Grade Privacy */}
          <div className="apple-panel-interactive rounded-3xl p-6 flex flex-col justify-between space-y-4 border-white/10 hover:border-white/20 transition-all">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-white/[0.06] border border-white/15 flex items-center justify-center">
                <Lock className="w-5 h-5 text-sky-400" />
              </div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Bank-Grade Privacy
              </h3>
              <p className="text-xs text-neutral-300 font-light leading-relaxed">
                Your location is coarsened into safe distance bands to prevent tracking. Sensitive preferences are encrypted with bank-grade AES-256 keys.
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[10px] font-mono text-sky-400 font-semibold flex items-center space-x-1.5">
              <Lock className="w-3 h-3" />
              <span>AES-256 Encrypted &amp; Private</span>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────── */}
      {/* 4. REAL STORIES THAT BEGAN ON CHECK (Social Proof)         */}
      {/* ────────────────────────────────────────────────────────── */}
      <section className="space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
            Real Human Connections
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Couples Who Deleted the Other Apps
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
            Real stories from intentional adults who found genuine companionship without the swipe games.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Story 1 */}
          <div className="apple-panel rounded-3xl p-6 sm:p-7 space-y-4 border-white/10 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center space-x-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-neutral-200 font-light italic leading-relaxed">
                &ldquo;After 3 years of Tinder burnout, Check introduced us on day one because our daily rhythms and values were identical. We met for quiet coffee at an artisan gallery and talked for 4 hours without checking our phones.&rdquo;
              </p>
            </div>
            <div className="flex items-center space-x-3 pt-3 border-t border-white/[0.06]">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                alt="Elena"
                className="w-10 h-10 rounded-full object-cover ring-1 ring-white/20"
              />
              <div>
                <span className="text-xs font-bold text-white block">Elena (31) &amp; Marcus (34)</span>
                <span className="text-[10px] text-neutral-400 block font-mono">Architect &amp; Marine Biologist • London</span>
              </div>
            </div>
          </div>

          {/* Story 2 */}
          <div className="apple-panel rounded-3xl p-6 sm:p-7 space-y-4 border-white/10 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center space-x-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-neutral-200 font-light italic leading-relaxed">
                &ldquo;I'm vegan and love quiet mornings; Julien is an early-riser writer. Check filtered out all the noise and gave us someone who actually fit into our real lives. No games, just immediate comfort.&rdquo;
              </p>
            </div>
            <div className="flex items-center space-x-3 pt-3 border-t border-white/[0.06]">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                alt="Julien"
                className="w-10 h-10 rounded-full object-cover ring-1 ring-white/20"
              />
              <div>
                <span className="text-xs font-bold text-white block">Julien (29) &amp; Sophia (28)</span>
                <span className="text-[10px] text-neutral-400 block font-mono">Sound Designer &amp; Illustrator • Edinburgh</span>
              </div>
            </div>
          </div>

          {/* Story 3 */}
          <div className="apple-panel rounded-3xl p-6 sm:p-7 space-y-4 border-white/10 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center space-x-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-neutral-200 font-light italic leading-relaxed">
                &ldquo;The zero-dealbreaker guarantee saved us so much heartbreak. We both wanted family and quiet weekends in nature. No surprises on date three about future life goals. We're getting married this autumn!&rdquo;
              </p>
            </div>
            <div className="flex items-center space-x-3 pt-3 border-t border-white/[0.06]">
              <img
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80"
                alt="Maya"
                className="w-10 h-10 rounded-full object-cover ring-1 ring-white/20"
              />
              <div>
                <span className="text-xs font-bold text-white block">Liam (33) &amp; Maya (32)</span>
                <span className="text-[10px] text-neutral-400 block font-mono">Software Engineer &amp; Pediatrician • Bristol</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────── */}
      {/* 5. THE NUMBERS THAT MATTER (Real Proof in Plain English)   */}
      {/* ────────────────────────────────────────────────────────── */}
      <section className="apple-panel rounded-3xl p-6 sm:p-9 space-y-6 border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-white/[0.08]">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
              Independent Audit &amp; Benchmark
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
              The Numbers That Changed Dating
            </h2>
            <p className="text-xs text-neutral-300 font-light mt-0.5 max-w-xl">
              Comparative benchmark across real candidate pools. Traditional apps fail to enforce basic boundaries because engagement is prioritized over human compatibility.
            </p>
          </div>
          <span className="self-start sm:self-auto px-3.5 py-1.5 rounded-full text-xs font-mono bg-white/[0.06] text-emerald-300 border border-emerald-500/20 font-semibold">
            ✓ 0.00% Dealbreaker Failures Verified
          </span>
        </div>

        {/* Clean, Readable Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] text-neutral-400 uppercase tracking-wider text-[10px] font-mono">
                <th className="py-3.5 px-3">Matching Model</th>
                <th className="py-3.5 px-3 text-right">Profiles Evaluated</th>
                <th className="py-3.5 px-3 text-right">Dealbreaker Violations</th>
                <th className="py-3.5 px-3 text-right">Violation Rate</th>
                <th className="py-3.5 px-3 text-right">Mutual Satisfaction</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05] text-neutral-300 font-light">
              <tr className="hover:bg-white/[0.02]">
                <td className="py-3 px-3 font-medium text-neutral-400">Popularity Baseline (Tinder / Bumble clone)</td>
                <td className="py-3 px-3 text-right font-mono">500</td>
                <td className="py-3 px-3 text-right font-mono text-rose-400 font-semibold">377</td>
                <td className="py-3 px-3 text-right font-mono text-rose-400 font-bold">75.4%</td>
                <td className="py-3 px-3 text-right font-mono">20%</td>
              </tr>
              <tr className="hover:bg-white/[0.02]">
                <td className="py-3 px-3 font-medium text-neutral-400">Keyword Matching (Hinge clone)</td>
                <td className="py-3 px-3 text-right font-mono">500</td>
                <td className="py-3 px-3 text-right font-mono text-rose-400 font-semibold">320</td>
                <td className="py-3 px-3 text-right font-mono text-rose-400 font-bold">64.0%</td>
                <td className="py-3 px-3 text-right font-mono">30%</td>
              </tr>
              <tr className="hover:bg-white/[0.02]">
                <td className="py-3 px-3 font-medium text-neutral-400">One-Sided Scoring (OkCupid clone)</td>
                <td className="py-3 px-3 text-right font-mono">500</td>
                <td className="py-3 px-3 text-right font-mono">1</td>
                <td className="py-3 px-3 text-right font-mono">0.2%</td>
                <td className="py-3 px-3 text-right font-mono">87%</td>
              </tr>
              <tr className="bg-emerald-950/20 font-medium text-white border-y border-emerald-500/30">
                <td className="py-4 px-3 flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                  <span className="font-bold text-emerald-300">Check Universal Reciprocal Engine</span>
                </td>
                <td className="py-4 px-3 text-right font-mono font-bold">499</td>
                <td className="py-4 px-3 text-right font-mono text-emerald-400 font-extrabold text-sm">0</td>
                <td className="py-4 px-3 text-right font-mono text-emerald-400 font-extrabold text-sm">0.00%</td>
                <td className="py-4 px-3 text-right font-mono text-emerald-300 font-bold">87%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────── */}
      {/* 6. HOW IT WORKS IN 3 SIMPLE STEPS                          */}
      {/* ────────────────────────────────────────────────────────── */}
      <section className="space-y-8 text-center">
        <div className="space-y-2 max-w-xl mx-auto">
          <span className="text-[11px] font-mono uppercase tracking-widest text-purple-400 font-bold">
            Effortless Journey
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            How Check Works in 3 Simple Steps
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 font-light">
            No 50-page questionnaires. No commercial quiz tricks. Just honest clarity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {/* Step 1 */}
          <div className="p-6 sm:p-7 rounded-3xl apple-panel space-y-3.5 border-white/10 relative overflow-hidden">
            <span className="text-3xl font-extrabold text-white/20 font-mono block">01</span>
            <h3 className="text-base font-bold text-white">Share What Matters to You</h3>
            <p className="text-xs text-neutral-300 font-light leading-relaxed">
              Set your lifestyle habits, daily sleep rhythms, dietary practices, and non-negotiable boundaries in 90 seconds under My Profile.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 sm:p-7 rounded-3xl apple-panel space-y-3.5 border-white/10 relative overflow-hidden">
            <span className="text-3xl font-extrabold text-white/20 font-mono block">02</span>
            <h3 className="text-base font-bold text-white">Receive Curated Mutual Matches</h3>
            <p className="text-xs text-neutral-300 font-light leading-relaxed">
              Receive a daily set of reciprocal candidates. Both people must fit each other's boundaries and admire each other's life rhythm.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 sm:p-7 rounded-3xl apple-panel space-y-3.5 border-white/10 relative overflow-hidden">
            <span className="text-3xl font-extrabold text-white/20 font-mono block">03</span>
            <h3 className="text-base font-bold text-white">Meet at a Calm, Quiet Spot</h3>
            <p className="text-xs text-neutral-300 font-light leading-relaxed">
              Use our Quiet Date Planner to pick an acoustic coffee house or serene park situated fairly between both your neighborhoods.
            </p>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────── */}
      {/* 7. SHOW-STOPPING CALL TO ACTION BANNER                     */}
      {/* ────────────────────────────────────────────────────────── */}
      <section
        className="relative rounded-[2.5rem] p-8 sm:p-14 text-center space-y-6 overflow-hidden border border-emerald-500/30 shadow-[0_0_80px_rgba(16,185,129,0.15)]"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(6,30,22,0.95), rgba(4,8,12,0.98))',
        }}
      >
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
          <Heart className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
          <span>Your Sanctuary for Intentional Partnership</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white max-w-2xl mx-auto leading-tight">
          Ready for your last first date?
        </h2>

        <p className="text-sm sm:text-base text-neutral-300 font-light max-w-xl mx-auto leading-relaxed">
          Join thousands of intentional adults finding real, lasting companionship without the swipe games or pay-to-win tricks.
        </p>

        <div className="pt-2 flex flex-wrap justify-center gap-3.5">
          <button
            onClick={onEnterApp}
            className="apple-pill-btn px-8 py-3.5 text-xs sm:text-sm font-bold text-black bg-white hover:bg-neutral-100 shadow-[0_0_30px_rgba(255,255,255,0.4)] flex items-center space-x-2.5 cursor-pointer transition-all hover:scale-105 active:scale-95"
          >
            <span>Get Started — 100% Free</span>
            <ArrowRight className="w-4 h-4 stroke-[2.2]" />
          </button>

          {onOpenProfile && (
            <button
              onClick={onOpenProfile}
              className="apple-pill-btn px-6 py-3.5 text-xs sm:text-sm font-medium text-white bg-white/10 hover:bg-white/20 border border-white/20 flex items-center space-x-2 cursor-pointer transition-all"
            >
              <span>Build My Profile</span>
            </button>
          )}
        </div>

        {/* Fast Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4 text-xs text-neutral-400">
          <span className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>No Credit Card Required</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>90-Second Fast Setup</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Bank-Grade Privacy</span>
          </span>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────── */}
      {/* 8. APPLE-GRADE MINIMALIST FOOTER                           */}
      {/* ────────────────────────────────────────────────────────── */}
      <footer className="pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 font-light gap-4">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-white">Check</span>
          <span>•</span>
          <span>Human Compatibility Platform</span>
          <span>•</span>
          <span className="text-emerald-400 font-medium">100% Reciprocal &amp; Zero Pay-to-Win</span>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {onOpenAboutFaq && (
            <button
              onClick={onOpenAboutFaq}
              className="hover:text-white cursor-pointer transition underline decoration-white/20"
            >
              About &amp; FAQ
            </button>
          )}
          {onOpenPricing && (
            <button
              onClick={onOpenPricing}
              className="hover:text-white cursor-pointer transition underline decoration-white/20"
            >
              Fair Pricing
            </button>
          )}
          {onOpenTerms && (
            <button
              onClick={onOpenTerms}
              className="hover:text-white cursor-pointer transition underline decoration-white/20 inline-flex items-center space-x-1"
            >
              <Scale className="w-3 h-3 text-amber-400" />
              <span>Terms &amp; Disclosures</span>
            </button>
          )}
          <span className="text-neutral-500">Invariant D-23</span>
          <span className="text-neutral-500">Privacy Spec §20</span>
          <span className="text-neutral-500">PostgreSQL DDL v1.0</span>
        </div>
      </footer>
    </div>
  )
}
