// ============================================================================
// src/components/Navbar.tsx
// Universal Compatibility Platform: Apple-Grade Minimalist Navigation
// Sequenced around 2 Mental Spaces: Relational Journey & Algorithmic Science
// ============================================================================

import React, { useState, useRef, useEffect } from 'react'
import {
  Compass,
  Sparkles,
  Sliders,
  AlertCircle,
  Binary,
  CreditCard,
  ShieldCheck,
  BookOpen,
  Coffee,
  MessageSquare,
  ChevronDown,
  Layers,
  Home,
  UserCheck,
  Scale,
} from 'lucide-react'
import type { UniversalUserProfile } from '../types'

export type ActiveView =
  | 'landing'
  | 'intro'
  | 'recs'
  | 'conversations'
  | 'date_brief'
  | 'onboarding'
  | 'optimizer'
  | 'contradictions'
  | 'evaluator'
  | 'subscriptions'
  | 'network'

interface NavbarProps {
  activeView: ActiveView
  onSelectView: (view: ActiveView) => void
  currentUser: UniversalUserProfile
  contradictionCount: number
  onOpenLogin: () => void
  onOpenWingman?: () => void
  onOpenTerms?: () => void
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  onSelectView,
  currentUser,
  contradictionCount,
  onOpenLogin,
  onOpenWingman,
  onOpenTerms,
}) => {
  const [scienceMenuOpen, setScienceMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const scienceDropdownRef = useRef<HTMLDivElement>(null)
  const userDropdownRef = useRef<HTMLDivElement>(null)

  // Primary Relational Journey (Miller's Law compliant: 6 core items)
  const primaryNavItems: { id: ActiveView; label: string; icon: React.ReactNode }[] = [
    { id: 'landing', label: 'Home', icon: <Compass className="w-3.5 h-3.5 stroke-[1.75]" /> },
    { id: 'onboarding', label: 'Sanctuary & Profile', icon: <Home className="w-3.5 h-3.5 stroke-[1.75] text-emerald-400" /> },
    { id: 'recs', label: 'Discover', icon: <Sparkles className="w-3.5 h-3.5 stroke-[1.75] text-rose-400" /> },
    { id: 'network', label: 'Constellation & Odds', icon: <Compass className="w-3.5 h-3.5 stroke-[1.75] text-purple-400" /> },
    { id: 'conversations', label: 'Dialogue', icon: <MessageSquare className="w-3.5 h-3.5 stroke-[1.75] text-sky-400" /> },
    { id: 'date_brief', label: 'Encounter', icon: <Coffee className="w-3.5 h-3.5 stroke-[1.75] text-amber-400" /> },
  ]

  // Algorithmic Science & Laboratory Suite
  const scienceNavItems: {
    id: ActiveView
    label: string
    subtitle: string
    icon: React.ReactNode
    badge?: number
  }[] = [
    {
      id: 'intro',
      label: 'Architecture & Math',
      subtitle: 'The Match Universe & Simplified Formulas',
      icon: <BookOpen className="w-3.5 h-3.5 text-cyan-400" />,
    },
    {
      id: 'optimizer',
      label: 'Pareto Frontier',
      subtitle: 'Multi-Objective Solution Space Explorer',
      icon: <Sliders className="w-3.5 h-3.5 text-emerald-400" />,
    },
    {
      id: 'evaluator',
      label: 'Pair Dyad Matrix',
      subtitle: 'N x N Compatibility Tensor Inspector',
      icon: <Binary className="w-3.5 h-3.5 text-purple-400" />,
    },
    {
      id: 'contradictions',
      label: 'Invariant Auditor',
      subtitle: 'Formal Logic Preference Conflict Detector',
      icon: <AlertCircle className="w-3.5 h-3.5 text-amber-400" />,
      badge: contradictionCount,
    },
    {
      id: 'subscriptions',
      label: 'Zero P2W Ethics',
      subtitle: 'Invariant D-23 Proof & Subscription Tiers',
      icon: <CreditCard className="w-3.5 h-3.5 text-rose-400" />,
    },
  ]

  const isScienceActive = scienceNavItems.some((item) => item.id === activeView)
  const activeScienceItem = scienceNavItems.find((item) => item.id === activeView)

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (scienceDropdownRef.current && !scienceDropdownRef.current.contains(e.target as Node)) {
        setScienceMenuOpen(false)
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-[#070709]/85 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Monogram */}
        <div
          onClick={() => onSelectView('landing')}
          className="flex items-center space-x-3 cursor-pointer group select-none shrink-0"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-b from-emerald-500/30 to-white/5 border border-emerald-500/30 flex items-center justify-center shadow-inner group-hover:border-emerald-400/50 transition-all">
            <span className="text-sm font-bold text-emerald-400 font-mono">✓</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center space-x-1.5">
              <span className="text-sm font-semibold tracking-tight text-white/90 group-hover:text-white transition-colors">
                Check
              </span>
              <span className="text-[10px] font-medium text-emerald-400 tracking-wider uppercase font-mono">
                Verified
              </span>
            </div>
            <span className="text-[10px] text-neutral-500 font-normal hidden sm:inline tracking-tight">
              Human Compatibility
            </span>
          </div>
        </div>

        {/* Primary Desktop Navigation Bar (Slick & Grouped) */}
        <nav className="hidden lg:flex items-center p-1 rounded-full bg-white/[0.04] border border-white/[0.07] backdrop-blur-xl shadow-inner space-x-0.5">
          {/* Relational Journey Pills */}
          {primaryNavItems.map((item) => {
            const isActive = activeView === item.id
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectView(item.id)
                  setScienceMenuOpen(false)
                }}
                className={`apple-pill-btn flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium relative transition-all duration-200 select-none cursor-pointer ${
                  isActive
                    ? 'bg-white/15 text-white shadow-[0_2px_12px_rgba(0,0,0,0.4)] border border-white/15 font-semibold'
                    : 'text-neutral-400 hover:text-white hover:bg-white/[0.05] border border-transparent'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            )
          })}

          {/* Divider */}
          <div className="h-4 w-[1px] bg-white/10 mx-1" />

          {/* Algorithmic Science & Laboratory Dropdown */}
          <div className="relative" ref={scienceDropdownRef}>
            <button
              onClick={() => setScienceMenuOpen(!scienceMenuOpen)}
              className={`apple-pill-btn flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium transition-all duration-200 select-none cursor-pointer ${
                isScienceActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm font-semibold'
                  : 'text-neutral-400 hover:text-white hover:bg-white/[0.05] border border-transparent'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isScienceActive && activeScienceItem ? activeScienceItem.label : 'The Science'}</span>
              {contradictionCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-bold flex items-center justify-center">
                  {contradictionCount}
                </span>
              )}
              <ChevronDown className={`w-3 h-3 transition-transform ${scienceMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Science Dropdown Menu (Apple Glassmorphism) */}
            {scienceMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-72 p-2 rounded-2xl bg-neutral-900/95 border border-white/10 shadow-2xl backdrop-blur-2xl z-50 animate-in fade-in slide-in-from-top-2 space-y-1">
                <div className="px-3 py-1.5 border-b border-white/[0.06] flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                    Algorithmic Laboratory
                  </span>
                  <span className="text-[10px] text-cyan-400 font-mono">v8.3 Deterministic</span>
                </div>

                {scienceNavItems.map((item) => {
                  const isItemActive = activeView === item.id
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectView(item.id)
                        setScienceMenuOpen(false)
                      }}
                      className={`w-full text-left p-2.5 rounded-xl transition flex items-start space-x-2.5 cursor-pointer ${
                        isItemActive
                          ? 'bg-white/10 text-white border border-white/15'
                          : 'hover:bg-white/[0.05] text-neutral-300 hover:text-white'
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">{item.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold truncate">{item.label}</span>
                          {item.badge !== undefined && item.badge > 0 && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono">
                              {item.badge} Alert
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-neutral-500 block truncate">
                          {item.subtitle}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Right Action Capsule: Wingman AI & User Sanctuary Hub */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          {onOpenWingman && (
            <button
              onClick={onOpenWingman}
              className="apple-pill-btn flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold shadow-[0_2px_12px_rgba(255,255,255,0.15)] transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span className="hidden sm:inline">Check AI</span>
            </button>
          )}

          {/* User Profile & Persona Capsule */}
          <div className="relative" ref={userDropdownRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="apple-pill-btn flex items-center space-x-2 pl-3 py-1 pr-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-all cursor-pointer"
            >
              <div className="flex flex-col text-right">
                <div className="flex items-center justify-end space-x-1">
                  <span className="text-xs font-medium text-white/90">{currentUser.identity.name}</span>
                  {currentUser.identity.verified && (
                    <ShieldCheck className="w-3 h-3 text-emerald-400 stroke-[2]" />
                  )}
                </div>
                <span className="text-[9px] text-neutral-500 uppercase tracking-wider font-mono">
                  {currentUser.geography.cityName}
                </span>
              </div>
              <img
                src={currentUser.identity.photos[0]}
                alt={currentUser.identity.name}
                className="w-7 h-7 rounded-full object-cover ring-1 ring-white/20"
              />
            </button>

            {/* User Account Quick Popover */}
            {userMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-64 p-2 rounded-2xl bg-neutral-900/95 border border-white/10 shadow-2xl backdrop-blur-2xl z-50 animate-in fade-in slide-in-from-top-2 space-y-1">
                <div className="px-3 py-2 border-b border-white/[0.06] flex items-center space-x-2.5">
                  <img
                    src={currentUser.identity.photos[0]}
                    alt={currentUser.identity.name}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-white/20"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">{currentUser.identity.name}</span>
                    <span className="text-[10px] text-neutral-400 font-mono block">
                      @{currentUser.identity.name.toLowerCase().replace(/\s+/g, '')}.v
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onSelectView('onboarding')
                    setUserMenuOpen(false)
                  }}
                  className="w-full text-left p-2 rounded-xl text-xs hover:bg-white/[0.08] text-neutral-200 hover:text-white flex items-center space-x-2 transition cursor-pointer"
                >
                  <Home className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Open Sanctuary & Profile Hub</span>
                </button>

                <button
                  onClick={() => {
                    onOpenLogin()
                    setUserMenuOpen(false)
                  }}
                  className="w-full text-left p-2 rounded-xl text-xs hover:bg-white/[0.08] text-neutral-200 hover:text-white flex items-center space-x-2 transition cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5 text-purple-400" />
                  <span>Switch Demo Persona</span>
                </button>

                {onOpenTerms && (
                  <button
                    onClick={() => {
                      onOpenTerms()
                      setUserMenuOpen(false)
                    }}
                    className="w-full text-left p-2 rounded-xl text-xs hover:bg-white/[0.08] text-neutral-400 hover:text-white flex items-center space-x-2 transition cursor-pointer border-t border-white/[0.06] pt-2 mt-1"
                  >
                    <Scale className="w-3.5 h-3.5 text-amber-400" />
                    <span>Terms & Statutory Disclosures</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar (Scrollable chips with grouped badges) */}
      <div className="lg:hidden flex items-center justify-start overflow-x-auto px-4 py-2 border-t border-white/[0.05] bg-[#070709]/95 space-x-1.5 scrollbar-none">
        {primaryNavItems.map((item) => {
          const isActive = activeView === item.id
          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id)}
              className={`apple-pill-btn whitespace-nowrap px-3 py-1 text-xs flex items-center space-x-1.5 rounded-full cursor-pointer ${
                isActive
                  ? 'bg-white/15 text-white border border-white/20 font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          )
        })}

        <div className="h-3 w-[1px] bg-white/10 shrink-0 mx-1" />

        {scienceNavItems.map((item) => {
          const isActive = activeView === item.id
          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id)}
              className={`apple-pill-btn whitespace-nowrap px-3 py-1 text-xs flex items-center space-x-1.5 rounded-full cursor-pointer ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          )
        })}
      </div>
    </header>
  )
}
