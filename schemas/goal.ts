import { z } from "zod";

import { GOAL_PRIORITIES, GOAL_STATUSES } from "@/models/goal";
import { nullableDateSchema, trimmedOptionalString } from "@/schemas/common";

export const goalPrioritySchema = z.enum(GOAL_PRIORITIES);
export const goalStatusSchema = z.enum(GOAL_STATUSES);

export const createGoalInputSchema = z.object({
  name: z.string().trim().min(1).max(120),
  description: trimmedOptionalString(2000),
  status: goalStatusSchema.optional(),
  priority: goalPrioritySchema.optional(),
  targetDate: nullableDateSchema,
});

export const updateGoalInputSchema = createGoalInputSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided.",
  });

export type CreateGoalInput = z.infer<typeof createGoalInputSchema>;
export type UpdateGoalInput = z.infer<typeof updateGoalInputSchema>;
