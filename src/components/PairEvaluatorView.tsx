// ============================================================================
// src/components/PairEvaluatorView.tsx
// Universal Compatibility Platform: Dyadic Combination Inspector & All-Match Matrix
// Explores all possible N x N dyadic combinations across diverse personas and scenarios
// ============================================================================

import React, { useState } from 'react'
import {
  ArrowRightLeft,
  AlertCircle,
  Code,
  Copy,
  Check,
  Grid,
  Zap,
  UserCheck,
  Sliders,
} from 'lucide-react'
import { evaluateMatch } from '../utils/matchingEngine'
import type { UniversalUserProfile } from '../types'

interface PairEvaluatorProps {
  currentUser: UniversalUserProfile
  candidates: UniversalUserProfile[]
}

export const PairEvaluatorView: React.FC<PairEvaluatorProps> = ({
  currentUser,
  candidates,
}) => {
  const allProfiles = [currentUser, ...candidates]
  const [profileAId, setProfileAId] = useState<string>(currentUser.id)
  const [profileBId, setProfileBId] = useState<string>(candidates[0]?.id || currentUser.id)
  const [copied, setCopied] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<'matrix' | 'inspector'>('matrix')
  const [matrixFilter, setMatrixFilter] = useState<'all' | 'intergenerational' | 'high_resonance' | 'zero_floor'>('all')

  const profileA = allProfiles.find((p) => p.id === profileAId) || currentUser
  const profileB = allProfiles.find((p) => p.id === profileBId) || candidates[0]

  const evaluation = evaluateMatch(profileA, profileB)

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(evaluation, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Pre-calculate the entire N x N matrix evaluations
  const matrixData = allProfiles.flatMap((pA) =>
    allProfiles.map((pB) => {
      const isSelf = pA.id === pB.id
      const evalResult = isSelf ? null : evaluateMatch(pA, pB)
      const ageGap = Math.abs(pA.identity.age - pB.identity.age)
      return {
        pA,
        pB,
        isSelf,
        evalResult,
        ageGap,
      }
    })
  )

  // Filter matrix cells based on scenario
  const filteredCells = matrixData.filter(({ isSelf, evalResult, ageGap }) => {
    if (isSelf || !evalResult) return false
    if (matrixFilter === 'intergenerational') return ageGap >= 15
    if (matrixFilter === 'high_resonance') return evalResult.eligible && (evalResult.mutuality.score || 0) >= 80
    if (matrixFilter === 'zero_floor') return !evalResult.eligible || evalResult.mutuality.score === 0
    return true
  })

  // Quick pairing preset scenarios
  const canonicalPairs = [
    { label: 'Arthur (66) ↔ Chloe (20)', idA: 'usr_arthur_66', idB: 'usr_chloe_20', desc: 'Intergenerational Caucasian dyad' },
    { label: 'Elena (30) ↔ Maya (31)', idA: 'usr_elena_current', idB: 'usr_maya_01', desc: 'High twin resonance (95%)' },
    { label: 'Tariq (42) ↔ Isabella (24)', idA: 'usr_tariq_42', idB: 'usr_isabella_24', desc: 'Middle Eastern patron & Latina artist' },
    { label: 'Devon (38) ↔ Elena (30)', idA: 'usr_devon_38', idB: 'usr_elena_current', desc: 'ENM vs Monogamy dealbreaker test' },
    { label: 'Helena (58) ↔ Arthur (66)', idA: 'usr_helena_58', idB: 'usr_arthur_66', desc: 'Distinguished chapter senior dyad' },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-2">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.07] pb-5">
        <div className="space-y-1">
          <span className="apple-subhead">Combinatorial Resonance Intelligence</span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Dyadic Combination Inspector ({allProfiles.length} Profiles · {allProfiles.length * (allProfiles.length - 1)} Pairs)
          </h1>
          <p className="text-xs text-neutral-400 font-light max-w-2xl leading-relaxed">
            Inspect all possible dyadic pairings across diverse age horizons, relationship structures, diets, and cultural backgrounds. Zero pay-to-win bias mathematically proven.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="apple-segmented-control flex items-center shrink-0">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`apple-pill-btn px-4 py-2 text-xs font-semibold flex items-center space-x-1.5 ${
              activeTab === 'matrix' ? 'bg-white text-black shadow-md' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Full Dyad Matrix</span>
          </button>
          <button
            onClick={() => setActiveTab('inspector')}
            className={`apple-pill-btn px-4 py-2 text-xs font-semibold flex items-center space-x-1.5 ${
              activeTab === 'inspector' ? 'bg-white text-black shadow-md' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Pair Inspector</span>
          </button>
        </div>
      </div>

      {/* ── CANONICAL COMBINATION PRESETS ── */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-neutral-300 block">
          Canonical Combination Benchmarks (Click to inspect dyad live)
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {canonicalPairs.map((cp, i) => (
            <button
              key={i}
              onClick={() => {
                setProfileAId(cp.idA)
                setProfileBId(cp.idB)
                setActiveTab('inspector')
              }}
              className="p-3.5 rounded-2xl border text-left transition-all duration-300 bg-white/[0.02] border-white/[0.07] hover:border-white/20 hover:bg-white/[0.05] group space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {cp.label}
                </span>
                <Zap className="w-3 h-3 text-neutral-500 group-hover:text-emerald-400" />
              </div>
              <p className="text-[10px] text-neutral-400 font-light truncate">{cp.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* ── TAB 1: FULL DYAD MATRIX (ALL COMBINATIONS) ── */}
      {activeTab === 'matrix' && (
        <div className="space-y-6 fade-in-up">
          {/* Matrix Filter Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: `All Pairs (${allProfiles.length * (allProfiles.length - 1)})` },
                { id: 'intergenerational', label: 'Intergenerational (Age Gap ≥ 15 yrs)' },
                { id: 'high_resonance', label: 'Twin Resonance (≥ 80%)' },
                { id: 'zero_floor', label: 'Zero-Floor Disqualified' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setMatrixFilter(f.id as typeof matrixFilter)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                    matrixFilter === f.id
                      ? 'bg-white text-black border-white shadow-sm'
                      : 'bg-white/[0.03] text-neutral-400 border-white/[0.08] hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <span className="text-xs font-mono text-neutral-400">
              Showing {filteredCells.length} filtered dyadic combinations
            </span>
          </div>

          {/* Matrix Grid Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredCells.map(({ pA, pB, evalResult, ageGap }, idx) => {
              if (!evalResult) return null
              const score = evalResult.mutuality.score || 0
              const isEligible = evalResult.eligible
              const isSelected = profileAId === pA.id && profileBId === pB.id

              const badgeColor = !isEligible
                ? '#f87171'
                : score >= 80
                ? '#ffffff'
                : score >= 60
                ? '#34d399'
                : '#fbbf24'

              return (
                <div
                  key={idx}
                  onClick={() => {
                    setProfileAId(pA.id)
                    setProfileBId(pB.id)
                    setActiveTab('inspector')
                  }}
                  className="group p-4 rounded-2xl border transition-all duration-300 cursor-pointer relative overflow-hidden space-y-3"
                  style={{
                    background: isSelected ? `${badgeColor}15` : 'rgba(16,16,20,0.85)',
                    borderColor: isSelected ? badgeColor : 'rgba(255,255,255,0.07)',
                    boxShadow: isSelected ? `0 0 20px ${badgeColor}33` : 'none',
                  }}
                >
                  {/* Pair Header */}
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                    <div className="flex items-center space-x-2">
                      <div className="flex -space-x-2">
                        <img
                          src={pA.identity.photos[0]}
                          alt={pA.identity.name}
                          className="w-8 h-8 rounded-full object-cover ring-2 ring-black"
                        />
                        <img
                          src={pB.identity.photos[0]}
                          alt={pB.identity.name}
                          className="w-8 h-8 rounded-full object-cover ring-2 ring-black"
                        />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors block">
                          {pA.identity.name} & {pB.identity.name}
                        </span>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          {pA.identity.age}y & {pB.identity.age}y · Δ {ageGap}y
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className="text-base font-bold font-mono block"
                        style={{ color: badgeColor }}
                      >
                        {isEligible ? `${score}%` : '0%'}
                      </span>
                      <span className="text-[9px] uppercase tracking-widest font-semibold" style={{ color: badgeColor }}>
                        {isEligible ? (score >= 80 ? 'Twin' : 'Fit') : 'Excluded'}
                      </span>
                    </div>
                  </div>

                  {/* Reciprocal directional bars */}
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between text-neutral-400">
                      <span>{pA.identity.name.split(' ')[0]} → {pB.identity.name.split(' ')[0]}</span>
                      <span className="font-mono text-white font-semibold">{evalResult.compatibility.aToB}%</span>
                    </div>
                    <div className="w-full bg-white/[0.06] rounded-full h-1 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${evalResult.compatibility.aToB}%`, backgroundColor: badgeColor }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-neutral-400 pt-0.5">
                      <span>{pB.identity.name.split(' ')[0]} → {pA.identity.name.split(' ')[0]}</span>
                      <span className="font-mono text-white font-semibold">{evalResult.compatibility.bToA}%</span>
                    </div>
                    <div className="w-full bg-white/[0.06] rounded-full h-1 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${evalResult.compatibility.bToA}%`, backgroundColor: badgeColor }}
                      />
                    </div>
                  </div>

                  {/* Footer tag */}
                  <div className="flex items-center justify-between text-[10px] text-neutral-500 font-light pt-1">
                    <span>{pA.lifestyle.diet} × {pB.lifestyle.diet}</span>
                    <span className="group-hover:text-white transition-colors">Inspect Dyad →</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── TAB 2: SINGLE PAIR INSPECTOR ── */}
      {(activeTab === 'inspector' || activeTab === 'matrix') && (
        <div className="space-y-6">
          {/* Profile Selector Console */}
          <div className="apple-panel rounded-3xl p-6 sm:p-7 space-y-6">
            <span className="apple-subhead">Individual Pair Selector</span>
            <div className="grid grid-cols-1 sm:grid-cols-11 gap-4 items-center">
              {/* Subject A Selector */}
              <div className="sm:col-span-5 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="apple-subhead">Subject A</span>
                  {profileA.identity.verified && <UserCheck className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
                <select
                  value={profileAId}
                  onChange={(e) => setProfileAId(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white/30 font-medium cursor-pointer"
                >
                  {allProfiles.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.identity.name} ({p.identity.age}y, {p.lifestyle.diet}, {p.identity.ethnicity || 'Open'})
                    </option>
                  ))}
                </select>
                <div className="text-[11px] text-neutral-400 font-light flex items-center space-x-2">
                  <span>Diet: {profileA.lifestyle.diet}</span>
                  <span>•</span>
                  <span>Smoking: {profileA.lifestyle.smoking}</span>
                </div>
              </div>

              {/* Reverse Button */}
              <div className="sm:col-span-1 flex justify-center py-2 sm:py-0">
                <button
                  onClick={() => {
                    setProfileAId(profileBId)
                    setProfileBId(profileAId)
                  }}
                  title="Reverse Pair Order"
                  className="apple-pill-btn p-3 bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-white shadow-sm"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                </button>
              </div>

              {/* Subject B Selector */}
              <div className="sm:col-span-5 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="apple-subhead">Subject B</span>
                  {profileB.identity.verified && <UserCheck className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
                <select
                  value={profileBId}
                  onChange={(e) => setProfileBId(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white/30 font-medium cursor-pointer"
                >
                  {allProfiles.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.identity.name} ({p.identity.age}y, {p.lifestyle.diet}, {p.identity.ethnicity || 'Open'})
                    </option>
                  ))}
                </select>
                <div className="text-[11px] text-neutral-400 font-light flex items-center space-x-2">
                  <span>Diet: {profileB.lifestyle.diet}</span>
                  <span>•</span>
                  <span>Smoking: {profileB.lifestyle.smoking}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Results Diagnostic Card */}
          <div className="apple-panel rounded-3xl p-6 sm:p-7 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
              <div className="flex items-center space-x-3.5">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-mono font-medium ${
                    evaluation.eligible
                      ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                  }`}
                >
                  {evaluation.eligible ? 'ELIGIBLE DYAD' : 'DISQUALIFIED (ZERO-FLOOR)'}
                </span>

                <div className="text-xs text-neutral-400 font-light">
                  Mutual Score: <strong className="text-white font-semibold font-mono text-sm">{evaluation.mutuality.score}%</strong>
                </div>

                <div className="text-xs text-neutral-400 font-light">
                  Certainty: <strong className="text-white font-semibold font-mono text-sm">{evaluation.confidence.score}%</strong>
                </div>
              </div>

              <button
                onClick={handleCopyJSON}
                className="apple-pill-btn px-3.5 py-1.5 text-xs text-neutral-300 bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] flex items-center space-x-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[2]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy JSON'}</span>
              </button>
            </div>

            {/* Hard Conflicts Callout */}
            {evaluation.hardConflicts.length > 0 && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-200 text-xs space-y-1.5">
                <div className="flex items-center space-x-2 font-semibold text-rose-300">
                  <AlertCircle className="w-4 h-4" />
                  <span>Zero-Floor Boundary Conflicts ({evaluation.hardConflicts.length})</span>
                </div>
                {evaluation.hardConflicts.map((c, i) => (
                  <p key={i} className="pl-6 text-neutral-300 font-light leading-relaxed">
                    [{c.field}] {c.message}
                  </p>
                ))}
              </div>
            )}

            {/* Reciprocal Directional Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="apple-panel rounded-2xl p-5 space-y-2">
                <span className="apple-subhead">
                  Direction A → B ({profileA.identity.name} → {profileB.identity.name})
                </span>
                <div className="text-3xl font-bold font-mono text-white tracking-tight">
                  {evaluation.compatibility.aToB}%
                </div>
                <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-white h-full rounded-full transition-all duration-500"
                    style={{ width: `${evaluation.compatibility.aToB}%` }}
                  />
                </div>
                <p className="text-[11px] text-neutral-400 font-light pt-1">
                  Affinity of {profileA.identity.name} ({profileA.identity.age}y) toward {profileB.identity.name}&apos;s profile.
                </p>
              </div>

              <div className="apple-panel rounded-2xl p-5 space-y-2">
                <span className="apple-subhead">
                  Direction B → A ({profileB.identity.name} → {profileA.identity.name})
                </span>
                <div className="text-3xl font-bold font-mono text-white tracking-tight">
                  {evaluation.compatibility.bToA}%
                </div>
                <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-white h-full rounded-full transition-all duration-500"
                    style={{ width: `${evaluation.compatibility.bToA}%` }}
                  />
                </div>
                <p className="text-[11px] text-neutral-400 font-light pt-1">
                  Affinity of {profileB.identity.name} ({profileB.identity.age}y) toward {profileA.identity.name}&apos;s profile.
                </p>
              </div>
            </div>

            {/* Live Contract Payload */}
            <div className="rounded-2xl bg-black/60 border border-white/[0.06] overflow-hidden">
              <div className="p-3 bg-white/[0.02] border-b border-white/[0.06] flex items-center justify-between text-xs text-neutral-400">
                <div className="flex items-center space-x-2">
                  <Code className="w-3.5 h-3.5" />
                  <span className="font-mono text-[11px]">Evaluation Payload</span>
                </div>
              </div>
              <pre className="p-4 text-[11px] text-neutral-300 font-mono overflow-x-auto max-h-72 leading-relaxed">
                {JSON.stringify(evaluation, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
