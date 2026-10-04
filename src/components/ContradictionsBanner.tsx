// Universal Compatibility Platform: Preference Contradiction Auditor & Banner
// Governing Standard: Master Build Specification §14

import React from 'react'
import { AlertTriangle, Wrench, CheckCircle } from 'lucide-react'
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
      <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-900/30 text-emerald-300 text-xs flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>Preference Invariants Verified: No logical contradictions detected in active constraints.</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {contradictions.map((c) => (
        <div
          key={c.code}
          className="p-4 rounded-2xl bg-amber-950/30 border border-amber-900/50 text-amber-300 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg"
        >
          <div className="flex items-start space-x-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-white font-semibold">
                Preference Contradiction Detected: [{c.code}]
              </strong>
              <p className="text-amber-200/90 mt-0.5">{c.message}</p>
              <p className="text-[11px] text-amber-400/80 mt-1">
                <strong>Suggested Fix:</strong> {c.suggestedFix}
              </p>
            </div>
          </div>

          <button
            onClick={() => onResolve(c.code)}
            className="self-end sm:self-auto px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors flex items-center space-x-1.5 shrink-0"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Apply Resolution</span>
          </button>
        </div>
      ))}
    </div>
  )
}
