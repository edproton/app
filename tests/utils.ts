// tests/utils.ts

import { PrismaClient } from "../src/utils/prisma";

const prisma = new PrismaClient();

export async function cleanDatabase() {
  const tableNames = ["subjects"];

  for (const table of tableNames) {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE;`);
  }
}
