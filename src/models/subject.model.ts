import { t } from "elysia";

export type Subject = typeof subject.static;
export const subject = t.Object({
  id: t.String({
    description: "The unique identifier for the subject",
    pattern:
      "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$",
  }),
  name: t.String({
    description: "The name of the subject",
    minLength: 1,
  }),
});

export type CreateSubject = typeof createSubject.static;
export const createSubject = t.Composite([t.Omit(subject, ["id"])]);

export type UpdateSubject = typeof updateSubject.static;
export const updateSubject = t.Composite([t.Omit(subject, ["id"])]);
