"use server";

import config from "@/configs";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { FieldValues } from "react-hook-form";

export const registerUser = async (userData: FieldValues) => {
  try {
    const res = await fetch(`${config.base_api}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const result = await res.json();
    return result;
  } catch (error: any) {
    return Error(error);
  }
};

export const loginUser = async (userData: FieldValues) => {
  try {
    const res = await fetch(`${config.base_api}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const result = await res.json();

    if (result?.success) {
      (await cookies()).set("accessToken", result?.data?.accessToken);
      // (await cookies()).set("refreshToken", result?.data?.refreshToken);
    }

    return result;
  } catch (error: any) {
    return Error(error);
  }
};

export const verifyOtp = async (data: FieldValues) => {
  try {
    const res = await fetch(`${config.base_api}/auth/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (result?.success) {
      (await cookies()).set("accessToken", result?.data);
      // (await cookies()).set("refreshToken", result?.data?.refreshToken);
    }

    return result;
  } catch (error: any) {
    return Error(error);
  }
};

export const forgotPassword = async (data: FieldValues) => {
  try {
    const res = await fetch(`${config.base_api}/auth/forget-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result?.message || "Failed to send OTP");
    }

    return result;
  } catch (error: any) {
    throw new Error(error?.message || "Something went wrong");
  }
};

export const resetPassword = async (data: FieldValues) => {
  try {
    const res = await fetch(`${config.base_api}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    console.log(res, "🐼🐼");

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result?.message || "Failed to reset password");
    }

    return result;
  } catch (error: any) {
    throw new Error(error?.message || "Something went wrong");
  }
};

export const resendOtp = async (data: FieldValues) => {
  try {
    const res = await fetch(`${config.base_api}/auth/resend-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const request = await res.json();

    if (!res.ok) {
      throw new Error(request?.message || "Failed to resend OTP");
    }

    return request;
  } catch (error: any) {
    throw new Error(error?.message || "Something went wrong");
  }
};

export const getCurrentUser = async () => {
  const accessToken = (await cookies()).get("accessToken")?.value;
  let decodedData = null;

  if (accessToken) {
    decodedData = await jwtDecode(accessToken);
    return decodedData;
  } else {
    return null;
  }
};

export const getMyProfile = async () => {
  try {
    const accessToken = (await cookies()).get("accessToken")?.value;

    if (!accessToken) {
      throw new Error("No access token found");
    }

    const res = await fetch(`${config.base_api}/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      next: {
        tags: ["profile"],
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${res.status}`);
    }

    const result = await res.json();
    return result.data ?? {};
  } catch (error: any) {
    console.error("getMyProfile error:", error);
    throw new Error(error?.message || "Failed to fetch profile");
  }

};


export const logout = async () => {
  (await cookies()).delete("accessToken");
};

export const getNewToken = async () => {
  try {
    const res = await fetch(
      `${config.base_api}/auth/refresh-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: (await cookies()).get("refreshToken")!.value,
        },
      }
    );

    return res.json();
  } catch (error: any) {
    return Error(error);
  }
};
