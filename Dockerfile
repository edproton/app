FROM oven/bun:latest

WORKDIR /app

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

CMD bunx prisma migrate deploy && bun run dev