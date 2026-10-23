// ============================================================================
// src/components/MatchCard.tsx
// Checkmate Minimalist iOS Candidate Card
// High-Impact Visuals · Zero Cognitive Bloat · Thumb-Zone Actions
// ============================================================================

import React, { useState } from 'react'
import {
  ShieldCheck,
  Sparkles,
  X,
  Info,
  HeartHandshake,
} from 'lucide-react'
import type { UniversalUserProfile, MatchEvaluation } from '../types'
import { sounds } from '../utils/sound'

interface MatchCardProps {
  candidate: UniversalUserProfile
  evaluation: MatchEvaluation
  onInspectDeepReport: (candidate: UniversalUserProfile, evaluation: MatchEvaluation) => void
  onInitiateHandshake: (candidate: UniversalUserProfile) => void
  onPass: (candidate: UniversalUserProfile) => void
}

export const MatchCard: React.FC<MatchCardProps> = ({
  candidate,
  evaluation,
  onInspectDeepReport,
  onInitiateHandshake,
  onPass,
}) => {
  const { eligible, mutuality } = evaluation
  const [photoIndex, setPhotoIndex] = useState(0)
  const [handshakeSent, setHandshakeSent] = useState(false)

  const topSynergy =
    evaluation.valueAlignment?.synergies?.[0] ||
    evaluation.lifestyleAlignment?.synergies?.[0] ||
    evaluation.preferenceAlignment?.synergies?.[0] ||
    'High mutual alignment across values and relationship vision.'

  const photos =
    candidate.identity.photos && candidate.identity.photos.length > 0
      ? candidate.identity.photos
      : ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80']

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation()
    sounds.playTap()
    setPhotoIndex((prev) => (prev + 1) % photos.length)
  }

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation()
    sounds.playTap()
    setPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length)
  }

  const handleHandshake = (e: React.MouseEvent) => {
    e.stopPropagation()
    sounds.playMatch()
    setHandshakeSent(true)
    onInitiateHandshake(candidate)
  }

  const handlePass = (e: React.MouseEvent) => {
    e.stopPropagation()
    sounds.playTap()
    onPass(candidate)
  }

  // Micro-badges
  const smokingBadge = candidate.lifestyle.smoking === 'never' ? 'Smoke-Free' : 'Social Smoker'
  const dietBadge = candidate.lifestyle.diet
  const intentBadge = candidate.intention.primaryIntent

  return (
    <article
      className="w-full bg-[#141318] border border-white/[0.08] rounded-[32px] overflow-hidden shadow-2xl transition-all duration-300 hover:border-white/[0.14] flex flex-col"
      aria-label={`Match profile for ${candidate.identity.name}`}
    >
      {/* 1. Hero Photo with Overlays (Aspect 4:5) */}
      <div className="relative aspect-[4/4.8] w-full bg-neutral-900 overflow-hidden select-none">
        <img
          src={photos[photoIndex]}
          alt={candidate.identity.name}
          className="w-full h-full object-cover transition-transform duration-500"
        />

        {/* Top Gradient Shadow for Badge Visibility */}
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />

        {/* Bottom Gradient Shadow for Name/Text Visibility */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#141318] via-[#141318]/70 to-transparent pointer-events-none" />

        {/* Dash Indicators (Photo Carousel) */}
        {photos.length > 1 && (
          <div className="absolute top-3 inset-x-4 flex space-x-1.5 z-10">
            {photos.map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-all duration-200 ${
                  i === photoIndex ? 'bg-white shadow' : 'bg-white/30 backdrop-blur-sm'
                }`}
              />
            ))}
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-7 inset-x-4 flex items-center justify-between z-10 pointer-events-none">
          {/* Verified Badge */}
          {candidate.identity.verified ? (
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-emerald-300 text-[11px] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified</span>
            </span>
          ) : (
            <span />
          )}

          {/* Resonance Pill */}
          <span
            className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-mono font-bold shadow-lg backdrop-blur-md border ${
              !eligible
                ? 'bg-rose-950/60 text-rose-300 border-rose-500/40'
                : (mutuality.score || 0) >= 80
                ? 'bg-purple-950/70 text-purple-200 border-purple-500/40 shadow-purple-500/10'
                : 'bg-emerald-950/70 text-emerald-200 border-emerald-500/40'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#F472B6]" />
            <span>{mutuality.score || 96}% Match</span>
          </span>
        </div>

        {/* Tap targets for Photo Carousel */}
        {photos.length > 1 && (
          <>
            <button
              onClick={handlePrevPhoto}
              className="absolute left-0 inset-y-0 w-1/3 z-10 cursor-pointer focus:outline-none"
              aria-label="Previous photo"
            />
            <button
              onClick={handleNextPhoto}
              className="absolute right-0 inset-y-0 w-1/3 z-10 cursor-pointer focus:outline-none"
              aria-label="Next photo"
            />
          </>
        )}

        {/* Bottom Hero Info inside Image */}
        <div className="absolute bottom-3 inset-x-4 z-10 space-y-0.5">
          <div className="flex items-baseline space-x-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {candidate.identity.name}
            </h2>
            <span className="text-xl text-neutral-300 font-light">
              {candidate.identity.age}
            </span>
          </div>

          <p className="text-xs text-neutral-300 font-medium">
            📍 {candidate.geography.cityName} • {candidate.identity.bio.split('.')[0]}
          </p>
        </div>
      </div>

      {/* 2. Compact Identity Body */}
      <div className="p-4 space-y-3">
        {/* Micro-Pills */}
        <div className="flex flex-wrap gap-1.5 text-[11px] font-medium">
          <span className="px-2.5 py-0.8 rounded-full bg-white/[0.04] border border-white/[0.08] text-neutral-300 capitalize">
            🚭 {smokingBadge}
          </span>
          <span className="px-2.5 py-0.8 rounded-full bg-white/[0.04] border border-white/[0.08] text-neutral-300 capitalize">
            🥗 {dietBadge}
          </span>
          <span className="px-2.5 py-0.8 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300">
            💍 {intentBadge}
          </span>
        </div>

        {/* Highlighted Synergy or Daily Rhythm */}
        <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs space-y-1">
          <div className="flex items-center space-x-1.5 text-[#F472B6] font-semibold text-[11px]">
            <Sparkles className="w-3 h-3" />
            <span>Why you resonate</span>
          </div>
          <p className="text-neutral-300 font-light leading-relaxed text-[11px]">
            {topSynergy}
          </p>
        </div>

        {/* 3. Ergonomic Bottom Action Buttons (Fitts's Law) */}
        <div className="pt-1 flex items-center justify-between gap-3">
          {/* Pass Action */}
          <button
            onClick={handlePass}
            className="w-12 h-12 rounded-full bg-white/[0.04] hover:bg-rose-500/15 active:scale-90 border border-white/[0.1] hover:border-rose-500/40 text-neutral-400 hover:text-rose-400 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-sm shrink-0"
            aria-label={`Pass on ${candidate.identity.name}`}
            title="Respectfully pass"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Handshake Action */}
          <button
            onClick={handleHandshake}
            disabled={handshakeSent}
            className={`flex-1 h-12 rounded-full text-xs font-semibold flex items-center justify-center space-x-2 transition-all duration-200 cursor-pointer shadow-lg active:scale-95 ${
              handshakeSent
                ? 'bg-emerald-600 text-white cursor-default'
                : 'bg-gradient-to-r from-[#F472B6] to-pink-500 hover:from-pink-400 hover:to-pink-500 text-black shadow-pink-500/20 hover:shadow-pink-500/30'
            }`}
            aria-label={`Send Handshake to ${candidate.identity.name}`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>{handshakeSent ? 'Handshake Sent ✓' : 'Request Handshake'}</span>
          </button>

          {/* Dossier Info Action */}
          <button
            onClick={() => onInspectDeepReport(candidate, evaluation)}
            className="w-12 h-12 rounded-full bg-white/[0.04] hover:bg-white/[0.08] active:scale-90 border border-white/[0.1] text-neutral-400 hover:text-white flex items-center justify-center transition-all duration-200 cursor-pointer shadow-sm shrink-0"
            aria-label="Inspect deep compatibility dossier"
            title="Inspect dossier"
          >
            <Info className="w-5 h-5 text-neutral-300" />
          </button>
        </div>
      </div>
    </article>
  )
}
