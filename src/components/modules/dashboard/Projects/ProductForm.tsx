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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useState, useEffect } from "react";

import { createProduct, updateProduct } from "@/services/Product";
import { getAllCategories } from "@/services/Category";
import { createProductSchema } from "@/schemas";

interface CategoryOption {
  id: string;
  name: string;
}

type ProductFormProps = {
  mode: "create" | "edit";
  defaultValues?: any;
  productId?: string;
  onSuccess: (product: any) => void;
  onCancel: () => void;
};

export default function ProductForm({
  mode,
  defaultValues = {},
  productId,
  onSuccess,
  onCancel,
}: ProductFormProps) {
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const form = useForm({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      categoryId: "",
      price: 0,
      stockQuantity: 0,
      minStockThreshold: 0,
      status: "ACTIVE",
      ...defaultValues,
    },
  });

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const result = await getAllCategories();
        setCategories(Array.isArray(result) ? result : []);
      } catch (error) {
        toast.error("Failed to load categories");
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const onSubmit = async (data: any) => {
    if (!data.categoryId) {
      toast.error("Please select a category");
      return;
    }

    let res;
    if (mode === "create") {
      res = await createProduct(data);
    } else {
      if (!productId) return;
      res = await updateProduct(productId, data);
    }

    if (res?.success) {
      toast.success(
        res.message ||
          `Product ${mode === "create" ? "created" : "updated"} successfully!`,
      );
      onSuccess(res.data);
      if (mode === "create") form.reset();
    } else {
      toast.error(res?.message || "Something went wrong");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Wireless Headphones" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={loadingCategories}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          loadingCategories ? "Loading..." : "Select category"
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
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
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price ($)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stockQuantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="minStockThreshold"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Min Stock Threshold</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting || loadingCategories}
          >
            {form.formState.isSubmitting
              ? mode === "create"
                ? "Creating..."
                : "Updating..."
              : mode === "create"
                ? "Create Product"
                : "Update Product"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
