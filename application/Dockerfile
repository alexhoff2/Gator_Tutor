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
RUN apk add --no-cache libc6-compat
# Set /app as our working directory inside the container
# This is like saying "cd /app" in Linux - all future commands run here
WORKDIR /app


# --- Dependencies Stage ---
# Start fresh from base, focusing only on package installation
# !IMPORTANT: package-lock.json must exist (created by running 'npm install' locally first)
# We use 'npm ci' instead of 'npm install' because:
# 1. It's faster for clean installs
# 2. It's more reliable (uses exact versions)
# 3. It fails if package-lock.json and package.json don't match
# 4. It never updates package-lock.json
FROM base AS deps
# Copy package files from our computer into the container
# We only copy what's needed for installing packages to use Docker's cache better
COPY package.json package-lock.json ./
COPY prisma ./prisma
COPY tsconfig.json ./
# Install exact versions of our dependencies
# npm ci is like npm install but stricter and faster for containers
RUN npm ci


# --- Development Stage ---
# Create a development environment with hot reloading and debugging
# !IMPORTANT: This stage should never be used in production
FROM base AS development
WORKDIR /app
# Copy node_modules from deps stage instead of installing again
# --from=deps means "grab this from the deps stage we built earlier"
COPY --from=deps /app/node_modules ./node_modules
# Copy everything from our project directory (.) into the container (.)
# This includes all source code, configuration files, etc.
# TODO: This is probably not needed for development because docker compose mounts our project directory to /app
COPY . .
# Generate Prisma database client code
RUN npx prisma generate
# Tell the container it will listen on port 3000
# 0.0.0.0 means "listen on all network interfaces" - needed for Docker
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"
EXPOSE 3000
# Start Next.js in development mode with hot reloading
CMD ["npm", "run", "dev"]


# --- Builder Stage ---
# This stage creates an optimized production build
# !IMPORTANT: Ensure all environment variables are set before building
FROM base AS builder
WORKDIR /app
# Copy node_modules and all source code, just like in development
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Generate Prisma client for database access in production
# TODO: This might need to run after volume mount instead? idk
RUN npx prisma generate
# Set NODE_ENV so Next.js knows to create an optimized build
ENV NODE_ENV production
# Create a production-ready version of our application
# This removes development code and optimizes everything
RUN npm run build


# --- Production Stage ---
# Final stage: minimal image for running in production
# !IMPORTANT: This stage must remain as small as possible for security
FROM base AS production
WORKDIR /app
# Configure for production mode and set network options
ENV NODE_ENV production
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"
# Create a non-root user for security
# This prevents hackers from getting full access if they break in
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
# Copy only the built files we need to run the app
# public: Static files like images
# .next/standalone: The compiled application
# .next/static: Static assets Next.js needs
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
# Switch to non-root user for security
USER nextjs
# Make port 3000 available to the outside world
EXPOSE 3000
# Start the production server
# TODO: Add graceful shutdown handling
CMD ["node", "server.js"]
