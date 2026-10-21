// ============================================================================
// src/components/account/AccountMoreView.tsx
// Checkmate Account Settings, Labs, Appearance & Membership Navigation
// ============================================================================

import React from 'react'
import {
  ArrowLeft,
  Crown,
  Shield,
  Bell,
  Sun,
  FlaskConical,
  FileText,
  LogOut,
  ChevronRight,
  RotateCcw,
} from 'lucide-react'

interface AccountMoreViewProps {
  onBack: () => void
  onNavigateToMembership: () => void
  onNavigateToSafety: () => void
  onNavigateToNotifications: () => void
  onNavigateToAppearance: () => void
  onNavigateToLabs: () => void
  onOpenLegalTerms: () => void
  onOpenSignOut: () => void
  onResetDemoDefaults?: () => void
}

export const AccountMoreView: React.FC<AccountMoreViewProps> = ({
  onBack,
  onNavigateToMembership,
  onNavigateToSafety,
  onNavigateToNotifications,
  onNavigateToAppearance,
  onNavigateToLabs,
  onOpenLegalTerms,
  onOpenSignOut,
  onResetDemoDefaults,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header with Back Button */}
      <div className="flex items-center space-x-3 pt-2 pb-1">
        <button
          type="button"
          onClick={onBack}
          className="p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.12] text-neutral-300 hover:text-white transition cursor-pointer"
          aria-label="Back to Profile"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">More</h1>
          <p className="text-xs text-neutral-400 font-light">Account preferences, safety &amp; experimental labs</p>
        </div>
      </div>

      {/* List items matching Mockup Screen 4A */}
      <div className="bg-[#17161A] border border-white/[0.08] rounded-3xl divide-y divide-white/[0.06] overflow-hidden shadow-xl">
        {/* Membership */}
        <button
          type="button"
          onClick={onNavigateToMembership}
          className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-white/[0.02] active:bg-white/[0.04] transition cursor-pointer"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
              <Crown className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Membership</h3>
              <p className="text-xs text-neutral-400 font-light">Manage your plan</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono text-[#F472B6] font-semibold">Free Member</span>
            <ChevronRight className="w-4 h-4 text-neutral-500" />
          </div>
        </button>

        {/* Safety Centre */}
        <button
          type="button"
          onClick={onNavigateToSafety}
          className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-white/[0.02] active:bg-white/[0.04] transition cursor-pointer"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Safety Centre</h3>
              <p className="text-xs text-neutral-400 font-light">Verification &amp; reporting</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-500" />
        </button>

        {/* Notifications */}
        <button
          type="button"
          onClick={onNavigateToNotifications}
          className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-white/[0.02] active:bg-white/[0.04] transition cursor-pointer"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Notifications</h3>
              <p className="text-xs text-neutral-400 font-light">Message alerts &amp; discovery</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-500" />
        </button>

        {/* Appearance */}
        <button
          type="button"
          onClick={onNavigateToAppearance}
          className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-white/[0.02] active:bg-white/[0.04] transition cursor-pointer"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0">
              <Sun className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Appearance</h3>
              <p className="text-xs text-neutral-400 font-light">Dark theme active</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-500" />
        </button>

        {/* Labs (Experimental) */}
        <button
          type="button"
          onClick={onNavigateToLabs}
          className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-white/[0.02] active:bg-white/[0.04] transition cursor-pointer"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center shrink-0">
              <FlaskConical className="w-5 h-5 text-[#F472B6]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Labs</h3>
              <p className="text-xs text-neutral-400 font-light">Dynamic Island &amp; Paige AI</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-pink-500/20 text-[#F472B6] border border-pink-500/30 font-bold">
              Beta
            </span>
            <ChevronRight className="w-4 h-4 text-neutral-500" />
          </div>
        </button>

        {/* Restore Demo Defaults */}
        {onResetDemoDefaults && (
          <button
            type="button"
            onClick={onResetDemoDefaults}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-white/[0.02] active:bg-white/[0.04] transition cursor-pointer"
          >
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Reset Demo Defaults</h3>
                <p className="text-xs text-neutral-400 font-light">Restore Elena's baseline profile state</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-500" />
          </button>
        )}

        {/* Legal Terms & Charter */}
        <button
          type="button"
          onClick={onOpenLegalTerms}
          className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-white/[0.02] active:bg-white/[0.04] transition cursor-pointer"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-white/[0.06] border border-white/[0.1] flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-neutral-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Legal</h3>
              <p className="text-xs text-neutral-400 font-light">Terms and privacy charter</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-500" />
        </button>

        {/* Sign Out */}
        <button
          type="button"
          onClick={onOpenSignOut}
          className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-rose-500/[0.05] active:bg-rose-500/[0.1] transition cursor-pointer"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
              <LogOut className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-rose-400">Sign Out</h3>
              <p className="text-xs text-neutral-400 font-light">End session on this device</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-rose-400/50" />
        </button>
      </div>
    </div>
  )
}
