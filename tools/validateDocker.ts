// ============================================================================
// tools/validateDocker.ts
// Universal Compatibility Platform: Production Container Infrastructure Validator (Phase 12)
// ============================================================================

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

console.log('===============================================================')
console.log('PHASE 12: PRODUCTION DOCKER & CONTAINER INFRASTRUCTURE VALIDATOR')
console.log('===============================================================')

const dockerfilePath = path.join(projectRoot, 'Dockerfile')
const composePath = path.join(projectRoot, 'docker-compose.yml')
const dockerignorePath = path.join(projectRoot, '.dockerignore')

if (!fs.existsSync(dockerfilePath)) throw new Error('Missing Dockerfile')
if (!fs.existsSync(composePath)) throw new Error('Missing docker-compose.yml')
if (!fs.existsSync(dockerignorePath)) throw new Error('Missing .dockerignore')

const dockerfileContent = fs.readFileSync(dockerfilePath, 'utf-8')
const composeContent = fs.readFileSync(composePath, 'utf-8')
const dockerignoreContent = fs.readFileSync(dockerignorePath, 'utf-8')

const dockerfileChecks = [
  { name: 'Multi-stage builder stage', pattern: /FROM\s+node:[0-9]+-alpine\s+AS\s+builder/i },
  { name: 'Multi-stage runner stage', pattern: /FROM\s+node:[0-9]+-alpine\s+AS\s+runner/i },
  { name: 'Clean dependency installation (npm ci)', pattern: /npm ci/i },
  { name: 'Production build step', pattern: /npm run build/i },
  { name: 'Non-root user execution (USER node)', pattern: /USER node/i },
  { name: 'Tini process supervisor entrypoint', pattern: /ENTRYPOINT\s+\[.*tini.*\]/i },
  { name: 'Container orchestration healthcheck', pattern: /HEALTHCHECK/i },
  { name: 'Production start command', pattern: /CMD\s+\["npm",\s*"start"\]/i },
]

console.log('\nValidating Dockerfile Invariants:')
dockerfileChecks.forEach((check) => {
  if (check.pattern.test(dockerfileContent)) {
    console.log(`  ✅ ${check.name}`)
  } else {
    throw new Error(`Dockerfile validation failed: ${check.name}`)
  }
})

const composeChecks = [
  { name: 'Application service defined', pattern: /app:/i },
  { name: 'Database service defined', pattern: /db:/i },
  { name: 'Database health condition dependency', pattern: /condition:\s*service_healthy/i },
  { name: 'Isolated bridge network', pattern: /modest_net:/i },
  { name: 'Persistent database volume', pattern: /postgres_data:/i },
  { name: 'Automated migration mounting', pattern: /\/docker-entrypoint-initdb\.d/i },
]

console.log('\nValidating docker-compose.yml Invariants:')
composeChecks.forEach((check) => {
  if (check.pattern.test(composeContent)) {
    console.log(`  ✅ ${check.name}`)
  } else {
    throw new Error(`docker-compose.yml validation failed: ${check.name}`)
  }
})

const dockerignoreChecks = [
  { name: 'Ignore node_modules', pattern: /node_modules/i },
  { name: 'Ignore local dist', pattern: /dist/i },
  { name: 'Ignore git directory', pattern: /\.git/i },
  { name: 'Ignore environment secrets', pattern: /\.env/i },
]

console.log('\nValidating .dockerignore Invariants:')
dockerignoreChecks.forEach((check) => {
  if (check.pattern.test(dockerignoreContent)) {
    console.log(`  ✅ ${check.name}`)
  } else {
    throw new Error(`.dockerignore validation failed: ${check.name}`)
  }
})

console.log('\n===============================================================')
console.log('ALL PHASE 12 PRODUCTION CONTAINER INVARIANTS VALIDATED 100%!')
console.log('===============================================================')
