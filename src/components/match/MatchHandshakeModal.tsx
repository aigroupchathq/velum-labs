// ============================================================================
// src/components/match/MatchHandshakeModal.tsx
// Ethical & Reciprocal Handshake Composer Modal
// ============================================================================

import React from 'react'
import { Send, X, Check } from 'lucide-react'
import type { UniversalUserProfile } from '../../types'

interface MatchHandshakeModalProps {
  candidate: UniversalUserProfile
  isOpen: boolean
  handshakeSent: boolean
  handshakeNote: string
  onNoteChange: (note: string) => void
  onSend: () => void
  onClose: () => void
}

export const MatchHandshakeModal: React.FC<MatchHandshakeModalProps> = ({
  candidate,
  isOpen,
  handshakeSent,
  handshakeNote,
  onNoteChange,
  onSend,
  onClose,
}) => {
  if (!isOpen) return null

  return (
    <div className="p-4 rounded-2xl bg-zinc-950/95 border border-purple-500/30 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs font-semibold text-white">
          <Send className="w-3.5 h-3.5 text-purple-400" />
          <span>Initiate Thoughtful Handshake with {candidate.identity.name}</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {handshakeSent ? (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-1">
          <div className="flex items-center justify-center space-x-2 text-emerald-300 font-semibold text-xs">
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Thoughtful Handshake Dispatched</span>
          </div>
          <p className="text-[11px] text-neutral-400 font-light">
            Your invitation is private and reciprocal. When {candidate.identity.name} accepts, your conversation will unlock in Sanctuary Dialogue.
          </p>
        </div>
      ) : (
        <>
          <p className="text-xs text-neutral-400 font-light leading-relaxed">
            Handshakes are intentional agreements. No random notifications are sent; dialogue only unlocks when both parties reciprocate.
          </p>

          <textarea
            value={handshakeNote}
            onChange={(e) => onNoteChange(e.target.value)}
            placeholder="Attach an optional warm note or question about their profile..."
            rows={2}
            maxLength={280}
            className="w-full p-2.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-400 transition"
          />

          <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-1">
            <span>Protected by Invariant S-01 • Take all the time you need</span>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onSend}
                className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 transition shadow-md shadow-purple-900/30 flex items-center space-x-1.5 cursor-pointer"
              >
                <Send className="w-3 h-3" />
                <span>Send Handshake</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
