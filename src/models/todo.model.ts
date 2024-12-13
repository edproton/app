// src/models/todo.model.ts
import { t } from "elysia";
import { pagedQueryModel } from "./shared";

export type Todo = typeof todo.static;
export const todo = t.Object({
  id: t.Integer({
    description: "The unique identifier for the todo item",
  }),
  title: t.String({
    description: "The title of the todo item",
  }),
  completed: t.Boolean({
    description: "Whether the todo item has been completed",
  }),
  priority: t.Enum(
    {
      low: "low",
      medium: "medium",
      high: "high",
    },
    {
      description: "The priority level of the todo item",
    }
  ),
});

export type CreateTodo = typeof createTodo.static;
export const createTodo = t.Composite([t.Omit(todo, ["id"])]);

export type GetTodosQuery = typeof getTodosQuery.static;
export const getTodosQuery = t.Composite([pagedQueryModel]);

export type UpdateTodo = typeof updateTodo.static;
export const updateTodo = t.Composite([todo]);
