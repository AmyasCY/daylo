import { z } from "zod";

import {
  nonEmptyUpdateInputSchema,
  objectIdSchema,
  requiredDateSchema,
  trimmedOptionalString,
} from "@/schemas/common";

export const scheduleTaskAssignmentInputSchema = z
  .object({
    taskId: objectIdSchema,
    titleSnapshot: z.string().trim().min(1).max(160),
    startAt: requiredDateSchema,
    endAt: requiredDateSchema,
    reasoning: trimmedOptionalString(2000),
  })
  .refine((value) => value.endAt > value.startAt, {
    message: "Assignment endAt must be after startAt.",
    path: ["endAt"],
  });

export const timeBlockInputSchema = z
  .object({
    startAt: requiredDateSchema,
    endAt: requiredDateSchema,
    availabilityDescription: trimmedOptionalString(240),
    assignments: z.array(scheduleTaskAssignmentInputSchema).optional().default([]),
  })
  .refine((value) => value.endAt > value.startAt, {
    message: "Time block endAt must be after startAt.",
    path: ["endAt"],
  });

export const scheduleFeedbackInputSchema = z.object({
  submittedAt: requiredDateSchema.optional(),
  note: z.string().trim().min(1).max(500),
});

export const createScheduleInputSchema = z.object({
  scheduleDate: requiredDateSchema,
  timeBlocks: z.array(timeBlockInputSchema).optional().default([]),
  reasoningSummary: trimmedOptionalString(4000),
  feedbackNotes: z.array(scheduleFeedbackInputSchema).optional().default([]),
});

export const updateScheduleInputSchema = nonEmptyUpdateInputSchema.pipe(
  createScheduleInputSchema.partial(),
);

export type ScheduleTaskAssignmentInput = z.infer<
  typeof scheduleTaskAssignmentInputSchema
>;
export type TimeBlockInput = z.infer<typeof timeBlockInputSchema>;
export type ScheduleFeedbackInput = z.infer<typeof scheduleFeedbackInputSchema>;
export type CreateScheduleInput = z.infer<typeof createScheduleInputSchema>;
export type UpdateScheduleInput = z.infer<typeof updateScheduleInputSchema>;
