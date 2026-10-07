// ============================================================================
// server/src/payments/types.ts
// Universal Compatibility Platform: Payments & Subscriptions Domain Types
// Governing Standards: Master Build Specification §33, ARCHITECTURE_REVIEW.md D-23
// ============================================================================

export type SubscriptionPlan = 'free' | 'supporter' | 'patron' | 'verified_tier'
export type SubscriptionStatus = 'active' | 'past_due' | 'canceled' | 'trialing' | 'incomplete'
export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'refunded'
export type PaymentProvider = 'stripe' | 'mock'
export type SupportedCurrency = 'USD' | 'GBP' | 'EUR' | 'CAD' | 'AUD'

export interface LocalizedPlanPrice {
  currency: SupportedCurrency
  symbol: string
  amountCents: number
  formatted: string
  vatInclusive: boolean
  vatRatePercent: number
  taxNote: string
}

export const PLAN_PRICING_BY_CURRENCY: Record<SubscriptionPlan, Record<SupportedCurrency, LocalizedPlanPrice>> = {
  free: {
    USD: { currency: 'USD', symbol: '$', amountCents: 0, formatted: '$0', vatInclusive: false, vatRatePercent: 0, taxNote: 'Always free' },
    GBP: { currency: 'GBP', symbol: '£', amountCents: 0, formatted: '£0', vatInclusive: true, vatRatePercent: 20, taxNote: 'Always free' },
    EUR: { currency: 'EUR', symbol: '€', amountCents: 0, formatted: '€0', vatInclusive: true, vatRatePercent: 20, taxNote: 'Always free' },
    CAD: { currency: 'CAD', symbol: 'C$', amountCents: 0, formatted: 'C$0', vatInclusive: false, vatRatePercent: 0, taxNote: 'Always free' },
    AUD: { currency: 'AUD', symbol: 'A$', amountCents: 0, formatted: 'A$0', vatInclusive: true, vatRatePercent: 10, taxNote: 'Always free' },
  },
  supporter: {
    USD: { currency: 'USD', symbol: '$', amountCents: 999, formatted: '$9.99', vatInclusive: false, vatRatePercent: 0, taxNote: 'Excl. state sales tax' },
    GBP: { currency: 'GBP', symbol: '£', amountCents: 799, formatted: '£7.99', vatInclusive: true, vatRatePercent: 20, taxNote: 'Includes 20% UK VAT' },
    EUR: { currency: 'EUR', symbol: '€', amountCents: 899, formatted: '€8.99', vatInclusive: true, vatRatePercent: 20, taxNote: 'Includes statutory EU TVA / MwSt' },
    CAD: { currency: 'CAD', symbol: 'C$', amountCents: 1399, formatted: 'C$13.99', vatInclusive: false, vatRatePercent: 5, taxNote: 'Excl. GST/PST' },
    AUD: { currency: 'AUD', symbol: 'A$', amountCents: 1499, formatted: 'A$14.99', vatInclusive: true, vatRatePercent: 10, taxNote: 'Includes 10% Australian GST' },
  },
  patron: {
    USD: { currency: 'USD', symbol: '$', amountCents: 2499, formatted: '$24.99', vatInclusive: false, vatRatePercent: 0, taxNote: 'Excl. state sales tax' },
    GBP: { currency: 'GBP', symbol: '£', amountCents: 1999, formatted: '£19.99', vatInclusive: true, vatRatePercent: 20, taxNote: 'Includes 20% UK VAT' },
    EUR: { currency: 'EUR', symbol: '€', amountCents: 2299, formatted: '€22.99', vatInclusive: true, vatRatePercent: 20, taxNote: 'Includes statutory EU TVA / MwSt' },
    CAD: { currency: 'CAD', symbol: 'C$', amountCents: 3499, formatted: 'C$34.99', vatInclusive: false, vatRatePercent: 5, taxNote: 'Excl. GST/PST' },
    AUD: { currency: 'AUD', symbol: 'A$', amountCents: 3799, formatted: 'A$37.99', vatInclusive: true, vatRatePercent: 10, taxNote: 'Includes 10% Australian GST' },
  },
  verified_tier: {
    USD: { currency: 'USD', symbol: '$', amountCents: 1499, formatted: '$14.99', vatInclusive: false, vatRatePercent: 0, taxNote: 'Excl. state sales tax' },
    GBP: { currency: 'GBP', symbol: '£', amountCents: 1199, formatted: '£11.99', vatInclusive: true, vatRatePercent: 20, taxNote: 'Includes 20% UK VAT' },
    EUR: { currency: 'EUR', symbol: '€', amountCents: 1399, formatted: '€13.99', vatInclusive: true, vatRatePercent: 20, taxNote: 'Includes statutory EU TVA / MwSt' },
    CAD: { currency: 'CAD', symbol: 'C$', amountCents: 2099, formatted: 'C$20.99', vatInclusive: false, vatRatePercent: 5, taxNote: 'Excl. GST/PST' },
    AUD: { currency: 'AUD', symbol: 'A$', amountCents: 2299, formatted: 'A$22.99', vatInclusive: true, vatRatePercent: 10, taxNote: 'Includes 10% Australian GST' },
  },
}

