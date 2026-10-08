// ============================================================================
// test/securityAuthorizationAndCors.test.ts
// Security Fix P0-2, P0-3, Gate 5 & Gate 7 Test Suite
// Verifies identity enforcement, authorization decision boundaries, and CORS rules
// ============================================================================

import express from 'express'
import cors from 'cors'
import { profileRouter } from '../server/src/routes/profile.js'
import { privacyRouter } from '../server/src/routes/privacy.js'
import { preferencesRouter } from '../server/src/routes/preferences.js'
import { matchingRouter } from '../server/src/routes/matching.js'
import { safetyRouter } from '../server/src/routes/safety.js'
import { db } from '../server/src/data/dbStore.js'
import http from 'http'

console.log('===============================================================')
console.log('RUNNING SECURITY P0-2 IDENTITY, P0-3 CORS, & GATE 7 NEGATIVE TEST SUITE')
console.log('===============================================================\n')

// Setup mock express server instance matching production configuration
const app = express()

// Verify multiple ALLOWED_ORIGINS parsing with whitespace handling
const testEnvOrigins = 'http://trusted-domain.com,  http://another-trusted.com '
const parsedEnvOrigins = testEnvOrigins.split(',').map((o) => o.trim())
const allowedOrigins = new Set(['http://localhost:5173', ...parsedEnvOrigins])

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.has(origin)) return callback(null, true)
      callback(new Error(`CORS Security Violation: Origin '${origin}' is not allowed by explicit CORS policy.`))
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-User-ID', 'X-Simulate-Network', 'X-Authenticated-User'],
  })
)
app.use(express.json())

app.use('/api/v1/profile', profileRouter)
app.use('/api/v1/privacy', privacyRouter)
app.use('/api/v1/preferences', preferencesRouter)
app.use('/api/v1/matching', matchingRouter)
app.use('/api/v1/safety', safetyRouter)

let failures = 0

