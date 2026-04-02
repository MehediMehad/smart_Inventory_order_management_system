// src/components/modules/dashboard/CategoryForm.tsx  (or wherever it is)
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TCategoryForm, createCategorySchema } from "@/schemas"; // adjust path if needed
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createCategory, updateCategory } from "@/services/Category";
import { toast } from "sonner";
import { TCategory } from "@/types";

type CategoryFormProps = {
  mode: "create" | "edit";
  defaultValues?: Partial<TCategoryForm>;
  categoryId?: string;
  onSuccess: (category: TCategory) => void;
  onCancel: () => void;
};

export default function CategoryForm({
  mode,
  defaultValues = { name: "" },
  categoryId,
  onSuccess,
  onCancel,
}: CategoryFormProps) {
  const form = useForm<TCategoryForm>({
    resolver: zodResolver(createCategorySchema),
    defaultValues,
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (values: TCategoryForm) => {
    let res;

    if (mode === "create") {
      res = await createCategory(values);
    } else {
      if (!categoryId) return;
      res = await updateCategory(categoryId, values);
    }

    if (res.success) {
      toast.success(
        res.message ||
          `Category ${mode === "create" ? "created" : "updated"} successfully`,
      );
      onSuccess(res.data);
      if (mode === "create") form.reset();
    } else {
      toast.error(res.message || "Something went wrong");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel>Category Name</FormLabel> */}
              <FormControl>
                <Input placeholder="Enter category name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : mode === "create"
                ? "Create Category"
                : "Update Category"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
