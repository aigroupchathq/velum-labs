// ============================================================================
// src/components/account/AccountBoundariesView.tsx
// Subview 9: My Boundaries (Non-negotiables & Dealbreakers)
// ============================================================================

import React from 'react'
import { ArrowLeft } from 'lucide-react'
import type { UniversalUserProfile } from '../../types'

interface AccountBoundariesViewProps {
  profile: UniversalUserProfile
  onChangeProfile: (updated: UniversalUserProfile) => void
  onSave: () => void
  onBack: () => void
}

export const AccountBoundariesView: React.FC<AccountBoundariesViewProps> = ({
  profile,
  onChangeProfile,
  onSave,
  onBack,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between pt-2 pb-1">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.12] text-neutral-300 hover:text-white transition cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">My Boundaries</h1>
            <p className="text-xs text-neutral-400 font-light">Non-negotiables and dealbreakers</p>
          </div>
        </div>

        <button
          onClick={onSave}
          className="px-4 py-1.5 rounded-full bg-[#F472B6] hover:bg-pink-400 text-black text-xs font-semibold transition cursor-pointer shadow-md"
        >
          Save
        </button>
      </div>

      <div className="bg-[#17161A] border border-white/[0.08] rounded-3xl p-5 sm:p-6 space-y-6 shadow-xl">
        {/* Smoking Boundary */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs text-neutral-300 font-medium">Smoking Policy</label>
            <span className="text-[11px] font-mono text-emerald-400 font-semibold">
              {profile.lifestyle.smoking === 'never' ? 'Strictly Smoke-Free' : 'Social Allowed'}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs font-mono">
            {(['never', 'socially', 'regularly'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() =>
                  onChangeProfile({
                    ...profile,
                    lifestyle: { ...profile.lifestyle, smoking: mode },
                    preferences: {
                      ...profile.preferences,
                      smokingPreference: {
                        ...profile.preferences.smokingPreference,
                        dealbreaker: mode === 'never',
                      },
                    },
                  })
                }
                className={`py-2 px-3 rounded-xl border transition cursor-pointer text-center capitalize ${
                  profile.lifestyle.smoking === mode
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold'
                    : 'bg-neutral-950 text-neutral-400 hover:text-white border-white/[0.06]'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Diet Boundary */}
        <div className="space-y-2">
          <label className="text-xs text-neutral-300 font-medium">Dietary Architecture</label>
          <div className="grid grid-cols-4 gap-2 text-xs font-mono">
            {(['vegetarian', 'vegan', 'omnivore', 'pescatarian'] as const).map((diet) => (
              <button
                key={diet}
                onClick={() =>
                  onChangeProfile({
                    ...profile,
                    lifestyle: { ...profile.lifestyle, diet },
                  })
                }
                className={`py-2 px-2 rounded-xl border transition cursor-pointer text-center capitalize text-[11px] ${
                  profile.lifestyle.diet === diet
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold'
                    : 'bg-neutral-950 text-neutral-400 hover:text-white border-white/[0.06]'
                }`}
              >
                {diet}
              </button>
            ))}
          </div>
        </div>

        {/* Alcohol Policy */}
        <div className="space-y-2">
          <label className="text-xs text-neutral-300 font-medium">Alcohol Standard</label>
          <div className="grid grid-cols-4 gap-2 text-xs font-mono">
            {(['sober', 'occasional', 'moderate', 'frequent'] as const).map((alc) => (
              <button
                key={alc}
                onClick={() =>
                  onChangeProfile({
                    ...profile,
                    lifestyle: { ...profile.lifestyle, alcohol: alc },
                  })
                }
                className={`py-2 px-2 rounded-xl border transition cursor-pointer text-center capitalize text-[11px] ${
                  profile.lifestyle.alcohol === alc
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold'
                    : 'bg-neutral-950 text-neutral-400 hover:text-white border-white/[0.06]'
                }`}
              >
                {alc}
              </button>
            ))}
          </div>
        </div>

        {/* Max Transit Radius Slider */}
        <div className="space-y-2.5 pt-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-neutral-300 font-medium">Max Transit &amp; Distance Radius</span>
            <span className="text-[#F472B6] font-mono font-bold">{profile.geography.maxDistanceKm} km</span>
          </div>
          <input
            type="range"
            min={5}
            max={80}
            step={5}
            value={profile.geography.maxDistanceKm}
            onChange={(e) =>
              onChangeProfile({
                ...profile,
                geography: {
                  ...profile.geography,
                  maxDistanceKm: Number(e.target.value),
                },
              })
            }
            className="w-full accent-pink-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
            <span>5 km (Local Metro)</span>
            <span>40 km (Greater London)</span>
            <span>80 km (Commuter Rail)</span>
          </div>
        </div>

        {/* Relationship Structure Boundary */}
        <div className="space-y-2">
          <label className="text-xs text-neutral-300 font-medium">Relationship Structure Non-Negotiable</label>
          <div className="grid grid-cols-3 gap-2 text-xs font-mono">
            {(['monogamous', 'polyamorous', 'flexible'] as const).map((st) => (
              <button
                key={st}
                onClick={() =>
                  onChangeProfile({
                    ...profile,
                    intention: { ...profile.intention, relationshipStructure: st },
                  })
                }
                className={`py-2 px-2 rounded-xl border transition cursor-pointer text-center capitalize text-[11px] ${
                  profile.intention.relationshipStructure === st
                    ? 'bg-[#F472B6]/20 text-[#F472B6] border-[#F472B6]/40 font-semibold'
                    : 'bg-neutral-950 text-neutral-400 hover:text-white border-white/[0.06]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
