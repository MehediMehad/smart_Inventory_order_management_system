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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { registerUser } from "@/services/Auth";
import { useState } from "react";
import UserImagePreviewer from "@/components/shared/core/UserImageUploder/UserImagePreviewer";
import UserImageUploader from "@/components/shared/core/UserImageUploder/UserImageUploader";

// services/authService/index.ts
// export const registerUser = async (userData: FormData) => {
//   try {
//     const res = await fetch(`${config.base_api}/user/registration`, {
//       method: "POST",
//       body: userData,
//     });

//     const result = await res.json();
//     if (result.success) {
//       (await cookies()).set("accessToken", result.data.accessToken);
//       (await cookies()).set("refreshToken", result?.data?.refreshToken);
//     }

//     return result;
//   } catch (error: any) {
//     return Error(error);
//   }
// };

export default function RegisterForm() {
  const form = useForm({
    resolver: zodResolver(registrationSchema),
  });
  const [imageFiles, setImageFiles] = useState<File[] | []>([]);
  const [imagePreview, setImagePreview] = useState<string[] | []>([]);

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
      const formData = new FormData();
      formData.append("data", JSON.stringify(data));
      formData.append("file", imageFiles[0]);
      const res = await registerUser(formData);

      setIsLoading(true);
      if (res?.success) {
        reset();
        toast.success(res?.message);
        router.push("/");
      } else {
        toast.error(res?.message);
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const genderOptions = [
    { value: "MALE", label: "Male" },
    { value: "FEMALE", label: "Female" },
    { value: "OTHER", label: "Other" },
  ];

  return (
    <Card className="w-full max-w-5xl shadow-lg rounded-xl overflow-hidden">
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
              <div className="w-full">
                {/* <div className="flex justify-between items-center border-t border-b py-3">
                <FormLabel>Image</FormLabel>
              </div> */}
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
                    setImageFiles={setImageFiles}
                    imagePreview={imagePreview}
                    setImagePreview={setImagePreview}
                  />
                </div>
              </div>
              <div className="w-full flex flex-col gap-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
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
                    <FormItem>
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
                  name="contactNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Number</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
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
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>gender</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {genderOptions.map((gender) => (
                            <SelectItem
                              key={gender?.value}
                              value={gender?.value}
                            >
                              {gender?.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
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
                  name="passwordConfirm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>

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
            Login
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
