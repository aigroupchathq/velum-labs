// Universal Compatibility Platform: Diagnostic Pair Evaluator
// Governing Standard: Master Build Specification §7, §26

import React, { useState } from 'react'
import {
  Binary,
  ArrowRightLeft,
  AlertCircle,
  Code,
  Copy,
  Check,
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

  const profileA = allProfiles.find((p) => p.id === profileAId) || currentUser
  const profileB = allProfiles.find((p) => p.id === profileBId) || candidates[0]

  const evaluation = evaluateMatch(profileA, profileB)

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(evaluation, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
        <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
          <Binary className="w-4 h-4" />
          <span>Deterministic Evaluator Testbed (Spec §7)</span>
        </div>
        <h1 className="text-2xl font-black text-white mt-1">Diagnostic Pair Inspector</h1>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          Execute live bidirectional evaluation between any two profiles. Validates the 5-stage pipeline, harmonic mutuality, and zero-hallucination explainability.
        </p>

        {/* Pair Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-11 gap-3 items-center mt-6">
          {/* User A Selector */}
          <div className="sm:col-span-5 p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Evaluator A
            </label>
            <select
              value={profileAId}
              onChange={(e) => setProfileAId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
            >
              {allProfiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.identity.name} ({p.identity.age}, {p.lifestyle.diet}, {p.intention.relationshipStructure})
                </option>
              ))}
            </select>
            <div className="text-[11px] text-slate-400 mt-2">
              Diet: <strong className="text-slate-200">{profileA.lifestyle.diet}</strong> • Smoking: <strong className="text-slate-200">{profileA.lifestyle.smoking}</strong>
            </div>
          </div>

          {/* Swap / Reciprocal Icon */}
          <div className="sm:col-span-1 flex justify-center py-2 sm:py-0">
            <button
              onClick={() => {
                setProfileAId(profileBId)
                setProfileBId(profileAId)
              }}
              title="Reverse Evaluation Order"
              className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-400 hover:text-white transition-all shadow-md"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>

          {/* User B Selector */}
          <div className="sm:col-span-5 p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Evaluator B
            </label>
            <select
              value={profileBId}
              onChange={(e) => setProfileBId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
            >
              {allProfiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.identity.name} ({p.identity.age}, {p.lifestyle.diet}, {p.intention.relationshipStructure})
                </option>
              ))}
            </select>
            <div className="text-[11px] text-slate-400 mt-2">
              Diet: <strong className="text-slate-200">{profileB.lifestyle.diet}</strong> • Smoking: <strong className="text-slate-200">{profileB.lifestyle.smoking}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Evaluation Results Container */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                evaluation.eligible
                  ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                  : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
              }`}
            >
              {evaluation.eligible ? 'ELIGIBLE' : 'DISQUALIFIED'}
            </span>

            <div className="text-xs text-slate-400">
              Harmonic Mutuality: <strong className="text-white font-bold">{evaluation.mutuality.score}%</strong>
            </div>

            <div className="text-xs text-slate-400">
              Confidence: <strong className="text-emerald-400 font-bold">{evaluation.confidence.score}% ({evaluation.confidence.rating})</strong>
            </div>
          </div>

          <button
            onClick={handleCopyJSON}
            className="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center space-x-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy JSON'}</span>
          </button>
        </div>

        {/* Hard Conflicts */}
        {evaluation.hardConflicts.length > 0 && (
          <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-900/50 text-rose-300 space-y-2">
            <div className="flex items-center space-x-2 font-bold text-xs text-rose-400">
              <AlertCircle className="w-4 h-4" />
              <span>Hard Boundary Breaches ({evaluation.hardConflicts.length})</span>
            </div>
            {evaluation.hardConflicts.map((c, i) => (
              <div key={i} className="text-xs pl-6">
                • [{c.field}] {c.message}
              </div>
            ))}
          </div>
        )}

        {/* Directional Alignment Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Direction A → B ({profileA.identity.name} → {profileB.identity.name})
            </span>
            <div className="text-3xl font-black text-white">{evaluation.compatibility.aToB}%</div>
            <p className="text-[11px] text-slate-400 mt-1">
              How well {profileB.identity.name} satisfies {profileA.identity.name}&apos;s stated criteria.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Direction B → A ({profileB.identity.name} → {profileA.identity.name})
            </span>
            <div className="text-3xl font-black text-white">{evaluation.compatibility.bToA}%</div>
            <p className="text-[11px] text-slate-400 mt-1">
              How well {profileA.identity.name} satisfies {profileB.identity.name}&apos;s stated criteria.
            </p>
          </div>
        </div>

        {/* Live Raw JSON Payload Accordion */}
        <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden">
          <div className="p-3 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between text-xs font-bold text-slate-300">
            <div className="flex items-center space-x-2">
              <Code className="w-4 h-4 text-indigo-400" />
              <span>Full Output Contract (Spec §7 Specification Payload)</span>
            </div>
          </div>
          <pre className="p-4 text-[11px] text-emerald-400 font-mono overflow-x-auto max-h-96">
            {JSON.stringify(evaluation, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}
