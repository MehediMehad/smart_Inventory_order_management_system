// src/services/Product/index.ts
"use server";

import { revalidateTag } from "next/cache";
import { serverFetch } from "@/lib/serverFetch";
import { getCookie } from "@/services/Auth/verifyToken";
import { TCreateProductForm } from "@/schemas"; // adjust if your schema path is different

const TAG = "products";

export const createProduct = async (data: TCreateProductForm) => {
    try {
        const accessToken = await getCookie("accessToken");

        const response = await serverFetch.post("/product", {
            body: JSON.stringify(data),
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            next: { tags: [TAG] },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return {
                success: false,
                message: errorData.message || "Failed to create product",
            };
        }

        const result = await response.json();
        revalidateTag(TAG, { expire: 0 });

        return {
            success: true,
            message: result.message || "Product created successfully",
            data: result.data,
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "Failed to create product",
        };
    }
};

export const getAllProducts = async () => {
    try {
        const response = await serverFetch.get("/product", {
            next: { tags: [TAG] },
        });

        if (!response.ok) return [];

        const result = await response.json();
        return result.data || [];
    } catch (error) {
        console.error("getAllProducts error:", error);
        return [];
    }
};

export const getSingleProduct = async (id: string) => {
    try {
        const response = await serverFetch.get(`/product/${id}`);

        if (!response.ok) return null;

        const result = await response.json();
        return result.data || null;
    } catch (error) {
        console.error("getSingleProduct error:", error);
        return null;
    }
};

export const updateProduct = async (id: string, data: Partial<TCreateProductForm>) => {
    try {
        const accessToken = await getCookie("accessToken");

        const response = await serverFetch.patch(`/product/${id}`, {
            body: JSON.stringify(data),
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return {
                success: false,
                message: errorData.message || "Failed to update product",
            };
        }

        const result = await response.json();
        revalidateTag(TAG, { expire: 0 });

        return {
            success: true,
            message: result.message || "Product updated successfully",
            data: result.data,
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "Failed to update product",
        };
    }
};

export const deleteProduct = async (id: string) => {
    try {
        const accessToken = await getCookie("accessToken");

        const response = await serverFetch.delete(`/product/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return {
                success: false,
                message: errorData.message || "Failed to delete product",
            };
        }

        revalidateTag(TAG, { expire: 0 });
        return {
            success: true,
            message: "Product deleted successfully",
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "Failed to delete product",
        };
    }
};