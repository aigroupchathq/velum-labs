import React, { useState, useEffect } from 'react'
import type { Profile, UserProfile } from '../types'
import confetti from 'canvas-confetti'
import { Heart, Send, Sparkles } from 'lucide-react'

interface MatchModalProps {
  matchProfile: Profile | null
  userProfile: UserProfile
  onClose: () => void
  onSendMessage: (profile: Profile, message: string) => void
}

export const MatchModal: React.FC<MatchModalProps> = ({
  matchProfile,
  userProfile,
  onClose,
  onSendMessage,
}) => {
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (matchProfile) {
      // Trigger festive celebration confetti
      const end = Date.now() + 1500
      const colors = ['#fd267a', '#ff6036', '#2bebef', '#20c997', '#ffd700']

      const frame = () => {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors,
        })
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors,
        })

        if (Date.now() < end) {
          requestAnimationFrame(frame)
        }
      }
      frame()
    }
  }, [matchProfile])

  if (!matchProfile) return null

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return
    onSendMessage(matchProfile, message.trim())
    setMessage('')
  }

  const quickStarters = [
    'Hey! Love your vibe 😊',
    'Coffee this weekend? ☕',
    'We have so much in common!',
    'Great music taste! 🎵',
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-md flex flex-col items-center text-center p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-300">
        {/* Match Header Typography */}
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-6 h-6 text-amber-400 animate-spin" />
          <h1 className="text-4xl sm:text-5xl font-black italic tracking-wider text-brand-gradient drop-shadow-lg">
            It's a Match!
          </h1>
          <Sparkles className="w-6 h-6 text-amber-400 animate-spin" />
        </div>

        <p className="text-sm font-medium text-gray-300 drop-shadow mb-8">
          You and <span className="font-bold text-white">{matchProfile.name}</span> have liked each other.
        </p>

        {/* Dual Avatars with Heart Connection */}
        <div className="relative flex items-center justify-center mb-8">
          {/* User Avatar */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-2xl z-10 -mr-4 transform -rotate-6">
            <img
              src={userProfile.photos[0] || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80'}
              alt={userProfile.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Center Heart Badge */}
          <div className="absolute z-30 w-12 h-12 rounded-full bg-white dark:bg-[#111418] shadow-2xl flex items-center justify-center p-2 border-2 border-rose-500 animate-pulse">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
          </div>

          {/* Match Avatar */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-2xl z-20 -ml-4 transform rotate-6">
            <img
              src={matchProfile.photos[0]}
              alt={matchProfile.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Quick Starters */}
        <div className="w-full space-y-2 mb-4">
          <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
            Quick Icebreakers
          </div>
          <div className="flex flex-wrap justify-center gap-1.5">
            {quickStarters.map((starter) => (
              <button
                key={starter}
                onClick={() => setMessage(starter)}
                className="text-xs font-medium px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur transition border border-white/15"
              >
                {starter}
              </button>
            ))}
          </div>
        </div>

        {/* Message Input Form */}
        <form onSubmit={handleSend} className="w-full relative mb-4">
          <input
            type="text"
            placeholder={`Say something nice to ${matchProfile.name}...`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full pl-4 pr-12 py-3 rounded-full bg-white/15 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 backdrop-blur-md text-sm"
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className="absolute right-1.5 top-1.5 bottom-1.5 px-3.5 rounded-full bg-rose-500 hover:bg-rose-600 disabled:opacity-40 text-white flex items-center justify-center transition active:scale-95 shadow"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Keep Swiping Button */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-full bg-transparent hover:bg-white/10 text-gray-300 font-semibold text-sm transition"
        >
          Keep Swiping
        </button>
      </div>
    </div>
  )
}
