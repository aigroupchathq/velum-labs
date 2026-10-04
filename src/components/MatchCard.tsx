// Universal Compatibility Platform: Match Card Component
// Governing Standards: Master Build Specification §31 & Top HCI / Design Recommendations

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

  // Anti-Trilateration Distance Coarsening (HCI Privacy Recommendation)
  const rawDistanceKm = parseFloat(geographicFeasibility.summary.split(' ')[0]) || 10
  let coarseDistance = 'Nearby (< 10 km)'
  if (rawDistanceKm > 50) {
    coarseDistance = '> 50 km (Long-Distance)'
  } else if (rawDistanceKm > 25) {
    coarseDistance = 'Regional (25–50 km)'
  } else if (rawDistanceKm > 10) {
    coarseDistance = 'Metro Area (10–25 km)'
  }

  const isLowConfidence = confidence.score < 60

  return (
    <div
      className={`rounded-3xl border transition-all duration-300 overflow-hidden ${
        !eligible
          ? 'bg-slate-900/50 border-rose-900/40 opacity-80'
          : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow-2xl shadow-black/50'
      }`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Left Column: Visual Somatic Identity & Safety Badges (4 cols) */}
        <div className="lg:col-span-4 relative min-h-[300px] lg:min-h-full bg-slate-950">
          <img
            src={candidate.identity.photos[0]}
            alt={candidate.identity.name}
            className="w-full h-full object-cover max-h-[420px] lg:max-h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent" />

          {/* Verification & Obfuscated Proximity Overlay */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1.5 backdrop-blur-md ${
                candidate.identity.verified
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-slate-900/80 text-slate-300 border border-slate-700'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{candidate.identity.verified ? 'Verified Identity' : 'Self-Declared'}</span>
            </span>

            <span
              title="Obfuscated privacy zone to prevent geographic trilateration"
              className="px-3 py-1 rounded-full text-xs font-medium bg-slate-950/80 text-slate-300 border border-slate-800 backdrop-blur-md flex items-center space-x-1"
            >
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              <span>{coarseDistance}</span>
            </span>
          </div>

          {/* Profile Name & Pronouns */}
          <div className="absolute bottom-5 left-5 right-5">
            <div className="flex items-baseline space-x-2">
              <h3 className="text-2xl font-black text-white tracking-tight">{candidate.identity.name}</h3>
              <span className="text-base font-semibold text-slate-300">{candidate.identity.age}</span>
              <span className="text-xs font-medium text-slate-400">({candidate.identity.pronouns})</span>
            </div>
            <p className="text-xs text-slate-300 line-clamp-2 mt-1.5 leading-relaxed font-normal">
              {candidate.identity.bio}
            </p>
          </div>
        </div>

        {/* Right Column: Detailed Alignment & Explainability (8 cols) */}
        <div className="lg:col-span-8 p-6 lg:p-7 flex flex-col justify-between">
          <div>
            {/* Header: Harmonic Mutuality + Epistemic Confidence Tag */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
              <div className="flex items-center space-x-3">
                {/* Harmonic Mutuality Badge */}
                <div
                  className={`px-4 py-2 rounded-2xl border flex items-center space-x-2.5 transition-all ${
                    !eligible
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                      : isLowConfidence
                      ? 'bg-slate-800/60 border-slate-700/60 text-slate-300 opacity-75'
                      : mutuality.score! >= 80
                      ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300'
                      : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  }`}
                >
                  <HeartHandshake className="w-5 h-5" />
                  <div>
                    <div className="flex items-baseline space-x-1.5">
                      <span className={`text-xl font-black ${isLowConfidence ? 'font-medium' : ''}`}>
                        {eligible ? `${mutuality.score}%` : 'Ineligible'}
                      </span>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                        {isLowConfidence ? 'Provisional Fit' : 'Mutual Fit'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Subtitle */}
                <span className="text-xs text-slate-400 hidden sm:inline">
                  Harmonic Reciprocal Mean $H(S_{'{AB}'}, S_{'{BA}'})$
                </span>
              </div>

              {/* Epistemic Confidence Tag (with Visual Weight Damper when low) */}
              <div className="flex items-center space-x-2">
                <span
                  className={`text-xs px-3 py-1.5 rounded-xl border font-medium flex items-center space-x-1.5 ${
                    confidence.rating === 'HIGH'
                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                      : confidence.rating === 'MODERATE'
                      ? 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                      : 'bg-amber-500/10 text-amber-300 border-dashed border-amber-500/40 opacity-90'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>{confidence.rating} Confidence ({confidence.score}%)</span>
                </span>
              </div>
            </div>

            {/* Directional Tension Micro-Graph (Solves Asymmetry Dissonance) */}
            {eligible && (
              <div className="mt-4 p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    Your satisfaction with {candidate.identity.name} ($S_{'{You \\to Them}'}$):
                  </span>
                  <span className="font-bold text-slate-200">{compatibility.aToB}%</span>
                </div>
                <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${compatibility.aToB}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-400">
                    {candidate.identity.name}&apos;s satisfaction with you ($S_{'{Them \\to You}'}$):
                  </span>
                  <span
                    className={`font-bold ${
                      mutuality.asymmetric ? 'text-amber-400' : 'text-slate-200'
                    }`}
                  >
                    {compatibility.bToA}%
                  </span>
                </div>
                <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      mutuality.asymmetric ? 'bg-amber-500' : 'bg-indigo-500'
                    }`}
                    style={{ width: `${compatibility.bToA}%` }}
                  />
                </div>
              </div>
            )}

            {/* Asymmetry or Hard Exclusion Alert */}
            {!eligible && (
              <div className="mt-4 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start space-x-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <div>
                  <strong className="block font-semibold">Hard Requirement Exclusion</strong>
                  <span>{hardConflicts[0]?.message}</span>
                </div>
              </div>
            )}

            {eligible && mutuality.asymmetric && (
              <div className="mt-3 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start space-x-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                <div>
                  <strong className="block font-semibold">Asymmetric Interest Identified</strong>
                  <span>
                    One-sided compatibility gap of {mutuality.gap}%. Harmonic mutuality balances both requirements to prevent unreciprocated dynamics.
                  </span>
                </div>
              </div>
            )}

            {/* Primary Intent & Relational Structure Pills */}
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-800/90 text-slate-200 border border-slate-700/80">
                🎯 {candidate.intention.primaryIntent}
              </span>
              <span className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-800/90 text-slate-200 border border-slate-700/80 capitalize">
                🤝 {candidate.intention.relationshipStructure}
              </span>
              <span className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-800/90 text-slate-200 border border-slate-700/80 capitalize">
                🥗 {candidate.lifestyle.diet}
              </span>
              <span className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-800/90 text-slate-200 border border-slate-700/80">
                🚭 Non-smoker: {candidate.lifestyle.smoking === 'never' ? 'Yes' : 'No'}
              </span>
            </div>

            {/* Structured Alignment Triad (Synergies, Frictions, Discovery) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
              {/* 1. Strong Alignment (+) */}
              <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-800/30">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-400 mb-2">
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
                    <li className="text-slate-500 italic">No primary synergies noted</li>
                  )}
                </ul>
              </div>

              {/* 2. Potential Friction (-) */}
              <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-800/30">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-400 mb-2">
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

              {/* 3. Areas for Mutual Discovery (?) */}
              <div className="p-3.5 rounded-2xl bg-indigo-950/20 border border-indigo-800/30">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-indigo-400 mb-2">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Mutual Discovery (?)</span>
                </div>
                <ul className="text-xs text-slate-300 space-y-1.5">
                  {explanation.unknownInformation.length > 0 ? (
                    explanation.unknownInformation.map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-1.5">
                        <span className="text-indigo-400 font-bold">?</span>
                        <span className="line-clamp-2">{item}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-slate-400 text-[11px]">Dimensions thoroughly declared</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Why Recommended Rationale Box */}
            <div className="mt-4 p-3.5 rounded-2xl bg-indigo-950/20 border border-indigo-900/30 text-xs text-slate-300 flex items-start space-x-2.5">
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-indigo-300 block font-semibold mb-0.5">Why this recommendation:</strong>
                <span className="leading-relaxed">{explanation.whyRecommended}</span>
              </div>
            </div>
          </div>

          {/* Action Bar with Keyboard Affordances */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-5 mt-5 border-t border-slate-800">
            <button
              onClick={() => onInspectDeepReport(candidate, evaluation)}
              className="px-4 py-2.5 rounded-xl text-xs font-medium text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 transition-all flex items-center space-x-2"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Inspect 12-Dimension Report</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center space-x-2.5">
              <button
                onClick={() => onPass(candidate)}
                className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition-all flex items-center space-x-1.5"
              >
                <UserX className="w-3.5 h-3.5" />
                <span>Respectful Pass</span>
              </button>

              {eligible && (
                <button
                  onClick={() => onInitiateHandshake(candidate)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all flex items-center space-x-2"
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
