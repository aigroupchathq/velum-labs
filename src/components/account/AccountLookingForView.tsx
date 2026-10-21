// ============================================================================
// src/components/account/AccountLookingForView.tsx
// Subview 8: What I'm Looking For (Intentions & Partnership Vision)
// ============================================================================

import React from 'react'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import type { UniversalUserProfile } from '../../types'

interface AccountLookingForViewProps {
  profile: UniversalUserProfile
  partnershipType: string
  cohabitationVision: string
  financePhilosophy: string
  onChangeProfile: (updated: UniversalUserProfile) => void
  onChangePartnershipType: (type: string) => void
  onChangeCohabitationVision: (vision: string) => void
  onChangeFinancePhilosophy: (philosophy: string) => void
  onSave: () => void
  onBack: () => void
}

export const AccountLookingForView: React.FC<AccountLookingForViewProps> = ({
  profile,
  partnershipType,
  cohabitationVision,
  financePhilosophy,
  onChangeProfile,
  onChangePartnershipType,
  onChangeCohabitationVision,
  onChangeFinancePhilosophy,
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
            <h1 className="text-2xl font-bold text-white">What I'm Looking For</h1>
            <p className="text-xs text-neutral-400 font-light">Relationship goals and preferences</p>
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
        {/* Primary Intent */}
        <div className="space-y-2">
          <label className="text-xs text-neutral-400 font-mono block">Primary Relationship Intent</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              'Long-term relationship',
              'Marriage',
              'Companionship',
              'Open to either',
            ].map((intent) => (
              <button
                key={intent}
                onClick={() =>
                  onChangeProfile({
                    ...profile,
                    intention: { ...profile.intention, primaryIntent: intent as any },
                  })
                }
                className={`p-3 rounded-2xl text-xs font-semibold border transition text-center cursor-pointer ${
                  profile.intention.primaryIntent === intent
                    ? 'bg-[#F472B6]/20 text-[#F472B6] border-[#F472B6]/50'
                    : 'bg-neutral-950 text-neutral-400 hover:text-white border-white/[0.06]'
                }`}
              >
                {intent}
              </button>
            ))}
          </div>
        </div>

        {/* Partnership Architecture (From Spec #5) */}
        <div className="space-y-3">
          <label className="text-xs text-neutral-400 font-mono block">
            Partnership Vision (Need #5: The Kind of Partnership I Am Building)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: 'Deep Companionship & Co-Creation',
                title: 'Deep Companionship & Co-Creation',
                desc: 'Shared creative, intellectual, and personal projects. Mutual emotional champions.',
                icon: '🎨',
              },
              {
                id: 'Quiet Domestic Sanctuary',
                title: 'Quiet Domestic Sanctuary',
                desc: 'Restorative home life, slow cooking, gentle rituals, low sensory stimulation.',
                icon: '🏡',
              },
              {
                id: 'Family & Roots Anchor',
                title: 'Family & Roots Anchor',
                desc: 'Committed home-building with shared desire for children and community roots.',
                icon: '👶',
              },
              {
                id: 'Independent Adventurers',
                title: 'Independent Adventurers',
                desc: 'Passionate emotional bond with high individual freedom, travel, and autonomy.',
                icon: '✈️',
              },
            ].map((item) => (
              <div
                key={item.id}
                onClick={() => onChangePartnershipType(item.id)}
                className={`p-4 rounded-2xl border transition cursor-pointer space-y-2 ${
                  partnershipType === item.id
                    ? 'bg-purple-950/40 border-purple-500/60 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                    : 'bg-neutral-950 border-white/[0.06] hover:border-white/15'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{item.icon}</span>
                  <h4 className="text-xs font-bold text-white">{item.title}</h4>
                </div>
                <p className="text-[11px] text-neutral-400 font-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Family & Children Goals */}
        <div className="space-y-2">
          <label className="text-xs text-neutral-400 font-mono block">Family & Children Goals</label>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {(['definitely_yes', 'unsure', 'definitely_not'] as const).map((fc) => (
              <button
                key={fc}
                onClick={() =>
                  onChangeProfile({
                    ...profile,
                    family: { ...profile.family, wantsChildren: fc },
                  })
                }
                className={`p-2.5 rounded-xl border text-center capitalize cursor-pointer transition ${
                  profile.family.wantsChildren === fc
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-semibold'
                    : 'bg-neutral-950 text-neutral-400 hover:text-white border-white/[0.06]'
                }`}
              >
                {fc.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Cohabitation Vision */}
        <div className="space-y-2">
          <label className="text-xs text-neutral-400 font-mono block">Cohabitation Preference</label>
          <div className="space-y-2 text-xs">
            {[
              'Shared home with dedicated quiet nooks',
              'Full full-time cohabitation in shared space',
              'Living in close proximity (separate homes)',
            ].map((opt) => (
              <div
                key={opt}
                onClick={() => onChangeCohabitationVision(opt)}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                  cohabitationVision === opt
                    ? 'bg-purple-950/30 border-purple-500/50 text-white'
                    : 'bg-neutral-950 border-white/[0.06] text-neutral-400 hover:text-white'
                }`}
              >
                <span className="font-light">{opt}</span>
                {cohabitationVision === opt && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
              </div>
            ))}
          </div>
        </div>

        {/* Financial Philosophy (Spec #5) */}
        <div className="space-y-2">
          <label className="text-xs text-neutral-400 font-mono block">Financial Philosophy &amp; Transparency</label>
          <div className="space-y-2 text-xs">
            {[
              'Proportional shared pool with open transparency',
              'Equal 50/50 split on household expenses',
              'Completely independent financial streams',
            ].map((opt) => (
              <div
                key={opt}
                onClick={() => onChangeFinancePhilosophy(opt)}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                  financePhilosophy === opt
                    ? 'bg-emerald-950/30 border-emerald-500/50 text-white'
                    : 'bg-neutral-950 border-white/[0.06] text-neutral-400 hover:text-white'
                }`}
              >
                <span className="font-light">{opt}</span>
                {financePhilosophy === opt && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
