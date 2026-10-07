// ============================================================================
// src/components/TermsModal.tsx
// Check Platform: Terms of Service, Statutory Disclosures & Legal Modal
// Conforms to: UK Online Safety Act, GDPR Art. 9, NJ/NY/CA Dating Service Laws,
// UK Consumer Contracts Regulations 2013, EU Digital Services Act (DSA),
// EU AI Act Art. 50, Canada PIPEDA & Law 25, Australian Consumer Law (ACL)
// ============================================================================

import React, { useState } from 'react'
import {
  X,
  Shield,
  Lock,
  AlertTriangle,
  Scale,
  CheckCircle2,
  ChevronRight,
  FileText,
  UserCheck,
  HeartHandshake,
  Globe,
  Sparkles,
} from 'lucide-react'

interface TermsModalProps {
  isOpen: boolean
  onClose: () => void
  onAccept?: () => void
}

type ModalTab = 'summary' | 'safety' | 'uk_eu' | 'global' | 'full_text'

export const TermsModal: React.FC<TermsModalProps> = ({
  isOpen,
  onClose,
  onAccept,
}) => {
  const [activeTab, setActiveTab] = useState<ModalTab>('summary')
  const [agreedAge, setAgreedAge] = useState(false)
  const [agreedSafety, setAgreedSafety] = useState(false)
  const [agreedTerms, setAgreedTerms] = useState(false)

  if (!isOpen) return null

  const canAccept = agreedAge && agreedSafety && agreedTerms

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-stone-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold">
              ✓
            </div>
            <div>
              <h2 className="text-lg font-semibold text-stone-100 flex items-center gap-2">
                Terms of Service & Statutory Disclosures
              </h2>
              <p className="text-xs text-stone-400">Check Platform • Version 2.0 (Global Compliance Edition)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-800 bg-stone-900 px-6 gap-2 pt-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('summary')}
            className={`pb-3 px-3 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'summary'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Scale className="w-4 h-4" />
            Plain-English Charter
          </button>
          <button
            onClick={() => setActiveTab('safety')}
            className={`pb-3 px-3 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'safety'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Statutory Safety Notice
          </button>
          <button
            onClick={() => setActiveTab('uk_eu')}
            className={`pb-3 px-3 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'uk_eu'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Globe className="w-4 h-4 text-blue-400" />
            UK & EU Statutory Annex
          </button>
          <button
            onClick={() => setActiveTab('global')}
            className={`pb-3 px-3 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'global'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            Global Protections
          </button>
          <button
            onClick={() => setActiveTab('full_text')}
            className={`pb-3 px-3 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'full_text'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            Full Agreement (16 Sections)
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-stone-300">
          
          {/* TAB 1: PLAIN ENGLISH CHARTER */}
          {activeTab === 'summary' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-stone-200 space-y-2">
                <h3 className="font-semibold text-amber-300 flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4" />
                  The Check Relational Charter
                </h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Check was engineered as the anti-swipe antidote. We reject dark patterns, dopamine loops, and predatory monetization. In return, we expect mutual respect and emotional integrity from every member.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-stone-950/60 border border-stone-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-stone-100 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Zero Pay-to-Win (Invariant D-23)
                  </div>
                  <p className="text-xs text-stone-400">
                    No amount of money can boost your match ranking or alter compatibility scores. Paid subscriptions fund servers and deep reports only.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-stone-950/60 border border-stone-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-stone-100 font-medium">
                    <Lock className="w-4 h-4 text-blue-400" />
                    AES-256-GCM Tier 4 Privacy
                  </div>
                  <p className="text-xs text-stone-400">
                    Sensitive health and sensory accessibility needs are encrypted at rest with authenticated encryption. You control 6 permission levels.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-stone-950/60 border border-stone-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-stone-100 font-medium">
                    <Shield className="w-4 h-4 text-amber-400" />
                    Zero Dealbreaker Violations (D-14)
                  </div>
                  <p className="text-xs text-stone-400">
                    If you require non-smoking or monogamy, our deterministic engine guarantees 0.00% hard conflict leakage. Your boundaries are absolute.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-stone-950/60 border border-stone-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-stone-100 font-medium">
                    <UserCheck className="w-4 h-4 text-purple-400" />
                    Strictly 18+ Adults Only
                  </div>
                  <p className="text-xs text-stone-400">
                    Minors are strictly barred under the UK Online Safety Act and COPPA. Cyberflashing, stalking, or scams trigger immediate permanent bans.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STATUTORY SAFETY NOTICE */}
          {activeTab === 'safety' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/30 text-stone-200 space-y-3">
                <div className="flex items-center gap-2 text-red-400 font-bold uppercase tracking-wider text-xs">
                  <AlertTriangle className="w-4 h-4" />
                  Mandatory Statutory Notice (NJ N.J.S.A. § 56:8-171 & NY GBL § 394-cc)
                </div>
                <p className="text-sm font-semibold text-stone-100">
                  CHECK DOES NOT CONDUCT CRIMINAL BACKGROUND CHECKS OR SEX OFFENDER REGISTRY SCREENINGS ON ITS MEMBERS.
                </p>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Check makes no representations or warranties as to the conduct, background, or character of any user. You are solely responsible for your interactions and safety when meeting other members.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-stone-200">First Date Safety Guidelines:</h4>
                <ul className="space-y-2 text-xs text-stone-400">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Meet in Public Venues:</strong> Choose populated, well-lit spaces like our recommended low-stimulus cafes or cultural centers. Never meet in private apartments or isolated places for first encounters.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Share Your Itinerary:</strong> Inform a trusted friend or family member of the date time, venue location, and your match's contact info.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Own Your Transport:</strong> Arrive and depart independently via public transit, rideshare, or your own vehicle. Never accept a ride home on a first date.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Never Send Money:</strong> Never transfer funds, cryptocurrency, or share financial accounts under any circumstances. Report solicitations immediately.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: UK & EU STATUTORY ANNEX */}
          {activeTab === 'uk_eu' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/20 text-stone-200 space-y-2">
                <h3 className="font-semibold text-blue-300 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  United Kingdom & European Union Statutory Rights
                </h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Subscribers residing in the UK and European Union benefit from statutory consumer rights, mandatory right of withdrawal, transparent taxation, and independent dispute resolution.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-stone-950/60 border border-stone-800 space-y-1">
                  <h4 className="text-xs font-semibold text-stone-200">1. Statutory 14-Day Right of Withdrawal</h4>
                  <p className="text-xs text-stone-400">
                    Under the UK Consumer Contracts Regulations 2013 and EU Directive 2011/83/EU, you possess an unconditional right to cancel any paid tier within 14 calendar days of enrollment. To exercise withdrawal, email <code className="text-amber-400">legal@check-compatibility.internal</code> or use the Schedule 3 Model Withdrawal Form.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-950/60 border border-stone-800 space-y-1">
                  <h4 className="text-xs font-semibold text-stone-200">2. EU Digital Services Act (DSA Arts. 11, 16, 27)</h4>
                  <p className="text-xs text-stone-400">
                    DSA Electronic Single Point of Contact: <code className="text-amber-400">dsa-compliance@check-compatibility.internal</code>. Illegal content notices receive immediate human review within 24 hours. Under Art. 27, recommendation parameters are purely reciprocal and never skewed by payment status.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-950/60 border border-stone-800 space-y-1">
                  <h4 className="text-xs font-semibold text-stone-200">3. EU AI Act (Art. 50) & ODR Dispute Platform</h4>
                  <p className="text-xs text-stone-400">
                    Users have the right to transparent AI disclosure; Check uses deterministic math without subconscious manipulation. European Online Dispute Resolution (ODR) platform: <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noreferrer" className="text-blue-400 underline">ec.europa.eu/consumers/odr</a>.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-950/60 border border-stone-800 space-y-1">
                  <h4 className="text-xs font-semibold text-stone-200">4. VAT-Inclusive Quotations</h4>
                  <p className="text-xs text-stone-400">
                    All prices quoted to UK users natively include 20% UK VAT. All prices quoted to EU users include applicable EU Member State VAT (TVA/MwSt).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: GLOBAL PROTECTIONS */}
          {activeTab === 'global' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-stone-200 space-y-2">
                <h3 className="font-semibold text-emerald-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Canada, Australia & International Protections
                </h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Statutory consumer rights and privacy frameworks tailored for Canadian and Australian members.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-stone-950/60 border border-stone-800 space-y-1">
                  <h4 className="text-xs font-semibold text-stone-200">🇨🇦 Canada: PIPEDA & Quebec Law 25</h4>
                  <p className="text-xs text-stone-400">
                    Check complies with PIPEDA and Quebec Law 25. Sensitive profile attributes require explicit opt-in consent. Contact our Canadian Privacy Lead: <code className="text-amber-400">privacy-canada@check-compatibility.internal</code>.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-950/60 border border-stone-800 space-y-1">
                  <h4 className="text-xs font-semibold text-stone-200">🇦🇺 Australia: Australian Consumer Law (ACL Guarantees)</h4>
                  <p className="text-xs text-stone-400">
                    Under Schedule 2 of the Competition and Consumer Act 2010 (ACL), services come with non-excludable statutory guarantees. Prices include 10% Australian GST.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-950/60 border border-stone-800 space-y-1">
                  <h4 className="text-xs font-semibold text-stone-200">🌐 International: Standard Contractual Clauses (SCCs)</h4>
                  <p className="text-xs text-stone-400">
                    Cross-border data transfers are safeguarded under European Commission Standard Contractual Clauses (Decision 2021/914) and the UK International Data Transfer Addendum (IDTA).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: FULL TEXT */}
          {activeTab === 'full_text' && (
            <div className="space-y-4 text-xs font-mono leading-relaxed bg-stone-950 p-4 rounded-xl border border-stone-800 text-stone-400">
              <p className="text-stone-200 font-sans font-bold text-sm">CHECK TERMS OF SERVICE & MEMBER AGREEMENT (16 SECTIONS)</p>
              <p><strong>Section 1 (Acceptance):</strong> By accessing or using Check, you agree to enter into a legally binding contract governed by Delaware law (or England & Wales for UK/EU residents).</p>
              <p><strong>Section 2 (Age & Eligibility):</strong> You warrant you are 18+ years of age. Misrepresentation of age constitutes material breach and criminal violation under the UK Online Safety Act.</p>
              <p><strong>Section 4 (GDPR Art. 9 Consent):</strong> You provide explicit affirmative consent for Check to evaluate sensitive attributes (orientation, neurotype, sensory access) strictly in accordance with your 6-permission matrix.</p>
              <p><strong>Section 5 (Invariant D-23 Covenant):</strong> Check covenants that paid tiers provide non-algorithmic tools only; payment shall never elevate candidate ranking or compatibility scores.</p>
              <p><strong>Section 7 (Statutory Cancellation):</strong> California residents possess a statutory 3-day right to cancel with full refund (Civil Code § 1694.1). Click-to-cancel is available anytime in account settings.</p>
              <p><strong>Section 9 (Limitation of Liability):</strong> Check's liability is capped at $100 USD or fees paid in the past 6 months. Check disclaims all liability for offline conduct and in-person meetings.</p>
              <p><strong>Section 10 (Arbitration):</strong> Binding individual arbitration administered by AAA with class action waiver (with statutory court carve-outs for UK and EU consumers).</p>
              <p><strong>Section 15 (UK & EU Statutory Annex):</strong> 14-day statutory right of withdrawal under Consumer Contracts Regulations 2013 and Directive 2011/83/EU. DSA single point of contact at dsa-compliance@check-compatibility.internal.</p>
              <p><strong>Section 16 (International Annex):</strong> Canadian PIPEDA & Quebec Law 25 compliance, Australian Consumer Law (ACL) statutory guarantees, and cross-border Standard Contractual Clauses (SCCs).</p>
            </div>
          )}

          {/* Affirmation Checkboxes */}
          <div className="pt-4 border-t border-stone-800 space-y-3">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={agreedAge}
                onChange={(e) => setAgreedAge(e.target.checked)}
                className="mt-1 rounded bg-stone-800 border-stone-700 text-amber-500 focus:ring-amber-400 focus:ring-offset-stone-900"
              />
              <span className="text-xs text-stone-300 group-hover:text-stone-100">
                I verify that I am at least <strong>18 years old</strong> and meet all statutory age assurance requirements.
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={agreedSafety}
                onChange={(e) => setAgreedSafety(e.target.checked)}
                className="mt-1 rounded bg-stone-800 border-stone-700 text-amber-500 focus:ring-amber-400 focus:ring-offset-stone-900"
              />
              <span className="text-xs text-stone-300 group-hover:text-stone-100">
                I understand that Check does <strong>not conduct criminal background checks</strong> and I agree to follow safe in-person dating guidelines.
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="mt-1 rounded bg-stone-800 border-stone-700 text-amber-500 focus:ring-amber-400 focus:ring-offset-stone-900"
              />
              <span className="text-xs text-stone-300 group-hover:text-stone-100">
                I have read and agree to the <strong>Terms of Service</strong>, the <strong>Invariant D-23 No Pay-to-Win Charter</strong>, the <strong>Privacy Matrix</strong>, and the <strong>Regional Statutory Annexes (UK, EU, US & Global)</strong>.
              </span>
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-stone-800 bg-stone-950/60 flex items-center justify-between">
          <a
            href="mailto:legal@check-compatibility.internal"
            className="text-xs text-stone-500 hover:text-stone-300 underline"
          >
            Contact Legal Compliance
          </a>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded-lg transition-colors"
            >
              Close
            </button>
            {onAccept && (
              <button
                disabled={!canAccept}
                onClick={() => {
                  if (canAccept) {
                    onAccept()
                    onClose()
                  }
                }}
                className={`px-5 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 ${
                  canAccept
                    ? 'bg-amber-400 hover:bg-amber-300 text-stone-950 shadow-lg shadow-amber-500/20'
                    : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                Affirm & Continue
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
