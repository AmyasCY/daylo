import {
  createScheduleInputSchema,
  timeBlockInputSchema,
  updateScheduleInputSchema,
} from "@/schemas/schedule";

describe("schedule schemas", () => {
  it("defaults nested schedule collections", () => {
    const scheduleDate = new Date("2026-04-25T00:00:00.000Z");

    expect(
      createScheduleInputSchema.parse({
        scheduleDate,
      }),
    ).toEqual({
      scheduleDate,
      reasoningSummary: "",
      timeBlocks: [],
      feedbackNotes: [],
    });
  });

  it("rejects time blocks whose end is before start", () => {
    const result = timeBlockInputSchema.safeParse({
      startAt: "2026-04-25T10:00:00.000Z",
      endAt: "2026-04-25T09:00:00.000Z",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe(
      "Time block endAt must be after startAt.",
    );
  });

  it("rejects empty schedule updates", () => {
    const result = updateScheduleInputSchema.safeParse({});

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe(
      "At least one field must be provided.",
    );
  });
});
