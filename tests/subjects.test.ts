// tests/subjects.test.ts
import { beforeEach, describe, expect, it } from "bun:test";
import { cleanDatabase } from "./utils";
import app from "../src/app";

describe("Subjects API", () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  it("should create a subject", async () => {
    const response = await app.handle(
      new Request("http://localhost/subjects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Mathematics",
        }),
      })
    );

    expect(response.status).toBe(201);
    const subject = await response.json();

    expect(subject).toMatchObject({
      id: expect.any(String),
      name: "Mathematics",
    });
  });

  it("should get all subjects", async () => {
    // Create a test subject first
    await app.handle(
      new Request("http://localhost/subjects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Physics",
        }),
      })
    );

    const response = await app.handle(new Request("http://localhost/subjects"));

    expect(response.status).toBe(200);
    const subjects = await response.json();

    expect(subjects).toHaveLength(1);
    expect(subjects[0]).toMatchObject({
      id: expect.any(String),
      name: "Physics",
    });
  });

  it("should update a subject", async () => {
    // First create a subject
    const createResponse = await app.handle(
      new Request("http://localhost/subjects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Chemistry",
        }),
      })
    );
    const subject = await createResponse.json();

    // Then update it
    const response = await app.handle(
      new Request(`http://localhost/subjects/${subject.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Advanced Chemistry",
        }),
      })
    );

    expect(response.status).toBe(200);
    const updated = await response.json();

    expect(updated).toMatchObject({
      id: subject.id,
      name: "Advanced Chemistry",
    });
  });

  it("should delete a subject", async () => {
    // First create a subject
    const createResponse = await app.handle(
      new Request("http://localhost/subjects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Biology",
        }),
      })
    );
    const subject = await createResponse.json();

    // Then delete it
    const response = await app.handle(
      new Request(`http://localhost/subjects/${subject.id}`, {
        method: "DELETE",
      })
    );

    expect(response.status).toBe(200);

    // Verify it's deleted
    const getResponse = await app.handle(
      new Request(`http://localhost/subjects/${subject.id}`)
    );
    expect(getResponse.status).toBe(404);
  });
});
