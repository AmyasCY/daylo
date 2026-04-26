import { serializeTask } from "@/app/api/tasks/serialize-task";

describe("serializeTask", () => {
  it("preserves explicit fields and optional goal data", () => {
    const createdAt = new Date("2026-04-26T08:00:00.000Z");
    const updatedAt = new Date("2026-04-26T09:00:00.000Z");
    const deadline = new Date("2026-04-28T00:00:00.000Z");

    expect(
      serializeTask({
        id: "task-123",
        goalId: "goal-123",
        title: "Draft scheduling tests",
        description: "Cover the first pass of task ranking.",
        deadline,
        estimatedDurationMinutes: 45,
        priority: "high",
        status: "in_progress",
        completedAt: null,
        createdAt,
        updatedAt,
        goal: {
          id: "goal-123",
          name: "Launch MVP",
          status: "active",
          priority: "high",
        },
      }),
    ).toEqual({
      id: "task-123",
      goalId: "goal-123",
      title: "Draft scheduling tests",
      description: "Cover the first pass of task ranking.",
      deadline,
      estimatedDurationMinutes: 45,
      priority: "high",
      status: "in_progress",
      completedAt: null,
      createdAt,
      updatedAt,
      goal: {
        id: "goal-123",
        name: "Launch MVP",
        status: "active",
        priority: "high",
      },
    });
  });
});
