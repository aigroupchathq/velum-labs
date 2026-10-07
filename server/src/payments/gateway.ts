// ============================================================================
// server/src/payments/gateway.ts
// Universal Compatibility Platform: Payment Gateway Provider Abstraction
// Governing Standards: Master Build Specification §33, ARCHITECTURE_REVIEW.md D-23
// ============================================================================

import crypto from 'crypto'
import type { SubscriptionPlan, WebhookEventPayload, SupportedCurrency } from './types.js'

export interface CheckoutSessionResult {
  sessionId: string
  checkoutUrl: string
  providerPaymentId: string
  currency?: SupportedCurrency
}

export interface PaymentGateway {
  createCheckoutSession(
    userId: string,
    plan: SubscriptionPlan,
    amountCents: number,
    idempotencyKey: string,
    currency?: SupportedCurrency
  ): Promise<CheckoutSessionResult>
  cancelSubscription(subscriptionId: string): Promise<boolean>
  verifyWebhookSignature(rawPayload: string, signature: string): boolean
  constructWebhookEvent(rawPayload: string): WebhookEventPayload
}

export class MockPaymentGateway implements PaymentGateway {
  private webhookSecret: string = 'whsec_mock_deterministic_secret_2026'
  private processedWebhookIds: Set<string> = new Set()

  public async createCheckoutSession(
    userId: string,
    plan: SubscriptionPlan,
    amountCents: number,
    idempotencyKey: string,
    currency: SupportedCurrency = 'USD'
  ): Promise<CheckoutSessionResult> {
    const sessionId = `cs_test_${crypto.createHash('sha256').update(idempotencyKey).digest('hex').substring(0, 16)}`
    const providerPaymentId = `pi_test_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
    
    return {
      sessionId,
      checkoutUrl: `https://checkout.mockpayment.internal/pay/${sessionId}?plan=${plan}&uid=${userId}&amt=${amountCents}&cur=${currency}`,
      providerPaymentId,
      currency,
    }
  }

  public async cancelSubscription(_subscriptionId: string): Promise<boolean> {
    return true
  }

  public generateWebhookSignature(rawPayload: string): string {
    return crypto
      .createHmac('sha256', this.webhookSecret)
      .update(rawPayload)
      .digest('hex')
  }

  public verifyWebhookSignature(rawPayload: string, signature: string): boolean {
    if (!signature) return false
    const expected = this.generateWebhookSignature(rawPayload)
    try {
      return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
    } catch {
      return false
    }
  }

  public constructWebhookEvent(rawPayload: string): WebhookEventPayload {
    return JSON.parse(rawPayload) as WebhookEventPayload
  }

  public isEventDuplicate(eventId: string): boolean {
    return this.processedWebhookIds.has(eventId)
  }

  public markEventProcessed(eventId: string): void {
    this.processedWebhookIds.add(eventId)
  }
}

export const mockPaymentGateway = new MockPaymentGateway()
