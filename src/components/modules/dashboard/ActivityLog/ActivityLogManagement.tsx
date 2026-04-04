// src/components/modules/dashboard/ActivityLog/ActivityLogManagement.tsx
"use client";

import { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { NMTable } from "@/components/shared/core/NMTable";
import { TablePagination } from "@/components/shared/core/NMTable/TablePagination";
import { Search, Clock } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

import { getAllActivityLogs } from "@/services/ActivityLog";

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

type TActivityLog = {
  id: string;
  message: string;
  activityType: ActivityType;
  createdAt: string;
};

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

type TMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

const ActivityLogManagement = () => {
  const [logs, setLogs] = useState<TActivityLog[]>([]);
  const [meta, setMeta] = useState<TMeta>({
    page: 1,
    limit: 25,
    total: 0,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [activityTypeFilter, setActivityTypeFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(25);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 600);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchActivityLogs = async () => {
    setLoading(true);
    try {
      const result = await getAllActivityLogs({
        searchTerm: debouncedSearchTerm,
        activityType: activityTypeFilter || undefined,
        page: currentPage,
        limit,
      });

      console.log(result, "🐼🐼");

      setLogs(result.data || []);
      setMeta({
        page: result.meta?.page || 1,
        limit: result.meta?.limit || 25,
        total: result.meta?.total || 0,
        totalPages: result.meta?.totalPages || 1,
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to load activity logs");
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivityLogs();
  }, [debouncedSearchTerm, activityTypeFilter, currentPage, limit]);

  const columns: ColumnDef<TActivityLog>[] = [
    {
      accessorKey: "message",
      header: "Activity",
      cell: ({ row }) => (
        <div className="max-w-2xl">
          <p className="text-sm leading-relaxed">{row.original.message}</p>
        </div>
      ),
    },
    {
      accessorKey: "activityType",
      header: "Type",
      cell: ({ row }) => {
        const type = row.original.activityType;
        const config = activityTypeConfig[type];

        return (
          <span
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${config?.color}`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {config?.label}
          </span>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Time",
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt);

        return (
          <div className="text-sm">
            <p className="font-medium text-gray-900">
              {formatDistanceToNow(date, { addSuffix: true })}
            </p>
            <p className="text-xs text-muted-foreground">
              {date.toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Activity Logs</h1>
          <p className="text-muted-foreground">
            Track all system activities and changes
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search activity logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <select
          value={activityTypeFilter}
          onChange={(e) => {
            setActivityTypeFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-white min-w-[180px]"
        >
          <option value="">All Activities</option>
          <option value="ORDER_CREATED">Order Created</option>
          <option value="ORDER_CONFIRMED">Order Confirmed</option>
          <option value="ORDER_SHIPPED">Order Shipped</option>
          <option value="ORDER_DELIVERED">Order Delivered</option>
          <option value="ORDER_CANCELLED">Order Cancelled</option>
          <option value="PRODUCT_RESTOCKED">Product Restocked</option>
        </select>
      </div>

      {/* Table */}
      <NMTable columns={columns} data={logs} isLoading={loading} />

      {/* Pagination */}
      {meta.total > 0 && (
        <TablePagination
          currentPage={meta.page}
          totalPages={meta.totalPages}
          pageSize={meta.limit}
          totalItems={meta.total}
          onPageChange={setCurrentPage}
          onPageSizeChange={(newSize) => {
            setLimit(newSize);
            setCurrentPage(1);
          }}
          pageSizeOptions={[10, 25, 50, 100]}
        />
      )}
    </div>
  );
};

export default ActivityLogManagement;
