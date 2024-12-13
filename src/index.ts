import { Context, Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { todosRouter } from "./routes/todo.routes";
import { errorHandler } from "./utils/errors";
import { Env } from "bun";

export const app = new Elysia()
  .use(
    swagger({
      documentation: {
        info: {
          title: "XCELTUTORS API",
          version: "1.0.0",
          description: "API documentation for the XCELTUTORS API",
        },
        tags: [
          {
            name: "Todos",
            description:
              "Endpoints for managing todo items - including creating, reading, updating, and deleting tasks",
          },
        ],
      },
      autoDarkMode: true,
    })
  )
  .use(errorHandler)
  .use(todosRouter)
  .get("/", () => "Hello from Elysia 🦊");

export default {
  fetch: (request: Request, env: Env, ctx: Context) => {
    return app.decorate({ env, ctx }).handle(request);
  },
};
