"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { resendOtp, verifyOtp } from "@/services/Auth";

import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import logo from "@/assets/logo.png";

import { verifyOtpSchema } from "./verifyOtpSchema";

const RESEND_TIME = 60;

export default function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email");
  const type = searchParams.get("type");

  const [timer, setTimer] = useState(RESEND_TIME);
  const [isResending, setIsResending] = useState(false);

  const isExpired = timer === 0;

  const form = useForm({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const {
    formState: { isSubmitting },
    reset,
  } = form;

  // email check
  useEffect(() => {
    if (!email) {
      toast.error("Invalid verification request");
      router.push("/login");
    }
  }, [email, router]);

  // timer
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (!email) return;
    if (!type) return;

    try {
      const res = await verifyOtp({
        email,
        otp: Number(data.otp),
        type,
      });

      if (res?.success) {
        const token = res?.data;
        toast.success(res?.message || "OTP verified successfully");
        reset();
        router.push(
          `${type === "FORGET" ? `/reset-password?token=${token}` : "/"}`,
        );
      } else {
        toast.error(res?.message);
      }
    } catch (err: any) {
      toast.error(err?.message || "OTP verification failed");
    }
  };

  useEffect(() => {
    const otp = form.watch("otp");

    if (otp?.length === 6) {
      form.handleSubmit(onSubmit)();
    }
  }, [form.watch("otp")]);

  const handleResendOtp = async () => {
    if (!email) return;
    const data = { email };
    try {
      setIsResending(true);

      const res = await resendOtp(data);

      if (res?.success) {
        toast.success(res?.message || "OTP resent successfully");

        reset(); // react-hook-form reset
        setTimer(RESEND_TIME);
      } else {
        toast.error(res?.message);
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to resend OTP");
    } finally {
      setIsResending(false);
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

        <h2 className="text-2xl font-bold text-gray-800">Verify Your Email</h2>

        <p className="text-gray-500 text-sm text-center">
          Enter the OTP sent to {email}
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem className="flex justify-center">
                  <FormControl>
                    <InputOTP
                      maxLength={6}
                      {...field}
                      disabled={isSubmitting || isExpired}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} className="w-12 h-12 text-xl" />
                        <InputOTPSlot index={1} className="w-12 h-12 text-xl" />
                        <InputOTPSlot index={2} className="w-12 h-12 text-xl" />
                        <InputOTPSlot index={3} className="w-12 h-12 text-xl" />
                        <InputOTPSlot index={4} className="w-12 h-12 text-xl" />
                        <InputOTPSlot index={5} className="w-12 h-12 text-xl" />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  {/* <FormMessage /> */}
                </FormItem>
              )}
            />

            {/* <Button
                type="submit"
                className="w-full mt-5"
                disabled={isSubmitting || isExpired}
              >
                {isSubmitting ? "Verifying..." : "Verify OTP"}
              </Button> */}
          </form>
        </Form>

        {isExpired && (
          <p className="text-red-500 text-sm text-center">
            OTP expired. Please request a new one.
          </p>
        )}

        <div className="text-center text-sm">
          {timer > 0 ? (
            <p className="text-gray-500">
              Resend OTP in <span className="font-semibold">{timer}s</span>
            </p>
          ) : (
            <button
              onClick={handleResendOtp}
              disabled={isResending}
              className="text-primary font-medium hover:underline disabled:opacity-50"
            >
              {isResending ? "Resending..." : "Resend OTP"}
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
