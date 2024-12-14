# This file creates our application container - like a specialized shipping box
# that includes exactly what we need to run our app anywhere
# Each stage builds on the previous one, but only keeps what it needs
# It gets our code ready to be run by Docker Compose services later

# !IMPORTANT: Never run production as root user
# TODO: Add health checks for production container
# TODO: Consider adding container memory limits


# --- Base Stage ---
# Start with Alpine Linux because it's tiny (5MB) but has everything we need
# !IMPORTANT: Keep base image updated for security patches
FROM node:20-alpine AS base
# Add basic Linux tools that Node.js needs to run properly on Alpine
# libc6-compat is required for Node.js native modules to work
RUN apk add --no-cache libc6-compat openssl
# Set /app as our working directory inside the container
# This is like saying "cd /app" in Linux - all future commands run here
WORKDIR /app


# --- Dependencies Stage ---
# Start fresh from base, focusing only on package installation
# !IMPORTANT: package-lock.json must exist (created by running 'npm install' locally first)
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY prisma ./prisma
COPY tsconfig.json ./
# Add memory limits to npm ci
ENV NODE_OPTIONS="--max_old_space_size=384"
RUN npm ci --no-audit --no-fund --maxsockets=1


# --- Development Stage ---
# Create a development environment with hot reloading and debugging
# !IMPORTANT: This stage should never be used in production
FROM base AS development
WORKDIR /app

# Copy only what's needed for development
COPY package.json package-lock.json ./
COPY prisma ./prisma
COPY tsconfig.json ./

# Install dependencies without memory limits
RUN npm install

# Generate Prisma client
RUN npx prisma generate

# Development specific settings
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV development
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Use Turbopack for faster compilation (experimental but much faster)
CMD ["npm", "run", "dev", "--", "--turbo"]


# --- Builder Stage ---
# This stage creates an optimized production build
# !IMPORTANT: Ensure all environment variables are set before building
FROM base AS builder
WORKDIR /app
# Copy node_modules and all source code
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Aggressive memory optimization
ENV NODE_OPTIONS="--max_old_space_size=512"
ENV NEXT_TELEMETRY_DISABLED 1

# Clean everything possible before build
RUN npm cache clean --force
RUN rm -rf .next
RUN rm -rf node_modules/.cache

# Install any missing dependencies with memory limits
ENV NODE_OPTIONS="--max_old_space_size=384"
RUN npm install --no-audit --no-fund --maxsockets=1

# Generate Prisma client with minimal memory
RUN NODE_OPTIONS='--max_old_space_size=384' npx prisma generate

# Build in parts with memory optimization
RUN npm run build:micro

# Debug: List contents after build
RUN echo "Contents after build:" && ls -la
RUN echo "Contents of .next:" && ls -la .next/
RUN echo "Contents of .next/standalone (if exists):" && ls -la .next/standalone/ || echo "No standalone directory"


# --- Production Stage ---
# Final stage: minimal image for running in production
# !IMPORTANT: This stage must remain as small as possible for security
FROM base AS production
WORKDIR /app
ENV NODE_ENV production
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy prisma directory and generated client
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy package files for Prisma
COPY --chown=nextjs:nodejs package.json package-lock.json ./

# Install only the Prisma CLI (minimal install)
RUN npm install --no-save prisma

# Generate Prisma client
RUN npx prisma generate

# Debug: List contents
RUN echo "Contents of /app:" && ls -la
RUN echo "Contents of /app/.next (if exists):" && ls -la .next/ || echo "No .next directory"

# Switch to non-root user
USER nextjs

# Make port 3000 available
EXPOSE 3000

# Start with optimized memory
ENV NODE_OPTIONS="--max_old_space_size=512"
CMD ["node", "server.js"]
