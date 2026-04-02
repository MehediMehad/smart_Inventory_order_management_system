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
      email: "rbmar@bltiwd.com",
      password: "Mehedi1!",
    },
  });

  const { setIsLoading } = useUser();

  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);

  const redirect = searchParams.get("redirectPath");
  const router = useRouter();

  const {
    formState: { isSubmitting },
    reset,
  } = form;

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const res = await loginUser(data);

      setIsLoading(true);
      if (res?.success) {
        reset();
        toast.success(res?.message);
        if (redirect) {
          router.push(redirect);
        } else {
          router.push("/");
        }
      } else {
        toast.error(res?.message);
      }
    } catch (err: any) {
      console.error(err);
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
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="mb-2">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      className=""
                      type="email"
                      {...field}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="relative mb-2">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      className=""
                      type={showPassword ? "text" : "password"}
                      {...field}
                      value={field.value}
                    />
                  </FormControl>
                  <button
                    type="button"
                    className="absolute right-3 top-11 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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

            {/* <div className="flex justify-end mt-1">
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div> */}

            <Button
              disabled={isSubmitting ? true : false}
              type="submit"
              className="mt-4 py-5 text-base w-full rounded-xl bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? "Logging...." : "Login"}
            </Button>
          </form>
        </Form>
        <p className="text-sm text-gray-600 text-center my-3">
          <Link href="/forgot-password" className="text-primary">
            Forgot your password?
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
