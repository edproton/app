import { PrismaClient } from "@prisma/client/edge";
import { withPulse } from "@prisma/extension-pulse";
import { env } from "bun";
import { Prisma } from "@prisma/client";

const prisma = new PrismaClient().$extends(
  withPulse({
    apiKey: env.PULSE_API_KEY,
  })
);

export type PrismaType = typeof prisma;
export { prisma, PrismaClient, Prisma };
