# CHECK — P0 SECURITY CHANGE SPECIFICATION
**Date**: October 7, 2026
**Status**: Specification Phase (No Application Code Modified Yet)
**Target Files**: `server/src/security/encryption.ts`, `server/src/routes/matching.ts`, `server/src/index.ts`

---

## 1. Scope & Objective

This specification details the precise code changes required to address three P0 security vulnerabilities identified during the empirical repository audit:
1. **P0-1**: Production key fail-fast in Field-Level Encryption service.
2. **P0-2**: Session-derived user identity verification to eliminate IDOR risks.
3. **P0-3**: Restricted CORS policy configuration.

---

## 2. P0-1: Production Key Fail-Fast Spec

### File: `server/src/security/encryption.ts`

#### Current Behavior:
```typescript
if (masterKeyHex) {
  this.masterKey = Buffer.from(masterKeyHex, 'hex')
} else if (process.env.FIELD_ENCRYPTION_KEY) {
  this.masterKey = Buffer.from(process.env.FIELD_ENCRYPTION_KEY, 'hex')
} else {
  // Ephemeral fallback key for development / testing with deterministic seed
  this.masterKey = crypto.createHash('sha256').update('universal_compatibility_tier4_dek_salt_2026').digest()
}
```

#### Specified Target Behavior:
```typescript
if (masterKeyHex) {
  this.masterKey = Buffer.from(masterKeyHex, 'hex')
} else if (process.env.FIELD_ENCRYPTION_KEY) {
  this.masterKey = Buffer.from(process.env.FIELD_ENCRYPTION_KEY, 'hex')
} else {
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'CRITICAL SECURITY ERROR: FIELD_ENCRYPTION_KEY environment variable must be set in production mode. ' +
      'Refusing to initialize FieldEncryptionService with ephemeral fallback key.'
    )
  }
  // Ephemeral fallback key ONLY allowed in non-production environments
  this.masterKey = crypto.createHash('sha256').update('universal_compatibility_tier4_dek_salt_2026').digest()
}
```

---

## 3. P0-2: Session Identity & IDOR Defense Spec

### File: `server/src/middleware/auth.ts` (New Middleware) & `server/src/routes/matching.ts`

#### Specified Target Behavior:
Introduce authentication middleware `requireAuth` that extracts identity from session / authorization token headers:

```typescript
import { Request, Response, NextFunction } from 'express'

export interface AuthenticatedRequest extends Request {
  userId?: string
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization
  const devUserIdHeader = req.headers['x-user-id'] as string

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7)
    // Validate session token and attach userId
    req.userId = extractUserIdFromToken(token)
    return next()
  }

  // Allow x-user-id header ONLY in non-production environment for local dev/testing
  if (process.env.NODE_ENV !== 'production' && devUserIdHeader) {
    req.userId = devUserIdHeader
    return next()
  }

  res.status(401).json({ error: 'Unauthorized: Valid authentication token required.' })
}
```

In `server/src/routes/matching.ts`:
Replace fallback `const currentUserId = (req.query.userId as string) || 'usr_elena_current'` with `req.userId` derived from `requireAuth`.

---

## 4. P0-3: CORS Hardening Spec

### File: `server/src/index.ts`

#### Specified Target Behavior:
Replace permissive `app.use(cors())` with explicit origin controls:

```typescript
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:3000']

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error(`CORS policy violation: Origin ${origin} not allowed.`))
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-User-ID', 'X-Simulate-Network'],
  })
)
```
