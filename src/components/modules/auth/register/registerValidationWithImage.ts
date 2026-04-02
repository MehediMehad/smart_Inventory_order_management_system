import { z } from "zod";

export const example = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    contactNumber: z
        .string({ required_error: 'contact number is required' })
        .regex(/^\d+$/, { message: 'Contact number must be a number' })
        .min(10, { message: 'Contact number must be at least 10 digits' })
        .max(15, { message: 'Contact number must be at most 15 digits' }),
    gender: z.string().min(1, "Gender is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    passwordConfirm: z.string().min(6, "Password confirmation is required")
}).refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords don't match",
    path: ["passwordConfirm"]
});

export const UpdateExample = z.object({
    name: z.string().optional(),
    email: z.string().email({ message: 'Provide a valid email' }).optional(),
    contactNumber: z
        .string()
        .regex(/^\d+$/, { message: 'Contact number must be numeric' })
        .min(10, { message: 'Contact number must be at least 10 digits' })
        .max(15, { message: 'Contact number must be at most 15 digits' })
        .optional(),
    profilePhoto: z.string().optional(),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional()
});