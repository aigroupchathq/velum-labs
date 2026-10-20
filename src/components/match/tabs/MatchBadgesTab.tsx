// ============================================================================
// src/components/match/tabs/MatchBadgesTab.tsx
// Steam-Style Merit Badges & Relationship Readiness Milestones
// ============================================================================

import React from 'react'
import { Award } from 'lucide-react'

interface BadgeItem {
  name: string
  desc: string
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
  color: string
  bg: string
  border: string
}

interface MatchBadgesTabProps {
  badges: BadgeItem[]
}

export const MatchBadgesTab: React.FC<MatchBadgesTabProps> = ({ badges }) => {
  return (
    <div className="space-y-3 animate-in fade-in duration-200">
      <div className="p-3 rounded-2xl bg-sky-950/30 border border-sky-500/30 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-xl bg-sky-500/20 text-sky-300">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">
              Recognized Relational Milestones
            </h4>
            <p className="text-[10px] text-neutral-400">
              Calibrated merits &amp; mutual relationship readiness
            </p>
          </div>
        </div>
        <span className="text-xs font-mono text-sky-300 bg-sky-500/20 px-2 py-0.5 rounded-full border border-sky-500/30 font-bold">
          Tier 3
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {badges.map((b, idx) => {
          const Icon = b.icon
          return (
            <div
              key={idx}
              className={`p-3 rounded-2xl bg-zinc-950/80 border ${b.border} flex items-start space-x-2.5`}
            >
              <div className={`p-1.5 rounded-xl ${b.bg} shrink-0 mt-0.5`}>
                <Icon className="w-3.5 h-3.5" style={{ color: b.color }} />
              </div>
              <div className="space-y-0.5 text-xs">
                <span className="font-semibold text-white block">{b.name}</span>
                <p className="text-neutral-400 text-[11px] leading-tight font-light">
                  {b.desc}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
