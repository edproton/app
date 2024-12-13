// tests/todo.test.ts
import { describe, expect, it, beforeAll } from "bun:test";
import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { todosRouter } from "../src/routes/todo.routes";
import { errorHandler } from "../src/utils/errors";

const createApp = () => {
  return new Elysia()
    .use(
      swagger({
        documentation: {
          info: {
            title: "Test API",
            version: "1.0.0",
          },
        },
      })
    )
    .use(errorHandler)
    .use(todosRouter);
};

describe("Todo API", () => {
  let app: ReturnType<typeof createApp>;

  beforeAll(() => {
    app = createApp();
  });

  describe("GET /todos", () => {
    // Setup test data
    beforeAll(async () => {
      const testTodos = [
        {
          title: "First Task",
          completed: false,
          priority: "medium",
        },
        {
          title: "Second Task",
          completed: false,
          priority: "medium",
        },
        {
          title: "Third Task",
          completed: false,
          priority: "medium",
        },
        {
          title: "Fourth Task",
          completed: false,
          priority: "medium",
        },
        {
          title: "Fifth Task",
          completed: false,
          priority: "medium",
        },
      ];

      // Create test todos
      for (const todo of testTodos) {
        await app.handle(
          new Request("http://localhost/todos", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(todo),
          })
        );
      }
    });

    it("should return paginated todos with default values", async () => {
      const response = await app.handle(new Request("http://localhost/todos"));

      expect(response.status).toBe(200);

      const result = await response.json();
      expect(result).toMatchObject({
        data: expect.any(Array),
        meta: {
          totalItems: expect.any(Number),
          itemsPerPage: 10,
          currentPage: 1,
          totalPages: expect.any(Number),
          hasNextPage: expect.any(Boolean),
          hasPreviousPage: false,
        },
      });
    });

    it("should paginate with custom page size", async () => {
      const response = await app.handle(
        new Request("http://localhost/todos?limit=2")
      );

      expect(response.status).toBe(200);

      const result = await response.json();
      expect(result.data).toHaveLength(2);
      expect(result.meta).toMatchObject({
        itemsPerPage: 2,
        currentPage: 1,
        hasNextPage: true,
        hasPreviousPage: false,
      });
    });

    it("should handle second page", async () => {
      const response = await app.handle(
        new Request("http://localhost/todos?page=2&limit=2")
      );

      expect(response.status).toBe(200);

      const result = await response.json();
      expect(result.data).toHaveLength(2);
      expect(result.meta).toMatchObject({
        currentPage: 2,
        itemsPerPage: 2,
        hasNextPage: true,
        hasPreviousPage: true,
      });
    });

    it("should handle last page", async () => {
      const response = await app.handle(
        new Request("http://localhost/todos?page=3&limit=2")
      );

      expect(response.status).toBe(200);

      const result = await response.json();
      expect(result.meta).toMatchObject({
        currentPage: 3,
        hasNextPage: false,
        hasPreviousPage: true,
      });
    });

    it("should handle empty page beyond total pages", async () => {
      const response = await app.handle(
        new Request("http://localhost/todos?page=10")
      );

      expect(response.status).toBe(200);

      const result = await response.json();
      expect(result.data).toHaveLength(0);
      expect(result.meta).toMatchObject({
        currentPage: 10,
        hasNextPage: false,
        hasPreviousPage: true,
      });
    });

    it("should validate page number", async () => {
      const response = await app.handle(
        new Request("http://localhost/todos?page=invalid")
      );

      expect(response.status).toBe(400);

      const error = await response.json();
      expect(error.code).toBe("VALIDATION_ERROR");
    });

    it("should validate limit", async () => {
      const response = await app.handle(
        new Request("http://localhost/todos?limit=invalid")
      );

      expect(response.status).toBe(400);

      const error = await response.json();
      expect(error.code).toBe("VALIDATION_ERROR");
    });
  });

  describe("POST /todos", () => {
    it("should create a todo successfully", async () => {
      const newTodo = {
        title: "Test Todo",
        completed: false,
        priority: "medium",
      };

      const response = await app.handle(
        new Request("http://localhost/todos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTodo),
        })
      );

      expect(response.status).toBe(200);

      const todo = await response.json();
      expect(todo).toMatchObject(newTodo);
      expect(todo).toHaveProperty("id");
    });

    it("should validate required fields", async () => {
      const invalidTodo = {
        // missing required title and completed fields
      };

      const response = await app.handle(
        new Request("http://localhost/todos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(invalidTodo),
        })
      );

      expect(response.status).toBe(400);

      const error = await response.json();

      expect(error.code).toBe("VALIDATION_ERROR");
      expect(error.errors).toStrictEqual([
        expect.objectContaining({
          field: "/title",
          info: "Property 'title' is missing",
        }),
        expect.objectContaining({
          field: "/completed",
          info: "Property 'completed' is missing",
        }),
        expect.objectContaining({
          field: "/priority",
          info: "Property 'priority' is missing",
        }),
      ]);
    });

    it("should validate priority values", async () => {
      const invalidTodo = {
        title: "Test Todo",
        completed: false,
        priority: "INVALID_PRIORITY",
      };

      const response = await app.handle(
        new Request("http://localhost/todos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(invalidTodo),
        })
      );

      expect(response.status).toBe(400);

      const error = await response.json();

      expect(error.code).toBe("VALIDATION_ERROR");
    });
  });

  describe("GET /todos/:id", () => {
    it("should get a todo by id", async () => {
      // First create a todo
      const newTodo = {
        title: "Test Todo",
        completed: false,
        priority: "medium",
      };

      const createResponse = await app.handle(
        new Request("http://localhost/todos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTodo),
        })
      );

      const createdTodo = await createResponse.json();

      // Then retrieve it
      const response = await app.handle(
        new Request(`http://localhost/todos/${createdTodo.id}`)
      );

      expect(response.status).toBe(200);

      const todo = await response.json();
      expect(todo).toMatchObject(newTodo);
      expect(todo.id).toBe(createdTodo.id);
    });

    it("should handle non-existent todo", async () => {
      const response = await app.handle(
        new Request("http://localhost/todos/999999")
      );

      expect(response.status).toBe(404);

      const error = await response.json();
      expect(error.code).toBe("NOT_FOUND");
    });

    it("should validate id parameter", async () => {
      const response = await app.handle(
        new Request("http://localhost/todos/invalid-id")
      );

      expect(response.status).toBe(400);

      const error = await response.json();
      expect(error.code).toBe("VALIDATION_ERROR");
    });
  });

  // Add these test suites after your existing GET /todos/:id tests

  describe("PUT /todos/:id", () => {
    it("should update a todo successfully", async () => {
      // First create a todo
      const newTodo = {
        title: "Test Todo",
        completed: false,
        priority: "medium",
      };

      const createResponse = await app.handle(
        new Request("http://localhost/todos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTodo),
        })
      );

      const createdTodo = await createResponse.json();

      // Then update it
      const updates = {
        title: "Updated Todo",
        completed: true,
        priority: "high",
      };

      const response = await app.handle(
        new Request(`http://localhost/todos/${createdTodo.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updates),
        })
      );

      expect(response.status).toBe(200);

      const updatedTodo = await response.json();
      expect(updatedTodo).toMatchObject(updates);
      expect(updatedTodo.id).toBe(createdTodo.id);
    });

    it("should validate required fields for update", async () => {
      const invalidUpdate = {
        // missing all required fields
      };

      const response = await app.handle(
        new Request("http://localhost/todos/1", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(invalidUpdate),
        })
      );

      expect(response.status).toBe(400);

      const error = await response.json();
      expect(error.code).toBe("VALIDATION_ERROR");
      expect(error.errors).toStrictEqual([
        expect.objectContaining({
          field: "/title",
          info: "Property 'title' is missing",
        }),
        expect.objectContaining({
          field: "/completed",
          info: "Property 'completed' is missing",
        }),
        expect.objectContaining({
          field: "/priority",
          info: "Property 'priority' is missing",
        }),
      ]);
    });

    it("should handle updating non-existent todo", async () => {
      const updates = {
        title: "Updated Todo",
        completed: true,
        priority: "high",
      };

      const response = await app.handle(
        new Request("http://localhost/todos/99999", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updates),
        })
      );

      expect(response.status).toBe(404);

      const error = await response.json();
      expect(error.code).toBe("NOT_FOUND");
    });

    it("should validate id parameter for update", async () => {
      const updates = {
        title: "Updated Todo",
        completed: true,
        priority: "high",
      };

      const response = await app.handle(
        new Request("http://localhost/todos/invalid-id", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updates),
        })
      );

      expect(response.status).toBe(400);

      const error = await response.json();
      expect(error.code).toBe("VALIDATION_ERROR");
    });
  });

  describe("DELETE /todos/:id", () => {
    it("should delete a todo successfully", async () => {
      // First create a todo
      const newTodo = {
        title: "Todo to Delete",
        completed: false,
        priority: "medium",
      };

      const createResponse = await app.handle(
        new Request("http://localhost/todos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTodo),
        })
      );

      const createdTodo = await createResponse.json();

      // Then delete it
      const response = await app.handle(
        new Request(`http://localhost/todos/${createdTodo.id}`, {
          method: "DELETE",
        })
      );

      expect(response.status).toBe(200);

      // Verify the todo is deleted by trying to fetch it
      const getResponse = await app.handle(
        new Request(`http://localhost/todos/${createdTodo.id}`)
      );

      expect(getResponse.status).toBe(404);
    });

    it("should handle deleting non-existent todo", async () => {
      const response = await app.handle(
        new Request("http://localhost/todos/99999", {
          method: "DELETE",
        })
      );

      expect(response.status).toBe(404);

      const error = await response.json();
      expect(error.code).toBe("NOT_FOUND");
    });

    it("should validate id parameter for delete", async () => {
      const response = await app.handle(
        new Request("http://localhost/todos/invalid-id", {
          method: "DELETE",
        })
      );

      expect(response.status).toBe(400);

      const error = await response.json();
      expect(error.code).toBe("VALIDATION_ERROR");
    });
  });
});
