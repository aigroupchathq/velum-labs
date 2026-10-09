// ============================================================================
// src/components/DyadConversationView.tsx
// Universal Compatibility Platform: Human Messages & Slow Messaging Suite
// Designed from Mockup Screen 2 (Messages) & Mockup Screen 2A (Conversation)
// ============================================================================

import React, { useState } from 'react'
import {
  Send,
  Check,
  Coffee,
  Search,
  Bell,
  SlidersHorizontal,
  MoreVertical,
  Phone,
  Video,
  Smile,
  Mic,
  Plus,
  ArrowLeft,
  Calendar,
} from 'lucide-react'
import type { UniversalUserProfile, DyadConversation, DyadMessage } from '../types'
import { mockCandidates } from '../data/mockProfiles'
import { sounds } from '../utils/sound'

interface DyadConversationViewProps {
  currentUser: UniversalUserProfile
  onNavigateToBlueprint: (candidateId?: string) => void
}

type MessageFilter = 'all' | 'unread' | 'dates' | 'archived'

export const DyadConversationView: React.FC<DyadConversationViewProps> = ({
  currentUser,
  onNavigateToBlueprint,
}) => {
  // Pre-seeded authentic conversations matching Mockup Screen 2
  const [conversations, setConversations] = useState<(DyadConversation & { unread?: boolean; partnerName: string; partnerPhoto: string; partnerRole: string })[]>([
    {
      id: 'conv_maya',
      partnerId: mockCandidates[0].id, // Maya Lin
      partnerName: 'Maya',
      partnerPhoto: mockCandidates[0].identity.photos[0],
      partnerRole: 'Architectural acoustician',
      status: 'active',
      unread: true,
      createdAt: '2026-10-04T10:30:00Z',
      lastActivity: '12m',
      consentGivenBy: [currentUser.id, mockCandidates[0].id],
      sharedPrompts: ['A casual café in Covent Garden this weekend?'],
      messages: [
        {
          id: 'm1',
          senderId: mockCandidates[0].id,
          recipientId: currentUser.id,
          content: "That café looks amazing! I've been wanting to check it out.",
          timestamp: '9:20 AM',
        },
        {
          id: 'm2',
          senderId: currentUser.id,
          recipientId: mockCandidates[0].id,
          content: 'Great! Are you free this Saturday afternoon?',
          timestamp: '9:21 AM',
        },
        {
          id: 'm3',
          senderId: mockCandidates[0].id,
          recipientId: currentUser.id,
          content: 'Yes, that works for me! 3pm?',
          timestamp: '9:22 AM',
        },
      ],
    },
    {
      id: 'conv_hannah',
      partnerId: 'usr_hannah_mock',
      partnerName: 'Hannah',
      partnerPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      partnerRole: 'Landscape Architect',
      status: 'active',
      unread: false,
      createdAt: '2026-10-04T14:20:00Z',
      lastActivity: '2h',
      consentGivenBy: [currentUser.id, 'usr_hannah_mock'],
      sharedPrompts: [],
      messages: [
        {
          id: 'mh1',
          senderId: 'usr_hannah_mock',
          recipientId: currentUser.id,
          content: 'Are you free this weekend?',
          timestamp: 'Yesterday at 15:30',
        },
      ],
    },
    {
      id: 'conv_sora',
      partnerId: mockCandidates[2]?.id || 'usr_sora_03',
      partnerName: 'Sora',
      partnerPhoto: mockCandidates[2]?.identity.photos[0] || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
      partnerRole: 'Computational Biology',
      status: 'active',
      unread: false,
      createdAt: '2026-10-03T11:00:00Z',
      lastActivity: '5h',
      consentGivenBy: [currentUser.id, mockCandidates[2]?.id || 'usr_sora_03'],
      sharedPrompts: [],
      messages: [
        {
          id: 'ms1',
          senderId: mockCandidates[2]?.id || 'usr_sora_03',
          recipientId: currentUser.id,
          content: 'Loved the gallery photos!',
          timestamp: 'Yesterday at 11:20',
        },
      ],
    },
    {
      id: 'conv_liam',
      partnerId: mockCandidates[1]?.id || 'usr_liam_02',
      partnerName: 'Liam',
      partnerPhoto: mockCandidates[1]?.identity.photos[0] || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
      partnerRole: 'Cinematographer',
      status: 'active',
      unread: false,
      createdAt: '2026-10-02T09:00:00Z',
      lastActivity: '1d',
      consentGivenBy: [currentUser.id, mockCandidates[1]?.id || 'usr_liam_02'],
      sharedPrompts: [],
      messages: [
        {
          id: 'ml1',
          senderId: mockCandidates[1]?.id || 'usr_liam_02',
          recipientId: currentUser.id,
          content: 'Thanks for the recommendations',
          timestamp: 'Oct 2 at 11:00',
        },
      ],
    },
  ])

  const [activePartnerId, setActivePartnerId] = useState<string>(mockCandidates[0].id)
  const [activeFilter, setActiveFilter] = useState<MessageFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [inputText, setInputText] = useState('')
  const [isClosureModalOpen, setIsClosureModalOpen] = useState(false)
  const [mobileThreadOpen, setMobileThreadOpen] = useState(false)

  // Find partner and evaluation
  const activeConv =
    conversations.find((c) => c.partnerId === activePartnerId) || conversations[0]
  const activePartner =
    mockCandidates.find((c) => c.id === activePartnerId) || {
      id: activeConv.partnerId,
      identity: {
        name: activeConv.partnerName,
        age: 31,
        gender: 'woman',
        pronouns: 'she/her',
        bio: activeConv.partnerRole,
        photos: [activeConv.partnerPhoto],
        verified: true,
        languages: [{ code: 'en', name: 'English', proficiency: 'fluent' as const }],
      },
      intention: { primaryIntent: 'Long-term partnership', relationshipStructure: 'monogamous' as const, intentFlexibility: 20 },
      attractionPreferences: { physical: 3, emotional: 5, intellectual: 5, romantic: 4, sexual: 3, social: 3 },
      family: { hasChildren: 'none' as const, wantsChildren: 'leaning_yes' as const },
      lifestyle: { diet: 'vegetarian' as const, smoking: 'never' as const, alcohol: 'occasional' as const, cannabis: 'never' as const, cleanlinessStandard: 4 as const, pets: [], petAllergies: [] },
      values: { coreValues: ['Integrity', 'Kindness'] },
      communication: { conflictStyle: 'reflective_deliberate' as const, digitalCadence: 'regular_intervals' as const, loveLanguages: ['Quality Time'] },
      accessibility: { stepFreeRequired: false, sensoryCalmRequired: true },
      geography: { cityName: 'London', coordinates: { lat: 51.5074, lng: -0.1278 }, maxDistanceKm: 30, distanceFlexibilityKm: 10, openToRelocation: false, openToLongDistance: false },
      availability: { workSchedule: 'flexible', freeHoursPerWeek: 20, preferredMeetingFormat: 'thoughtful_messaging_first' },
      preferences: { gendersSought: ['all'], minAge: 25, maxAge: 38, ageFlexibilityYears: 2 },
    }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim()) return

    sounds.playTap()
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

  // Filter conversations
  const filteredConversations = conversations.filter((c) => {
    if (activeFilter === 'unread') return c.unread
    if (activeFilter === 'dates') return c.id === 'conv_maya'
    if (activeFilter === 'archived') return c.status === 'closed_gracefully'
    if (searchQuery.trim()) {
      return (
        c.partnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.messages.some((m) => m.content.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }
    return true
  })

  return (
    <div className="space-y-4 max-w-6xl mx-auto py-1">
      {/* ==================================================== */}
      {/* MOBILE CONVERSATIONS MASTER VIEW (Screen 2)         */}
      {/* ==================================================== */}
      {!mobileThreadOpen ? (
        <div className="space-y-4">
          {/* Header (Mockup Screen 2) */}
          <div className="flex items-center justify-between pt-1">
            <h1 className="text-2xl font-bold tracking-tight text-white">Messages</h1>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                className="w-10 h-10 rounded-full bg-[#17161A] border border-white/10 flex items-center justify-center text-neutral-300 hover:text-white transition cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="w-10 h-10 rounded-full bg-[#17161A] border border-white/10 flex items-center justify-center text-neutral-300 hover:text-white transition cursor-pointer"
                aria-label="Filter conversations"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search Bar (Mockup Screen 2) */}
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full py-2.5 pl-10 pr-4 rounded-2xl bg-[#17161A] border border-white/[0.08] text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#F472B6]/50 transition"
            />
          </div>

          {/* Filter Pills (Mockup Screen 2) */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition cursor-pointer shrink-0 ${
                activeFilter === 'all'
                  ? 'bg-[#F472B6] text-white font-semibold shadow-md shadow-[#F472B6]/20'
                  : 'bg-[#17161A] border border-white/[0.06] text-neutral-400 hover:text-white'
              }`}
            >
              All (3)
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('unread')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition cursor-pointer shrink-0 ${
                activeFilter === 'unread'
                  ? 'bg-[#F472B6] text-white font-semibold shadow-md shadow-[#F472B6]/20'
                  : 'bg-[#17161A] border border-white/[0.06] text-neutral-400 hover:text-white'
              }`}
            >
              Unread (1)
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('dates')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition cursor-pointer shrink-0 ${
                activeFilter === 'dates'
                  ? 'bg-[#F472B6] text-white font-semibold shadow-md shadow-[#F472B6]/20'
                  : 'bg-[#17161A] border border-white/[0.06] text-neutral-400 hover:text-white'
              }`}
            >
              Dates (1)
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('archived')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition cursor-pointer shrink-0 ${
                activeFilter === 'archived'
                  ? 'bg-[#F472B6] text-white font-semibold shadow-md shadow-[#F472B6]/20'
                  : 'bg-[#17161A] border border-white/[0.06] text-neutral-400 hover:text-white'
              }`}
            >
              Archived
            </button>
          </div>

          {/* Conversations Thread Rows (Mockup Screen 2) */}
          <div className="space-y-2">
            {filteredConversations.map((conv) => {
              const lastMsg = conv.messages[conv.messages.length - 1]?.content || 'Started conversation'

              return (
                <div
                  key={conv.id}
                  onClick={() => {
                    sounds.playTap()
                    setActivePartnerId(conv.partnerId)
                    setMobileThreadOpen(true)
                  }}
                  className="p-3.5 rounded-2xl bg-[#17161A] border border-white/[0.06] hover:border-white/15 transition cursor-pointer flex items-center space-x-3.5 active:scale-[0.99]"
                >
                  <div className="relative shrink-0">
                    <img
                      src={conv.partnerPhoto}
                      alt={conv.partnerName}
                      className="w-12 h-12 rounded-full object-cover ring-1 ring-white/15"
                    />
                    {conv.unread && (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#F472B6] ring-2 ring-[#0F0E11] absolute bottom-0 right-0" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5 truncate">
                        <h3 className="text-xs font-semibold text-white truncate">
                          {conv.partnerName}
                        </h3>
                        <Check className="w-3 h-3 text-[#F472B6] stroke-[3]" />
                      </div>
                      <span className="text-[10px] font-mono text-neutral-400 shrink-0">
                        {conv.lastActivity}
                      </span>
                    </div>

                    <p className={`text-xs truncate mt-0.5 font-light ${conv.unread ? 'text-white font-normal' : 'text-neutral-400'}`}>
                      {lastMsg}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Inline CTA Card: Plan a Date with Maya? (Mockup Screen 2) */}
          <div className="p-4 rounded-3xl bg-[#17161A] border border-[#F472B6]/20 flex items-center justify-between space-x-3 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-[#F472B6]/15 border border-[#F472B6]/30 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 text-[#F472B6]" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-semibold text-white tracking-tight">
                  Plan a date with Maya?
                </h4>
                <p className="text-[11px] text-neutral-400 font-light">
                  You both seemed interested in a casual café this weekend.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                sounds.playTap()
                onNavigateToBlueprint('usr_maya_01')
              }}
              className="px-3.5 py-2 rounded-full bg-[#F472B6] hover:bg-[#f25da8] active:scale-95 text-white font-bold text-xs shrink-0 transition cursor-pointer shadow-md shadow-[#F472B6]/25"
            >
              Plan a Date &gt;
            </button>
          </div>
        </div>
      ) : (
        /* ==================================================== */
        /* MOBILE FULL-SCREEN CONVERSATION VIEW (Mockup 2A)    */
        /* ==================================================== */
        <div className="fixed inset-0 z-50 flex flex-col bg-[#0F0E11] text-white">
          {/* Header */}
          <div className="px-4 py-3 border-b border-white/[0.08] bg-[#0F0E11]/95 backdrop-blur-xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setMobileThreadOpen(false)}
                className="w-9 h-9 rounded-full bg-[#17161A] border border-white/10 flex items-center justify-center text-white active:scale-95 transition cursor-pointer"
                aria-label="Back to messages"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <div className="relative">
                <img
                  src={activeConv.partnerPhoto}
                  alt={activeConv.partnerName}
                  className="w-10 h-10 rounded-full object-cover ring-1 ring-white/15"
                />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0F0E11] absolute bottom-0 right-0" />
              </div>

              <div>
                <div className="flex items-center space-x-1">
                  <h3 className="text-xs font-semibold text-white">{activeConv.partnerName}</h3>
                  <Check className="w-3 h-3 text-[#F472B6] stroke-[3]" />
                </div>
                <span className="text-[10px] text-neutral-400">Active now</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-neutral-300">
              <button
                type="button"
                className="w-8 h-8 rounded-full bg-[#17161A] border border-white/10 flex items-center justify-center hover:text-white transition cursor-pointer"
                aria-label="Video Call"
              >
                <Video className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                className="w-8 h-8 rounded-full bg-[#17161A] border border-white/10 flex items-center justify-center hover:text-white transition cursor-pointer"
                aria-label="Phone Call"
              >
                <Phone className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsClosureModalOpen(true)}
                className="w-8 h-8 rounded-full bg-[#17161A] border border-white/10 flex items-center justify-center hover:text-white transition cursor-pointer"
                aria-label="Conversation Options"
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Messages Stream (Mockup 2A) */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-24">
            {activeConv.messages.map((msg) => {
              const isMe = msg.senderId === currentUser.id
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
                >
                  <div
                    className={`max-w-[78%] p-3.5 rounded-2xl text-xs font-normal leading-relaxed shadow-sm ${
                      isMe
                        ? 'bg-[#F472B6] text-white rounded-br-xs'
                        : 'bg-[#17161A] text-[#F7F5F8] border border-white/[0.08] rounded-bl-xs'
                    }`}
                  >
                    {msg.content}
                  </div>
                  <span className="text-[10px] font-mono text-neutral-500 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              )
            })}

            {/* Typing Indicator (Mockup 2A) */}
            <div className="flex items-center space-x-1.5 p-3 rounded-2xl bg-[#17161A] border border-white/[0.08] w-14">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce delay-100" />
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce delay-200" />
            </div>
          </div>

          {/* Sticky Bottom Input Bar (Mockup 2A) */}
          <div className="fixed bottom-0 left-0 right-0 z-30 p-3 bg-[#0F0E11]/95 backdrop-blur-2xl border-t border-white/[0.08]">
            <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => onNavigateToBlueprint(activeConv.partnerId)}
                className="w-10 h-10 rounded-full bg-[#17161A] border border-white/10 flex items-center justify-center text-neutral-300 hover:text-white transition cursor-pointer shrink-0"
                aria-label="Add date plan or prompt"
              >
                <Plus className="w-4 h-4" />
              </button>

              <div className="relative flex-1">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type a message..."
                  className="w-full py-2.5 pl-3.5 pr-16 rounded-full bg-[#17161A] border border-white/[0.08] text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#F472B6]/50 transition"
                />

                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center space-x-1 text-neutral-400">
                  <button type="button" className="p-1 hover:text-white cursor-pointer" aria-label="Emoji">
                    <Smile className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" className="p-1 hover:text-white cursor-pointer" aria-label="Microphone">
                    <Mic className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={!inputText.trim()}
                className="w-10 h-10 rounded-full bg-[#F472B6] hover:bg-[#f25da8] active:scale-95 disabled:opacity-40 text-white flex items-center justify-center transition cursor-pointer shadow-md shadow-[#F472B6]/25 shrink-0"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Gentle Closure Modal */}
      {isClosureModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
          <div className="rounded-3xl max-w-md w-full p-6 space-y-4 bg-[#17161A] border border-white/15 shadow-2xl">
            <div className="space-y-1 text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center">
                <Coffee className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-base font-semibold text-white tracking-tight pt-2">
                Conclude Conversation with Dignity
              </h3>
              <p className="text-xs text-neutral-400 font-light">
                Sends a courteous closing note that respectfully concludes your interaction without ghosting.
              </p>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsClosureModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-300 hover:text-white bg-white/[0.06] border border-white/[0.08]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteGentleClosure}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#F472B6] hover:bg-[#f25da8]"
              >
                Send Courteous Closure
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
