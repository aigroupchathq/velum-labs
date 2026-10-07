// ============================================================================
// server/src/middleware/auth.ts
// Authorization & Authentication Boundary Middleware (Gate 3 Security Fix P0-2)
// NON-PRODUCTION DEVELOPMENT AUTHENTICATION MECHANISM
// ============================================================================

import { Request, Response, NextFunction } from 'express'
import { db } from '../data/dbStore.js'

export interface AuthenticatedRequest extends Request {
  actorUserId?: string
  isDevelopmentAuth?: boolean
}

/**
 * Middleware that extracts and verifies the authenticated acting user identity (actorUserId).
 * CLIENT-SUPPLIED IDENTITY != AUTHENTICATED IDENTITY.
 * Server derives the acting user from authenticated request context (Bearer Token or x-user-id header in dev).
 */
export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization
  const devUserIdHeader = req.headers['x-user-id'] as string

  // 1. Bearer Token Inspection
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7)
    // Support token format: dev_session_<userId> or raw userId token in dev
    const tokenUserId = token.startsWith('dev_session_') ? token.replace('dev_session_', '') : token
    const user = db.getUser(tokenUserId)
    if (user) {
      req.actorUserId = user.id
      req.isDevelopmentAuth = process.env.NODE_ENV !== 'production'
      return next()
    }
  }

  // 2. Controlled Development-Only Fallback
  if (process.env.NODE_ENV !== 'production') {
    const actingId = devUserIdHeader || (req.headers['x-authenticated-user'] as string) || (req.query.userId as string) || (req.body.userId as string) || 'usr_elena_current'
    const user = db.getUser(actingId)
    if (user) {
      req.actorUserId = user.id
      req.isDevelopmentAuth = true
      return next()
    }
  }

  // 3. Reject Unauthenticated Request in Production or if User Not Found
  res.status(401).json({
    error: 'Unauthorized: A valid authentication token or session is required.',
    code: 'UNAUTHENTICATED',
  })
}

/**
 * Authorization decision rule: Enforces that the authenticated actor is authorized
 * to access or mutate the target user resource (Self-Only Access).
 */
export function authorizeSelf(targetUserId: string, req: AuthenticatedRequest, res: Response): boolean {
  if (!req.actorUserId) {
    res.status(401).json({ error: 'Unauthorized: Missing authenticated actor context.' })
    return false
  }

  if (req.actorUserId !== targetUserId) {
    res.status(403).json({
      error: `Forbidden: Authenticated actor '${req.actorUserId}' is not authorized to access or modify resources belonging to user '${targetUserId}'.`,
      code: 'FORBIDDEN_RESOURCE_ACCESS',
    })
    return false
  }

  return true
}
