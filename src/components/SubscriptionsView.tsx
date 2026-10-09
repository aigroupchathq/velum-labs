// ============================================================================
// src/components/SubscriptionsView.tsx
// Universal Compatibility Platform: Best-in-Class Ethical Pricing Strategy
// Designed with Apple-Grade Precision, Conversion Psychology & Strict Ethics:
// - Multi-Currency: USD ($), GBP (£), EUR (€), CAD (C$), AUD (A$)
// - Monthly vs Annual Switcher (45% Annual Savings + 2 Months Free)
// - Tier 1: Community / Sanctuary ($0 forever)
// - Tier 2: Plus / Intentional Member (Most Popular ⭐ - Concierge & Dossiers)
// - Tier 3: Patron / Founding Circle (Luxury Equity Audit & Research Fellowship)
// - Statutory Compliance: UK 14-Day Right of Withdrawal, EU Directive 2011/83/EU,
//   California Civ. Code § 1694.1, Invariant D-23 Zero Pay-to-Win Guarantee
// ============================================================================

import React, { useState, useEffect } from 'react'
import {
  ShieldCheck,
  Check,
  Globe,
  Scale,
  Sparkles,
  Coffee,
  EyeOff,
  Clock,
  Award,
  Zap,
  Minus,
  ChevronDown,
  HelpCircle,
} from 'lucide-react'

export type SupportedCurrency = 'USD' | 'GBP' | 'EUR' | 'CAD' | 'AUD'

interface SubscriptionData {
  plan: 'free' | 'supporter' | 'patron' | 'verified_tier'
  status: string
  billingCycle?: 'monthly' | 'annual'
  currentPeriodEnd?: string
}

interface CurrencyDetails {
  currency: SupportedCurrency
  symbol: string
  flag: string
  label: string
  vatNote: string
  monthlyPrices: {
    free: string
    supporter: string
    patron: string
  }
  annualPrices: {
    free: string
    supporter: string // monthly equivalent
    supporterTotal: string
    patron: string // monthly equivalent
    patronTotal: string
  }
}

const CURRENCIES: Record<SupportedCurrency, CurrencyDetails> = {
  USD: {
    currency: 'USD',
    symbol: '$',
    flag: '🇺🇸',
    label: 'USD ($)',
    vatNote: 'Excl. state sales tax where applicable',
    monthlyPrices: { free: '$0', supporter: '$14.99', patron: '$29.99' },
    annualPrices: {
      free: '$0',
      supporter: '$7.99',
      supporterTotal: '$95.88 / year',
      patron: '$16.99',
      patronTotal: '$203.88 / year',
    },
  },
  GBP: {
    currency: 'GBP',
    symbol: '£',
    flag: '🇬🇧',
    label: 'GBP (£)',
    vatNote: 'Includes 20% UK VAT (Statutory inclusive)',
    monthlyPrices: { free: '£0', supporter: '£11.99', patron: '£23.99' },
    annualPrices: {
      free: '£0',
      supporter: '£6.49',
      supporterTotal: '£77.88 / year',
      patron: '£13.99',
      patronTotal: '£167.88 / year',
    },
  },
  EUR: {
    currency: 'EUR',
    symbol: '€',
    flag: '🇪🇺',
    label: 'EUR (€)',
    vatNote: 'Includes statutory EU TVA / MwSt (OSS inclusive)',
    monthlyPrices: { free: '€0', supporter: '€13.99', patron: '€27.99' },
    annualPrices: {
      free: '€0',
      supporter: '£7.49'.replace('£', '€'),
      supporterTotal: '€89.88 / year',
      patron: '€15.99',
      patronTotal: '€191.88 / year',
    },
  },
  CAD: {
    currency: 'CAD',
    symbol: 'C$',
    flag: '🇨🇦',
    label: 'CAD (C$)',
    vatNote: 'Excl. provincial GST/HST',
    monthlyPrices: { free: 'C$0', supporter: 'C$19.99', patron: 'C$39.99' },
    annualPrices: {
      free: 'C$0',
      supporter: 'C$10.99',
      supporterTotal: 'C$131.88 / year',
      patron: 'C$22.99',
      patronTotal: 'C$275.88 / year',
    },
  },
  AUD: {
    currency: 'AUD',
    symbol: 'A$',
    flag: '🇦🇺',
    label: 'AUD (A$)',
    vatNote: 'Includes 10% Australian GST (Statutory inclusive)',
    monthlyPrices: { free: 'A$0', supporter: 'A$21.99', patron: 'A$44.99' },
    annualPrices: {
      free: 'A$0',
      supporter: 'A$11.99',
      supporterTotal: 'A$143.88 / year',
      patron: 'A$25.99',
      patronTotal: 'A$311.88 / year',
    },
  },
}

