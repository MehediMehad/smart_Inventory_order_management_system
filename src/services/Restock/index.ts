// src/services/Restock/index.ts
"use server";

import { revalidateTag } from "next/cache";
import { serverFetch } from "@/lib/serverFetch";
import { getCookie } from "@/services/Auth/verifyToken";

const TAG = "restock";

export const getRestockQueue = async (params: {
    page?: number;
    limit?: number;
    priority?: "HIGH" | "MEDIUM" | "LOW";
    searchTerm?: string;
}) => {
    const { page = 1, limit = 10, priority, searchTerm } = params;

    try {
        const accessToken = await getCookie("accessToken");

        const queryParams = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });

        if (priority) queryParams.set("priority", priority);
        if (searchTerm) queryParams.set("searchTerm", searchTerm);

        const response = await serverFetch.get(`/restock?${queryParams.toString()}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            next: { tags: [TAG] },
        });

        if (!response.ok) {
            return { data: [], stack: { total: 0, high: 0, medium: 0, low: 0 } };
        }

        const result = await response.json();
        return result.data || { data: [], stack: { total: 0, high: 0, medium: 0, low: 0 } };
    } catch (error) {
        console.error("getRestockQueue error:", error);
        return { data: [], stack: { total: 0, high: 0, medium: 0, low: 0 } };
    }
};

export const restockProduct = async (data: { productId: string; addedQuantity: number }) => {
    try {
        const accessToken = await getCookie("accessToken");

        const response = await serverFetch.post("/restock", {
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
                message: errorData.message || "Failed to restock product",
            };
        }

        const result = await response.json();
        revalidateTag(TAG, { expire: 0 });

        return {
            success: true,
            message: result.message || "Product restocked successfully",
            data: result.data,
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "Failed to restock product",
        };
    }
};

export const deleteFromQueue = async (id: string) => {
    try {
        const accessToken = await getCookie("accessToken");

        const response = await serverFetch.delete(`/restock/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return {
                success: false,
                message: errorData.message || "Failed to remove from queue",
            };
        }

        revalidateTag(TAG, { expire: 0 });
        return {
            success: true,
            message: "Item removed from restock queue successfully",
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "Failed to remove from queue",
        };
    }
};