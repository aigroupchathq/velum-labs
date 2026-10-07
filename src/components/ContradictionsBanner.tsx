// ============================================================================
// src/components/ContradictionsBanner.tsx
// Universal Compatibility Platform: Apple-Grade Auditor Callout
// ============================================================================

import React from 'react'
import { AlertCircle, Check, ArrowRight } from 'lucide-react'
import type { PreferenceContradiction } from '../types'

interface ContradictionsBannerProps {
  contradictions: PreferenceContradiction[]
  onResolve: (code: string) => void
}

export const ContradictionsBanner: React.FC<ContradictionsBannerProps> = ({
  contradictions,
  onResolve,
}) => {
  if (contradictions.length === 0) {
    return (
      <div className="apple-panel rounded-2xl p-4 text-xs flex items-center justify-between border-white/[0.08]">
        <div className="flex items-center space-x-2.5">
          <div className="w-6 h-6 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
            <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]" />
          </div>
          <span className="text-neutral-300 font-light">
            Invariants Verified • No logical contradictions in current constraints.
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {contradictions.map((c) => (
        <div
          key={c.code}
          className="apple-panel rounded-2xl p-5 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-amber-500/25 bg-amber-500/[0.03]"
        >
          <div className="flex items-start space-x-3">
            <div className="w-7 h-7 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
              <AlertCircle className="w-4 h-4 text-amber-300 stroke-[2]" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-white tracking-tight">Logical Contradiction</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/15 text-amber-300 border border-amber-500/25">
                  {c.code}
                </span>
              </div>
              <p className="text-neutral-300 font-light leading-relaxed">{c.message}</p>
              <p className="text-[11px] text-neutral-400 font-light">
                <strong className="text-neutral-300 font-normal">Suggested Correction:</strong> {c.suggestedFix}
              </p>
            </div>
          </div>

          <button
            onClick={() => onResolve(c.code)}
            className="apple-pill-btn self-end sm:self-auto px-4 py-2 text-xs font-medium text-black bg-white hover:bg-neutral-100 flex items-center space-x-1.5 shrink-0 shadow-sm"
          >
            <span>Resolve</span>
            <ArrowRight className="w-3 h-3 stroke-[2]" />
          </button>
        </div>
      ))}
    </div>
  )
}
