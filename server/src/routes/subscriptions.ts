// ============================================================================
// server/src/routes/subscriptions.ts
// Universal Compatibility Platform: Subscriptions & Payments API Route Handler
// Governing Standards: Master Build Specification §33, ARCHITECTURE_REVIEW.md D-23
// ============================================================================

import { Router, Request, Response } from 'express'
import { subscriptionService } from '../payments/subscriptionService.js'
import {
  PLAN_ENTITLEMENTS,
  PLAN_PRICING_BY_CURRENCY,
  type SubscriptionPlan,
  type SupportedCurrency,
} from '../payments/types.js'
import { db } from '../data/dbStore.js'

const subscriptionsRouter = Router()

/**
 * GET /api/v1/subscriptions/current
 * Returns current user's subscription record with localized pricing.
 */
subscriptionsRouter.get('/current', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'usr_elena_current'
  const currency = ((req.query.currency as string)?.toUpperCase() as SupportedCurrency) || 'USD'
  try {
    const subscription = subscriptionService.getSubscription(userId)
    const entitlements = subscriptionService.getEntitlements(userId)
    const localizedPrice = PLAN_PRICING_BY_CURRENCY[subscription.plan]?.[currency] || PLAN_PRICING_BY_CURRENCY[subscription.plan]?.USD

    res.json({
      subscription,
      entitlements,
      currency,
      localizedPrice,
      pricingTable: PLAN_PRICING_BY_CURRENCY,
      isolationGuarantees: {
        matchingScoresAffected: false,
        rankingBoosted: false,
        dealbreakersBypassed: false,
      },
    })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

/**
 * GET /api/v1/subscriptions/features
 * Returns active feature entitlements for user and global pricing table.
 */
subscriptionsRouter.get('/features', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'usr_elena_current'
  const currency = ((req.query.currency as string)?.toUpperCase() as SupportedCurrency) || 'USD'
  try {
    const entitlements = subscriptionService.getEntitlements(userId)
    res.json({
      entitlements,
      currency,
      supportedCurrencies: ['USD', 'GBP', 'EUR', 'CAD', 'AUD'],
      pricingTable: PLAN_PRICING_BY_CURRENCY,
    })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

/**
 * POST /api/v1/subscriptions/checkout
 * Initiates checkout session. Requires idempotencyKey to prevent double billing.
 */
subscriptionsRouter.post('/checkout', async (req: Request, res: Response) => {
  const {
    userId = 'usr_elena_current',
    plan = 'supporter',
    idempotencyKey,
    currency = 'USD',
  } = req.body

  if (!idempotencyKey) {
    return res.status(400).json({ error: 'Missing required idempotencyKey' })
  }

  if (!PLAN_ENTITLEMENTS[plan as SubscriptionPlan]) {
    return res.status(400).json({ error: `Invalid plan specified: ${plan}` })
  }

  const validCurrency: SupportedCurrency = ['USD', 'GBP', 'EUR', 'CAD', 'AUD'].includes(currency?.toUpperCase())
    ? (currency.toUpperCase() as SupportedCurrency)
    : 'USD'

  try {
    const session = await subscriptionService.createCheckout(
      userId,
      plan as SubscriptionPlan,
      idempotencyKey,
      validCurrency
    )
    res.status(200).json({
      success: true,
      sessionId: session.sessionId,
      checkoutUrl: session.checkoutUrl,
      providerPaymentId: session.providerPaymentId,
      currency: validCurrency,
    })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

/**
 * POST /api/v1/subscriptions/cancel
 * Cancels current plan at end of billing cycle.
 */
subscriptionsRouter.post('/cancel', async (req: Request, res: Response) => {
  const { userId = 'usr_elena_current' } = req.body
  try {
    const updated = await subscriptionService.cancelSubscription(userId)
    res.json({
      success: true,
      message: 'Subscription will cancel at period end.',
      subscription: updated,
    })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

/**
 * POST /api/v1/subscriptions/webhook
 * Ingests and processes provider webhooks with HMAC validation and replay prevention.
 */
subscriptionsRouter.post('/webhook', async (req: Request, res: Response) => {
  const signature = req.headers['x-webhook-signature'] as string
  const rawPayload = typeof req.body === 'string' ? req.body : JSON.stringify(req.body)

  if (!signature) {
    return res.status(401).json({ error: 'Missing x-webhook-signature header' })
  }

  try {
    const result = await subscriptionService.handleWebhook(rawPayload, signature)
    res.json({ success: true, ...result })
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

/**
 * GET /api/v1/subscriptions/history
 * Returns user's payment records.
 */
subscriptionsRouter.get('/history', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'usr_elena_current'
  const payments = db.getPaymentsForUser(userId)
  res.json({ userId, count: payments.length, payments })
})

export { subscriptionsRouter }
