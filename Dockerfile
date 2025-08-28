# -------------------------------
# Stage 1: Build
# -------------------------------
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the NestJS app
RUN npm run build

# -------------------------------
# Stage 2: Production
# -------------------------------
FROM node:20-alpine

WORKDIR /app

# Copy package.json and lock file for installing only prod deps
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy built app and Prisma files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Expose API port
EXPOSE 3000

# Run Prisma migrations and then start the app
CMD npx prisma migrate deploy && node dist/main.js

