// ============================================================================
// src/components/account/AccountHubView.tsx
// Profile Hub Main Screen (Mockup Screen 4)
// ============================================================================

import React from 'react'
import {
  ShieldCheck,
  Heart,
  Check,
  MapPin,
  Sparkles,
  Compass,
  User,
  Settings,
  Eye,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react'
import type { UniversalUserProfile } from '../../types'
import { sounds } from '../../utils/sound'

export type ProfileMobileSubview =
  | 'hub'
  | 'about_me'
  | 'looking_for'
  | 'boundaries'
  | 'values_lifestyle'
  | 'privacy_location'
  | 'self_mirror'
  | 'preview'
  | 'more'
  | 'safety'
  | 'notifications'
  | 'appearance'
  | 'labs'

interface AccountHubViewProps {
  profile: UniversalUserProfile
  eligibleCandidatesCount: number
  completenessPercent: number
  demoPersonas?: Array<{ id: string; name: string; role: string; profile: UniversalUserProfile }>
  onSwitchPersona?: (user: UniversalUserProfile) => void
  onSetProfile: (profile: UniversalUserProfile) => void
  onSetSubview: (subview: ProfileMobileSubview) => void
  onLaunchFTUX?: () => void
  onToast: (msg: string) => void
}

export const AccountHubView: React.FC<AccountHubViewProps> = ({
  profile,
  eligibleCandidatesCount,
  completenessPercent,
  demoPersonas,
  onSwitchPersona,
  onSetProfile,
  onSetSubview,
  onLaunchFTUX,
  onToast,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header matching Mockup Screen 4 */}
      <div className="flex items-center justify-between pt-2 pb-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          My Profile
        </h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onSetSubview('preview')}
            className="px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.12] text-xs font-medium text-neutral-300 hover:text-white flex items-center space-x-1.5 transition cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-[#F472B6]" />
            <span>Preview</span>
          </button>

          <button
            onClick={() => onSetSubview('more')}
            className="p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.12] text-neutral-300 hover:text-white transition cursor-pointer"
            aria-label="Account Settings & More"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* User Summary Card (Mockup Screen 4 Hero) */}
      <div className="bg-[#17161A] border border-white/[0.08] rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden space-y-5">
        <div className="flex items-center space-x-4">
          <div className="relative shrink-0">
            <img
              src={profile.identity.photos[0]}
              alt={profile.identity.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover ring-2 ring-[#F472B6]/30 shadow-md"
            />
            {profile.identity.verified && (
              <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-emerald-500 ring-2 ring-[#17161A] flex items-center justify-center">
                <Check className="w-3 h-3 text-white stroke-[3]" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h2 className="text-xl sm:text-2xl font-bold text-white truncate">
                {profile.identity.name}
              </h2>
              {profile.identity.verified && (
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-semibold">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified</span>
                </span>
              )}
            </div>

            <p className="text-xs text-neutral-400 mt-0.5">
              {profile.identity.age} years old • 📍 {profile.geography.cityName}
            </p>

            <div className="inline-flex items-center mt-2 px-2.5 py-0.5 rounded-full bg-[#F472B6]/15 border border-[#F472B6]/30 text-[#F472B6] text-[11px] font-medium">
              {profile.intention.primaryIntent}
            </div>
          </div>
        </div>

        {/* Profile Completeness Bar */}
        <div className="pt-2 border-t border-white/[0.06] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-300 font-medium">Profile completeness</span>
            <span className="text-[#F472B6] font-mono font-bold">{completenessPercent}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-neutral-900 overflow-hidden border border-white/[0.04]">
            <div
              className="h-full bg-gradient-to-r from-[#F472B6] to-rose-400 rounded-full transition-all duration-500"
              style={{ width: `${completenessPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-neutral-400 font-light">
            {eligibleCandidatesCount} mutually compatible candidates currently aligned with your standards.
          </p>
        </div>
      </div>

      {/* Persona Switcher for Live Evaluation */}
      {onSwitchPersona && demoPersonas && (
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
          <span className="text-[11px] font-mono text-neutral-500 shrink-0">Persona:</span>
          {demoPersonas.map((dp) => (
            <button
              key={dp.id}
              onClick={() => {
                onSwitchPersona(dp.profile)
                onSetProfile(dp.profile)
                onToast(`Switched active view to ${dp.name} (${dp.role})`)
              }}
              className={`px-2.5 py-1 rounded-full text-xs font-mono cursor-pointer transition shrink-0 ${
                profile.id === dp.id
                  ? 'bg-white/20 text-white font-semibold'
                  : 'bg-white/[0.04] text-neutral-400 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              {dp.name}
            </button>
          ))}
        </div>
      )}

      {/* Navigation List matching Mockup Screen 4 */}
      <div className="bg-[#17161A] border border-white/[0.08] rounded-3xl divide-y divide-white/[0.06] overflow-hidden shadow-xl">
        {/* 1. About Me */}
        <button
          onClick={() => onSetSubview('about_me')}
          className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-white/[0.02] active:bg-white/[0.04] transition cursor-pointer"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center shrink-0">
              <User className="w-5 h-5 text-[#F472B6]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">About Me</h3>
              <p className="text-xs text-neutral-400 font-light">Your story, interests and lifestyle</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-500 shrink-0 ml-2" />
        </button>

        {/* 2. What I'm Looking For */}
        <button
          onClick={() => onSetSubview('looking_for')}
          className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-white/[0.02] active:bg-white/[0.04] transition cursor-pointer"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
              <Heart className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">What I'm Looking For</h3>
              <p className="text-xs text-neutral-400 font-light">Relationship goals and preferences</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-500 shrink-0 ml-2" />
        </button>

        {/* 3. My Boundaries */}
        <button
          onClick={() => onSetSubview('boundaries')}
          className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-white/[0.02] active:bg-white/[0.04] transition cursor-pointer"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">My Boundaries</h3>
              <p className="text-xs text-neutral-400 font-light">Non-negotiables and dealbreakers</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-500 shrink-0 ml-2" />
        </button>

        {/* 4. Values & Lifestyle */}
        <button
          onClick={() => onSetSubview('values_lifestyle')}
          className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-white/[0.02] active:bg-white/[0.04] transition cursor-pointer"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Values & Lifestyle</h3>
              <p className="text-xs text-neutral-400 font-light">Daily life, habits and compatibility</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-500 shrink-0 ml-2" />
        </button>

        {/* 5. Privacy & Location */}
        <button
          onClick={() => onSetSubview('privacy_location')}
          className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-white/[0.02] active:bg-white/[0.04] transition cursor-pointer"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Privacy & Location</h3>
              <p className="text-xs text-neutral-400 font-light">Visibility and privacy controls</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-500 shrink-0 ml-2" />
        </button>

        {/* 6. Relationship Self-Mirror & Decision Engine */}
        <button
          onClick={() => {
            sounds.playTap()
            onSetSubview('self_mirror')
          }}
          className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-white/[0.02] active:bg-white/[0.04] transition cursor-pointer group"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#F472B6]/20 to-purple-600/20 border border-[#F472B6]/30 flex items-center justify-center shrink-0">
              <Compass className="w-5 h-5 text-[#F472B6]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-semibold text-white group-hover:text-[#F472B6] transition">
                  Relationship Self-Mirror
                </h3>
                <span className="px-1.5 py-0.5 rounded-full bg-[#F472B6]/20 border border-[#F472B6]/40 text-[#F472B6] text-[9px] font-mono uppercase tracking-wider font-semibold">
                  Decision Engine
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-light">Known traps, 3-tier boundary triage & blueprint</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-white shrink-0 ml-2 transition" />
        </button>

        {/* 7. More */}
        <button
          onClick={() => onSetSubview('more')}
          className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-white/[0.02] active:bg-white/[0.04] transition cursor-pointer"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-white/[0.06] border border-white/[0.1] flex items-center justify-center shrink-0">
              <SlidersHorizontal className="w-5 h-5 text-neutral-300" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">More</h3>
              <p className="text-xs text-neutral-400 font-light">Membership, safety, settings and more</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-500 shrink-0 ml-2" />
        </button>
      </div>

      {/* Quick Guided Calibration Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/30 to-pink-950/20 border border-purple-500/20 flex items-center justify-between">
        <div>
          <h4 className="text-xs font-semibold text-white">90-Second Guided Calibration</h4>
          <p className="text-[11px] text-neutral-400">Answer 5 core questions to refine your match filter.</p>
        </div>
        <button
          onClick={onLaunchFTUX}
          className="px-3.5 py-1.5 rounded-full bg-[#F472B6] hover:bg-pink-400 text-black font-semibold text-xs transition cursor-pointer"
        >
          Calibrate
        </button>
      </div>
    </div>
  )
}
