// ============================================================================
// src/components/match/MatchTabsCapsule.tsx
// iOS-Style Segmented Navigation Capsule for Candidate Profile Cards
// ============================================================================

import React from 'react'
import {
  Layers,
  Sparkles,
  Music,
  Home,
  BookOpen,
  Award,
} from 'lucide-react'

export type CardTab = 'overview' | 'decision' | 'blend' | 'rules' | 'interior' | 'badges'

interface MatchTabsCapsuleProps {
  activeTab: CardTab
  onTabChange: (tab: CardTab) => void
}

export const MatchTabsCapsule: React.FC<MatchTabsCapsuleProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="inline-flex p-1 bg-zinc-950 rounded-full border border-white/[0.08] text-xs font-medium overflow-x-auto max-w-full no-scrollbar space-x-0.5">
      <button
        type="button"
        onClick={() => onTabChange('overview')}
        className={`px-3 py-1 rounded-full transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
          activeTab === 'overview'
            ? 'bg-zinc-800 text-white shadow-sm font-semibold'
            : 'text-neutral-400 hover:text-white'
        }`}
      >
        <Layers className="w-3 h-3 text-purple-400" />
        <span>Overview</span>
      </button>

      <button
        type="button"
        onClick={() => onTabChange('decision')}
        className={`px-3 py-1 rounded-full transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
          activeTab === 'decision'
            ? 'bg-amber-600 text-white shadow-sm font-semibold'
            : 'text-neutral-400 hover:text-white'
        }`}
      >
        <Sparkles className="w-3 h-3 text-amber-300" />
        <span>Decision Support (Skip Small Talk)</span>
      </button>

      <button
        type="button"
        onClick={() => onTabChange('blend')}
        className={`px-3 py-1 rounded-full transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
          activeTab === 'blend'
            ? 'bg-purple-600 text-white shadow-sm font-semibold'
            : 'text-neutral-400 hover:text-white'
        }`}
      >
        <Music className="w-3 h-3 text-purple-200" />
        <span>Shared Rhythms</span>
      </button>

      <button
        type="button"
        onClick={() => onTabChange('rules')}
        className={`px-3 py-1 rounded-full transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
          activeTab === 'rules'
            ? 'bg-emerald-600 text-white shadow-sm font-semibold'
            : 'text-neutral-400 hover:text-white'
        }`}
      >
        <Home className="w-3 h-3 text-emerald-200" />
        <span>Boundaries &amp; Rules</span>
      </button>

      <button
        type="button"
        onClick={() => onTabChange('interior')}
        className={`px-3 py-1 rounded-full transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
          activeTab === 'interior'
            ? 'bg-indigo-600 text-white shadow-sm font-semibold'
            : 'text-neutral-400 hover:text-white'
        }`}
      >
        <BookOpen className="w-3 h-3 text-indigo-200" />
        <span>Daily Life</span>
      </button>

      <button
        type="button"
        onClick={() => onTabChange('badges')}
        className={`px-3 py-1 rounded-full transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
          activeTab === 'badges'
            ? 'bg-sky-600 text-white shadow-sm font-semibold'
            : 'text-neutral-400 hover:text-white'
        }`}
      >
        <Award className="w-3 h-3 text-sky-200" />
        <span>Milestones</span>
      </button>
    </div>
  )
}
