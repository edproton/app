FROM oven/bun:latest

WORKDIR /app

# Install build dependencies and ca-certificates
RUN apt-get update && apt-get install -y openssl ca-certificates

# Create directory for certificates
RUN mkdir -p /etc/ssl/certs

# Copy application files
COPY package*.json bun.lockb ./
COPY prisma ./prisma/

# Install dependencies
RUN bun install

# Generate Prisma Client (with edge client)
RUN bunx prisma generate --no-engine

# Copy the rest of the application
COPY . .

EXPOSE 3000

# Environment variables for Pulse
ENV NODE_ENV=production
ENV PRISMA_CLIENT_ENGINE_TYPE=dataproxy

CMD bunx prisma migrate deploy && bun run dev