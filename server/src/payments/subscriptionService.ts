// ============================================================================
// server/src/payments/subscriptionService.ts
// Universal Compatibility Platform: Subscriptions Service
// Governing Standards: Master Build Specification §33, ARCHITECTURE_REVIEW.md D-23
// ============================================================================

import { db } from '../data/dbStore.js'
import {
  type SubscriptionPlan,
  type SubscriptionRecord,
  type PaymentRecord,
  type PlanEntitlements,
  type SupportedCurrency,
  PLAN_ENTITLEMENTS,
  PLAN_PRICING_BY_CURRENCY,
} from './types.js'
import { mockPaymentGateway, type CheckoutSessionResult } from './gateway.js'

export class SubscriptionService {
  /**
   * Retrieves or creates the default free subscription for a user.
   */
  public getSubscription(userId: string): SubscriptionRecord {
    let sub = db.getSubscription(userId)
    if (!sub) {
      sub = {
        id: `sub_${userId}_free`,
        userId,
        plan: 'free',
        status: 'active',
        currentPeriodStart: new Date().toISOString(),
        currentPeriodEnd: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString(),
        cancelAtPeriodEnd: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      db.setSubscription(userId, sub)
    }
    return sub
  }

  /**
   * Returns ethical plan entitlements.
   * INVARIANT D-23: Entitlements never modify matching, scores, or ranking.
   */
  public getEntitlements(userId: string): PlanEntitlements {
    const sub = this.getSubscription(userId)
    const base = PLAN_ENTITLEMENTS[sub.plan] || PLAN_ENTITLEMENTS.free

    // Strict runtime invariant assertions
    if (base.matchingScoreMultiplier !== 1.0 || base.exposureBoost !== 0 || base.dealbreakerBypass !== false) {
      throw new Error('D-23 CRITICAL VIOLATION: Business tier detected with matching score or exposure modifications!')
    }

    return base
  }

  /**
   * Initiates checkout session via payment provider gateway.
   */
  public async createCheckout(
    userId: string,
    plan: SubscriptionPlan,
    idempotencyKey: string,
    currency: SupportedCurrency = 'USD'
  ): Promise<CheckoutSessionResult> {
    const entitlements = PLAN_ENTITLEMENTS[plan]
    if (!entitlements) {
      throw new Error(`Invalid plan: ${plan}`)
    }

    const localizedPrice = PLAN_PRICING_BY_CURRENCY[plan]?.[currency]
    const amountCents = localizedPrice ? localizedPrice.amountCents : entitlements.monthlyPriceCents

    // Check existing payment by idempotency
    const existingPayment = db.getPaymentByIdempotency(idempotencyKey)
    if (existingPayment) {
      return {
        sessionId: `cs_cached_${existingPayment.id}`,
        checkoutUrl: `https://checkout.mockpayment.internal/pay/cached?key=${idempotencyKey}`,
        providerPaymentId: existingPayment.providerPaymentId,
        currency: (existingPayment.currency as SupportedCurrency) || currency,
      }
    }

    const session = await mockPaymentGateway.createCheckoutSession(
      userId,
      plan,
      amountCents,
      idempotencyKey,
      currency
    )

    // Stage pending payment record
    const paymentRecord: PaymentRecord = {
      id: `pay_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      subscriptionId: null,
      userId,
      amountCents,
      currency,
      provider: 'mock',
      providerPaymentId: session.providerPaymentId,
      status: 'pending',
      idempotencyKey,
      metadata: { plan, sessionId: session.sessionId, currency },
      createdAt: new Date().toISOString(),
    }
    db.recordPayment(paymentRecord)

    return session
  }

  /**
   * Processes verified payment webhooks with replay prevention.
   */
  public async handleWebhook(
    rawPayload: string,
    signature: string
  ): Promise<{ handled: boolean; message: string; duplicate?: boolean }> {
    const isValid = mockPaymentGateway.verifyWebhookSignature(rawPayload, signature)
    if (!isValid) {
      throw new Error('Invalid webhook signature')
    }

    const event = mockPaymentGateway.constructWebhookEvent(rawPayload)

    // Replay attack / duplicate delivery prevention
    if (mockPaymentGateway.isEventDuplicate(event.id)) {
      return { handled: true, message: 'Event already processed (idempotent)', duplicate: true }
    }

    if (event.type === 'payment_intent.succeeded') {
      const { userId, plan = 'supporter', amountCents = 999, currency = 'USD' } = event.data
      
      // Update subscription
      const currentSub = this.getSubscription(userId)
      const updatedSub: SubscriptionRecord = {
        ...currentSub,
        plan,
        status: 'active',
        currentPeriodStart: new Date().toISOString(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
        cancelAtPeriodEnd: false,
        updatedAt: new Date().toISOString(),
      }
      db.setSubscription(userId, updatedSub)

      // Record succeeded payment with idempotency
      const payment: PaymentRecord = {
        id: `pay_${event.id}`,
        subscriptionId: updatedSub.id,
        userId,
        amountCents,
        currency,
        provider: 'mock',
        providerPaymentId: event.id,
        status: 'succeeded',
        idempotencyKey: event.idempotencyKey || event.id,
        metadata: { eventType: event.type, currency },
        createdAt: new Date().toISOString(),
      }
      db.recordPayment(payment)
      mockPaymentGateway.markEventProcessed(event.id)

      return { handled: true, message: `Successfully upgraded user ${userId} to ${plan}` }
    }

    if (event.type === 'customer.subscription.deleted') {
      const { userId } = event.data
      const currentSub = this.getSubscription(userId)
      const downgradedSub: SubscriptionRecord = {
        ...currentSub,
        plan: 'free',
        status: 'canceled',
        updatedAt: new Date().toISOString(),
      }
      db.setSubscription(userId, downgradedSub)
      mockPaymentGateway.markEventProcessed(event.id)

      return { handled: true, message: `User ${userId} subscription canceled; reverted to free.` }
    }

    return { handled: false, message: `Unhandled event type: ${event.type}` }
  }

  /**
   * Cancels an active user subscription.
   */
  public async cancelSubscription(userId: string): Promise<SubscriptionRecord> {
    const sub = this.getSubscription(userId)
    if (sub.plan === 'free') {
      return sub
    }

    const updatedSub: SubscriptionRecord = {
      ...sub,
      cancelAtPeriodEnd: true,
      updatedAt: new Date().toISOString(),
    }
    db.setSubscription(userId, updatedSub)
    return updatedSub
  }
}

export const subscriptionService = new SubscriptionService()
