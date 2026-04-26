import { serializeGoal } from "@/app/api/goals/serialize-goal";

describe("serializeGoal", () => {
  it("preserves explicit fields and null target dates", () => {
    const createdAt = new Date("2026-04-25T08:00:00.000Z");
    const updatedAt = new Date("2026-04-25T09:00:00.000Z");

    expect(
      serializeGoal({
        id: "goal-123",
        name: "Launch MVP",
        description: "Ship the first demo build.",
        status: "active",
        priority: "high",
        targetDate: null,
        createdAt,
        updatedAt,
      }),
    ).toEqual({
      id: "goal-123",
      name: "Launch MVP",
      description: "Ship the first demo build.",
      status: "active",
      priority: "high",
      targetDate: null,
      createdAt,
      updatedAt,
    });
  });
});
