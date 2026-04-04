// src/services/ActivityLog/index.ts
"use server";

import { serverFetch } from "@/lib/serverFetch";
import { getCookie } from "@/services/Auth/verifyToken";

const TAG = "activity-logs";

export const getAllActivityLogs = async (params: {
    page?: number;
    limit?: number;
    searchTerm?: string;
    activityType?: string;
}) => {
    const { page = 1, limit = 25, searchTerm, activityType } = params;

    try {
        const accessToken = await getCookie("accessToken");

        const queryParams = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });

        if (searchTerm) queryParams.set("searchTerm", searchTerm);
        if (activityType) queryParams.set("activityType", activityType);

        const response = await serverFetch.get(`/activity?${queryParams.toString()}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            cache: "no-store",
            next: { tags: [TAG] },
        });

        if (!response.ok) {
            return { data: [], meta: { page: 1, limit: 25, total: 0, totalPages: 1 } };
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("getAllActivityLogs error:", error);
        return { data: [], meta: { page: 1, limit: 25, total: 0, totalPages: 1 } };
    }
};