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
        'We built Check because we were sick and tired of modern dating apps treating human hearts like slot machines. Traditional apps make money by keeping you hooked, single, and swiping forever. They reward superficial looks, sell paid boosts, and hide your real matches behind paywalls. Check does the exact opposite. We match you on the quiet, essential truths that make love actually last—shared values, life dreams, emotional rhythm, communication styles, and mutual respect. You get a small handful of deeply aligned introductions a day, with zero pay-to-win tricks.',
    },
    {
      category: 'overview',
      question: 'Why are there no endless swiping feeds?',
      answer:
        'Because endless swiping numbs your heart. Swiping through hundreds of photos an hour turns living, breathing souls into disposable trading cards and leaves you feeling completely drained and lonely before you fall asleep. Real love requires presence, not an endless scroll. Check gives you a curated daily selection of people where both of you already meet each other’s non-negotiable boundaries, giving each connection the attention and care it deserves.',
    },
    {
      category: 'overview',
      question: 'Can I use Check on my mobile phone? How does Phone Mode work?',
      answer:
        'Yes, Check was built from the ground up to feel wonderful in your hands. You can open it in any mobile browser or tap the "Phone Mode" button in the menu. Everything transforms into an ultra-smooth mobile experience with a dedicated bottom navigation bar, full-screen cards, easy-to-read text, and big, comfortable touch targets.',
    },
    {
      category: 'overview',
      question: 'How do I get started?',
      answer:
        'Tell us who you really are and what you’re longing for. In "My Profile & Preferences", share your true self—your lifestyle, your favorite quiet moments, your communication style, and your honest non-negotiables (like family dreams or personal values). We’ll instantly introduce you to people whose hearts and futures align with yours.',
    },
    {
      category: 'overview',
      question: 'How does "Verified Human" work?',
      answer:
        'To make sure you never waste another ounce of emotional energy on fake accounts, bots, or romance scammers, every profile on Check is verified as a living, breathing human being. You can open your heart knowing that whoever is on the other side is real, honest, and truly looking for connection.',
    },

    // 2. MATCHING & BOUNDARIES
    {
      category: 'matching',
      question: 'How does mutual compatibility work?',
      answer:
        'True love has to be mutual from the very start. We don’t just look at whether someone matches your dream—we make sure you are also what they’ve been hoping to find. If either person has a non-negotiable dealbreaker (like one person smoking and the other needing clean air, or differing visions on having children), we never pair you up. We protect both of you from avoidable heartbreak.',
    },
    {
      category: 'matching',
      question: 'What are the 12 compatibility dimensions evaluated?',
      answer:
        'The foundational truths of shared living and loving: 1) Core Values & Morals, 2) Daily Life Rhythms (early risers & night owls), 3) Communication & How You Handle Disagreements, 4) Food & Kitchen Harmony, 5) Social Energy (introvert & extrovert needs), 6) Long-term Family Intentions, 7) Financial Outlook & Ambition, 8) Home Peace (calm lighting, quiet spaces, sensory comfort), 9) Physical Warmth & Affection, 10) Practical Distance & Travel Overlap, 11) Emotional Security, and 12) Shared Long-term Dreams.',
    },
    {
      category: 'matching',
      question: 'Can someone bypass or ignore my non-negotiable dealbreakers?',
      answer:
        'Never. Not for any amount of money in the world. Your boundaries exist to keep you safe and honored. Under our Zero Pay-to-Win Pledge (Invariant D-23), no one can pay to override your dealbreakers or force themselves into your feed. If it doesn’t align with your core values, it won’t show up.',
    },
    {
      category: 'matching',
      question: 'What does the Match Percentage score mean?',
      answer:
        'It is an honest reflection of how naturally your daily lives, values, and emotional styles fit together. It is not an arbitrary popularity contest or a secret score designed to manipulate you. You can tap into any profile to see the transparent breakdown of why you two resonate.',
    },
    {
      category: 'matching',
      question: 'Can I change my preferences, age range, or dealbreakers later?',
      answer:
        'Always. As you learn more about yourself and what you need in a partner, you can adjust your preferences, distance, or non-negotiables anytime in your profile settings. Your match recommendations will update right away.',
    },
    {
      category: 'matching',
      question: 'What happens if my preferences contradict each other?',
      answer:
        'Our system gently watches out for you. If you accidentally set conflicting goals (like wanting strict vegan-only living while also setting dietary flexibility to high), we’ll gently point it out with a clear suggestion so your matches stay authentic and accurate.',
    },

    // 3. PRIVACY & SAFETY
    {
      category: 'privacy',
      question: 'How is my location privacy protected?',
      answer:
        'Your safety and peace of mind come before everything. Check never shares your exact GPS coordinates or street address with anyone. We only display broad distance bands (like "< 5 km" or "15–30 km") so no one can ever track where you live or work.',
    },
    {
      category: 'privacy',
      question: 'Is my sensitive personal data encrypted?',
      answer:
        'Yes, completely. Your personal reflections, boundary settings, and intimate conversations are encrypted using bank-grade AES-256-GCM encryption. We will never sell, lease, or monetize your private life with advertisers or data brokers.',
    },
    {
      category: 'privacy',
      question: 'Can I delete my account and permanently erase all my data?',
      answer:
        'Yes. In full compliance with GDPR Art. 17 (Right to Erasure) and California CCPA, you can permanently delete your profile, photos, conversations, and every trace of your data with a single click. When you leave, you leave cleanly—no lingering records.',
    },
    {
      category: 'privacy',
      question: 'How do I block or report someone?',
      answer:
        'You have full power over your space. You can block or report any profile instantly from their card or your conversation. Blocking is immediate and two-way: neither of you will ever see each other’s profile or be able to message again.',
    },

    // 4. FAIR PRICING & ETHICS
    {
      category: 'pricing',
      question: 'Is Check pay-to-win?',
      answer:
        'Never. Under our Zero Pay-to-Win Pledge (Invariant D-23), money will never buy priority in someone’s feed, boost someone’s visibility, or override a dealbreaker. We believe love is sacred, and giving unfair advantages to the highest bidder corrupts human connection. Everyone is treated with equal dignity.',
    },
    {
      category: 'pricing',
      question: 'What subscription options are available?',
      answer:
        'We provide a 100% Free Sanctuary tier that includes full mutual matching and messaging for everyone—forever. For members who want to support our mission of healing modern dating, we offer optional Supporter tiers (Plus Member at $14.99/mo or $7.99/mo annually, and Patron Circle) which unlock advanced calm date planning and deeper compatibility reports. All pricing clearly includes 20% UK VAT or local taxes with zero surprise charges.',
    },
    {
      category: 'pricing',
      question: 'How do cancellations and refunds work? Is there a cooling-off period?',
      answer:
        'You can cancel your subscription at any time with 1 click in your account—no phone calls, no guilt trips, and no tricky cancellation mazes. In compliance with the UK Consumer Contracts Regulations 2013, EU Directive 2011/83/EU, and California Civil Code § 1694.1, you have an unconditional 14-day cooling-off window for a 100% full refund with zero questions asked.',
    },

    // 5. FIRST DATES & MESSAGING
    {
      category: 'dates',
      question: 'What is the Date Planner (First Date Blueprint)?',
      answer:
        'First dates shouldn’t feel like stressful interrogations. The Date Planner suggests peaceful, low-pressure date spots based on both of your tastes—like cozy specialty coffee nooks, quiet art galleries, or tranquil park walks where you can actually hear each other speak and be yourselves.',
    },
    {
      category: 'dates',
      question: 'Why are date spots tested for low noise (≤ 45 dB) and warm lighting?',
      answer:
        'Because nobody ever fell in love while shouting over noisy espresso machines or crowded bars. When an environment is noisy and glaring, your nervous system stays on high alert. We recommend venues with gentle amber lighting and soft acoustics so you can both take a deep breath, let your guard down, and connect from the heart.',
    },
    {
      category: 'dates',
      question: 'How does the Transit Midpoint Calculator work?',
      answer:
        'It finds a fair, convenient meeting spot situated halfway along both of your usual transit routes. No more one person traveling an hour across the city while the other walks down the block. It starts your connection on equal, considerate footing.',
    },
    {
      category: 'dates',
      question: 'Why is messaging designed with thoughtful pacing?',
      answer:
        'We believe great conversations take time to breathe. We intentionally removed the anxiety of "read receipts" and typing bubbles so you never feel pressured to reply in five seconds. Take your time, write what you mean, and enjoy getting to know someone without the dread of being left on read.',
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
            Honest Answers • Real Human Connection
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
          Everything You Need to Know About Check
        </h1>
        <p className="text-sm text-neutral-400 font-light max-w-xl mx-auto leading-relaxed">
          Why endless swiping burnt everyone out, how we protect your heart from games and pay-to-win tricks, and what happens when two people actually want the same life.
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
          <h4 className="text-xs font-semibold text-white">Your Privacy Is Sacred</h4>
          <p className="text-[11px] text-neutral-400 font-light leading-normal">
            AES-256 encryption protects your personal stories. Location is shielded in safe distance bands so you can explore love without fear.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.07] space-y-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <h4 className="text-xs font-semibold text-white">Zero Pay-to-Win Pledge</h4>
          <p className="text-[11px] text-neutral-400 font-light leading-normal">
            No paid boosts, no visibility auctions, and no games. Compatibility is equal and mutual for everyone, always.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.07] space-y-2">
          <Heart className="w-5 h-5 text-rose-400" />
          <h4 className="text-xs font-semibold text-white">Your Heart, Protected</h4>
          <p className="text-[11px] text-neutral-400 font-light leading-normal">
            Your non-negotiable boundaries are honored unconditionally. No one can ever pay to bypass your boundaries or waste your time.
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
