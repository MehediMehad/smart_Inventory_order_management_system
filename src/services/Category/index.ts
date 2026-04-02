"use server";

import config from "@/configs";
import { cookies } from "next/headers";

// Get all categories
export const getCategories = async () => {
    try {
        const accessToken = (await cookies()).get("accessToken")?.value;

        if (!accessToken) {
            throw new Error("No access token found");
        }

        const res = await fetch(`${config.base_api}/categories`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            next: {
                tags: ["categories"],
            },
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP ${res.status}`);
        }

        const result = await res.json();
        return result.data ?? [];
    } catch (error: any) {
        console.error("getCategories error:", error);
        throw new Error(error?.message || "Failed to fetch categories");
    }
};


