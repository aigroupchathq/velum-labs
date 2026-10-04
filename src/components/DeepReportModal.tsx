// Universal Compatibility Platform: Deep 12-Dimension Report Modal
// Governing Standard: Master Build Specification §7, §11, §15

import React from 'react'
import {
  X,
  ShieldCheck,
  HeartHandshake,
  CheckCircle2,
  AlertCircle,
  Activity,
  Scale,
  MessageSquare,
  Clock,
  MapPin,
  Flame,
  Home,
} from 'lucide-react'
import type { UniversalUserProfile, MatchEvaluation } from '../types'

interface DeepReportModalProps {
  candidate: UniversalUserProfile | null
  evaluation: MatchEvaluation | null
  currentUser: UniversalUserProfile
  onClose: () => void
}

export const DeepReportModal: React.FC<DeepReportModalProps> = ({
  candidate,
  evaluation,
  currentUser,
  onClose,
}) => {
  if (!candidate || !evaluation) return null

  const {
    eligible,
    mutuality,
    confidence,
    compatibility,
    relationshipAlignment,
    familyAlignment,
    lifestyleAlignment,
    valueAlignment,
    attraction,
    communicationAlignment,
    geographicFeasibility,
    temporalFeasibility,
    hardConflicts,
  } = evaluation

  const dimensions = [
    { dim: relationshipAlignment, icon: HeartHandshake, color: 'text-indigo-400' },
    { dim: familyAlignment, icon: Home, color: 'text-purple-400' },
    { dim: lifestyleAlignment, icon: Activity, color: 'text-emerald-400' },
    { dim: valueAlignment, icon: Scale, color: 'text-blue-400' },
    { dim: attraction, icon: Flame, color: 'text-pink-400' },
    { dim: communicationAlignment, icon: MessageSquare, color: 'text-teal-400' },
    { dim: geographicFeasibility, icon: MapPin, color: 'text-amber-400' },
    { dim: temporalFeasibility, icon: Clock, color: 'text-cyan-400' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <img
              src={candidate.identity.photos[0]}
              alt={candidate.identity.name}
              className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-500/30"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-white">
                  Dyadic Compatibility Report: {currentUser.identity.name} &amp; {candidate.identity.name}
                </h2>
                {candidate.identity.verified && (
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                )}
              </div>
              <p className="text-xs text-slate-400">
                Deterministic Multi-Dimensional Evaluation • Ruleset v1.0.0
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Executive Mutuality & Confidence Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 rounded-2xl bg-slate-950 border border-slate-800">
            {/* 1. Harmonic Mutuality */}
            <div>
              <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                Harmonic Mutuality
              </span>
              <div className="text-2xl font-black text-white mt-1">
                {eligible ? `${mutuality.score}%` : '0% (Ineligible)'}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Formula: $H = \frac{'{2 \\cdot S_{AB} \\cdot S_{BA}}{S_{AB} + S_{BA}}$'}
              </p>
            </div>

            {/* 2. Directional Balance */}
            <div>
              <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                Directional Balance
              </span>
              <div className="text-sm font-medium text-slate-200 mt-1 space-y-1">
                <div>{currentUser.identity.name} → {candidate.identity.name}: <strong className="text-white">{compatibility.aToB}%</strong></div>
                <div>{candidate.identity.name} → {currentUser.identity.name}: <strong className="text-white">{compatibility.bToA}%</strong></div>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {mutuality.asymmetric ? '⚠️ Asymmetric preference gap' : '✓ Balanced reciprocal satisfaction'}
              </p>
            </div>

            {/* 3. Epistemic Confidence */}
            <div>
              <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                Epistemic Confidence
              </span>
              <div className="text-2xl font-black text-emerald-400 mt-1">
                {confidence.score}% ({confidence.rating})
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {evaluation.explanation.confidenceRationale}
              </p>
            </div>
          </div>

          {/* Hard Conflicts Alert (if any) */}
          {!eligible && hardConflicts.length > 0 && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300">
              <div className="flex items-center space-x-2 font-bold mb-2">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                <span>Eligibility Hard Boundary Violation ({hardConflicts.length})</span>
              </div>
              <ul className="text-xs space-y-1 pl-6 list-disc">
                {hardConflicts.map((c, i) => (
                  <li key={i}>{c.message}</li>
                ))}
              </ul>
            </div>
          )}

          {/* 8 Independent Dimension Cards */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Dimensional Alignment Breakdown (12 Canonical Criteria)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dimensions.map(({ dim, icon: Icon, color }) => (
                <div
                  key={dim.dimensionId}
                  className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                      <div className="flex items-center space-x-2">
                        <Icon className={`w-4 h-4 ${color}`} />
                        <h4 className="text-sm font-bold text-white">{dim.name}</h4>
                      </div>
                      <span className="text-sm font-extrabold text-white">{dim.score}%</span>
                    </div>

                    <p className="text-xs text-slate-400 mt-2">{dim.summary}</p>

                    {/* Synergies */}
                    {dim.synergies.length > 0 && (
                      <div className="mt-3 space-y-1">
                        {dim.synergies.map((s, idx) => (
                          <div key={idx} className="flex items-start space-x-1.5 text-xs text-emerald-400">
                            <CheckCircle2 className="w-3 h-3 shrink-0 mt-0.5" />
                            <span>{s}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Frictions */}
                    {dim.frictions.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {dim.frictions.map((f, idx) => (
                          <div key={idx} className="flex items-start space-x-1.5 text-xs text-amber-400">
                            <AlertCircle className="w-3 h-3 shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Weight Contribution: {dim.knownWeight}/5</span>
                    <span className="uppercase">{dim.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  )
}
