import { createGoalInputSchema, updateGoalInputSchema } from "@/schemas/goal";

describe("goal schemas", () => {
  it("normalizes optional values on goal creation", () => {
    expect(
      createGoalInputSchema.parse({
        name: "  Build Daylo MVP  ",
      }),
    ).toEqual({
      name: "Build Daylo MVP",
      description: "",
      targetDate: null,
    });
  });

  it("rejects empty goal updates", () => {
    const result = updateGoalInputSchema.safeParse({});

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe(
      "At least one field must be provided.",
    );
  });
});
