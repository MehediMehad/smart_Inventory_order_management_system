// src/services/Category/index.ts
"use server";

import { revalidateTag } from "next/cache";
import { serverFetch } from "@/lib/serverFetch";
import { cookies } from "next/headers";
import { TCategoryForm } from "@/schemas";
import { TCategory } from "@/types";


const TAG = "categories";

export const getAllCategories = async (): Promise<TCategory[]> => {
    try {
        const response = await serverFetch.get("/category", {
            next: { tags: [TAG] },
        });

        if (!response.ok) {
            return [];
        }

        const result = await response.json();
        return result.data || [];
    } catch (error) {
        console.error("getAllCategories error:", error);
        return [];
    }
};

export const getSingleCategory = async (id: string): Promise<TCategory | null> => {
    try {
        const response = await serverFetch.get(`/category/${id}`);

        if (!response.ok) return null;

        const result = await response.json();
        return result.data || null;
    } catch (error) {
        console.error("getSingleCategory error:", error);
        return null;
    }
};

export const updateCategory = async (id: string, data: TCategoryForm) => {
    const body = {
        name: data.name,
        // add other updatable fields here
    };

    try {
        const accessToken = (await cookies()).get("accessToken")?.value;

        const response = await serverFetch.patch(`/category/${id}`, {
            body: JSON.stringify(body),
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return {
                success: false,
                message: errorData.message || "Failed to update category",
            };
        }

        const result = await response.json();
        revalidateTag(TAG, { expire: 0 });

        return {
            success: true,
            message: result.message || "Category updated successfully",
            data: result.data,
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "Failed to update category",
        };
    }
};

export const deleteCategory = async (id: string) => {
    try {
        const accessToken = (await cookies()).get("accessToken")?.value;

        const response = await serverFetch.delete(`/category/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return {
                success: false,
                message: errorData.message || "Failed to delete category",
            };
        }

        revalidateTag(TAG, { expire: 0 });
        return {
            success: true,
            message: "Category deleted successfully",
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "Failed to delete category",
        };
    }
};