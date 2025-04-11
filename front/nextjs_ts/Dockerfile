FROM node:18-alpine AS base
RUN echo "====================="
RUN echo "Base stage"
RUN echo "====================="

# Install dependencies only when needed
FROM base AS dependencies
RUN echo "====================="
RUN echo "Dependencies stage"
RUN echo "====================="
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /build
RUN ls -lah

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Disable telemetry
ENV NEXT_TELEMETRY_DISABLED=1

# Ensure at least one lock file exists before proceeding
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  test -f yarn.lock || test -f package-lock.json || test -f pnpm-lock.yaml || \
  (echo "No lock file found. Please provide one of yarn.lock, package-lock.json, or pnpm-lock.yaml." && exit 1)
RUN ls -lah

# Copy package and package-lock 
COPY package.json ./
COPY yarn.lock* package-lock.json* pnpm-lock.yaml* ./

# Clean install dependencies based package-lock
# Note: We also install dev deps as typeScript may be needed
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

RUN echo "====================="
RUN echo "END of Dependencies stage"
RUN echo "====================="

# Rebuild the source code only when needed
FROM base AS builder
RUN echo "====================="
RUN echo "Build stage"
RUN echo "====================="

WORKDIR /build
RUN ls -lah

# Copy files
# Use .dockerignore to avoid copying node_modules and others folders and files
COPY --from=dependencies /build/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Disable telemetry
ENV NEXT_TELEMETRY_DISABLED=1

# Build application
RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

RUN echo "====================="
RUN echo "END of Builder stage"
RUN echo "====================="

# Production image, copy all the files and run next
FROM base AS runner
RUN echo "====================="
RUN echo "Runner stage"
RUN echo "====================="

WORKDIR /dependencies
RUN dir -s 

# Environment Production
ENV NODE_ENV=production

# Copy package and package-lock 
COPY --from=builder /build/package.json .
COPY --from=builder /build/package-lock.json ./

# Clean install dependencies based package-lock
RUN npm ci --production

RUN echo "====================="
RUN echo "END of Runner stage"
RUN echo "====================="

# Final image, run next
FROM gcr.io/distroless/nodejs:14

# Mark as prod, disable telemetry, set port
ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

# Copy from build
COPY --from=builder /build/next.config.js .
COPY --from=builder /build/public/ ./public
COPY --from=builder /build/.next ./.next
COPY --from=dependencies /dependencies/node_modules ./node_modules

EXPOSE 3000

# Run app command
CMD ["node_modules/.bin/next", "start"]