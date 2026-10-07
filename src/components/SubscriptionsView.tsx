// ============================================================================
// src/components/SubscriptionsView.tsx
// Universal Compatibility Platform: Apple-Grade Minimalist Ethical Tiers
// Multi-Currency: USD ($), GBP (£), EUR (€), CAD (C$), AUD (A$)
// Statutory Compliance: UK 14-Day Right of Withdrawal, EU Directive 2011/83/EU,
// California Civ. Code § 1694.1, Australian Consumer Law (ACL)
// ============================================================================

import React, { useState, useEffect } from 'react'
import { ShieldCheck, Check, Lock, Globe, Scale } from 'lucide-react'

export type SupportedCurrency = 'USD' | 'GBP' | 'EUR' | 'CAD' | 'AUD'

interface SubscriptionData {
  plan: 'free' | 'supporter' | 'patron' | 'verified_tier'
  status: string
  currentPeriodEnd?: string
}

interface CurrencyDetails {
  currency: SupportedCurrency
  symbol: string
  flag: string
  label: string
  vatNote: string
  prices: {
    free: string
    supporter: string
    patron: string
  }
}

const CURRENCIES: Record<SupportedCurrency, CurrencyDetails> = {
  USD: {
    currency: 'USD',
    symbol: '$',
    flag: '🇺🇸',
    label: 'USD ($)',
    vatNote: 'Excl. state sales tax where applicable',
    prices: { free: '$0', supporter: '$9.99', patron: '$24.99' },
  },
  GBP: {
    currency: 'GBP',
    symbol: '£',
    flag: '🇬🇧',
    label: 'GBP (£)',
    vatNote: 'Includes 20% UK VAT (Statutory inclusive)',
    prices: { free: '£0', supporter: '£7.99', patron: '£19.99' },
  },
  EUR: {
    currency: 'EUR',
    symbol: '€',
    flag: '🇪🇺',
    label: 'EUR (€)',
    vatNote: 'Includes statutory EU TVA / MwSt (OSS inclusive)',
    prices: { free: '€0', supporter: '€8.99', patron: '€22.99' },
  },
  CAD: {
    currency: 'CAD',
    symbol: 'C$',
    flag: '🇨🇦',
    label: 'CAD (C$)',
    vatNote: 'Excl. provincial GST/HST',
    prices: { free: 'C$0', supporter: 'C$13.99', patron: 'C$34.99' },
  },
  AUD: {
    currency: 'AUD',
    symbol: 'A$',
    flag: '🇦🇺',
    label: 'AUD (A$)',
    vatNote: 'Includes 10% Australian GST (Statutory inclusive)',
    prices: { free: 'A$0', supporter: 'A$14.99', patron: 'A$37.99' },
  },
}

