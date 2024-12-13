import { Elysia } from "elysia";
import { subjectRouter } from "./routes/subject.router";
import { errorHandler } from "./utils/errors";
import swagger from "@elysiajs/swagger";
import { prisma } from "./utils/prisma";

const app = new Elysia()
  .decorate("db", prisma)
  .use(errorHandler)
  .use(
    swagger({
      documentation: {
        info: {
          title: "XCELTUTORS API",
          description: "API for managing the tutoring system",
          version: "1.0.0",
        },
        tags: [
          {
            name: "Subjects",
            description: "Operations about subjects",
          },
        ],
      },
    })
  )
  .use(subjectRouter)
  .get("/health", "Health check");

export default app;
