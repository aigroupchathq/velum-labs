// ============================================================================
// src/components/DiscoveryFilterSheet.tsx
// Mobile Bottom Sheet for Discovery Preferences (Stage 1 / Amendments 1–4)
// Consumer experience first: Clean browsing criteria, tactile touch steppers,
// 44px+ touch targets, safe-area compliance, zero demographic targeting.
// ============================================================================

import React, { useEffect, useRef } from 'react'
import {
  X,
  SlidersHorizontal,
  RotateCcw,
  Check,
  MapPin,
  Users,
  Calendar,
  Sparkles,
} from 'lucide-react'
import type { UniversalUserProfile } from '../types'
import { sounds } from '../utils/sound'

interface DiscoveryFilterSheetProps {
  isOpen: boolean
  onClose: () => void
  currentUser: UniversalUserProfile
  onUpdatePreferences: (updatedUser: UniversalUserProfile) => void
  totalMatchesCount: number
  eligibleMatchesCount: number
  filterMode: 'all' | 'eligible' | 'high_fit'
  setFilterMode: (mode: 'all' | 'eligible' | 'high_fit') => void
  currentFilteredCount: number
}

export const DiscoveryFilterSheet: React.FC<DiscoveryFilterSheetProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdatePreferences,
  totalMatchesCount,
  eligibleMatchesCount,
  filterMode,
  setFilterMode,
  currentFilteredCount,
}) => {
  const minAge = currentUser.preferences.minAge
  const maxAge = currentUser.preferences.maxAge
  const selectedGender = currentUser.preferences.gendersSought[0] || 'all'

  const sheetRef = useRef<HTMLDivElement>(null)

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        sounds.playTap()
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Prevent background scrolling while bottom sheet is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  const emitPreferences = (newMin: number, newMax: number, newGen: string) => {
    const updatedUser: UniversalUserProfile = {
      ...currentUser,
      preferences: {
        ...currentUser.preferences,
        minAge: newMin,
        maxAge: newMax,
        gendersSought: newGen === 'all' ? ['all'] : [newGen],
      },
    }
    onUpdatePreferences(updatedUser)
  }

  const handleMinAgeChange = (val: number) => {
    const safeMin = Math.min(Math.max(18, val), maxAge)
    emitPreferences(safeMin, maxAge, selectedGender)
  }

  const handleMaxAgeChange = (val: number) => {
    const safeMax = Math.max(Math.min(80, val), minAge)
    emitPreferences(minAge, safeMax, selectedGender)
  }

  const handleGenderChange = (gen: string) => {
    sounds.playTap()
    emitPreferences(minAge, maxAge, gen)
  }

  const handleReset = () => {
    sounds.playTap()
    emitPreferences(18, 80, 'all')
    setFilterMode('all')
  }

  const genderOptions = [
    { id: 'all', label: 'All Genders' },
    { id: 'woman', label: 'Women' },
    { id: 'man', label: 'Men' },
    { id: 'nonbinary', label: 'Non-Binary' },
  ]

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="filter-sheet-title"
      className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden animate-in fade-in duration-200"
    >
      {/* 1. Backdrop Overlay */}
      <div
        onClick={() => {
          sounds.playTap()
          onClose()
        }}
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
      />

      {/* 2. Slide-up Bottom Sheet */}
      <div
        ref={sheetRef}
        className="relative z-10 w-full max-h-[88vh] overflow-y-auto rounded-t-[2rem] bg-neutral-950 border-t border-white/15 p-5 pb-8 shadow-2xl flex flex-col space-y-5 animate-in slide-in-from-bottom duration-300"
        style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom, 2rem))' }}
      >
        {/* Tactile Drag Handle */}
        <div className="w-12 h-1.5 bg-white/25 rounded-full mx-auto -mt-1 mb-1 shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-white/[0.08] border border-white/15 flex items-center justify-center">
              <SlidersHorizontal className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 id="filter-sheet-title" className="text-base font-semibold text-white tracking-tight">
                Discovery Preferences
              </h2>
              <p className="text-[11px] text-neutral-400 font-light">
                Fine-tune age horizon, gender and queue filters
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              sounds.playTap()
              onClose()
            }}
            className="w-11 h-11 rounded-full bg-white/[0.06] hover:bg-white/[0.12] active:scale-95 border border-white/10 flex items-center justify-center text-neutral-300 hover:text-white transition-all cursor-pointer"
            aria-label="Close filters sheet"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section 1: Queue Eligibility Capsule */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-white flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-neutral-400" />
              <span>Queue Status</span>
            </span>
            <span className="text-[11px] font-mono text-neutral-400">
              {eligibleMatchesCount} of {totalMatchesCount} eligible
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
            <button
              type="button"
              onClick={() => {
                sounds.playTap()
                setFilterMode('all')
              }}
              className={`min-h-[44px] rounded-xl text-xs font-medium transition-all ${
                filterMode === 'all'
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              All ({totalMatchesCount})
            </button>
            <button
              type="button"
              onClick={() => {
                sounds.playTap()
                setFilterMode('eligible')
              }}
              className={`min-h-[44px] rounded-xl text-xs font-medium transition-all ${
                filterMode === 'eligible'
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Eligible ({eligibleMatchesCount})
            </button>
            <button
              type="button"
              onClick={() => {
                sounds.playTap()
                setFilterMode('high_fit')
              }}
              className={`min-h-[44px] rounded-xl text-xs font-medium transition-all ${
                filterMode === 'high_fit'
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              High Fit (≥80%)
            </button>
          </div>
        </div>

        {/* Section 2: Age Horizon with Tactile Steppers & Sliders */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-white flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-neutral-400" />
              <span>Age Horizon</span>
            </span>
            <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-white/[0.1] text-white border border-white/15">
              {minAge} – {maxAge} y/o
            </span>
          </div>

          {/* Min Age */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] text-neutral-300 font-medium">
              <span>Minimum Age: <strong className="text-white font-mono">{minAge}</strong></span>
              <span className="text-neutral-500 font-mono text-[10px]">Min 18</span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => handleMinAgeChange(minAge - 1)}
                className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 text-white font-bold text-base flex items-center justify-center shrink-0 cursor-pointer"
                aria-label="Decrease minimum age"
              >
                -
              </button>
              <input
                type="range"
                min="18"
                max="80"
                value={minAge}
                onChange={(e) => handleMinAgeChange(Number(e.target.value))}
                className="flex-1 cursor-pointer"
                aria-label="Minimum age slider"
              />
              <button
                type="button"
                onClick={() => handleMinAgeChange(minAge + 1)}
                className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 text-white font-bold text-base flex items-center justify-center shrink-0 cursor-pointer"
                aria-label="Increase minimum age"
              >
                +
              </button>
            </div>
          </div>

          {/* Max Age */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] text-neutral-300 font-medium">
              <span>Maximum Age: <strong className="text-white font-mono">{maxAge}</strong></span>
              <span className="text-neutral-500 font-mono text-[10px]">Max 80</span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => handleMaxAgeChange(maxAge - 1)}
                className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 text-white font-bold text-base flex items-center justify-center shrink-0 cursor-pointer"
                aria-label="Decrease maximum age"
              >
                -
              </button>
              <input
                type="range"
                min="18"
                max="80"
                value={maxAge}
                onChange={(e) => handleMaxAgeChange(Number(e.target.value))}
                className="flex-1 cursor-pointer"
                aria-label="Maximum age slider"
              />
              <button
                type="button"
                onClick={() => handleMaxAgeChange(maxAge + 1)}
                className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 text-white font-bold text-base flex items-center justify-center shrink-0 cursor-pointer"
                aria-label="Increase maximum age"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Section 3: Gender Alignment */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-white flex items-center space-x-1.5">
              <Users className="w-3.5 h-3.5 text-neutral-400" />
              <span>Gender Alignment</span>
            </span>
            <span className="text-[10px] font-mono text-neutral-400">Reciprocal</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {genderOptions.map((g) => {
              const isAct = selectedGender === g.id
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => handleGenderChange(g.id)}
                  className={`min-h-[44px] px-3 rounded-xl text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${
                    isAct
                      ? 'bg-white text-black font-semibold shadow-sm'
                      : 'bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 border border-white/[0.06]'
                  }`}
                >
                  <span>{g.label}</span>
                  {isAct && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                </button>
              )
            })}
          </div>
        </div>

        {/* Section 4: Coarse Location Notice */}
        <div className="flex items-center space-x-2 text-[11px] text-neutral-400 px-1">
          <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
          <span>Location: Greater London Band (coarse distance protected)</span>
        </div>

        {/* Section 5: Footer Actions */}
        <div className="pt-2 flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="min-h-[48px] px-4 rounded-2xl bg-white/[0.06] hover:bg-white/[0.1] active:scale-95 border border-white/10 text-xs font-medium text-neutral-300 hover:text-white flex items-center justify-center space-x-1.5 transition-all cursor-pointer shrink-0"
            aria-label="Reset all filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playLike()
              onClose()
            }}
            className="flex-1 min-h-[48px] rounded-2xl bg-white hover:bg-neutral-200 active:scale-[0.98] text-black font-semibold text-xs tracking-tight flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg"
          >
            <span>Show {currentFilteredCount} {currentFilteredCount === 1 ? 'Profile' : 'Profiles'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
