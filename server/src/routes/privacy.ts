// ============================================================================
// server/src/routes/privacy.ts
// Privacy, Consent Permissions, and Field-Level Encryption Endpoints
// Conforms to: PRIVACY_SPEC.md §2, §3, and SECURITY_SPEC.md §3
// Protected with requireAuth & authorizeSelf
// ============================================================================

import { Router, Response } from 'express'
import { db } from '../data/dbStore.js'
import { fieldEncryptionService } from '../security/encryption.js'
import { requireAuth, authorizeSelf, AuthenticatedRequest } from '../middleware/auth.js'

export const privacyRouter = Router()

// POST /api/v1/privacy/tier4/store
// Stores a Tier 4 sensitive attribute encrypted via AES-256-GCM
privacyRouter.post('/tier4/store', requireAuth, (req: AuthenticatedRequest, res: Response): void => {
  const { userId, attributeId, plainValue, permMatchable = false, permDisplay = false } = req.body

  if (!userId || !attributeId || plainValue === undefined) {
    res.status(400).json({ error: 'userId, attributeId, and plainValue are required.' })
    return
  }

  // Authorization check: Actor must be the target user
  if (!authorizeSelf(userId, req, res)) return

  const user = db.getUser(userId)
  if (!user) {
    res.status(404).json({ error: 'User not found.' })
    return
  }

  // Encrypt payload application-side
  const encryptedPayload = fieldEncryptionService.encrypt(plainValue)

  // Persist only ciphertext, iv, and auth tag
  const record = db.saveEncryptedAttribute(userId, attributeId, encryptedPayload, permMatchable, permDisplay)

  res.status(201).json({
    message: `Tier 4 attribute '${attributeId}' encrypted and stored.`,
    attributeId,
    keyId: encryptedPayload.keyId,
    ciphertextLength: encryptedPayload.ciphertext.length,
    permMatchable: record.permMatchable,
    permDisplay: record.permDisplay,
  })
})

// POST /api/v1/privacy/tier4/retrieve
// Decrypts and retrieves a Tier 4 sensitive attribute (authorized user self-inspection only)
privacyRouter.post('/tier4/retrieve', requireAuth, (req: AuthenticatedRequest, res: Response): void => {
  const { userId, attributeId } = req.body

  if (!userId || !attributeId) {
    res.status(400).json({ error: 'userId and attributeId are required.' })
    return
  }

  // Authorization check: Actor must be the target user
  if (!authorizeSelf(userId, req, res)) return

  const record = db.getEncryptedAttribute(userId, attributeId)
  if (!record) {
    res.status(404).json({ error: 'Encrypted attribute not found.' })
    return
  }

  try {
    const decryptedValue = fieldEncryptionService.decrypt(record.encryptedPayload)
    db.logAudit(userId, 'user', 'DECRYPT_TIER4', 'attribute_values', attributeId, {})

    res.json({
      attributeId,
      decryptedValue,
      permMatchable: record.permMatchable,
      permDisplay: record.permDisplay,
    })
  } catch {
    res.status(500).json({ error: 'Decryption failed: Integrity check or tag mismatch.' })
  }
})
