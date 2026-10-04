// Universal Compatibility Platform: Main Application Container
// Governing Standards: Master Build Specification §0, §1, §7, §10, §14, §15, §30, §31, §32

import { useState } from 'react'
import { Navbar, type ActiveView } from './components/Navbar'
import { MatchCard } from './components/MatchCard'
import { DeepReportModal } from './components/DeepReportModal'
import { ProgressiveDisclosureModal } from './components/ProgressiveDisclosureModal'
import { PreferenceOptimizerView } from './components/PreferenceOptimizerView'
import { ContradictionsBanner } from './components/ContradictionsBanner'
import { PairEvaluatorView } from './components/PairEvaluatorView'
import { currentUser as initialUser, mockCandidates as initialCandidates } from './data/mockProfiles'
import { evaluateMatch, detectUserContradictions } from './utils/matchingEngine'
import type { UniversalUserProfile, MatchEvaluation } from './types'
import { CheckCircle2, HeartHandshake } from 'lucide-react'

export function App() {
  const [currentUser, setCurrentUser] = useState<UniversalUserProfile>(initialUser)
  const [candidates] = useState<UniversalUserProfile[]>(initialCandidates)
  const [activeView, setActiveView] = useState<ActiveView>('recs')
  const [selectedReport, setSelectedReport] = useState<{
    candidate: UniversalUserProfile
    evaluation: MatchEvaluation
  } | null>(null)
  const [filterMode, setFilterMode] = useState<'all' | 'eligible' | 'high_fit'>('all')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Active Preference Contradictions (Spec §14)
  const contradictions = detectUserContradictions(currentUser)

  // Compute evaluations for current user against all candidates
  const evaluatedCandidates = candidates.map((candidate) => ({
    candidate,
    evaluation: evaluateMatch(currentUser, candidate),
  }))

  // Filter candidates according to selected view mode
  const filteredCandidates = evaluatedCandidates.filter(({ evaluation }) => {
    if (filterMode === 'eligible') return evaluation.eligible
    if (filterMode === 'high_fit') return evaluation.eligible && (evaluation.mutuality.score || 0) >= 80
    return true
  })

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleResolveContradiction = (code: string) => {
    if (code === 'DISTANCE_LONG_DISTANCE_BUT_TIGHT_RADIUS') {
      setCurrentUser({
        ...currentUser,
        geography: {
          ...currentUser.geography,
          maxDistanceKm: 50,
        },
      })
      showToast('Resolved: Distance radius expanded to 50 km.')
    } else if (code === 'MUST_WITH_HIGH_FLEXIBILITY') {
      setCurrentUser({
        ...currentUser,
        preferences: {
          ...currentUser.preferences,
          dietPreference: {
            ...currentUser.preferences.dietPreference,
            flexibility: 0,
          },
        },
      })
      showToast('Resolved: Diet flexibility set to 0% for MUST requirement.')
    } else if (code === 'SELF_STRUCTURE_CONTRADICTS_REQUIRED_STRUCTURE') {
      setCurrentUser({
        ...currentUser,
        preferences: {
          ...currentUser.preferences,
          structurePreference: {
            ...currentUser.preferences.structurePreference,
            acceptableStructures: ['monogamous', 'flexible'],
          },
        },
      })
      showToast('Resolved: Added monogamous to acceptable partner structures.')
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        activeView={activeView}
        onSelectView={setActiveView}
        currentUser={currentUser}
        contradictionCount={contradictions.length}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Contradiction Alert Banner (Shown in Recommendations if any exist) */}
        {contradictions.length > 0 && activeView === 'recs' && (
          <ContradictionsBanner
            contradictions={contradictions}
            onResolve={handleResolveContradiction}
          />
        )}

        {/* 1. RECOMMENDATIONS VIEW (Spec §31) */}
        {activeView === 'recs' && (
          <div className="space-y-6">
            {/* View Sub-Header & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800">
              <div>
                <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                  <HeartHandshake className="w-4 h-4" />
                  <span>Bidirectional Discovery Feed (Spec §16, §31)</span>
                </div>
                <h1 className="text-2xl font-black text-white mt-1">
                  Mutually Compatible Recommendations
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Candidates evaluated via 5-stage deterministic pipeline. Zero-floor harmonic mutuality guarantees reciprocal suitability.
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800">
                <button
                  onClick={() => setFilterMode('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filterMode === 'all'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All ({evaluatedCandidates.length})
                </button>
                <button
                  onClick={() => setFilterMode('eligible')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filterMode === 'eligible'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Eligible Only ({evaluatedCandidates.filter((c) => c.evaluation.eligible).length})
                </button>
                <button
                  onClick={() => setFilterMode('high_fit')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filterMode === 'high_fit'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  High Mutuality (≥80%)
                </button>
              </div>
            </div>

            {/* List of Match Cards */}
            <div className="space-y-6">
              {filteredCandidates.map(({ candidate, evaluation }) => (
                <MatchCard
                  key={candidate.id}
                  candidate={candidate}
                  evaluation={evaluation}
                  onInspectDeepReport={(cand, ev) => setSelectedReport({ candidate: cand, evaluation: ev })}
                  onInitiateHandshake={(cand) =>
                    showToast(`Handshake initiated with ${cand.identity.name}. Both parties must consent to unlock chat.`)
                  }
                  onPass={(cand) =>
                    showToast(`Respectfully passed on ${cand.identity.name}. Candidate removed from active queue.`)
                  }
                />
              ))}
            </div>
          </div>
        )}

        {/* 2. PROGRESSIVE ONBOARDING & PROFILE VIEW (Spec §30) */}
        {activeView === 'onboarding' && (
          <ProgressiveDisclosureModal
            currentUser={currentUser}
            onUpdateUser={(updated) => {
              setCurrentUser(updated)
              showToast('Profile configuration updated successfully.')
            }}
          />
        )}

        {/* 3. PREFERENCE OPTIMIZER VIEW (Spec §32) */}
        {activeView === 'optimizer' && (
          <PreferenceOptimizerView currentUser={currentUser} />
        )}

        {/* 4. CONTRADICTION AUDITOR VIEW (Spec §14) */}
        {activeView === 'contradictions' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
              <h1 className="text-2xl font-black text-white">Preference Invariant &amp; Contradiction Auditor</h1>
              <p className="text-xs text-slate-400 mt-1">
                Monitors active constraints for logical deadlocks, self-excluding ranges, and conflicting requirement levels (Spec §14).
              </p>
            </div>
            <ContradictionsBanner
              contradictions={contradictions}
              onResolve={handleResolveContradiction}
            />
          </div>
        )}

        {/* 5. PAIR EVALUATOR VIEW (Spec §7, §26) */}
        {activeView === 'evaluator' && (
          <PairEvaluatorView currentUser={currentUser} candidates={candidates} />
        )}
      </main>

      {/* Deep 12-Dimension Report Modal */}
      {selectedReport && (
        <DeepReportModal
          candidate={selectedReport.candidate}
          evaluation={selectedReport.evaluation}
          currentUser={currentUser}
          onClose={() => setSelectedReport(null)}
        />
      )}

      {/* Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900 border border-indigo-500/50 shadow-2xl shadow-black text-xs font-semibold text-white flex items-center space-x-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  )
}
export default App
