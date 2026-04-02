"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { resetPassword } from "@/services/Auth";
import { resetPasswordSchema } from "./resetPasswordValidation";

import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import logo from "@/assets/logo.png";

const ResetPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token"); // backend যদি token দেয়

  if (!token) {
    router.push("/login");
  }

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  const {
    formState: { isSubmitting },
    reset,
  } = form;

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const payload = {
        token,
        password: data.password,
      };

      console.log(payload, "🐼🐼");

      const res = await resetPassword(payload);
      console.log(res, "🐼🐼");

      if (res?.success) {
        toast.success(res?.message || "Password reset successful");

        reset();

        router.push("/login");
      } else {
        toast.error(res?.message);
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to reset password");
    }
  };

  return (
    <Card className="w-full max-w-lg shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="flex flex-col items-center space-y-2 p-6">
        <Image
          src={logo}
          width={100}
          height={100}
          alt="Smart Money Manager Logo"
        />

        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Reset Password
        </h2>

        <p className="text-gray-500 text-sm text-center">
          Enter your new password
        </p>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="relative mb-3">
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>

                  <button
                    type="button"
                    className="absolute right-3 top-11 -translate-y-1/2 text-gray-400"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="relative mb-3">
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>

                  <button
                    type="button"
                    className="absolute right-3 top-11 -translate-y-1/2 text-gray-400"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              disabled={isSubmitting}
              type="submit"
              className="mt-4 py-5 text-base w-full rounded-xl bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ResetPasswordForm;
