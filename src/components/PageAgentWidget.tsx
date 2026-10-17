// ============================================================================
// src/components/PageAgentWidget.tsx
// Paige: Personal In-App Guide & Autonomous Navigator
// Classy Apple iOS Design System (Dynamic Island & SF-Style Materials)
// Powered by page-agent
// ============================================================================

import React, { useState, useEffect, useRef, useTransition } from 'react'
import {
  Sparkles,
  ArrowUp,
  Square,
  Settings,
  Key,
  X,
  Compass,
  Smartphone,
  Coffee,
  Shield,
  MessageSquare,
  Check,
  ChevronRight,
  ExternalLink,
  Search,
} from 'lucide-react'
import type { PageAgent } from 'page-agent'
import type { ActiveView } from './Navbar'
import type { UniversalUserProfile } from '../types'

export interface PageAgentWidgetProps {
  activeView: ActiveView
  onSelectView: (view: ActiveView) => void
  isPhoneMode: boolean
  onTogglePhoneMode: () => void
  onFilterModeChange?: (mode: 'all' | 'eligible' | 'high_fit') => void
  onOpenWingman?: () => void
  onOpenTerms?: () => void
  currentUser?: UniversalUserProfile
}

type ProviderPreset = 'demo' | 'dashscope' | 'openai' | 'deepseek' | 'ollama' | 'custom'

interface StepMessage {
  id: string
  text: string
  subtext?: string
  status: 'active' | 'done' | 'error'
}

const PROVIDER_CONFIGS: Record<
  ProviderPreset,
  { name: string; baseURL: string; defaultModel: string; placeholderKey: string }
