// ============================================================================
// src/components/FirstDateBriefView.tsx
// Universal Compatibility Platform: Date Plan & Sensory Midpoint Suite
// Designed from Mockup Screen 3 (Date Plan) & Mockup Screen 3A (Plan a Date Flow)
// ============================================================================

import React, { useState } from 'react'
import {
  Coffee,
  MapPin,
  Plus,
  ArrowRight,
  Share2,
  Calendar,
} from 'lucide-react'
import type { UniversalUserProfile } from '../types'
import { mockCandidates } from '../data/mockProfiles'
import { sounds } from '../utils/sound'
import { PlanDateModal } from './PlanDateModal'

interface FirstDateBriefViewProps {
  currentUser: UniversalUserProfile
  onSelectCandidate?: (candidate: UniversalUserProfile) => void
}

interface MidpointVenue {
  name: string
  neighborhood: string
  travelTimes: string
  lightingK: number
  noiseDb: number
  suitabilityRationale: string
}

type DatePlanSegment = 'upcoming' | 'plan_with' | 'ideas' | 'past'

export const FirstDateBriefView: React.FC<FirstDateBriefViewProps> = ({
  currentUser: _currentUser,
}) => {
  const [activeSegment, setActiveSegment] = useState<DatePlanSegment>('upcoming')
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>(mockCandidates[0].id)
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false)
  const [modalPartner, setModalPartner] = useState<{ name: string; photo: string }>({
    name: 'Maya',
    photo: mockCandidates[0].identity.photos[0],
  })

  // Upcoming confirmed plan state
  const [upcomingPlan, setUpcomingPlan] = useState<{
    partnerName: string
    partnerPhoto: string
    date: string
    time: string
    venueName: string
    area: string
    venuePhoto: string
  }>({
    partnerName: 'Maya',
    partnerPhoto: mockCandidates[0].identity.photos[0],
    date: 'Saturday, 12 July',
    time: '3:00 PM – 5:00 PM',
    venueName: 'Monmouth Coffee',
    area: 'Covent Garden, London',
    venuePhoto: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
  })

  const candidate = mockCandidates.find((c) => c.id === selectedCandidateId) || mockCandidates[0]

  // Interactive sensory ambiance controls
  const [lightingTemp, setLightingTemp] = useState<number>(2700)
  const [decibelTarget, setDecibelTarget] = useState<number>(42)
  const [selectedMidpointIndex, setSelectedMidpointIndex] = useState<number>(0)

  // Real-World London Transit Midpoints
  const candidateMidpoints: Record<string, MidpointVenue[]> = {
    usr_maya_01: [
      {
        name: 'Monmouth Coffee Company',
        neighborhood: 'Covent Garden / Borough Market',
        travelTimes: 'You: 9m (Northern) · Maya: 12m (Jubilee)',
        lightingK: 2600,
        noiseDb: 42,
        suitabilityRationale: 'Cozy timber booths, warm natural daylight, and quiet corners where you can hear every laugh without shouting.',
      },
      {
        name: 'Tate Modern Espresso Pavilion',
        neighborhood: 'Bankside / Thames Path',
        travelTimes: 'You: 14m (Thames Path) · Maya: 15m (Blackfriars)',
        lightingK: 2800,
        noiseDb: 38,
        suitabilityRationale: 'Scenic riverfront views and calming art spaces; perfect for an unhurried, side-by-side walk where silence never feels awkward.',
      },
    ],
    usr_liam_02: [
      {
        name: 'Whitechapel Gallery Cafe',
        neighborhood: 'Aldgate East',
        travelTimes: 'You: 15m (District) · Liam: 8m (Walk)',
        lightingK: 2700,
        noiseDb: 40,
        suitabilityRationale: 'Peaceful gallery hideaway; gentle background ambiance, warm pots of tea, and zero noisy distractions.',
      },
    ],
  }

  const activeMidpoints = candidateMidpoints[candidate.id] || candidateMidpoints.usr_maya_01

  const handleOpenPlanModal = (name: string, photo: string) => {
    sounds.playTap()
    setModalPartner({ name, photo })
    setIsPlanModalOpen(true)
  }

  const handlePlanCreated = (plan: {
    type: string
    date: string
    time: string
    area: string
    venueName: string
  }) => {
    setUpcomingPlan({
      partnerName: modalPartner.name,
      partnerPhoto: modalPartner.photo,
      date: plan.date,
      time: `${plan.time} – 5:00 PM`,
      venueName: plan.venueName,
      area: plan.area,
      venuePhoto: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
    })
    setActiveSegment('upcoming')
  }

  // Curated date ideas for Mockup Screen 3
  const curatedDateIdeas = [
    {
      title: 'Quiet cafés',
      count: '120+ Ideas',
      photo: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
      tag: 'Cozy & relaxed',
    },
    {
      title: 'Art & culture',
      count: '85+ Ideas',
      photo: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=800&q=80',
      tag: 'Quiet inspiration',
    },
    {
      title: 'Nature walks',
      count: '60+ Ideas',
      photo: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
      tag: 'Fresh air & strolling',
    },
  ]

  // Connections for horizontal row in Mockup Screen 3
  const otherConnections = [
    { name: 'Hannah', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80' },
    { name: 'Sora', photo: mockCandidates[2]?.identity.photos[0] || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80' },
    { name: 'Liam', photo: mockCandidates[1]?.identity.photos[0] || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80' },
  ]

  return (
    <div className="space-y-5 max-w-5xl mx-auto py-1 px-1 sm:px-4 text-white font-sans">
      {/* ==================================================== */}
      {/* 1. DATE PLAN TOP BAR (Mockup Screen 3)               */}
      {/* ==================================================== */}
      <div className="flex items-center justify-between pt-1">
        <h1 className="text-2xl font-bold tracking-tight text-white">Date Plan</h1>

        <button
          type="button"
          onClick={() => handleOpenPlanModal('Maya', mockCandidates[0].identity.photos[0])}
          className="w-9 h-9 rounded-full bg-[#F472B6] hover:bg-[#f25da8] active:scale-95 flex items-center justify-center text-white shadow-md shadow-[#F472B6]/25 transition cursor-pointer"
          aria-label="Create new date plan"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>

      {/* Segment Pills (Mockup Screen 3) */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          type="button"
          onClick={() => {
            sounds.playTap()
            setActiveSegment('upcoming')
          }}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition cursor-pointer shrink-0 ${
            activeSegment === 'upcoming'
              ? 'bg-[#F472B6] text-white font-semibold shadow-md shadow-[#F472B6]/20'
              : 'bg-[#17161A] border border-white/[0.06] text-neutral-400 hover:text-white'
          }`}
        >
          Upcoming (1)
        </button>
        <button
          type="button"
          onClick={() => {
            sounds.playTap()
            setActiveSegment('plan_with')
          }}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition cursor-pointer shrink-0 ${
            activeSegment === 'plan_with'
              ? 'bg-[#F472B6] text-white font-semibold shadow-md shadow-[#F472B6]/20'
              : 'bg-[#17161A] border border-white/[0.06] text-neutral-400 hover:text-white'
          }`}
        >
          Plan with
        </button>
        <button
          type="button"
          onClick={() => {
            sounds.playTap()
            setActiveSegment('ideas')
          }}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition cursor-pointer shrink-0 ${
            activeSegment === 'ideas'
              ? 'bg-[#F472B6] text-white font-semibold shadow-md shadow-[#F472B6]/20'
              : 'bg-[#17161A] border border-white/[0.06] text-neutral-400 hover:text-white'
          }`}
        >
          Ideas
        </button>
        <button
          type="button"
          onClick={() => {
            sounds.playTap()
            setActiveSegment('past')
          }}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition cursor-pointer shrink-0 ${
            activeSegment === 'past'
              ? 'bg-[#F472B6] text-white font-semibold shadow-md shadow-[#F472B6]/20'
              : 'bg-[#17161A] border border-white/[0.06] text-neutral-400 hover:text-white'
          }`}
        >
          Past
        </button>
      </div>

      {/* ==================================================== */}
      {/* 2. SEGMENT VIEW: UPCOMING (Mockup Screen 3)          */}
      {/* ==================================================== */}
      {activeSegment === 'upcoming' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Upcoming Date Card */}
          <div className="p-4 sm:p-5 rounded-3xl bg-[#17161A] border border-white/[0.08] shadow-2xl space-y-3.5">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                {upcomingPlan.date}
              </h2>
              <span className="text-xs text-neutral-400 font-mono">
                {upcomingPlan.time}
              </span>
            </div>

            {/* Inner Venue Box */}
            <div className="p-3.5 rounded-2xl bg-[#0F0E11] border border-white/[0.06] flex items-center justify-between space-x-3">
              <div className="flex items-center space-x-3 truncate">
                <img
                  src={upcomingPlan.partnerPhoto}
                  alt={upcomingPlan.partnerName}
                  className="w-12 h-12 rounded-full object-cover ring-1 ring-white/15 shrink-0"
                />
                <div className="space-y-0.5 truncate">
                  <h3 className="text-xs font-semibold text-white">
                    {upcomingPlan.partnerName}
                  </h3>
                  <div className="flex items-center space-x-1 text-[11px] text-neutral-300">
                    <Coffee className="w-3 h-3 text-[#F472B6]" />
                    <span>Casual café</span>
                  </div>
                  <div className="flex items-center space-x-1 text-[11px] text-neutral-400 truncate">
                    <MapPin className="w-3 h-3 text-neutral-500 shrink-0" />
                    <span className="truncate">{upcomingPlan.area}</span>
                  </div>
                </div>
              </div>

              <img
                src={upcomingPlan.venuePhoto}
                alt={upcomingPlan.venueName}
                className="w-16 h-16 rounded-xl object-cover shrink-0 border border-white/10"
              />
            </div>

            {/* Action Buttons (Details, Edit, Share) */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  sounds.playTap()
                  setActiveSegment('ideas')
                }}
                className="py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-medium text-neutral-300 hover:text-white transition cursor-pointer text-center"
              >
                Details
              </button>
              <button
                type="button"
                onClick={() => handleOpenPlanModal(upcomingPlan.partnerName, upcomingPlan.partnerPhoto)}
                className="py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-medium text-neutral-300 hover:text-white transition cursor-pointer text-center"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => sounds.playLike()}
                className="py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-medium text-neutral-300 hover:text-white transition cursor-pointer text-center flex items-center justify-center space-x-1"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>
            </div>
          </div>

          {/* Section: Plan with another connection (Mockup Screen 3) */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white tracking-tight">
              Plan with another connection
            </h3>

            <div className="flex items-center space-x-4 overflow-x-auto pb-1 no-scrollbar">
              {otherConnections.map((conn) => (
                <div
                  key={conn.name}
                  onClick={() => {
                    const match = mockCandidates.find((c) => c.identity.name.startsWith(conn.name))
                    if (match) setSelectedCandidateId(match.id)
                    handleOpenPlanModal(conn.name, conn.photo)
                  }}
                  className="flex flex-col items-center space-y-1.5 cursor-pointer group shrink-0"
                >
                  <img
                    src={conn.photo}
                    alt={conn.name}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-white/15 group-hover:ring-[#F472B6] transition-all"
                  />
                  <span className="text-xs text-neutral-300 font-medium">{conn.name}</span>
                </div>
              ))}

              <div
                onClick={() => setActiveSegment('plan_with')}
                className="flex flex-col items-center space-y-1.5 cursor-pointer group shrink-0"
              >
                <div className="w-14 h-14 rounded-full bg-[#17161A] border border-white/15 flex items-center justify-center text-neutral-400 group-hover:text-white group-hover:border-[#F472B6] transition-all">
                  <ArrowRight className="w-5 h-5" />
                </div>
                <span className="text-xs text-neutral-400 font-medium">View all</span>
              </div>
            </div>
          </div>

          {/* Section: Date ideas for you (Mockup Screen 3) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white tracking-tight">
                Date ideas for you
              </h3>
              <button
                type="button"
                onClick={() => setActiveSegment('ideas')}
                className="text-xs text-[#F472B6] hover:underline font-medium cursor-pointer"
              >
                See all &gt;
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {curatedDateIdeas.map((idea) => (
                <div
                  key={idea.title}
                  onClick={() => setActiveSegment('ideas')}
                  className="rounded-2xl overflow-hidden bg-[#17161A] border border-white/[0.08] hover:border-white/20 transition cursor-pointer group shadow-lg"
                >
                  <div className="h-32 relative overflow-hidden">
                    <img
                      src={idea.photo}
                      alt={idea.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] text-white font-mono">
                      {idea.count}
                    </span>
                  </div>
                  <div className="p-3">
                    <h4 className="text-xs font-bold text-white">{idea.title}</h4>
                    <span className="text-[11px] text-neutral-400">{idea.tag}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 3. SEGMENT VIEW: IDEAS (Rich Sensory Blueprint)     */}
      {/* ==================================================== */}
      {activeSegment === 'ideas' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-4 rounded-3xl bg-[#17161A] border border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#F472B6]">
                  Acoustic &amp; Sensory Intelligence
                </span>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Curated Calm Midpoints
                </h3>
              </div>
              <span className="text-xs font-mono text-neutral-400">
                {activeMidpoints.length} verified spots
              </span>
            </div>

            <div className="space-y-3">
              {activeMidpoints.map((midpoint, idx) => {
                const isSelected = selectedMidpointIndex === idx
                return (
                  <div
                    key={midpoint.name}
                    onClick={() => {
                      sounds.playTap()
                      setSelectedMidpointIndex(idx)
                      setLightingTemp(midpoint.lightingK)
                      setDecibelTarget(midpoint.noiseDb)
                    }}
                    className={`p-4 rounded-2xl border transition cursor-pointer space-y-2 ${
                      isSelected
                        ? 'bg-[#F472B6]/10 border-[#F472B6]'
                        : 'bg-[#0F0E11] border-white/[0.06] hover:border-white/15'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-[#F472B6]" />
                        <h4 className="text-xs font-bold text-white">{midpoint.name}</h4>
                      </div>
                      <span className="text-[10px] font-mono text-neutral-400">
                        {midpoint.noiseDb} dB • {midpoint.lightingK}K
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-300 font-light">{midpoint.travelTimes}</p>
                    <p className="text-xs text-neutral-400 font-light">{midpoint.suitabilityRationale}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Sensory Simulator */}
          <div className="p-4 rounded-3xl bg-[#17161A] border border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white">Atmosphere Simulator</span>
              <span className="text-xs font-mono text-[#F472B6]">{lightingTemp}K • {decibelTarget} dB</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs text-neutral-300">
              <div className="p-3 rounded-2xl bg-[#0F0E11] border border-white/[0.06]">
                <span className="text-[10px] text-neutral-400 block mb-1">Ambient Sound Target</span>
                <span className="font-semibold text-white">{decibelTarget} dB (Gentle conversation)</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#0F0E11] border border-white/[0.06]">
                <span className="text-[10px] text-neutral-400 block mb-1">Warmth Level</span>
                <span className="font-semibold text-white">{lightingTemp}K (Intimate amber)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 4. SEGMENT VIEW: PLAN WITH (Connections Launcher)   */}
      {/* ==================================================== */}
      {activeSegment === 'plan_with' && (
        <div className="space-y-3 animate-in fade-in duration-200">
          <div className="p-4 rounded-3xl bg-[#17161A] border border-white/[0.08] space-y-3">
            <h3 className="text-sm font-bold text-white">Mutual Connections Available</h3>
            <div className="space-y-2">
              {mockCandidates.slice(0, 4).map((c) => (
                <div
                  key={c.id}
                  className="p-3 rounded-2xl bg-[#0F0E11] border border-white/[0.06] flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={c.identity.photos[0]}
                      alt={c.identity.name}
                      className="w-10 h-10 rounded-full object-cover ring-1 ring-white/15"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white">{c.identity.name}</h4>
                      <span className="text-[10px] text-neutral-400">{c.geography.cityName}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenPlanModal(c.identity.name, c.identity.photos[0])}
                    className="px-3 py-1.5 rounded-full bg-[#F472B6] hover:bg-[#f25da8] active:scale-95 text-xs font-semibold text-white transition cursor-pointer"
                  >
                    Plan Date
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 5. SEGMENT VIEW: PAST (Completed History)            */}
      {/* ==================================================== */}
      {activeSegment === 'past' && (
        <div className="p-8 rounded-3xl bg-[#17161A] border border-white/[0.08] text-center space-y-2 animate-in fade-in duration-200">
          <Calendar className="w-8 h-8 text-neutral-500 mx-auto" />
          <h3 className="text-sm font-semibold text-white">No past dates yet</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto font-light">
            When you complete a meeting, your reflection notes and courteous check-ins will appear here.
          </p>
        </div>
      )}

      {/* Interactive 3-Step Plan Date Modal (Mockup 3A) */}
      <PlanDateModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        partnerName={modalPartner.name}
        partnerPhoto={modalPartner.photo}
        onPlanCreated={handlePlanCreated}
      />
    </div>
  )
}
