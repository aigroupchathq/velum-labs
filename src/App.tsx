// ============================================================================
// src/App.tsx
// Checkmate Universal Compatibility Platform: Apple-Grade iOS Architecture
// 4-Tab Navigation · Anti-Casino Compatibility · Ergonomic iOS Touch Zones
// ============================================================================

import { useState } from 'react'
import { HeaderBar } from './components/navigation/HeaderBar'
import { TabBar, type MainTab } from './components/navigation/TabBar'
import { MatchCard } from './components/MatchCard'
import { DeepReportModal } from './components/DeepReportModal'
import { UserAccountView } from './components/UserAccountView'
import { DyadConversationView } from './components/DyadConversationView'
import { FirstDateBriefView } from './components/FirstDateBriefView'
import { AlgorithmNetworkVisualizer } from './components/AlgorithmNetworkVisualizer'
import { SubscriptionsView } from './components/SubscriptionsView'
import { PreferenceOptimizerView } from './components/PreferenceOptimizerView'
import { PairEvaluatorView } from './components/PairEvaluatorView'
import { ContradictionsBanner } from './components/ContradictionsBanner'
import { AboutFaqView } from './components/AboutFaqView'
import { DiscoveryFilterSheet } from './components/DiscoveryFilterSheet'
import { LoginModal } from './components/LoginModal'
import { FirstRunOnboardingModal } from './components/FirstRunOnboardingModal'
import { TermsModal } from './components/TermsModal'
import { WingmanAssistantModal } from './components/WingmanAssistantModal'
import { PageAgentWidget } from './components/PageAgentWidget'
import { currentUser as initialUser, mockCandidates as initialCandidates } from './data/mockProfiles'
import { evaluateMatch, detectUserContradictions } from './utils/matchingEngine'
import { sounds } from './utils/sound'
import type { UniversalUserProfile, MatchEvaluation } from './types'
import { CheckCircle2, SlidersHorizontal, ArrowLeft } from 'lucide-react'

type OverlayView =
  | 'subscriptions'
  | 'date_brief'
  | 'optimizer'
  | 'contradictions'
  | 'evaluator'
  | 'about_faq'
  | null

