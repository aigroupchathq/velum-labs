// ============================================================================
// src/components/DyadConversationView.tsx
// Kin: Graduated Dialogue Suite (Slow Messaging & Graceful Closure)
// Designed with Apple Clinical Dignity: No frantic typing anxiety, no ghosting
// ============================================================================

import React, { useState } from 'react'
import {
  Send,
  ShieldCheck,
  Check,
  HeartHandshake,
  Coffee,
  XCircle,
  CheckCircle2,
  ChevronLeft,
} from 'lucide-react'
import type { UniversalUserProfile, DyadConversation, DyadMessage } from '../types'
import { mockCandidates } from '../data/mockProfiles'
import { evaluateMatch } from '../utils/matchingEngine'

interface DyadConversationViewProps {
  currentUser: UniversalUserProfile
  onNavigateToBlueprint: (candidateId: string) => void
}

export const DyadConversationView: React.FC<DyadConversationViewProps> = ({
  currentUser,
  onNavigateToBlueprint,
}) => {
  // Pre-seeded authentic conversations
  const [conversations, setConversations] = useState<DyadConversation[]>([
    {
      id: 'conv_maya',
      partnerId: mockCandidates[0].id, // Maya Lin
      status: 'active',
      createdAt: '2026-10-04T10:30:00Z',
      lastActivity: '12m ago',
      consentGivenBy: [currentUser.id, mockCandidates[0].id],
      sharedPrompts: [
        'How do you recharge after an intense working week?',
        'What does an honest, quiet Sunday evening look like for you?',
      ],
      messages: [
        {
          id: 'm1',
          senderId: mockCandidates[0].id,
          recipientId: currentUser.id,
          content:
            "Elena, I loved reading your reflections on architectural acoustics and speculative literature. It feels so rare to meet someone who cherishes intentional quiet.",
          timestamp: 'Yesterday at 18:40',
          isPromptAnswer: true,
          promptTopic: 'Values & Domestic Rhythms',
        },
        {
          id: 'm2',
          senderId: currentUser.id,
          recipientId: mockCandidates[0].id,
          content:
            "Thank you, Maya. Your commitment to natural acoustics and ceramic crafts resonates deeply. When life gets noisy, I usually need an entire evening with tea and synthesizers.",
          timestamp: 'Yesterday at 20:15',
        },
        {
          id: 'm3',
          senderId: mockCandidates[0].id,
          recipientId: currentUser.id,
          content:
            "That sounds peaceful beyond words. I’d love to explore the botanical garden tea pavilion if you feel open to taking this into the real world.",
          timestamp: 'Today at 09:12',
        },
      ],
    },
    {
      id: 'conv_chloe',
      partnerId: 'usr_chloe_20', // Chloe Sommers
      status: 'active',
      createdAt: '2026-10-04T14:20:00Z',
      lastActivity: '2h ago',
      consentGivenBy: [currentUser.id, 'usr_chloe_20'],
      sharedPrompts: ['What craft or passion matters most to you?'],
      messages: [
        {
          id: 'mc1',
          senderId: 'usr_chloe_20',
          recipientId: currentUser.id,
          content:
            "Hello! I saw your note on classical design and historical architecture. I'm currently assisting at the modern gallery and practicing cello.",
          timestamp: 'Yesterday at 15:30',
          isPromptAnswer: true,
          promptTopic: 'Aesthetics & Creative Dedication',
        },
      ],
    },
    {
      id: 'conv_liam',
      partnerId: mockCandidates[1].id, // Liam Vance
      status: 'closed_gracefully',
      createdAt: '2026-10-02T09:00:00Z',
      lastActivity: '3d ago',
      consentGivenBy: [currentUser.id, mockCandidates[1].id],
      sharedPrompts: [],
      closureReason: 'Gentle mutual acknowledgment of differing lifestyle horizons.',
      messages: [
        {
          id: 'ml1',
          senderId: mockCandidates[1].id,
          recipientId: currentUser.id,
          content: "Hi Elena, great to connect. Loved seeing your urban ecology work.",
          timestamp: 'Oct 2 at 11:00',
        },
      ],
    },
  ])

  const [activePartnerId, setActivePartnerId] = useState<string>(mockCandidates[0].id)
  const [inputText, setInputText] = useState('')
  const [isClosureModalOpen, setIsClosureModalOpen] = useState(false)
  const [mobileThreadOpen, setMobileThreadOpen] = useState(false)

  // Find partner and evaluation
  const activePartner =
    mockCandidates.find((c) => c.id === activePartnerId) || mockCandidates[0]
  const activeConv =
    conversations.find((c) => c.partnerId === activePartnerId) || conversations[0]
  const evaluation = evaluateMatch(currentUser, activePartner)

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim() || activeConv.status !== 'active') return

    const newMessage: DyadMessage = {
      id: `m_${Date.now()}`,
      senderId: currentUser.id,
      recipientId: activePartner.id,
      content: inputText.trim(),
      timestamp: 'Just now',
    }

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConv.id
          ? {
              ...c,
              lastActivity: 'Just now',
              messages: [...c.messages, newMessage],
            }
          : c
      )
    )
    setInputText('')
  }

  const handleExecuteGentleClosure = () => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConv.id
          ? {
              ...c,
              status: 'closed_gracefully',
              closureReason:
                'Gracefully concluded. A courteous closure note has been sent.',
            }
          : c
      )
    )
    setIsClosureModalOpen(false)
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-2">
      {/* 1. EDITORIAL HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <span className="apple-subhead">Stage 4 of Human Journey</span>
          <h1 className="text-3xl font-semibold tracking-tight text-white mt-1">
            Thoughtful Conversations
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl font-light leading-relaxed">
            Real conversation without the anxiety. No frantic typing bubbles, no pressure to reply in 5 seconds, and no mind games. Just honest connection at a human pace.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs text-neutral-400 font-mono">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Private &amp; Encrypted Chat</span>
        </div>
      </div>

      {/* 2. MAIN CONVERSATION MASTER-DETAIL VIEW */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[620px]">
        {/* Left Column: Active Handshakes & Conversations List */}
        <div className={`${mobileThreadOpen ? 'hidden md:block' : 'block'} md:col-span-4 space-y-2`}>
          <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 px-1 pb-1">
            Active Connections ({conversations.length})
          </div>

          <div className="space-y-2">
            {conversations.map((conv) => {
              const partner =
                mockCandidates.find((c) => c.id === conv.partnerId) || mockCandidates[0]
              const isSelected = partner.id === activePartnerId
              const isClosed = conv.status === 'closed_gracefully'

              return (
                <div
                  key={conv.id}
                  onClick={() => {
                    setActivePartnerId(partner.id)
                    setMobileThreadOpen(true)
                  }}
                  className={`apple-panel p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center space-x-3.5 select-none ${
                    isSelected
                      ? 'bg-white/10 border-white/25 shadow-md'
                      : 'hover:bg-white/[0.04] border-white/[0.06]'
                  } ${isClosed ? 'opacity-50' : ''}`}
                >
                  <img
                    src={partner.identity.photos[0]}
                    alt={partner.identity.name}
                    className="w-11 h-11 rounded-full object-cover ring-1 ring-white/15 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-semibold text-white truncate">
                        {partner.identity.name}
                      </h4>
                      <span className="text-[10px] font-mono text-neutral-400">
                        {conv.lastActivity}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 font-light truncate mt-0.5">
                      {conv.messages[conv.messages.length - 1]?.content || 'Handshake established.'}
                    </p>
                    <div className="flex items-center space-x-2 pt-1 text-[10px]">
                      {isClosed ? (
                        <span className="text-neutral-400 font-mono">Closed gracefully</span>
                      ) : (
                        <span className="text-emerald-400 font-mono flex items-center space-x-1">
                          <Check className="w-2.5 h-2.5" />
                          <span>Mutual consent active</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Column: Thoughtful Dialogue Stage */}
        <div className={`${mobileThreadOpen ? 'flex' : 'hidden md:flex'} md:col-span-8 apple-panel rounded-3xl p-4 sm:p-6 flex-col justify-between border-white/10 shadow-2xl relative min-h-[580px]`}>
          {/* Conversation Stage Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
            <div className="flex items-center space-x-3.5">
              <button
                type="button"
                onClick={() => setMobileThreadOpen(false)}
                className="md:hidden p-2 -ml-1 rounded-xl bg-white/10 hover:bg-white/15 active:scale-95 text-white flex items-center justify-center cursor-pointer transition shrink-0"
                aria-label="Back to conversations list"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <img
                src={activePartner.identity.photos[0]}
                alt={activePartner.identity.name}
                className="w-12 h-12 rounded-2xl object-cover ring-1 ring-white/20 shrink-0"
              />
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-semibold text-white tracking-tight">
                    {activePartner.identity.name}
                  </h3>
                  <span className="text-xs text-neutral-400 font-light">
                    {activePartner.identity.age} y/o
                  </span>
                  {activePartner.identity.verified && (
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                </div>
                <p className="text-xs text-neutral-400 font-light truncate max-w-sm">
                  {activePartner.identity.bio}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onNavigateToBlueprint(activePartner.id)}
                className="apple-pill-btn px-3 py-1.5 text-xs font-medium text-white bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.1] flex items-center space-x-1.5 cursor-pointer"
              >
                <Coffee className="w-3.5 h-3.5 text-amber-300" />
                <span>Plan First Date</span>
              </button>

              {activeConv.status === 'active' && (
                <button
                  onClick={() => setIsClosureModalOpen(true)}
                  className="apple-pill-btn px-3 py-1.5 text-xs font-medium text-neutral-400 hover:text-white bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] flex items-center space-x-1.5 cursor-pointer"
                  title="Conclude conversation respectfully without ghosting"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Gracious Closure</span>
                </button>
              )}
            </div>
          </div>

          {/* Value Anchor Pill */}
          <div className="my-3 px-4 py-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between text-xs text-neutral-300">
            <div className="flex items-center space-x-2">
              <HeartHandshake className="w-4 h-4 text-white/80" />
              <span>
                <strong>Shared Alignment:</strong> {activePartner.values.coreValues.slice(0, 2).join(' & ')} • Mutual Harmonic Score {evaluation.mutuality.score || 85}%
              </span>
            </div>
            <span className="text-[10px] font-mono text-neutral-400 hidden sm:inline">
              Common Ground
            </span>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto space-y-4 py-3 max-h-[360px] pr-2">
            {activeConv.messages.map((msg) => {
              const isMe = msg.senderId === currentUser.id
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
                >
                  {msg.isPromptAnswer && (
                    <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider px-2">
                      Anchor Reflection: {msg.promptTopic}
                    </span>
                  )}
                  <div
                    className={`max-w-md p-4 rounded-2xl text-xs sm:text-sm font-light leading-relaxed shadow-sm ${
                      isMe
                        ? 'bg-white text-black font-normal rounded-tr-sm'
                        : 'bg-white/[0.08] text-white border border-white/[0.08] rounded-tl-sm'
                    }`}
                  >
                    {msg.content}
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              )
            })}

            {activeConv.status === 'closed_gracefully' && (
              <div className="text-center py-6 space-y-2">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-xs text-neutral-400 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5 text-neutral-300" />
                  <span>Connection concluded with dignity and mutual respect.</span>
                </div>
                <p className="text-[11px] text-neutral-400 font-light max-w-sm mx-auto">
                  {activeConv.closureReason}
                </p>
              </div>
            )}
          </div>

          {/* Input Area or Concluded Notice */}
          {activeConv.status === 'active' ? (
            <form onSubmit={handleSendMessage} className="pt-3 border-t border-white/[0.06] flex items-center space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Write a thoughtful note to ${activePartner.identity.name.split(' ')[0]}...`}
                className="flex-1 bg-white/[0.04] focus:bg-white/[0.07] border border-white/[0.08] focus:border-white/20 rounded-full px-4 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none transition-all"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="apple-pill-btn p-3 bg-white text-black hover:bg-neutral-100 disabled:opacity-30 disabled:hover:bg-white transition-all shadow-md cursor-pointer"
                title="Send reflection"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="pt-3 border-t border-white/[0.06] text-center text-xs text-neutral-400 font-light">
              This channel has been respectfully closed. Both profiles remain in full privacy.
            </div>
          )}
        </div>
      </div>

      {/* 3. GENTLE CLOSURE MODAL (Clinical Anti-Ghosting Protocol) */}
      {isClosureModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
          <div className="apple-panel rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-5 border-white/10 shadow-2xl">
            <div className="space-y-1.5 text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center">
                <HeartHandshake className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white tracking-tight pt-2">
                Execute Gentle Closure Handshake
              </h3>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                Ghosting creates cognitive distress and emotional fatigue. Kin provides a courteous, automated acknowledgement that respectfully concludes your interaction without awkwardness.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-xs text-neutral-300 font-light space-y-1">
              <div className="font-medium text-white text-[11px] font-mono">Automated Courtesy Note:</div>
              <p className="italic text-neutral-400">
                &ldquo;Thank you for sharing your thoughts with me. While I value our exchange, I don&apos;t feel the mutual alignment needed for a long-term partnership. Wishing you grace and warmth on your journey.&rdquo;
              </p>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setIsClosureModalOpen(false)}
                className="apple-pill-btn px-4 py-2 text-xs font-medium text-neutral-300 hover:text-white bg-white/[0.04] border border-white/[0.06]"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteGentleClosure}
                className="apple-pill-btn px-5 py-2 text-xs font-semibold text-black bg-white hover:bg-neutral-100 shadow-md"
              >
                Confirm &amp; Send Gentle Closure
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
