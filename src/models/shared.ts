// src/models/shared.ts
import { t, TSchema } from "elysia";

export const pagedQueryModel = t.Object({
  page: t.Optional(
    t.Number({
      default: 1,
      description: "The page number to retrieve",
    })
  ),
  limit: t.Optional(
    t.Number({
      default: 10,
      description: "The maximum number of items per page",
    })
  ),
});

export type PagedQuery = typeof pagedQueryModel.static;

export const createPagedResponseSchema = <T extends TSchema>(schema: T) =>
  t.Object({
    data: t.Array(schema),
    meta: t.Object({
      totalItems: t.Number({
        description: "Total number of items across all pages",
      }),
      itemsPerPage: t.Number({
        description: "Number of items per page",
      }),
      currentPage: t.Number({
        description: "Current page number",
      }),
      totalPages: t.Number({
        description: "Total number of pages",
      }),
      hasNextPage: t.Boolean({
        description: "Whether there is a next page",
      }),
      hasPreviousPage: t.Boolean({
        description: "Whether there is a previous page",
      }),
    }),
  });

export type PagedResponse<T> = {
  data: T[];
  meta: {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

export const createPagedResponse = <T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): PagedResponse<T> => ({
  data,
  meta: {
    totalItems: total,
    itemsPerPage: limit,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    hasNextPage: page < Math.ceil(total / limit),
    hasPreviousPage: page > 1,
  },
});
