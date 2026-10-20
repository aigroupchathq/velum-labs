// ============================================================================
// src/components/match/tabs/MatchInteriorTab.tsx
// Candidate Interior World, Thoughtful Prompts & Recovery Rhythms
// ============================================================================

import React from 'react'
import { BookOpen } from 'lucide-react'
import type { UniversalUserProfile } from '../../../types'

interface InteriorPromptItem {
  icon: React.ComponentType<{ className?: string }>
  prompt: string
  response: string
}

interface MatchInteriorTabProps {
  candidate: UniversalUserProfile
  interiorPrompts: InteriorPromptItem[]
}

export const MatchInteriorTab: React.FC<MatchInteriorTabProps> = ({
  candidate,
  interiorPrompts,
}) => {
  return (
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
  )
}
