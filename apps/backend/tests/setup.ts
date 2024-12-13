// tests/setup.ts
import { afterAll, beforeAll } from "bun:test";
import { $ } from "bun";

console.log("🚀 Setting up test environment...");

beforeAll(async () => {
  console.log("Starting test database...");

  try {
    // Stop any existing containers
    await $`docker compose -f docker-compose.test.yml down --remove-orphans`;

    // Start fresh containers
    await $`docker compose -f docker-compose.test.yml up -d`;

    // Give PostgreSQL some time to start
    console.log("Waiting for PostgreSQL to start...");
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Run migrations
    console.log("Running migrations...");
    await $`bunx prisma migrate deploy`;

    console.log("✅ Test environment is ready!");
  } catch (error) {
    console.error("❌ Failed to set up test environment:", error);
    process.exit(1);
  }
});

afterAll(async () => {
  console.log("Cleaning up test environment...");
  await $`docker compose -f docker-compose.test.yml down --remove-orphans`;
  console.log("✅ Test environment cleaned up!");
});
