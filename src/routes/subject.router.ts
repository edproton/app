// src/controllers/subject.router.ts
import { Elysia, t } from "elysia";
import { createSubject, updateSubject } from "../models/subject.model";
import { setup } from "../setup";
import { OpenAPIV3 } from "openapi-types";

// Base error schema that can be reused
export const baseErrorSchema = t.Object({
  status: t.Integer({
    examples: [500],
    description: "The HTTP status code",
  }),
  code: t.String({
    examples: ["ERROR_CODE"],
    description: "The error code",
  }),
  message: t.String({
    examples: ["Error message"],
    description: "The error message",
  }),
});

export const badRequestError = t.Object({
  ...baseErrorSchema.properties,
  status: t.Literal(400, {
    examples: [400],
    description: "Bad Request status code",
  }),
  code: t.Literal("BAD_REQUEST", {
    examples: ["BAD_REQUEST"],
    description: "Bad request error code",
  }),
  details: t.Array(
    t.Object({
      field: t.String({
        examples: ["title"],
        description: "The field that caused the error",
      }),
      info: t.String({
        examples: ["The title field is required"],
        description: "The error message for the field",
      }),
    }),
    {
      description: "An array of field errors",
    }
  ),
  message: t.Literal("Invalid request payload", {
    examples: ["Invalid request payload"],
    description: "Standard bad request error message",
  }),
});

export const unauthorizedError = t.Object({
  ...baseErrorSchema.properties,
  status: t.Literal(401, {
    examples: [401],
    description: "Unauthorized status code",
  }),
  code: t.Literal("UNAUTHORIZED", {
    examples: ["UNAUTHORIZED"],
    description: "Authentication error code",
  }),
  message: t.Literal("You are not authorized to access this resource", {
    examples: ["You are not authorized to access this resource"],
    description: "Standard unauthorized error message",
  }),
});

export const forbiddenError = t.Object({
  ...baseErrorSchema.properties,
  status: t.Literal(403, {
    examples: [403],
    description: "Forbidden status code",
  }),
  code: t.Literal("FORBIDDEN", {
    examples: ["FORBIDDEN"],
    description: "Permission error code",
  }),
  message: t.Literal("You don't have permission to access this resource", {
    examples: ["You don't have permission to access this resource"],
    description: "Standard forbidden error message",
  }),
});

export const notFoundError = t.Object({
  ...baseErrorSchema.properties,
  status: t.Literal(404, {
    examples: [404],
    description: "Not Found status code",
  }),
  code: t.Literal("NOT_FOUND", {
    examples: ["NOT_FOUND"],
    description: "Resource not found error code",
  }),
  message: t.String({
    examples: ["The requested resource was not found"],
    description: "Standard not found error message",
  }),
});

export const internalServerError = t.Object({
  ...baseErrorSchema.properties,
  status: t.Literal(500, {
    examples: [500],
    description: "Internal Server Error status code",
  }),
  code: t.Literal("INTERNAL_SERVER_ERROR", {
    examples: ["INTERNAL_SERVER_ERROR"],
    description: "Internal server error code",
  }),
  message: t.Literal(
    "An unexpected error occurred while processing your request",
    {
      examples: ["An unexpected error occurred while processing your request"],
      description: "Standard internal server error message",
    }
  ),
});

export const commonResponses: OpenAPIV3.ResponsesObject = {
  400: {
    description: "Bad Request",
    content: {
      "application/json": {
        schema: badRequestError,
      },
    },
  },
  401: {
    description: "Unauthorized",
    content: {
      "application/json": {
        schema: unauthorizedError,
      },
    },
  },
  403: {
    description: "Forbidden",
    content: {
      "application/json": {
        schema: forbiddenError,
      },
    },
  },
  404: {
    description: "Not Found",
    content: {
      "application/json": {
        schema: notFoundError,
      },
    },
  },
  500: {
    description: "Internal Server Error",
    content: {
      "application/json": {
        schema: internalServerError,
      },
    },
  },
};

export const subjectRouter = new Elysia({
  prefix: "/subjects",
  detail: {
    tags: ["Subjects"],
    responses: commonResponses,
  },
})
  .use(setup)
  .post(
    "/subjects",
    async ({ body, subjectService, set }) => {
      set.status = 201;
      return await subjectService.create(body);
    },
    {
      body: createSubject,
      status: 201,
      detail: {
        summary: "Create a new subject",
        description:
          "Retrieves a list of all todo items. The response includes the todo ID, title, description, completion status, and creation date.",
      },
    }
  )
  .get(
    "/",
    async ({ subjectService }) => {
      return await subjectService.findAll();
    },
    {
      detail: {
        summary: "Create a new subject",
        description:
          "Retrieves a list of all todo items. The response includes the todo ID, title, description, completion status, and creation date.",
      },
    }
  )
  .guard({
    params: t.Object({
      id: t.String({
        format: "uuid",
        description: "The unique identifier of the subject",
      }),
    }),
  })
  .get(
    "/:id",
    async ({ params: { id }, subjectService }) => {
      return await subjectService.findById(id);
    },
    {
      detail: {
        summary: "Create a new subject",
        description:
          "Retrieves a list of all todo items. The response includes the todo ID, title, description, completion status, and creation date.",
      },
    }
  )
  .put(
    "/:id",
    async ({ params: { id }, body, subjectService }) => {
      return await subjectService.update(id, body);
    },
    {
      body: updateSubject,
      detail: {
        summary: "Create a new subject",
        description:
          "Retrieves a list of all todo items. The response includes the todo ID, title, description, completion status, and creation date.",
      },
    }
  )
  .delete("/:id", async ({ params: { id }, subjectService }) => {
    await subjectService.delete(id);
    return { success: true };
  });
