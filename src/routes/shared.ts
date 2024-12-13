import { t } from "elysia";
import { OpenAPIV3 } from "openapi-types";

// Base error schema that can be reused
export const baseErrorSchema = t.Object({
  status: t.Integer({
    examples: [500],
    description: "HTTP status code indicating the type of error",
  }),
  code: t.String({
    examples: ["ERROR_CODE"],
    description: "Machine-readable error code identifier",
  }),
  message: t.String({
    examples: ["Error message"],
    description: "Human-readable error description",
  }),
});

export const badRequestError = t.Object({
  ...baseErrorSchema.properties,
  status: t.Literal(400, {
    examples: [400],
    description: "Bad Request - The request payload is invalid or malformed",
  }),
  code: t.Literal("BAD_REQUEST", {
    examples: ["BAD_REQUEST"],
    description: "Standard error code for invalid request data",
  }),
  details: t.Array(
    t.Object({
      field: t.String({
        examples: ["title"],
        description: "Name of the field that failed validation",
      }),
      info: t.String({
        examples: ["The title field is required"],
        description: "Detailed validation error message for the field",
      }),
    }),
    {
      description: "List of specific validation errors by field",
    }
  ),
  message: t.Literal("Invalid request payload", {
    examples: ["Invalid request payload"],
    description: "Generic message indicating validation failure",
  }),
});

export const unauthorizedError = t.Object({
  ...baseErrorSchema.properties,
  status: t.Literal(401, {
    examples: [401],
    description: "Unauthorized - Authentication is required or has failed",
  }),
  code: t.Literal("UNAUTHORIZED", {
    examples: ["UNAUTHORIZED"],
    description: "Standard error code for authentication failures",
  }),
  message: t.Literal("You are not authorized to access this resource", {
    examples: ["You are not authorized to access this resource"],
    description: "Generic message indicating authentication failure",
  }),
});

export const forbiddenError = t.Object({
  ...baseErrorSchema.properties,
  status: t.Literal(403, {
    examples: [403],
    description: "Forbidden - User lacks required permissions",
  }),
  code: t.Literal("FORBIDDEN", {
    examples: ["FORBIDDEN"],
    description: "Standard error code for permission-related failures",
  }),
  message: t.Literal("You don't have permission to access this resource", {
    examples: ["You don't have permission to access this resource"],
    description: "Generic message indicating insufficient permissions",
  }),
});

export const notFoundError = t.Object({
  ...baseErrorSchema.properties,
  status: t.Literal(404, {
    examples: [404],
    description: "Not Found - The requested resource does not exist",
  }),
  code: t.Literal("NOT_FOUND", {
    examples: ["NOT_FOUND"],
    description: "Standard error code for missing resources",
  }),
  message: t.String({
    examples: ["The requested resource was not found"],
    description: "Message indicating the requested resource could not be found",
  }),
});

export const internalServerError = t.Object({
  ...baseErrorSchema.properties,
  status: t.Literal(500, {
    examples: [500],
    description: "Internal Server Error - Unexpected server-side failure",
  }),
  code: t.Literal("INTERNAL_SERVER_ERROR", {
    examples: ["INTERNAL_SERVER_ERROR"],
    description: "Standard error code for server failures",
  }),
  message: t.Literal(
    "An unexpected error occurred while processing your request",
    {
      examples: ["An unexpected error occurred while processing your request"],
      description: "Generic message for unexpected server errors",
    }
  ),
});

export const commonResponses: OpenAPIV3.ResponsesObject = {
  400: {
    description: "Bad Request - The request payload is invalid or malformed",
    content: {
      "application/json": {
        schema: badRequestError,
      },
    },
  },
  401: {
    description: "Unauthorized - Authentication is required or has failed",
    content: {
      "application/json": {
        schema: unauthorizedError,
      },
    },
  },
  403: {
    description: "Forbidden - User lacks required permissions",
    content: {
      "application/json": {
        schema: forbiddenError,
      },
    },
  },
  404: {
    description: "Not Found - The requested resource does not exist",
    content: {
      "application/json": {
        schema: notFoundError,
      },
    },
  },
  500: {
    description: "Internal Server Error - Unexpected server-side failure",
    content: {
      "application/json": {
        schema: internalServerError,
      },
    },
  },
};
