// ============================================================================
// src/components/match/tabs/MatchOverviewTab.tsx
// Candidate Overview Tab: Dual-Track Reciprocal Affinity, Alignment Triad & Why Recommended
// ============================================================================

import React from 'react'
import { ShieldCheck, Sparkles } from 'lucide-react'
import type { UniversalUserProfile, MatchEvaluation } from '../../../types'
import { APP_CONFIG } from '../../../config/appConfig'

interface MatchOverviewTabProps {
  candidate: UniversalUserProfile
  evaluation: MatchEvaluation
}

export const MatchOverviewTab: React.FC<MatchOverviewTabProps> = ({
  candidate,
  evaluation,
}) => {
  const { eligible, mutuality, compatibility, explanation, hardConflicts } = evaluation

  return (
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
            Incompatibility is healthy and protective. {APP_CONFIG.brand.name} guarantees 0.00% leakage across non-negotiable boundaries.
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
  )
}
