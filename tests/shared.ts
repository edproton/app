// tests/shared.ts
import { Elysia } from "elysia";
import { PrismaClient } from "@prisma/client";
import { SubjectService } from "../src/services/subject.service";

// Create test setup with test database
const prisma = new PrismaClient();

export const testSetup = new Elysia({ name: "test.setup" })
  .decorate("db", prisma)
  .decorate("subjectService", new SubjectService(prisma));
