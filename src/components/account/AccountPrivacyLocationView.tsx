// ============================================================================
// src/components/account/AccountPrivacyLocationView.tsx
// Privacy & Location Subview: Incognito Mode, Anti-Trilateration & Encryption
// ============================================================================

import React from 'react'
import { ArrowLeft, CheckCircle2, Lock } from 'lucide-react'
import type { UniversalUserProfile } from '../../types'

interface AccountPrivacyLocationViewProps {
  profile: UniversalUserProfile
  onUpdatePrivacy: (updater: (prev: UniversalUserProfile) => UniversalUserProfile) => void
  onSave: () => void
  onBack: () => void
}

export const AccountPrivacyLocationView: React.FC<AccountPrivacyLocationViewProps> = ({
  profile,
  onUpdatePrivacy,
  onSave,
  onBack,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between pt-2 pb-1">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.12] text-neutral-300 hover:text-white transition cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Privacy &amp; Location</h1>
            <p className="text-xs text-neutral-400 font-light">Visibility and cryptographic privacy controls</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onSave}
          className="px-4 py-1.5 rounded-full bg-[#F472B6] hover:bg-pink-400 text-black text-xs font-semibold transition cursor-pointer shadow-md"
        >
          Save
        </button>
      </div>

      <div className="bg-[#17161A] border border-white/[0.08] rounded-3xl p-5 sm:p-6 space-y-5 shadow-xl">
        {/* Incognito Discovery Mode */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
          <div className="pr-4">
            <span className="text-xs font-semibold text-white block">Incognito Discovery Mode</span>
            <span className="text-[11px] text-neutral-400 font-light">
              Only profiles you have mutually selected will be able to see your presence.
            </span>
          </div>
          <button
            type="button"
            onClick={() =>
              onUpdatePrivacy((prev) => ({
                ...prev,
                privacy: {
                  ...prev.privacy,
                  incognitoMode: !prev.privacy.incognitoMode,
                },
              }))
            }
            className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
              profile.privacy.incognitoMode ? 'bg-[#F472B6]' : 'bg-neutral-800'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                profile.privacy.incognitoMode ? 'left-7' : 'left-1'
              }`}
            />
          </button>
        </div>

        {/* Location Blur Radius */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
          <div>
            <span className="text-xs font-semibold text-white block">Location Blur Radius</span>
            <span className="text-[11px] text-neutral-400 font-light">
              Randomizes exact coordinates by ±{profile.privacy.fuzzLocationRadiusKm} km to prevent geolocation triangulation.
            </span>
          </div>
          <span className="font-mono text-xs text-[#F472B6] font-bold">
            ±{profile.privacy.fuzzLocationRadiusKm} km
          </span>
        </div>

        {/* Invariant D-23 Verification Badge */}
        <div className="p-4 rounded-2xl bg-neutral-950 border border-white/[0.08] space-y-2 text-xs">
          <div className="flex items-center space-x-2 text-emerald-400 font-semibold font-mono">
            <CheckCircle2 className="w-4 h-4" />
            <span>Invariant D-23 Verified</span>
          </div>
          <p className="text-[11px] text-neutral-400 font-light leading-relaxed">
            Zero pay-to-win ranking. Matching priority is strictly computed from reciprocal compatibility, with zero bidding or paid algorithmic boosts.
          </p>
        </div>

        {/* End-to-End Encryption Badge */}
        <div className="p-4 rounded-2xl bg-neutral-950 border border-white/[0.08] space-y-2 text-xs">
          <div className="flex items-center space-x-2 text-sky-400 font-semibold font-mono">
            <Lock className="w-4 h-4" />
            <span>Field-Level Encryption (AES-256-GCM)</span>
          </div>
          <p className="text-[11px] text-neutral-400 font-light leading-relaxed">
            Sensitive accommodation, family, and health standards are sealed with distinct client keys.
          </p>
        </div>
      </div>
    </div>
  )
}
