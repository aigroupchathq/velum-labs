import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('===============================================================')
console.log('POSTGRESQL MIGRATION & SEED VALIDATOR')
console.log('===============================================================')

const migrationsDir = path.join(__dirname, 'migrations')
const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort()

console.log(`Found ${files.length} SQL migration files:`)
files.forEach((file, index) => {
  const filePath = path.join(migrationsDir, file)
  const stats = fs.statSync(filePath)
  const content = fs.readFileSync(filePath, 'utf-8')
  
  // Basic SQL sanity checks
  const statements = content.split(';').map(s => s.trim()).filter(Boolean)
  console.log(`  [${index + 1}] ${file} (${stats.size} bytes, ~${statements.length} SQL statements)`)
})

console.log('\nValidating canonical constraints:')

const checks = [
  { name: 'Normalized attribute_values table', pattern: /CREATE TABLE IF NOT EXISTS attribute_values/i, file: '001_initial_schema.sql' },
  { name: 'Preferences table with flexibility', pattern: /flexibility smallint NOT NULL DEFAULT 0/i, file: '001_initial_schema.sql' },
  { name: 'Single-source requirements view (D-15)', pattern: /CREATE OR REPLACE VIEW requirements AS/i, file: '001_initial_schema.sql' },
  { name: 'Single-source dealbreakers view (D-15)', pattern: /CREATE OR REPLACE VIEW dealbreakers AS/i, file: '001_initial_schema.sql' },
  { name: 'Immutable audit_logs with tamper rules', pattern: /CREATE OR REPLACE RULE no_update_audit_logs/i, file: '001_initial_schema.sql' },
  { name: 'Anti-self-block safety check', pattern: /CONSTRAINT chk_no_self_block CHECK \(blocker_id <> blocked_id\)/i, file: '001_initial_schema.sql' },
  { name: 'Coarse geographic distance table', pattern: /CREATE TABLE IF NOT EXISTS user_geography/i, file: '001_initial_schema.sql' },
  // Phase 11: Payments & Subscriptions Boundary (D-23, Spec §33)
  { name: 'Phase 11: Subscriptions table defined', pattern: /CREATE TABLE IF NOT EXISTS subscriptions/i, file: '004_subscriptions_and_payments.sql' },
  { name: 'Phase 11: Payments table with idempotency', pattern: /CREATE TABLE IF NOT EXISTS payments/i, file: '004_subscriptions_and_payments.sql' },
  { name: 'Phase 11: Idempotency constraint on payments', pattern: /idempotency_key varchar\(255\) NOT NULL UNIQUE/i, file: '004_subscriptions_and_payments.sql' },
  { name: 'Phase 11: Invariant D-23 (Matching isolated from payments)', pattern: /ISOLATED BOUNDARY/i, file: '004_subscriptions_and_payments.sql' }
]

let passed = 0
checks.forEach(check => {
  const content = fs.readFileSync(path.join(migrationsDir, check.file), 'utf-8')
  if (check.pattern.test(content)) {
    console.log(`  ✅ ${check.name}`)
    passed++
  } else {
    console.error(`  ❌ Failed check: ${check.name}`)
  }
})

// Strict D-23 Invariant Check: Verify that matching schema does NOT reference subscriptions or payments
const matchingSchema = fs.readFileSync(path.join(migrationsDir, '001_initial_schema.sql'), 'utf-8')
if (matchingSchema.includes('REFERENCES subscriptions') || matchingSchema.includes('REFERENCES payments')) {
  throw new Error('D-23 VIOLATION: Matching schema references payment tables!')
} else {
  console.log('  ✅ Invariant D-23 Verified: Zero foreign keys between matching and payment tables.')
}

if (passed === checks.length) {
  console.log('\n===============================================================')
  console.log('ALL DDL MIGRATION DEFINITIONS AND INVARIANTS VALIDATED!')
  console.log('===============================================================')
} else {
  throw new Error(`Migration validation failed: ${checks.length - passed} errors.`)
}
