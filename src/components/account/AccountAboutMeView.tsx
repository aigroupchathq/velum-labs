// ============================================================================
// src/components/account/AccountAboutMeView.tsx
// Subview 7: About Me & Identity
// ============================================================================

import React from 'react'
import { ArrowLeft } from 'lucide-react'
import type { UniversalUserProfile } from '../../types'

interface AccountAboutMeViewProps {
  profile: UniversalUserProfile
  onChangeProfile: (updated: UniversalUserProfile) => void
  onSave: () => void
  onBack: () => void
}

export const AccountAboutMeView: React.FC<AccountAboutMeViewProps> = ({
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
            <h1 className="text-2xl font-bold text-white">About Me</h1>
            <p className="text-xs text-neutral-400 font-light">Your story, interests and lifestyle</p>
          </div>
        </div>

        <button
          onClick={onSave}
          className="px-4 py-1.5 rounded-full bg-[#F472B6] hover:bg-pink-400 text-black text-xs font-semibold transition cursor-pointer shadow-md"
        >
          Save
        </button>
      </div>

      <div className="bg-[#17161A] border border-white/[0.08] rounded-3xl p-5 sm:p-6 space-y-5 shadow-xl">
        {/* Display Name & Age */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-neutral-400 font-mono block mb-1">Display Name</label>
            <input
              type="text"
              value={profile.identity.name}
              onChange={(e) =>
                onChangeProfile({
                  ...profile,
                  identity: { ...profile.identity, name: e.target.value },
                })
              }
              className="w-full bg-neutral-950 border border-white/20 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#F472B6]"
            />
          </div>

          <div>
            <label className="text-xs text-neutral-400 font-mono block mb-1">Age</label>
            <input
              type="number"
              value={profile.identity.age}
              onChange={(e) =>
                onChangeProfile({
                  ...profile,
                  identity: { ...profile.identity, age: Number(e.target.value) },
                })
              }
              className="w-full bg-neutral-950 border border-white/20 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#F472B6]"
            />
          </div>
        </div>

        {/* City & Pronouns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-neutral-400 font-mono block mb-1">City Location</label>
            <input
              type="text"
              value={profile.geography.cityName}
              onChange={(e) =>
                onChangeProfile({
                  ...profile,
                  geography: { ...profile.geography, cityName: e.target.value },
                })
              }
              className="w-full bg-neutral-950 border border-white/20 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#F472B6]"
            />
          </div>

          <div>
            <label className="text-xs text-neutral-400 font-mono block mb-1">Pronouns</label>
            <input
              type="text"
              value={profile.identity.pronouns}
              onChange={(e) =>
                onChangeProfile({
                  ...profile,
                  identity: { ...profile.identity, pronouns: e.target.value },
                })
              }
              className="w-full bg-neutral-950 border border-white/20 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#F472B6]"
            />
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="text-xs text-neutral-400 font-mono block mb-1">One-Liner Bio</label>
          <textarea
            rows={3}
            value={profile.identity.bio}
            onChange={(e) =>
              onChangeProfile({
                ...profile,
                identity: { ...profile.identity, bio: e.target.value },
              })
            }
            className="w-full bg-neutral-950 border border-white/20 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#F472B6]"
          />
        </div>

        {/* Interests & Curiosities */}
        <div>
          <label className="text-xs text-neutral-400 font-mono block mb-2">Interests & Curiosities</label>
          <div className="flex flex-wrap gap-2">
            {[
              'Contemporary Art & Galleries',
              'Acoustics & Spatial Sound',
              'Independent Cinema',
              'Slow Travel & Offbeat Cities',
              'Culinary Craft & Wine',
              'Philosophy & Metacognition',
              'Architecture Walks',
              'Reading & Bookstores',
            ].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-xs font-medium bg-neutral-950 border border-white/10 text-neutral-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
