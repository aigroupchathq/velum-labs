// ============================================================================
// src/components/AboutFaqView.tsx
// Universal Compatibility Platform: Warm, Clear About & FAQ Center
// Designed for Everyday Humans: Simple Language, Transparent Science & Complete Answers
// ============================================================================

import React, { useState } from 'react'
import {
  HelpCircle,
  ShieldCheck,
  Sparkles,
  Heart,
  Search,
  ChevronDown,
  Scale,
} from 'lucide-react'

interface AboutFaqViewProps {
  onNavigateToDiscover?: () => void
  onNavigateToProfile?: () => void
  onOpenTerms?: () => void
}

interface FaqItem {
  question: string
  answer: string
  category: 'overview' | 'matching' | 'privacy' | 'pricing' | 'dates'
}

export const AboutFaqView: React.FC<AboutFaqViewProps> = ({
  onNavigateToDiscover,
  onNavigateToProfile,
  onOpenTerms,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [openIndex, setOpenIndex] = useState<number | null>(0) // Open first item by default

  const faqItems: FaqItem[] = [
    // 1. OVERVIEW & PHILOSOPHY
    {
      category: 'overview',
      question: 'What is Check and how is it different from dating apps?',
      answer:
        'Check is built for adults seeking genuine, long-term partnership rather than superficial swiping games. Unlike conventional apps that use addictive swipe loops, popularity rankings, or pay-to-win boosts, Check focuses on mutual compatibility across 12 dimensions of real daily life—such as communication styles, core values, dietary habits, and family intentions.',
    },
    {
      category: 'overview',
      question: 'Why are there no endless swiping feeds?',
      answer:
        'Endless swiping creates cognitive overload, decision fatigue, and treats real humans like trading cards. On Check, you receive a curated daily set of mutually resonant profiles where both of you meet each other’s non-negotiable boundaries.',
    },
    {
      category: 'overview',
      question: 'How do I get started?',
      answer:
        'Simply complete your profile under "My Profile & Values". Set your location, daily lifestyle habits, communication preferences, and hard non-negotiables (like smoking or family plans). The system instantly calculates mutual compatibility against active candidate profiles.',
    },

    // 2. MATCHING & BOUNDARIES
    {
      category: 'matching',
      question: 'How does mutual compatibility work?',
      answer:
        'Matching evaluates two sides simultaneously: what you bring and what you seek in a partner, and what your potential partner brings and seeks in you. If either person has a non-negotiable boundary that is violated (for example, a strict non-smoker paired with a regular smoker), the system filters out the match automatically.',
    },
    {
      category: 'matching',
      question: 'What does the Match Percentage score mean?',
      answer:
        'The match percentage reflects how well your preferences, lifestyle habits, values, and daily routines align reciprocally. It is an indicator of mutual resonance—not a guarantee or authoritative judgment. We encourage you to inspect the detailed breakdown to see where your alignment is strongest.',
    },
    {
      category: 'matching',
      question: 'What happens if my preferences contradict each other?',
      answer:
        'Our background Preference Conflict Helper detects impossible criteria—such as marking diet flexibility as 90% while also setting it as a strict non-negotiable requirement. The system alerts you immediately with clear instructions to adjust your settings.',
    },

    // 3. PRIVACY & SAFETY
    {
      category: 'privacy',
      question: 'How is my location privacy protected?',
      answer:
        'Check never displays your precise address or exact GPS coordinates. We use broad distance bands (such as "< 5 km" or "15–30 km") and coordinate fuzzing to prevent location tracking or trilateration.',
    },
    {
      category: 'privacy',
      question: 'Is my sensitive personal data encrypted?',
      answer:
        'Yes. All sensitive personal details, lifestyle preferences, and conflict styles are encrypted using bank-grade AES-256-GCM encryption. Your raw data is never sold, leased, or shared with advertising networks.',
    },
    {
      category: 'privacy',
      question: 'How do I block or report someone?',
      answer:
        'You can block or report any profile instantly from their profile card or messaging view. Blocking is bidirectional and immediate—neither person will see or be able to contact the other again.',
    },

    // 4. FAIR PRICING & ETHICS
    {
      category: 'pricing',
      question: 'Is Check pay-to-win?',
      answer:
        'No. Under our Zero Pay-to-Win Pledge, subscription upgrades never grant priority matching, artificial score boosts, or the ability to bypass another person’s dealbreakers. Everyone receives equal algorithmic fairness regardless of subscription status.',
    },
    {
      category: 'pricing',
      question: 'What subscription options are available?',
      answer:
        'We offer a free Community tier as well as ethical supporter tiers for users who wish to support independent privacy-first software. All pricing clearly displays local taxes (such as VAT or GST) with no hidden fees.',
    },

    // 5. FIRST DATES & MESSAGING
    {
      category: 'dates',
      question: 'What is the Date Planner (Encounter Blueprint)?',
      answer:
        'The Date Planner provides calm, low-pressure date suggestions based on shared preferences—such as recommending quiet specialty coffee shops, botanical gardens, or galleries that match both users’ sensory and schedule needs.',
    },
    {
      category: 'dates',
      question: 'Why is messaging designed with thoughtful pacing?',
      answer:
        'We support asynchronous, respectful communication. There is no pressure for instant responses, and users can agree on comfortable response cadences to cultivate meaningful conversations without anxiety.',
    },
  ]

  const categories = [
    { id: 'all', label: 'All Questions' },
    { id: 'overview', label: 'Overview & Basics' },
    { id: 'matching', label: 'Matching & Boundaries' },
    { id: 'privacy', label: 'Privacy & Safety' },
    { id: 'pricing', label: 'Pricing & Ethics' },
    { id: 'dates', label: 'Dates & Messaging' },
  ]

  const filteredFaqs = faqItems.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-6 px-4 sm:px-6">
      {/* Header Banner */}
      <div className="p-8 sm:p-10 rounded-3xl apple-panel text-center space-y-4 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/10 backdrop-blur-xl">
          <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-300">
            Clear Answers • Transparent Science
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
          Everything You Need to Know
        </h1>
        <p className="text-sm text-neutral-400 font-light max-w-xl mx-auto leading-relaxed">
          How Check works, how your privacy is protected, and why we built a human-first platform free from swiping casinos and hidden pay-to-win tricks.
        </p>

        {/* Quick Search Bar */}
        <div className="max-w-md mx-auto relative pt-2">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 mt-1" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search any question (e.g. privacy, matching, pricing)..."
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-full bg-neutral-900/90 border border-white/15 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center justify-start sm:justify-center overflow-x-auto gap-2 pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`apple-pill-btn px-4 py-2 text-xs font-medium whitespace-nowrap rounded-full transition cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-white text-black shadow-sm font-semibold'
                : 'bg-white/[0.05] text-neutral-400 hover:text-white border border-white/10'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="p-8 rounded-2xl apple-panel text-center text-xs text-neutral-400 space-y-2">
            <p>No questions matched your search query &quot;{searchQuery}&quot;.</p>
            <button
              onClick={() => {
                setSearchQuery('')
                setActiveCategory('all')
              }}
              className="text-emerald-400 underline font-medium"
            >
              Clear search and view all FAQs
            </button>
          </div>
        ) : (
          filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx
            return (
              <div
                key={idx}
                className="rounded-2xl bg-neutral-900/60 border border-white/[0.08] overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-white/[0.03] transition cursor-pointer"
                >
                  <span className="text-sm font-semibold text-white tracking-tight leading-snug">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-emerald-400' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 sm:pb-6 text-xs text-neutral-300 font-light leading-relaxed border-t border-white/[0.04] pt-3 animate-in fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Key Guarantees Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.07] space-y-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h4 className="text-xs font-semibold text-white">Bank-Grade Privacy</h4>
          <p className="text-[11px] text-neutral-400 font-light leading-normal">
            AES-256 encryption protects your personal preferences. Location is coarsened into safe distance bands.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.07] space-y-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <h4 className="text-xs font-semibold text-white">Zero Pay-to-Win</h4>
          <p className="text-[11px] text-neutral-400 font-light leading-normal">
            No paid priority boosts or artificial ranking tricks. Compatibility is strictly reciprocal and equal for all users.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.07] space-y-2">
          <Heart className="w-5 h-5 text-rose-400" />
          <h4 className="text-xs font-semibold text-white">Non-Negotiable Boundaries</h4>
          <p className="text-[11px] text-neutral-400 font-light leading-normal">
            Your hard non-negotiable boundaries are strictly respected—preventing incompatible pairings upfront.
          </p>
        </div>
      </div>

      {/* Bottom CTA Actions */}
      <div className="p-6 rounded-3xl apple-panel flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <h3 className="text-sm font-semibold text-white">Ready to explore resonant matches?</h3>
          <p className="text-xs text-neutral-400 font-light">Set your profile preferences or launch discovery feed.</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {onOpenTerms && (
            <button
              onClick={onOpenTerms}
              className="apple-pill-btn px-4 py-2 text-xs font-medium bg-white/[0.05] hover:bg-white/[0.1] text-neutral-300 border border-white/10 transition cursor-pointer flex items-center space-x-1.5"
            >
              <Scale className="w-3.5 h-3.5 text-amber-400" />
              <span>Terms & Disclosures</span>
            </button>
          )}
          {onNavigateToProfile && (
            <button
              onClick={onNavigateToProfile}
              className="apple-pill-btn px-4 py-2 text-xs font-medium bg-white/[0.1] hover:bg-white/[0.2] text-white border border-white/20 transition cursor-pointer"
            >
              Update Profile
            </button>
          )}
          {onNavigateToDiscover && (
            <button
              onClick={onNavigateToDiscover}
              className="apple-pill-btn px-5 py-2 text-xs font-semibold bg-white text-black hover:bg-neutral-200 transition cursor-pointer shadow-lg"
            >
              Explore Matches
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
