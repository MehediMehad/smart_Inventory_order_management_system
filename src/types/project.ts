
export interface TProduct {
    id: string;
    name: string;
    price: number;
    stockQuantity: number;
    minStockThreshold: number;
    status: "ACTIVE" | "OUT_OF_STOCK";
    category: { name: string; id: string };
    categoryId: string;
    createdAt: string;
    updatedAt: string;
}