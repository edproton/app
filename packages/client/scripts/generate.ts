import { exec } from "child_process";
import { promisify } from "util";
import { join, dirname } from "path";

const execAsync = promisify(exec);

const funLog = {
  info: (msg: string) => console.log(`${msg}`),
  error: (msg: string) => console.error(`🚨 Oops! ${msg}`),
};

// Fun messages for different stages
const messages = {
  start: "🚀 Time to make some magic happen!",
  findRoot: "🔍 Detective work: searching for project root...",
  rootFound: (path: string) => `🏠 Home sweet home found at: ${path}`,
  serverStart: "🌟 Summoning the server spirits...",
  generating: "⚡ Generating client at lightning speed...",
  success: (time: number) =>
    `✨ Tada! Client generated in ${time}ms with extra sparkles!`,
  cleanup: "🧹 Cleaning up our magical mess...",
};

// Function to check if server is ready
async function isServerReady(maxWaitMs = 1000): Promise<boolean> {
  const controller = new AbortController();
  const startTime = Date.now();

  while (Date.now() - startTime < maxWaitMs) {
    try {
      const response = await fetch("http://localhost:3000/swagger/json", {
        signal: controller.signal,
        // Prevent automatic retries
        cache: "no-store",
      });
      if (response.ok) return true;
    } catch {}
    // Very short delay between attempts
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
  return false;
}

async function findRootDir(startDir: string): Promise<string> {
  let currentDir = startDir;
  while (currentDir !== "/") {
    try {
      const packageJson = await Bun.file(
        join(currentDir, "package.json")
      ).json();
      if (packageJson.workspaces) return currentDir;
    } catch (e) {}
    currentDir = dirname(currentDir);
  }
  throw new Error("🏃‍♂️ Looked everywhere but couldn't find the root!");
}

async function generate() {
  const startTime = performance.now();
  funLog.info(messages.start);
  funLog.info(messages.findRoot);

  try {
    // Find root and backend path in parallel
    const [rootDir, packageJson] = await Promise.all([
      findRootDir(process.cwd()),
      Bun.file(join(process.cwd(), "package.json")).json(),
    ]);

    funLog.info(messages.rootFound(rootDir));
    const backendPath = join(rootDir, packageJson.config?.backendEntryPoint);

    funLog.info(messages.serverStart);
    const server = Bun.spawn(["bun", backendPath], {
      stdout: null,
      stderr: null,
      cwd: rootDir,
    });

    // Wait for server to be actually ready
    await isServerReady();

    try {
      funLog.info(messages.generating);
      await execAsync("bun run openapi-ts", { cwd: process.cwd() });
      funLog.info(messages.success(Math.round(performance.now() - startTime)));
    } finally {
      funLog.info(messages.cleanup);
      server.kill();
    }
  } catch (error) {
    funLog.error(
      error instanceof Error ? error.message : "Something went wrong!"
    );
    process.exit(1);
  }
}

generate();
