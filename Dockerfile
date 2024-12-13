FROM oven/bun:latest

WORKDIR /app

# Install build dependencies required for Prisma Client
RUN apt-get update && apt-get install -y openssl

COPY package*.json bun.lockb ./
COPY prisma ./prisma/

# Install dependencies
RUN bun install

# Generate Prisma Client
RUN bunx prisma generate

# Copy the rest of the application
COPY . .

EXPOSE 3000

# Add wait-for script if you need to wait for database
CMD bunx prisma migrate deploy && bun run dev