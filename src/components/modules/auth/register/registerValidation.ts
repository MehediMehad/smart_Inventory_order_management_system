import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .max(32, 'Password must be at most 32 characters long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[@$!%*?&#]/, 'Password must contain at least one special character');

export const registrationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: passwordSchema,
  passwordConfirm: z.string().min(6, "Password confirmation is required")
}).refine((data) => data.password === data.passwordConfirm, {
  message: "Passwords don't match",
  path: ["passwordConfirm"]
});

export const updateProfileSchema = z.object({
  name: z.string().optional(),
});