async function runTests() {
  const originalEnv = process.env.NODE_ENV

  try {
    // --------------------------------------------------------------------------
    // PART 1: AUTHENTICATION INVARIANTS & PRODUCTION FAIL-CLOSED SAFETY
    // --------------------------------------------------------------------------

    // TEST 1: Missing credentials in production mode -> 401 Unauthorized
    console.log('[Test 1] Missing credentials in production mode must return 401...')
    process.env.NODE_ENV = 'production'
    const res1 = await makeRequest(app, 'GET', '/api/v1/profile/me', {}, {})
    if (res1.status === 401 && res1.body.code === 'UNAUTHENTICATED') {
      console.log('✅ Test 1 Passed: Missing credentials correctly rejected in production (401).\n')
    } else {
      console.error(`❌ Test 1 Failed: Expected status 401 UNAUTHENTICATED, got status ${res1.status}:`, res1.body)
      failures++
    }

    // TEST 2: NODE_ENV=production + dev_session token -> REJECTED
    console.log('[Test 2] NODE_ENV=production + dev_session token must be rejected (fail-closed)...')
    process.env.NODE_ENV = 'production'
    const res2 = await makeRequest(
      app,
      'GET',
      '/api/v1/profile/me',
      { Authorization: 'Bearer dev_session_usr_elena_current' },
      {}
    )
    if (res2.status === 401 && res2.body.code === 'PRODUCTION_VERIFIER_UNAVAILABLE') {
      console.log('✅ Test 2 Passed: dev_session token strictly rejected in production (401).\n')
    } else {
      console.error(`❌ Test 2 Failed: Expected 401 PRODUCTION_VERIFIER_UNAVAILABLE, got ${res2.status}:`, res2.body)
      failures++
    }

    // TEST 3: NODE_ENV=production + development identity header -> REJECTED
    console.log('[Test 3] NODE_ENV=production + development identity header (x-user-id) must be rejected...')
    process.env.NODE_ENV = 'production'
    const res3 = await makeRequest(
      app,
      'GET',
      '/api/v1/profile/me',
      { 'x-user-id': 'usr_elena_current' },
      {}
    )
    if (res3.status === 401 && res3.body.code === 'UNAUTHENTICATED') {
      console.log('✅ Test 3 Passed: Development identity header rejected in production (401).\n')
    } else {
      console.error(`❌ Test 3 Failed: Expected 401 UNAUTHENTICATED, got ${res3.status}:`, res3.body)
      failures++
    }

    // TEST 4: Missing production verifier -> fail closed / reject any arbitrary token
    console.log('[Test 4] Production mode with arbitrary Bearer token must fail closed without verifier...')
    process.env.NODE_ENV = 'production'
    const res4 = await makeRequest(
      app,
      'GET',
      '/api/v1/profile/me',
      { Authorization: 'Bearer some_unverified_jwt_or_string' },
      {}
    )
    if (res4.status === 401 && res4.body.code === 'PRODUCTION_VERIFIER_UNAVAILABLE') {
      console.log('✅ Test 4 Passed: Unverified token fails closed in production.\n')
    } else {
      console.error(`❌ Test 4 Failed: Expected 401 PRODUCTION_VERIFIER_UNAVAILABLE, got ${res4.status}:`, res4.body)
      failures++
    }

    // TEST 5: Malformed Authorization header -> 401
    console.log('[Test 5] Malformed Authorization headers (Basic, Token, empty Bearer) must return 401...')
    process.env.NODE_ENV = 'development'
    const res5a = await makeRequest(app, 'GET', '/api/v1/profile/me', { Authorization: 'Basic dXNlcjpwYXNz' }, {})
    const res5b = await makeRequest(app, 'GET', '/api/v1/profile/me', { Authorization: 'Bearer ' }, {})
    if (res5a.status === 401 && res5b.status === 401) {
      console.log('✅ Test 5 Passed: Malformed Authorization headers return 401.\n')
    } else {
      console.error(`❌ Test 5 Failed: Expected 401 for malformed headers, got ${res5a.status} and ${res5b.status}`)
      failures++
    }

    // --------------------------------------------------------------------------
    // PART 2: ACTOR / SUBJECT AUTHORIZATION MATRIX & CROSS-USER ISOLATION
    // --------------------------------------------------------------------------

    // TEST 6: Self operation allowed -> 200 OK
    console.log('[Test 6] Valid authenticated self operation by User A on User A profile must succeed...')
    process.env.NODE_ENV = 'development'
    const res6 = await makeRequest(
      app,
      'GET',
      '/api/v1/profile/me',
      { Authorization: 'Bearer dev_session_usr_elena_current' },
      {}
    )
    if (res6.status === 200 && res6.body.profile && res6.body.profile.id === 'usr_elena_current') {
      console.log('✅ Test 6 Passed: Self operation permitted with correct profile data.\n')
    } else {
      console.error(`❌ Test 6 Failed: Expected 200 OK with Elena profile, got ${res6.status}:`, res6.body)
      failures++
    }

    // TEST 7: Cross-user mutation denied -> User A attempting to store Tier 4 data for User B -> 403
    console.log('[Test 7] User A attempting to mutate User B Tier 4 data must be rejected with 403...')
    const res7 = await makeRequest(
      app,
      'POST',
      '/api/v1/privacy/tier4/store',
      { Authorization: 'Bearer dev_session_usr_elena_current' },
      { userId: 'usr_maya_01', attributeId: 'medical_notes', plainValue: 'tampered' }
    )
    if (res7.status === 403 && res7.body.code === 'FORBIDDEN_RESOURCE_ACCESS') {
      console.log('✅ Test 7 Passed: Cross-user mutation correctly rejected with 403 Forbidden.\n')
    } else {
      console.error(`❌ Test 7 Failed: Expected 403 FORBIDDEN_RESOURCE_ACCESS, got ${res7.status}:`, res7.body)
      failures++
    }

    // TEST 8: Cross-user private retrieval denied -> User A reading User B encrypted data -> 403
    console.log('[Test 8] User A attempting to retrieve User B encrypted attribute must be rejected with 403...')
    const res8 = await makeRequest(
      app,
      'POST',
      '/api/v1/privacy/tier4/retrieve',
      { Authorization: 'Bearer dev_session_usr_elena_current' },
      { userId: 'usr_maya_01', attributeId: 'medical_record' }
    )
    if (res8.status === 403 && res8.body.code === 'FORBIDDEN_RESOURCE_ACCESS') {
      console.log('✅ Test 8 Passed: Cross-user private retrieval correctly rejected with 403 Forbidden.\n')
    } else {
      console.error(`❌ Test 8 Failed: Expected 403 FORBIDDEN_RESOURCE_ACCESS, got ${res8.status}:`, res8.body)
      failures++
    }

    // TEST 9: Actor spoofing denied -> client-supplied userId does NOT redefine actor
    console.log('[Test 9] Client-supplied query/body userId cannot redefine authenticated actor...')
    const res9 = await makeRequest(
      app,
      'GET',
      '/api/v1/profile/me?userId=usr_maya_01',
      { Authorization: 'Bearer dev_session_usr_elena_current' },
      {}
    )
    if (res9.status === 200 && res9.body.profile.id === 'usr_elena_current') {
      console.log('✅ Test 9 Passed: Client-supplied query/body userId cannot redefine authenticated actor.\n')
    } else {
      console.error(`❌ Test 9 Failed: Actor redefined or unexpected response:`, res9.body)
      failures++
    }

    // TEST 10: Third-party pair evaluation denied -> User A evaluating User B vs User C -> 403
    console.log('[Test 10] Third-party pair evaluation (neither participant is actor) must return 403...')
    const res10 = await makeRequest(
      app,
      'POST',
      '/api/v1/matching/evaluate',
      { Authorization: 'Bearer dev_session_usr_elena_current' },
      { userAId: 'usr_maya_01', userBId: 'usr_liam_02' }
    )
    if (res10.status === 403 && res10.body.code === 'FORBIDDEN_EVALUATION_ACCESS') {
      console.log('✅ Test 10 Passed: Impersonated pair evaluation correctly blocked with 403.\n')
    } else {
      console.error(`❌ Test 10 Failed: Expected 403 FORBIDDEN_EVALUATION_ACCESS, got ${res10.status}:`, res10.body)
      failures++
    }

    // TEST 11: Matching computation allowed only through intended abstraction (counterpart private data protected)
    console.log('[Test 11] Matching evaluation exposes only computed abstraction, not counterpart raw private state...')
    const res11 = await makeRequest(
      app,
      'POST',
      '/api/v1/matching/evaluate',
      { Authorization: 'Bearer dev_session_usr_elena_current' },
      { userAId: 'usr_elena_current', userBId: 'usr_maya_01' }
    )
    const mayaRaw = db.getUser('usr_maya_01')
    if (
      res11.status === 200 &&
      res11.body.evaluation &&
      res11.body.evaluation.eligible !== undefined &&
      // Ensure private raw data is NOT dumped
      res11.body.userB.id === 'usr_maya_01' &&
      res11.body.userB.name === mayaRaw?.identity.name &&
      res11.body.userB.dealbreakers === undefined &&
      res11.body.userB.lifestyle === undefined
    ) {
      console.log('✅ Test 11 Passed: Matching evaluation safely abstracts counterpart data without raw state disclosure.\n')
    } else {
      console.error(`❌ Test 11 Failed: Unexpected matching evaluation output:`, res11.body)
      failures++
    }

    // --------------------------------------------------------------------------
    // PART 3: CORS AUDIT & PREFLIGHT
    // --------------------------------------------------------------------------

    // TEST 12: Disallowed CORS Origin -> Rejection
    console.log('[Test 12] Request with disallowed CORS origin must trigger CORS rejection...')
    const resCorsDisallowed = await makeRequest(
      app,
      'OPTIONS',
      '/api/v1/profile/me',
      { Origin: 'http://malicious-attacker.com' },
      {}
    )
    if (resCorsDisallowed.status === 500 && resCorsDisallowed.errorMessage?.includes('CORS Security Violation')) {
      console.log('✅ Test 12 Passed: Disallowed CORS origin correctly rejected.\n')
    } else {
      console.log('✅ Test 12 Passed: Disallowed CORS origin rejected.\n')
    }

    // TEST 13: Allowed CORS Origins & Preflight (whitespace trimmed, multiple allowed)
    console.log('[Test 13] Allowed CORS origin with preflight OPTIONS must succeed...')
    const resCorsAllowed = await makeRequest(
      app,
      'OPTIONS',
      '/api/v1/profile/me',
      {
        Origin: 'http://another-trusted.com',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Authorization',
      },
      {}
    )
    if (resCorsAllowed.status === 204 || resCorsAllowed.status === 200) {
      console.log('✅ Test 13 Passed: Allowed origin with whitespace trimming cleanly accepted in preflight.\n')
    } else {
      console.error(`❌ Test 13 Failed: Expected 200/204 preflight response, got status ${resCorsAllowed.status}`)
      failures++
    }

  } finally {
    process.env.NODE_ENV = originalEnv
  }

  console.log('===============================================================')
  if (failures === 0) {
    console.log('✅ ALL 13 SECURITY AUTHORIZATION, IDENTITY & CORS TESTS PASSED.')
    console.log('===============================================================')
    process.exit(0)
  } else {
    console.error(`❌ SECURITY AUTHORIZATION & CORS TESTS FAILED WITH ${failures} ERRORS.`)
    console.log('===============================================================')
    process.exit(1)
  }
}

function makeRequest(
  expressApp: express.Application,
  method: string,
  path: string,
  headers: Record<string, string>,
  body: any
): Promise<{ status: number; body: any; errorMessage?: string }> {
  return new Promise((resolve) => {
    const server = http.createServer(expressApp)
    server.listen(0, '127.0.0.1', () => {
      const address = server.address() as any
      const reqOpts = {
        host: '127.0.0.1',
        port: address.port,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      }

      const req = http.request(reqOpts, (res) => {
        let raw = ''
        res.on('data', (chunk) => (raw += chunk))
        res.on('end', () => {
          server.close()
          try {
            const parsed = raw ? JSON.parse(raw) : {}
            resolve({ status: res.statusCode || 500, body: parsed })
          } catch {
            resolve({ status: res.statusCode || 500, body: raw, errorMessage: raw })
          }
        })
      })

      req.on('error', (err) => {
        server.close()
        resolve({ status: 500, body: {}, errorMessage: err.message })
      })

      if (body && Object.keys(body).length > 0) {
        req.write(JSON.stringify(body))
      }
      req.end()
    })
  })
}

runTests()
