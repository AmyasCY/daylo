import { errorResponse, successResponse } from "@/lib/api-response";

describe("api-response helpers", () => {
  it("returns the success envelope and status", async () => {
    const response = successResponse(
      {
        goalId: "goal-123",
      },
      { status: 201 },
    );

    await expect(response.json()).resolves.toEqual({
      ok: true,
      data: {
        goalId: "goal-123",
      },
    });
    expect(response.status).toBe(201);
  });

  it("returns the error envelope and status", async () => {
    const response = errorResponse(
      "INVALID_GOAL_INPUT",
      "Name is required.",
      { status: 400 },
    );

    await expect(response.json()).resolves.toEqual({
      ok: false,
      error: {
        code: "INVALID_GOAL_INPUT",
        message: "Name is required.",
      },
    });
    expect(response.status).toBe(400);
  });
});
