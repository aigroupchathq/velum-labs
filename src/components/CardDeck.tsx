import React, { useState, useRef, useEffect, useCallback } from 'react'
import type { Profile, SwipeAction, UserProfile, UserPreferences } from '../types'
import { evaluateMatchCompatibility } from '../utils/matchingEngine'
import { CompatibilityDrawer } from './CompatibilityDrawer'
import {
  RotateCcw,
  X,
  Star,
  Heart,
  Zap,
  Info,
  CheckCircle2,
  MapPin,
  Briefcase,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Scale,
} from 'lucide-react'

interface CardDeckProps {
  profiles: Profile[]
  currentIndex: number
  userProfile: UserProfile
  preferences: UserPreferences
  onSwipe: (action: SwipeAction, profile: Profile) => void
  onRewind: () => void
  canRewind: boolean
  onOpenProfileDetail: (profile: Profile) => void
  onTriggerBoost: () => void
  boostActive: boolean
  onRestartDeck: () => void
}

export const CardDeck: React.FC<CardDeckProps> = ({
  profiles,
  currentIndex,
  userProfile,
  preferences,
  onSwipe,
  onRewind,
  canRewind,
  onOpenProfileDetail,
  onTriggerBoost,
  boostActive,
  onRestartDeck,
}) => {
  const currentProfile = profiles[currentIndex]
  const nextProfile = profiles[currentIndex + 1]

  const [showMatchIntelligence, setShowMatchIntelligence] = useState(false)
  const compatibilityReport = currentProfile
    ? evaluateMatchCompatibility(userProfile, preferences, currentProfile)
    : null

  // Photo carousel index on the current card
  const [photoIndex, setPhotoIndex] = useState(0)

  // Reset photo index when current profile changes
  useEffect(() => {
    setPhotoIndex(0)
  }, [currentIndex])

  // Drag physics state
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [isAnimatingOut, setIsAnimatingOut] = useState<SwipeAction | null>(null)
  const dragStartRef = useRef({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  // Calculate rotation & stamps
  const rotation = (dragOffset.x / 18)
  const likeOpacity = Math.min(Math.max((dragOffset.x - 30) / 90, 0), 1)
  const nopeOpacity = Math.min(Math.max((-dragOffset.x - 30) / 90, 0), 1)
  const superLikeOpacity = Math.min(
    Math.max((-dragOffset.y - 40) / 80, 0) * (Math.abs(dragOffset.x) < 70 ? 1 : 0),
    1
  )

  // Swipe trigger with flying animation
  const handleAction = useCallback(
    (action: SwipeAction) => {
      if (!currentProfile || isAnimatingOut) return
      setIsAnimatingOut(action)

      setTimeout(() => {
        onSwipe(action, currentProfile)
        setDragOffset({ x: 0, y: 0 })
        setIsAnimatingOut(null)
      }, 260)
    },
    [currentProfile, isAnimatingOut, onSwipe]
  )

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        handleAction('nope')
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        handleAction('like')
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        handleAction('superlike')
      } else if (e.key === 'ArrowDown' && currentProfile) {
        e.preventDefault()
        onOpenProfileDetail(currentProfile)
      } else if (e.key === ' ' && currentProfile) {
        e.preventDefault()
        setPhotoIndex((prev) => (prev + 1) % currentProfile.photos.length)
      } else if (e.key === 'Backspace' && canRewind) {
        e.preventDefault()
        onRewind()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentProfile, canRewind, handleAction, onOpenProfileDetail, onRewind])

  // Mouse & Touch drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isAnimatingOut) return
    setIsDragging(true)
    dragStartRef.current = { x: e.clientX, y: e.clientY }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isAnimatingOut) return
    setIsDragging(true)
    dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      const deltaX = e.clientX - dragStartRef.current.x
      const deltaY = e.clientY - dragStartRef.current.y
      setDragOffset({ x: deltaX, y: deltaY })
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return
      const deltaX = e.touches[0].clientX - dragStartRef.current.x
      const deltaY = e.touches[0].clientY - dragStartRef.current.y
      setDragOffset({ x: deltaX, y: deltaY })
    }

    const handleEnd = () => {
      if (!isDragging) return
      setIsDragging(false)

      const swipeThreshold = 110
      if (dragOffset.x > swipeThreshold) {
        handleAction('like')
      } else if (dragOffset.x < -swipeThreshold) {
        handleAction('nope')
      } else if (dragOffset.y < -110 && Math.abs(dragOffset.x) < 70) {
        handleAction('superlike')
      } else {
        // Snap back
        setDragOffset({ x: 0, y: 0 })
      }
    }

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleEnd)
      window.addEventListener('touchmove', handleTouchMove)
      window.addEventListener('touchend', handleEnd)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleEnd)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleEnd)
    }
  }, [isDragging, dragOffset, handleAction])

  // Photo story tap (left 30% / right 70%)
  const handleCardClick = (e: React.MouseEvent) => {
    if (Math.abs(dragOffset.x) > 5 || Math.abs(dragOffset.y) > 5) return
    if (!cardRef.current || !currentProfile) return

    const rect = cardRef.current.getBoundingClientRect()
    const clickX = e.clientX - rect.left

    if (clickX < rect.width * 0.35) {
      // Prev
      setPhotoIndex((prev) => (prev > 0 ? prev - 1 : currentProfile.photos.length - 1))
    } else {
      // Next
      setPhotoIndex((prev) => (prev + 1) % currentProfile.photos.length)
    }
  }

  // Animation transforms
  let cardTransform = `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0) rotate(${rotation}deg)`
  let cardTransition = isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)'

  if (isAnimatingOut === 'like') {
    cardTransform = `translate3d(600px, ${dragOffset.y}px, 0) rotate(25deg)`
    cardTransition = 'transform 0.28s ease-in, opacity 0.28s ease-in'
  } else if (isAnimatingOut === 'nope') {
    cardTransform = `translate3d(-600px, ${dragOffset.y}px, 0) rotate(-25deg)`
    cardTransition = 'transform 0.28s ease-in, opacity 0.28s ease-in'
  } else if (isAnimatingOut === 'superlike') {
    cardTransform = `translate3d(0, -700px, 0) scale(1.05)`
    cardTransition = 'transform 0.28s ease-in, opacity 0.28s ease-in'
  }

  return (
    <div className="relative flex-1 flex flex-col items-center justify-between p-3 md:p-6 overflow-hidden h-[calc(100vh-64px)] md:h-screen max-w-lg mx-auto w-full">
      {/* Keyboard Shortcut Hints (Desktop) */}
      <div className="hidden lg:flex items-center gap-4 text-[11px] font-semibold text-gray-400 dark:text-gray-500 mb-1 select-none">
        <span>← Nope</span>
        <span>Space: Next Photo</span>
        <span>↑ Super Like</span>
        <span>→ Like</span>
        <span>↓ Details</span>
      </div>

      {/* Main Card Viewport */}
      <div className="relative w-full flex-1 max-h-[640px] flex items-center justify-center">
        {currentProfile ? (
          <>
            {/* Next Card in Stack (Depth Layer) */}
            {nextProfile && (
              <div
                className="absolute inset-0 rounded-3xl overflow-hidden shadow-md pointer-events-none transform scale-95 translate-y-3 opacity-90 transition-transform duration-300 bg-gray-900 border border-gray-200 dark:border-gray-800"
                style={{ zIndex: 1 }}
              >
                <img
                  src={nextProfile.photos[0]}
                  alt={nextProfile.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              </div>
            )}

            {/* Active Top Card */}
            <div
              ref={cardRef}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              onClick={handleCardClick}
              style={{
                transform: cardTransform,
                transition: cardTransition,
                zIndex: 10,
                cursor: isDragging ? 'grabbing' : 'grab',
              }}
              className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl bg-black border border-white/10 select-none touch-none"
            >
              {/* Profile Main Photo */}
              <img
                src={currentProfile.photos[photoIndex]}
                alt={currentProfile.name}
                draggable={false}
                className="w-full h-full object-cover pointer-events-none"
              />

              {/* Story / Photo Segment Indicators */}
              <div className="absolute top-3 left-3 right-3 flex items-center gap-1.5 z-20">
                {currentProfile.photos.map((_, idx) => (
                  <div
                    key={idx}
                    className="flex-1 h-1 rounded-full overflow-hidden bg-black/40 backdrop-blur-sm"
                  >
                    <div
                      className={`h-full rounded-full transition-all duration-200 ${
                        idx === photoIndex ? 'bg-white shadow' : idx < photoIndex ? 'bg-white/80' : 'bg-transparent'
                      }`}
                    />
                  </div>
                ))}
              </div>

              {/* Photo Tap Nav Arrows (Desktop hover) */}
              <div className="hidden md:flex absolute inset-y-0 left-0 right-0 justify-between items-center px-2 pointer-events-none z-20 opacity-0 hover:opacity-100 transition">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setPhotoIndex((prev) => (prev > 0 ? prev - 1 : currentProfile.photos.length - 1))
                  }}
                  className="p-2 rounded-full bg-black/40 text-white backdrop-blur hover:bg-black/60 pointer-events-auto transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setPhotoIndex((prev) => (prev + 1) % currentProfile.photos.length)
                  }}
                  className="p-2 rounded-full bg-black/40 text-white backdrop-blur hover:bg-black/60 pointer-events-auto transition"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Stamp Overlays */}
              <div
                style={{ opacity: likeOpacity }}
                className="absolute top-12 left-6 pointer-events-none z-30 transition-opacity"
              >
                <div className="stamp-like px-4 py-1 text-3xl uppercase font-black tracking-widest">
                  LIKE
                </div>
              </div>

              <div
                style={{ opacity: nopeOpacity }}
                className="absolute top-12 right-6 pointer-events-none z-30 transition-opacity"
              >
                <div className="stamp-nope px-4 py-1 text-3xl uppercase font-black tracking-widest">
                  NOPE
                </div>
              </div>

              <div
                style={{ opacity: superLikeOpacity }}
                className="absolute bottom-28 inset-x-0 mx-auto w-fit pointer-events-none z-30 transition-opacity"
              >
                <div className="stamp-superlike px-4 py-1 text-2xl uppercase font-black tracking-widest">
                  SUPER LIKE
                </div>
              </div>

              {/* Gradient Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none z-15" />

              {/* Card Bottom Details Info */}
              <div className="absolute bottom-0 inset-x-0 p-5 text-white z-20 flex flex-col justify-end pointer-events-none">
                {/* Match Intelligence Pill */}
                {compatibilityReport && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowMatchIntelligence(true)
                    }}
                    className={`pointer-events-auto flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold backdrop-blur-md shadow-md transition active:scale-95 mb-2 w-fit cursor-pointer ${
                      compatibilityReport.isExcluded
                        ? 'bg-red-500/90 text-white border border-red-400/60 animate-pulse'
                        : compatibilityReport.mutualScore >= 80
                        ? 'bg-emerald-500/90 text-white border border-emerald-400/60'
                        : 'bg-amber-500/90 text-white border border-amber-400/60'
                    }`}
                    title="Click to view Match Intelligence breakdown"
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span>
                      {compatibilityReport.isExcluded
                        ? '⚠️ Excluded by Rule'
                        : `${compatibilityReport.mutualScore}% Match • ${compatibilityReport.confidenceScore}% Conf`}
                    </span>
                  </button>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <h2 className="text-3xl font-extrabold tracking-tight drop-shadow-md">
                      {currentProfile.name}
                    </h2>
                    <span className="text-2xl font-normal opacity-90 drop-shadow-md">
                      {currentProfile.age}
                    </span>
                    {currentProfile.verified && (
                      <CheckCircle2 className="w-6 h-6 text-blue-400 fill-blue-500/20 drop-shadow inline-block self-center ml-0.5" />
                    )}
                  </div>

                  {/* Info Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onOpenProfileDetail(currentProfile)
                    }}
                    className="pointer-events-auto p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition active:scale-95 shadow"
                    title="View Profile Details"
                  >
                    <Info className="w-5 h-5" />
                  </button>
                </div>

                {/* Subtitle / Work / Distance */}
                <div className="space-y-1 mt-1 text-sm font-medium text-gray-200 drop-shadow">
                  {currentProfile.occupation && (
                    <div className="flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-gray-300" />
                      <span>{currentProfile.occupation} {currentProfile.company ? `at ${currentProfile.company}` : ''}</span>
                    </div>
                  )}

                  {currentProfile.school && (
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-gray-300" />
                      <span>{currentProfile.school}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 text-xs text-gray-300">
                    <MapPin className="w-3.5 h-3.5 text-gray-300" />
                    <span>{currentProfile.distance} miles away • {currentProfile.location}</span>
                  </div>
                </div>

                {/* Bio snippet */}
                {currentProfile.bio && (
                  <p className="text-xs text-gray-300 line-clamp-2 mt-2 leading-relaxed drop-shadow">
                    {currentProfile.bio}
                  </p>
                )}

                {/* Passions chips preview */}
                {currentProfile.passions && currentProfile.passions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {currentProfile.passions.slice(0, 3).map((passion) => (
                      <span
                        key={passion}
                        className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white shadow-sm border border-white/10"
                      >
                        {passion}
                      </span>
                    ))}
                    {currentProfile.passions.length > 3 && (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-md text-gray-300">
                        +{currentProfile.passions.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          /* Empty Deck State (Radar Scanner) */
          <div className="relative w-full h-[520px] rounded-3xl bg-white dark:bg-[#1a1f26] border border-gray-200 dark:border-gray-800 shadow-xl flex flex-col items-center justify-center p-8 text-center overflow-hidden">
            {/* Animated Radar Rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-48 rounded-full border-2 border-rose-500/20 animate-radar-1" />
              <div className="w-48 h-48 rounded-full border-2 border-rose-500/20 animate-radar-2" />
              <div className="w-48 h-48 rounded-full border-2 border-rose-500/20 animate-radar-3" />
            </div>

            {/* Center Pulsing Avatar */}
            <div className="relative z-10 w-24 h-24 rounded-full overflow-hidden ring-4 ring-rose-500 shadow-xl mb-4 bg-gray-800">
              <img
                src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80"
                alt="My Profile"
                className="w-full h-full object-cover"
              />
            </div>

            <h3 className="relative z-10 text-xl font-bold text-gray-900 dark:text-white">
              There's no one new around you
            </h3>
            <p className="relative z-10 text-xs text-gray-500 dark:text-gray-400 max-w-xs mt-1.5 leading-relaxed">
              Expand your distance or age preference in Settings to see more people, or restart the deck to swipe again.
            </p>

            <div className="relative z-10 flex flex-col gap-2.5 mt-6 w-full max-w-xs">
              <button
                onClick={onRestartDeck}
                className="w-full py-3 px-4 rounded-full bg-brand-gradient text-white font-bold text-sm shadow-lg hover:shadow-rose-500/30 active:scale-95 transition"
              >
                Restart Deck (Review Again)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Floating Gamepad Actions */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 py-3 z-20">
        {/* Rewind */}
        <button
          onClick={onRewind}
          disabled={!canRewind || !currentProfile}
          className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition transform active:scale-90 ${
            canRewind
              ? 'bg-white dark:bg-[#1f242d] text-amber-500 hover:scale-110 shadow-amber-500/10'
              : 'bg-gray-100 dark:bg-gray-800/60 text-gray-300 dark:text-gray-600 cursor-not-allowed'
          }`}
          title="Rewind (Undo last swipe)"
        >
          <RotateCcw className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Nope */}
        <button
          onClick={() => handleAction('nope')}
          disabled={!currentProfile || !!isAnimatingOut}
          className="w-14 h-14 rounded-full bg-white dark:bg-[#1f242d] text-rose-500 flex items-center justify-center shadow-lg hover:scale-110 active:scale-90 transition shadow-rose-500/10"
          title="Nope (Dislike)"
        >
          <X className="w-7 h-7 stroke-[3]" />
        </button>

        {/* Super Like */}
        <button
          onClick={() => handleAction('superlike')}
          disabled={!currentProfile || !!isAnimatingOut}
          className="w-12 h-12 rounded-full bg-white dark:bg-[#1f242d] text-sky-400 flex items-center justify-center shadow-lg hover:scale-110 active:scale-90 transition shadow-sky-400/10"
          title="Super Like"
        >
          <Star className="w-6 h-6 fill-current stroke-[2]" />
        </button>

        {/* Like */}
        <button
          onClick={() => handleAction('like')}
          disabled={!currentProfile || !!isAnimatingOut}
          className="w-14 h-14 rounded-full bg-white dark:bg-[#1f242d] text-emerald-400 flex items-center justify-center shadow-lg hover:scale-110 active:scale-90 transition shadow-emerald-400/10"
          title="Like"
        >
          <Heart className="w-7 h-7 fill-current stroke-[2]" />
        </button>

        {/* Boost */}
        <button
          onClick={onTriggerBoost}
          className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition transform active:scale-90 ${
            boostActive
              ? 'bg-purple-600 text-white animate-pulse shadow-purple-500/40'
              : 'bg-white dark:bg-[#1f242d] text-purple-500 hover:scale-110 shadow-purple-500/10'
          }`}
          title="Boost (Get 10x more profile views)"
        >
          <Zap className="w-5 h-5 fill-current" />
        </button>
      </div>

      {/* Boost Active Badge */}
      {boostActive && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 animate-bounce z-40">
          <Sparkles className="w-3.5 h-3.5 fill-current" />
          <span>Profile Boost Active (10x Views)</span>
        </div>
      )}

      {/* Match Intelligence Modal */}
      {showMatchIntelligence && compatibilityReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg">
            <CompatibilityDrawer
              report={compatibilityReport}
              onClose={() => setShowMatchIntelligence(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
