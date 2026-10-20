// ============================================================================
// src/components/match/tabs/MatchBlendTab.tsx
// Spotify "Blend" Harmonic Taste & Ecological Overlap Tab
// ============================================================================

import React from 'react'
import { Music, Volume2, MessageCircle } from 'lucide-react'
import type { UniversalUserProfile, MatchEvaluation } from '../../../types'

interface BlendTasteItem {
  title: string
  pct: number
  description: string
}

interface MatchBlendTabProps {
  candidate: UniversalUserProfile
  evaluation: MatchEvaluation
  blendTastes: BlendTasteItem[]
  conversationSparks: string[]
  onSelectSpark: (spark: string) => void
}

export const MatchBlendTab: React.FC<MatchBlendTabProps> = ({
  candidate,
  evaluation,
  blendTastes,
  conversationSparks,
  onSelectSpark,
}) => {
  return (
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
          {evaluation.mutuality.score}%
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

      {/* Dyadic Conversation Sparks */}
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
              onClick={() => onSelectSpark(spark)}
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
  )
}
