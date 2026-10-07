// ============================================================================
// server/src/security/encryption.ts
// Application-Layer Field-Level Encryption (FLE) using AES-256-GCM
// Conforms to: SECURITY_SPEC.md §3, PRIVACY_SPEC.md §3 (Tier 4 Attributes)
// ============================================================================

import crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 12 // 96 bits for AES-GCM
const AUTH_TAG_LENGTH = 16 // 128 bits authentication tag

export interface EncryptedFieldPayload {
  ciphertext: string // Base64 encoded ciphertext
  iv: string // Base64 encoded 96-bit initialization vector
  tag: string // Base64 encoded 128-bit authentication tag
  keyId: string // Key identifier for annual DEK rotation support
  version: number // Encryption payload schema version
}

export class FieldEncryptionService {
  private masterKey: Buffer
  private currentKeyId: string

  constructor(masterKeyHex?: string, keyId = 'dek_2026_primary') {
    this.currentKeyId = keyId
    const keyString = masterKeyHex || process.env.FIELD_ENCRYPTION_KEY

    if (keyString) {
      if (!/^[0-9a-fA-F]{64}$/.test(keyString)) {
        throw new Error(
          'CRITICAL SECURITY ERROR: Master encryption key must be a valid 64-character hexadecimal string (256 bits / 32 bytes).'
        )
      }
      this.masterKey = Buffer.from(keyString, 'hex')
    } else if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'CRITICAL SECURITY ERROR: FIELD_ENCRYPTION_KEY environment variable must be set in production mode. Refusing to initialize FieldEncryptionService with ephemeral fallback key.'
      )
    } else {
      // Ephemeral fallback key ONLY allowed in non-production environments (development/test)
      this.masterKey = crypto.createHash('sha256').update('universal_compatibility_tier4_dek_salt_2026').digest()
    }

    if (this.masterKey.length !== 32) {
      throw new Error(`Master encryption key must be exactly 256 bits (32 bytes). Current: ${this.masterKey.length} bytes.`)
    }
  }

  /**
   * Encrypts any JSON-serializable value (Tier 4 sensitive attribute)
   */
  public encrypt<T = any>(plainValue: T): EncryptedFieldPayload {
    const serialized = JSON.stringify(plainValue)
    const iv = crypto.randomBytes(IV_LENGTH)

    const cipher = crypto.createCipheriv(ALGORITHM, this.masterKey, iv)
    let encrypted = cipher.update(serialized, 'utf8', 'base64')
    encrypted += cipher.final('base64')

    const authTag = cipher.getAuthTag()

    return {
      ciphertext: encrypted,
      iv: iv.toString('base64'),
      tag: authTag.toString('base64'),
      keyId: this.currentKeyId,
      version: 1,
    }
  }

  /**
   * Decrypts and authenticates an EncryptedFieldPayload using AES-256-GCM
   * Throws an error if ciphertext or tag was tampered with (Authenticated Encryption)
   */
  public decrypt<T = any>(payload: EncryptedFieldPayload): T {
    if (payload.version !== 1) {
      throw new Error(`Unsupported encryption version: ${payload.version}`)
    }

    const iv = Buffer.from(payload.iv, 'base64')
    const tag = Buffer.from(payload.tag, 'base64')
    if (tag.length !== AUTH_TAG_LENGTH) {
      throw new Error(`Invalid authentication tag length: expected ${AUTH_TAG_LENGTH} bytes, got ${tag.length}`)
    }
    const ciphertext = payload.ciphertext

    const decipher = crypto.createDecipheriv(ALGORITHM, this.masterKey, iv)
    decipher.setAuthTag(tag)

    let decrypted = decipher.update(ciphertext, 'base64', 'utf8')
    decrypted += decipher.final('utf8')

    return JSON.parse(decrypted) as T
  }
}

export const fieldEncryptionService = new FieldEncryptionService()
