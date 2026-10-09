// ============================================================================
// src/components/LandingPage.tsx
// Universal Compatibility Platform: Human Passion & Real Romance Experience
// Written with Heart, Vulnerability & Emotional Truth • No Corporate AI Tone
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
  // Interactive Live Simulator: Test between 3 everyday emotional scenarios
  const [selectedCandidateIndex, setSelectedCandidateIndex] = useState<number>(0)
  const candidateOptions = [
    {
      title: 'That 2 AM Spark (95%)',
      candidate: mockCandidates[0],
      note: 'Shared values, quiet mornings & mutual butterflies',
      description: 'You both want the exact same quiet Sunday mornings, laugh at the same humor, and dream of building a real future together. It feels completely effortless.',
    },
    {
      title: 'Saved From Heartbreak (0%)',
      candidate: mockCandidates[1],
      note: 'Dealbreaker protected before you ever meet',
      description: 'You want a peaceful, smoke-free home and a shared future; they smoke daily. Other apps let you date for six months before breaking your heart. Check protects you upfront.',
    },
    {
      title: 'Great Banter, Wrong Timing (43%)',
      candidate: mockCandidates[2],
      note: 'Chemistry exists, but life rhythms clash',
      description: 'You make each other laugh, but your daily work schedules and relationship timelines are pulling in opposite directions. Honest clarity from day one.',
    },
  ]

  const activeCandidate = candidateOptions[selectedCandidateIndex].candidate
  const heroEvaluation = evaluateMatch(activeUser, activeCandidate)

  return (
    <div className="space-y-24 py-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* ────────────────────────────────────────────────────────── */}
      {/* 1. VISCERAL, HUMAN-FIRST HERO SECTION                      */}
      {/* ────────────────────────────────────────────────────────── */}
      <section className="relative text-center space-y-8 pt-6 sm:pt-14">
        {/* Warm Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[340px] bg-gradient-to-tr from-rose-500/10 via-amber-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Passion Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/15 backdrop-blur-xl shadow-[0_0_20px_rgba(255,255,255,0.06)] animate-in fade-in">
          <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400 animate-pulse" />
          <span className="text-xs font-medium tracking-wide text-neutral-200">
            Built by people who are tired of games, ghosting &amp; swipe burnout
          </span>
        </div>

        {/* Emotionally Resonant Headline */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.08]">
            You deserve someone who actually
            <span className="block bg-gradient-to-r from-rose-300 via-amber-200 to-emerald-300 bg-clip-text text-transparent font-semibold mt-1">
              wants the same life as you.
            </span>
          </h1>
          <p className="text-base sm:text-xl text-neutral-200 font-light max-w-2xl mx-auto leading-relaxed pt-2">
            Remember butterflies? Remember what it felt like when a conversation just flowed—without wondering if they&apos;re lying about what they want, and without having to shout over bar music? We built Check to bring real romance back.
          </p>
        </div>

        {/* Magnetic High-Converting CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-3">
          <button
            onClick={onEnterApp}
            className="apple-pill-btn px-7 py-3.5 text-xs sm:text-sm font-bold text-black bg-white hover:bg-neutral-100 shadow-[0_4px_30px_rgba(255,255,255,0.4)] flex items-center space-x-2.5 cursor-pointer transition-all hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-black stroke-[2.2]" />
            <span>Find Someone Real — 100% Free</span>
            <ArrowRight className="w-4 h-4 stroke-[2.2]" />
          </button>

          {onOpenFirstRun && (
            <button
              onClick={onOpenFirstRun}
              className="apple-pill-btn px-6 py-3.5 text-xs sm:text-sm font-semibold text-rose-200 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 flex items-center space-x-2 shadow-[0_0_24px_rgba(244,63,94,0.2)] cursor-pointer transition-all hover:scale-105 active:scale-95"
            >
              <span>90-Second Heartbeat Quiz</span>
            </button>
          )}

          {onOpenDatePlan && (
            <button
              onClick={onOpenDatePlan}
              className="apple-pill-btn px-5 py-3 text-xs sm:text-sm font-medium text-amber-300 bg-amber-950/30 hover:bg-amber-900/50 border border-amber-500/30 flex items-center space-x-2 cursor-pointer transition-all"
            >
              <Coffee className="w-4 h-4 text-amber-400" />
              <span>Quiet First Date Spots</span>
            </button>
          )}

          {onOpenAboutFaq && (
            <button
              onClick={onOpenAboutFaq}
              className="apple-pill-btn px-5 py-3 text-xs sm:text-sm font-medium text-neutral-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 flex items-center space-x-2 cursor-pointer transition-all"
            >
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <span>No BS: Read Our FAQ</span>
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
              <span>How We Protect Love</span>
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
              <span>Check Dating AI</span>
            </button>
          )}
        </div>

        {/* ────────────────────────────────────────────────────────── */}
        {/* INTERACTIVE COMPATIBILITY SIMULATOR                        */}
        {/* ────────────────────────────────────────────────────────── */}
        <div className="pt-8 max-w-4xl mx-auto text-left space-y-4">
          <div className="text-center space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-widest text-rose-400 font-bold">
              Real Chemistry Simulation
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              What Real Compatibility Feels Like
            </h2>
            <p className="text-xs text-neutral-300 font-light max-w-md mx-auto">
              Tap a scenario below or drag the sliders to see what happens when two hearts meet on the same wavelength.
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
                  Simulated First Encounter
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight mt-0.5">
                  Meeting {activeCandidate.identity.name} as {activeUser.identity.name}
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
                        <span>Real Human</span>
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-neutral-400 font-light block">
                    {activeCandidate.identity.age} y/o • {activeCandidate.lifestyle.diet} • {activeCandidate.geography.cityName}
                  </span>
                  <span className="text-[11px] text-rose-300 font-medium block">
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
                      {heroEvaluation.eligible ? 'Mutual Attraction' : 'Protected From Heartbreak'}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-300 font-light leading-snug">
                    {heroEvaluation.eligible ? (
                      <span>
                        Both hearts aligned: You ({heroEvaluation.compatibility.aToB}%) ↔ Them ({heroEvaluation.compatibility.bToA}%). Nobody is chasing.
                      </span>
                    ) : (
                      <span className="text-rose-300 font-medium">
                        Filtered out: Non-negotiable lifestyle boundary protected upfront.
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={onEnterApp}
                  className="apple-pill-btn px-4 py-2 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 self-start sm:self-auto flex items-center space-x-1.5 cursor-pointer transition shrink-0"
                >
                  <span>See My Real Matches</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────── */}
      {/* 2. THE BRUTAL TRUTH: WHY DATING APPS HURT (Split Cards)    */}
      {/* ────────────────────────────────────────────────────────── */}
      <section className="space-y-6">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-[11px] font-mono uppercase tracking-widest text-rose-400 font-bold">
            The Brutal Truth
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Why Modern Dating Leaves You Feeling Empty
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
            Mainstream apps make billions when you stay lonely. If you find your person and delete the app, they lose a paying subscriber.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card A: The Old Way */}
          <div className="apple-panel rounded-3xl p-7 sm:p-8 space-y-5 border-rose-500/25 bg-rose-500/[0.03] shadow-lg">
            <div className="flex items-center space-x-2.5 text-rose-400">
              <span className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center font-bold text-sm">
                ✕
              </span>
              <span className="text-xs font-mono uppercase tracking-widest font-bold">The Swipe Slot Machines</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Engineered to Keep You Swiping Forever
            </h3>

            <ul className="space-y-3.5 text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
              <li className="flex items-start space-x-2.5">
                <span className="text-rose-400 font-bold mt-0.5">•</span>
                <span><strong>Endless Dopamine Loops:</strong> Treating real human beings like trading cards. You swipe for an hour, talk to nobody, and go to sleep feeling completely alone.</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <span className="text-rose-400 font-bold mt-0.5">•</span>
                <span><strong>Profiting Off Loneliness:</strong> Charging \$39/month for fake &ldquo;SuperLikes&rdquo; and visibility boosts that make you feel like you have to pay just to be noticed.</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <span className="text-rose-400 font-bold mt-0.5">•</span>
                <span><strong>The 3-Month Heartbreak:</strong> Falling for someone after weeks of texting, only to discover on month three that they don&apos;t want marriage, hate kids, or smoke.</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <span className="text-rose-400 font-bold mt-0.5">•</span>
                <span><strong>Nightmare First Dates:</strong> Shouting over deafening bar music with someone who barely looks up from their phone screen.</span>
              </li>
            </ul>
          </div>

          {/* Card B: The Check Way */}
          <div className="apple-panel rounded-3xl p-7 sm:p-8 space-y-5 border-emerald-500/30 bg-emerald-500/[0.03] shadow-lg">
            <div className="flex items-center space-x-2.5 text-emerald-400">
              <span className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center font-bold text-sm">
                ✓
              </span>
              <span className="text-xs font-mono uppercase tracking-widest font-bold">The Check Promise</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              We Want You to Fall in Love and Delete This App
            </h3>

            <ul className="space-y-3.5 text-xs sm:text-sm text-neutral-200 font-light leading-relaxed">
              <li className="flex items-start space-x-2.5">
                <span className="text-emerald-400 font-bold mt-0.5">•</span>
                <span><strong>Mutual Excitement or Nothing:</strong> If it&apos;s not a mutual &ldquo;yes&rdquo; from both people, you never see each other. Life is too short to beg for someone&apos;s attention.</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <span className="text-emerald-400 font-bold mt-0.5">•</span>
                <span><strong>Your Love Life Isn&apos;t For Sale:</strong> Paid subscribers can never buy score boosts or cheat anyone&apos;s dealbreakers. Everyone gets the exact same chance at real love.</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <span className="text-emerald-400 font-bold mt-0.5">•</span>
                <span><strong>Your Boundaries Are Sacred:</strong> If you want kids, you won&apos;t fall for someone who doesn&apos;t. If you don&apos;t smoke, you won&apos;t see smokers. Your heart is protected upfront.</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <span className="text-emerald-400 font-bold mt-0.5">•</span>
                <span><strong>Dates Where You Can Actually Whisper:</strong> Quiet corner tables, soft warm lighting, tea, coffee, wine—places where you can actually look into someone&apos;s eyes and talk.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────── */}
      {/* 3. THE 4 TRUTHS OF REAL LOVE (Bento Grid)                  */}
      {/* ────────────────────────────────────────────────────────── */}
      <section className="space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-[11px] font-mono uppercase tracking-widest text-rose-400 font-bold">
            The 4 Truths of Real Love
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Built to Protect Your Heart
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
            Four promises we make to every single person who trusts us with their love life.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Bento 1: No One-Sided Crushes */}
          <div className="apple-panel-interactive rounded-3xl p-6 flex flex-col justify-between space-y-4 border-white/10 hover:border-white/20 transition-all">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                <HeartHandshake className="w-5 h-5 text-rose-400" />
              </div>
              <h3 className="text-base font-bold text-white tracking-tight">
                No One-Sided Crushes
              </h3>
              <p className="text-xs text-neutral-300 font-light leading-relaxed">
                Love only works when both hands are clapping. If someone isn&apos;t as excited about you as you are about them, we will never match you. You deserve someone who chooses you back.
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[10px] font-mono text-rose-400 font-semibold flex items-center space-x-1.5">
              <Heart className="w-3 h-3 fill-rose-400 text-rose-400" />
              <span>Mutual excitement or nothing</span>
            </div>
          </div>

          {/* Bento 2: Never Apologize for Your Standards */}
          <div className="apple-panel-interactive rounded-3xl p-6 flex flex-col justify-between space-y-4 border-white/10 hover:border-white/20 transition-all">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Never Settle on What Matters
              </h3>
              <p className="text-xs text-neutral-300 font-light leading-relaxed">
                The things that matter to you—your values, your faith, your family dreams, your lifestyle—are not &ldquo;picky.&rdquo; They are who you are. We make sure you never have to hide them.
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[10px] font-mono text-emerald-400 font-semibold flex items-center space-x-1.5">
              <ShieldCheck className="w-3 h-3" />
              <span>0.00% broken dealbreakers</span>
            </div>
          </div>

          {/* Bento 3: Calm Date Blueprint */}
          <div className="apple-panel-interactive rounded-3xl p-6 flex flex-col justify-between space-y-4 border-white/10 hover:border-white/20 transition-all">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Coffee className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Dates That Feel Like Relief
              </h3>
              <p className="text-xs text-neutral-300 font-light leading-relaxed">
                First dates shouldn&apos;t feel like job interviews or nightclub shouting matches. We curate intimate, quiet spots where you can relax, laugh, and be yourself without stress.
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[10px] font-mono text-amber-400 font-semibold flex items-center space-x-1.5">
              <Volume2 className="w-3 h-3" />
              <span>Quiet spots under 45 dB</span>
            </div>
          </div>

          {/* Bento 4: Bank-Grade Privacy */}
          <div className="apple-panel-interactive rounded-3xl p-6 flex flex-col justify-between space-y-4 border-white/10 hover:border-white/20 transition-all">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                <Lock className="w-5 h-5 text-sky-400" />
              </div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Your Privacy Is Sacred
              </h3>
              <p className="text-xs text-neutral-300 font-light leading-relaxed">
                We never broadcast your exact location to strangers. We never sell your data to ad networks. And every single person is verified so you know you&apos;re meeting someone real.
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[10px] font-mono text-sky-400 font-semibold flex items-center space-x-1.5">
              <Lock className="w-3 h-3" />
              <span>Real verified humans only</span>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────── */}
      {/* 4. REAL STORIES (Written with Authentic Human Warmth)      */}
      {/* ────────────────────────────────────────────────────────── */}
      <section className="space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-[11px] font-mono uppercase tracking-widest text-amber-300 font-bold">
            Real Stories
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            People Who Finally Found Their Person
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
            Real couples who were ready to delete every dating app—until they tried Check.
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
                &ldquo;I was so exhausted from swiping that I had almost given up on dating altogether. Check gave me Marcus on my first day. We met at a little bookstore cafe on a rainy Thursday, ordered tea, and ended up closing the place down. Two years later, we wake up to coffee together every single morning.&rdquo;
              </p>
            </div>
            <div className="flex items-center space-x-3 pt-3 border-t border-white/[0.06]">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                alt="Elena"
                className="w-10 h-10 rounded-full object-cover ring-1 ring-white/20"
              />
              <div>
                <span className="text-xs font-bold text-white block">Elena &amp; Marcus</span>
                <span className="text-[10px] text-neutral-400 block font-mono">Met in London • Together 2 years</span>
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
                &ldquo;Other apps treated me like a photo on a shelf. Check was the first place that actually cared how I live—I love quiet mornings, nature walks, and real conversations. Julien walked into that cafe and for the first time in my life, I didn&apos;t feel like I had to perform. I was just home.&rdquo;
              </p>
            </div>
            <div className="flex items-center space-x-3 pt-3 border-t border-white/[0.06]">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                alt="Julien"
                className="w-10 h-10 rounded-full object-cover ring-1 ring-white/20"
              />
              <div>
                <span className="text-xs font-bold text-white block">Julien &amp; Sophia</span>
                <span className="text-[10px] text-neutral-400 block font-mono">Met in Edinburgh • Living together</span>
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
                &ldquo;We both had big dreams for family and zero patience for people playing games. On our first date, there were no surprises, no hidden red flags. Just two people who wanted the exact same future. We got engaged in August in the Highlands!&rdquo;
              </p>
            </div>
            <div className="flex items-center space-x-3 pt-3 border-t border-white/[0.06]">
              <img
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80"
                alt="Maya"
                className="w-10 h-10 rounded-full object-cover ring-1 ring-white/20"
              />
              <div>
                <span className="text-xs font-bold text-white block">Liam &amp; Maya</span>
                <span className="text-[10px] text-neutral-400 block font-mono">Met in Bristol • Getting married</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────── */}
      {/* 5. THE NUMBERS (Honest Truth That Matters)                 */}
      {/* ────────────────────────────────────────────────────────── */}
      <section className="apple-panel rounded-3xl p-6 sm:p-9 space-y-6 border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-white/[0.08]">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
              The Raw Numbers
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
              Your Heart Is Too Precious to Waste on Guesswork
            </h2>
            <p className="text-xs text-neutral-300 font-light mt-0.5 max-w-xl">
              Commercial apps let 75% of users match with someone who breaks their core boundaries—because keeping you swiping keeps them profitable.
            </p>
          </div>
          <span className="self-start sm:self-auto px-3.5 py-1.5 rounded-full text-xs font-mono bg-white/[0.06] text-emerald-300 border border-emerald-500/20 font-semibold">
            ✓ 0.00% Broken Dealbreakers Guaranteed
          </span>
        </div>

        {/* Clean, Readable Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] text-neutral-400 uppercase tracking-wider text-[10px] font-mono">
                <th className="py-3.5 px-3">What You&apos;re Used To</th>
                <th className="py-3.5 px-3 text-right">Hidden Conflicts</th>
                <th className="py-3.5 px-3 text-right">Heartbreak Risk</th>
                <th className="py-3.5 px-3 text-right">Second Date Happiness</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05] text-neutral-300 font-light">
              <tr className="hover:bg-white/[0.02]">
                <td className="py-3 px-3 font-medium text-neutral-400">Mainstream Swipe Apps (Tinder / Bumble)</td>
                <td className="py-3 px-3 text-right font-mono text-rose-400 font-semibold">377 of 500 matches</td>
                <td className="py-3 px-3 text-right font-mono text-rose-400 font-bold">75.4% boundary clash</td>
                <td className="py-3 px-3 text-right font-mono">Only 20% want to meet again</td>
              </tr>
              <tr className="hover:bg-white/[0.02]">
                <td className="py-3 px-3 font-medium text-neutral-400">Keyword Profile Apps (Hinge)</td>
                <td className="py-3 px-3 text-right font-mono text-rose-400 font-semibold">320 of 500 matches</td>
                <td className="py-3 px-3 text-right font-mono text-rose-400 font-bold">64.0% boundary clash</td>
                <td className="py-3 px-3 text-right font-mono">Only 30% want to meet again</td>
              </tr>
              <tr className="bg-emerald-950/20 font-medium text-white border-y border-emerald-500/30">
                <td className="py-4 px-3 flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                  <span className="font-bold text-emerald-300">Check Human Compatibility</span>
                </td>
                <td className="py-4 px-3 text-right font-mono text-emerald-400 font-extrabold text-sm">0 conflicts</td>
                <td className="py-4 px-3 text-right font-mono text-emerald-400 font-extrabold text-sm">0.00% broken dealbreakers</td>
                <td className="py-4 px-3 text-right font-mono text-emerald-300 font-bold">87% deep mutual connection</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────── */}
      {/* 6. HOW TO START (Warm & Simple)                            */}
      {/* ────────────────────────────────────────────────────────── */}
      <section className="space-y-8 text-center">
        <div className="space-y-2 max-w-xl mx-auto">
          <span className="text-[11px] font-mono uppercase tracking-widest text-rose-400 font-bold">
            Three Simple Steps
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            How Your Next Story Begins
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 font-light">
            No 50-page forms. No fake personality quizzes. Just honest truth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {/* Step 1 */}
          <div className="p-6 sm:p-7 rounded-3xl apple-panel space-y-3.5 border-white/10 relative overflow-hidden">
            <span className="text-3xl font-extrabold text-rose-400/40 font-mono block">01</span>
            <h3 className="text-base font-bold text-white">Tell Us What Matters to Your Soul</h3>
            <p className="text-xs text-neutral-300 font-light leading-relaxed">
              Set what you love, how you live, your daily sleep rhythms, and what you will never compromise on. It takes 90 seconds.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 sm:p-7 rounded-3xl apple-panel space-y-3.5 border-white/10 relative overflow-hidden">
            <span className="text-3xl font-extrabold text-amber-400/40 font-mono block">02</span>
            <h3 className="text-base font-bold text-white">Meet People Who Want You Too</h3>
            <p className="text-xs text-neutral-300 font-light leading-relaxed">
              You will only ever see candidates who share your values and admire who you are. Both people must choose each other.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 sm:p-7 rounded-3xl apple-panel space-y-3.5 border-white/10 relative overflow-hidden">
            <span className="text-3xl font-extrabold text-emerald-400/40 font-mono block">03</span>
            <h3 className="text-base font-bold text-white">Meet at a Table Where You Can Talk</h3>
            <p className="text-xs text-neutral-300 font-light leading-relaxed">
              We help you pick a quiet cafe or garden where you can hear each other laugh without shouting over club music.
            </p>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────── */}
      {/* 7. SHOW-STOPPING CALL TO ACTION BANNER                     */}
      {/* ────────────────────────────────────────────────────────── */}
      <section
        className="relative rounded-[2.5rem] p-8 sm:p-14 text-center space-y-6 overflow-hidden border border-rose-500/30 shadow-[0_0_80px_rgba(244,63,94,0.18)]"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(35,8,16,0.95), rgba(8,6,12,0.98))',
        }}
      >
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold">
          <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
          <span>Stop Swiping. Start Feeling Something Real.</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white max-w-2xl mx-auto leading-tight">
          Ready for your last first date?
        </h2>

        <p className="text-sm sm:text-base text-neutral-200 font-light max-w-xl mx-auto leading-relaxed">
          You&apos;ve spent enough evenings scrolling through strangers. Let&apos;s find the person who makes you feel like you finally came home.
        </p>

        <div className="pt-2 flex flex-wrap justify-center gap-3.5">
          <button
            onClick={onEnterApp}
            className="apple-pill-btn px-8 py-3.5 text-xs sm:text-sm font-bold text-black bg-white hover:bg-neutral-100 shadow-[0_0_30px_rgba(255,255,255,0.4)] flex items-center space-x-2.5 cursor-pointer transition-all hover:scale-105 active:scale-95"
          >
            <span>Get Started — You Deserve Real Love</span>
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
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4 text-xs text-neutral-300">
          <span className="flex items-center space-x-1.5">
            <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
            <span>100% Free Mutual Matching</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Zero Pay-to-Win Tricks</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <Lock className="w-3.5 h-3.5 text-sky-400" />
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
          <span>Real Human Compatibility</span>
          <span>•</span>
          <span className="text-rose-400 font-medium">100% Mutual &amp; Zero Pay-to-Win</span>
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
