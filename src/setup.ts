// src/setup.ts
import { Elysia } from "elysia";
import { SubjectService } from "./services/subject.service";
import { t } from "elysia";
import { prisma } from "./utils/prisma";

// Create PrismaClient instance
export const setup = new Elysia({ name: "app.setup" })
  .decorate("db", prisma)
  .decorate("subjectService", new SubjectService(prisma))
  .model({
    createSubject: t.Object({
      name: t.String({
        minLength: 1,
        description: "The name of the subject",
      }),
    }),
    updateSubject: t.Object({
      name: t.String({
        minLength: 1,
        description: "The name of the subject",
      }),
    }),
  });