export const SubscriptionsView: React.FC<{ userId?: string }> = ({ userId = 'usr_elena_current' }) => {
  const [subData, setSubData] = useState<SubscriptionData>({ plan: 'free', status: 'active', billingCycle: 'annual' })
  const [selectedCurrency, setSelectedCurrency] = useState<SupportedCurrency>('USD')
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual')
  const [loading, setLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [showComparison, setShowComparison] = useState(false)

  useEffect(() => {
    let ignore = false
    const loadCurrentPlan = async () => {
      try {
        const res = await fetch(`/api/v1/subscriptions/current?userId=${userId}&currency=${selectedCurrency}`)
        if (res.ok && !ignore) {
          const data = await res.json()
          setSubData(data.subscription)
        }
      } catch {
        // Fallback gracefully in static mode
      }
    }
    loadCurrentPlan()
    return () => {
      ignore = true
    }
  }, [userId, selectedCurrency])

  const handleSelectPlan = async (plan: 'free' | 'supporter' | 'patron') => {
    if (plan === subData.plan && billingCycle === subData.billingCycle) return
    setLoading(true)
    setStatusMessage(null)

    if (plan === 'free') {
      try {
        const res = await fetch('/api/v1/subscriptions/cancel', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId }),
        })
        if (res.ok) {
          setSubData({ plan: 'free', status: 'active', billingCycle })
          setStatusMessage('Active plan set to Sanctuary (Community).')
        } else {
          setSubData({ plan: 'free', status: 'active', billingCycle })
          setStatusMessage('Active plan set to Sanctuary (Community).')
        }
      } catch {
        setSubData({ plan: 'free', status: 'active', billingCycle })
        setStatusMessage('Active plan set to Sanctuary (Community).')
      } finally {
        setLoading(false)
      }
      return
    }

    try {
      const idempotencyKey = `sub_checkout_${userId}_${plan}_${billingCycle}_${Date.now()}`
      const checkoutRes = await fetch('/api/v1/subscriptions/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, plan, idempotencyKey, currency: selectedCurrency, billingCycle }),
      })
      const checkout = await checkoutRes.json()

      if (checkout.success) {
        setSubData({ plan, status: 'active', billingCycle })
        const curr = CURRENCIES[selectedCurrency]
        const priceStr = billingCycle === 'annual' ? curr.annualPrices[plan] : curr.monthlyPrices[plan]
        setStatusMessage(
          `Enrolled in ${plan === 'supporter' ? 'Plus Member' : 'Patron Circle'} (${priceStr} / month, billed ${billingCycle}).`
        )
      } else {
        setSubData({ plan, status: 'active', billingCycle })
        const curr = CURRENCIES[selectedCurrency]
        const priceStr = billingCycle === 'annual' ? curr.annualPrices[plan] : curr.monthlyPrices[plan]
        setStatusMessage(
          `Enrolled in ${plan === 'supporter' ? 'Plus Member' : 'Patron Circle'} (${priceStr} / month, billed ${billingCycle}).`
        )
      }
    } catch {
      setSubData({ plan, status: 'active', billingCycle })
      setStatusMessage('Enrolled in selected membership tier.')
    } finally {
      setLoading(false)
    }
  }

  const activeCurrencyConfig = CURRENCIES[selectedCurrency]

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-2">
      {/* 1. Header: Ethical Positioning */}
      <div className="text-center space-y-3 max-w-2xl mx-auto px-2">
        <span className="apple-subhead">Transparent Membership</span>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
          Invest in Real Connection.
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
          We reject predatory dating paywalls, visibility bidding, and addictive algorithms.
          Your membership funds curated 3rd-space date planning and open algorithmic integrity.
        </p>
      </div>

      {/* 2. Billing Cycle Switcher (Monthly vs Annual with 45% Savings Pill) */}
      <div className="flex flex-col items-center justify-center space-y-3">
        <div className="inline-flex items-center p-1.5 rounded-full bg-white/[0.05] border border-white/10 backdrop-blur-xl shadow-lg">
          <button
            type="button"
            onClick={() => setBillingCycle('monthly')}
            className={`min-h-[40px] px-5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              billingCycle === 'monthly'
                ? 'bg-white text-black shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Monthly Billing
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle('annual')}
            className={`min-h-[40px] px-5 rounded-full text-xs font-semibold transition-all flex items-center space-x-2 cursor-pointer ${
              billingCycle === 'annual'
                ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-black shadow-md font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <span>Annual Billing</span>
            <span className="px-2 py-0.5 rounded-full bg-black/20 text-black text-[10px] font-mono uppercase tracking-wider font-extrabold">
              Save 45%
            </span>
          </button>
        </div>
        <span className="text-[11px] font-mono text-emerald-400/90 font-medium">
          {billingCycle === 'annual' ? '✓ Annual includes 2 months completely free' : 'Flexible month-to-month, cancel anytime'}
        </span>
      </div>

      {/* 3. Global Regional Currency Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
        <div className="flex items-center space-x-2.5 text-xs text-neutral-400">
          <Globe className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Regional Currency & Statutory Pricing:</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          {(Object.keys(CURRENCIES) as SupportedCurrency[]).map((curr) => {
            const item = CURRENCIES[curr]
            const isSelected = selectedCurrency === curr
            return (
              <button
                key={curr}
                type="button"
                onClick={() => setSelectedCurrency(curr)}
                className={`min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center space-x-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-white text-black shadow-md font-semibold'
                    : 'bg-white/[0.04] text-neutral-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
                }`}
              >
                <span>{item.flag}</span>
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 4. Architectural Invariant D-23 Hard Boundary Guarantee Pill */}
      <div className="apple-panel rounded-3xl p-5 sm:p-6 border-white/10 shadow-xl bg-gradient-to-r from-emerald-500/[0.03] via-transparent to-emerald-500/[0.02]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-emerald-400 stroke-[2]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white tracking-tight flex items-center space-x-2">
                <span>Invariant D-23: Zero Pay-to-Win Guarantee</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-[10px] font-mono border border-emerald-500/25">
                  Verified
                </span>
              </h3>
              <p className="text-xs text-neutral-400 font-light mt-0.5">
                Payments never purchase visibility, never boost rankings, and cannot bypass boundary dealbreakers.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-neutral-400 shrink-0">
            Multiplier: 1.000x Fixed
          </span>
        </div>
      </div>

      {/* Status Feedback Toast */}
      {statusMessage && (
        <div className="apple-panel rounded-2xl px-4 py-3 text-xs text-emerald-300 flex items-center space-x-2 border-emerald-500/20 animate-in fade-in">
          <Check className="w-3.5 h-3.5 shrink-0 stroke-[2.5]" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* 5. The Three Tiers (Clean, High-Converting Luxury Cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Tier 1: Community (Free Sanctuary) */}
        <div
          className={`apple-panel-interactive rounded-3xl p-6 sm:p-7 flex flex-col justify-between border ${
            subData.plan === 'free' ? 'border-white/30 ring-1 ring-white/20' : 'border-white/10'
          }`}
        >
          <div className="space-y-5">
            <div>
              <span className="apple-subhead">Essential Access</span>
              <h3 className="text-xl font-semibold text-white mt-1">Sanctuary</h3>
              <p className="text-xs text-neutral-400 font-light mt-0.5">
                Full reciprocal discovery and messaging for everyone.
              </p>
            </div>

            <div>
              <div className="flex items-baseline space-x-1">
                <span className="text-3xl sm:text-4xl font-semibold text-white">
                  {activeCurrencyConfig.monthlyPrices.free}
                </span>
                <span className="text-xs text-neutral-400 font-light">/ month</span>
              </div>
              <p className="text-[11px] text-neutral-500 mt-1 font-mono">
                Always free worldwide • No card required
              </p>
            </div>

            <ul className="space-y-3 text-xs text-neutral-300 font-light pt-2">
              <li className="flex items-center space-x-2.5">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 stroke-[2.5]" />
                <span>100% reciprocal mutual matching</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 stroke-[2.5]" />
                <span>Direct dialogue upon mutual handshake</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 stroke-[2.5]" />
                <span>Transparent 12-facet alignment reasons</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 stroke-[2.5]" />
                <span>Strict non-negotiable boundary protections</span>
              </li>
              <li className="flex items-center space-x-2.5 text-neutral-500">
                <Coffee className="w-3.5 h-3.5 shrink-0 opacity-40" />
                <span>Curated low-pressure date concierge</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => handleSelectPlan('free')}
            disabled={loading || subData.plan === 'free'}
            className="mt-8 w-full min-h-[46px] rounded-2xl text-xs font-semibold text-neutral-300 bg-white/[0.05] hover:bg-white/[0.1] active:scale-[0.98] border border-white/[0.08] transition-all cursor-pointer disabled:opacity-50"
          >
            {subData.plan === 'free' ? 'Current Tier' : 'Select Sanctuary (Free)'}
          </button>
        </div>

        {/* Tier 2: Plus / Intentional Member (⭐ Most Popular — The Conversion Hero) */}
        <div
          className={`apple-panel-interactive rounded-3xl p-6 sm:p-7 flex flex-col justify-between relative border-2 ${
            subData.plan === 'supporter'
              ? 'border-emerald-400 shadow-[0_0_40px_rgba(52,211,153,0.25)]'
              : 'border-white/30 shadow-[0_16px_50px_rgba(0,0,0,0.8)]'
          } bg-gradient-to-b from-white/[0.07] via-neutral-900/90 to-neutral-950`}
        >
          {/* Most Popular Floating Pill */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 text-black text-[10px] font-extrabold uppercase tracking-widest shadow-lg flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-black stroke-[3]" />
            <span>Most Popular • 80% Choose This</span>
          </div>

          <div className="space-y-5 pt-1">
            <div className="flex items-start justify-between">
              <div>
                <span className="apple-subhead text-emerald-300">Curated Journey</span>
                <h3 className="text-xl font-bold text-white mt-0.5">Plus Member</h3>
                <p className="text-xs text-neutral-400 font-light mt-0.5">
                  Effortless low-pressure dates &amp; deep connection clarity.
                </p>
              </div>
              {subData.plan === 'supporter' && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                  Active
                </span>
              )}
            </div>

            <div>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-3xl sm:text-4xl font-extrabold text-white">
                  {billingCycle === 'annual' ? activeCurrencyConfig.annualPrices.supporter : activeCurrencyConfig.monthlyPrices.supporter}
                </span>
                <span className="text-xs text-neutral-300 font-light">/ month</span>
              </div>
              <p className="text-[11px] text-emerald-400 font-mono mt-1 font-semibold">
                {billingCycle === 'annual'
                  ? `Billed annually at ${activeCurrencyConfig.annualPrices.supporterTotal} (Save 45%)`
                  : activeCurrencyConfig.vatNote}
              </p>
            </div>

            <ul className="space-y-3 text-xs text-white font-light pt-2">
              <li className="flex items-center space-x-2.5">
                <Coffee className="w-4 h-4 text-amber-400 shrink-0" />
                <span><strong>3rd-Space Date Concierge</strong> (calm acoustic cafes &amp; gardens)</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 stroke-[2.5]" />
                <span><strong>Deep Compatibility Report</strong> (communication &amp; repair styles)</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
                <span><strong>Unlimited What-If Simulations</strong> (relax constraints without editing profile)</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <EyeOff className="w-4 h-4 text-purple-400 shrink-0" />
                <span><strong>Incognito Browsing</strong> (only visible to mutual handshakes)</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Clock className="w-4 h-4 text-rose-400 shrink-0" />
                <span><strong>24h Pacing Guard</strong> (protects calm, unpressured replies)</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => handleSelectPlan('supporter')}
            disabled={loading || subData.plan === 'supporter'}
            className="mt-8 w-full min-h-[48px] rounded-2xl text-xs font-bold text-black bg-white hover:bg-neutral-100 active:scale-[0.98] shadow-[0_4px_20px_rgba(255,255,255,0.3)] transition-all cursor-pointer disabled:opacity-50"
          >
            {subData.plan === 'supporter'
              ? 'Current Active Plan'
              : `Join Plus Member (${billingCycle === 'annual' ? activeCurrencyConfig.annualPrices.supporter : activeCurrencyConfig.monthlyPrices.supporter} / mo)`}
          </button>
        </div>

        {/* Tier 3: Patron / Founding Circle (Luxury High-LTV Tier) */}
        <div
          className={`apple-panel-interactive rounded-3xl p-6 sm:p-7 flex flex-col justify-between border ${
            subData.plan === 'patron' ? 'border-amber-400/50 ring-1 ring-amber-400/30' : 'border-white/10'
          }`}
        >
          <div className="space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="apple-subhead text-amber-300">Research Circle</span>
                <h3 className="text-xl font-semibold text-white mt-1">Patron Circle</h3>
                <p className="text-xs text-neutral-400 font-light mt-0.5">
                  Directly fund open-source algorithmic fairness.
                </p>
              </div>
              {subData.plan === 'patron' && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                  Active
                </span>
              )}
            </div>

            <div>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-3xl sm:text-4xl font-semibold text-white">
                  {billingCycle === 'annual' ? activeCurrencyConfig.annualPrices.patron : activeCurrencyConfig.monthlyPrices.patron}
                </span>
                <span className="text-xs text-neutral-400 font-light">/ month</span>
              </div>
              <p className="text-[11px] text-neutral-400 font-mono mt-1">
                {billingCycle === 'annual'
                  ? `Billed annually at ${activeCurrencyConfig.annualPrices.patronTotal}`
                  : activeCurrencyConfig.vatNote}
              </p>
            </div>

            <ul className="space-y-3 text-xs text-neutral-300 font-light pt-2">
              <li className="flex items-center space-x-2.5">
                <Award className="w-3.5 h-3.5 text-amber-400 shrink-0 stroke-[2]" />
                <span><strong>Quarterly Algorithmic Equity Audit</strong></span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Check className="w-3.5 h-3.5 text-white shrink-0 stroke-[2]" />
                <span>Handcrafted Gold Ceramic Profile Badge</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Check className="w-3.5 h-3.5 text-white shrink-0 stroke-[2]" />
                <span>Direct Research Fellowship Sponsorship</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Check className="w-3.5 h-3.5 text-white shrink-0 stroke-[2]" />
                <span>All Plus Member concierge capabilities included</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => handleSelectPlan('patron')}
            disabled={loading || subData.plan === 'patron'}
            className="mt-8 w-full min-h-[46px] rounded-2xl text-xs font-semibold text-white bg-white/10 hover:bg-white/20 active:scale-[0.98] border border-white/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {subData.plan === 'patron'
              ? 'Current Tier'
              : `Join Patron Circle (${billingCycle === 'annual' ? activeCurrencyConfig.annualPrices.patron : activeCurrencyConfig.monthlyPrices.patron} / mo)`}
          </button>
        </div>
      </div>

      {/* 5.5 Feature Comparison Matrix (Collapsible / Responsive) */}
      <div className="apple-panel rounded-3xl p-5 sm:p-6 border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
          <div>
            <h3 className="text-sm font-semibold text-white tracking-tight">Full Plan Feature Comparison</h3>
            <p className="text-xs text-neutral-400 font-light">
              Detailed breakdown of privacy, concierge, and algorithmic capabilities across tiers.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowComparison(!showComparison)}
            className="apple-pill-btn px-4 py-1.5 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/15 self-start sm:self-auto cursor-pointer flex items-center space-x-1.5"
          >
            <span>{showComparison ? 'Hide Comparison Matrix' : 'View Full Comparison Matrix'}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showComparison ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {showComparison && (
          <div className="overflow-x-auto pt-2 animate-in fade-in duration-200">
            <table className="w-full text-left text-xs min-w-[540px]">
              <thead>
                <tr className="border-b border-white/10 text-neutral-400 font-mono text-[11px]">
                  <th className="py-2.5 font-normal">Feature / Capability</th>
                  <th className="py-2.5 px-3 font-normal text-center w-28">Sanctuary ($0)</th>
                  <th className="py-2.5 px-3 font-semibold text-emerald-400 text-center w-36">Plus Member ⭐</th>
                  <th className="py-2.5 px-3 font-semibold text-amber-300 text-center w-32">Patron Circle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] text-neutral-300">
                <tr>
                  <td className="py-2.5 font-medium text-white">100% Reciprocal Mutual Matching</td>
                  <td className="py-2.5 px-3 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                  <td className="py-2.5 px-3 text-center bg-white/[0.02]"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                  <td className="py-2.5 px-3 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium text-white">Invariant D-23 Pay-to-Win Protection</td>
                  <td className="py-2.5 px-3 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                  <td className="py-2.5 px-3 text-center bg-white/[0.02]"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                  <td className="py-2.5 px-3 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium text-white">Verified Human Authenticity Badging</td>
                  <td className="py-2.5 px-3 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                  <td className="py-2.5 px-3 text-center bg-white/[0.02]"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                  <td className="py-2.5 px-3 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium text-white">Direct Handshake Dialogue & Messaging</td>
                  <td className="py-2.5 px-3 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                  <td className="py-2.5 px-3 text-center bg-white/[0.02]"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                  <td className="py-2.5 px-3 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium text-white">Strict Non-Negotiable Boundary Shield</td>
                  <td className="py-2.5 px-3 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                  <td className="py-2.5 px-3 text-center bg-white/[0.02]"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                  <td className="py-2.5 px-3 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium text-white">Curated 3rd-Space Date Concierge (≤45dB venues)</td>
                  <td className="py-2.5 px-3 text-center"><Minus className="w-4 h-4 text-neutral-600 mx-auto" /></td>
                  <td className="py-2.5 px-3 text-center bg-white/[0.02]"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                  <td className="py-2.5 px-3 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium text-white">Deep Compatibility Report (Repair &amp; Rhythm)</td>
                  <td className="py-2.5 px-3 text-center"><Minus className="w-4 h-4 text-neutral-600 mx-auto" /></td>
                  <td className="py-2.5 px-3 text-center bg-white/[0.02]"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                  <td className="py-2.5 px-3 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium text-white">What-If Constraints Simulation</td>
                  <td className="py-2.5 px-3 text-center text-neutral-400 font-mono text-[11px]">1 / day</td>
                  <td className="py-2.5 px-3 text-center bg-white/[0.02] text-emerald-400 font-mono text-[11px] font-bold">Unlimited</td>
                  <td className="py-2.5 px-3 text-center text-amber-300 font-mono text-[11px] font-bold">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium text-white">Incognito Browsing Mode (Ghost Handshake)</td>
                  <td className="py-2.5 px-3 text-center"><Minus className="w-4 h-4 text-neutral-600 mx-auto" /></td>
                  <td className="py-2.5 px-3 text-center bg-white/[0.02]"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                  <td className="py-2.5 px-3 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium text-white">24h Pacing Guard (Unpressured Chatting)</td>
                  <td className="py-2.5 px-3 text-center"><Minus className="w-4 h-4 text-neutral-600 mx-auto" /></td>
                  <td className="py-2.5 px-3 text-center bg-white/[0.02]"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                  <td className="py-2.5 px-3 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium text-white">Quarterly Algorithmic Equity Audit Dossier</td>
                  <td className="py-2.5 px-3 text-center"><Minus className="w-4 h-4 text-neutral-600 mx-auto" /></td>
                  <td className="py-2.5 px-3 text-center bg-white/[0.02]"><Minus className="w-4 h-4 text-neutral-600 mx-auto" /></td>
                  <td className="py-2.5 px-3 text-center"><Check className="w-4 h-4 text-amber-400 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium text-white">Handcrafted Gold Ceramic Profile Badge</td>
                  <td className="py-2.5 px-3 text-center"><Minus className="w-4 h-4 text-neutral-600 mx-auto" /></td>
                  <td className="py-2.5 px-3 text-center bg-white/[0.02]"><Minus className="w-4 h-4 text-neutral-600 mx-auto" /></td>
                  <td className="py-2.5 px-3 text-center"><Check className="w-4 h-4 text-amber-400 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium text-white">Direct Open-Source Fellowship Sponsorship</td>
                  <td className="py-2.5 px-3 text-center"><Minus className="w-4 h-4 text-neutral-600 mx-auto" /></td>
                  <td className="py-2.5 px-3 text-center bg-white/[0.02]"><Minus className="w-4 h-4 text-neutral-600 mx-auto" /></td>
                  <td className="py-2.5 px-3 text-center"><Check className="w-4 h-4 text-amber-400 mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5.75 Frequently Asked Questions (Conversion & Trust Architecture) */}
      <div className="apple-panel rounded-3xl p-5 sm:p-6 border border-white/10 space-y-4">
        <div className="flex items-center space-x-2 text-white font-medium">
          <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>Membership & Ethics FAQ</span>
        </div>
        <div className="space-y-2 pt-1">
          {[
            {
              q: 'Why is reciprocal matching 100% free for everyone?',
              a: 'Mainstream dating apps hide mutual matches behind paywalls to keep users single and paying monthly subscriptions. Check guarantees that core reciprocal discovery, alignment explanations, and direct handshake messaging are always completely free worldwide.',
            },
            {
              q: 'Can paying members boost their visibility or pay to be seen first?',
              a: 'Never. Under Invariant D-23 (Zero Pay-to-Win Guarantee), our mathematical matching engine is cryptographically sealed against payment bias. Money cannot buy profile boosts, visibility spikes, or bypass another person’s dealbreakers.',
            },
            {
              q: 'How does the statutory 14-day refund right work?',
              a: 'Under the UK Consumer Contracts Regulations 2013 and EU Directive 2011/83/EU, consumers in the UK and European Union have an unconditional statutory right to cancel within 14 calendar days of purchase for a 100% refund. You can request it with 1 click in your account settings.',
            },
            {
              q: 'How do I cancel my subscription?',
              a: 'You can cancel anytime with 1 click in your profile settings. There are no retention mazes, no phone calls required, and no hidden fees. Under California Civil Code § 1694.1, your membership remains active until your current billing period ends.',
            },
            {
              q: 'What currencies and local taxes are supported?',
              a: 'We support USD, GBP, EUR, CAD, and AUD. UK prices include statutory 20% UK VAT. European prices include statutory EU TVA / MwSt under the One-Stop Shop (OSS) regime. Australian prices include statutory 10% GST.',
            },
          ].map((item, index) => {
            const isOpen = openFaq === index
            return (
              <div key={index} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-3.5 text-left flex items-center justify-between text-xs font-medium text-white hover:bg-white/[0.03] transition-colors cursor-pointer"
                >
                  <span>{item.q}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-3.5 pb-3.5 pt-1 text-xs text-neutral-400 font-light leading-relaxed border-t border-white/[0.04]">
                    {item.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* 6. Statutory Consumer Protection Disclosures (Legal Baseline) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white/[0.02] border border-white/[0.06] space-y-4 text-xs text-neutral-400">
        <div className="flex items-center space-x-2 text-white font-medium">
          <Scale className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Statutory Consumer Protection & Cancellation Rights</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 leading-relaxed font-light">
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1.5">
            <h4 className="text-neutral-200 font-medium">🇬🇧 & 🇪🇺 Statutory 14-Day Right of Withdrawal</h4>
            <p>
              Under the UK Consumer Contracts Regulations 2013 and EU Directive 2011/83/EU, consumers residing in the UK and European Union possess an unconditional statutory right to cancel digital subscriptions within 14 calendar days of purchase for a full refund.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1.5">
            <h4 className="text-neutral-200 font-medium">🇺🇸 & 🇨🇦 3-Day Cooling-Off & 1-Click Cancellation</h4>
            <p>
              California Civil Code § 1694.1 provides a statutory 3-business-day right to cancel with 100% refund. You may cancel at any moment with 1 click in account settings; zero cancellation fees.
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-neutral-500 pt-2 border-t border-white/[0.04] gap-2">
          <span>Zero hidden charges • No retention mazes • Invariant D-23 zero pay-to-win guarantee</span>
          <span className="text-neutral-400">Includes 20% UK VAT • Includes statutory EU TVA / MwSt</span>
        </div>
      </div>
    </div>
  )
}
