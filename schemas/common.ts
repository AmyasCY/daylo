import { z } from "zod";

const objectIdPattern = /^[a-f\d]{24}$/i;

export const objectIdSchema = z
  .string()
  .trim()
  .regex(objectIdPattern, "Invalid ObjectId.");

export const trimmedOptionalString = (maxLength: number) =>
  z
    .string()
    .trim()
    .max(maxLength)
    .optional()
    .transform((value) => value ?? "");

export const nullableDateSchema = z
  .union([z.coerce.date(), z.null()])
  .optional()
  .transform((value) => value ?? null);

export const requiredDateSchema = z.coerce.date();
