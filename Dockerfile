FROM oven/bun:latest

WORKDIR /app

# Copy application files
COPY package*.json bun.lockb ./
COPY prisma ./prisma/

# Install dependencies
RUN bun install --production

# Generate Prisma Client
RUN bunx prisma generate --no-engine

# Copy the rest of the application
COPY . .

EXPOSE 3000

ENV NODE_ENV=production

CMD bun run start