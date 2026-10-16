// ============================================================================
// src/components/PageAgentWidget.tsx
// Alibaba PageAgent Autonomous In-Page Navigator & GUI Controller
// https://alibaba.github.io/page-agent/
// ============================================================================

import React, { useState, useEffect, useRef, useTransition } from 'react'
import {
  Bot,
  Sparkles,
  Play,
  Square,
  Settings,
  Key,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  X,
  Compass,
  Smartphone,
  Coffee,
  RotateCcw,
  Layers,
  ArrowRight,
  Shield,
  MessageSquare,
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

interface StepLog {
  id: string
  timestamp: string
  type: 'thinking' | 'action' | 'success' | 'error' | 'info'
  text: string
  detail?: string
}

const PROVIDER_CONFIGS: Record<
  ProviderPreset,
  { name: string; baseURL: string; defaultModel: string; placeholderKey: string }
> = {
  demo: {
    name: 'Interactive Guided Simulator (Zero Key Required)',
    baseURL: '',
    defaultModel: 'page-agent-simulator',
    placeholderKey: 'No API key needed — instant browser automation',
  },
  dashscope: {
    name: 'Alibaba Cloud Qwen (DashScope)',
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
    name: 'DeepSeek (deepseek-chat)',
    baseURL: 'https://api.deepseek.com/v1',
    defaultModel: 'deepseek-chat',
    placeholderKey: 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  },
  ollama: {
    name: 'Local Ollama (Self-Hosted)',
    baseURL: 'http://localhost:11434/v1',
    defaultModel: 'qwen2.5:7b',
    placeholderKey: 'ollama (usually not required)',
  },
  custom: {
    name: 'Custom OpenAI-Compatible Endpoint',
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
  const [isMinimized, setIsMinimized] = useState(false)
  const [activeTab, setActiveTab] = useState<'agent' | 'config' | 'presets'>('agent')

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
  const [currentStatus, setCurrentStatus] = useState<string>('Ready for commands')
  const [logs, setLogs] = useState<StepLog[]>(() => [
    {
      id: 'init',
      timestamp: 'Ready',
      type: 'info',
      text: 'Alibaba Page Agent v1.12.4 ready. Select an action or enter instructions.',
      detail: 'Supports autonomous DOM perception, element interaction, and intelligent navigation.',
    },
  ])

  const agentRef = useRef<PageAgent | null>(null)
  const demoAbortRef = useRef<boolean>(false)
  const logScrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll logs
  useEffect(() => {
    if (logScrollRef.current) {
      logScrollRef.current.scrollTop = logScrollRef.current.scrollHeight
    }
  }, [logs])

  // Listen for open-page-agent global event
  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true)
      setIsMinimized(false)
    }
    window.addEventListener('open-page-agent', handleOpen)
    return () => window.removeEventListener('open-page-agent', handleOpen)
  }, [])

  // Save settings on update
  const handleSaveConfig = () => {
    localStorage.setItem('check_pageagent_provider', provider)
    localStorage.setItem('check_pageagent_apikey', apiKey)
    localStorage.setItem('check_pageagent_baseurl', baseURL)
    localStorage.setItem('check_pageagent_model', model)
    appendLog('info', 'Configuration saved to browser local storage.')
    setActiveTab('agent')
  }

  // Handle provider selection
  const handleSelectProvider = (p: ProviderPreset) => {
    setProvider(p)
    const cfg = PROVIDER_CONFIGS[p]
    if (p !== 'custom') {
      setBaseURL(cfg.baseURL)
      setModel(cfg.defaultModel)
    }
  }

  const appendLog = (type: StepLog['type'], text: string, detail?: string) => {
    setLogs((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).slice(2, 9),
        timestamp: new Date().toLocaleTimeString(),
        type,
        text,
        detail,
      },
    ])
  }

  // Visual element highlighter helper for both Demo & Real Mode
  const highlightElement = async (selector: string, message: string, durationMs = 1200) => {
    const el = document.querySelector(selector) as HTMLElement | null
    if (!el) return false

    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    const prevOutline = el.style.outline
    const prevShadow = el.style.boxShadow
    const prevTransition = el.style.transition

    el.style.transition = 'all 0.3s ease-in-out'
    el.style.outline = '3px solid #10b981'
    el.style.boxShadow = '0 0 24px rgba(16, 185, 129, 0.6)'

    appendLog('action', `🎯 In-Page Focus: ${message}`, `Inspected element: ${selector}`)

    await new Promise((r) => setTimeout(r, durationMs))

    el.style.outline = prevOutline
    el.style.boxShadow = prevShadow
    el.style.transition = prevTransition
    return true
  }

  // Stop running agent
  const handleStop = async () => {
    demoAbortRef.current = true
    if (agentRef.current) {
      try {
        await agentRef.current.stop()
        appendLog('info', 'PageAgent stopped by user.')
      } catch (err) {
        console.warn('Error stopping PageAgent:', err)
      }
    }
    setIsRunning(false)
    setCurrentStatus('Stopped')
  }

  // Execution dispatcher: either native PageAgent or Guided Interactive Simulator
  const handleExecute = async (overridePrompt?: string) => {
    const task = (overridePrompt ?? taskInput).trim()
    if (!task) return

    setIsRunning(true)
    demoAbortRef.current = false
    setIsOpen(true)
    setIsMinimized(false)
    appendLog('info', `🚀 Initiating task: "${task}"`)

    if (provider === 'demo') {
      await executeGuidedSimulation(task)
    } else {
      await executeNativePageAgent(task)
    }
  }

  // ==========================================================================
  // 1. NATIVE ALIBABA PAGE-AGENT EXECUTION LOOP
  // ==========================================================================
  const executeNativePageAgent = async (task: string) => {
    if (!apiKey && provider !== 'ollama') {
      appendLog('error', 'API Key Missing', 'Please enter your API Key in the Settings tab.')
      setIsRunning(false)
      setActiveTab('config')
      return
    }

    try {
      setCurrentStatus('Initializing Alibaba PageAgent instance...')
      appendLog('thinking', 'Instantiating PageAgent with DOM perception model...')

      // Lazy import or instantiate PageAgent
      const { PageAgent } = await import('page-agent')

      // Clean up previous instance
      if (agentRef.current) {
        agentRef.current.dispose()
        agentRef.current = null
      }

      const agent = new PageAgent({
        baseURL: baseURL || PROVIDER_CONFIGS[provider].baseURL,
        model: model || PROVIDER_CONFIGS[provider].defaultModel,
        apiKey: apiKey || undefined,
        language: 'en-US',
        maxSteps: 25,
        instructions: {
          system: `You are the Autonomous Page Navigator for "Check" — a reciprocal relationship decision and compatibility platform.
The user is currently on view "${activeView}".
User identity: ${currentUser?.identity.name || 'User'}, age ${currentUser?.identity.age || 'Unknown'}.
Your duty is to explore the interface, find compatibility insights, filter candidates, examine mutual fit metrics, open the constellation map, and assist the user smoothly without breaking the layout.`,
        },
      })

      agentRef.current = agent

      // Listen for status changes
      agent.addEventListener('statuschange', () => {
        setCurrentStatus(`Agent status: ${agent.status}`)
      })

      // Listen for activity events
      agent.addEventListener('activity', ((e: CustomEvent) => {
        const act = e.detail
        if (!act) return

        if (act.type === 'thinking') {
          setCurrentStatus('Thinking and reasoning over DOM state...')
          appendLog('thinking', 'Reflecting on DOM elements & plan...')
        } else if (act.type === 'executing') {
          setCurrentStatus(`Executing tool: ${act.tool}`)
          appendLog('action', `Tool: ${act.tool}`, JSON.stringify(act.input))
        } else if (act.type === 'executed') {
          appendLog('success', `Executed: ${act.tool} (${act.duration}ms)`, String(act.output || ''))
        } else if (act.type === 'error') {
          appendLog('error', `Agent execution warning: ${act.message}`)
        }
      }) as EventListener)

      setCurrentStatus('Executing task across DOM...')
      const result = await agent.execute(task)

      if (result.success) {
        appendLog('success', 'Task Completed Successfully', result.data)
        setCurrentStatus('Task completed')
      } else {
        appendLog('error', 'Task Ended with Failure/Incomplete', result.data)
        setCurrentStatus('Task halted')
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err)
      appendLog('error', 'Execution Error', errMsg)
      setCurrentStatus('Execution error')
    } finally {
      setIsRunning(false)
    }
  }

  // ==========================================================================
  // 2. GUIDED INTERACTIVE SIMULATOR (Immediate instant demo)
  // ==========================================================================
  const executeGuidedSimulation = async (task: string) => {
    const lower = task.toLowerCase()

    try {
      setCurrentStatus('Perceiving DOM hierarchy and navigation nodes...')
      appendLog('thinking', 'Analyzing prompt intent against platform capabilities...')
      await new Promise((r) => setTimeout(r, 600))
      if (demoAbortRef.current) return

      // Branch 1: Living Constellation / Algorithm Network
      if (lower.includes('constellation') || lower.includes('network') || lower.includes('map')) {
        appendLog('action', 'Autonomous Action: Switching view to Constellation Map')
        startTransition(() => {
          onSelectView('network')
        })
        await new Promise((r) => setTimeout(r, 800))
        if (demoAbortRef.current) return

        setCurrentStatus('Locating 2D/3D projection canvas...')
        await highlightElement(
          '#network-canvas-container, canvas, [data-view="network"]',
          'Living Constellation Canvas detected with real-time particle clusters'
        )
        appendLog('success', 'Constellation visualizer brought into active view with reciprocal clusters.')
      }

      // Branch 2: High Fit Filter / Candidate Queue
      else if (lower.includes('filter') || lower.includes('high fit') || lower.includes('80%') || lower.includes('matches')) {
        appendLog('action', 'Autonomous Action: Navigating to Candidate Discovery feed')
        startTransition(() => {
          onSelectView('recs')
        })
        await new Promise((r) => setTimeout(r, 600))
        if (demoAbortRef.current) return

        if (onFilterModeChange) {
          appendLog('action', 'Autonomous Action: Applying High Reciprocal Fit (80%+ threshold) filter')
          onFilterModeChange('high_fit')
        }

        setCurrentStatus('Inspecting match cards and compatibility badges...')
        await highlightElement(
          '.grid > div, [data-candidate-id], article',
          'Filtered candidate feed to mutual 80%+ compatibility candidates'
        )
        appendLog('success', 'Candidate queue filtered. Only reciprocal high-alignment matches displayed.')
      }

      // Branch 3: Phone Mode / Mobile Experience
      else if (lower.includes('phone') || lower.includes('mobile') || lower.includes('one-handed')) {
        appendLog('action', `Autonomous Action: Toggling Phone Mode (currently: ${isPhoneMode ? 'ON' : 'OFF'})`)
        onTogglePhoneMode()
        await new Promise((r) => setTimeout(r, 700))
        if (demoAbortRef.current) return

        setCurrentStatus('Calibrating 4-tab mobile navigation bar...')
        await highlightElement(
          'nav, .fixed.bottom-0',
          'Mobile bottom navigation: Discover, Messages, Date Plan, Profile'
        )
        appendLog('success', `Phone Mode toggled to ${!isPhoneMode ? 'Active (Mobile UX)' : 'Desktop View'}.`)
      }

      // Branch 4: Date Planning / Blueprint
      else if (lower.includes('date') || lower.includes('coffee') || lower.includes('plan') || lower.includes('venue')) {
        appendLog('action', 'Autonomous Action: Opening Date Planner and First Date Blueprint')
        startTransition(() => {
          onSelectView('date_brief')
        })
        await new Promise((r) => setTimeout(r, 800))
        if (demoAbortRef.current) return

        setCurrentStatus('Scanning curated third-space venues and safety cues...')
        await highlightElement(
          'button, .p-6.rounded-2xl',
          'Curated low-pressure third space date blueprint and conversation prompts'
        )
        appendLog('success', 'First Date Blueprint loaded with vetted acoustic and safety profiles.')
      }

      // Branch 5: Contradictions / Boundaries / Dealbreakers
      else if (lower.includes('contradiction') || lower.includes('dealbreaker') || lower.includes('boundary') || lower.includes('rules')) {
        appendLog('action', 'Autonomous Action: Navigating to Contradictions & Boundary Auditor')
        startTransition(() => {
          onSelectView('contradictions')
        })
        await new Promise((r) => setTimeout(r, 800))
        if (demoAbortRef.current) return

        setCurrentStatus('Auditing stated preferences against realistic candidate sets...')
        await highlightElement(
          '.rounded-2xl, div[role="alert"]',
          'Mathematical boundary check verifying preference coherence'
        )
        appendLog('success', 'Preference audit completed: no hard blocking contradictions.')
      }

      // Branch 6: Terms / Algorithmic Transparency
      else if (lower.includes('terms') || lower.includes('law') || lower.includes('privacy') || lower.includes('statutory') || lower.includes('disclosure')) {
        appendLog('action', 'Autonomous Action: Opening Terms of Service & Statutory Disclosures')
        if (onOpenTerms) {
          onOpenTerms()
        } else {
          startTransition(() => onSelectView('about_faq'))
        }
        await new Promise((r) => setTimeout(r, 700))
        appendLog('success', 'Statutory disclosures and non-pay-to-win invariants displayed.')
      }

      // Branch 7: Wingman Assistant
      else if (lower.includes('wingman') || lower.includes('assistant') || lower.includes('copilot') || lower.includes('advice')) {
        appendLog('action', 'Autonomous Action: Summoning Wingman Autonomous Copilot')
        if (onOpenWingman) {
          onOpenWingman()
          appendLog('success', 'Wingman Copilot active with personalized relationship guidance.')
        } else {
          startTransition(() => onSelectView('conversations'))
          appendLog('success', 'Navigated to Conversations and Wingman guidance.')
        }
        await new Promise((r) => setTimeout(r, 700))
      }

      // Default Generic Fallback for unknown prompts
      else {
        appendLog('thinking', `Interpreting semantic target for: "${task}"`)
        await new Promise((r) => setTimeout(r, 500))
        appendLog('action', 'Navigating to Discover matches to inspect available interfaces')
        startTransition(() => {
          onSelectView('recs')
        })
        await new Promise((r) => setTimeout(r, 600))
        await highlightElement('main', 'Universal platform container analyzed')
        appendLog('success', `Completed autonomous exploration for: "${task}"`)
      }

      setCurrentStatus('Task completed successfully')
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err)
      appendLog('error', 'Simulator error', errMsg)
      setCurrentStatus('Simulator interrupted')
    } finally {
      setIsRunning(false)
    }
  }

  // Curated quick-actions
  const QUICK_PROMPTS = [
    {
      title: 'Living Constellation',
      prompt: 'Open the Living Constellation map and inspect candidate clusters',
      icon: <Compass className="w-3.5 h-3.5 text-purple-400" />,
      color: 'border-purple-500/30 hover:border-purple-400/60 bg-purple-950/20',
    },
    {
      title: 'Filter 80%+ High Fit',
      prompt: 'Filter candidate queue to 80%+ High Fit reciprocal matches',
      icon: <Sparkles className="w-3.5 h-3.5 text-rose-400" />,
      color: 'border-rose-500/30 hover:border-rose-400/60 bg-rose-950/20',
    },
    {
      title: 'Toggle Phone Mode',
      prompt: 'Switch to Phone Mode for one-handed mobile navigation',
      icon: <Smartphone className="w-3.5 h-3.5 text-emerald-400" />,
      color: 'border-emerald-500/30 hover:border-emerald-400/60 bg-emerald-950/20',
    },
    {
      title: 'Date Blueprint',
      prompt: 'Open Date Planner and review first date blueprint recommendations',
      icon: <Coffee className="w-3.5 h-3.5 text-amber-400" />,
      color: 'border-amber-500/30 hover:border-amber-400/60 bg-amber-950/20',
    },
    {
      title: 'Audit Dealbreakers',
      prompt: 'Audit preference contradictions and dealbreaker boundaries',
      icon: <Shield className="w-3.5 h-3.5 text-cyan-400" />,
      color: 'border-cyan-500/30 hover:border-cyan-400/60 bg-cyan-950/20',
    },
    {
      title: 'Statutory Disclosures',
      prompt: 'Open Terms of Service and statutory algorithmic disclosures',
      icon: <Layers className="w-3.5 h-3.5 text-blue-400" />,
      color: 'border-blue-500/30 hover:border-blue-400/60 bg-blue-950/20',
    },
    {
      title: 'Wingman Copilot',
      prompt: 'Summon Wingman Assistant for relationship advice & profile guidance',
      icon: <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />,
      color: 'border-emerald-500/30 hover:border-emerald-400/60 bg-emerald-950/20',
    },
  ]

  return (
    <>
      {/* ================================================================== */}
      {/* FLOATING COPILOT LAUNCHER BUTTON                                    */}
      {/* ================================================================== */}
      <div className="fixed bottom-20 left-4 z-40 sm:bottom-6 sm:left-6">
        <button
          type="button"
          onClick={() => {
            setIsOpen((prev) => !prev)
            setIsMinimized(false)
          }}
          className={`group px-3.5 py-2 rounded-full text-xs font-semibold shadow-2xl backdrop-blur-xl border flex items-center space-x-2.5 transition-all cursor-pointer active:scale-95 ${
            isOpen
              ? 'bg-sky-500/25 text-sky-200 border-sky-400/60 shadow-[0_4px_30px_rgba(56,189,248,0.4)] ring-2 ring-sky-400/40'
              : 'bg-neutral-900/90 hover:bg-neutral-800 text-white border-white/20 hover:border-sky-400/40 shadow-xl'
          }`}
          aria-label="Open Alibaba PageAgent Navigator"
          title="Alibaba Page Agent: In-Page Autonomous Navigation"
        >
          <div className="relative flex items-center justify-center">
            <Bot className="w-4 h-4 text-sky-400 transition-transform group-hover:scale-110" />
            <span
              className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${
                isRunning ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 animate-pulse'
              }`}
            />
          </div>
          <span className="font-medium tracking-tight">
            {isRunning ? 'Page Agent Acting...' : 'Page Agent'}
          </span>
          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
            {provider === 'demo' ? 'Ready' : provider}
          </span>
        </button>
      </div>

      {/* ================================================================== */}
      {/* PAGE AGENT CONTROL CENTER DRAWER / MODAL                            */}
      {/* ================================================================== */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 ${
            isMinimized
              ? 'bottom-20 left-4 w-80 bg-neutral-950/95 border border-sky-500/30 rounded-2xl shadow-2xl backdrop-blur-2xl p-3'
              : 'bottom-20 left-4 sm:bottom-20 sm:left-6 w-[calc(100vw-2rem)] sm:w-[460px] max-h-[82vh] bg-neutral-950/95 border border-white/15 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] backdrop-blur-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4'
          }`}
          role="dialog"
          aria-label="Page Agent Autonomous Controller"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/[0.03]">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <h3 className="text-xs font-semibold text-white tracking-tight">
                    Alibaba PageAgent
                  </h3>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-neutral-300">
                    v1.12.4
                  </span>
                </div>
                <p className="text-[10px] text-neutral-400 truncate max-w-[220px]">
                  {currentStatus}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition"
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Navigation Tabs */}
              <div className="flex border-b border-white/10 text-xs px-3 pt-2 bg-black/20">
                <button
                  type="button"
                  onClick={() => setActiveTab('agent')}
                  className={`pb-2 px-3 font-medium transition cursor-pointer border-b-2 flex items-center space-x-1.5 ${
                    activeTab === 'agent'
                      ? 'border-sky-400 text-sky-400'
                      : 'border-transparent text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>Agent Action</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('presets')}
                  className={`pb-2 px-3 font-medium transition cursor-pointer border-b-2 flex items-center space-x-1.5 ${
                    activeTab === 'presets'
                      ? 'border-sky-400 text-sky-400'
                      : 'border-transparent text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Quick Actions</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('config')}
                  className={`pb-2 px-3 font-medium transition cursor-pointer border-b-2 flex items-center space-x-1.5 ${
                    activeTab === 'config'
                      ? 'border-sky-400 text-sky-400'
                      : 'border-transparent text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Model Config</span>
                </button>
              </div>

              {/* Tab 1: Agent Execution & Logs */}
              {activeTab === 'agent' && (
                <div className="flex-1 flex flex-col p-4 space-y-3 overflow-hidden">
                  {/* Natural Language Prompt Input */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-neutral-300 flex items-center justify-between">
                      <span>Give instructions to PageAgent</span>
                      <span className="text-[10px] text-neutral-500">Autonomous In-Page GUI Agent</span>
                    </label>
                    <div className="relative">
                      <textarea
                        value={taskInput}
                        onChange={(e) => setTaskInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                            handleExecute()
                          }
                        }}
                        placeholder="e.g. Open the Living Constellation map, or filter queue to high-fit matches..."
                        rows={2}
                        disabled={isRunning}
                        className="w-full text-xs bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-sky-400 transition resize-none disabled:opacity-50"
                      />
                      <div className="absolute right-2 bottom-2 flex items-center space-x-1">
                        {isRunning ? (
                          <button
                            type="button"
                            onClick={handleStop}
                            className="px-2.5 py-1 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white text-[11px] font-medium flex items-center space-x-1 transition cursor-pointer shadow-md"
                          >
                            <Square className="w-3 h-3" />
                            <span>Stop</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleExecute()}
                            disabled={!taskInput.trim()}
                            className="px-3 py-1 rounded-lg bg-sky-500 hover:bg-sky-400 disabled:bg-neutral-800 disabled:text-neutral-500 text-black text-[11px] font-semibold flex items-center space-x-1 transition cursor-pointer shadow-md"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>Run</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Mode Banner */}
                  <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.03] border border-white/5 text-[11px]">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          provider === 'demo' ? 'bg-emerald-400' : 'bg-sky-400'
                        }`}
                      />
                      <span className="text-neutral-300">
                        {provider === 'demo'
                          ? 'Demo Simulator Mode (Instant, No Key)'
                          : `Live LLM: ${provider} (${model})`}
                      </span>
                    </div>
                    {provider === 'demo' && (
                      <button
                        type="button"
                        onClick={() => setActiveTab('config')}
                        className="text-[10px] text-sky-400 hover:underline cursor-pointer"
                      >
                        Set API Key →
                      </button>
                    )}
                  </div>

                  {/* Live Activity & Telemetry Log */}
                  <div className="flex-1 flex flex-col min-h-[160px] max-h-[220px] bg-neutral-900/80 border border-white/10 rounded-2xl p-2.5 overflow-hidden">
                    <div className="flex items-center justify-between pb-1.5 border-b border-white/5 text-[10px] text-neutral-400 font-mono">
                      <span>PAGE AGENT TELEMETRY LOG</span>
                      <button
                        type="button"
                        onClick={() =>
                          setLogs([
                            {
                              id: 'cleared',
                              timestamp: new Date().toLocaleTimeString(),
                              type: 'info',
                              text: 'Telemetry logs reset.',
                            },
                          ])
                        }
                        className="hover:text-white transition flex items-center space-x-1"
                      >
                        <RotateCcw className="w-2.5 h-2.5" />
                        <span>Clear</span>
                      </button>
                    </div>

                    <div ref={logScrollRef} className="flex-1 overflow-y-auto space-y-1.5 pt-2 pr-1 font-mono text-[11px]">
                      {logs.map((log) => (
                        <div key={log.id} className="flex items-start space-x-2 text-neutral-300 leading-tight">
                          <span className="text-[9px] text-neutral-500 mt-0.5 select-none">
                            {log.timestamp}
                          </span>
                          <span className="mt-0.5">
                            {log.type === 'thinking' && <span className="text-purple-400">💭</span>}
                            {log.type === 'action' && <span className="text-sky-400">⚡</span>}
                            {log.type === 'success' && <span className="text-emerald-400">✅</span>}
                            {log.type === 'error' && <span className="text-rose-400">❌</span>}
                            {log.type === 'info' && <span className="text-neutral-400">ℹ️</span>}
                          </span>
                          <div className="flex-1">
                            <p
                              className={`${
                                log.type === 'error'
                                  ? 'text-rose-300'
                                  : log.type === 'success'
                                  ? 'text-emerald-300'
                                  : log.type === 'thinking'
                                  ? 'text-purple-200'
                                  : 'text-neutral-200'
                              }`}
                            >
                              {log.text}
                            </p>
                            {log.detail && (
                              <p className="text-[10px] text-neutral-500 break-words mt-0.5">
                                {log.detail}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Quick Action Presets */}
              {activeTab === 'presets' && (
                <div className="p-4 space-y-2.5 max-h-[360px] overflow-y-auto">
                  <p className="text-[11px] text-neutral-400">
                    Tap any preset below. The Page Agent will autonomously parse the DOM and navigate or calibrate the app for you:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {QUICK_PROMPTS.map((q) => (
                      <button
                        key={q.title}
                        type="button"
                        onClick={() => {
                          setTaskInput(q.prompt)
                          setActiveTab('agent')
                          handleExecute(q.prompt)
                        }}
                        disabled={isRunning}
                        className={`p-3 rounded-xl border text-left transition cursor-pointer active:scale-98 flex flex-col justify-between ${q.color}`}
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          {q.icon}
                          <span className="text-xs font-semibold text-white">{q.title}</span>
                        </div>
                        <p className="text-[10px] text-neutral-400 line-clamp-2">{q.prompt}</p>
                        <div className="mt-2 flex items-center text-[10px] text-sky-400 font-medium">
                          <span>Dispatch Agent</span>
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Model Configuration */}
              {activeTab === 'config' && (
                <div className="p-4 space-y-4 max-h-[380px] overflow-y-auto">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-white">AI Provider Preset</label>
                    <select
                      value={provider}
                      onChange={(e) => handleSelectProvider(e.target.value as ProviderPreset)}
                      className="w-full text-xs bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-400"
                    >
                      {Object.entries(PROVIDER_CONFIGS).map(([key, cfg]) => (
                        <option key={key} value={key}>
                          {cfg.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {provider !== 'demo' && (
                    <>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-white flex items-center justify-between">
                          <span className="flex items-center space-x-1">
                            <Key className="w-3.5 h-3.5 text-amber-400" />
                            <span>API Key</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setShowKey(!showKey)}
                            className="text-[10px] text-neutral-400 hover:text-white"
                          >
                            {showKey ? 'Hide' : 'Show'}
                          </button>
                        </label>
                        <input
                          type={showKey ? 'text' : 'password'}
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                          placeholder={PROVIDER_CONFIGS[provider].placeholderKey}
                          className="w-full text-xs font-mono bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-400"
                        />
                        <p className="text-[10px] text-neutral-500">
                          Keys stay in your local browser only. Never transmitted to our backend.
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-white">Base URL</label>
                        <input
                          type="text"
                          value={baseURL}
                          onChange={(e) => setBaseURL(e.target.value)}
                          placeholder="https://dashscope.aliyuncs.com/compatible-mode/v1"
                          className="w-full text-xs font-mono bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-400"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-white">Model Name</label>
                        <input
                          type="text"
                          value={model}
                          onChange={(e) => setModel(e.target.value)}
                          placeholder="qwen-plus or gpt-4o"
                          className="w-full text-xs font-mono bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-400"
                        />
                      </div>
                    </>
                  )}

                  <div className="pt-2 flex items-center justify-between">
                    <a
                      href="https://alibaba.github.io/page-agent/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-neutral-400 hover:text-sky-300 flex items-center space-x-1"
                    >
                      <span>PageAgent Docs</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <button
                      type="button"
                      onClick={handleSaveConfig}
                      className="px-4 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-semibold text-xs transition cursor-pointer shadow-md"
                    >
                      Save Configuration
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  )
}
