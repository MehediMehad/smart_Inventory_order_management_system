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

import { forgotPassword } from "@/services/Auth";
import { forgotPasswordSchema } from "./forgotPasswordValidation";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.png";

const ForgotPasswordForm = () => {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const {
    formState: { isSubmitting },
    reset,
  } = form;

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const res = await forgotPassword(data);

      if (res?.success) {
        toast.success(res?.message || "OTP sent to your email");

        reset();

        router.push(`/verify-otp?email=${data.email}&type=FORGET`);
      } else {
        toast.error(res?.message);
      }
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
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
          className="object-contain"
          quality={100}
        />

        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Forgot Password
        </h2>

        <p className="text-gray-500 text-sm text-center">
          Enter your email to receive a password reset OTP
        </p>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="mb-3">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              disabled={isSubmitting}
              type="submit"
              className="mt-4 py-5 text-base w-full rounded-xl bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? "Sending OTP..." : "Send OTP"}
            </Button>
          </form>
        </Form>

        <p className="text-sm text-gray-600 text-center my-3">
          Remember your password?
          <Link href="/login" className="text-primary ml-1">
            Login
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};

export default ForgotPasswordForm;
