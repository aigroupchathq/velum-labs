// ============================================================================
// src/components/Navbar.tsx
// Universal Compatibility Platform: Apple-Grade Human-Centered Navigation
// Clean, Human-Friendly Terminology with Effortless Mobile Navigation
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
  HelpCircle,
  MoreHorizontal,
  Smartphone,
  Monitor,
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
  | 'about_faq'

interface NavbarProps {
  activeView: ActiveView
  onSelectView: (view: ActiveView) => void
  currentUser: UniversalUserProfile
  contradictionCount: number
  onOpenLogin: () => void
  onOpenWingman?: () => void
  onOpenTerms?: () => void
  isPhoneMode?: boolean
  onTogglePhoneMode?: () => void
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  onSelectView,
  currentUser,
  contradictionCount,
  onOpenLogin,
  onOpenWingman,
  onOpenTerms,
  isPhoneMode = false,
  onTogglePhoneMode,
}) => {
  const [scienceMenuOpen, setScienceMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false)

  const scienceDropdownRef = useRef<HTMLDivElement>(null)
  const userDropdownRef = useRef<HTMLDivElement>(null)
  const mobileMoreRef = useRef<HTMLDivElement>(null)

  // Primary Human Journey (Everyday Language)
  const primaryNavItems: { id: ActiveView; label: string; icon: React.ReactNode }[] = [
    { id: 'landing', label: 'Home', icon: <Compass className="w-3.5 h-3.5 stroke-[1.75]" /> },
    { id: 'onboarding', label: 'My Profile', icon: <Home className="w-3.5 h-3.5 stroke-[1.75] text-emerald-400" /> },
    { id: 'recs', label: 'Discover Matches', icon: <Sparkles className="w-3.5 h-3.5 stroke-[1.75] text-rose-400" /> },
    { id: 'network', label: 'Match Map', icon: <Compass className="w-3.5 h-3.5 stroke-[1.75] text-purple-400" /> },
    { id: 'conversations', label: 'Messages', icon: <MessageSquare className="w-3.5 h-3.5 stroke-[1.75] text-sky-400" /> },
    { id: 'date_brief', label: 'Date Planner', icon: <Coffee className="w-3.5 h-3.5 stroke-[1.75] text-amber-400" /> },
    { id: 'about_faq', label: 'About & FAQ', icon: <HelpCircle className="w-3.5 h-3.5 stroke-[1.75] text-emerald-400" /> },
  ]

  // Secondary Tools (Simplified Human Subtitles)
  const scienceNavItems: {
    id: ActiveView
    label: string
    subtitle: string
    icon: React.ReactNode
    badge?: number
  }[] = [
    {
      id: 'intro',
      label: 'Platform Principles',
      subtitle: 'How mutual matching and privacy science work',
      icon: <BookOpen className="w-3.5 h-3.5 text-cyan-400" />,
    },
    {
      id: 'optimizer',
      label: 'Standards & Decision Mirror',
      subtitle: 'Understand dealbreakers, flexibility, and dating patterns',
      icon: <Sliders className="w-3.5 h-3.5 text-emerald-400" />,
    },
    {
      id: 'evaluator',
      label: 'Match Comparison',
      subtitle: 'Compare mutual compatibility side-by-side',
      icon: <Binary className="w-3.5 h-3.5 text-purple-400" />,
    },
    {
      id: 'contradictions',
      label: 'Conflict Checker',
      subtitle: 'Detect conflicting or impossible preferences',
      icon: <AlertCircle className="w-3.5 h-3.5 text-amber-400" />,
      badge: contradictionCount,
    },
    {
      id: 'subscriptions',
      label: 'Fair Pricing & Pledge',
      subtitle: 'Zero pay-to-win pledge and supporter plans',
      icon: <CreditCard className="w-3.5 h-3.5 text-rose-400" />,
    },
  ]

  const isScienceActive = scienceNavItems.some((item) => item.id === activeView)
  const activeScienceItem = scienceNavItems.find((item) => item.id === activeView)

  // Close dropdowns on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (scienceDropdownRef.current && !scienceDropdownRef.current.contains(e.target as Node)) {
        setScienceMenuOpen(false)
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
      if (mobileMoreRef.current && !mobileMoreRef.current.contains(e.target as Node)) {
        setMobileMoreOpen(false)
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setScienceMenuOpen(false)
        setUserMenuOpen(false)
        setMobileMoreOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.06] bg-[#070709]/85 backdrop-blur-2xl">
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

        {/* Primary Desktop Navigation Bar (Hidden when Phone Mode active) */}
        <nav className={`hidden ${isPhoneMode ? '' : 'lg:flex'} items-center p-1 rounded-full bg-white/[0.04] border border-white/[0.07] backdrop-blur-xl shadow-inner space-x-0.5`}>
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

          {/* How It Works & Settings Dropdown */}
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
              <span>{isScienceActive && activeScienceItem ? activeScienceItem.label : 'How It Works'}</span>
              {contradictionCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-bold flex items-center justify-center">
                  {contradictionCount}
                </span>
              )}
              <ChevronDown className={`w-3 h-3 transition-transform ${scienceMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Science Dropdown Menu */}
            {scienceMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-72 p-2 rounded-2xl bg-neutral-900/95 border border-white/10 shadow-2xl backdrop-blur-2xl z-50 space-y-1">
                <div className="px-3 py-1.5 border-b border-white/[0.06] flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                    Platform Settings & Tools
                  </span>
                  <span className="text-[10px] text-cyan-400 font-mono">v8.3 Verified</span>
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

        {/* Right Action Capsule */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          {/* Prominent Phone Mode Toggle Button */}
          {onTogglePhoneMode && (
            <button
              type="button"
              onClick={onTogglePhoneMode}
              className={`apple-pill-btn flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm transition-all cursor-pointer border ${
                isPhoneMode
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_12px_rgba(52,211,153,0.3)]'
                  : 'bg-white/10 hover:bg-white/15 text-neutral-300 hover:text-white border-white/20'
              }`}
              title={isPhoneMode ? 'Phone Mode Active - Click for Desktop View' : 'Switch to Phone View'}
              aria-label="Toggle Phone Mode"
            >
              {isPhoneMode ? <Smartphone className="w-3.5 h-3.5 text-emerald-400" /> : <Monitor className="w-3.5 h-3.5 text-neutral-400" />}
              <span className="font-medium">{isPhoneMode ? 'Phone Mode' : 'Phone Mode'}</span>
              <span className={`w-1.5 h-1.5 rounded-full ${isPhoneMode ? 'bg-emerald-400 animate-pulse' : 'bg-neutral-500'}`} />
            </button>
          )}

          {onOpenWingman && !isPhoneMode && (
            <button
              onClick={onOpenWingman}
              className="apple-pill-btn hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>Check AI</span>
            </button>
          )}

          {/* User Profile Popover */}
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

            {userMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-64 p-2 rounded-2xl bg-neutral-900/95 border border-white/10 shadow-2xl backdrop-blur-2xl z-50 space-y-1">
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
                  <span>My Profile & Preferences</span>
                </button>

                <button
                  onClick={() => {
                    onSelectView('about_faq')
                    setUserMenuOpen(false)
                  }}
                  className="w-full text-left p-2 rounded-xl text-xs hover:bg-white/[0.08] text-neutral-200 hover:text-white flex items-center space-x-2 transition cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                  <span>About & FAQ Center</span>
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
                    <span>Terms & Disclosures</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* MOBILE BOTTOM NAVIGATION BAR (Effortless Phone UX)  */}
      {/* ==================================================== */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className={`fixed bottom-0 left-0 right-0 z-50 bg-[#070709]/95 backdrop-blur-2xl border-t border-white/10 flex items-center justify-around pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom,8px))] px-1 text-center shadow-2xl ${
          isPhoneMode ? 'flex' : 'lg:hidden'
        }`}
      >
        {/* Tab 1: Discover */}
        <button
          type="button"
          onClick={() => onSelectView('recs')}
          className={`flex flex-col items-center justify-center min-w-[50px] min-h-[46px] py-1 rounded-xl transition cursor-pointer ${
            activeView === 'recs' ? 'text-rose-400 font-semibold' : 'text-neutral-400 hover:text-neutral-200'
          }`}
          aria-label="Discover Matches"
        >
          <Sparkles className={`w-5 h-5 mb-0.5 ${activeView === 'recs' ? 'text-rose-400' : ''}`} />
          <span className="text-[10px]">Discover</span>
        </button>

        {/* Tab 2: Messages */}
        <button
          type="button"
          onClick={() => onSelectView('conversations')}
          className={`flex flex-col items-center justify-center min-w-[50px] min-h-[46px] py-1 rounded-xl transition cursor-pointer ${
            activeView === 'conversations' ? 'text-sky-400 font-semibold' : 'text-neutral-400 hover:text-neutral-200'
          }`}
          aria-label="Direct Messages"
        >
          <MessageSquare className={`w-5 h-5 mb-0.5 ${activeView === 'conversations' ? 'text-sky-400' : ''}`} />
          <span className="text-[10px]">Messages</span>
        </button>

        {/* Tab 3: Date Plan */}
        <button
          type="button"
          onClick={() => onSelectView('date_brief')}
          className={`flex flex-col items-center justify-center min-w-[50px] min-h-[46px] py-1 rounded-xl transition cursor-pointer ${
            activeView === 'date_brief' ? 'text-amber-400 font-semibold' : 'text-neutral-400 hover:text-neutral-200'
          }`}
          aria-label="Date Planner"
        >
          <Coffee className={`w-5 h-5 mb-0.5 ${activeView === 'date_brief' ? 'text-amber-400' : ''}`} />
          <span className="text-[10px]">Date Plan</span>
        </button>

        {/* Tab 4: Profile */}
        <button
          type="button"
          onClick={() => onSelectView('onboarding')}
          className={`flex flex-col items-center justify-center min-w-[50px] min-h-[46px] py-1 rounded-xl transition cursor-pointer ${
            activeView === 'onboarding' ? 'text-emerald-400 font-semibold' : 'text-neutral-400 hover:text-neutral-200'
          }`}
          aria-label="My Profile & Sanctuary"
        >
          <Home className={`w-5 h-5 mb-0.5 ${activeView === 'onboarding' ? 'text-emerald-400' : ''}`} />
          <span className="text-[10px]">Profile</span>
        </button>

        {/* Tab 5: Pricing (Direct Ethical Pricing) */}
        <button
          type="button"
          onClick={() => onSelectView('subscriptions')}
          className={`flex flex-col items-center justify-center min-w-[50px] min-h-[46px] py-1 rounded-xl transition cursor-pointer ${
            activeView === 'subscriptions' ? 'text-emerald-300 font-semibold' : 'text-neutral-400 hover:text-neutral-200'
          }`}
          aria-label="Fair Pricing & Membership"
        >
          <CreditCard className={`w-5 h-5 mb-0.5 ${activeView === 'subscriptions' ? 'text-emerald-300' : ''}`} />
          <span className="text-[10px]">Pricing</span>
        </button>

        {/* Tab 6: More Sheet Toggle */}
        <div className="relative" ref={mobileMoreRef}>
          <button
            type="button"
            onClick={() => setMobileMoreOpen(!mobileMoreOpen)}
            className={`flex flex-col items-center justify-center min-w-[46px] min-h-[46px] py-1 rounded-xl transition cursor-pointer ${
              isScienceActive || mobileMoreOpen ? 'text-cyan-400 font-semibold' : 'text-neutral-400 hover:text-neutral-200'
            }`}
            aria-label="More Features"
          >
            <MoreHorizontal className={`w-5 h-5 mb-0.5 ${isScienceActive || mobileMoreOpen ? 'text-cyan-400' : ''}`} />
            <span className="text-[10px]">More</span>
          </button>

          {/* Mobile Popover Menu */}
          {mobileMoreOpen && (
            <div className="absolute bottom-full right-0 mb-3 w-64 p-2 rounded-2xl bg-neutral-900/98 border border-white/15 shadow-2xl backdrop-blur-2xl z-50 text-left space-y-1">
              <div className="px-3 py-1.5 border-b border-white/[0.06] text-[10px] font-mono text-neutral-400 uppercase tracking-wider flex items-center justify-between">
                <span>All Check Tools</span>
                <span className="text-emerald-400 font-mono">v8.3</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  onSelectView('landing')
                  setMobileMoreOpen(false)
                }}
                className="w-full p-2 text-xs rounded-xl hover:bg-white/10 text-neutral-200 flex items-center space-x-2 cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5 text-neutral-300" />
                <span>Home Landing Page</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onSelectView('about_faq')
                  setMobileMoreOpen(false)
                }}
                className="w-full p-2 text-xs rounded-xl hover:bg-white/10 text-neutral-200 flex items-center space-x-2 cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>About & FAQ Center</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onSelectView('network')
                  setMobileMoreOpen(false)
                }}
                className="w-full p-2 text-xs rounded-xl hover:bg-white/10 text-neutral-200 flex items-center space-x-2 cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5 text-purple-400" />
                <span>4D Match Map</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onSelectView('intro')
                  setMobileMoreOpen(false)
                }}
                className="w-full p-2 text-xs rounded-xl hover:bg-white/10 text-neutral-200 flex items-center space-x-2 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                <span>Platform Principles</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onSelectView('optimizer')
                  setMobileMoreOpen(false)
                }}
                className="w-full p-2 text-xs rounded-xl hover:bg-white/10 text-neutral-200 flex items-center space-x-2 cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                <span>Preferences & Priorities</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onSelectView('evaluator')
                  setMobileMoreOpen(false)
                }}
                className="w-full p-2 text-xs rounded-xl hover:bg-white/10 text-neutral-200 flex items-center space-x-2 cursor-pointer"
              >
                <Binary className="w-3.5 h-3.5 text-purple-400" />
                <span>Match Comparison</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onSelectView('contradictions')
                  setMobileMoreOpen(false)
                }}
                className="w-full p-2 text-xs rounded-xl hover:bg-white/10 text-neutral-200 flex items-center space-x-2 cursor-pointer"
              >
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                <div className="flex items-center justify-between flex-1">
                  <span>Conflict Checker</span>
                  {contradictionCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-mono">
                      {contradictionCount}
                    </span>
                  )}
                </div>
              </button>
              <button
                type="button"
                onClick={() => {
                  onOpenLogin()
                  setMobileMoreOpen(false)
                }}
                className="w-full p-2 text-xs rounded-xl hover:bg-white/10 text-neutral-200 flex items-center space-x-2 cursor-pointer border-t border-white/[0.06] pt-2"
              >
                <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Switch Demo Persona</span>
              </button>
              {onOpenTerms && (
                <button
                  type="button"
                  onClick={() => {
                    onOpenTerms()
                    setMobileMoreOpen(false)
                  }}
                  className="w-full p-2 text-xs rounded-xl hover:bg-white/10 text-neutral-400 hover:text-white flex items-center space-x-2 cursor-pointer"
                >
                  <Scale className="w-3.5 h-3.5 text-amber-400" />
                  <span>Terms & Disclosures</span>
                </button>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}
