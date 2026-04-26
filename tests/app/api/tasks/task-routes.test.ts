import { GET as getTaskById } from "@/app/api/tasks/[taskId]/route";
import { GET as listTasks, POST as createTask } from "@/app/api/tasks/route";

describe("task route validation", () => {
  it("rejects invalid JSON before hitting the database", async () => {
    const request = new Request("http://localhost:3000/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: "{invalid-json",
    });

    const response = await createTask(request);

    await expect(response.json()).resolves.toEqual({
      ok: false,
      error: {
        code: "INVALID_JSON",
        message: "Request body must be valid JSON.",
      },
    });
    expect(response.status).toBe(400);
  });

  it("rejects malformed task IDs before any database work", async () => {
    const response = await getTaskById(new Request("http://localhost:3000"), {
      params: Promise.resolve({
        taskId: "not-an-object-id",
      }),
    });

    await expect(response.json()).resolves.toEqual({
      ok: false,
      error: {
        code: "INVALID_TASK_ID",
        message: "Task ID must be a valid ObjectId.",
      },
    });
    expect(response.status).toBe(400);
  });

  it("rejects malformed goal filters before querying tasks", async () => {
    const response = await listTasks(
      new Request("http://localhost:3000/api/tasks?goalId=bad-goal-id"),
    );

    await expect(response.json()).resolves.toEqual({
      ok: false,
      error: {
        code: "INVALID_TASK_FILTER",
        message: "Task goal filter must be a valid ObjectId or 'none'.",
      },
    });
    expect(response.status).toBe(400);
  });
});