export function App() {
  const [currentUser, setCurrentUser] = useState<UniversalUserProfile>(initialUser)
  const [candidates] = useState<UniversalUserProfile[]>(initialCandidates)
  
  // Canonical iOS 4-Tab Bottom Bar state
  const [activeTab, setActiveTab] = useState<MainTab>('discover')
  
  // Modal & Overlay views
  const [overlayView, setOverlayView] = useState<OverlayView>(null)
  const [selectedDateCandidateId, setSelectedDateCandidateId] = useState<string | undefined>()

  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false)
  const [isWingmanOpen, setIsWingmanOpen] = useState<boolean>(false)
  const [isFirstRunOpen, setIsFirstRunOpen] = useState<boolean>(false)
  const [isTermsOpen, setIsTermsOpen] = useState<boolean>(false)
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState<boolean>(false)
  
  const [selectedReport, setSelectedReport] = useState<{
    candidate: UniversalUserProfile
    evaluation: MatchEvaluation
  } | null>(null)
  
  const [filterMode, setFilterMode] = useState<'all' | 'eligible' | 'high_fit'>('all')
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [handshakedCandidateIds, setHandshakedCandidateIds] = useState<Set<string>>(new Set())

  // Active Preference Contradictions
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

  const handleInitiateHandshake = (candidate: UniversalUserProfile) => {
    sounds.playMatch()
    setHandshakedCandidateIds((prev) => new Set(prev).add(candidate.id))
    showToast(`Handshake sent to ${candidate.identity.name}. Connection unlocked upon mutual consent!`)
  }

  const handlePass = (candidate: UniversalUserProfile) => {
    sounds.playTap()
    showToast(`Respectfully passed on ${candidate.identity.name}. Candidate archived.`)
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
    <div className="min-h-screen bg-[#070709] text-[#F7F5F8] flex flex-col font-sans selection:bg-[#F472B6]/30 selection:text-white">
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-[#17161A]/95 text-white text-xs font-medium shadow-2xl backdrop-blur-xl border border-[#F472B6]/40 flex items-center space-x-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-[#F472B6]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* iOS Minimalist Top Header */}
      <HeaderBar
        cityName={currentUser.geography.cityName}
        onOpenPaige={() => setIsWingmanOpen(true)}
        onOpenSafety={() => {
          setActiveTab('profile')
          setOverlayView(null)
        }}
        onOpenCityFilter={() => setIsFilterSheetOpen(true)}
      />

      {/* Main Viewport */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-3.5 sm:px-6 pt-3 pb-28">
        
        {/* ======================================================== */}
        {/* OVERLAY & LAB VIEWS (With Back Navigation)              */}
        {/* ======================================================== */}
        {overlayView === 'subscriptions' && (
          <div className="space-y-4">
            <button
              onClick={() => setOverlayView(null)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-xs font-medium text-neutral-300 hover:text-white transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <SubscriptionsView userId={currentUser.id} />
          </div>
        )}

        {overlayView === 'date_brief' && (
          <FirstDateBriefView
            currentUser={currentUser}
            initialCandidateId={selectedDateCandidateId}
            onBack={() => setOverlayView(null)}
          />
        )}

        {overlayView === 'optimizer' && (
          <div className="space-y-4">
            <button
              onClick={() => setOverlayView(null)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-xs font-medium text-neutral-300 hover:text-white transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Sanctuary</span>
            </button>
            <PreferenceOptimizerView currentUser={currentUser} />
          </div>
        )}

        {overlayView === 'contradictions' && (
          <div className="space-y-4">
            <button
              onClick={() => setOverlayView(null)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-xs font-medium text-neutral-300 hover:text-white transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Sanctuary</span>
            </button>
            <div className="p-6 rounded-3xl bg-[#17161A] border border-white/[0.08] space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400">Boundary Helper</span>
              <h1 className="text-2xl font-bold tracking-tight text-white">Preference Conflict Checker</h1>
              <p className="text-xs text-neutral-400 font-light">
                Surfaces any conflicting or impossible preference settings so your candidate queue stays open and accurate.
              </p>
            </div>
            <ContradictionsBanner
              contradictions={contradictions}
              onResolve={handleResolveContradiction}
            />
          </div>
        )}

        {overlayView === 'evaluator' && (
          <div className="space-y-4">
            <button
              onClick={() => setOverlayView(null)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-xs font-medium text-neutral-300 hover:text-white transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Sanctuary</span>
            </button>
            <PairEvaluatorView currentUser={currentUser} candidates={candidates} />
          </div>
        )}

        {overlayView === 'about_faq' && (
          <div className="space-y-4">
            <button
              onClick={() => setOverlayView(null)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-xs font-medium text-neutral-300 hover:text-white transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <AboutFaqView
              onNavigateToDiscover={() => {
                setOverlayView(null)
                setActiveTab('discover')
              }}
              onNavigateToProfile={() => {
                setOverlayView(null)
                setActiveTab('profile')
              }}
              onOpenTerms={() => setIsTermsOpen(true)}
            />
          </div>
        )}

        {/* ======================================================== */}
        {/* PRIMARY 4-TAB VIEWS                                      */}
        {/* ======================================================== */}
        {!overlayView && (
          <>
            {/* TAB 1: DISCOVER CANDIDATE DECK */}
            {activeTab === 'discover' && (
              <div className="space-y-5">
                {/* Header Context & Filter Pill */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono tracking-wider uppercase text-neutral-400">
                        Sanctuary Feed
                      </span>
                      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                        Curated Matches
                      </h1>
                    </div>
                    <span className="text-[11px] font-mono font-medium px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                      {evaluatedCandidates.filter((c) => c.evaluation.eligible).length} Aligned
                    </span>
                  </div>

                  {/* Filter Trigger Pill (Fitts's Law Target) */}
                  <button
                    type="button"
                    onClick={() => setIsFilterSheetOpen(true)}
                    className="w-full min-h-[46px] px-3.5 py-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] active:scale-[0.99] border border-white/10 backdrop-blur-xl flex items-center justify-between text-left transition-all cursor-pointer shadow-md"
                    aria-label="Filter Preferences"
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                      <span className="text-xs font-medium text-white truncate">
                        {currentUser.geography.cityName} • {currentUser.preferences.minAge}–{currentUser.preferences.maxAge} y/o •{' '}
                        {currentUser.preferences.gendersSought[0] === 'all' ? 'All Genders' : currentUser.preferences.gendersSought.join(', ')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1.5 shrink-0 ml-2 text-neutral-300">
                      <span className="text-[11px] font-mono text-neutral-400">Filters</span>
                      <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400" />
                    </div>
                  </button>
                </div>

                {/* Contradiction Alert Banner (Only when active) */}
                {contradictions.length > 0 && (
                  <ContradictionsBanner
                    contradictions={contradictions}
                    onResolve={handleResolveContradiction}
                  />
                )}

                {/* Candidate Feed */}
                {filteredCandidates.length === 0 ? (
                  <div className="p-8 sm:p-12 rounded-3xl border border-white/10 bg-[#17161A] text-center space-y-4 max-w-md mx-auto my-8 shadow-xl">
                    <div className="w-12 h-12 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center mx-auto text-neutral-400">
                      <CheckCircle2 className="w-6 h-6 text-amber-400" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-lg font-semibold text-white">No Matching Profiles in Filter</h3>
                      <p className="text-xs text-neutral-400 leading-relaxed font-light">
                        Your current filter criteria excludes all active profiles. Reset your filter to explore all eligible matches.
                      </p>
                    </div>
                    <button
                      onClick={() => setFilterMode('all')}
                      className="px-5 py-2.5 rounded-full text-xs font-semibold bg-white text-black hover:bg-neutral-200 transition-all cursor-pointer shadow-lg"
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
                        onInitiateHandshake={() => handleInitiateHandshake(candidate)}
                        onPass={() => handlePass(candidate)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: CONNECTIONS & CONVERSATIONS */}
            {activeTab === 'connections' && (
              <DyadConversationView
                currentUser={currentUser}
                onNavigateToBlueprint={(candidateId) => {
                  setSelectedDateCandidateId(candidateId)
                  setOverlayView('date_brief')
                }}
              />
            )}

            {/* TAB 3: CONSTELLATION SPATIAL MAP */}
            {activeTab === 'constellation' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-1">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400">
                      Living Network
                    </span>
                    <h1 className="text-xl sm:text-2xl font-bold text-white">The Constellation</h1>
                  </div>
                  <span className="text-[11px] font-mono text-neutral-400">
                    London Ambient View
                  </span>
                </div>
                <AlgorithmNetworkVisualizer
                  currentUser={currentUser}
                  onSelectCandidate={(candidate, evaluation) => {
                    setSelectedReport({ candidate, evaluation })
                  }}
                />
              </div>
            )}

            {/* TAB 4: MY SANCTUARY (PROFILE & SETTINGS) */}
            {activeTab === 'profile' && (
              <UserAccountView
                currentUser={currentUser}
                onUpdateUser={(updated) => {
                  setCurrentUser(updated)
                  showToast('Profile configuration saved.')
                }}
                onSwitchPersona={(user) => {
                  setCurrentUser(user)
                  showToast(`Switched active view to ${user.identity.name}.`)
                }}
                onNavigateToDiscover={() => setActiveTab('discover')}
                onNavigateToDialogue={() => setActiveTab('connections')}
                onNavigateToNetwork={() => setActiveTab('constellation')}
                onLaunchFTUX={() => setIsFirstRunOpen(true)}
                onNavigateView={(view) => {
                  if (view === 'subscriptions') setOverlayView('subscriptions')
                  else if (view === 'date_brief') setOverlayView('date_brief')
                  else if (view === 'optimizer') setOverlayView('optimizer')
                  else if (view === 'contradictions') setOverlayView('contradictions')
                  else if (view === 'evaluator') setOverlayView('evaluator')
                  else if (view === 'network') setActiveTab('constellation')
                  else if (view === 'recs') setActiveTab('discover')
                  else if (view === 'conversations') setActiveTab('connections')
                }}
                onOpenTerms={() => setIsTermsOpen(true)}
                onOpenLogin={() => setIsLoginOpen(true)}
              />
            )}
          </>
        )}
      </main>

      {/* Floating iOS Bottom Tab Bar */}
      <TabBar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setOverlayView(null)
          setActiveTab(tab)
        }}
        unreadConnectionsCount={handshakedCandidateIds.size > 0 ? handshakedCandidateIds.size : 1}
      />

      {/* ======================================================== */}
      {/* GLOBAL MODALS                                            */}
      {/* ======================================================== */}
      
      {/* Discovery Filters Modal Sheet */}
      <DiscoveryFilterSheet
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        currentUser={currentUser}
        onUpdatePreferences={(updated) => {
          setCurrentUser(updated)
          showToast('Discovery preferences updated.')
        }}
        totalMatchesCount={evaluatedCandidates.length}
        eligibleMatchesCount={evaluatedCandidates.filter((c) => c.evaluation.eligible).length}
        filterMode={filterMode}
        setFilterMode={setFilterMode}
        currentFilteredCount={filteredCandidates.length}
      />

      {/* Deep Match Dossier Modal */}
      {selectedReport && (
        <DeepReportModal
          candidate={selectedReport.candidate}
          evaluation={selectedReport.evaluation}
          currentUser={currentUser}
          onClose={() => setSelectedReport(null)}
        />
      )}

      {/* Wingman Assistant / Paige Modal */}
      {isWingmanOpen && (
        <WingmanAssistantModal
          currentUser={currentUser}
          onClose={() => setIsWingmanOpen(false)}
          onApplyIntentUpdate={(updatedUser: UniversalUserProfile, summary: string) => {
            setCurrentUser(updatedUser)
            showToast(summary || 'Intent updated.')
          }}
          onInspectCandidate={(candidate: UniversalUserProfile, evaluation: MatchEvaluation) => {
            setSelectedReport({ candidate, evaluation })
            setIsWingmanOpen(false)
          }}
        />
      )}

      {/* First Run Onboarding Modal */}
      <FirstRunOnboardingModal
        isOpen={isFirstRunOpen}
        onClose={() => setIsFirstRunOpen(false)}
        initialUser={currentUser}
        onComplete={(calibratedUser: UniversalUserProfile, destinationView: 'recs' | 'network') => {
          setCurrentUser(calibratedUser)
          setIsFirstRunOpen(false)
          if (destinationView === 'network') setActiveTab('constellation')
          else setActiveTab('discover')
          showToast('Guided calibration complete. Discovery deck refreshed.')
        }}
      />

      {/* Legal Terms Modal */}
      <TermsModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        activeUser={currentUser}
        onSelectUser={(user: UniversalUserProfile) => {
          setCurrentUser(user)
          setIsLoginOpen(false)
          showToast(`Welcome back, ${user.identity.name}!`)
        }}
      />

      {/* In-Page AI Agent Widget (Paige) */}
      <PageAgentWidget
        activeView={
          activeTab === 'discover' ? 'recs' :
          activeTab === 'connections' ? 'conversations' :
          activeTab === 'constellation' ? 'network' : 'onboarding'
        }
        onSelectView={(view) => {
          if (view === 'recs') setActiveTab('discover')
          else if (view === 'conversations') setActiveTab('connections')
          else if (view === 'network') setActiveTab('constellation')
          else if (view === 'onboarding') setActiveTab('profile')
          else if (view === 'subscriptions') setOverlayView('subscriptions')
          else if (view === 'date_brief') setOverlayView('date_brief')
          else if (view === 'optimizer') setOverlayView('optimizer')
          else if (view === 'contradictions') setOverlayView('contradictions')
          else if (view === 'evaluator') setOverlayView('evaluator')
        }}
        isPhoneMode={false}
        onTogglePhoneMode={() => {}}
        onFilterModeChange={setFilterMode}
        onOpenWingman={() => setIsWingmanOpen(true)}
        onOpenTerms={() => setIsTermsOpen(true)}
        currentUser={currentUser}
      />

    </div>
  )
}

export default App
