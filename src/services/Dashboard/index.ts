// src/services/Dashboard/index.ts
"use server";

import { serverFetch } from "@/lib/serverFetch";
import { getCookie } from "@/services/Auth/verifyToken";

export const getDashboardStats = async () => {
    try {
        const accessToken = await getCookie("accessToken");

        const response = await serverFetch.get("/dashboard/stats", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch dashboard stats");
        }

        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error("Dashboard stats error:", error);
        throw error;
    }
};