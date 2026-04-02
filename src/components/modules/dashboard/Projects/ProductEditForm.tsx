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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

import { getSingleProduct, updateProduct } from "@/services/Product";
import { getAllCategories } from "@/services/Category";
import { createProductSchema } from "@/schemas";

interface CategoryOption {
  id: string;
  name: string;
}

type ProductEditFormProps = {
  productId: string;
};

export default function ProductEditForm({ productId }: ProductEditFormProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      categoryId: "",
      price: 0,
      stockQuantity: 0,
      minStockThreshold: 0,
      status: "ACTIVE" as const,
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
        console.error("Failed to fetch categories:", error);
        toast.error("Failed to load categories");
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch Product Data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const product = await getSingleProduct(productId);

        if (product) {
          form.reset({
            name: product.name,
            categoryId: product.categoryId,
            price: Number(product.price),
            stockQuantity: Number(product.stockQuantity),
            minStockThreshold: Number(product.minStockThreshold),
            status: product.status,
          });
        }
      } catch (error) {
        toast.error("Failed to load product data");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId, form]);

  const onSubmit = async (data: any) => {
    if (!data.categoryId) {
      toast.error("Please select a category");
      return;
    }

    const res = await updateProduct(productId, data);

    if (res?.success) {
      toast.success(res.message || "Product updated successfully!");
      router.push("/dashboard/products");
    } else {
      toast.error(res?.message || "Failed to update product");
    }
  };

  if (isLoading) {
    return <div className="text-center py-20">Loading product data...</div>;
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl">Edit Product</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Update product information
          </p>
        </div>
        <Link
          href="/dashboard/products"
          className="flex items-center gap-2 text-sm hover:text-primary"
        >
          <ArrowLeft size={18} />
          Back to Products
        </Link>
      </CardHeader>

      <CardContent>
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
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Dynamic Category Select */}
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
                              loadingCategories
                                ? "Loading categories..."
                                : "Select category"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.length > 0 ? (
                          categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="" disabled>
                            No categories available
                          </SelectItem>
                        )}
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
                    <FormLabel>Minimum Stock Threshold</FormLabel>
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
                        <SelectItem value="OUT_OF_STOCK">
                          Out of Stock
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting || loadingCategories}
            >
              {form.formState.isSubmitting
                ? "Updating Product..."
                : "Update Product"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
