# Build stage
FROM node:20-alpine AS builder

# Enable corepack for pnpm
RUN corepack enable

# Set working directory
WORKDIR /app

# Copy root configurations
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json ./

# Copy package sources
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/

# Install dependencies filtering for API and DB
RUN pnpm install --frozen-lockfile

# Build everything needed for the API
RUN pnpm --filter @shabu/database build
RUN pnpm --filter api build

# Production stage
FROM node:20-alpine AS runner
# Enable corepack for pnpm
RUN corepack enable

WORKDIR /app
ENV NODE_ENV=production

# Copy built code and required package.json files from builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/pnpm-workspace.yaml ./
COPY --from=builder /app/packages/ ./packages/
COPY --from=builder /app/apps/api/package.json ./apps/api/
COPY --from=builder /app/apps/api/dist ./apps/api/dist

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile

EXPOSE 5000

# Start API server
CMD ["pnpm", "--filter", "api", "start"]
