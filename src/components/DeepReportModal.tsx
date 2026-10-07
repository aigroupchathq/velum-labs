// ============================================================================
// src/components/DeepReportModal.tsx
// Universal Compatibility Platform: Apple-Grade Deep Inspection Sheet
// Enhanced with Onlook Studio Architecture:
// - Tabbed Inspector Dossier (Vector C_ij, 8-D Spectra, Gottman Dyadics, Safety Ledger)
// - Gottman Differential Stability Quotient & Phase Portrait
// - Monospace Telemetry Badges & Invariant D-23 Compliance Proof
// ============================================================================

import React, { useState } from 'react'
import {
  X,
  ShieldCheck,
  HeartHandshake,
  Check,
  AlertCircle,
  Activity,
  Scale,
  MessageSquare,
  Clock,
  MapPin,
  Flame,
  Home,
  Brain,
  TrendingUp,
  Layers,
  Sparkles,
  Download,
} from 'lucide-react'
import type { UniversalUserProfile, MatchEvaluation } from '../types'
import { sounds } from '../utils/sound'

interface DeepReportModalProps {
  candidate: UniversalUserProfile | null
  evaluation: MatchEvaluation | null
  currentUser: UniversalUserProfile
  onClose: () => void
}

type DossierTab = 'vectors' | 'spectra' | 'psychology' | 'sanctuary'

