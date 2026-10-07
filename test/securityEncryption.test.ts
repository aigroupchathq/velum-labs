// ============================================================================
// test/securityEncryption.test.ts
// Security Fix P0-1 Test Suite: Production Encryption Key Fail-Fast Verification
// ============================================================================

import { FieldEncryptionService } from '../server/src/security/encryption.js'

console.log('===============================================================')
console.log('RUNNING SECURITY P0-1 ENCRYPTION KEY FAIL-FAST TEST SUITE')
console.log('===============================================================\n')

let failures = 0
const originalEnv = process.env.NODE_ENV
const originalKey = process.env.FIELD_ENCRYPTION_KEY

try {
  // TEST 1: production + no key -> FAIL
  console.log('[Test 1] Production mode + missing key must throw error...')
  process.env.NODE_ENV = 'production'
  delete process.env.FIELD_ENCRYPTION_KEY
  try {
    new FieldEncryptionService()
    console.error('❌ Test 1 Failed: Expected exception when initializing in production without key.')
    failures++
  } catch (err: any) {
    if (err.message.includes('FIELD_ENCRYPTION_KEY environment variable must be set in production mode')) {
      console.log('✅ Test 1 Passed: Correctly threw fail-fast error on missing production key.\n')
    } else {
      console.error('❌ Test 1 Failed: Unexpected error message:', err.message)
      failures++
    }
  }

  // TEST 2: production + malformed key -> FAIL
  console.log('[Test 2] Production mode + malformed key (short/invalid hex) must throw error...')
  process.env.NODE_ENV = 'production'
  process.env.FIELD_ENCRYPTION_KEY = 'invalid_short_key_123'
  try {
    new FieldEncryptionService()
    console.error('❌ Test 2 Failed: Expected exception when initializing with malformed key.')
    failures++
  } catch (err: any) {
    if (err.message.includes('must be a valid 64-character hexadecimal string')) {
      console.log('✅ Test 2 Passed: Correctly threw fail-fast error on malformed key.\n')
    } else {
      console.error('❌ Test 2 Failed: Unexpected error message:', err.message)
      failures++
    }
  }

  // TEST 3: production + valid key -> PASS
  console.log('[Test 3] Production mode + valid 256-bit hex key must initialize cleanly...')
  process.env.NODE_ENV = 'production'
  const validHexKey = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
  process.env.FIELD_ENCRYPTION_KEY = validHexKey
  try {
    const service = new FieldEncryptionService()
    if (service) {
      console.log('✅ Test 3 Passed: Successfully initialized with valid production key.\n')
    }
  } catch (err: any) {
    console.error('❌ Test 3 Failed with error:', err.message)
    failures++
  }

  // TEST 4: development behavior -> Fallback allowed & documented
  console.log('[Test 4] Development mode + missing key allows ephemeral fallback with warning/behavior...')
  process.env.NODE_ENV = 'development'
  delete process.env.FIELD_ENCRYPTION_KEY
  try {
    const devService = new FieldEncryptionService()
    if (devService) {
      console.log('✅ Test 4 Passed: Controlled fallback key active in development mode.\n')
    }
  } catch (err: any) {
    console.error('❌ Test 4 Failed in development mode:', err.message)
    failures++
  }

  // TEST 5: Encrypt / Decrypt round trip
  console.log('[Test 5] Encrypt/Decrypt round trip integrity check...')
  process.env.NODE_ENV = 'development'
  const testService = new FieldEncryptionService()
  const payload = { sensitiveAttribute: 'tier4_medical_or_income_data', secretVal: 42 }
  const encrypted = testService.encrypt(payload)
  const decrypted = testService.decrypt(encrypted)

  if (JSON.stringify(decrypted) === JSON.stringify(payload) && encrypted.ciphertext && encrypted.tag && encrypted.iv) {
    console.log('✅ Test 5 Passed: AES-256-GCM round trip encrypt/decrypt matches 100%.\n')
  } else {
    console.error('❌ Test 5 Failed: Decrypted payload mismatch.')
    failures++
  }
} finally {
  // Restore environment
  process.env.NODE_ENV = originalEnv
  if (originalKey) {
    process.env.FIELD_ENCRYPTION_KEY = originalKey
  } else {
    delete process.env.FIELD_ENCRYPTION_KEY
  }
}

console.log('===============================================================')
if (failures === 0) {
  console.log('✅ SECURITY P0-1 TESTS PASSED: ALL 5 TEST CASES VERIFIED.')
  console.log('===============================================================')
} else {
  console.error(`❌ SECURITY P0-1 TESTS FAILED WITH ${failures} ERRORS.`)
  console.log('===============================================================')
  process.exit(1)
}
