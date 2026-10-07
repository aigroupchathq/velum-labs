# ============================================================================
# Dockerfile
# Universal Compatibility & Relationship-Discovery Platform
# Multi-Stage Production Container Specification (Phase 12)
# ============================================================================

# ----------------------------------------------------------------------------
# Stage 1: Build & Assets Compilation
# ----------------------------------------------------------------------------
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package.json package-lock.json ./

# Install all dependencies including devDependencies for build
RUN npm ci

# Copy full application source
COPY . .

# Build client bundle (TypeScript typecheck & Vite production bundling)
RUN npm run build

# ----------------------------------------------------------------------------
# Stage 2: Production Hardened Runtime
# ----------------------------------------------------------------------------
FROM node:22-alpine AS runner

WORKDIR /app

# Install security utilities, tini supervisor, and lightweight probe tools
RUN apk add --no-cache tini wget curl

ENV NODE_ENV=production
ENV PORT=3001

# Copy dependency manifests
COPY package.json package-lock.json ./

# Install only production dependencies and clean cache
RUN npm ci --omit=dev && npm cache clean --force

# Copy compiled frontend assets from builder stage
COPY --from=builder /app/dist ./dist

# Copy server, database migrations, types, and tools
COPY server ./server
COPY db ./db
COPY src ./src
COPY tools ./tools
COPY tsconfig*.json ./

# Create non-root ownership
RUN chown -R node:node /app

# Run as unprivileged node user
USER node

# Expose backend service port
EXPOSE 3001

# Container healthcheck using liveness probe
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3001/health/live || exit 1

# Process supervisor for signal propagation (SIGTERM/SIGINT)
ENTRYPOINT ["/sbin/tini", "--"]

# Start production service
CMD ["npm", "start"]
