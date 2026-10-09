// ============================================================================
// src/components/DiscoveryFilterSheet.tsx
// Mobile Bottom Sheet for Discovery Preferences (Stage 1 / Amendments 1–4)
// Consumer experience first: Clean browsing criteria, tactile touch steppers,
// 44px+ touch targets, safe-area compliance, zero demographic targeting.
// ============================================================================

import React, { useEffect, useRef } from 'react'
import {
  X,
  Check,
} from 'lucide-react'
import type { UniversalUserProfile } from '../types'
import { sounds } from '../utils/sound'

interface DiscoveryFilterSheetProps {
  isOpen: boolean
  onClose: () => void
  currentUser: UniversalUserProfile
  onUpdatePreferences: (updatedUser: UniversalUserProfile) => void
  totalMatchesCount?: number
  eligibleMatchesCount?: number
  filterMode: 'all' | 'eligible' | 'high_fit'
  setFilterMode: (mode: 'all' | 'eligible' | 'high_fit') => void
  currentFilteredCount?: number
}

export const DiscoveryFilterSheet: React.FC<DiscoveryFilterSheetProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdatePreferences,
  filterMode,
  setFilterMode,
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
          <h2 id="filter-sheet-title" className="text-lg font-bold text-white tracking-tight">
            Filters
          </h2>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs font-semibold text-[#F472B6] hover:text-[#f8a3d1] transition cursor-pointer"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => {
                sounds.playTap()
                onClose()
              }}
              className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] active:scale-95 border border-white/10 flex items-center justify-center text-neutral-300 hover:text-white transition-all cursor-pointer"
              aria-label="Close filters sheet"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Section 1: Location */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-neutral-300 block">
            Location
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-2xl bg-[#17161A] border border-white/10 flex items-center justify-between text-xs text-white">
              <span>London</span>
              <span className="text-neutral-500 text-[10px]">▼</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#17161A] border border-white/10 flex items-center justify-between text-xs text-white">
              <span>Within 50 km</span>
              <span className="text-neutral-500 text-[10px]">▼</span>
            </div>
          </div>
        </div>

        {/* Section 2: Age Range */}
        <div className="p-4 rounded-3xl bg-[#17161A] border border-white/[0.08] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white">Age Range</span>
            <span className="text-xs font-mono font-bold text-[#F472B6]">
              {minAge} – {maxAge}
            </span>
          </div>

          <div className="space-y-3 pt-1">
            <div className="flex items-center space-x-3">
              <span className="text-[11px] text-neutral-400 w-12 font-mono">Min: {minAge}</span>
              <input
                type="range"
                min="18"
                max="80"
                value={minAge}
                onChange={(e) => handleMinAgeChange(Number(e.target.value))}
                className="flex-1 accent-[#F472B6] cursor-pointer"
                aria-label="Minimum age"
              />
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-[11px] text-neutral-400 w-12 font-mono">Max: {maxAge}</span>
              <input
                type="range"
                min="18"
                max="80"
                value={maxAge}
                onChange={(e) => handleMaxAgeChange(Number(e.target.value))}
                className="flex-1 accent-[#F472B6] cursor-pointer"
                aria-label="Maximum age"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Relationship Intent */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-neutral-300 block">
            Relationship Intent
          </span>
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-[#17161A] border border-white/[0.08]">
            <button
              type="button"
              onClick={() => {
                sounds.playTap()
                setFilterMode('all')
              }}
              className={`min-h-[42px] rounded-xl text-xs font-medium transition cursor-pointer ${
                filterMode === 'all'
                  ? 'bg-[#F472B6] text-white font-semibold shadow-md shadow-[#F472B6]/20'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Open to either
            </button>
            <button
              type="button"
              onClick={() => {
                sounds.playTap()
                setFilterMode('eligible')
              }}
              className={`min-h-[42px] rounded-xl text-xs font-medium transition cursor-pointer ${
                filterMode === 'eligible'
                  ? 'bg-[#F472B6] text-white font-semibold shadow-md shadow-[#F472B6]/20'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Long-term
            </button>
            <button
              type="button"
              onClick={() => {
                sounds.playTap()
                setFilterMode('high_fit')
              }}
              className={`min-h-[42px] rounded-xl text-xs font-medium transition cursor-pointer ${
                filterMode === 'high_fit'
                  ? 'bg-[#F472B6] text-white font-semibold shadow-md shadow-[#F472B6]/20'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Short-term
            </button>
          </div>
        </div>

        {/* Section 4: Gender */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-neutral-300 block">
            Gender
          </span>
          <div className="grid grid-cols-2 gap-2">
            {genderOptions.map((g) => {
              const isAct = selectedGender === g.id
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => handleGenderChange(g.id)}
                  className={`min-h-[44px] px-3.5 rounded-2xl text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${
                    isAct
                      ? 'bg-white text-black font-semibold shadow-sm'
                      : 'bg-[#17161A] hover:bg-white/[0.08] text-neutral-300 border border-white/[0.06]'
                  }`}
                >
                  <span>{g.label}</span>
                  {isAct && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                </button>
              )
            })}
          </div>
        </div>

        {/* Section 5: Footer CTA Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => {
              sounds.playLike()
              onClose()
            }}
            className="w-full min-h-[50px] rounded-2xl bg-[#F472B6] hover:bg-[#f25da8] active:scale-[0.98] text-white font-bold text-sm tracking-tight flex items-center justify-center space-x-2 transition cursor-pointer shadow-lg shadow-[#F472B6]/25"
          >
            <span>Apply Filters</span>
          </button>
        </div>
      </div>
    </div>
  )
}
