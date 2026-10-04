// Universal Compatibility Platform: Navigation Bar
import React from 'react'
import {
  Compass,
  Sliders,
  AlertTriangle,
  Binary,
  Layers,
  Sparkles,
  ShieldCheck,
} from 'lucide-react'
import type { UniversalUserProfile } from '../types'

export type ActiveView = 'recs' | 'onboarding' | 'optimizer' | 'contradictions' | 'evaluator'

interface NavbarProps {
  activeView: ActiveView
  onSelectView: (view: ActiveView) => void
  currentUser: UniversalUserProfile
  contradictionCount: number
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  onSelectView,
  currentUser,
  contradictionCount,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Mission Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectView('recs')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-white tracking-tight">UNIVERSAL</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Reciprocal Engine
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Mutual Compatibility • Non-Gamified • Explainable
              </p>
            </div>
          </div>

          {/* Navigation Views */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => onSelectView('recs')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeView === 'recs'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Recommendations</span>
            </button>

            <button
              onClick={() => onSelectView('onboarding')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeView === 'onboarding'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span className="hidden md:inline">Progressive Profile</span>
              <span className="md:hidden">Profile</span>
            </button>

            <button
              onClick={() => onSelectView('optimizer')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeView === 'optimizer'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span className="hidden md:inline">Preference Optimizer</span>
              <span className="md:hidden">Optimize</span>
            </button>

            <button
              onClick={() => onSelectView('contradictions')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all relative ${
                activeView === 'contradictions'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span className="hidden lg:inline">Contradictions</span>
              {contradictionCount > 0 && (
                <span className="bg-amber-500 text-slate-950 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {contradictionCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onSelectView('evaluator')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeView === 'evaluator'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Binary className="w-4 h-4" />
              <span className="hidden lg:inline">Pair Evaluator</span>
            </button>
          </nav>

          {/* User Profile Pill */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex flex-col text-right">
              <div className="flex items-center justify-end space-x-1.5">
                <span className="text-xs font-semibold text-white">{currentUser.identity.name}</span>
                {currentUser.identity.verified && (
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                )}
              </div>
              <span className="text-[10px] text-slate-400">
                {currentUser.lifestyle.diet} • {currentUser.intention.relationshipStructure}
              </span>
            </div>
            <img
              src={currentUser.identity.photos[0]}
              alt={currentUser.identity.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/30"
            />
          </div>
        </div>
      </div>
    </header>
  )
}
