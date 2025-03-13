# Build stage
FROM node:20.10-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json pnpm-lock.yaml ./

# Install pnpm and dependencies
RUN npm i -g pnpm && \
    pnpm i

# Copy source code
COPY . .

# Build the application
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

ARG APP_PASSWORD
ENV APP_PASSWORD=${APP_PASSWORD}

ARG OPENAI_API_KEY
ENV OPENAI_API_KEY=${OPENAI_API_KEY}

RUN pnpm build

# Production stage
FROM node:20.10-alpine

WORKDIR /app

# Copy package files
COPY package*.json pnpm-lock.yaml ./

# Install pnpm and production dependencies only
RUN npm i -g pnpm && \
    pnpm i --prod

# Copy built application from builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000

# Use production start command
CMD ["pnpm", "start"]
