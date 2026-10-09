// ============================================================================
// src/App.tsx
// Universal Compatibility Platform: Apple-Grade Minimalist Main Container
// ============================================================================

import { useState } from 'react'
import { Navbar, type ActiveView } from './components/Navbar'
import { LandingPage } from './components/LandingPage'
import { PlatformIntroView } from './components/PlatformIntroView'
import { FirstDateBriefView } from './components/FirstDateBriefView'
import { DyadConversationView } from './components/DyadConversationView'
import { NaturalPreferenceBar } from './components/NaturalPreferenceBar'
import { LoginModal } from './components/LoginModal'
import { MatchCard } from './components/MatchCard'
import { DeepReportModal } from './components/DeepReportModal'
import { UserAccountView } from './components/UserAccountView'
import { PreferenceOptimizerView } from './components/PreferenceOptimizerView'
import { ContradictionsBanner } from './components/ContradictionsBanner'
import { PairEvaluatorView } from './components/PairEvaluatorView'
import { SubscriptionsView } from './components/SubscriptionsView'
import { WingmanAssistantModal } from './components/WingmanAssistantModal'
import { AlgorithmNetworkVisualizer } from './components/AlgorithmNetworkVisualizer'
import { FirstRunOnboardingModal } from './components/FirstRunOnboardingModal'
import { TermsModal } from './components/TermsModal'
import { currentUser as initialUser, mockCandidates as initialCandidates } from './data/mockProfiles'
import { evaluateMatch, detectUserContradictions } from './utils/matchingEngine'
import type { UniversalUserProfile, MatchEvaluation } from './types'
import { CheckCircle2 } from 'lucide-react'

