import { GET as getGoalById } from "@/app/api/goals/[goalId]/route";
import { POST as createGoal } from "@/app/api/goals/route";

describe("goal route validation", () => {
  it("rejects invalid JSON before hitting the database", async () => {
    const request = new Request("http://localhost:3000/api/goals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: "{invalid-json",
    });

    const response = await createGoal(request);

    await expect(response.json()).resolves.toEqual({
      ok: false,
      error: {
        code: "INVALID_JSON",
        message: "Request body must be valid JSON.",
      },
    });
    expect(response.status).toBe(400);
  });

  it("rejects malformed goal IDs before any database work", async () => {
    const response = await getGoalById(new Request("http://localhost:3000"), {
      params: Promise.resolve({
        goalId: "not-an-object-id",
      }),
    });

    await expect(response.json()).resolves.toEqual({
      ok: false,
      error: {
        code: "INVALID_GOAL_ID",
        message: "Goal ID must be a valid ObjectId.",
      },
    });
    expect(response.status).toBe(400);
  });
});
