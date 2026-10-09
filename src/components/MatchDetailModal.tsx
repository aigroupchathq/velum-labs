// ============================================================================
// src/components/MatchDetailModal.tsx
// Universal Compatibility Platform: Mobile Full-Screen Match Detail (Mockup 1B)
// Calm, Human, Reciprocal Connection Deep Dive
// ============================================================================

import React, { useState } from 'react'
import {
  ArrowLeft,
  Check,
  MapPin,
  Sparkles,
  Heart,
  X,
  ShieldCheck,
} from 'lucide-react'
import type { UniversalUserProfile, MatchEvaluation } from '../types'
import { sounds } from '../utils/sound'
import { coarsenDistanceKm } from '../utils/matchingEngine'

interface MatchDetailModalProps {
  candidate: UniversalUserProfile | null
  evaluation: MatchEvaluation | null
  currentUser?: UniversalUserProfile
  isOpen: boolean
  onClose: () => void
  onPass: (candidate: UniversalUserProfile) => void
  onConnect: (candidate: UniversalUserProfile) => void
}

type DetailTab = 'overview' | 'compatibility' | 'about' | 'photos'

export const MatchDetailModal: React.FC<MatchDetailModalProps> = ({
  candidate,
  evaluation,
  isOpen,
  onClose,
  onPass,
  onConnect,
}) => {
  const [activeTab, setActiveTab] = useState<DetailTab>('overview')

  if (!isOpen || !candidate || !evaluation) return null

  const {
    mutuality,
    relationshipAlignment,
    lifestyleAlignment,
    valueAlignment,
    communicationAlignment,
    geographicFeasibility,
  } = evaluation

  const photos =
    candidate.identity.photos && candidate.identity.photos.length > 0
      ? candidate.identity.photos
      : ['https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80']

  const rawDistKm = parseFloat(geographicFeasibility.summary.split(' ')[0]) || 2
  const coarseDistance = coarsenDistanceKm(rawDistKm)

  const matchPercentage = mutuality.score || 96

  // Key highlight points matching Mockup 1B
  const alignmentHighlights = [
    { text: 'Similar long-term direction', color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
    { text: 'Compatible daily rhythm', color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
    { text: 'Shared interest in art and culture', color: 'text-[#F472B6]', bg: 'bg-[#F472B6]/15' },
    { text: 'No known boundary conflicts', color: 'text-purple-400', bg: 'bg-purple-500/15' },
  ]

  const handleTabClick = (tab: DetailTab) => {
    sounds.playTap()
    setActiveTab(tab)
  }

  const handlePass = () => {
    sounds.playNope()
    onPass(candidate)
    onClose()
  }

  const handleConnect = () => {
    sounds.playLike()
    onConnect(candidate)
    onClose()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${candidate.identity.name} Match Detail`}
      className="fixed inset-0 z-50 flex flex-col bg-[#0F0E11] text-[#F7F5F8] overflow-hidden animate-in fade-in duration-200"
    >
      {/* Top Floating Navigation Header */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 pt-3 pb-2 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
        <button
          type="button"
          onClick={() => {
            sounds.playTap()
            onClose()
          }}
          className="w-10 h-10 rounded-full bg-black/60 border border-white/15 backdrop-blur-xl flex items-center justify-center text-white active:scale-95 transition cursor-pointer"
          aria-label="Back to feed"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Top Right Match Badge (Soft Pink Pill) */}
        <div className="px-3 py-1 rounded-full bg-[#F472B6] text-white text-xs font-semibold flex items-center space-x-1.5 shadow-lg shadow-[#F472B6]/25">
          <Check className="w-3.5 h-3.5 stroke-[3]" />
          <span>{matchPercentage}% Match</span>
        </div>
      </div>

      {/* Scrollable Container */}
      <div className="flex-1 overflow-y-auto pb-28">
        {/* Hero Photo Section */}
        <div className="relative w-full h-[380px] sm:h-[420px] bg-[#17161A] overflow-hidden">
          <img
            src={photos[0]}
            alt={candidate.identity.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F0E11] via-[#0F0E11]/30 to-transparent" />

          {/* Candidate Name & Location Badge on Hero */}
          <div className="absolute bottom-4 left-4 right-4 z-10 space-y-1">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold tracking-tight text-white">
                {candidate.identity.name}, {candidate.identity.age}
              </h1>
              {candidate.identity.verified && (
                <ShieldCheck className="w-5 h-5 text-[#F472B6] fill-[#F472B6]/20 stroke-[2]" />
              )}
            </div>
            <div className="flex items-center space-x-2 text-xs text-neutral-300">
              <MapPin className="w-3.5 h-3.5 text-neutral-400" />
              <span>{coarseDistance} • London</span>
            </div>
          </div>
        </div>

        {/* Tab Pills Bar */}
        <div className="px-4 py-2 border-b border-white/[0.06] bg-[#0F0E11] sticky top-0 z-10">
          <div className="grid grid-cols-4 p-1 rounded-2xl bg-[#17161A] border border-white/[0.06]">
            <button
              type="button"
              onClick={() => handleTabClick('overview')}
              className={`py-2 rounded-xl text-xs font-medium transition cursor-pointer text-center ${
                activeTab === 'overview'
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => handleTabClick('compatibility')}
              className={`py-2 rounded-xl text-xs font-medium transition cursor-pointer text-center ${
                activeTab === 'compatibility'
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Compatibility
            </button>
            <button
              type="button"
              onClick={() => handleTabClick('about')}
              className={`py-2 rounded-xl text-xs font-medium transition cursor-pointer text-center ${
                activeTab === 'about'
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              About
            </button>
            <button
              type="button"
              onClick={() => handleTabClick('photos')}
              className={`py-2 rounded-xl text-xs font-medium transition cursor-pointer text-center ${
                activeTab === 'photos'
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Photos
            </button>
          </div>
        </div>

        {/* Main Tab Content */}
        <div className="p-4 space-y-4">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Highlight Checklist Card (Mockup 1B) */}
              <div className="p-4 rounded-3xl bg-[#17161A] border border-white/[0.08] space-y-3">
                <h3 className="text-sm font-semibold text-white tracking-tight">
                  Why this connection stands out
                </h3>
                <div className="space-y-2.5">
                  {alignmentHighlights.map((hl, idx) => (
                    <div key={idx} className="flex items-center space-x-3">
                      <div className={`w-5 h-5 rounded-full ${hl.bg} flex items-center justify-center shrink-0`}>
                        <Check className={`w-3.5 h-3.5 ${hl.color} stroke-[3]`} />
                      </div>
                      <span className="text-xs text-neutral-200 font-normal">{hl.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bio & Intent */}
              <div className="p-4 rounded-3xl bg-[#17161A] border border-white/[0.08] space-y-2.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                  Relationship Intention
                </span>
                <p className="text-xs text-white leading-relaxed font-light">
                  Seeking <strong className="font-semibold text-[#F472B6]">{candidate.intention.relationshipStructure}</strong> partnership with mutual domestic care.
                </p>
                <div className="pt-2 border-t border-white/[0.06] flex flex-wrap gap-1.5">
                  <span className="px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-[11px] text-neutral-300">
                    🥗 {candidate.lifestyle.diet}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-[11px] text-neutral-300">
                    {candidate.accessibility?.sleepChronotype === 'night_owl' ? '🌙 Night owl rhythm' : '☀️ Morning rhythm'}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-[11px] text-neutral-300">
                    💬 {candidate.communication.conflictStyle.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Thoughtful Spark Question */}
              <div className="p-4 rounded-3xl bg-[#F472B6]/10 border border-[#F472B6]/20 space-y-2">
                <div className="flex items-center space-x-1.5 text-xs font-semibold text-[#F472B6]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>A Great First Question</span>
                </div>
                <p className="text-xs text-neutral-200 italic leading-relaxed">
                  &ldquo;What does a relaxing weekend morning look like when you want to truly disconnect and recharge?&rdquo;
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: COMPATIBILITY */}
          {activeTab === 'compatibility' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-4 rounded-3xl bg-[#17161A] border border-white/[0.08] space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                  <span className="text-xs font-semibold text-white">Mutual Reciprocity</span>
                  <span className="text-xs font-mono font-bold text-[#F472B6]">{mutuality.score}% Fit</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between text-neutral-400 mb-1">
                      <span>Long-term relationship direction</span>
                      <span className="font-mono text-white">{relationshipAlignment.score}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/[0.08] rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${relationshipAlignment.score}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-neutral-400 mb-1">
                      <span>Daily lifestyle & routines</span>
                      <span className="font-mono text-white">{lifestyleAlignment.score}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/[0.08] rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${lifestyleAlignment.score}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-neutral-400 mb-1">
                      <span>Communication rhythms</span>
                      <span className="font-mono text-white">{communicationAlignment.score}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/[0.08] rounded-full overflow-hidden">
                      <div className="h-full bg-[#F472B6] rounded-full" style={{ width: `${communicationAlignment.score}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-neutral-400 mb-1">
                      <span>Core values & worldview</span>
                      <span className="font-mono text-white">{valueAlignment.score}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/[0.08] rounded-full overflow-hidden">
                      <div className="h-full bg-purple-400 rounded-full" style={{ width: `${valueAlignment.score}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-[11px] text-neutral-400 flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero pay-to-win boost applied. Fully evaluated against hard boundaries and mutual preferences.</span>
              </div>
            </div>
          )}

          {/* TAB 3: ABOUT */}
          {activeTab === 'about' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-4 rounded-3xl bg-[#17161A] border border-white/[0.08] space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">Bio</span>
                <p className="text-xs text-neutral-200 leading-relaxed font-light">
                  {candidate.identity.bio}
                </p>
              </div>

              <div className="p-4 rounded-3xl bg-[#17161A] border border-white/[0.08] space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">Values & Interests</span>
                <div className="flex flex-wrap gap-1.5">
                  {candidate.values.coreValues.map((v, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/10 text-[11px] text-neutral-200">
                      {v}
                    </span>
                  ))}
                  <span className="px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/10 text-[11px] text-neutral-200">
                    Art & Galleries
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/10 text-[11px] text-neutral-200">
                    Quiet Cafés
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/10 text-[11px] text-neutral-200">
                    Travel
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-3xl bg-[#17161A] border border-white/[0.08] space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">Languages</span>
                <div className="flex flex-wrap gap-1.5">
                  {candidate.identity.languages.map((l, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/10 text-[11px] text-neutral-300">
                      {l.name} ({l.proficiency})
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PHOTOS */}
          {activeTab === 'photos' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="grid grid-cols-2 gap-2">
                {photos.map((p, idx) => (
                  <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden bg-neutral-900 border border-white/[0.08]">
                    <img src={p} alt={`Candidate photo ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Actions Bar (Mockup 1B) */}
      <div className="fixed bottom-0 left-0 right-0 z-30 p-4 bg-[#0F0E11]/95 backdrop-blur-2xl border-t border-white/[0.08] flex items-center gap-3">
        <button
          type="button"
          onClick={handlePass}
          className="flex-1 min-h-[48px] rounded-2xl bg-[#17161A] hover:bg-[#201e24] active:scale-95 border border-white/10 text-neutral-200 font-semibold text-xs transition cursor-pointer flex items-center justify-center space-x-1.5"
        >
          <X className="w-4 h-4 text-neutral-400" />
          <span>Pass</span>
        </button>

        <button
          type="button"
          onClick={handleConnect}
          className="flex-1 min-h-[48px] rounded-2xl bg-[#F472B6] hover:bg-[#f25da8] active:scale-95 text-white font-bold text-xs transition cursor-pointer shadow-lg shadow-[#F472B6]/25 flex items-center justify-center space-x-1.5"
        >
          <Heart className="w-4 h-4 fill-white stroke-white" />
          <span>Connect</span>
        </button>
      </div>
    </div>
  )
}
