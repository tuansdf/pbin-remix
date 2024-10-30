import { z } from "zod";

export const passwordSchema = z
  .string({
    required_error: "Password is required",
    invalid_type_error: "Invalid password",
  })
  .min(12, "Must have at least 12 characters")
  .max(128, "Must have at most 128 characters");

export const stringOrUndefined = z.string().transform((v) => v || undefined);
