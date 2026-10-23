// ============================================================================
// src/components/account/AccountLabsView.tsx
// Subview: Experimental Labs
// ============================================================================

import React from 'react'
import { ArrowLeft, ArrowRight, Sliders, Compass, ShieldCheck, Sparkles } from 'lucide-react'

interface AccountLabsViewProps {
  onBack: () => void
  onNavigateView?: (view: any) => void
  onNavigateToNetwork?: () => void
}

export const AccountLabsView: React.FC<AccountLabsViewProps> = ({
  onBack,
  onNavigateView,
  onNavigateToNetwork,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center space-x-3 pt-2 pb-1">
        <button
          onClick={onBack}
          className="p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.12] text-neutral-300 hover:text-white transition cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Experimental Labs</h1>
          <p className="text-xs text-neutral-400 font-light">
            Deep mathematical models and algorithmic diagnostics
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {[
          {
            id: 'optimizer',
            title: 'Preference Optimizer (Pareto Curve)',
            desc: 'Simulate relaxing rigid preferences to unlock balanced reciprocal candidate pools.',
            icon: <Sliders className="w-5 h-5 text-purple-400" />,
            action: () => onNavigateView && onNavigateView('optimizer'),
          },
          {
            id: 'network',
            title: 'The Living Constellation',
            desc: 'Explore the night sky of your connections — where paths cross, daily rhythms align, and values resonate in London.',
            icon: <Compass className="w-5 h-5 text-purple-400" />,
            action: () => (onNavigateToNetwork ? onNavigateToNetwork() : (onNavigateView && onNavigateView('network'))),
          },
          {
            id: 'contradictions',
            title: 'Contradiction Auditor',
            desc: 'Audit your boundaries for mathematical impossibilities (e.g. 5km radius with rare diet).',
            icon: <ShieldCheck className="w-5 h-5 text-amber-400" />,
            action: () => onNavigateView && onNavigateView('contradictions'),
          },
          {
            id: 'evaluator',
            title: 'Pair Evaluator Engine',
            desc: 'Inspect full mathematical vector breakdown for any candidate dyad.',
            icon: <Sparkles className="w-5 h-5 text-[#F472B6]" />,
            action: () => onNavigateView && onNavigateView('evaluator'),
          },
        ].map((tool) => (
          <div
            key={tool.id}
            onClick={tool.action}
            className="p-5 rounded-2xl bg-[#17161A] border border-white/[0.08] hover:border-[#F472B6]/40 transition cursor-pointer flex items-center justify-between space-x-4 shadow-lg"
          >
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shrink-0">
                {tool.icon}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">{tool.title}</h3>
                <p className="text-xs text-neutral-400 font-light mt-0.5">{tool.desc}</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-neutral-500 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  )
}
