// ============================================================================
// src/components/match/tabs/MatchDecisionTab.tsx
// Decision Support & Skip Small Talk Tab (Attraction vs Life Fit & Essential Topics)
// ============================================================================

import React from 'react'
import { Sparkles, Flame, Compass, ChevronRight, Check } from 'lucide-react'
import type { UniversalUserProfile, MatchEvaluation, MirrorCheck } from '../../../types'
import { APP_CONFIG } from '../../../config/appConfig'

interface DecisionTopicItem {
  icon: React.ComponentType<{ className?: string }>
  title: string
  question: string
  context: string
}

interface MatchDecisionTabProps {
  candidate: UniversalUserProfile
  evaluation: MatchEvaluation
  sparkVsFitVerdict: string
  sparkScore: number
  fitScore: number
  mirrorCheck?: MirrorCheck
  decisionTopics: DecisionTopicItem[]
  onInspectWithPaige: (e?: React.MouseEvent) => void
  onSelectQuestion: (question: string) => void
}

export const MatchDecisionTab: React.FC<MatchDecisionTabProps> = ({
  candidate,
  evaluation,
  sparkVsFitVerdict,
  sparkScore,
  fitScore,
  mirrorCheck,
  decisionTopics,
  onInspectWithPaige,
  onSelectQuestion,
}) => {
  const { eligible, hardConflicts } = evaluation

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-xl bg-amber-500/20 text-amber-300">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">
              Decision Support &amp; Meaningful Topics
            </h4>
            <p className="text-[10px] text-neutral-400">
              Skip weeks of weather chat. Address the 2–3 questions that actually determine your future.
            </p>
          </div>
        </div>
        <span className="text-xs font-mono text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/30 font-semibold">
          Skip Small Talk
        </span>
      </div>

      {/* Chemistry vs Compatibility Lens */}
      <div className="p-4 rounded-2xl bg-zinc-950/80 border border-white/[0.08] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-white">Chemistry vs. Compatibility Lens</span>
          </div>
          <span className="text-[11px] font-mono text-purple-300 font-semibold">
            {sparkVsFitVerdict}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Attraction Spark */}
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-rose-300 font-medium flex items-center space-x-1.5">
                <Flame className="w-3.5 h-3.5" />
                <span>Attraction &amp; Banter Spark</span>
              </span>
              <span className="font-mono font-bold text-rose-300">{sparkScore}%</span>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div className="bg-rose-500 h-full rounded-full" style={{ width: `${sparkScore}%` }} />
            </div>
            <p className="text-[10px] text-neutral-400 font-light">
              Conversational energy, shared wit &amp; mutual fascination.
            </p>
          </div>

          {/* Long-Term Life Feasibility */}
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-emerald-300 font-medium flex items-center space-x-1.5">
                <Compass className="w-3.5 h-3.5" />
                <span>Long-Term Life Feasibility</span>
              </span>
              <span className="font-mono font-bold text-emerald-300">{fitScore}%</span>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${fitScore}%` }} />
            </div>
            <p className="text-[10px] text-neutral-400 font-light">
              Shared future direction, family vision, conflict resilience &amp; values.
            </p>
          </div>
        </div>
      </div>

      {/* Relationship Self-Mirror & Trap Detection */}
      {mirrorCheck && (
        <div className="p-4 rounded-2xl bg-zinc-950/80 border border-white/[0.08] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Compass className="w-4 h-4 text-[#F472B6]" />
              <span className="text-xs font-bold text-white">Relationship Self-Mirror &amp; Trap Check</span>
            </div>
            <button
              type="button"
              onClick={onInspectWithPaige}
              className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-[11px] font-medium text-white flex items-center space-x-1.5 transition cursor-pointer active:scale-95"
            >
              <Sparkles className="w-3 h-3 text-[#F472B6]" />
              <span>Ask Paige</span>
            </button>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
            <p className="text-xs text-neutral-200 leading-relaxed font-light">
              {mirrorCheck.gentleReflection}
            </p>

            {mirrorCheck.triggeredTraps.length > 0 ? (
              <div className="pt-2 border-t border-white/[0.06] space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-rose-300 block font-semibold">
                  Known Pattern Caution:
                </span>
                {mirrorCheck.triggeredTraps.map((tr) => (
                  <div key={tr.id} className="text-xs text-rose-200/90 font-light pl-2.5 border-l-2 border-rose-500/50">
                    <strong className="text-rose-100">{tr.title}:</strong> {tr.proactiveStrategy}
                  </div>
                ))}
              </div>
            ) : (
              <div className="pt-2 border-t border-white/[0.06] flex items-center space-x-1.5 text-xs text-emerald-400">
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Zero acknowledged relationship traps triggered with this candidate.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* The 2-3 Topics Actually Worth Discussing */}
      <div className="space-y-2.5">
        <span className="text-xs font-semibold text-neutral-300 block">
          The 2–3 Conversations That Matter for {candidate.identity.name}:
        </span>

        {decisionTopics.map((topic, idx) => {
          const Icon = topic.icon
          return (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-zinc-950/80 border border-white/[0.06] space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center space-x-2 text-xs font-semibold text-white">
                  <Icon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{topic.title}</span>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectQuestion(topic.question)}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-300 text-[11px] font-medium transition cursor-pointer flex items-center space-x-1 shrink-0"
                >
                  <span>Ask in Handshake</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <p className="text-xs text-neutral-200 font-light italic pl-5">
                &ldquo;{topic.question}&rdquo;
              </p>

              <div className="text-[11px] text-neutral-400 font-light pl-5">
                <span className="text-neutral-500 font-mono">Why this matters:</span> {topic.context}
              </div>
            </div>
          )
        })}
      </div>

      {/* Emotional Investment Verdict & Autonomy */}
      <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-white">Emotional Investment Assessment</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
            {eligible ? 'Safe to Explore' : 'Boundary Alert'}
          </span>
        </div>
        <p className="text-neutral-300 font-light leading-relaxed">
          {eligible
            ? `You and ${candidate.identity.name} share verified non-negotiable boundaries. The potential friction lies in minor daily rhythm or transit commute. Investing emotional energy in a first conversation is structurally sound.`
            : `A declared boundary mismatch exists (${hardConflicts[0]?.message || 'conflict'}). ${APP_CONFIG.brand.name} will not pressure you to compromise your boundaries.`}
        </p>
        <div className="pt-1.5 border-t border-white/[0.06] text-[11px] text-neutral-400 italic">
          {APP_CONFIG.brand.name} provides transparent information; your intuition and conversation make the decision.
        </div>
      </div>
    </div>
  )
}
