import { Elysia } from "elysia";
import { PrismaClient } from "@prisma/client";
import { commonResponses, subjectRouter } from "./routes/subject.router";
import { errorHandler } from "./utils/errors";
import swagger from "@elysiajs/swagger";

const app = new Elysia()
  .decorate("db", new PrismaClient())
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
        components: {
          schemas: {
            Error: {
              type: "object",
              properties: {
                status: {
                  type: "integer",
                  description: "The HTTP status code",
                },
                code: {
                  type: "string",
                  description: "The error code",
                },
                message: {
                  type: "string",
                  description: "The error message",
                },
              },
            },
          },
          responses: commonResponses, // Define reusable responses
        },
      },
    })
  )
  .use(subjectRouter)
  .get("/health", "Health check");

export default app;