export interface PlanEntitlements {
  plan: SubscriptionPlan
  name: string
  monthlyPriceCents: number
  // Ethical feature entitlements (non-matching)
  maxWhatIfSimulationsPerDay: number // -1 = unlimited
  canExportDossier: boolean
  canAccessCommunicationAnalytics: boolean
  supporterBadge: boolean
  
  // STRICT ARCHITECTURAL INVARIANT (D-23, Spec §33):
  // Matching & ranking CANNOT be influenced by payment state.
  matchingScoreMultiplier: 1.0 // Invariant: ALWAYS 1.0
  exposureBoost: 0 // Invariant: ALWAYS 0
  dealbreakerBypass: false // Invariant: ALWAYS false
}

export const PLAN_ENTITLEMENTS: Record<SubscriptionPlan, PlanEntitlements> = {
  free: {
    plan: 'free',
    name: 'Free Community Tier',
    monthlyPriceCents: 0,
    maxWhatIfSimulationsPerDay: 5,
    canExportDossier: false,
    canAccessCommunicationAnalytics: false,
    supporterBadge: false,
    matchingScoreMultiplier: 1.0,
    exposureBoost: 0,
    dealbreakerBypass: false,
  },
  supporter: {
    plan: 'supporter',
    name: 'Platform Supporter',
    monthlyPriceCents: 999, // $9.99
    maxWhatIfSimulationsPerDay: 50,
    canExportDossier: true,
    canAccessCommunicationAnalytics: true,
    supporterBadge: true,
    matchingScoreMultiplier: 1.0,
    exposureBoost: 0,
    dealbreakerBypass: false,
  },
  patron: {
    plan: 'patron',
    name: 'Patron of Ethical Tech',
    monthlyPriceCents: 2499, // $24.99
    maxWhatIfSimulationsPerDay: -1, // Unlimited
    canExportDossier: true,
    canAccessCommunicationAnalytics: true,
    supporterBadge: true,
    matchingScoreMultiplier: 1.0,
    exposureBoost: 0,
    dealbreakerBypass: false,
  },
  verified_tier: {
    plan: 'verified_tier',
    name: 'Verified Identity Supporter',
    monthlyPriceCents: 1499, // $14.99
    maxWhatIfSimulationsPerDay: 100,
    canExportDossier: true,
    canAccessCommunicationAnalytics: true,
    supporterBadge: true,
    matchingScoreMultiplier: 1.0,
    exposureBoost: 0,
    dealbreakerBypass: false,
  },
}

export interface SubscriptionRecord {
  id: string
  userId: string
  plan: SubscriptionPlan
  status: SubscriptionStatus
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
  createdAt: string
  updatedAt: string
}

export interface PaymentRecord {
  id: string
  subscriptionId: string | null
  userId: string
  amountCents: number
  currency: SupportedCurrency | string
  provider: PaymentProvider
  providerPaymentId: string
  status: PaymentStatus
  idempotencyKey: string
  metadata: Record<string, any>
  createdAt: string
}

export interface WebhookEventPayload {
  id: string
  type: 'payment_intent.succeeded' | 'payment_intent.payment_failed' | 'customer.subscription.deleted'
  idempotencyKey: string
  data: {
    userId: string
    subscriptionId?: string
    amountCents?: number
    currency?: SupportedCurrency | string
    plan?: SubscriptionPlan
  }
}
