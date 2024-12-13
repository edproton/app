// src/controllers/subject.router.ts
import { Elysia } from "elysia";
import { createSubject, updateSubject } from "../models/subject.model";
import { setup } from "../setup";

export const subjectRouter = new Elysia()
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
    }
  )
  .get("/subjects", async ({ subjectService }) => {
    return await subjectService.findAll();
  })
  .get("/subjects/:id", async ({ params: { id }, subjectService }) => {
    return await subjectService.findById(id);
  })
  .put(
    "/subjects/:id",
    async ({ params: { id }, body, subjectService }) => {
      return await subjectService.update(id, body);
    },
    {
      body: updateSubject,
    }
  )
  .delete("/subjects/:id", async ({ params: { id }, subjectService }) => {
    await subjectService.delete(id);
    return { success: true };
  });
