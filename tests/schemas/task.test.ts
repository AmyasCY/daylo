import { createTaskInputSchema, updateTaskInputSchema } from "@/schemas/task";

describe("task schemas", () => {
  it("defaults nullable task fields when omitted", () => {
    expect(
      createTaskInputSchema.parse({
        title: "  Draft schedule  ",
        estimatedDurationMinutes: 45,
      }),
    ).toEqual({
      goalId: null,
      title: "Draft schedule",
      description: "",
      deadline: null,
      estimatedDurationMinutes: 45,
      completedAt: null,
    });
  });

  it("rejects task durations above one day", () => {
    const result = createTaskInputSchema.safeParse({
      title: "Write everything at once",
      estimatedDurationMinutes: 24 * 60 + 1,
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.code).toBe("too_big");
  });

  it("rejects empty task updates", () => {
    const result = updateTaskInputSchema.safeParse({});

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe(
      "At least one field must be provided.",
    );
  });
});
