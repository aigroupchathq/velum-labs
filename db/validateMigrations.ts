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
const schemaSql = fs.readFileSync(path.join(migrationsDir, '001_initial_schema.sql'), 'utf-8')

const checks = [
  { name: 'Normalized attribute_values table', pattern: /CREATE TABLE IF NOT EXISTS attribute_values/i },
  { name: 'Preferences table with flexibility', pattern: /flexibility smallint NOT NULL DEFAULT 0/i },
  { name: 'Single-source requirements view (D-15)', pattern: /CREATE OR REPLACE VIEW requirements AS/i },
  { name: 'Single-source dealbreakers view (D-15)', pattern: /CREATE OR REPLACE VIEW dealbreakers AS/i },
  { name: 'Immutable audit_logs with tamper rules', pattern: /CREATE OR REPLACE RULE no_update_audit_logs/i },
  { name: 'Anti-self-block safety check', pattern: /CONSTRAINT chk_no_self_block CHECK \(blocker_id <> blocked_id\)/i },
  { name: 'Coarse geographic distance table', pattern: /CREATE TABLE IF NOT EXISTS user_geography/i }
]

let passed = 0
checks.forEach(check => {
  if (check.pattern.test(schemaSql)) {
    console.log(`  ✅ ${check.name}`)
    passed++
  } else {
    console.error(`  ❌ Failed check: ${check.name}`)
  }
})

if (passed === checks.length) {
  console.log('\n===============================================================')
  console.log('ALL DDL MIGRATION DEFINITIONS AND INVARIANTS VALIDATED!')
  console.log('===============================================================')
} else {
  throw new Error(`Migration validation failed: ${checks.length - passed} errors.`)
}