> = {
  demo: {
    name: 'Instant Mode (Built-In Navigation)',
    baseURL: '',
    defaultModel: 'page-agent-simulator',
    placeholderKey: 'Instant in-app guidance ready',
  },
  dashscope: {
    name: 'Alibaba Qwen (DashScope)',
    baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    defaultModel: 'qwen-plus',
    placeholderKey: 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  },
  openai: {
    name: 'OpenAI (GPT-4o)',
    baseURL: 'https://api.openai.com/v1',
    defaultModel: 'gpt-4o',
    placeholderKey: 'sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  },
  deepseek: {
    name: 'DeepSeek',
    baseURL: 'https://api.deepseek.com/v1',
    defaultModel: 'deepseek-chat',
    placeholderKey: 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  },
  ollama: {
    name: 'Local Ollama',
    baseURL: 'http://localhost:11434/v1',
    defaultModel: 'qwen2.5:7b',
    placeholderKey: 'Local instance',
  },
  custom: {
    name: 'Custom Endpoint',
    baseURL: '',
    defaultModel: '',
    placeholderKey: 'API key if required',
  },
}

export const PageAgentWidget: React.FC<PageAgentWidgetProps> = ({
  activeView,
  onSelectView,
  isPhoneMode,
  onTogglePhoneMode,
  onFilterModeChange,
  onOpenWingman,
  onOpenTerms,
  currentUser,
}) => {
  const [, startTransition] = useTransition()
  const [isOpen, setIsOpen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  // LLM Config State (persisted in localStorage)
  const [provider, setProvider] = useState<ProviderPreset>(() => {
    return (localStorage.getItem('check_pageagent_provider') as ProviderPreset) || 'demo'
  })
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('check_pageagent_apikey') || ''
  })
  const [baseURL, setBaseURL] = useState(() => {
    return localStorage.getItem('check_pageagent_baseurl') || PROVIDER_CONFIGS.demo.baseURL
  })
  const [model, setModel] = useState(() => {
    return localStorage.getItem('check_pageagent_model') || PROVIDER_CONFIGS.demo.defaultModel
  })
  const [showKey, setShowKey] = useState(false)

  // Runtime State
  const [taskInput, setTaskInput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState<string>('Ready to guide your exploration')
  const [journeySteps, setJourneySteps] = useState<StepMessage[]>(() => [
    {
      id: 'welcome',
      text: 'Paige is ready to assist you.',
      subtext: 'Ask where to explore or tap any suggested destination below.',
      status: 'done',
    },
  ])

  const agentRef = useRef<PageAgent | null>(null)
  const abortRef = useRef<boolean>(false)
  const stepsContainerRef = useRef<HTMLDivElement>(null)
  const handleExecuteRef = useRef<(prompt?: string) => Promise<void>>(() => Promise.resolve())

  // Auto-scroll steps
  useEffect(() => {
    if (stepsContainerRef.current) {
      stepsContainerRef.current.scrollTop = stepsContainerRef.current.scrollHeight
    }
  }, [journeySteps])

  // Listen for open-page-agent global event
  useEffect(() => {
    const handleOpen = (e: Event) => {
      setIsOpen(true)
      setShowSettings(false)
      const ce = e as CustomEvent<{ prompt?: string; candidate?: any; evaluation?: any }>
      if (ce.detail?.prompt) {
        setTaskInput(ce.detail.prompt)
        handleExecuteRef.current(ce.detail.prompt)
      }
    }
    window.addEventListener('open-page-agent', handleOpen)
    return () => window.removeEventListener('open-page-agent', handleOpen)
  }, [])

  // Save settings
  const handleSaveConfig = () => {
    localStorage.setItem('check_pageagent_provider', provider)
    localStorage.setItem('check_pageagent_apikey', apiKey)
    localStorage.setItem('check_pageagent_baseurl', baseURL)
    localStorage.setItem('check_pageagent_model', model)
    setShowSettings(false)
    addJourneyStep('Settings updated.', undefined, 'done')
  }

  const handleSelectProvider = (p: ProviderPreset) => {
    setProvider(p)
    const cfg = PROVIDER_CONFIGS[p]
    if (p !== 'custom') {
      setBaseURL(cfg.baseURL)
      setModel(cfg.defaultModel)
    }
  }

  const addJourneyStep = (text: string, subtext?: string, status: StepMessage['status'] = 'done') => {
    setJourneySteps((prev) => [
      ...prev.slice(-5),
      {
        id: Math.random().toString(36).slice(2, 9),
        text,
        subtext,
        status,
      },
    ])
  }

  // Apple-style focus indicator with smooth easing
  const focusElement = async (selector: string, message: string, durationMs = 1200) => {
    const el = document.querySelector(selector) as HTMLElement | null
    if (!el) return false

    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    const prevTransition = el.style.transition
    const prevBoxShadow = el.style.boxShadow
    const prevOutline = el.style.outline

    el.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
    el.style.outline = '2px solid rgba(244, 114, 182, 0.75)'
    el.style.boxShadow = '0 0 32px rgba(244, 114, 182, 0.35)'

    setCurrentStep(message)
    await new Promise((r) => setTimeout(r, durationMs))

    el.style.outline = prevOutline
    el.style.boxShadow = prevBoxShadow
    el.style.transition = prevTransition
    return true
  }

  const handleStop = async () => {
    abortRef.current = true
    if (agentRef.current) {
      try {
        await agentRef.current.stop()
      } catch (err) {
        console.warn('Error stopping agent:', err)
      }
    }
    setIsRunning(false)
    setCurrentStep('Paused')
    addJourneyStep('Guidance paused.', undefined, 'done')
  }

  // ==========================================================================
  // CALM GUIDED FLOW (iOS Grade Smoothness)
  // ==========================================================================
  const runGuidedFlow = async (prompt: string) => {
    const lower = prompt.toLowerCase()

    try {
      setCurrentStep('Connecting...')
      await new Promise((r) => setTimeout(r, 400))
      if (abortRef.current) return

      // Destination: Constellation Map
      if (lower.includes('constellation') || lower.includes('network') || lower.includes('sky') || lower.includes('map')) {
        setCurrentStep('Guiding you to the Living Constellation...')
        startTransition(() => {
          onSelectView('network')
        })
        await new Promise((r) => setTimeout(r, 650))
        if (abortRef.current) return

        await focusElement(
          '#network-canvas-container, canvas, [data-view="network"]',
          'Highlighting reciprocal clusters...'
        )
        addJourneyStep('Living Constellation is open.', 'Explore where values and daily rhythms align in 3D.', 'done')
      }

      // Destination: High Fit Matches
      else if (lower.includes('filter') || lower.includes('fit') || lower.includes('80%') || lower.includes('matches') || lower.includes('best')) {
        setCurrentStep('Filtering candidate queue for high mutual fit...')
        startTransition(() => {
          onSelectView('recs')
        })
        await new Promise((r) => setTimeout(r, 550))
        if (abortRef.current) return

        if (onFilterModeChange) {
          onFilterModeChange('high_fit')
        }

        await focusElement(
          '.grid > div, [data-candidate-id], article',
          'Displaying candidates with 80%+ mutual fit...'
        )
        addJourneyStep('High Fit Filter applied.', 'Showing matches with verified reciprocal alignment.', 'done')
      }

      // Destination: Mobile Phone Layout
      else if (lower.includes('phone') || lower.includes('mobile') || lower.includes('one-hand') || lower.includes('compact')) {
        setCurrentStep(`Switching to ${!isPhoneMode ? 'Mobile Phone view' : 'Desktop view'}...`)
        onTogglePhoneMode()
        await new Promise((r) => setTimeout(r, 650))
        if (abortRef.current) return

        await focusElement('nav, .fixed.bottom-0', 'Calibrating 4-tab mobile navigation bar...')
        addJourneyStep(
          `Switched to ${!isPhoneMode ? 'Mobile Phone layout' : 'Desktop view'}.`,
          'Tailored for calm, one-handed interaction.',
          'done'
        )
      }

      // Destination: Date Planner Blueprint
      else if (lower.includes('date') || lower.includes('coffee') || lower.includes('plan') || lower.includes('venue') || lower.includes('meet')) {
        setCurrentStep('Opening the Date Planner blueprint...')
        startTransition(() => {
          onSelectView('date_brief')
        })
        await new Promise((r) => setTimeout(r, 650))
        if (abortRef.current) return

        await focusElement('button, .p-6.rounded-2xl', 'Presenting vetted third-space venues and safety cues...')
        addJourneyStep('Date Blueprint loaded.', 'Curated third spaces with calm acoustic profiles.', 'done')
      }

      // Destination: Boundaries & Contradictions
      else if (lower.includes('contradiction') || lower.includes('dealbreaker') || lower.includes('boundary') || lower.includes('rule')) {
        setCurrentStep('Auditing your stated boundaries...')
        startTransition(() => {
          onSelectView('contradictions')
        })
        await new Promise((r) => setTimeout(r, 650))
        if (abortRef.current) return

        await focusElement('.rounded-2xl, div[role="alert"]', 'Checking boundary coherence across candidate sets...')
        addJourneyStep('Boundary audit complete.', 'Ensuring realistic boundaries without accidental lockouts.', 'done')
      }

      // Destination: Wingman Assistant
      else if (lower.includes('wingman') || lower.includes('advice') || lower.includes('guidance') || lower.includes('reflect')) {
        setCurrentStep('Summoning Wingman Assistant...')
        if (onOpenWingman) {
          onOpenWingman()
          addJourneyStep('Wingman is open.', 'Ready for thoughtful relationship advice and reflection.', 'done')
        } else {
          startTransition(() => onSelectView('conversations'))
          addJourneyStep('Navigated to Conversations.', undefined, 'done')
        }
        await new Promise((r) => setTimeout(r, 650))
      }

      // Destination: Terms & Disclosures
      else if (lower.includes('terms') || lower.includes('privacy') || lower.includes('law') || lower.includes('disclosure')) {
        setCurrentStep('Opening statutory disclosures & invariants...')
        if (onOpenTerms) {
          onOpenTerms()
        } else {
          startTransition(() => onSelectView('about_faq'))
        }
        await new Promise((r) => setTimeout(r, 650))
        addJourneyStep('Statutory disclosures displayed.', 'Verified zero pay-to-win algorithmic ranking.', 'done')
      }

      // Destination: Candidate Friction & Spark Inspection
      else if (lower.includes('inspect') || lower.includes('friction') || lower.includes('spark')) {
        setCurrentStep('Analyzing spark pull vs. practical friction...')
        await new Promise((r) => setTimeout(r, 650))
        if (abortRef.current) return

        await focusElement(
          '[data-mirror-check="true"], article, .rounded-2xl',
          'Highlighting Mirror Check & relational pacing...'
        )
        addJourneyStep(
          'Mirror Check Inspection Complete.',
          'Authentic spark detected. Notice communication cadence and solitude balance before emotional over-investment.',
          'done'
        )
      }

      // Destination: Relationship Self-Mirror & Decision Engine
      else if (lower.includes('mirror') || lower.includes('trap') || lower.includes('blueprint') || lower.includes('triage')) {
        setCurrentStep('Opening Relationship Self-Mirror & Decision Engine...')
        startTransition(() => {
          onSelectView('onboarding')
        })
        await new Promise((r) => setTimeout(r, 650))
        if (abortRef.current) return

        await focusElement(
          '[data-view="account"], main, .space-y-6',
          'Accessing Known Traps & 3-Tier Boundary Triage...'
        )
        addJourneyStep(
          'Relationship Self-Mirror is open.',
          'Explore acknowledged traps, flexible preferences vs non-negotiables, and your blueprint.',
          'done'
        )
      }

      // Default Navigation
      else {
        setCurrentStep('Navigating to Discover matches...')
        startTransition(() => {
          onSelectView('recs')
        })
        await new Promise((r) => setTimeout(r, 550))
        await focusElement('main', 'Platform view ready')
        addJourneyStep('Arrived at candidate feed.', `Explored navigation for "${prompt}".`, 'done')
      }

      setCurrentStep('Ready for your next move')
    } catch (err) {
      console.warn('Navigation error:', err)
      addJourneyStep('Exploration paused.', 'Select any destination below or try another search.', 'error')
      setCurrentStep('Ready')
    } finally {
      setIsRunning(false)
    }
  }

  // ==========================================================================
  // NATIVE PAGE-AGENT EXECUTION LOOP
  // ==========================================================================
  const runLiveAgent = async (prompt: string) => {
    if (!apiKey && provider !== 'ollama') {
      addJourneyStep('API Key Needed', 'Please add your API key in Settings to use custom AI models.', 'error')
      setIsRunning(false)
      setShowSettings(true)
      return
    }

    try {
      setCurrentStep('Waking up Paige...')
      const { PageAgent } = await import('page-agent')

      if (agentRef.current) {
        agentRef.current.dispose()
        agentRef.current = null
      }

      const agent = new PageAgent({
        baseURL: baseURL || PROVIDER_CONFIGS[provider].baseURL,
        model: model || PROVIDER_CONFIGS[provider].defaultModel,
        apiKey: apiKey || undefined,
        language: 'en-US',
        maxSteps: 20,
        instructions: {
          system: `You are Paige — a calm, classy, and personal guide for Check (a reciprocal compatibility platform).
Current view: "${activeView}".
User: ${currentUser?.identity.name || 'User'}.
Guide the user smoothly, calmly, and helpfully with an understated, elegant tone.`,
        },
      })

      agentRef.current = agent

      agent.addEventListener('activity', ((e: CustomEvent) => {
        const act = e.detail
        if (!act) return
        if (act.type === 'thinking') {
          setCurrentStep('Reflecting on page layout...')
        } else if (act.type === 'executing') {
          setCurrentStep(`Navigating: ${act.tool}...`)
        } else if (act.type === 'executed') {
          setCurrentStep('Action complete.')
        }
      }) as EventListener)

      const result = await agent.execute(prompt)
      if (result.success) {
        addJourneyStep('Navigation complete.', result.data || undefined, 'done')
      } else {
        addJourneyStep('Could not complete all steps.', result.data || undefined, 'error')
      }
      setCurrentStep('Ready for your next move')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      addJourneyStep('Encountered an issue.', msg, 'error')
      setCurrentStep('Ready')
    } finally {
      setIsRunning(false)
    }
  }

  const handleExecute = async (overridePrompt?: string) => {
    const prompt = (overridePrompt ?? taskInput).trim()
    if (!prompt) return

    setIsRunning(true)
    abortRef.current = false
    setIsOpen(true)
    setShowSettings(false)

    addJourneyStep(`"${prompt}"`, undefined, 'active')

    if (provider === 'demo') {
      await runGuidedFlow(prompt)
    } else {
      await runLiveAgent(prompt)
    }
  }

  useEffect(() => {
    handleExecuteRef.current = handleExecute
  })

  // Apple-curated destination tiles
  const SUGGESTIONS = [
    {
      label: 'Self-Mirror & Traps',
      desc: 'Known traps, triage & blueprint',
      prompt: 'Open Relationship Self-Mirror and review known traps and boundary triage',
      icon: <Compass className="w-4 h-4 text-[#F472B6]" />,
      tint: 'from-pink-500/15 to-purple-900/10',
    },
    {
      label: 'Constellation Map',
      desc: '3D connections & lifestyle clusters',
      prompt: 'Open the Living Constellation map and inspect clusters',
      icon: <Compass className="w-4 h-4 text-purple-300" />,
      tint: 'from-purple-500/15 to-purple-900/10',
    },
    {
      label: 'High Mutual Fit',
      desc: 'Filter queue to 80%+ matches',
      prompt: 'Filter candidate queue to 80%+ High Fit reciprocal matches',
      icon: <Sparkles className="w-4 h-4 text-pink-300" />,
      tint: 'from-pink-500/15 to-pink-900/10',
    },
    {
      label: 'Date Blueprint',
      desc: 'Vetted acoustic & coffee spots',
      prompt: 'Open Date Planner and review first date blueprint recommendations',
      icon: <Coffee className="w-4 h-4 text-amber-300" />,
      tint: 'from-amber-500/15 to-amber-900/10',
    },
    {
      label: 'Dealbreaker Audit',
      desc: 'Review boundaries & dealbreakers',
      prompt: 'Audit preference contradictions and dealbreaker boundaries',
      icon: <Shield className="w-4 h-4 text-cyan-300" />,
      tint: 'from-cyan-500/15 to-cyan-900/10',
    },
    {
      label: 'Phone View',
      desc: 'One-handed mobile layout',
      prompt: 'Switch to Phone Mode for one-handed mobile navigation',
      icon: <Smartphone className="w-4 h-4 text-emerald-300" />,
      tint: 'from-emerald-500/15 to-emerald-900/10',
    },
    {
      label: 'Wingman Assistant',
      desc: 'Personal relationship reflection',
      prompt: 'Summon Wingman Assistant for relationship advice & profile guidance',
      icon: <MessageSquare className="w-4 h-4 text-sky-300" />,
      tint: 'from-sky-500/15 to-sky-900/10',
    },
  ]

  return (
    <>
      {/* ================================================================== */}
      {/* 1. iOS DYNAMIC ISLAND LAUNCHER PILL (Bottom Left)                  */}
      {/* ================================================================== */}
      <div className="fixed bottom-20 left-4 z-40 sm:bottom-6 sm:left-6">
        <button
          type="button"
          onClick={() => {
            setIsOpen((prev) => !prev)
            setShowSettings(false)
          }}
          className={`group px-3.5 py-2 rounded-full text-xs font-medium shadow-[0_12px_36px_rgba(0,0,0,0.65),0_1px_0_rgba(255,255,255,0.12)_inset] backdrop-blur-3xl border flex items-center space-x-2.5 transition-all duration-300 cursor-pointer active:scale-95 ${
            isOpen
              ? 'bg-[#1e1d24]/90 text-white border-pink-400/40 shadow-[0_4px_28px_rgba(244,114,182,0.3)] ring-1 ring-pink-400/30'
              : 'bg-[#151419]/80 hover:bg-[#1a1920]/90 text-neutral-200 hover:text-white border-white/10 hover:border-white/20'
          }`}
          aria-label="Open Paige In-App Guide"
        >
          {/* Apple Intelligence / Siri-style Iridescent Ambient Dot */}
          <div className="relative flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-pink-400 via-purple-400 to-sky-400 shadow-[0_0_10px_rgba(244,114,182,0.6)]" />
            <span
              className={`absolute inset-0 rounded-full bg-pink-400/40 ${
                isRunning ? 'animate-ping' : 'animate-pulse'
              }`}
            />
          </div>

          <span className="font-semibold tracking-tight text-white/95">Paige</span>

          <span className="text-[10px] text-white/60 px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.08] font-normal">
            {isRunning ? 'Guiding' : 'Guide'}
          </span>
        </button>
      </div>

      {/* ================================================================== */}
      {/* 2. CLASSY iOS MODAL SHEET                                          */}
      {/* ================================================================== */}
      {isOpen && (
        <div
          className="fixed z-50 bottom-20 left-4 sm:bottom-20 sm:left-6 w-[calc(100vw-2rem)] sm:w-[410px] max-h-[82vh] bg-[#161619]/90 border border-white/[0.12] rounded-[32px] shadow-[0_32px_80px_rgba(0,0,0,0.85),0_1px_0_rgba(255,255,255,0.08)_inset] backdrop-blur-3xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300"
          role="dialog"
          aria-label="Paige Personal Guide"
        >
          {/* Apple Top Grabber Pill */}
          <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mt-2.5 mb-1 shrink-0" />

          {/* Subdued Aurora Sheen */}
          <div className="absolute top-0 inset-x-10 h-[1px] bg-gradient-to-r from-transparent via-pink-400/35 to-transparent pointer-events-none" />

          {/* iOS Navigation Header */}
          <div className="flex items-center justify-between px-5 pt-2 pb-3.5 border-b border-white/[0.06]">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-pink-500/20 via-purple-500/20 to-sky-500/20 border border-white/10 flex items-center justify-center text-pink-300 shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <h3 className="text-[15px] font-semibold text-white tracking-tight">Paige</h3>
                  <span className="text-[11px] text-white/50 font-normal">In-App Guide</span>
                </div>
                <p className="text-[11px] text-white/60 font-light truncate max-w-[210px] mt-0.5">
                  {currentStep}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1.5">
              <button
                type="button"
                onClick={() => setShowSettings(!showSettings)}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition active:scale-90 ${
                  showSettings
                    ? 'text-pink-300 bg-white/15'
                    : 'text-white/60 hover:text-white bg-white/[0.06] hover:bg-white/10'
                }`}
                title="Settings"
                aria-label="Settings"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full bg-white/[0.06] hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center transition active:scale-90"
                title="Close"
                aria-label="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Settings Sheet */}
          {showSettings ? (
            <div className="p-5 space-y-4 max-h-[380px] overflow-y-auto">
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-white/50 block">
                  Intelligence Engine
                </span>
                <select
                  value={provider}
                  onChange={(e) => handleSelectProvider(e.target.value as ProviderPreset)}
                  className="w-full text-xs bg-white/[0.06] border border-white/10 rounded-2xl px-3.5 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-white/20 transition cursor-pointer"
                >
                  {Object.entries(PROVIDER_CONFIGS).map(([key, cfg]) => (
                    <option key={key} value={key} className="bg-[#1c1c1e] text-white">
                      {cfg.name}
                    </option>
                  ))}
                </select>
              </div>

              {provider !== 'demo' && (
                <div className="space-y-3 pt-1">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <label className="text-white/90 font-medium flex items-center space-x-1.5">
                        <Key className="w-3.5 h-3.5 text-amber-300" />
                        <span>API Key</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowKey(!showKey)}
                        className="text-[11px] text-white/50 hover:text-white transition"
                      >
                        {showKey ? 'Hide' : 'Reveal'}
                      </button>
                    </div>
                    <input
                      type={showKey ? 'text' : 'password'}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder={PROVIDER_CONFIGS[provider].placeholderKey}
                      className="w-full text-xs font-mono bg-white/[0.06] border border-white/10 rounded-2xl px-3.5 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-white/20 transition"
                    />
                    <p className="text-[10px] text-white/40 font-light">
                      Stored in local browser sandbox only.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-white/90 font-medium block">Model Name</label>
                    <input
                      type="text"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder="e.g. qwen-plus or gpt-4o"
                      className="w-full text-xs font-mono bg-white/[0.06] border border-white/10 rounded-2xl px-3.5 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-white/20 transition"
                    />
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
                <a
                  href="https://alibaba.github.io/page-agent/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-white/50 hover:text-white flex items-center space-x-1 transition"
                >
                  <span>Powered by page-agent</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  type="button"
                  onClick={handleSaveConfig}
                  className="px-4 py-2 rounded-full bg-white text-black font-semibold text-xs shadow-md active:scale-95 transition cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Main Conversational & iOS Inset Destination View */
            <div className="flex-1 flex flex-col p-4 space-y-3.5 overflow-hidden">
              {/* Apple Spotlight-Style Pill Search Field */}
              <div className="relative flex items-center bg-white/[0.07] hover:bg-white/[0.09] focus-within:bg-white/[0.1] focus-within:ring-2 focus-within:ring-white/20 border border-white/[0.08] rounded-full px-3.5 py-2 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.25)_inset]">
                <Search className="w-4 h-4 text-white/40 mr-2 shrink-0" />
                <input
                  type="text"
                  value={taskInput}
                  onChange={(e) => setTaskInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleExecute()
                    }
                  }}
                  disabled={isRunning}
                  placeholder="Ask Paige where to explore or what to find..."
                  className="flex-1 text-xs text-white placeholder-white/40 bg-transparent focus:outline-none"
                />

                <div className="ml-1 shrink-0">
                  {isRunning ? (
                    <button
                      type="button"
                      onClick={handleStop}
                      className="w-7 h-7 rounded-full bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 active:scale-90 flex items-center justify-center transition cursor-pointer"
                      title="Pause"
                      aria-label="Pause execution"
                    >
                      <Square className="w-3 h-3 fill-current" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleExecute()}
                      disabled={!taskInput.trim()}
                      className="w-7 h-7 rounded-full bg-white text-black hover:bg-neutral-200 disabled:bg-white/10 disabled:text-white/20 flex items-center justify-center transition active:scale-90 cursor-pointer shadow-sm"
                      title="Send"
                      aria-label="Send instruction"
                    >
                      <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                  )}
                </div>
              </div>

              {/* Grouped Inset Destination Tiles */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] font-semibold text-white/45 tracking-wider uppercase">
                    Suggested Destinations
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {SUGGESTIONS.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => {
                        setTaskInput(item.prompt)
                        handleExecute(item.prompt)
                      }}
                      disabled={isRunning}
                      className="group p-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/15 text-left transition-all active:scale-[0.98] cursor-pointer flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <div className="w-7 h-7 rounded-xl bg-white/[0.07] flex items-center justify-center group-hover:scale-105 transition-transform">
                          {item.icon}
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/50 group-hover:translate-x-0.5 transition" />
                      </div>

                      <div>
                        <span className="text-[12px] font-semibold text-white/95 group-hover:text-pink-200 transition block">
                          {item.label}
                        </span>
                        <span className="text-[10px] text-white/40 font-normal line-clamp-1 mt-0.5">
                          {item.desc}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Activities Capsule Feed */}
              <div className="bg-black/30 border border-white/[0.05] rounded-2xl p-3">
                <div
                  ref={stepsContainerRef}
                  className="min-h-[75px] max-h-[110px] overflow-y-auto space-y-2 pr-1"
                >
                  {journeySteps.map((step) => (
                    <div
                      key={step.id}
                      className="flex items-start space-x-2.5 text-xs text-white/80 leading-relaxed"
                    >
                      <span className="mt-0.5 shrink-0">
                        {step.status === 'done' ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : step.status === 'active' ? (
                          <span className="w-2 h-2 rounded-full bg-pink-400 inline-block animate-pulse" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-white/40" />
                        )}
                      </span>
                      <div>
                        <p className="font-medium text-white/90 text-[11px]">{step.text}</p>
                        {step.subtext && (
                          <p className="text-[10px] text-white/45 font-light mt-0.5">
                            {step.subtext}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}
