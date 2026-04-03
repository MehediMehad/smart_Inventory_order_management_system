

export type TOrder = {
    id: string;
    orderId: string;
    customerName: string;
    address: string;
    contact: string;
    totalPrice: number;
    status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
    createdAt: string;
    items: TItem[];
};


export interface TItem {
    id: string
    orderId: string
    productId: string
    quantity: number
    price: number
    product: Product
}

interface Product {
    id: string
    name: string
    categoryId: string
    price: number
    stockQuantity: number
    minStockThreshold: number
    status: string
    createdAt: string
    updatedAt: string
}