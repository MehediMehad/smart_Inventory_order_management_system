"use client";

import { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { NMTable } from "@/components/shared/core/NMTable";
import { TablePagination } from "@/components/shared/core/NMTable/TablePagination";
import { Plus, Eye } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { getAllOrders } from "@/services/Order";
import { TMeta, TOrder } from "@/types";

const OrderManagement = () => {
  const [orders, setOrders] = useState<TOrder[]>([]);
  const [meta, setMeta] = useState<TMeta>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [loading, setLoading] = useState(false);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const result = await getAllOrders({
        searchTerm: debouncedSearchTerm,
        status: statusFilter as any,
        page: currentPage,
        limit,
      });

      // Handle both possible response structures
      const data = Array.isArray(result) ? result : result?.data || [];
      const metaData = result?.meta || {
        page: currentPage,
        limit,
        total: data.length,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      };

      setOrders(data);
      setMeta(metaData);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      toast.error("Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [debouncedSearchTerm, statusFilter, currentPage, limit]);

  const columns: ColumnDef<TOrder>[] = [
    {
      accessorKey: "orderId",
      header: "Order ID",
      cell: ({ row }) => (
        <span className="font-mono font-medium">{row.original.orderId}</span>
      ),
    },
    {
      accessorKey: "customerName",
      header: "Customer Name",
      cell: ({ row }) => (
        <div className="font-medium">{row.original.customerName}</div>
      ),
    },
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate">{row.original.address}</div>
      ),
    },
    {
      accessorKey: "contact",
      header: "Contact",
    },
    {
      accessorKey: "totalPrice",
      header: "Total Price",
      cell: ({ row }) => (
        <div className="font-semibold">${row.original.totalPrice}</div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Order Date",
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt);
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        const colorClass =
          status === "PENDING"
            ? "bg-yellow-100 text-yellow-800"
            : status === "CONFIRMED"
              ? "bg-blue-100 text-blue-800"
              : status === "SHIPPED"
                ? "bg-purple-100 text-purple-800"
                : status === "DELIVERED"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800";

        return (
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${colorClass}`}
          >
            {status}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Link
          href={`/dashboard/orders/details/${row.original.id}`}
          className="inline-flex items-center justify-center p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
          title="View Order Details"
        >
          <Eye size={18} />
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header + Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Order Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage customer orders and statuses.
          </p>
        </div>

        <Link
          href="/dashboard/orders/create"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
        >
          <Plus size={18} />
          Create New Order
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by customer name, order ID or contact..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Status Filter */}
        {/* TODO: IMPROVE THIS */}
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-white"
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <NMTable columns={columns} data={orders} isLoading={loading} />

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
          pageSizeOptions={[5, 10, 20, 25, 50]}
        />
      )}
    </div>
  );
};

export default OrderManagement;
