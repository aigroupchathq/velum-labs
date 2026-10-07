// ============================================================================
// src/components/LoginModal.tsx
// Universal Compatibility Platform: Apple-Grade Authentication Sheet
// ============================================================================

import React, { useState } from 'react'
import {
  X,
  ShieldCheck,
  Check,
  ArrowRight,
  UserCheck,
  Lock,
} from 'lucide-react'
import type { UniversalUserProfile } from '../types'
import { currentUser, mockCandidates } from '../data/mockProfiles'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectUser: (user: UniversalUserProfile) => void
  activeUser: UniversalUserProfile
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSelectUser,
  activeUser,
}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authSuccess, setAuthSuccess] = useState(false)

  if (!isOpen) return null

  // Canonical demo personas
  const personas: {
    profile: UniversalUserProfile
    tag: string
    highlight: string
  }[] = [
    {
      profile: currentUser,
      tag: 'Primary Persona',
      highlight: 'Art Historian • Vegetarian • Monogamous • Looking for Long-Term',
    },
    {
      profile: mockCandidates[0], // Maya Lin
      tag: 'Harmonic Twin (99%)',
      highlight: 'Acoustician • High mutual resonance across all 12 dimensions',
    },
    {
      profile: mockCandidates[1], // Liam Vance
      tag: 'Boundary Case',
      highlight: 'Creative Director • Smoker (Demonstrates strict dealbreaker exclusion)',
    },
    {
      profile: mockCandidates[2], // Marcus Sterling
      tag: 'Asymmetry Case',
      highlight: 'Venture Partner • Polyamorous (Demonstrates directional tension gap)',
    },
    {
      profile: mockCandidates[6], // Arthur Pendleton (index 6 is Arthur)
      tag: 'Custom Query Case',
      highlight: 'Arthur (66 y/o Black Gentleman) • Seeking younger Caucasian women (Chloe, 20)',
    },
  ]

  const handleSelectPersona = (profile: UniversalUserProfile) => {
    setAuthSuccess(true)
    setTimeout(() => {
      onSelectUser(profile)
      setAuthSuccess(false)
      onClose()
    }, 400)
  }

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // For demo purposes, authenticate as primary user
    setAuthSuccess(true)
    setTimeout(() => {
      onSelectUser(currentUser)
      setAuthSuccess(false)
      onClose()
    }, 400)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-2xl overflow-y-auto">
      <div className="apple-panel rounded-[2rem] max-w-lg w-full p-6 sm:p-8 flex flex-col overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.8)] border border-white/10 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="apple-pill-btn absolute top-6 right-6 p-2 text-neutral-400 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08]"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Brand Monogram & Title */}
        <div className="text-center space-y-2 pb-6 border-b border-white/[0.06]">
          <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-inner">
            <span className="text-base font-bold text-emerald-400 font-mono">✓</span>
          </div>
          <h2 className="text-2xl font-semibold text-white tracking-tight pt-1">
            Sign In to Check
          </h2>
          <p className="text-xs text-neutral-400 font-light max-w-xs mx-auto">
            Choose a canonical persona to test deterministic matching or authenticate with credentials.
          </p>
        </div>

        {authSuccess && (
          <div className="my-4 apple-panel rounded-2xl p-3 text-xs text-emerald-300 flex items-center justify-center space-x-2 border-emerald-500/20">
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Authenticated successfully. Entering environment...</span>
          </div>
        )}

        {/* 1-Click Demo Personas */}
        <div className="space-y-3 py-6">
          <span className="apple-subhead">Canonical Personas</span>

          <div className="space-y-2">
            {personas.map(({ profile, tag, highlight }) => {
              const isActive = activeUser.id === profile.id
              return (
                <div
                  key={profile.id}
                  onClick={() => handleSelectPersona(profile)}
                  className={`apple-panel-interactive rounded-2xl p-3.5 flex items-center justify-between cursor-pointer group ${
                    isActive ? 'border-white/30 bg-white/[0.08]' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <img
                      src={profile.identity.photos[0]}
                      alt={profile.identity.name}
                      className="w-10 h-10 rounded-full object-cover ring-1 ring-white/20 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-semibold text-white group-hover:text-white transition-colors truncate">
                          {profile.identity.name}
                        </span>
                        {profile.identity.verified && (
                          <ShieldCheck className="w-3 h-3 text-emerald-400 stroke-[2] shrink-0" />
                        )}
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono text-neutral-400 bg-white/[0.05] border border-white/[0.08] shrink-0">
                          {tag}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 font-light truncate mt-0.5">
                        {highlight}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 pl-2">
                    {isActive ? (
                      <span className="w-6 h-6 rounded-full bg-white/10 text-white flex items-center justify-center text-xs">
                        <Check className="w-3 h-3 stroke-[2]" />
                      </span>
                    ) : (
                      <span className="w-6 h-6 rounded-full bg-transparent group-hover:bg-white/10 text-neutral-400 group-hover:text-white flex items-center justify-center transition-colors">
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center space-x-3 py-2">
          <div className="flex-1 h-px bg-white/[0.06]" />
          <span className="text-[10px] font-mono uppercase text-neutral-500 tracking-wider">
            Or Account Credentials
          </span>
          <div className="flex-1 h-px bg-white/[0.06]" />
        </div>

        {/* Custom Form */}
        <form onSubmit={handleCustomLogin} className="space-y-3 pt-3">
          <input
            type="email"
            placeholder="name@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white/30"
          />
          <input
            type="password"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white/30"
          />

          <button
            type="submit"
            className="apple-pill-btn w-full py-2.5 text-xs font-medium text-black bg-white hover:bg-neutral-100 shadow-sm flex items-center justify-center space-x-1.5"
          >
            <Lock className="w-3 h-3 stroke-[2]" />
            <span>Sign In to Platform</span>
          </button>
        </form>

        {/* Footer Guarantee */}
        <div className="mt-5 text-center">
          <span className="text-[10px] text-neutral-500 font-light flex items-center justify-center space-x-1">
            <UserCheck className="w-3 h-3" />
            <span>Protected by Deterministic Privacy Layer • AES-256-GCM FLE</span>
          </span>
        </div>
      </div>
    </div>
  )
}
