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
import { AboutFaqView } from './components/AboutFaqView'
import { DiscoveryFilterSheet } from './components/DiscoveryFilterSheet'
import { currentUser as initialUser, mockCandidates as initialCandidates } from './data/mockProfiles'
import { evaluateMatch, detectUserContradictions } from './utils/matchingEngine'
import type { UniversalUserProfile, MatchEvaluation } from './types'
import { CheckCircle2, SlidersHorizontal, Smartphone, Monitor } from 'lucide-react'

export function App() {
  const [currentUser, setCurrentUser] = useState<UniversalUserProfile>(initialUser)
  const [candidates] = useState<UniversalUserProfile[]>(initialCandidates)
  const [activeView, setActiveView] = useState<ActiveView>('landing')

  const [isPhoneMode, setIsPhoneMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('check_phone_mode_enabled')
      if (saved !== null) return saved === 'true'
      return window.innerWidth < 1024
    }
    return false
  })
  const [phoneWidth, setPhoneWidth] = useState<'390' | '430'>('390')

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

  const handleTogglePhoneMode = () => {
    const next = !isPhoneMode
    setIsPhoneMode(next)
    if (typeof window !== 'undefined') {
      localStorage.setItem('check_phone_mode_enabled', String(next))
    }
    showToast(next ? '📱 Phone Mode enabled — layout reorganized for mobile UX' : '💻 Desktop View enabled')
  }

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
    <div
      className={`min-h-screen bg-[#070709] text-neutral-100 flex flex-col font-sans selection:bg-white/20 selection:text-white ${
        isPhoneMode ? 'lg:bg-[#030305] lg:py-6' : ''
      }`}
    >
      {/* Desktop Helper Banner when Phone Mode is Active */}
      {isPhoneMode && (
        <aside
          aria-label="Phone mode controls"
          className="hidden lg:flex items-center justify-between px-6 py-2.5 mb-4 max-w-xl mx-auto w-full bg-neutral-900/90 border border-white/10 rounded-2xl text-xs text-neutral-300 backdrop-blur-md shadow-2xl"
        >
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-white">📱 Phone Mode Active</span>
            <span className="text-neutral-500">•</span>
            <span className="text-neutral-400">Mobile UX layout</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setPhoneWidth(phoneWidth === '390' ? '430' : '390')}
              className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono text-neutral-300 cursor-pointer transition"
            >
              Width: {phoneWidth}px ({phoneWidth === '390' ? 'iPhone' : 'Pro Max'})
            </button>
            <button
              type="button"
              onClick={handleTogglePhoneMode}
              className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-medium cursor-pointer transition flex items-center space-x-1"
            >
              <Monitor className="w-3 h-3" />
              <span>Desktop View</span>
            </button>
          </div>
        </aside>
      )}

      {/* Main Container: Phone Device Shell on Desktop when in Phone Mode, Fluid on Mobile */}
      <div
        className={`w-full flex-1 flex flex-col transition-all duration-300 ${
          isPhoneMode
            ? phoneWidth === '430'
              ? 'lg:max-w-[430px] lg:mx-auto lg:rounded-[48px] lg:border-[8px] lg:border-neutral-800 lg:shadow-[0_25px_90px_rgba(0,0,0,0.95),0_0_0_1px_rgba(255,255,255,0.15)] lg:overflow-hidden lg:min-h-[852px] relative bg-[#070709]'
              : 'lg:max-w-[390px] lg:mx-auto lg:rounded-[48px] lg:border-[8px] lg:border-neutral-800 lg:shadow-[0_25px_90px_rgba(0,0,0,0.95),0_0_0_1px_rgba(255,255,255,0.15)] lg:overflow-hidden lg:min-h-[844px] relative bg-[#070709]'
            : ''
        }`}
      >
        {/* Simulated Phone Status Bar on Desktop */}
        {isPhoneMode && (
          <div className="hidden lg:flex items-center justify-between px-6 pt-3 pb-1 text-[11px] font-medium text-white/80 bg-[#070709] select-none shrink-0 border-b border-white/[0.04]">
            <span>9:41</span>
            <div className="w-24 h-4 rounded-full bg-black border border-white/10 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
              <span className="text-[9px] font-mono text-neutral-400">Check Mobile</span>
            </div>
            <div className="flex items-center space-x-1 font-mono text-[10px] text-neutral-400">
              <span>5G</span>
              <span>100%</span>
            </div>
          </div>
        )}

        {/* Top Navbar */}
        <Navbar
          activeView={activeView}
          onSelectView={setActiveView}
          currentUser={currentUser}
          contradictionCount={contradictions.length}
          onOpenLogin={() => setIsLoginOpen(true)}
          onOpenWingman={() => setIsWingmanOpen(true)}
          onOpenTerms={() => setIsTermsOpen(true)}
          isPhoneMode={isPhoneMode}
          onTogglePhoneMode={handleTogglePhoneMode}
        />

        {/* Main Content Viewport */}
        <main
          className={`flex-1 w-full mx-auto pt-3 pb-28 ${
            isPhoneMode
              ? 'max-w-full px-3 sm:px-4 space-y-5'
              : 'max-w-6xl px-4 sm:px-6 lg:px-8 lg:py-8 space-y-8'
          }`}
        >
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

        {/* 0.25 ABOUT & FAQ CENTER */}
        {activeView === 'about_faq' && (
          <AboutFaqView
            onNavigateToDiscover={() => setActiveView('recs')}
            onNavigateToProfile={() => setActiveView('onboarding')}
            onOpenTerms={() => setIsTermsOpen(true)}
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
            {/* Mobile Header & Compact Trigger Pill (Always visible in Phone Mode) */}
            <div className={`${isPhoneMode ? 'block' : 'lg:hidden'} space-y-2.5`}>
              <div className="flex items-center justify-between">
                <div>
                  <span className="apple-subhead text-[10px] tracking-wider uppercase text-neutral-400">Discover</span>
                  <h1 className="text-xl font-semibold tracking-tight text-white">
                    Mutually Resonant Profiles
                  </h1>
                </div>
                <span className="text-[11px] font-mono font-medium px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                  {evaluatedCandidates.filter((c) => c.evaluation.eligible).length} Eligible
                </span>
              </div>

              {/* Compact Mobile Summary Trigger Pill */}
              <button
                type="button"
                onClick={() => setIsFilterSheetOpen(true)}
                className="w-full min-h-[46px] px-3.5 py-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] active:scale-[0.98] border border-white/10 backdrop-blur-xl flex items-center justify-between text-left transition-all cursor-pointer shadow-md"
                aria-label="Open filter preferences"
              >
                <div className="flex items-center space-x-2 truncate">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                  <span className="text-xs font-medium text-white truncate">
                    London • {currentUser.preferences.minAge}–{currentUser.preferences.maxAge} y/o •{' '}
                    {currentUser.preferences.gendersSought[0] === 'all'
                      ? 'All Genders'
                      : currentUser.preferences.gendersSought[0] === 'woman'
                      ? 'Women'
                      : currentUser.preferences.gendersSought[0] === 'man'
                      ? 'Men'
                      : 'Non-Binary'}
                  </span>
                </div>
                <div className="flex items-center space-x-1.5 shrink-0 ml-2 text-neutral-300">
                  <span className="text-[11px] font-mono text-neutral-400">Filters</span>
                  <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400" />
                </div>
              </button>
            </div>

            {/* Desktop Header & Segmented Filter Capsule (Only in Desktop Mode) */}
            {!isPhoneMode && (
              <div className="hidden lg:flex items-end justify-between gap-4 pb-2 border-b border-white/[0.06]">
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
                <div className="flex items-center p-1 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md">
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
            )}

            {/* Desktop Natural Preference Bar (Only in Desktop Mode) */}
            {!isPhoneMode && (
              <div className="hidden lg:block">
                <NaturalPreferenceBar
                  currentUser={currentUser}
                  onUpdatePreferences={(updated) => {
                    setCurrentUser(updated)
                    showToast('Intent criteria updated. Dynamic matching refreshed.')
                  }}
                  totalMatchesCount={evaluatedCandidates.length}
                  eligibleMatchesCount={evaluatedCandidates.filter((c) => c.evaluation.eligible).length}
                />
              </div>
            )}

            {/* Mobile Bottom Sheet Modal */}
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
              <span className="apple-subhead text-amber-400">Boundary Helper</span>
              <h1 className="text-2xl font-semibold tracking-tight text-white">Preference Conflict Checker</h1>
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

      {/* Floating Phone Mode Quick Switcher Pill */}
      <div className="fixed bottom-20 right-4 z-40 sm:bottom-6 sm:right-6">
        <button
          type="button"
          onClick={handleTogglePhoneMode}
          className={`px-3.5 py-2 rounded-full text-xs font-semibold shadow-2xl backdrop-blur-xl border flex items-center space-x-2 transition-all cursor-pointer active:scale-95 ${
            isPhoneMode
              ? 'bg-emerald-500/25 text-emerald-200 border-emerald-400/50 shadow-[0_4px_25px_rgba(16,185,129,0.35)]'
              : 'bg-neutral-900/90 hover:bg-neutral-800 text-white border-white/20 hover:border-white/40'
          }`}
          aria-label="Toggle Phone Mode"
          title="Toggle between Mobile Phone UX and Desktop View"
        >
          {isPhoneMode ? <Smartphone className="w-4 h-4 text-emerald-400" /> : <Monitor className="w-4 h-4 text-neutral-400" />}
          <span>{isPhoneMode ? 'Phone Mode: ON' : 'Switch to Phone'}</span>
          <span className={`w-2 h-2 rounded-full ${isPhoneMode ? 'bg-emerald-400 animate-pulse' : 'bg-neutral-500'}`} />
        </button>
      </div>
    </div>
  )
}
export default App
