import { withPulse } from "@prisma/extension-pulse";
import { env } from "bun";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient().$extends(
  withPulse({
    apiKey: env.PULSE_API_KEY,
  })
);

export type PrismaType = typeof prisma;
export { prisma, PrismaClient, Prisma };
