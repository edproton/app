// src/setup.ts
import { Elysia } from "elysia";
import { SubjectService } from "./services/subject.service";
import { prisma } from "./utils/prisma";
import { errorHandler } from "./utils/errors";

// Create PrismaClient instance
export const setup = new Elysia({ name: "app.setup" })
  .use(errorHandler)
  .decorate("db", prisma)
  .decorate("subjectService", new SubjectService(prisma));