export function App() {
  const [currentUser, setCurrentUser] = useState<UniversalUserProfile>(initialUser)
  const [candidates] = useState<UniversalUserProfile[]>(initialCandidates)
  const [activeView, setActiveView] = useState<ActiveView>('landing')

  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false)
  const [isWingmanOpen, setIsWingmanOpen] = useState<boolean>(false)
  const [isFirstRunOpen, setIsFirstRunOpen] = useState<boolean>(false)
  const [isTermsOpen, setIsTermsOpen] = useState<boolean>(false)
  const [selectedReport, setSelectedReport] = useState<{
    candidate: UniversalUserProfile
    evaluation: MatchEvaluation
  } | null>(null)
  const [filterMode, setFilterMode] = useState<'all' | 'eligible' | 'high_fit'>('all')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Active Preference Contradictions (Spec §14)
  const contradictions = detectUserContradictions(currentUser)

  // Compute evaluations for current user against all candidates
  const evaluatedCandidates = candidates
    .filter((c) => c.id !== currentUser.id)
    .map((candidate) => ({
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
    setTimeout(() => setToastMessage(null), 3500)
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
      showToast('Radius expanded to 50 km.')
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
      showToast('Diet flexibility set to 0% for non-negotiable requirement.')
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
      showToast('Added monogamous to acceptable partner relationship structures.')
    }
  }

  return (
    <div className="min-h-screen bg-[#070709] text-neutral-100 flex flex-col font-sans selection:bg-white/20 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeView={activeView}
        onSelectView={setActiveView}
        currentUser={currentUser}
        contradictionCount={contradictions.length}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenWingman={() => setIsWingmanOpen(true)}
        onOpenTerms={() => setIsTermsOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Contradiction Alert Banner */}
        {contradictions.length > 0 && activeView === 'recs' && (
          <ContradictionsBanner
            contradictions={contradictions}
            onResolve={handleResolveContradiction}
          />
        )}

        {/* 0. APPLE LANDING PAGE VIEW */}
        {activeView === 'landing' && (
          <LandingPage
            onEnterApp={() => setActiveView('recs')}
            onOpenLogin={() => setIsLoginOpen(true)}
            onOpenIntro={() => setActiveView('intro')}
            onOpenWingman={() => setIsWingmanOpen(true)}
            onOpenNetwork={() => setActiveView('network')}
            onOpenProfile={() => setActiveView('onboarding')}
            onOpenFirstRun={() => setIsFirstRunOpen(true)}
            currentUser={currentUser}
          />
        )}

        {/* 0.5 PSYCHOLOGY & PLATFORM INTRO VIEW */}
        {activeView === 'intro' && (
          <PlatformIntroView
            onEnterDiscovery={() => setActiveView('recs')}
            onExploreAuditor={() => setActiveView('contradictions')}
          />
        )}

        {/* 0.75 FIRST ENCOUNTER BLUEPRINT VIEW */}
        {activeView === 'date_brief' && (
          <FirstDateBriefView
            currentUser={currentUser}
          />
        )}

        {/* 0.85 GRADUATED DIALOGUE & CONVERSATIONS VIEW */}
        {activeView === 'conversations' && (
          <DyadConversationView
            currentUser={currentUser}
            onNavigateToBlueprint={() => setActiveView('date_brief')}
          />
        )}

        {/* 1. RECOMMENDATIONS VIEW (Spec §31) */}
        {activeView === 'recs' && (
          <div className="space-y-6">
            {/* View Sub-Header with Apple Typography & Capsule Segmented Control */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-white/[0.06]">
              <div>
                <span className="apple-subhead">Stage 2 of Human Journey</span>
                <h1 className="text-3xl font-semibold tracking-tight text-white mt-1">
                  Mutually Resonant Profiles
                </h1>
                <p className="text-xs text-neutral-400 mt-1 max-w-xl font-light">
                  Every person here meets your non-negotiable boundaries, and you meet theirs. Evaluated across 12 facets of daily life and long-term values.
                </p>
              </div>

              {/* Apple Segmented Filter Capsule */}
              <div className="flex items-center p-1 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md self-start sm:self-auto">
                <button
                  onClick={() => setFilterMode('all')}
                  className={`apple-pill-btn px-3.5 py-1 text-xs font-medium ${
                    filterMode === 'all'
                      ? 'bg-white/15 text-white shadow-sm border border-white/15'
                      : 'text-neutral-400 hover:text-white border border-transparent'
                  }`}
                >
                  All ({evaluatedCandidates.length})
                </button>
                <button
                  onClick={() => setFilterMode('eligible')}
                  className={`apple-pill-btn px-3.5 py-1 text-xs font-medium ${
                    filterMode === 'eligible'
                      ? 'bg-white/15 text-white shadow-sm border border-white/15'
                      : 'text-neutral-400 hover:text-white border border-transparent'
                  }`}
                >
                  Eligible ({evaluatedCandidates.filter((c) => c.evaluation.eligible).length})
                </button>
                <button
                  onClick={() => setFilterMode('high_fit')}
                  className={`apple-pill-btn px-3.5 py-1 text-xs font-medium ${
                    filterMode === 'high_fit'
                      ? 'bg-white/15 text-white shadow-sm border border-white/15'
                      : 'text-neutral-400 hover:text-white border border-transparent'
                  }`}
                >
                  High Fit (≥80%)
                </button>
              </div>
            </div>

            {/* Apple Natural Intent Bar */}
            <NaturalPreferenceBar
              currentUser={currentUser}
              onUpdatePreferences={(updated) => {
                setCurrentUser(updated)
                showToast('Intent criteria updated. Dynamic matching refreshed.')
              }}
              totalMatchesCount={evaluatedCandidates.length}
              eligibleMatchesCount={evaluatedCandidates.filter((c) => c.evaluation.eligible).length}
            />

            {/* List of Match Cards or Empty State */}
            {filteredCandidates.length === 0 ? (
              <div className="p-8 sm:p-12 rounded-3xl border border-white/10 bg-neutral-900/60 backdrop-blur-2xl text-center space-y-4 max-w-md mx-auto my-8">
                <div className="w-12 h-12 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center mx-auto text-neutral-400">
                  <CheckCircle2 className="w-6 h-6 text-amber-400" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-semibold text-white">No Resonant Profiles in Filter</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed font-light">
                    Your current filter criteria excludes all active profiles. Reset your filter to explore all eligible matches.
                  </p>
                </div>
                <button
                  onClick={() => setFilterMode('all')}
                  className="apple-pill-btn px-5 py-2.5 text-xs font-semibold bg-white text-black hover:bg-neutral-200 transition-all cursor-pointer shadow-lg"
                >
                  Show All ({evaluatedCandidates.length}) Profiles
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredCandidates.map(({ candidate, evaluation }) => (
                  <MatchCard
                    key={candidate.id}
                    candidate={candidate}
                    evaluation={evaluation}
                    onInspectDeepReport={(cand, ev) => setSelectedReport({ candidate: cand, evaluation: ev })}
                    onInitiateHandshake={(cand) =>
                      showToast(`Handshake sent to ${cand.identity.name}. Unlocked upon mutual consent.`)
                    }
                    onPass={(cand) =>
                      showToast(`Respectfully passed on ${cand.identity.name}. Removed from queue.`)
                    }
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* 2. SANCTUARY & BLEND USER ACCOUNT PROFILE VIEW (Airbnb × Spotify Benchmark) */}
        {activeView === 'onboarding' && (
          <UserAccountView
            currentUser={currentUser}
            onUpdateUser={(updated) => {
              setCurrentUser(updated)
              showToast('Sanctuary & Blend configuration saved.')
            }}
            onSwitchPersona={(user) => {
              setCurrentUser(user)
              showToast(`Switched active persona to ${user.identity.name}.`)
            }}
            onNavigateToDiscover={() => setActiveView('recs')}
            onNavigateToDialogue={() => setActiveView('conversations')}
            onNavigateToNetwork={() => setActiveView('network')}
            onLaunchFTUX={() => setIsFirstRunOpen(true)}
          />
        )}

        {/* 3. PREFERENCE OPTIMIZER VIEW (Spec §32) */}
        {activeView === 'optimizer' && (
          <PreferenceOptimizerView currentUser={currentUser} />
        )}

        {/* 4. CONTRADICTION AUDITOR VIEW (Spec §14) */}
        {activeView === 'contradictions' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="p-6 rounded-3xl apple-panel space-y-1">
              <span className="apple-subhead text-amber-400">Formal Logic Invariants</span>
              <h1 className="text-2xl font-semibold tracking-tight text-white">Preference Invariant Auditor</h1>
              <p className="text-xs text-neutral-400 font-light">
                Continuous background verification detecting self-contradicting criteria, impossible geometric filters, and logical deadlocks.
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

        {/* 6. ETHICAL SUPPORTER & BUSINESS TIERS VIEW (Spec §33, D-23) */}
        {activeView === 'subscriptions' && (
          <SubscriptionsView userId={currentUser.id} />
        )}

        {/* 7. 4D HYPER-DIMENSIONAL NETWORK & ODDS VISUALIZER */}
        {activeView === 'network' && (
          <AlgorithmNetworkVisualizer
            currentUser={currentUser}
            onSelectCandidate={(candidate, evaluation) => {
              setSelectedReport({ candidate, evaluation })
            }}
          />
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

      {/* Wingman AI Intelligence & Predictor Suite Modal */}
      {isWingmanOpen && (
        <WingmanAssistantModal
          currentUser={currentUser}
          onClose={() => setIsWingmanOpen(false)}
          onApplyIntentUpdate={(updated, summary) => {
            setCurrentUser(updated)
            showToast(summary)
          }}
          onInspectCandidate={(candidate, evaluation) => {
            setSelectedReport({ candidate, evaluation })
          }}
        />
      )}

      {/* Apple-Grade Login / Authentication Sheet */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSelectUser={(u) => {
          setCurrentUser(u)
          showToast(`Active persona: ${u.identity.name}`)
        }}
        activeUser={currentUser}
      />

      {/* 90-Second First-Run Experience (FTUX) Calibration Modal */}
      <FirstRunOnboardingModal
        isOpen={isFirstRunOpen}
        onClose={() => setIsFirstRunOpen(false)}
        initialUser={currentUser}
        onComplete={(calibratedUser, destinationView) => {
          setCurrentUser(calibratedUser)
          setIsFirstRunOpen(false)
          setActiveView(destinationView)
          showToast(`Welcome, ${calibratedUser.identity.name}! Your Sanctuary & Blend is live across your candidate universe.`)
        }}
      />

      {/* Dynamic Island Style Toast Capsule */}
      {toastMessage && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-black/80 backdrop-blur-2xl border border-white/15 shadow-[0_12px_36px_rgba(0,0,0,0.8)] text-xs font-medium text-white flex items-center space-x-2 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 stroke-[2]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Terms of Service & Statutory Disclosures Modal */}
      <TermsModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
        onAccept={() => {
          showToast('Terms of Service and Statutory Disclosures affirmed.')
        }}
      />

      {/* Universal Legal & Compliance Footer */}
      <footer className="w-full border-t border-white/[0.06] bg-[#070709] py-6 px-4 text-center text-xs text-neutral-500 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-white/10 flex items-center justify-center text-[10px] text-white font-bold">✓</span>
            <span className="text-neutral-400 font-medium">Check</span>
            <span>• Compatibility Verified</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => setIsTermsOpen(true)}
              className="text-neutral-400 hover:text-white transition cursor-pointer underline underline-offset-4"
            >
              Terms & Statutory Disclosures
            </button>
            <button
              onClick={() => setActiveView('intro')}
              className="text-neutral-400 hover:text-white transition cursor-pointer"
            >
              Privacy & Invariants
            </button>
            <span className="text-neutral-600">Strictly 18+ Only</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
export default App