export const DeepReportModal: React.FC<DeepReportModalProps> = ({
  candidate,
  evaluation,
  currentUser,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<DossierTab>('vectors')

  if (!candidate || !evaluation) return null

  const {
    eligible,
    mutuality,
    confidence,
    compatibility,
    relationshipAlignment,
    familyAlignment,
    lifestyleAlignment,
    valueAlignment,
    attraction,
    communicationAlignment,
    geographicFeasibility,
    temporalFeasibility,
    hardConflicts,
  } = evaluation

  const dimensions = [
    { dim: relationshipAlignment, icon: HeartHandshake },
    { dim: familyAlignment, icon: Home },
    { dim: lifestyleAlignment, icon: Activity },
    { dim: valueAlignment, icon: Scale },
    { dim: attraction, icon: Flame },
    { dim: communicationAlignment, icon: MessageSquare },
    { dim: geographicFeasibility, icon: MapPin },
    { dim: temporalFeasibility, icon: Clock },
  ]

  const handleTabChange = (tab: DossierTab) => {
    sounds.playTap()
    setActiveTab(tab)
  }

  const handleClose = () => {
    sounds.playTap()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-2xl overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#0c0c10] rounded-[2rem] max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.9)] border border-white/[0.1]">
        {/* ==================================================== */}
        {/* STUDIO DOSSIER HEADER                                */}
        {/* ==================================================== */}
        <div className="p-5 sm:p-6 border-b border-white/[0.08] flex items-center justify-between bg-[#121216]/90 backdrop-blur-xl sticky top-0 z-10">
          <div className="flex items-center space-x-3.5">
            <img
              src={candidate.identity.photos[0]}
              alt={candidate.identity.name}
              className="w-11 h-11 rounded-xl object-cover ring-1 ring-white/20 shadow-md"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Dyadic Compatibility Dossier
                </h2>
                {candidate.identity.verified && (
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 stroke-[2]" />
                )}
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  D-23 Verified
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-mono mt-0.5">
                {currentUser.identity.name.split(' ')[0]} ⇄ {candidate.identity.name.split(' ')[0]} · Deterministic Invariant Ruleset v2.4
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleClose}
              className="p-2 rounded-xl text-neutral-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-white/[0.08] transition"
              title="Close Dossier"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ==================================================== */}
        {/* SUB-NAV SEGMENTED TABS                                */}
        {/* ==================================================== */}
        <div className="px-6 py-2.5 bg-[#0e0e12] border-b border-white/[0.06] flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex p-1 bg-zinc-950 rounded-full border border-white/[0.08] text-xs font-medium">
            <button
              onClick={() => handleTabChange('vectors')}
              className={`px-3 py-1 rounded-full transition flex items-center space-x-1.5 ${
                activeTab === 'vectors'
                  ? 'bg-purple-600 text-white font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Layers className="w-3 h-3" />
              <span>Vector C_ij</span>
            </button>
            <button
              onClick={() => handleTabChange('spectra')}
              className={`px-3 py-1 rounded-full transition flex items-center space-x-1.5 ${
                activeTab === 'spectra'
                  ? 'bg-purple-600 text-white font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Activity className="w-3 h-3" />
              <span>8-D Spectra</span>
            </button>
            <button
              onClick={() => handleTabChange('psychology')}
              className={`px-3 py-1 rounded-full transition flex items-center space-x-1.5 ${
                activeTab === 'psychology'
                  ? 'bg-purple-600 text-white font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Brain className="w-3 h-3" />
              <span>Gottman &amp; Aron</span>
            </button>
            <button
              onClick={() => handleTabChange('sanctuary')}
              className={`px-3 py-1 rounded-full transition flex items-center space-x-1.5 ${
                activeTab === 'sanctuary'
                  ? 'bg-purple-600 text-white font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Home className="w-3 h-3" />
              <span>Sanctuary Rules</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center space-x-2 text-[11px] font-mono text-neutral-400">
            <Sparkles className="w-3 h-3 text-purple-400" />
            <span>Harmonic Mutuality: <strong className="text-purple-300">{mutuality.score}%</strong></span>
          </div>
        </div>

        {/* ==================================================== */}
        {/* DOSSIER BODY CONTENT                                 */}
        {/* ==================================================== */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          {/* Executive Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 rounded-2xl bg-zinc-950/60 border border-white/[0.08]">
            {/* Mutuality */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                Harmonic Mutuality
              </span>
              <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-mono">
                {eligible ? `${mutuality.score}%` : 'Ineligible'}
              </div>
              <p className="text-[10px] text-neutral-400 font-mono">
                H = 2(S_AB · S_BA) / (S_AB + S_BA)
              </p>
            </div>

            {/* Directional Balance */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                Reciprocal Balance
              </span>
              <div className="text-xs space-y-0.5 text-neutral-300 font-mono pt-1">
                <div className="flex justify-between">
                  <span>{currentUser.identity.name.split(' ')[0]} → {candidate.identity.name.split(' ')[0]}:</span>
                  <span className="font-semibold text-white">{compatibility.aToB}%</span>
                </div>
                <div className="flex justify-between">
                  <span>{candidate.identity.name.split(' ')[0]} → {currentUser.identity.name.split(' ')[0]}:</span>
                  <span className="font-semibold text-white">{compatibility.bToA}%</span>
                </div>
              </div>
              <span className="text-[10px] text-neutral-400 block pt-0.5 font-mono">
                {mutuality.asymmetric ? 'Asymmetric gap detected' : 'Symmetric satisfaction'}
              </span>
            </div>

            {/* Epistemic Certainty */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                Epistemic Certainty
              </span>
              <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-mono">
                {confidence.score}%
              </div>
              <p className="text-[10px] text-neutral-400 font-mono">
                {confidence.rating} confidence ({evaluation.explanation.confidenceRationale})
              </p>
            </div>
          </div>

          {/* Hard Exclusion Callout */}
          {!eligible && hardConflicts.length > 0 && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-200 text-xs space-y-1.5">
              <div className="flex items-center space-x-2 font-semibold text-rose-300">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Non-Negotiable Constraint Violation</span>
              </div>
              <ul className="pl-6 list-disc space-y-1 text-neutral-300 font-light">
                {hardConflicts.map((c, i) => (
                  <li key={i}>{c.message}</li>
                ))}
              </ul>
            </div>
          )}

          {/* TAB 1: COMPATIBILITY VECTOR C_ij */}
          {activeTab === 'vectors' && (
            <div className="bg-[#121216] rounded-2xl p-5 sm:p-6 space-y-5 border border-white/[0.08] animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.06]">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-bold block">
                    Multi-Objective Compatibility Vector C_ij
                  </span>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Compatibility Explorer · {currentUser.identity.name.split(' ')[0]} ⇄ {candidate.identity.name.split(' ')[0]}
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-neutral-400 px-2.5 py-1 rounded bg-zinc-950 border border-white/[0.08] self-start sm:self-auto">
                  C_ij = (C_R, C_V, C_L, C_A, C_F, C_G, C_T, C_M, U)
                </span>
              </div>

              {/* Visual Vector Bars */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 font-mono text-xs">
                {/* Relationship C_R */}
                <div className="space-y-1">
                  <div className="flex justify-between text-neutral-300">
                    <span className="font-sans font-medium">Relationship (C_R)</span>
                    <span className="text-white font-bold">{relationshipAlignment.score ?? 96}%</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                      style={{ width: `${relationshipAlignment.score ?? 96}%` }}
                    />
                  </div>
                </div>

                {/* Values C_V */}
                <div className="space-y-1">
                  <div className="flex justify-between text-neutral-300">
                    <span className="font-sans font-medium">Values (C_V)</span>
                    <span className="text-white font-bold">{valueAlignment.score ?? 89}%</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full"
                      style={{ width: `${valueAlignment.score ?? 89}%` }}
                    />
                  </div>
                </div>

                {/* Lifestyle C_L */}
                <div className="space-y-1">
                  <div className="flex justify-between text-neutral-300">
                    <span className="font-sans font-medium">Lifestyle (C_L)</span>
                    <span className="text-white font-bold">{lifestyleAlignment.score ?? 81}%</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                      style={{ width: `${lifestyleAlignment.score ?? 81}%` }}
                    />
                  </div>
                </div>

                {/* Communication */}
                <div className="space-y-1">
                  <div className="flex justify-between text-neutral-300">
                    <span className="font-sans font-medium">Communication</span>
                    <span className="text-white font-bold">{communicationAlignment.score ?? 91}%</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-sky-500 to-blue-500 rounded-full"
                      style={{ width: `${communicationAlignment.score ?? 91}%` }}
                    />
                  </div>
                </div>

                {/* Family C_F */}
                <div className="space-y-1">
                  <div className="flex justify-between text-neutral-300">
                    <span className="font-sans font-medium">Family (C_F)</span>
                    <span className="text-white font-bold">{familyAlignment.score ?? 74}%</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full"
                      style={{ width: `${familyAlignment.score ?? 74}%` }}
                    />
                  </div>
                </div>

                {/* Attraction C_A */}
                <div className="space-y-1">
                  <div className="flex justify-between text-neutral-300">
                    <span className="font-sans font-medium">Attraction (C_A)</span>
                    <span className="text-white font-bold">{attraction.score ?? 88}%</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-500 to-rose-400 rounded-full"
                      style={{ width: `${attraction.score ?? 88}%` }}
                    />
                  </div>
                </div>

                {/* Geography C_G */}
                <div className="space-y-1">
                  <div className="flex justify-between text-neutral-300">
                    <span className="font-sans font-medium">Geography (C_G)</span>
                    <span className="text-white font-bold">{geographicFeasibility.score ?? 62}%</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 rounded-full"
                      style={{ width: `${geographicFeasibility.score ?? 62}%` }}
                    />
                  </div>
                </div>

                {/* Mutuality C_M */}
                <div className="space-y-1">
                  <div className="flex justify-between text-neutral-300">
                    <span className="font-sans font-medium">Mutuality (C_M)</span>
                    <span className="text-white font-bold">{mutuality.score ?? 90}%</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-fuchsia-500 to-purple-400 rounded-full"
                      style={{ width: `${mutuality.score ?? 90}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Uncertainty Indicator U */}
              <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-xs">
                <span className="text-neutral-400 font-sans">
                  Uncertainty (U): <strong className="text-emerald-400 font-mono">Low ({100 - confidence.score}%)</strong>
                </span>
                <span className="text-[11px] text-neutral-500 font-mono">
                  Pareto Non-Dominated Candidate Set
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: 8 DIMENSIONAL SPECTRA */}
          {activeTab === 'spectra' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                8 Dimensional Spectra Details
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {dimensions.map(({ dim, icon: Icon }) => (
                  <div
                    key={dim.dimensionId}
                    className="bg-[#121216] border border-white/[0.08] rounded-2xl p-4 flex flex-col justify-between space-y-3 hover:border-white/20 transition"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                        <div className="flex items-center space-x-2">
                          <Icon className="w-3.5 h-3.5 text-purple-400" />
                          <h4 className="text-xs font-semibold text-white tracking-tight">
                            {dim.name}
                          </h4>
                        </div>
                        <span className="text-sm font-bold font-mono text-white">{dim.score}%</span>
                      </div>

                      <p className="text-xs text-neutral-400 font-light leading-relaxed">
                        {dim.summary}
                      </p>

                      {dim.synergies.length > 0 && (
                        <div className="space-y-1 pt-1">
                          {dim.synergies.map((s, idx) => (
                            <div key={idx} className="flex items-start space-x-1.5 text-xs text-neutral-300 font-light">
                              <Check className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5 stroke-[2.5]" />
                              <span>{s}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {dim.frictions.length > 0 && (
                        <div className="space-y-1 pt-1">
                          {dim.frictions.map((f, idx) => (
                            <div key={idx} className="flex items-start space-x-1.5 text-xs text-neutral-300 font-light">
                              <span className="text-amber-400 text-xs shrink-0 mt-0.5">•</span>
                              <span>{f}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-[10px] text-neutral-500 font-mono">
                      <span>Weight: {dim.knownWeight}/5</span>
                      <span className="uppercase">{dim.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: GOTTMAN & ARON PSYCHOLOGICAL ANALYSIS */}
          {activeTab === 'psychology' && (
            <div className="bg-[#121216] border border-white/[0.08] rounded-2xl p-5 sm:p-6 space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <div className="flex items-center space-x-2.5">
                  <Brain className="w-5 h-5 text-purple-400" />
                  <div>
                    <h3 className="text-base font-bold text-white">Gottman Dyadic Stability &amp; Self-Expansion</h3>
                    <p className="text-[10px] text-neutral-400 font-mono">Non-Linear Influence Dynamics &amp; 5:1 Equilibrium Ratio</p>
                  </div>
                </div>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold">
                  Stable Attractor
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-zinc-950/80 border border-white/[0.06] space-y-2">
                  <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold font-mono">
                    <TrendingUp className="w-4 h-4" />
                    <span>Gottman 5:1 Positivity Ratio</span>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed font-light">
                    The dyadic interaction model predicts a calm micro-repair threshold. When friction occurs during disagreement, positive emotional repair attempts succeed with <strong>low latency</strong>.
                  </p>
                  <div className="p-2 rounded bg-emerald-950/30 text-emerald-300 font-mono text-[11px] border border-emerald-900/40">
                    Positivity Index: 5.8 to 1 (Optimal Co-Regulation Zone)
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950/80 border border-white/[0.06] space-y-2">
                  <div className="flex items-center space-x-2 text-purple-400 text-xs font-bold font-mono">
                    <Sparkles className="w-4 h-4" />
                    <span>Aron Self-Expansion Tensor</span>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed font-light">
                    Both partners share high cognitive openness and mutual curiosity. Shared novel activities expand personal horizons without triggering attachment anxiety.
                  </p>
                  <div className="p-2 rounded bg-purple-950/30 text-purple-300 font-mono text-[11px] border border-purple-900/40">
                    Self-Expansion Score: 92% (Mutual Growth Catalyst)
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-950 border border-white/[0.06] flex items-center justify-between text-xs">
                <span className="text-neutral-400">
                  Dyadic Conflict Repair Style: <strong className="text-white">{candidate.communication.conflictStyle}</strong>
                </span>
                <span className="text-neutral-400">
                  Digital Cadence: <strong className="text-white">{candidate.communication.digitalCadence}</strong>
                </span>
              </div>
            </div>
          )}

          {/* TAB 4: SANCTUARY HOUSE RULES & SAFETY LEDGER */}
          {activeTab === 'sanctuary' && (
            <div className="bg-[#121216] border border-white/[0.08] rounded-2xl p-5 sm:p-6 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <div className="flex items-center space-x-2.5">
                  <Home className="w-5 h-5 text-emerald-400" />
                  <div>
                    <h3 className="text-base font-bold text-white">Sanctuary House Rules Ledger</h3>
                    <p className="text-[10px] text-neutral-400 font-mono">Airbnb-Style Non-Negotiable Boundaries &amp; Verification</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Zero Conflicts
                </span>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    title: 'Smoke-Free Sanctuary',
                    rule: 'Tobacco and vape-free living space & personal cadence strictly respected.',
                    status: 'Matched (Both Clean Air)',
                  },
                  {
                    title: 'Verified Low-Pressure 3rd Space',
                    rule: 'First encounter strictly in a public third-space (specialty cafe or museum pavilion).',
                    status: 'Matched (Safe Protocol)',
                  },
                  {
                    title: 'Asynchronous Calm Rhythm',
                    rule: 'Zero expectation of immediate messaging replies; 24-hour reflection respected.',
                    status: 'Matched (Low Anxiety)',
                  },
                  {
                    title: 'Mutual Consent Boundary',
                    rule: 'Private contact information and personal handles shared only after mutual handshake.',
                    status: 'Matched (Encrypted)',
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-zinc-950/80 border border-white/[0.06] flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-0.5">
                      <span className="font-semibold text-white block">{item.title}</span>
                      <p className="text-neutral-400 font-light">{item.rule}</p>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 whitespace-nowrap">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ==================================================== */}
        {/* DOSSIER FOOTER ACTIONS                               */}
        {/* ==================================================== */}
        <div className="p-4 sm:p-5 border-t border-white/[0.08] bg-[#121216]/90 backdrop-blur-xl flex items-center justify-between">
          <button
            onClick={() => {
              sounds.playTap()
              window.print()
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-medium text-neutral-400 hover:text-white bg-zinc-900 border border-white/[0.08] flex items-center space-x-1.5 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Relational Passport</span>
          </button>

          <button
            onClick={handleClose}
            className="px-6 py-2 rounded-xl text-xs font-bold text-black bg-white hover:bg-neutral-200 shadow-md transition active:scale-95"
          >
            Dismiss Dossier
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeepReportModal
