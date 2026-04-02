import { z } from "zod";

export const createProductSchema = z.object({
    name: z.string().min(2),
    categoryId: z.string(),
    price: z.number().positive(),
    stockQuantity: z.number().int().nonnegative(),
    minStockThreshold: z.number().int().nonnegative(),
});

export type TCreateProductForm = z.infer<typeof createProductSchema>;