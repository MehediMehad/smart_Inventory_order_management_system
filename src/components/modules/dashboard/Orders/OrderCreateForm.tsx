// src/components/modules/dashboard/Orders/OrderCreateForm.tsx
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
import { ArrowLeft, Plus, Trash2, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";

import { createOrder } from "@/services/Order";
import { getAllProducts } from "@/services/Product";
import { createOrderSchema, TCreateOrderForm } from "@/schemas";

interface ProductOption {
  id: string;
  name: string;
  price: number;
  stockQuantity: number;
}

const OrderCreateForm = () => {
  const router = useRouter();
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [orderItems, setOrderItems] = useState<
    {
      productId: string;
      productName: string;
      price: number;
      quantity: number;
    }[]
  >([]);

  const form = useForm<TCreateOrderForm>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      customerName: "",
      address: "",
      contact: "",
      items: [],
    },
  });

  // Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        const result = await getAllProducts();
        const activeProducts = Array.isArray(result)
          ? result.filter(
              (p: any) => p.status === "ACTIVE" && p.stockQuantity > 0,
            )
          : [];
        setProducts(activeProducts);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        toast.error("Failed to load products");
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  const selectedProductId = form.watch("items"); // We'll handle items manually

  // Calculate Total Price
  const totalPrice = useMemo(() => {
    return orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
  }, [orderItems]);

  const handleAddItem = () => {
    const productId = form.getValues("items")[0]?.productId; // Temporary field for selection
    const quantity = form.getValues("items")[0]?.quantity || 1;

    if (!productId) {
      toast.error("Please select a product");
      return;
    }

    const product = products.find((p) => p.id === productId);
    if (!product) return;

    if (quantity > product.stockQuantity) {
      toast.error(`Only ${product.stockQuantity} items available in stock`);
      return;
    }

    // Check if already added
    const existingIndex = orderItems.findIndex(
      (item) => item.productId === productId,
    );
    if (existingIndex >= 0) {
      const newQty = orderItems[existingIndex].quantity + quantity;
      if (newQty > product.stockQuantity) {
        toast.error("Not enough stock");
        return;
      }
      const updatedItems = [...orderItems];
      updatedItems[existingIndex].quantity = newQty;
      setOrderItems(updatedItems);
    } else {
      setOrderItems([
        ...orderItems,
        {
          productId: product.id,
          productName: product.name,
          price: product.price,
          quantity,
        },
      ]);
    }

    // Reset selection
    form.setValue("items", []);
  };

  const handleRemoveItem = (productId: string) => {
    setOrderItems(orderItems.filter((item) => item.productId !== productId));
  };

  const onSubmit = async (data: TCreateOrderForm) => {
    if (orderItems.length === 0) {
      toast.error("Please add at least one product to the order");
      return;
    }

    const payload = {
      customerName: data.customerName,
      address: data.address,
      contact: data.contact,
      items: orderItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };

    const res = await createOrder(payload);

    if (res?.success) {
      toast.success(res.message || "Order created successfully!");
      router.push("/dashboard/orders");
    } else {
      toast.error(res?.message || "Failed to create order");
    }
  };

  return (
    <div className=" mx-auto space-y-6 pb-10">
      <div className="flex  gap-4">
        <Link href="/dashboard/orders">
          <Button variant="secondary" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-semibold">Create New Order</h1>
          <p className="text-muted-foreground">
            Fill customer details and add products
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side - Order Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
              <p className="text-sm text-muted-foreground">
                Add products to this order
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add Item Section */}
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1">
                  <Form {...form}>
                    <FormField
                      control={form.control}
                      name="items"
                      render={() => (
                        <FormItem>
                          <FormLabel>Product</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              form.setValue("items", [
                                { productId: value, quantity: 1 },
                              ]);
                            }}
                            value={form.getValues("items")[0]?.productId || ""}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a product" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {products.map((product) => (
                                <SelectItem key={product.id} value={product.id}>
                                  {product.name} — ${product.price} (
                                  {product.stockQuantity} in stock)
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </Form>
                </div>

                <div className="w-24">
                  <Form {...form}>
                    <FormField
                      control={form.control}
                      name="items"
                      render={() => (
                        <FormItem>
                          <FormLabel>Quantity</FormLabel>
                          <Input
                            type="number"
                            min="1"
                            value={form.getValues("items")[0]?.quantity || 1}
                            onChange={(e) => {
                              const current = form.getValues("items")[0] || {
                                productId: "",
                                quantity: 1,
                              };
                              form.setValue("items", [
                                {
                                  ...current,
                                  quantity: parseInt(e.target.value) || 1,
                                },
                              ]);
                            }}
                          />
                        </FormItem>
                      )}
                    />
                  </Form>
                </div>

                <Button
                  type="button"
                  onClick={handleAddItem}
                  className="mb-0.5"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add
                </Button>
              </div>

              {/* Order Items Table */}
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-3">Product</th>
                      <th className="text-left p-3">Price</th>
                      <th className="text-center p-3">Qty</th>
                      <th className="text-right p-3">Total</th>
                      <th className="w-12"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderItems.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="text-center py-12 text-muted-foreground"
                        >
                          No items added yet. Add products above.
                        </td>
                      </tr>
                    ) : (
                      orderItems.map((item, index) => (
                        <tr key={index} className="border-t">
                          <td className="p-3 font-medium">
                            {item.productName}
                          </td>
                          <td className="p-3">${item.price}</td>
                          <td className="p-3 text-center">{item.quantity}</td>
                          <td className="p-3 text-right font-medium">
                            ${(item.price * item.quantity).toFixed(2)}
                          </td>
                          <td className="p-3">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveItem(item.productId)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side - Customer Info & Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Form {...form}>
                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Rahim Uddin" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivery Address *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="123 Elm St, Springfield"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Number / Email *</FormLabel>
                      <FormControl>
                        <Input placeholder="123-456-7890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Form>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Items ({orderItems.length})
                </span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery Charge</span>
                <span>$0.00</span>
              </div>
              <div className="border-t pt-4 flex justify-between font-semibold text-lg">
                <span>Total Amount</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardContent className="pt-0">
              <Button
                onClick={form.handleSubmit(onSubmit)}
                className="w-full"
                size="lg"
                disabled={
                  orderItems.length === 0 || form.formState.isSubmitting
                }
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Complete Order
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderCreateForm;