export const SubscriptionsView: React.FC<{ userId: string }> = ({ userId }) => {
  const [subData, setSubData] = useState<SubscriptionData>({ plan: 'free', status: 'active' })
  const [selectedCurrency, setSelectedCurrency] = useState<SupportedCurrency>('USD')
  const [loading, setLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  useEffect(() => {
    let ignore = false
    const loadCurrentPlan = async () => {
      try {
        const res = await fetch(`/api/v1/subscriptions/current?userId=${userId}&currency=${selectedCurrency}`)
        if (res.ok && !ignore) {
          const data = await res.json()
          setSubData(data.subscription)
        }
      } catch (e) {
        console.error('Failed to load subscription status', e)
      }
    }
    loadCurrentPlan()
    return () => {
      ignore = true
    }
  }, [userId, selectedCurrency])

  const handleSelectPlan = async (plan: 'free' | 'supporter' | 'patron') => {
    if (plan === subData.plan) return
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
          setSubData({ plan: 'free', status: 'active' })
          setStatusMessage('Active plan set to Community.')
        }
      } catch {
        setStatusMessage('Error updating plan.')
      } finally {
        setLoading(false)
      }
      return
    }

    try {
      const idempotencyKey = `sub_checkout_${userId}_${plan}_${Date.now()}`
      const checkoutRes = await fetch('/api/v1/subscriptions/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, plan, idempotencyKey, currency: selectedCurrency }),
      })
      const checkout = await checkoutRes.json()

      if (checkout.success) {
        setSubData({ plan, status: 'active' })
        const curr = CURRENCIES[selectedCurrency]
        const priceStr = curr.prices[plan]
        setStatusMessage(`Enrolled in ${plan === 'supporter' ? 'Supporter' : 'Patron'} tier (${priceStr} / month).`)
      }
    } catch {
      setStatusMessage('Payment checkout simulation failed.')
    } finally {
      setLoading(false)
    }
  }

  const activeCurrencyConfig = CURRENCIES[selectedCurrency]

  return (
    <div className="space-y-10 max-w-5xl mx-auto py-2">
      {/* Apple Manifesto Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="apple-subhead">Monetization Ethics</span>
        <h1 className="text-4xl font-semibold tracking-tight text-white">
          Designed for Integrity.
        </h1>
        <p className="text-sm text-neutral-400 font-light leading-relaxed">
          We reject pay-to-win mechanics, SuperLikes, and algorithmic visibility boosts. 
          Your membership funds pure mathematical research—never artificial popularity.
        </p>
      </div>

      {/* Global Currency Switcher Selector */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
        <div className="flex items-center space-x-2.5 text-xs text-neutral-400">
          <Globe className="w-4 h-4 text-amber-400" />
          <span>Regional Currency & Statutory Disclosures:</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {(Object.keys(CURRENCIES) as SupportedCurrency[]).map((curr) => {
            const item = CURRENCIES[curr]
            const isSelected = selectedCurrency === curr
            return (
              <button
                key={curr}
                onClick={() => setSelectedCurrency(curr)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center space-x-1.5 ${
                  isSelected
                    ? 'bg-white text-black shadow-md shadow-white/10 font-semibold'
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

      {/* Invariant D-23 Hard Boundary Pill */}
      <div className="apple-panel rounded-3xl p-6 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.06]">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-400 stroke-[2]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white tracking-tight">
                Architectural Invariant D-23
              </h3>
              <p className="text-xs text-neutral-400 font-light">
                Strict separation of billing and matching pipelines (Spec §33).
              </p>
            </div>
          </div>
          <span className="self-start sm:self-auto px-3 py-1 rounded-full text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
            Zero Score Leakage Verified
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5">
          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
            <span className="text-[10px] text-neutral-500 uppercase tracking-wider block font-mono">
              Score Multiplier
            </span>
            <span className="text-sm font-semibold text-white tracking-tight mt-0.5 block">
              1.000x (Fixed Constant)
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
            <span className="text-[10px] text-neutral-500 uppercase tracking-wider block font-mono">
              Visibility Boost
            </span>
            <span className="text-sm font-semibold text-white tracking-tight mt-0.5 block">
              0% (Strictly Forbidden)
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
            <span className="text-[10px] text-neutral-500 uppercase tracking-wider block font-mono">
              Dealbreaker Bypass
            </span>
            <span className="text-sm font-semibold text-white tracking-tight mt-0.5 block">
              Disabled at Database Layer
            </span>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div className="apple-panel rounded-2xl px-4 py-3 text-xs text-emerald-300 flex items-center space-x-2 border-emerald-500/20">
          <Check className="w-3.5 h-3.5 shrink-0 stroke-[2]" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Apple-Style Tier Cards with Localized Pricing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Free Community Tier */}
        <div
          className={`apple-panel-interactive rounded-3xl p-7 flex flex-col justify-between ${
            subData.plan === 'free' ? 'border-white/30 ring-1 ring-white/20' : ''
          }`}
        >
          <div className="space-y-5">
            <div>
              <span className="apple-subhead">Standard Access</span>
              <h3 className="text-xl font-semibold text-white mt-1">Community</h3>
              <p className="text-xs text-neutral-400 font-light mt-0.5">
                Full reciprocal discovery for all.
              </p>
            </div>
            <div>
              <div className="flex items-baseline space-x-1">
                <span className="text-3xl font-semibold text-white">
                  {activeCurrencyConfig.prices.free}
                </span>
                <span className="text-xs text-neutral-400 font-light">/ month</span>
              </div>
              <p className="text-[10px] text-neutral-500 mt-1">
                Always free worldwide • No payment card needed
              </p>
            </div>
            <ul className="space-y-3 text-xs text-neutral-300 font-light pt-2">
              <li className="flex items-center space-x-2.5">
                <Check className="w-3.5 h-3.5 text-white/80 shrink-0 stroke-[2]" />
                <span>Full bidirectional matching</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Check className="w-3.5 h-3.5 text-white/80 shrink-0 stroke-[2]" />
                <span>Complete transparent score breakdowns</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Check className="w-3.5 h-3.5 text-white/80 shrink-0 stroke-[2]" />
                <span>5 What-If constraint simulations / day</span>
              </li>
              <li className="flex items-center space-x-2.5 text-neutral-500">
                <Lock className="w-3.5 h-3.5 shrink-0 stroke-[2]" />
                <span>Compatibility dossier export</span>
              </li>
            </ul>
          </div>
          <button
            onClick={() => handleSelectPlan('free')}
            disabled={loading || subData.plan === 'free'}
            className="apple-pill-btn mt-8 w-full py-2.5 text-xs font-medium text-neutral-300 bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] disabled:opacity-50"
          >
            {subData.plan === 'free' ? 'Current Tier' : 'Select Community'}
          </button>
        </div>

        {/* Supporter Tier */}
        <div
          className={`apple-panel-interactive rounded-3xl p-7 flex flex-col justify-between relative ${
            subData.plan === 'supporter' ? 'border-white/30 ring-1 ring-white/20' : ''
          }`}
        >
          <div className="space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="apple-subhead">Power Tools</span>
                <h3 className="text-xl font-semibold text-white mt-1">Supporter</h3>
                <p className="text-xs text-neutral-400 font-light mt-0.5">
                  Analytical tools for deeper introspection.
                </p>
              </div>
              {subData.plan === 'supporter' && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-white/10 text-white border border-white/20">
                  Active
                </span>
              )}
            </div>
            <div>
              <div className="flex items-baseline space-x-1">
                <span className="text-3xl font-semibold text-white">
                  {activeCurrencyConfig.prices.supporter}
                </span>
                <span className="text-xs text-neutral-400 font-light">/ month</span>
              </div>
              <p className="text-[10px] text-neutral-400 mt-1">
                {activeCurrencyConfig.vatNote}
              </p>
            </div>
            <ul className="space-y-3 text-xs text-neutral-300 font-light pt-2">
              <li className="flex items-center space-x-2.5">
                <Check className="w-3.5 h-3.5 text-white shrink-0 stroke-[2]" />
                <span><strong>50 What-If</strong> relaxation runs / day</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Check className="w-3.5 h-3.5 text-white shrink-0 stroke-[2]" />
                <span>Complete dossier PDF / JSON export</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Check className="w-3.5 h-3.5 text-white shrink-0 stroke-[2]" />
                <span>Verified supporter badge</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Check className="w-3.5 h-3.5 text-white shrink-0 stroke-[2]" />
                <span>Communication cadence analysis</span>
              </li>
            </ul>
          </div>
          <button
            onClick={() => handleSelectPlan('supporter')}
            disabled={loading || subData.plan === 'supporter'}
            className="apple-pill-btn mt-8 w-full py-2.5 text-xs font-medium text-black bg-white hover:bg-neutral-100 shadow-[0_2px_14px_rgba(255,255,255,0.2)] disabled:opacity-50"
          >
            {subData.plan === 'supporter' ? 'Current Tier' : `Become a Supporter (${activeCurrencyConfig.prices.supporter})`}
          </button>
        </div>

        {/* Ethical Patron Tier */}
        <div
          className={`apple-panel-interactive rounded-3xl p-7 flex flex-col justify-between ${
            subData.plan === 'patron' ? 'border-white/30 ring-1 ring-white/20' : ''
          }`}
        >
          <div className="space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="apple-subhead">Research Sponsor</span>
                <h3 className="text-xl font-semibold text-white mt-1">Patron</h3>
                <p className="text-xs text-neutral-400 font-light mt-0.5">
                  Directly fund open-source matching.
                </p>
              </div>
              {subData.plan === 'patron' && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-white/10 text-white border border-white/20">
                  Active
                </span>
              )}
            </div>
            <div>
              <div className="flex items-baseline space-x-1">
                <span className="text-3xl font-semibold text-white">
                  {activeCurrencyConfig.prices.patron}
                </span>
                <span className="text-xs text-neutral-400 font-light">/ month</span>
              </div>
              <p className="text-[10px] text-neutral-400 mt-1">
                {activeCurrencyConfig.vatNote}
              </p>
            </div>
            <ul className="space-y-3 text-xs text-neutral-300 font-light pt-2">
              <li className="flex items-center space-x-2.5">
                <Check className="w-3.5 h-3.5 text-white shrink-0 stroke-[2]" />
                <span><strong>Unlimited</strong> What-If simulations</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Check className="w-3.5 h-3.5 text-white shrink-0 stroke-[2]" />
                <span>Quarterly algorithmic audit dossier</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Check className="w-3.5 h-3.5 text-white shrink-0 stroke-[2]" />
                <span>Patron identity recognition</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Check className="w-3.5 h-3.5 text-white shrink-0 stroke-[2]" />
                <span>All supporter capabilities included</span>
              </li>
            </ul>
          </div>
          <button
            onClick={() => handleSelectPlan('patron')}
            disabled={loading || subData.plan === 'patron'}
            className="apple-pill-btn mt-8 w-full py-2.5 text-xs font-medium text-white bg-white/15 hover:bg-white/25 border border-white/20 disabled:opacity-50"
          >
            {subData.plan === 'patron' ? 'Current Tier' : `Join as Patron (${activeCurrencyConfig.prices.patron})`}
          </button>
        </div>
      </div>

      {/* Statutory Consumer Rights & Cancellation Disclosures */}
      <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.06] space-y-4 text-xs text-neutral-400">
        <div className="flex items-center space-x-2 text-white font-medium">
          <Scale className="w-4 h-4 text-amber-400" />
          <span>Statutory Consumer Protection & Cancellation Rights</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 leading-relaxed font-light">
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1.5">
            <h4 className="text-neutral-200 font-medium">🇬🇧 & 🇪🇺 Statutory 14-Day Right of Withdrawal</h4>
            <p>
              Under the UK Consumer Contracts Regulations 2013 and EU Directive 2011/83/EU, consumers residing in the UK and European Union possess an unconditional statutory right to cancel digital subscriptions within 14 calendar days of purchase for a full or pro-rata refund.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1.5">
            <h4 className="text-neutral-200 font-medium">🇺🇸 & 🇨🇦 3-Day Cooling-Off & Click-to-Cancel</h4>
            <p>
              California Civil Code § 1694.1 provides a 3-business-day right to cancel dating service contracts with 100% refund. You may cancel at any moment with 1 click in your account settings; recurring billing terminates immediately at period end.
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-neutral-500 pt-2 border-t border-white/[0.04] gap-2">
          <span>Zero cancellation fees • No retention mazes • Invariant D-23 zero pay-to-win guarantee</span>
          <a href="#terms-statutory" className="text-amber-400/80 hover:text-amber-300 underline">
            View Schedule 3 Model Withdrawal Form & Full Terms
          </a>
        </div>
      </div>
    </div>
  )
}
