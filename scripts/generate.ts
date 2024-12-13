// scripts/generate.ts
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

async function generate() {
  console.log("🚀 Starting server temporarily...");

  // Start the server in a separate process
  const server = Bun.spawn(["bun", "run", "src/index.ts"], {
    stdout: null, // Silence server logs
    stderr: null,
  });

  // Wait for server to be ready
  await new Promise((resolve) => setTimeout(resolve, 1000));

  try {
    console.log("⚙️  Generating client...");
    await execAsync("bun run openapi-ts");
    console.log("✨ Client generated successfully!");
  } catch (error) {
    console.error("Failed to generate client:", error);
    process.exit(1);
  } finally {
    // Cleanup: Kill the server
    server.kill();
  }

  process.exit(0);
}

generate();
