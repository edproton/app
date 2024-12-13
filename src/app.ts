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
      scalarConfig: {
        // Add this configuration
        openapi: "3.0.0",
        info: {
          title: "Your API",
          version: "1.0.0",
        },
      },
    })
  )
  .use(subjectRouter);

export default app;
