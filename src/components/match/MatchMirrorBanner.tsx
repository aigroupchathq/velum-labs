// ============================================================================
// src/components/match/MatchMirrorBanner.tsx
// Self-Mirror & Relationship Trap Banner
// ============================================================================

import React from 'react'
import { Compass } from 'lucide-react'
import type { MirrorCheck } from '../../types'

interface MatchMirrorBannerProps {
  mirrorCheck: MirrorCheck
}

export const MatchMirrorBanner: React.FC<MatchMirrorBannerProps> = ({
  mirrorCheck,
}) => {
  const hasTrap = mirrorCheck.hasTrapWarning || mirrorCheck.triggeredTraps.length > 0

  return (
    <div
      className={`rounded-2xl p-3 border transition-all ${
        hasTrap
          ? 'bg-rose-950/30 border-rose-500/30 text-rose-200'
          : 'bg-amber-950/20 border-amber-500/30 text-amber-200'
      }`}
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
