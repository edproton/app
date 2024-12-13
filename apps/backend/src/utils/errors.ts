import { env } from "bun";
import { Elysia, t, ValidationError } from "elysia";

// Error response types
interface ErrorResponseBase {
  status: number;
  code: string;
  message?: string;
}

interface ValidationErrorDetail {
  field?: string;
  value?: unknown;
}

interface ValidationErrorResponse extends ErrorResponseBase {
  errors: ValidationErrorDetail[];
}

// Custom error classes with status codes
class AuthorizationError extends Error {
  public status: number = 401;
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "AuthorizationError";
  }
}

class ForbiddenError extends Error {
  public status: number = 403;
  constructor(message = "Forbidden") {
    super(message);
    this.name = "ForbiddenError";
  }
}

// Create plugin
export const errorHandler = () => {
  return new Elysia({ name: "error-handler" })
    .error({
      AuthorizationError,
      ForbiddenError,
    })
    .onError(({ code, error, set }) => {
      // Log the error with timestamp
      console.error(
        `[${new Date().toISOString()}] [${code}]:`,
        error.message || error
      );

      switch (code) {
        case "NOT_FOUND":
          set.status = 404;
          return {
            status: 404,
            message: "Resource not found",
            code: "NOT_FOUND",
          };

        case "VALIDATION":
          set.status = 400;
          if (error instanceof ValidationError) {
            const seenFields = new Set<string>();
            const validationResponse: ValidationErrorResponse = {
              status: 400,
              code: "VALIDATION_ERROR",
              message: "Validation failed",
              errors: error.all
                .filter((error) => {
                  const field = "path" in error ? error.path : undefined;
                  if (field && !seenFields.has(field)) {
                    seenFields.add(field);

                    return true;
                  }

                  return false;
                })
                .map((error) => {
                  const field = "path" in error ? error.path : undefined;

                  return {
                    field: field,
                    info: error.summary,
                  };
                }),
            };

            return validationResponse;
          }

          return {
            status: 400,
            message: "Validation failed",
            code: "VALIDATION_ERROR",
          };

        case "PARSE":
          set.status = 400;
          return {
            status: 400,
            message: "Invalid request format",
            code: "PARSE_ERROR",
          };

        case "AuthorizationError":
          set.status = error instanceof AuthorizationError ? error.status : 401;
          return {
            status: 401,
            message: error.message,
            code: "UNAUTHORIZED",
          };

        case "ForbiddenError":
          set.status = error instanceof ForbiddenError ? error.status : 403;
          return {
            status: 403,
            message: error.message,
            code: "FORBIDDEN",
          };

        case "INTERNAL_SERVER_ERROR":
        case "UNKNOWN":
        default:
          set.status = 500;
          const isProduction = env.NODE_ENV === "production";
          return {
            status: 500,
            message: isProduction ? "Internal server error" : error.message,
            code: "INTERNAL_SERVER_ERROR",
            ...(isProduction ? {} : { stack: error.stack }),
          };
      }
    });
};

const errorSchema = {
  validationError: t.Object({
    status: t.Integer(),
    code: t.String(),
    message: t.String(),
    errors: t.Array(
      t.Object({
        field: t.String(),
        info: t.String(),
      })
    ),
  }),
  notFound: t.Object({
    status: t.Integer(),
    code: t.String(),
    message: t.String(),
  }),
  forbidden: t.Object({
    status: t.Integer(),
    code: t.String(),
    message: t.String(),
  }),
  unauthorized: t.Object({
    status: t.Integer(),
    code: t.String(),
    message: t.String(),
  }),
  internalServerError: t.Object({
    status: t.Integer(),
    code: t.String(),
    message: t.String(),
  }),
};
// Export custom errors and types
export {
  AuthorizationError,
  ForbiddenError,
  type ErrorResponseBase,
  type ValidationErrorResponse,
  type ValidationErrorDetail,
  errorSchema,
};
