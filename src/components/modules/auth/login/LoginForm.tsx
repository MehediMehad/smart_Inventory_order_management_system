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
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUser } from "@/services/Auth";
import { toast } from "sonner";
import { loginSchema } from "./loginValidation";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import logo from "@/assets/logo.png";

export default function LoginForm() {
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { setIsLoading } = useUser();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const redirect = searchParams.get("redirectPath");
  const router = useRouter();

  const {
    formState: { isSubmitting },
    reset,
  } = form;

  // Normal Login
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const res = await loginUser(data);

      setIsLoading(true);
      if (res?.success) {
        reset();
        toast.success(res?.message || "Login successful");
        if (redirect) {
          router.push(redirect);
        } else {
          router.push("/");
        }
      } else {
        toast.error(res?.message || "Login failed");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // Demo Login (Quick Login Button)
  const handleDemoLogin = async () => {
    setIsDemoLoading(true);

    const demoData = {
      email: "admin@example.com",
      password: "yourStrongPassword",
    };

    try {
      const res = await loginUser(demoData);

      if (res?.success) {
        toast.success("Demo login successful! Welcome back.");
        router.push("/");
      } else {
        toast.error(res?.message || "Demo login failed");
      }
    } catch (error) {
      toast.error("Demo login failed. Please try again.");
    } finally {
      setIsDemoLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="flex flex-col items-center space-y-2 p-6 rounded-t-xl">
        {/* Logo */}
        <Image
          src={logo}
          width={100}
          height={100}
          alt="Logo"
          className="object-contain"
          quality={100}
        />

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Welcome to Align <br />
          Admin Panel
        </h2>

        {/* Subtitle */}
        <p className="text-gray-500 text-sm text-center">
          Manage your application smarter and easier
        </p>
      </CardHeader>

      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      {...field}
                    />
                  </FormControl>
                  <button
                    type="button"
                    className="absolute right-3 top-10 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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

            <Button
              disabled={isSubmitting}
              type="submit"
              className="w-full py-5 text-base rounded-xl"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Form>

        {/* Demo Login Button */}
        <div className="mt-6">
          <Button
            variant="outline"
            onClick={handleDemoLogin}
            disabled={isDemoLoading}
            className="w-full py-5 text-base rounded-xl border-dashed"
          >
            {isDemoLoading
              ? "Logging in as Demo..."
              : "Demo Login (Quick Access)"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
