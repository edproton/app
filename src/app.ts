// src/app.ts
import { Elysia } from "elysia";
import { PrismaClient } from "@prisma/client";
import { subjectRouter } from "./routes/subject.router";

const app = new Elysia().decorate("db", new PrismaClient()).use(subjectRouter);

export default app;
