import { z } from "zod";

import { TASK_PRIORITIES, TASK_STATUSES } from "@/models/task";
import {
  nullableDateSchema,
  objectIdSchema,
  trimmedOptionalString,
} from "@/schemas/common";

export const taskPrioritySchema = z.enum(TASK_PRIORITIES);
export const taskStatusSchema = z.enum(TASK_STATUSES);

export const createTaskInputSchema = z.object({
  goalId: z.union([objectIdSchema, z.null()]).optional().transform((value) => value ?? null),
  title: z.string().trim().min(1).max(160),
  description: trimmedOptionalString(2000),
  deadline: nullableDateSchema,
  estimatedDurationMinutes: z.number().int().min(1).max(24 * 60),
  priority: taskPrioritySchema.optional(),
  status: taskStatusSchema.optional(),
  completedAt: nullableDateSchema,
});

export const updateTaskInputSchema = createTaskInputSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided.",
  });

export type CreateTaskInput = z.infer<typeof createTaskInputSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskInputSchema>;
