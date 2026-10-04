// Universal Compatibility Platform: Match Card Component
// Governing Standard: Master Build Specification §31

import React from 'react'
import {
  ShieldCheck,
  MapPin,
  HeartHandshake,
  AlertCircle,
  HelpCircle,
  Clock,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  UserX,
  Send,
  SlidersHorizontal,
} from 'lucide-react'
import type { UniversalUserProfile, MatchEvaluation } from '../types'

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
    explanation,
    hardConflicts,
    geographicFeasibility,
  } = evaluation

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
        !eligible
          ? 'bg-slate-900/60 border-rose-900/40 opacity-80'
          : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow-xl shadow-black/40'
      }`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Left Column: Visual Identity & Basic Specs (4 cols) */}
        <div className="lg:col-span-4 relative min-h-[280px] lg:min-h-full bg-slate-950">
          <img
            src={candidate.identity.photos[0]}
            alt={candidate.identity.name}
            className="w-full h-full object-cover max-h-[380px] lg:max-h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

          {/* Verification & Proximity Tag Overlay */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center space-x-1.5 backdrop-blur-md ${
                candidate.identity.verified
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-slate-800/80 text-slate-300 border border-slate-700'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{candidate.identity.verified ? 'Verified Identity' : 'Self-Declared'}</span>
            </span>

            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-900/80 text-slate-200 border border-slate-700/80 backdrop-blur-md flex items-center space-x-1">
              <MapPin className="w-3 h-3 text-indigo-400" />
              <span>{geographicFeasibility.summary.split(' ')[0]} km</span>
            </span>
          </div>

          {/* Profile Name & Pronouns in Overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-baseline space-x-2">
              <h3 className="text-xl font-bold text-white tracking-tight">{candidate.identity.name}</h3>
              <span className="text-sm font-semibold text-slate-300">{candidate.identity.age}</span>
              <span className="text-xs text-slate-400">({candidate.identity.pronouns})</span>
            </div>
            <p className="text-xs text-slate-300 line-clamp-2 mt-1">{candidate.identity.bio}</p>
          </div>
        </div>

        {/* Right Column: Detailed Alignment & Explainability (8 cols) */}
        <div className="lg:col-span-8 p-6 flex flex-col justify-between">
          <div>
            {/* Header: Eligibility / Mutuality & Confidence Scores */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                {/* Harmonic Mutuality Score Badge */}
                <div
                  className={`px-3 py-1.5 rounded-xl border flex items-center space-x-2 ${
                    !eligible
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                      : mutuality.score! >= 80
                      ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300'
                      : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  }`}
                >
                  <HeartHandshake className="w-4 h-4" />
                  <div>
                    <div className="flex items-baseline space-x-1">
                      <span className="text-lg font-bold">
                        {eligible ? `${mutuality.score}%` : 'Ineligible'}
                      </span>
                      <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">
                        Mutuality
                      </span>
                    </div>
                  </div>
                </div>

                {/* Directional Sub-scores breakdown */}
                {eligible && (
                  <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400">
                    <span>You → Them: <strong className="text-slate-200">{compatibility.aToB}%</strong></span>
                    <span>•</span>
                    <span>Them → You: <strong className="text-slate-200">{compatibility.bToA}%</strong></span>
                  </div>
                )}
              </div>

              {/* Epistemic Confidence Tag */}
              <div className="flex items-center space-x-2">
                <span
                  className={`text-xs px-2.5 py-1 rounded-lg border font-medium flex items-center space-x-1.5 ${
                    confidence.rating === 'HIGH'
                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                      : confidence.rating === 'MODERATE'
                      ? 'bg-blue-500/10 text-blue-300 border-blue-500/20'
                      : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>{confidence.rating} Confidence ({confidence.score}%)</span>
                </span>
              </div>
            </div>

            {/* Asymmetry or Exclusion Alert */}
            {!eligible && (
              <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <div>
                  <strong className="block font-semibold">Hard Requirement Exclusion</strong>
                  <span>{hardConflicts[0]?.message}</span>
                </div>
              </div>
            )}

            {eligible && mutuality.asymmetric && (
              <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                <div>
                  <strong className="block font-semibold">Asymmetric Interest Noted</strong>
                  <span>
                    One-sided compatibility gap of {mutuality.gap}%. Harmonic mutuality balances both requirements.
                  </span>
                </div>
              </div>
            )}

            {/* Primary Intent & Structure Badges */}
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-slate-200 border border-slate-700">
                🎯 {candidate.intention.primaryIntent}
              </span>
              <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-slate-200 border border-slate-700 capitalize">
                🤝 {candidate.intention.relationshipStructure}
              </span>
              <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-slate-200 border border-slate-700 capitalize">
                🥗 {candidate.lifestyle.diet}
              </span>
              <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-slate-200 border border-slate-700">
                🚭 Non-smoker: {candidate.lifestyle.smoking === 'never' ? 'Yes' : 'No'}
              </span>
            </div>

            {/* Structured Alignment Triad (Synergies, Frictions, Unknowns) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
              {/* 1. Strong Alignment (+) */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center space-x-1.5 text-xs font-semibold text-emerald-400 mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Strong Alignment (+)</span>
                </div>
                <ul className="text-xs text-slate-300 space-y-1.5">
                  {explanation.strongAlignment.length > 0 ? (
                    explanation.strongAlignment.map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-1.5">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span className="line-clamp-2">{item}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-slate-500 italic">No direct primary synergies</li>
                  )}
                </ul>
              </div>

              {/* 2. Potential Friction (-) */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center space-x-1.5 text-xs font-semibold text-amber-400 mb-2">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Potential Friction (-)</span>
                </div>
                <ul className="text-xs text-slate-300 space-y-1.5">
                  {explanation.potentialFriction.length > 0 ? (
                    explanation.potentialFriction.map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-1.5">
                        <span className="text-amber-500 font-bold">•</span>
                        <span className="line-clamp-2">{item}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-slate-400 text-[11px]">No active friction identified</li>
                  )}
                </ul>
              </div>

              {/* 3. Unknown Information (?) */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center space-x-1.5 text-xs font-semibold text-indigo-400 mb-2">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Unknown / Discovery (?)</span>
                </div>
                <ul className="text-xs text-slate-400 space-y-1.5">
                  {explanation.unknownInformation.length > 0 ? (
                    explanation.unknownInformation.map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-1.5">
                        <span className="text-indigo-400 font-bold">?</span>
                        <span>{item}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-slate-400 text-[11px]">Profile dimensions fully populated</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Why Recommended Rationale Box */}
            <div className="mt-4 p-3 rounded-xl bg-indigo-950/20 border border-indigo-900/30 text-xs text-slate-300 flex items-start space-x-2">
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-indigo-300 block font-semibold">Why this recommendation:</strong>
                <span>{explanation.whyRecommended}</span>
              </div>
            </div>
          </div>

          {/* Action Bar (No swipe gamification!) */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-5 mt-4 border-t border-slate-800">
            <button
              onClick={() => onInspectDeepReport(candidate, evaluation)}
              className="px-3.5 py-2 rounded-xl text-xs font-medium text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 transition-all flex items-center space-x-1.5"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Inspect 12-Dimension Report</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => onPass(candidate)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition-all flex items-center space-x-1.5"
              >
                <UserX className="w-3.5 h-3.5" />
                <span>Respectful Pass</span>
              </button>

              {eligible && (
                <button
                  onClick={() => onInitiateHandshake(candidate)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition-all flex items-center space-x-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Initiate Handshake</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
