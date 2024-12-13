// src/setup.ts
import { Elysia } from "elysia";
import { PrismaClient } from "@prisma/client";
import { SubjectService } from "./services/subject.service";
import { t } from "elysia";

// Create PrismaClient instance
const prisma = new PrismaClient();

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
