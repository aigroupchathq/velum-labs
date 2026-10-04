import React, { useState } from 'react'
import { Sparkles, Heart, X, Lock, Unlock } from 'lucide-react'
import type { Profile } from '../types'

interface LikesYouModalProps {
  onClose: () => void
  onInstantMatch: (profile: Profile) => void
}

export const LikesYouModal: React.FC<LikesYouModalProps> = ({
  onClose,
  onInstantMatch,
}) => {
  const [isUnlocked, setIsUnlocked] = useState(false)

  const potentialLikes: Profile[] = [
    {
      id: 'like-1',
      name: 'Camila Vance',
      age: 24,
      bio: 'Fashion buyer & analog synth collector. Sunset watcher.',
      distance: 2,
      location: 'SoHo, NY',
      verified: true,
      photos: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      ],
      passions: ['Fashion', 'Music', 'Photography'],
    },
    {
      id: 'like-2',
      name: 'Brooke Taylor',
      age: 26,
      bio: 'Veterinarian. Will love your dog more than you 🐾',
      distance: 4,
      location: 'Chelsea, NY',
      verified: true,
      photos: [
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
      ],
      passions: ['Animals', 'Hiking', 'Coffee'],
    },
    {
      id: 'like-3',
      name: 'Naomi Scott',
      age: 25,
      bio: 'Graphic designer & pilates instructor. Always down for matcha.',
      distance: 3,
      location: 'Williamsburg, NY',
      verified: false,
      photos: [
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
      ],
      passions: ['Art', 'Pilates', 'Matcha'],
    },
    {
      id: 'like-4',
      name: 'Sienna Rivera',
      age: 27,
      bio: 'Sommelier in training. Looking for someone to test recipes on.',
      distance: 5,
      location: 'NoHo, NY',
      verified: true,
      photos: [
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
      ],
      passions: ['Wine', 'Cooking', 'Travel'],
    },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#111418] rounded-3xl shadow-2xl p-6 md:p-8 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <Sparkles className="w-6 h-6 fill-amber-500" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-gray-900 dark:text-white flex items-center gap-1.5">
                <span>99+ People Liked You</span>
                <span className="text-xs bg-amber-400 text-black font-black px-2 py-0.5 rounded-full uppercase">
                  Gold
                </span>
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {isUnlocked
                  ? 'Gold Unlocked! Tap any heart to match instantly.'
                  : 'Upgrade to Tinder Gold to reveal everyone who liked your profile.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upgrade / Unlock Banner */}
        {!isUnlocked && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 text-black mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
            <div>
              <h3 className="font-extrabold text-base leading-tight">
                Unlock Secret Admirers
              </h3>
              <p className="text-xs font-medium opacity-90">
                Match with people who have already swiped right on you!
              </p>
            </div>
            <button
              onClick={() => setIsUnlocked(true)}
              className="px-5 py-2.5 rounded-full bg-black text-white hover:bg-gray-900 font-bold text-xs shadow-md transition flex items-center gap-1.5 shrink-0 active:scale-95"
            >
              <Unlock className="w-4 h-4" />
              <span>Unlock Tinder Gold (Demo Free)</span>
            </button>
          </div>
        )}

        {/* Grid of Profiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 overflow-y-auto p-1">
          {potentialLikes.map((profile) => (
            <div
              key={profile.id}
              className="relative rounded-2xl overflow-hidden shadow-md group aspect-[3/4] bg-gray-900 border border-gray-100 dark:border-gray-800"
            >
              {/* Photo */}
              <img
                src={profile.photos[0]}
                alt={profile.name}
                className={`w-full h-full object-cover transition duration-300 ${
                  isUnlocked ? 'filter-none' : 'blur-md scale-110 opacity-70'
                }`}
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3 text-white">
                <div className="font-bold text-sm leading-tight drop-shadow">
                  {isUnlocked ? `${profile.name}, ${profile.age}` : 'Secret Admirer'}
                </div>
                <div className="text-[11px] text-gray-300 drop-shadow">
                  {profile.distance} miles away
                </div>

                {/* Instant Match Button if Unlocked */}
                {isUnlocked ? (
                  <button
                    onClick={() => {
                      onInstantMatch(profile)
                      onClose()
                    }}
                    className="mt-2 w-full py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-md transition active:scale-95"
                  >
                    <Heart className="w-3.5 h-3.5 fill-current" />
                    <span>Match!</span>
                  </button>
                ) : (
                  <div className="mt-2 w-full py-1 rounded-full bg-black/40 backdrop-blur text-amber-400 font-bold text-[10px] flex items-center justify-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>Locked</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
