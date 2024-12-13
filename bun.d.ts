// bun.d.ts
declare module "bun" {
  interface Env {
    NODE_ENV: "development" | "test" | "production";
    DATABASE_URL: string;
    PORT?: string;
  }
}
