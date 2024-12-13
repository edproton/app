// src/services/todo.service.ts
import { NotFoundError } from "elysia";
import {
  CreateTodo,
  GetTodosQuery,
  Todo,
  UpdateTodo,
} from "../models/todo.model";
import { createPagedResponse, PagedResponse } from "../models/shared";

const database: Todo[] = [
  {
    id: 1,
    title: "Buy groceries",
    completed: false,
    priority: "medium",
  },
];

export abstract class TodoService {
  static async findAll(query: GetTodosQuery): Promise<PagedResponse<Todo>> {
    const { page = 1, limit = 10 } = query;

    let filteredTodos = [...database];

    const totalItems = filteredTodos.length;
    const startIndex = (page - 1) * limit;
    const paginatedData = filteredTodos.slice(startIndex, startIndex + limit);

    return createPagedResponse(paginatedData, totalItems, page, limit);
  }

  static async findById(id: number): Promise<Todo> {
    const todo = database.find((todo) => todo.id === id);
    if (!todo) {
      throw new NotFoundError(`Todo with id ${id}`);
    }

    return todo;
  }

  static async create(command: CreateTodo): Promise<Todo> {
    const todo = {
      id: database.length + 1,
      ...command,
    };

    database.push(todo);
    return todo;
  }

  static async update(command: UpdateTodo): Promise<Todo> {
    const todo = database.find((todo) => todo.id === command.id);
    if (!todo) {
      throw new NotFoundError(`Todo with id ${command.id}`);
    }

    Object.assign(todo, command);
    return todo;
  }

  static async delete(id: number): Promise<void> {
    const index = database.findIndex((todo) => todo.id === id);
    if (index === -1) {
      throw new NotFoundError(`Todo with id ${id}`);
    }

    database.splice(index, 1);
  }
}
