// ============================================================================
// src/components/account/AccountPreviewView.tsx
// Subview: Profile Preview
// ============================================================================

import React from 'react'
import { ArrowLeft, Sparkles, MessageSquare } from 'lucide-react'
import type { UniversalUserProfile } from '../../types'

interface AccountPreviewViewProps {
  profile: UniversalUserProfile
  onBack: () => void
  onNavigateToDiscover?: () => void
  onNavigateToDialogue?: () => void
  onNavigateView?: (view: any) => void
}

export const AccountPreviewView: React.FC<AccountPreviewViewProps> = ({
  profile,
  onBack,
  onNavigateToDiscover,
  onNavigateToDialogue,
  onNavigateView,
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
            <h1 className="text-2xl font-bold text-white">Profile Preview</h1>
            <p className="text-xs text-neutral-400 font-light">This is how other candidates see you in Discover</p>
          </div>
        </div>

        <button
          onClick={onBack}
          className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition cursor-pointer"
        >
          Done
        </button>
      </div>

      {/* Candidate Card Preview */}
      <div className="bg-[#17161A] border border-white/[0.1] rounded-3xl overflow-hidden shadow-2xl space-y-5 pb-6">
        <div className="relative aspect-[4/5] w-full">
          <img
            src={profile.identity.photos[0]}
            alt={profile.identity.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F0E11] via-transparent to-black/30" />

          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-full bg-[#F472B6] text-black font-semibold text-xs shadow-md">
              ✓ Verified Profile
            </span>
          </div>

          <div className="absolute bottom-4 left-4 right-4 space-y-1">
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-bold text-white">{profile.identity.name}</h2>
              <span className="text-xl text-neutral-300 font-light">{profile.identity.age}</span>
            </div>
            <p className="text-xs text-neutral-300">
              📍 {profile.geography.cityName} • {profile.identity.pronouns}
            </p>
          </div>
        </div>

        <div className="px-5 space-y-4">
          <p className="text-xs text-neutral-200 font-light italic">
            "{profile.identity.bio}"
          </p>

          <div className="pt-3 border-t border-white/[0.06] space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block">
              Looking For
            </span>
            <span className="inline-block px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-medium">
              {profile.intention.primaryIntent}
            </span>
          </div>

          <div className="pt-3 border-t border-white/[0.06] space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block">
              Core Life Anchors
            </span>
            <div className="flex flex-wrap gap-1.5">
              {profile.values.coreValues.map((v) => (
                <span
                  key={v}
                  className="px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-neutral-300 text-xs"
                >
                  {v}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-white/[0.06] space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block">
              House Rules &amp; Boundaries
            </span>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                🚭 {profile.lifestyle.smoking === 'never' ? 'Smoke-Free' : 'Social Smoker'}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 capitalize">
                🥗 {profile.lifestyle.diet}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 capitalize">
                🍷 {profile.lifestyle.alcohol}
              </span>
            </div>
          </div>

          {/* Quick Actions from Preview */}
          <div className="pt-4 border-t border-white/[0.06] flex items-center space-x-3">
            <button
              onClick={() => {
                if (onNavigateToDiscover) onNavigateToDiscover()
                else if (onNavigateView) onNavigateView('recs')
              }}
              className="flex-1 py-2.5 rounded-full bg-[#F472B6] hover:bg-pink-400 text-black text-xs font-semibold flex items-center justify-center space-x-1.5 transition cursor-pointer shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Discover Candidates</span>
            </button>
            <button
              onClick={() => {
                if (onNavigateToDialogue) onNavigateToDialogue()
                else if (onNavigateView) onNavigateView('conversations')
              }}
              className="flex-1 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center justify-center space-x-1.5 transition cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
              <span>Messages</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
