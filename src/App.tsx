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
    showToast(`Handshake sent to ${candidate.identity.name}! Connection unlocked upon mutual consent.`)
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
    <div className="min-h-screen bg-[#050507] text-[#F7F5F8] flex items-center justify-center sm:py-6 sm:px-4 font-sans select-none">
      {/* 
        ========================================================================
        AUTHENTIC IPHONE CHASSIS ("IN THE BOX" & UI SCALING)
        - Strict 392px width & 844px height container on desktop with titanium bezel
        - 100% Edge-to-edge native canvas on mobile screens (< 640px)
        ========================================================================
      */}
      <div className="w-full sm:max-w-[392px] h-screen sm:h-[844px] sm:max-h-[95vh] sm:rounded-[50px] sm:border-[9px] sm:border-[#1E1D24] sm:shadow-[0_25px_100px_rgba(0,0,0,0.98),0_0_0_1px_rgba(255,255,255,0.12)] bg-[#0C0B0F] flex flex-col overflow-hidden relative">
        
        {/* Simulated iOS Status Bar on Desktop */}
        <div className="hidden sm:flex items-center justify-between px-7 pt-3 pb-1 text-[11px] font-medium text-white/80 select-none shrink-0 bg-[#0C0B0F] z-30">
          <span>9:41</span>
          <div className="w-24 h-4 rounded-full bg-black border border-white/10 flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F472B6] mr-1.5 animate-pulse" />
            <span className="text-[9px] font-mono text-neutral-400">Checkmate</span>
          </div>
          <div className="flex items-center space-x-1.5 font-mono text-[10px] text-neutral-400">
            <span>5G</span>
            <span>100%</span>
          </div>
        </div>

        {/* In-Phone Toast Alert */}
        {toastMessage && (
          <div className="absolute top-12 left-3 right-3 z-50 px-3.5 py-2 rounded-2xl bg-[#17161A]/95 text-white text-xs font-medium shadow-2xl backdrop-blur-xl border border-[#F472B6]/40 flex items-center space-x-2 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4 text-[#F472B6] shrink-0" />
            <span className="truncate">{toastMessage}</span>
          </div>
        )}

        {/* Minimalist Top HeaderBar */}
        <HeaderBar
          cityName={currentUser.geography.cityName}
          onOpenPaige={() => setIsWingmanOpen(true)}
          onOpenSafety={() => {
            setActiveTab('profile')
            setOverlayView(null)
          }}
          onOpenCityFilter={() => setIsFilterSheetOpen(true)}
        />

        {/* Scrollable Phone Viewport */}
        <main className="flex-1 overflow-y-auto no-scrollbar px-3 pt-2 pb-24 space-y-4">
          
          {/* ======================================================== */}
          {/* OVERLAY VIEWS (With Back Button)                        */}
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
                <span>Back to Profile</span>
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
                <span>Back to Profile</span>
              </button>
              <div className="p-5 rounded-3xl bg-[#17161A] border border-white/[0.08] space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400">Boundary Helper</span>
                <h2 className="text-xl font-bold text-white">Preference Conflicts</h2>
                <p className="text-xs text-neutral-400 font-light">
                  Resolves conflicting settings so matches flow smoothly.
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
                <span>Back to Profile</span>
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
              {/* TAB 1: DISCOVER CANDIDATE FEED */}
              {activeTab === 'discover' && (
                <div className="space-y-4">
                  {/* Clean Context Header with Filter Button */}
                  <div className="flex items-center justify-between px-1 pt-1">
                    <div>
                      <span className="text-[10px] font-mono tracking-wider uppercase text-neutral-400">
                        Sanctuary Feed
                      </span>
                      <h1 className="text-xl font-bold tracking-tight text-white">
                        Curated Matches
                      </h1>
                    </div>
                    <button
                      onClick={() => setIsFilterSheetOpen(true)}
                      className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-neutral-300 text-xs font-medium transition cursor-pointer"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5 text-[#F472B6]" />
                      <span>Filters</span>
                    </button>
                  </div>

                  {/* Filtered Count Status */}
                  <div className="flex items-center justify-between px-1 text-[11px] font-mono text-neutral-400">
                    <span>{filteredCandidates.length} Candidates Available</span>
                    <span className="text-emerald-400">
                      {evaluatedCandidates.filter((c) => c.evaluation.eligible).length} 100% Eligible
                    </span>
                  </div>

                  {/* Candidate List */}
                  {filteredCandidates.length === 0 ? (
                    <div className="p-8 rounded-3xl border border-white/10 bg-[#141318] text-center space-y-3 my-6 shadow-xl">
                      <div className="w-10 h-10 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center mx-auto text-amber-400">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <h3 className="text-base font-semibold text-white">No Profiles in Filter</h3>
                      <p className="text-xs text-neutral-400 font-light">
                        Expand your discovery filters to see more profiles.
                      </p>
                      <button
                        onClick={() => setFilterMode('all')}
                        className="px-4 py-2 rounded-full text-xs font-semibold bg-white text-black hover:bg-neutral-200 transition cursor-pointer"
                      >
                        Reset Filter
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-5">
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

              {/* TAB 2: MESSAGES & CONNECTIONS */}
              {activeTab === 'connections' && (
                <DyadConversationView
                  currentUser={currentUser}
                  onNavigateToBlueprint={(candidateId) => {
                    setSelectedDateCandidateId(candidateId)
                    setOverlayView('date_brief')
                  }}
                />
              )}

              {/* TAB 3: RADAR / CONSTELLATION */}
              {activeTab === 'constellation' && (
                <div className="space-y-3">
                  <div className="px-1 pt-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400">
                      Living Network
                    </span>
                    <h1 className="text-xl font-bold text-white">The Constellation</h1>
                    <p className="text-xs text-neutral-400 font-light">Ambient spatial compatibility across London</p>
                  </div>
                  <div className="rounded-3xl overflow-hidden border border-white/[0.08] bg-[#141318]">
                    <AlgorithmNetworkVisualizer
                      currentUser={currentUser}
                      onSelectCandidate={(candidate, evaluation) => {
                        setSelectedReport({ candidate, evaluation })
                      }}
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: PROFILE */}
              {activeTab === 'profile' && (
                <UserAccountView
                  currentUser={currentUser}
                  onUpdateUser={(updated) => {
                    setCurrentUser(updated)
                    showToast('Profile saved.')
                  }}
                  onSwitchPersona={(user) => {
                    setCurrentUser(user)
                    showToast(`Switched active persona to ${user.identity.name}.`)
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

        {/* Canonical iOS Bottom Tab Bar (Docked inside Phone) */}
        <TabBar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setOverlayView(null)
            setActiveTab(tab)
          }}
          unreadConnectionsCount={handshakedCandidateIds.size > 0 ? handshakedCandidateIds.size : 1}
        />

        {/* Global Modal Sheets */}
        <DiscoveryFilterSheet
          isOpen={isFilterSheetOpen}
          onClose={() => setIsFilterSheetOpen(false)}
          currentUser={currentUser}
          onUpdatePreferences={(updated) => {
            setCurrentUser(updated)
            showToast('Preferences updated.')
          }}
          totalMatchesCount={evaluatedCandidates.length}
          eligibleMatchesCount={evaluatedCandidates.filter((c) => c.evaluation.eligible).length}
          filterMode={filterMode}
          setFilterMode={setFilterMode}
          currentFilteredCount={filteredCandidates.length}
        />

        {selectedReport && (
          <DeepReportModal
            candidate={selectedReport.candidate}
            evaluation={selectedReport.evaluation}
            currentUser={currentUser}
            onClose={() => setSelectedReport(null)}
          />
        )}

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

        <FirstRunOnboardingModal
          isOpen={isFirstRunOpen}
          onClose={() => setIsFirstRunOpen(false)}
          initialUser={currentUser}
          onComplete={(calibratedUser: UniversalUserProfile, destinationView: 'recs' | 'network') => {
            setCurrentUser(calibratedUser)
            setIsFirstRunOpen(false)
            if (destinationView === 'network') setActiveTab('constellation')
            else setActiveTab('discover')
            showToast('Guided calibration complete.')
          }}
        />

        <TermsModal
          isOpen={isTermsOpen}
          onClose={() => setIsTermsOpen(false)}
        />

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
    </div>
  )
}

export default App
