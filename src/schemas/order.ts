import z from "zod";

export const createOrderSchema = z.object({
    customerName: z.string(),
    address: z.string(),
    contact: z.string(), // Phone number or email
    items: z.array(
        z.object({
            productId: z.string(),
            quantity: z.number().int().positive("Quantity must be at least 1"),
        })
    ).min(1, "At least one product is required"),
});

export type TCreateOrderForm = z.infer<typeof createOrderSchema>;