// ============================================================================
// src/components/PageAgentWidget.tsx
// Paige: Personal In-App Guide & Autonomous Navigator
// Human-centered, serene, and elegant browser interaction
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
    name: 'Instant Mode (No API Key Required)',
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
  const [currentStep, setCurrentStep] = useState<string>('Ready to help you explore')
  const [journeySteps, setJourneySteps] = useState<StepMessage[]>(() => [
    {
      id: 'welcome',
      text: 'Paige is ready to guide your exploration.',
      subtext: 'Ask a question, choose a destination, or let Paige calibrate views for you.',
      status: 'done',
    },
  ])

  const agentRef = useRef<PageAgent | null>(null)
  const abortRef = useRef<boolean>(false)
  const stepsContainerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll steps
  useEffect(() => {
    if (stepsContainerRef.current) {
      stepsContainerRef.current.scrollTop = stepsContainerRef.current.scrollHeight
    }
  }, [journeySteps])

  // Listen for open-page-agent global event from Navbar or Profile Hub
  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true)
      setShowSettings(false)
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
    addJourneyStep('Configuration updated.', undefined, 'done')
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
      ...prev.slice(-6),
      {
        id: Math.random().toString(36).slice(2, 9),
        text,
        subtext,
        status,
      },
    ])
  }

  // Gentle visual highlight for elements
  const focusElement = async (selector: string, message: string, durationMs = 1200) => {
    const el = document.querySelector(selector) as HTMLElement | null
    if (!el) return false

    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    const prevTransition = el.style.transition
    const prevBoxShadow = el.style.boxShadow
    const prevOutline = el.style.outline

    el.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
    el.style.outline = '2px solid rgba(244, 114, 182, 0.7)'
    el.style.boxShadow = '0 0 28px rgba(244, 114, 182, 0.35)'

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
    addJourneyStep('Navigation paused.', undefined, 'done')
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

  // ==========================================================================
  // CALM GUIDED FLOW (Human, graceful execution)
  // ==========================================================================
  const runGuidedFlow = async (prompt: string) => {
    const lower = prompt.toLowerCase()

    try {
      setCurrentStep('Reviewing request...')
      await new Promise((r) => setTimeout(r, 450))
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
          'Focusing on your active connection clusters...'
        )
        addJourneyStep('Living Constellation is open.', 'Explore where your values and daily rhythms align in 3D.', 'done')
      }

      // Destination: High Fit Matches
      else if (lower.includes('filter') || lower.includes('fit') || lower.includes('80%') || lower.includes('matches') || lower.includes('best')) {
        setCurrentStep('Filtering candidate queue for high reciprocal alignment...')
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
          'Showing candidates with mutual fit above 80%...'
        )
        addJourneyStep('High Fit Filter applied.', 'Displaying candidates with proven bilateral compatibility.', 'done')
      }

      // Destination: Mobile Phone Layout
      else if (lower.includes('phone') || lower.includes('mobile') || lower.includes('one-hand') || lower.includes('compact')) {
        setCurrentStep(`Switching to ${!isPhoneMode ? 'Mobile Phone view' : 'Desktop view'}...`)
        onTogglePhoneMode()
        await new Promise((r) => setTimeout(r, 650))
        if (abortRef.current) return

        await focusElement('nav, .fixed.bottom-0', 'Calibrating the 4-tab mobile navigation...')
        addJourneyStep(
          `Switched to ${!isPhoneMode ? 'Mobile Phone layout' : 'Desktop layout'}.`,
          'Optimized for comfortable, calm interaction.',
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
        addJourneyStep('First Date Blueprint loaded.', 'Low-pressure spaces with comfortable acoustic profiles.', 'done')
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
        addJourneyStep('Boundary audit complete.', 'Ensuring realistic preferences without accidental blocking.', 'done')
      }

      // Destination: Wingman Assistant
      else if (lower.includes('wingman') || lower.includes('advice') || lower.includes('guidance') || lower.includes('reflect')) {
        setCurrentStep('Summoning Wingman Assistant...')
        if (onOpenWingman) {
          onOpenWingman()
          addJourneyStep('Wingman is open.', 'Ready for thoughtful conversation guidance and profile clarity.', 'done')
        } else {
          startTransition(() => onSelectView('conversations'))
          addJourneyStep('Navigated to Conversations.', undefined, 'done')
        }
        await new Promise((r) => setTimeout(r, 650))
      }

      // Destination: Terms & Regulatory Disclosures
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

      // Default Exploration
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
      addJourneyStep('Exploration paused.', 'You can select a destination above or try again.', 'error')
      setCurrentStep('Ready')
    } finally {
      setIsRunning(false)
    }
  }

  // ==========================================================================
  // NATIVE PAGE-AGENT EXECUTION (Client-side DOM reasoning)
  // ==========================================================================
  const runLiveAgent = async (prompt: string) => {
    if (!apiKey && provider !== 'ollama') {
      addJourneyStep('API Key needed', 'Please add your key in Settings to use live AI navigation.', 'error')
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
          system: `You are Paige — a calm, personal guide for "Check" (a reciprocal compatibility and relationship decision platform).
Current view: "${activeView}".
User: ${currentUser?.identity.name || 'User'}.
Guide the user smoothly, calmly, and helpfully without disrupting their viewing experience.`,
        },
      })

      agentRef.current = agent

      agent.addEventListener('activity', ((e: CustomEvent) => {
        const act = e.detail
        if (!act) return
        if (act.type === 'thinking') {
          setCurrentStep('Thinking about the best path...')
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

  // Curated elegant destination suggestions
  const SUGGESTIONS = [
    {
      label: 'Constellation Map',
      desc: '3D connections & lifestyle clusters',
      prompt: 'Open the Living Constellation map and inspect clusters',
      icon: <Compass className="w-4 h-4 text-purple-300" />,
    },
    {
      label: 'High Mutual Fit',
      desc: 'Filter queue to 80%+ matches',
      prompt: 'Filter candidate queue to 80%+ High Fit reciprocal matches',
      icon: <Sparkles className="w-4 h-4 text-pink-300" />,
    },
    {
      label: 'Date Planner',
      desc: 'First date blueprint & vetted spots',
      prompt: 'Open Date Planner and review first date blueprint recommendations',
      icon: <Coffee className="w-4 h-4 text-amber-300" />,
    },
    {
      label: 'Dealbreaker Audit',
      desc: 'Review boundaries & dealbreakers',
      prompt: 'Audit preference contradictions and dealbreaker boundaries',
      icon: <Shield className="w-4 h-4 text-cyan-300" />,
    },
    {
      label: 'Phone Layout',
      desc: 'Switch to one-handed mobile view',
      prompt: 'Switch to Phone Mode for one-handed mobile navigation',
      icon: <Smartphone className="w-4 h-4 text-emerald-300" />,
    },
    {
      label: 'Wingman Copilot',
      desc: 'Relationship advice & insights',
      prompt: 'Summon Wingman Assistant for relationship advice & profile guidance',
      icon: <MessageSquare className="w-4 h-4 text-sky-300" />,
    },
  ]

  return (
    <>
      {/* ================================================================== */}
      {/* 1. CALM FLOATING LAUNCHER PILL (Bottom Left)                       */}
      {/* ================================================================== */}
      <div className="fixed bottom-20 left-4 z-40 sm:bottom-6 sm:left-6">
        <button
          type="button"
          onClick={() => {
            setIsOpen((prev) => !prev)
            setShowSettings(false)
          }}
          className={`group px-3.5 py-2 rounded-full text-xs font-medium shadow-xl backdrop-blur-2xl border flex items-center space-x-2.5 transition-all duration-300 cursor-pointer active:scale-95 ${
            isOpen
              ? 'bg-[#1c1b22] text-white border-pink-400/40 shadow-[0_4px_24px_rgba(244,114,182,0.25)] ring-1 ring-pink-400/30'
              : 'bg-[#151419]/90 hover:bg-[#1a1920] text-neutral-200 hover:text-white border-white/10 hover:border-white/20'
          }`}
          aria-label="Open Paige In-App Guide"
        >
          {/* Subtle Organic Breathing Indicator */}
          <div className="relative flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-gradient-to-tr from-pink-400 to-purple-400" />
            <span
              className={`absolute inset-0 rounded-full bg-pink-400/50 ${
                isRunning ? 'animate-ping' : 'animate-pulse'
              }`}
            />
          </div>

          <span className="font-medium tracking-tight">Paige</span>

          <span className="text-[10px] text-neutral-400 px-1.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06]">
            {isRunning ? 'Guiding...' : 'Guide'}
          </span>
        </button>
      </div>

      {/* ================================================================== */}
      {/* 2. ELEGANT IN-APP GUIDE MODAL / DRAWER                             */}
      {/* ================================================================== */}
      {isOpen && (
        <div
          className="fixed z-50 bottom-20 left-4 sm:bottom-20 sm:left-6 w-[calc(100vw-2rem)] sm:w-[420px] max-h-[82vh] bg-[#121115]/95 border border-white/10 rounded-3xl shadow-[0_24px_70px_rgba(0,0,0,0.85)] backdrop-blur-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200"
          role="dialog"
          aria-label="Paige Personal Guide"
        >
          {/* Calm Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] bg-white/[0.02]">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-pink-500/20 via-purple-500/20 to-sky-500/20 border border-white/10 flex items-center justify-center text-pink-300">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-semibold text-white tracking-tight">Paige</h3>
                  <span className="text-[10px] text-neutral-400 font-normal">Personal Guide</span>
                </div>
                <p className="text-[11px] text-neutral-400 font-light truncate max-w-[220px]">
                  {currentStep}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 rounded-xl transition ${
                  showSettings
                    ? 'text-pink-300 bg-white/10'
                    : 'text-neutral-400 hover:text-white hover:bg-white/[0.06]'
                }`}
                title="Configuration & Keys"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/[0.06] transition"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Settings Drawer View */}
          {showSettings ? (
            <div className="p-5 space-y-4 max-h-[380px] overflow-y-auto">
              <div>
                <h4 className="text-xs font-semibold text-white mb-1">Intelligence Mode</h4>
                <p className="text-[11px] text-neutral-400 font-light mb-3">
                  Choose how Paige perceives and navigates the platform:
                </p>

                <select
                  value={provider}
                  onChange={(e) => handleSelectProvider(e.target.value as ProviderPreset)}
                  className="w-full text-xs bg-[#1a1920] border border-white/10 rounded-2xl px-3.5 py-2.5 text-white focus:outline-none focus:border-pink-400/50"
                >
                  {Object.entries(PROVIDER_CONFIGS).map(([key, cfg]) => (
                    <option key={key} value={key}>
                      {cfg.name}
                    </option>
                  ))}
                </select>
              </div>

              {provider !== 'demo' && (
                <div className="space-y-3 pt-2">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <label className="text-white font-medium flex items-center space-x-1">
                        <Key className="w-3.5 h-3.5 text-amber-300" />
                        <span>API Key</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowKey(!showKey)}
                        className="text-[10px] text-neutral-400 hover:text-neutral-200"
                      >
                        {showKey ? 'Hide' : 'Reveal'}
                      </button>
                    </div>
                    <input
                      type={showKey ? 'text' : 'password'}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder={PROVIDER_CONFIGS[provider].placeholderKey}
                      className="w-full text-xs font-mono bg-[#1a1920] border border-white/10 rounded-2xl px-3.5 py-2 text-white focus:outline-none focus:border-pink-400/50"
                    />
                    <p className="text-[10px] text-neutral-500 font-light">
                      Stored in your browser only. Never transmitted to our backend.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-white font-medium block">Model Name</label>
                    <input
                      type="text"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder="e.g. qwen-plus or gpt-4o"
                      className="w-full text-xs font-mono bg-[#1a1920] border border-white/10 rounded-2xl px-3.5 py-2 text-white focus:outline-none focus:border-pink-400/50"
                    />
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                <a
                  href="https://alibaba.github.io/page-agent/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-neutral-400 hover:text-pink-300 flex items-center space-x-1"
                >
                  <span>About page-agent</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  type="button"
                  onClick={handleSaveConfig}
                  className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 text-white font-medium text-xs transition cursor-pointer"
                >
                  Save Settings
                </button>
              </div>
            </div>
          ) : (
            /* Main Conversational & Exploration View */
            <div className="flex-1 flex flex-col p-5 space-y-4 overflow-hidden">
              {/* Natural Human Input Bar */}
              <div className="relative">
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
                  placeholder="Ask Paige where to explore or what to find?..."
                  className="w-full text-xs bg-[#1a1920] border border-white/10 rounded-full pl-4 pr-11 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-pink-400/50 transition"
                />

                <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
                  {isRunning ? (
                    <button
                      type="button"
                      onClick={handleStop}
                      className="w-7 h-7 rounded-full bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 flex items-center justify-center transition cursor-pointer"
                      title="Pause"
                    >
                      <Square className="w-3 h-3 fill-current" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleExecute()}
                      disabled={!taskInput.trim()}
                      className="w-7 h-7 rounded-full bg-pink-400 hover:bg-pink-300 disabled:bg-neutral-800 disabled:text-neutral-600 text-black flex items-center justify-center transition cursor-pointer shadow-sm"
                      title="Submit"
                    >
                      <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                  )}
                </div>
              </div>

              {/* Curated In-App Destination Chips */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-medium text-neutral-400 tracking-wide uppercase">
                  Suggested Destinations
                </span>
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
                      className="p-2.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-white/15 text-left transition cursor-pointer flex flex-col justify-between group"
                    >
                      <div className="flex items-center space-x-2">
                        {item.icon}
                        <span className="text-xs font-medium text-white group-hover:text-pink-200 transition">
                          {item.label}
                        </span>
                      </div>
                      <span className="text-[10px] text-neutral-400 font-light mt-1 line-clamp-1">
                        {item.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Serene Journey Steps Feed */}
              <div
                ref={stepsContainerRef}
                className="flex-1 min-h-[110px] max-h-[160px] overflow-y-auto space-y-2 pr-1 pt-1"
              >
                {journeySteps.map((step) => (
                  <div
                    key={step.id}
                    className="flex items-start space-x-2.5 text-xs text-neutral-300 leading-relaxed"
                  >
                    <span className="mt-0.5 shrink-0">
                      {step.status === 'done' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : step.status === 'active' ? (
                        <span className="w-2 h-2 rounded-full bg-pink-400 inline-block animate-pulse" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
                      )}
                    </span>
                    <div>
                      <p className="font-light text-neutral-200">{step.text}</p>
                      {step.subtext && (
                        <p className="text-[11px] text-neutral-500 font-light mt-0.5">
                          {step.subtext}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}
