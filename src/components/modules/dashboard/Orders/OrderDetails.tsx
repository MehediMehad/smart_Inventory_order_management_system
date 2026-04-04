// src/components/modules/dashboard/Orders/OrderDetails.tsx
"use client";

import { useState } from "react";
import { ArrowLeft, Printer, Ban } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

import { updateOrderStatus } from "@/services/Order";
import { TOrder, TOrderStatus } from "@/types";

const statusColors: Record<TOrderStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const allowedTransitions: Record<TOrderStatus, string[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
};

export default function OrderDetails({ order }: { order: TOrder }) {
  const [currentStatus, setCurrentStatus] = useState(order.status);
  const [isUpdating, setIsUpdating] = useState(false);

  const isFinalStatus =
    currentStatus === "DELIVERED" || currentStatus === "CANCELLED";
  const allowedNext = allowedTransitions[currentStatus] || [];

  const handleStatusChange = async (newStatus: TOrderStatus) => {
    if (newStatus === currentStatus) return;

    if (!allowedNext.includes(newStatus)) {
      toast.error(`Cannot change status from ${currentStatus} to ${newStatus}`);
      return;
    }

    setIsUpdating(true);
    try {
      const res = await updateOrderStatus(order.id, newStatus);

      if (res.success) {
        setCurrentStatus(newStatus);
        toast.success(res.message || "Order status updated successfully");
      } else {
        toast.error(res.message || "Failed to update status");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    setIsUpdating(true);
    try {
      const res = await updateOrderStatus(order.id, "CANCELLED");
      if (res.success) {
        setCurrentStatus("CANCELLED");
        toast.success("Order cancelled successfully");
      } else {
        toast.error(res.message || "Failed to cancel order");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="mx-auto space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/orders">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-semibold">Order #{order.orderId}</h1>
              <Badge className={statusColors[currentStatus] || "bg-gray-100"}>
                {currentStatus}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">
              Placed on{" "}
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* <div className="flex gap-3">
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Print Invoice
          </Button>

          {currentStatus !== "DELIVERED" && currentStatus !== "CANCELLED" && (
            <Button
              variant="destructive"
              onClick={handleCancelOrder}
              disabled={isUpdating}
            >
              <Ban className="mr-2 h-4 w-4" />
              Cancel Order
            </Button>
          )}
        </div> */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Product</th>
                      <th className="text-right py-3 px-4">Price</th>
                      <th className="text-center py-3 px-4">Quantity</th>
                      <th className="text-right py-3 px-4">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => (
                      <tr key={item.id} className="border-b last:border-0">
                        <td className="py-4 px-4 font-medium">
                          {item.product.name}
                        </td>
                        <td className="py-4 px-4 text-right">${item.price}</td>
                        <td className="py-4 px-4 text-center">
                          {item.quantity}
                        </td>
                        <td className="py-4 px-4 text-right font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-8 flex justify-end">
                <div className="w-72 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${order.totalPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>$0.00</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>${order.totalPrice}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium">{order.customerName}</p>
                <p className="text-sm text-muted-foreground">{order.contact}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Delivery Address
                </p>
                <p className="text-sm">{order.address}</p>
              </div>
            </CardContent>
          </Card>

          {/* Update Status */}
          <Card>
            <CardHeader>
              <CardTitle>Update Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={currentStatus}
                onValueChange={handleStatusChange}
                disabled={isUpdating}
              >
                <SelectTrigger
                  disabled={
                    currentStatus === "DELIVERED" ||
                    currentStatus === "CANCELLED"
                  }
                >
                  <SelectValue placeholder={currentStatus} />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value={currentStatus} disabled>
                    {currentStatus}
                  </SelectItem>

                  {allowedNext.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-3">
                Only valid transitions are shown
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
