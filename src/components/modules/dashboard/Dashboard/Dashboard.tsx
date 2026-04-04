// src/components/modules/dashboard/Dashboard.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Package, DollarSign, Activity } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { getDashboardStats } from "@/services/Dashboard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DashboardData {
  insights: {
    totalOrdersToday: number;
    pendingOrders: number;
    lowStockCount: number;
    revenueToday: number;
  };
  weeklyAnalytics: Array<{
    date: string;
    revenue: number;
    orderCount: number;
  }>;
  productSummary: Array<{
    name: string;
    stock: number;
    status: string;
  }>;
  activityLogs: Array<{
    id: string;
    message: string;
    activityType: ActivityType;
    createdAt: string;
  }>;
}

type ActivityType =
  | "ORDER_PLACED"
  | "ORDER_CONFIRMED"
  | "ORDER_CANCELLED"
  | "ORDER_SHIPPED"
  | "ORDER_DELIVERED"
  | "PRODUCT_ADDED"
  | "PRODUCT_UPDATED"
  | "PRODUCT_DELETED"
  | "RESTOCK_PRODUCT"
  | "RESTOCK_WARNING";

const activityTypeConfig: Record<
  ActivityType,
  { label: string; color: string }
> = {
  ORDER_PLACED: {
    label: "Order Placed",
    color: "bg-yellow-100 text-yellow-800",
  },
  ORDER_CONFIRMED: {
    label: "Confirmed",
    color: "bg-blue-100 text-blue-800",
  },
  ORDER_SHIPPED: {
    label: "Shipped",
    color: "bg-purple-100 text-purple-800",
  },
  ORDER_DELIVERED: {
    label: "Delivered",
    color: "bg-green-100 text-green-800",
  },
  ORDER_CANCELLED: {
    label: "Cancelled",
    color: "bg-red-100 text-red-800",
  },
  PRODUCT_ADDED: {
    label: "Product Added",
    color: "bg-emerald-100 text-emerald-800",
  },
  PRODUCT_UPDATED: {
    label: "Updated",
    color: "bg-orange-100 text-orange-800",
  },
  PRODUCT_DELETED: {
    label: "Deleted",
    color: "bg-rose-100 text-rose-800",
  },
  RESTOCK_PRODUCT: {
    label: "Restocked",
    color: "bg-indigo-100 text-indigo-800",
  },
  RESTOCK_WARNING: {
    label: "Low Stock",
    color: "bg-amber-100 text-amber-800",
  },
};

const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getDashboardStats();
        setData(result);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-lg">Loading dashboard...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20 text-red-500">
        Failed to load dashboard data
      </div>
    );
  }

  const { insights, weeklyAnalytics, productSummary, activityLogs } = data;

  // Format weekly data for Recharts (show only last 7 days)
  const chartData = weeklyAnalytics.map((item) => ({
    date: new Date(item.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    revenue: item.revenue,
    orders: item.orderCount,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Overview of your business today
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Orders
            </CardTitle>
            <Clock className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              {insights.totalOrdersToday}
            </div>
            <p className="text-xs text-muted-foreground">Orders placed today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Orders
            </CardTitle>
            <div className="h-5 w-5 rounded-full bg-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-yellow-600">
              {insights.pendingOrders}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Low Stock Items
            </CardTitle>
            <Package className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-red-600">
              {insights.lowStockCount}
            </div>
            <p className="text-xs text-muted-foreground">Need restock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenue Today</CardTitle>
            <DollarSign className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-600">
              ${insights.revenueToday.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Today's revenue</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        {/* Weekly Revenue Chart */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Weekly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Low Stock Products */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Low Stock Alert</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {productSummary.map((product, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center border-b pb-3 last:border-0"
                >
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Stock: {product.stock}
                    </p>
                  </div>
                  <Badge
                    variant={
                      product.status === "Low Stock"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {product.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Recent Activity
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-5 max-h-[420px] overflow-y-auto pr-2">
            {activityLogs.length > 0 ? (
              activityLogs.map((log) => {
                const config = activityTypeConfig[log.activityType];
                const date = new Date(log.createdAt);

                return (
                  <div key={log.id} className="flex gap-4 group">
                    {/* Timeline Dot */}
                    <div className="relative">
                      <div className="h-3 w-3 rounded-full bg-primary mt-2" />
                      <div className="absolute top-4 left-[5px] w-[2px] h-full bg-gray-200 group-last:hidden" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium text-gray-900 leading-relaxed">
                          {log.message}
                        </p>

                        <Badge
                          className={`text-xs px-2 py-1 whitespace-nowrap ${config?.color}`}
                        >
                          {config?.label}
                        </Badge>
                      </div>

                      {/* Time */}
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(date, { addSuffix: true })} •{" "}
                        {date.toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-muted-foreground text-center py-12">
                No recent activity
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
