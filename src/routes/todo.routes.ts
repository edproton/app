// src/routes/todo.routes.ts
import { Elysia, t } from "elysia";
import { TodoService } from "../services/todo.service";
import { createTodo, getTodosQuery, updateTodo } from "../models/todo.model";

export const todosRouter = new Elysia({
  prefix: "/todos",
  detail: {
    tags: ["Todos"],
  },
})
  .get(
    "/",
    ({ query }) => {
      return TodoService.findAll(query);
    },
    {
      query: getTodosQuery,
      detail: {
        summary: "Get all todos",
        description:
          "Retrieves a list of all todo items. The response includes the todo ID, title, description, completion status, and creation date.",
      },
    }
  )

  .post(
    "/",
    ({ body }) => {
      return TodoService.create(body);
    },
    {
      body: createTodo,
      detail: {
        summary: "Create a new todo",
        description:
          "Creates a new todo item. Requires a title and optionally accepts a description. Returns the created todo with its assigned ID.",
      },
    }
  )
  .guard({
    params: t.Object({
      id: t.Number(),
    }),
  })
  .get(
    "/:id",
    ({ params }) => {
      return TodoService.findById(params.id);
    },
    {
      detail: {
        summary: "Get a specific todo",
        description:
          "Retrieves a single todo item by its unique identifier. Returns a 404 error if the todo is not found.",
      },
    }
  )
  .put(
    "/:id",
    ({ params, body }) => {
      const command = {
        id: params.id,
        ...body,
      };

      return TodoService.update(command);
    },
    {
      body: t.Omit(updateTodo, ["id"]),
      detail: {
        summary: "Update an existing todo",
        description:
          "Updates a todo item by its ID. Can modify the title, description, and completion status. Returns a 404 error if the todo is not found.",
      },
    }
  )
  .delete(
    "/:id",
    ({ params }) => {
      return TodoService.delete(params.id);
    },
    {
      detail: {
        summary: "Delete a todo",
        description:
          "Permanently removes a todo item by its ID. Returns a 404 error if the todo is not found.",
      },
    }
  );
