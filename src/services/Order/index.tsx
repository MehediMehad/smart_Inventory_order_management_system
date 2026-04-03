// src/services/Order/index.ts
"use server";

import { revalidateTag } from "next/cache";
import { serverFetch } from "@/lib/serverFetch";
import { getCookie } from "@/services/Auth/verifyToken";
import { TCreateOrderForm } from "@/schemas";

const TAG = "orders";

export const createOrder = async (data: TCreateOrderForm) => {
  try {
    const accessToken = await getCookie("accessToken");

    const response = await serverFetch.post("/order", {
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
        message: errorData.message || "Failed to create order",
      };
    }

    const result = await response.json();
    revalidateTag(TAG, { expire: 0 });

    return {
      success: true,
      message: result.message || "Order created successfully",
      data: result.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to create order",
    };
  }
};

type TPrams = {
  limit?: number;
  page?: number;
  searchTerm?: string;
  status?: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  startDate?: string;
  endDate?: string;
};

export const getAllOrders = async (params: TPrams) => {
  const {
    searchTerm,
    status,
    startDate,
    endDate,
    page = 1,
    limit = 10,
  } = params;
  try {
    const accessToken = await getCookie("accessToken");

    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (searchTerm) {
      queryParams.set("searchTerm", searchTerm);
    }

    if (status) {
      queryParams.set("status", status);
    }
    if (startDate && endDate) {
      queryParams.set("startDate", startDate);
      queryParams.set("endDate", endDate);
    }

    const response = await serverFetch.get(`/order?${queryParams.toString()}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      next: { tags: [TAG] },
    });

    if (!response.ok) {
      return [];
    }

    const result = await response.json();
    return result || [];
  } catch (error) {
    console.error("getAllOrders error:", error);
    return [];
  }
};

export const getSingleOrder = async (id: string) => {
  try {
    const accessToken = await getCookie("accessToken");

    const response = await serverFetch.get(`/order/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) return null;

    const result = await response.json();
    return result.data || null;
  } catch (error) {
    console.error("getSingleOrder error:", error);
    return null;
  }
};

export const updateOrderStatus = async (id: string, status: string) => {
  try {
    const accessToken = await getCookie("accessToken");

    const response = await serverFetch.patch(`/order/update-status/${id}`, {
      body: JSON.stringify({ status }),
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorData.message || "Failed to update order status",
      };
    }

    const result = await response.json();
    revalidateTag(TAG, { expire: 0 });

    return {
      success: true,
      message: result.message || "Order status updated successfully",
      data: result.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update order status",
    };
  }
};
