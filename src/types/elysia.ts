// src/types/elysia.ts
import { PrismaClient } from "@prisma/client";

declare module "elysia" {
  interface ElysiaContext {
    db: PrismaClient;
  }
}
