// ============================================================================
// src/components/SelfMirrorView.tsx
// Universal Compatibility Platform: Relationship Self-Mirror & Decision Engine
// Non-judgmental, psychologically grounded, human-centered decision support
// ============================================================================

import React, { useState } from 'react'
import {
  Sparkles,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Compass,
  ArrowRight,
  TrendingUp,
  Check,
} from 'lucide-react'
import type {
  UniversalUserProfile,
  BoundaryTriageLevel,
  RelationshipBlueprint,
} from '../types'
import {
  DEFAULT_RELATIONSHIP_TRAPS,
  DEFAULT_BOUNDARY_TRIAGE_ITEMS,
} from '../data/relationshipTraps'
import { sounds } from '../utils/sound'

interface SelfMirrorViewProps {
  currentUser: UniversalUserProfile
  onUpdateUser: (updated: UniversalUserProfile) => void
  onNavigateDiscover?: () => void
}

type MirrorTab = 'traps' | 'triage' | 'blueprint' | 'insights'

export const SelfMirrorView: React.FC<SelfMirrorViewProps> = ({
  currentUser,
  onUpdateUser,
  onNavigateDiscover,
}) => {
  const [activeTab, setActiveTab] = useState<MirrorTab>('traps')
  const [saveToast, setSaveToast] = useState<string | null>(null)

  // Acknowledged Traps State
  const [acknowledgedTraps, setAcknowledgedTraps] = useState<string[]>(
    () =>
      currentUser.acknowledgedTraps || [
        'trap_adrenaline_over_safety',
        'trap_ignoring_timeline_mismatch',
      ]
  )

  // Boundary Triage State (mapping attributeId -> 'preference' | 'friction' | 'dealbreaker')
  const [boundaryTriage, setBoundaryTriage] = useState<Record<string, BoundaryTriageLevel>>(
    () => {
      const initial: Record<string, BoundaryTriageLevel> = {}
      DEFAULT_BOUNDARY_TRIAGE_ITEMS.forEach((item) => {
        initial[item.id] = (currentUser.boundaryTriage && currentUser.boundaryTriage[item.id]) || item.level
      })
      return initial
    }
  )

  // Relationship Blueprint State
  const [blueprint, setBlueprint] = useState<RelationshipBlueprint>(() => ({
    partnershipType:
      currentUser.relationshipBlueprint?.partnershipType || 'Deep Companionship & Co-Creation',
    cohabitationVision:
      currentUser.relationshipBlueprint?.cohabitationVision ||
      'Shared home with dedicated quiet nooks',
    financePhilosophy:
      currentUser.relationshipBlueprint?.financePhilosophy ||
      'Proportional shared pool with open transparency',
    reassuranceCadence:
      currentUser.relationshipBlueprint?.reassuranceCadence ||
      'Warm daily check-ins (1–2 thoughtful messages)',
    conflictStyle:
      currentUser.relationshipBlueprint?.conflictStyle ||
      'Needs 20-min cool-down before speaking calmly',
    rechargeStyle:
      currentUser.relationshipBlueprint?.rechargeStyle ||
      'Parallel play (reading/working quietly in the same room)',
  }))

  const triggerToast = (msg: string) => {
    sounds.playTap()
    setSaveToast(msg)
    setTimeout(() => setSaveToast(null), 3000)
  }

  const handleToggleTrap = (trapId: string) => {
    sounds.playTap()
    const updated = acknowledgedTraps.includes(trapId)
      ? acknowledgedTraps.filter((id) => id !== trapId)
      : [...acknowledgedTraps, trapId]

    setAcknowledgedTraps(updated)
    const newUser = {
      ...currentUser,
      acknowledgedTraps: updated,
    }
    onUpdateUser(newUser)
    triggerToast(
      updated.includes(trapId)
        ? 'Pattern added to your active mirror.'
        : 'Pattern removed from mirror.'
    )
  }

  const handleSetTriage = (itemId: string, level: BoundaryTriageLevel) => {
    sounds.playTap()
    const updated = {
      ...boundaryTriage,
      [itemId]: level,
    }
    setBoundaryTriage(updated)
    const newUser = {
      ...currentUser,
      boundaryTriage: updated,
    }
    onUpdateUser(newUser)
    triggerToast(`Boundary calibrated as ${level.toUpperCase()}.`)
  }

  const handleUpdateBlueprint = (field: keyof RelationshipBlueprint, value: string) => {
    sounds.playTap()
    const updated = {
      ...blueprint,
      [field]: value,
    }
    setBlueprint(updated)
    const newUser = {
      ...currentUser,
      relationshipBlueprint: updated,
    }
    onUpdateUser(newUser)
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16">
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-black/90 backdrop-blur-xl border border-white/15 text-xs text-white shadow-2xl flex items-center space-x-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-pink-400" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Header Banner: Clean iOS Aesthetics */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1a1920] to-[#121115] border border-white/10 shadow-xl space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center space-x-2 text-pink-300 font-mono text-xs uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Decision Mirror &amp; Pattern Awareness</span>
        </div>

        <h1 className="text-2xl font-bold text-white tracking-tight">
          Relationship Self-Mirror
        </h1>

        <p className="text-xs text-neutral-300 font-light leading-relaxed max-w-2xl">
          Check does not try to &ldquo;fix you.&rdquo; Instead, it acts as a calm mirror to illuminate where you repeatedly misread others, confuse attraction with compatibility, or compromise core boundaries.
        </p>

        {/* Dynamic Philosophy Pill */}
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-xs font-mono text-neutral-300">
          <span className="text-pink-400 font-semibold">Formula:</span>
          <span>Preference ≠ Manageable Friction ≠ Non-Negotiable Dealbreaker</span>
        </div>
      </div>

      {/* iOS Segmented Navigation Pill */}
      <div className="flex p-1 bg-neutral-900/80 border border-white/10 rounded-2xl overflow-x-auto no-scrollbar gap-1 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('traps')}
          className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl font-medium transition cursor-pointer flex items-center justify-center space-x-2 ${
            activeTab === 'traps'
              ? 'bg-pink-500/20 text-pink-200 border border-pink-500/30 shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-pink-400" />
          <span>Known Traps ({acknowledgedTraps.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('triage')}
          className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl font-medium transition cursor-pointer flex items-center justify-center space-x-2 ${
            activeTab === 'triage'
              ? 'bg-purple-500/20 text-purple-200 border border-purple-500/30 shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Sliders className="w-3.5 h-3.5 text-purple-400" />
          <span>Boundary Triage</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('blueprint')}
          className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl font-medium transition cursor-pointer flex items-center justify-center space-x-2 ${
            activeTab === 'blueprint'
              ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Compass className="w-3.5 h-3.5 text-emerald-400" />
          <span>Relationship Blueprint</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('insights')}
          className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl font-medium transition cursor-pointer flex items-center justify-center space-x-2 ${
            activeTab === 'insights'
              ? 'bg-sky-500/20 text-sky-200 border border-sky-500/30 shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
          <span>Decision Insights</span>
        </button>
      </div>

      {/* ================================================================== */}
      {/* TAB 1: KNOWN DATING TRAPS (Traps I Am Breaking)                   */}
      {/* ================================================================== */}
      {activeTab === 'traps' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between px-1">
            <div>
              <h2 className="text-base font-semibold text-white">
                Dating Traps I Am Actively Choosing to Break
              </h2>
              <p className="text-xs text-neutral-400 font-light mt-0.5">
                Select the recurring patterns that have caused you emotional distress or wasted energy in the past:
              </p>
            </div>
            <span className="text-xs font-mono text-pink-300 bg-pink-500/10 px-2.5 py-1 rounded-full border border-pink-500/20">
              {acknowledgedTraps.length} active trap{acknowledgedTraps.length !== 1 ? 's' : ''} monitored
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {DEFAULT_RELATIONSHIP_TRAPS.map((trap) => {
              const isSelected = acknowledgedTraps.includes(trap.id)
              return (
                <div
                  key={trap.id}
                  onClick={() => handleToggleTrap(trap.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? 'bg-pink-950/20 border-pink-500/40 shadow-lg shadow-pink-950/10'
                      : 'bg-[#17161a] border-white/[0.08] hover:border-white/20'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isSelected ? 'bg-pink-400 animate-pulse' : 'bg-neutral-600'
                          }`}
                        />
                        <h3 className="text-sm font-semibold text-white leading-tight">
                          {trap.title}
                        </h3>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition ${
                          isSelected
                            ? 'bg-pink-500 border-pink-500 text-black'
                            : 'border-white/20 bg-white/5'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                      </div>
                    </div>

                    <p className="text-xs text-neutral-300 font-light leading-relaxed">
                      {trap.summary}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/[0.06] space-y-1.5 text-[11px]">
                    <div className="flex items-start space-x-1.5 text-neutral-400">
                      <span className="font-semibold text-pink-300 shrink-0">The Spark:</span>
                      <span className="italic font-light">{trap.howItFeels}</span>
                    </div>

                    <div className="flex items-start space-x-1.5 text-neutral-400">
                      <span className="font-semibold text-amber-300 shrink-0">The Friction:</span>
                      <span className="font-light">{trap.theHiddenFriction}</span>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="p-2.5 rounded-xl bg-black/40 border border-pink-500/20 text-[11px] text-pink-200/90 font-light italic">
                      &ldquo;{trap.mirrorPrompt}&rdquo;
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* TAB 2: 3-TIER BOUNDARY TRIAGE                                     */}
      {/* ================================================================== */}
      {activeTab === 'triage' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between px-1">
            <div>
              <h2 className="text-base font-semibold text-white">
                3-Tier Boundary Calibration
              </h2>
              <p className="text-xs text-neutral-400 font-light mt-0.5">
                Distinguish your genuine dealbreakers from manageable frictions and flexible preferences:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {DEFAULT_BOUNDARY_TRIAGE_ITEMS.map((item) => {
              const currentLevel = boundaryTriage[item.id] || item.level
              return (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-[#17161a] border border-white/[0.08] space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-semibold text-white">{item.label}</span>
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-white/5 text-neutral-400 border border-white/10">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-300 font-light mt-0.5">
                        {item.description}
                      </p>
                    </div>

                    {/* 3-Tier Segmented Control */}
                    <div className="flex p-0.5 rounded-xl bg-black/50 border border-white/10 text-xs shrink-0">
                      <button
                        type="button"
                        onClick={() => handleSetTriage(item.id, 'preference')}
                        className={`px-3 py-1 rounded-lg transition cursor-pointer text-[11px] font-medium ${
                          currentLevel === 'preference'
                            ? 'bg-sky-500/20 text-sky-200 border border-sky-400/40 shadow-sm'
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        Preference (Flexible)
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSetTriage(item.id, 'friction')}
                        className={`px-3 py-1 rounded-lg transition cursor-pointer text-[11px] font-medium ${
                          currentLevel === 'friction'
                            ? 'bg-amber-500/20 text-amber-200 border border-amber-400/40 shadow-sm'
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        Friction (Manageable)
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSetTriage(item.id, 'dealbreaker')}
                        className={`px-3 py-1 rounded-lg transition cursor-pointer text-[11px] font-medium ${
                          currentLevel === 'dealbreaker'
                            ? 'bg-rose-500/20 text-rose-200 border border-rose-400/40 shadow-sm'
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        Dealbreaker (Hard)
                      </button>
                    </div>
                  </div>

                  <div className="text-[11px] text-neutral-400 font-light border-t border-white/[0.04] pt-2 flex items-center space-x-1.5">
                    <span className="text-neutral-500 font-mono">Real-world insight:</span>
                    <span>{item.manageabilityTip}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* TAB 3: RELATIONSHIP BLUEPRINT                                      */}
      {/* ================================================================== */}
      {activeTab === 'blueprint' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="px-1">
            <h2 className="text-base font-semibold text-white">
              My Relationship Blueprint
            </h2>
            <p className="text-xs text-neutral-400 font-light mt-0.5">
              Turn &ldquo;I want someone good&rdquo; into &ldquo;This is the kind of daily relationship I am actually trying to build&rdquo;:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Partnership Vision */}
            <div className="p-4 rounded-2xl bg-[#17161a] border border-white/[0.08] space-y-2">
              <label className="text-xs font-semibold text-white block">
                Partnership Vision &amp; Direction
              </label>
              <div className="space-y-1.5 text-xs">
                {[
                  'Deep Companionship & Co-Creation',
                  'Committed Marriage & Family Nest',
                  'Independent Togetherness (Living Apart Together)',
                  'Flexible Adventure & Growth',
                ].map((val) => (
                  <div
                    key={val}
                    onClick={() => handleUpdateBlueprint('partnershipType', val)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                      blueprint.partnershipType === val
                        ? 'bg-pink-950/30 border-pink-500/50 text-pink-200'
                        : 'bg-black/30 border-white/[0.06] text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span>{val}</span>
                    {blueprint.partnershipType === val && (
                      <Check className="w-3.5 h-3.5 text-pink-400" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Reassurance Cadence */}
            <div className="p-4 rounded-2xl bg-[#17161a] border border-white/[0.08] space-y-2">
              <label className="text-xs font-semibold text-white block">
                Texting &amp; Reassurance Cadence
              </label>
              <div className="space-y-1.5 text-xs">
                {[
                  'Warm daily check-ins (1–2 thoughtful messages)',
                  'Thoughtful intermittent (fine with a quiet day)',
                  'In-person centered (low texting between dates)',
                ].map((val) => (
                  <div
                    key={val}
                    onClick={() => handleUpdateBlueprint('reassuranceCadence', val)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                      blueprint.reassuranceCadence === val
                        ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200'
                        : 'bg-black/30 border-white/[0.06] text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span>{val}</span>
                    {blueprint.reassuranceCadence === val && (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Conflict & Repair Protocol */}
            <div className="p-4 rounded-2xl bg-[#17161a] border border-white/[0.08] space-y-2">
              <label className="text-xs font-semibold text-white block">
                Conflict &amp; Repair Protocol
              </label>
              <div className="space-y-1.5 text-xs">
                {[
                  'Needs 20-min cool-down before speaking calmly',
                  'Prefers talking it through immediately with care',
                  'Drafts thoughts in writing first to avoid reactivity',
                ].map((val) => (
                  <div
                    key={val}
                    onClick={() => handleUpdateBlueprint('conflictStyle', val)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                      blueprint.conflictStyle === val
                        ? 'bg-purple-950/30 border-purple-500/50 text-purple-200'
                        : 'bg-black/30 border-white/[0.06] text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span>{val}</span>
                    {blueprint.conflictStyle === val && (
                      <Check className="w-3.5 h-3.5 text-purple-400" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Sensory Recharge & Solitude */}
            <div className="p-4 rounded-2xl bg-[#17161a] border border-white/[0.08] space-y-2">
              <label className="text-xs font-semibold text-white block">
                Sensory Recharge &amp; Solitude
              </label>
              <div className="space-y-1.5 text-xs">
                {[
                  'Parallel play (reading/working quietly in the same room)',
                  'Solitary sanctuary (needs 1–2 solo evenings weekly)',
                  'Social host (recharges by hosting and socializing)',
                ].map((val) => (
                  <div
                    key={val}
                    onClick={() => handleUpdateBlueprint('rechargeStyle', val)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                      blueprint.rechargeStyle === val
                        ? 'bg-sky-950/30 border-sky-500/50 text-sky-200'
                        : 'bg-black/30 border-white/[0.06] text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span>{val}</span>
                    {blueprint.rechargeStyle === val && (
                      <Check className="w-3.5 h-3.5 text-sky-400" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* TAB 4: DECISION INSIGHTS                                           */}
      {/* ================================================================== */}
      {activeTab === 'insights' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="px-1">
            <h2 className="text-base font-semibold text-white">
              Real-Time Decision Insights
            </h2>
            <p className="text-xs text-neutral-400 font-light mt-0.5">
              How your actual browsing and connection choices reflect your stated self-awareness:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-[#17161a] border border-white/[0.08] space-y-1">
              <span className="text-[10px] uppercase font-mono text-neutral-400">
                Sparks Contextualized
              </span>
              <p className="text-xl font-bold text-pink-300">4 Candidates</p>
              <p className="text-[11px] text-neutral-400 font-light">
                Paused on high chemistry to examine life-stage compatibility.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#17161a] border border-white/[0.08] space-y-1">
              <span className="text-[10px] uppercase font-mono text-neutral-400">
                Boundary Adherence
              </span>
              <p className="text-xl font-bold text-emerald-400">100%</p>
              <p className="text-[11px] text-neutral-400 font-light">
                Zero compromises made on your non-negotiable dealbreakers.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#17161a] border border-white/[0.08] space-y-1">
              <span className="text-[10px] uppercase font-mono text-neutral-400">
                Clarity Index
              </span>
              <p className="text-xl font-bold text-purple-300">92 / 100</p>
              <p className="text-[11px] text-neutral-400 font-light">
                Low ambiguity; healthy separation of preference vs friction.
              </p>
            </div>
          </div>

          {/* Practical Next Step Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-pink-950/20 via-purple-950/20 to-sky-950/20 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-white">Ready to test in discovery?</h3>
              <p className="text-xs text-neutral-300 font-light">
                Candidate cards in your feed now display a gentle Mirror Check banner whenever a profile touches one of your monitored traps.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                if (onNavigateDiscover) onNavigateDiscover()
              }}
              className="px-5 py-2.5 rounded-full bg-white text-black font-semibold text-xs transition cursor-pointer shadow-md active:scale-95 shrink-0 flex items-center justify-center space-x-1.5"
            >
              <span>Explore Matches</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
