// subject.model.ts
import { Elysia, t } from "elysia";
import { setup } from "../setup";
import { commonResponses } from "./shared";

export type Subject = typeof subject.static;
export const subject = t.Object({
  id: t.String({
    description: "The unique identifier for the subject",
    pattern:
      "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$",
    examples: [
      "123e4567-e89b-12d3-a456-426614174000",
      "123e4567-e89b-12d3-a456-426614174001",
    ],
  }),
  name: t.String({
    description: "The name of the subject",
    minLength: 1,
    maxLength: 30,
    examples: ["Mathematics", "Science"],
  }),
});

export type CreateSubject = typeof createSubject.static;
export const createSubject = t.Composite([t.Omit(subject, ["id"])]);

export type UpdateSubject = typeof updateSubject.static;
export const updateSubject = t.Composite([t.Omit(subject, ["id"])]);

// Create a model plugin
export const subjectModel = new Elysia().model({
  subject: subject,
  "subject.create": createSubject,
  "subject.update": updateSubject,
});

// subject.router.ts
export const subjectRouter = new Elysia({
  prefix: "/subjects",
  detail: {
    tags: ["Subjects"],
  },
})
  .use(setup)
  .use(subjectModel)
  .post(
    "/",
    async ({ body, subjectService, set }) => {
      set.status = 201;
      return await subjectService.create(body);
    },
    {
      body: "subject.create",
      detail: {
        summary: "Create a new subject",
        description:
          "Creates a new subject with the provided data. Returns the created subject object including its generated ID and metadata.",
        responses: {
          ...commonResponses,
          201: {
            description: "Subject created successfully",
            content: {
              "application/json": {
                schema: subject,
              },
            },
          },
        },
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
        summary: "Get all subjects",
        description:
          "Retrieves a list of all subjects. The response includes each subject's ID and associated data.",
        responses: {
          ...commonResponses,
          200: {
            description: "Subjects retrieved successfully",
            content: {
              "application/json": {
                schema: t.Array(subject),
              },
            },
          },
        },
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
        summary: "Get a subject by ID",
        description:
          "Retrieves a specific subject by its unique identifier. Returns the complete subject data if found.",
        responses: {
          ...commonResponses,
          200: {
            description: "Subject retrieved successfully",
            content: {
              "application/json": {
                schema: subject,
              },
            },
          },
        },
      },
    }
  )
  .put(
    "/:id",
    async ({ params: { id }, body, subjectService }) => {
      return await subjectService.update(id, body);
    },
    {
      body: "subject.update",
      detail: {
        summary: "Update a subject",
        description:
          "Updates an existing subject with the provided data. Returns the updated subject object.",
        responses: {
          ...commonResponses,
          200: {
            description: "Subject updated successfully",
            content: {
              "application/json": {
                schema: subject,
              },
            },
          },
        },
      },
    }
  )
  .delete(
    "/:id",
    async ({ params: { id }, subjectService }) => {
      await subjectService.delete(id);
      return { success: true };
    },
    {
      detail: {
        summary: "Delete a subject",
        description:
          "Deletes an existing subject by its ID. Returns a success confirmation.",
        responses: {
          ...commonResponses,
          200: {
            description: "Subject deleted successfully",
            content: {
              "application/json": {
                schema: t.Object({
                  success: t.Boolean({
                    description: "Indicates if the deletion was successful",
                    examples: [true],
                  }),
                }),
              },
            },
          },
        },
      },
    }
  );
