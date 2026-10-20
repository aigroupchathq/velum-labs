// ============================================================================
// src/components/match/tabs/MatchRulesTab.tsx
// Airbnb "House Rules" & Sanctuary Boundaries Tab
// ============================================================================

import React from 'react'
import { Home, Check } from 'lucide-react'
import type { UniversalUserProfile } from '../../../types'

interface HouseRuleItem {
  title: string
  rule: string
}

interface MatchRulesTabProps {
  candidate: UniversalUserProfile
  houseRules: HouseRuleItem[]
}

export const MatchRulesTab: React.FC<MatchRulesTabProps> = ({
  candidate,
  houseRules,
}) => {
  return (
    <div className="space-y-3 animate-in fade-in duration-200">
      <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-300">
            <Home className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">
              {candidate.identity.name.split(' ')[0]}&apos;s Sanctuary House Rules
            </h4>
            <p className="text-[10px] text-neutral-400">
              Clear, non-hostile boundaries for emotional and physical safety
            </p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
          4/4 Aligned
        </span>
      </div>

      <div className="space-y-2">
        {houseRules.map((rule, idx) => (
          <div
            key={idx}
            className="p-3 rounded-2xl bg-zinc-950/80 border border-white/[0.06] flex items-start space-x-3"
          >
            <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
              <Check className="w-3 h-3 stroke-[2.5]" />
            </div>
            <div className="space-y-0.5 text-xs">
              <span className="font-semibold text-white block">{rule.title}</span>
              <p className="text-neutral-400 font-light">{rule.rule}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
