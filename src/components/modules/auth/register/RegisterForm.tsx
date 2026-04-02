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
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationSchema } from "./registerValidation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { registerUser } from "@/services/Auth";
import { useState } from "react";

import { Eye, EyeOff } from "lucide-react";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    resolver: zodResolver(registrationSchema),
  });

  const {
    formState: { isSubmitting },
    reset,
  } = form;

  const password = form.watch("password");
  const passwordConfirm = form.watch("passwordConfirm");
  const router = useRouter();

  const { setIsLoading } = useUser();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const formData = {
        name: data.name,
        email: data.email,
        password: data.password,
      };

      const res = await registerUser(formData);

      setIsLoading(true);
      if (res?.success) {
        toast.success(res?.message);

        reset();

        setTimeout(() => {
          router.replace(`/verify-otp?email=${data?.email}&type=VERIFY_EMAIL`);
        }, 300);
      } else {
        toast.error(res?.message);
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <Card className="w-full max-w-lg shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="space-y-4">
        <div className="flex flex-col items-center space-y-2">
          {/* <Logo /> */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Register
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Join us today and start your journey!
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex gap-x-4">
              {/* <div className="w-full">
                <div className="flex gap-4 ">
                  {imageFiles.length !== 1 && (
                    <UserImageUploader
                      setImageFiles={setImageFiles}
                      setImagePreview={setImagePreview}
                      label="Upload Image"
                      className="mt-1 w-full"
                    />
                  )}
                  <UserImagePreviewer
                    className="flex flex-wrap gap-4"
                    setImageFiles={setImageFiles}
                    imagePreview={imagePreview}
                    setImagePreview={setImagePreview}
                  />
                </div>
              </div> */}
              <div className="w-full flex flex-col gap-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="mb-2">
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="mb-2">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          {...field}
                          value={field.value || ""}
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
                          type={showPassword ? "text" : "password"}
                          {...field}
                          value={field.value || ""}
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
                <FormField
                  control={form.control}
                  name="passwordConfirm"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          {...field}
                          value={field.value || ""}
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

                      {passwordConfirm && password !== passwordConfirm ? (
                        <FormMessage> Password does not match </FormMessage>
                      ) : (
                        <FormMessage />
                      )}
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Button
              disabled={passwordConfirm && password !== passwordConfirm}
              type="submit"
              className="mt-5 w-full"
            >
              {isSubmitting ? "Registering...." : "Register"}
            </Button>
          </form>
        </Form>
        <p className="text-sm text-gray-600 text-center my-3">
          Already have an account ?
          <Link href="/login" className="text-primary">
            {" "}
            Login
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
