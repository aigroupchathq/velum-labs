// ============================================================================
// src/config/appConfig.ts
// Checkmate Platform Configuration & Centralized Brand / Legal Constants
// Single Source of Truth for branding, URLs, legal contacts, and invariants
// ============================================================================

export const APP_CONFIG = {
  brand: {
    name: 'Checkmate',
    tagline: 'Verified Human Compatibility',
    motto: 'The Anti-Swipe Antidote • Zero Pay-to-Win',
    monogram: '✓',
    version: '2.0.0 (Global Compliance Edition)',
  },
  urls: {
    liveApp: 'https://aigroupchathq.github.io/velum-labs/',
    github: 'https://github.com/aigroupchathq/velum-labs',
    europeanOdr: 'https://ec.europa.eu/consumers/odr',
  },
  legal: {
    entityName: 'Checkmate Technologies, Inc.',
    jurisdiction: 'Delaware Corporation',
    contacts: {
      support: 'support@check-compatibility.internal',
      legal: 'legal@check-compatibility.internal',
      privacyCanada: 'privacy-canada@check-compatibility.internal',
      privacyAustralia: 'privacy-australia@check-compatibility.internal',
      euRepresentative: 'eu-representative@check-compatibility.internal',
      ukRepresentative: 'uk-representative@check-compatibility.internal',
      dsaCompliance: 'dsa-compliance@check-compatibility.internal',
    },
    statutoryDisclaimers: {
      backgroundCheckNotice:
        'CHECKMATE DOES NOT CONDUCT CRIMINAL BACKGROUND CHECKS OR SEX OFFENDER REGISTRY SCREENINGS ON ITS MEMBERS.',
      backgroundCheckSubtext:
        'Checkmate makes no representations or warranties as to the conduct, background, or character of any user. You are solely responsible for your interactions and safety when meeting other members.',
      californiaCancellationNotice:
        'California residents possess a statutory 3-day right to cancel with full refund (Civil Code § 1694.1). Click-to-cancel is available anytime in account settings.',
      ukAgeAssuranceNotice:
        'Strict 18+ age verification enforced pursuant to the UK Online Safety Act 2023.',
    },
  },
  invariants: {
    zeroPayToWin: 'D-23: Algorithmic matching is cryptographically isolated from subscription fees.',
    zeroDealbreakerLeakage: 'D-14: Dealbreakers are mathematically absolute (0.00% leakage).',
    coarseLocationOnly: 'P-02: Precise GPS is never retained; distances are binned to coarse bands.',
  },
} as const
