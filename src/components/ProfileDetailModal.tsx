import React, { useState } from 'react'
import type { Profile, SwipeAction } from '../types'
import {
  ChevronDown,
  CheckCircle2,
  MapPin,
  Briefcase,
  GraduationCap,
  Heart,
  X,
  Star,
  Music,
  Share2,
  Flag,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
} from 'lucide-react'

interface ProfileDetailModalProps {
  profile: Profile | null
  onClose: () => void
  onSwipe: (action: SwipeAction, profile: Profile) => void
}

export const ProfileDetailModal: React.FC<ProfileDetailModalProps> = ({
  profile,
  onClose,
  onSwipe,
}) => {
  const [photoIndex, setPhotoIndex] = useState(0)
  const [isPlayingAnthem, setIsPlayingAnthem] = useState(false)

  if (!profile) return null

  const handleAction = (action: SwipeAction) => {
    onSwipe(action, profile)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#111418] md:rounded-3xl shadow-2xl overflow-hidden min-h-screen md:min-h-0 md:max-h-[92vh] flex flex-col">
        {/* Photo Gallery Header */}
        <div className="relative w-full h-[460px] shrink-0 bg-black">
          <img
            src={profile.photos[photoIndex]}
            alt={profile.name}
            className="w-full h-full object-cover"
          />

          {/* Story Progress Indicators */}
          <div className="absolute top-3 left-3 right-3 flex items-center gap-1.5 z-20">
            {profile.photos.map((_, idx) => (
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

          {/* Desktop Photo Navigation Arrows */}
          <div className="absolute inset-y-0 left-0 right-0 flex justify-between items-center px-3 pointer-events-none z-20">
            <button
              onClick={() => setPhotoIndex((prev) => (prev > 0 ? prev - 1 : profile.photos.length - 1))}
              className="p-2 rounded-full bg-black/40 text-white backdrop-blur hover:bg-black/60 pointer-events-auto transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setPhotoIndex((prev) => (prev + 1) % profile.photos.length)}
              className="p-2 rounded-full bg-black/40 text-white backdrop-blur hover:bg-black/60 pointer-events-auto transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Collapse Down Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur transition shadow-lg active:scale-95"
            title="Close"
          >
            <ChevronDown className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Scrollable Profile Information */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-28">
          {/* Main Name & Age Header */}
          <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
            <div className="flex items-baseline gap-2">
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                {profile.name}
              </h1>
              <span className="text-2xl font-normal text-gray-600 dark:text-gray-300">
                {profile.age}
              </span>
              {profile.verified && (
                <CheckCircle2 className="w-6 h-6 text-blue-500 fill-blue-500/20 inline-block self-center ml-0.5" />
              )}
            </div>

            <div className="space-y-1.5 mt-2 text-sm text-gray-600 dark:text-gray-300">
              {profile.occupation && (
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-gray-400" />
                  <span>{profile.occupation} {profile.company ? `at ${profile.company}` : ''}</span>
                </div>
              )}
              {profile.school && (
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-gray-400" />
                  <span>{profile.school}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>{profile.distance} miles away • Lives in {profile.location}</span>
              </div>
            </div>

            {profile.intent && (
              <div className="mt-3 inline-block px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-bold border border-rose-200 dark:border-rose-900/60">
                {profile.intent}
              </div>
            )}
          </div>

          {/* About Me Section */}
          {profile.bio && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                About Me
              </h3>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-relaxed">
                {profile.bio}
              </p>
            </div>
          )}

          {/* Passions Section */}
          {profile.passions && profile.passions.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2.5">
                Passions
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.passions.map((passion) => (
                  <span
                    key={passion}
                    className="text-xs font-semibold px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700/60"
                  >
                    {passion}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Essentials / Basics Section */}
          {profile.basics && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2.5">
                Basics
              </h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(profile.basics).map(([key, val]) => (
                  val ? (
                    <div
                      key={key}
                      className="text-xs font-medium px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                    >
                      {val}
                    </div>
                  ) : null
                ))}
              </div>
            </div>
          )}

          {/* Spotify Anthem */}
          {profile.anthem && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2.5 flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-emerald-500" />
                <span>My Spotify Anthem</span>
              </h3>
              <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow">
                    <img
                      src={profile.anthem.coverUrl}
                      alt={profile.anthem.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
                      {profile.anthem.title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {profile.anthem.artist}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsPlayingAnthem(!isPlayingAnthem)}
                  className="p-3 rounded-full bg-emerald-500 text-white shadow-md hover:bg-emerald-600 transition active:scale-95"
                  title="Play Anthem Preview"
                >
                  {isPlayingAnthem ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
                </button>
              </div>
            </div>
          )}

          {/* Prompt Questions */}
          {profile.prompts && profile.prompts.map((prompt, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 space-y-1.5"
            >
              <span className="text-xs font-bold text-rose-500 uppercase tracking-wide">
                {prompt.question}
              </span>
              <p className="text-base font-semibold text-gray-900 dark:text-white">
                {prompt.answer}
              </p>
            </div>
          ))}

          {/* Share & Report Footer Links */}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-col items-center gap-3 text-xs text-gray-400">
            <button className="flex items-center gap-2 hover:text-gray-600 dark:hover:text-gray-200 transition">
              <Share2 className="w-4 h-4" />
              <span>Share {profile.name}'s Profile</span>
            </button>
            <button className="flex items-center gap-2 text-rose-400 hover:text-rose-600 transition">
              <Flag className="w-4 h-4" />
              <span>Report or Block {profile.name}</span>
            </button>
          </div>
        </div>

        {/* Sticky Floating Gamepad at the Bottom */}
        <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-white via-white dark:from-[#111418] dark:via-[#111418] to-transparent z-40 flex items-center justify-center gap-5">
          <button
            onClick={() => handleAction('nope')}
            className="w-14 h-14 rounded-full bg-white dark:bg-[#1f242d] text-rose-500 flex items-center justify-center shadow-xl hover:scale-110 active:scale-90 transition border border-gray-100 dark:border-gray-700"
            title="Nope"
          >
            <X className="w-7 h-7 stroke-[3]" />
          </button>
          <button
            onClick={() => handleAction('superlike')}
            className="w-12 h-12 rounded-full bg-white dark:bg-[#1f242d] text-sky-400 flex items-center justify-center shadow-xl hover:scale-110 active:scale-90 transition border border-gray-100 dark:border-gray-700"
            title="Super Like"
          >
            <Star className="w-6 h-6 fill-current" />
          </button>
          <button
            onClick={() => handleAction('like')}
            className="w-14 h-14 rounded-full bg-white dark:bg-[#1f242d] text-emerald-400 flex items-center justify-center shadow-xl hover:scale-110 active:scale-90 transition border border-gray-100 dark:border-gray-700"
            title="Like"
          >
            <Heart className="w-7 h-7 fill-current" />
          </button>
        </div>
      </div>
    </div>
  )
}
