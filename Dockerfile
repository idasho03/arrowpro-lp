# syntax=docker/dockerfile:1

# ==============================================================================
# Base stage: Node.js 22 Alpine
# ==============================================================================
FROM node:22-alpine AS base

WORKDIR /app

# ==============================================================================
# Dependencies stage: Install npm packages
# ==============================================================================
FROM base AS deps

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies with cache mount for faster rebuilds
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# ==============================================================================
# Development stage: Run Parcel dev server
# ==============================================================================
FROM deps AS dev

# Copy source files
COPY . .

# Expose port for dev server
EXPOSE 1234 1235

# Default command (can be overridden in compose.yml)
CMD ["npm", "run", "dev"]

# ==============================================================================
# Build stage: Generate static files
# ==============================================================================
FROM deps AS build

# Copy source files
COPY . .

# Run Parcel build
RUN npm run build

# ==============================================================================
# Output stage: Extract build artifacts only
# ==============================================================================
FROM scratch AS artifacts

COPY --from=build /app/static-output /static-output
