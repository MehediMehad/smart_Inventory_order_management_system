// src/components/modules/dashboard/Restock/RestockManagement.tsx
"use client";

import { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { NMTable } from "@/components/shared/core/NMTable";
import { TablePagination } from "@/components/shared/core/NMTable/TablePagination";
import { RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  getRestockQueue,
  restockProduct,
  deleteFromQueue,
} from "@/services/Restock";
import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RestockModal from "./RestockModal";

const DeleteConfirmationModal = dynamic(
  () => import("@/components/shared/core/NMModal/DeleteConfirmationModal"),
  { ssr: false },
);

type TRestockItem = {
  id: string;
  productId: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  createdAt: string;
  product: {
    id: string;
    name: string;
    stockQuantity: number;
    minStockThreshold: number;
    price: number;
    category: { name: string };
  };
};

type TRestockMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

type TStack = {
  total: number;
  high: number;
  medium: number;
  low: number;
};

const RestockManagement = () => {
  const [restockItems, setRestockItems] = useState<TRestockItem[]>([]);
  const [stack, setStack] = useState<TStack>({
    total: 0,
    high: 0,
    medium: 0,
    low: 0,
  });
  const [meta, setMeta] = useState<TRestockMeta>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<
    "HIGH" | "MEDIUM" | "LOW" | ""
  >("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Delete Modal
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    id: "",
    productName: "",
  });

  const [restockModal, setRestockModal] = useState({
    isOpen: false,
    item: null as TRestockItem | null,
  });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchRestockQueue = async () => {
    setLoading(true);
    try {
      const result = await getRestockQueue({
        searchTerm: debouncedSearchTerm,
        priority: priorityFilter || undefined,
        page: currentPage,
        limit,
      });

      setRestockItems(result.data || []);
      setStack(result.stack || { total: 0, high: 0, medium: 0, low: 0 });
      setMeta({
        page: result.meta?.page || currentPage,
        limit: result.meta?.limit || limit,
        total: result.meta?.total || 0,
        totalPages: result.meta?.totalPages || 1,
        hasNextPage: result.meta?.hasNextPage || false,
        hasPrevPage: result.meta?.hasPrevPage || false,
      });
    } catch (error) {
      toast.error("Failed to load restock queue");
      setRestockItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestockQueue();
  }, [debouncedSearchTerm, priorityFilter, currentPage, limit]);

  // Open Restock Modal
  const openRestockModal = (item: TRestockItem) => {
    setRestockModal({ isOpen: true, item });
  };

  const closeRestockModal = () => {
    setRestockModal({ isOpen: false, item: null });
  };

  // Handle Restock Success
  const handleRestockSuccess = () => {
    toast.success("Product restocked successfully!");
    fetchRestockQueue();
    closeRestockModal();
  };

  const openDeleteModal = (id: string, productName: string) => {
    setDeleteModal({ isOpen: true, id, productName });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, id: "", productName: "" });
  };

  const handleDelete = async () => {
    if (!deleteModal.id) return;

    const res = await deleteFromQueue(deleteModal.id);
    if (res.success) {
      toast.success(res.message);
      fetchRestockQueue();
    } else {
      toast.error(res.message);
    }
    closeDeleteModal();
  };

  const handleRestock = async (item: TRestockItem) => {
    const addedQuantity = item.product.minStockThreshold + 50; // Example: restock to threshold + 50

    const res = await restockProduct({
      productId: item.productId,
      addedQuantity,
    });

    if (res.success) {
      toast.success(`Restocked ${addedQuantity} units of ${item.product.name}`);
      fetchRestockQueue();
    } else {
      toast.error(res.message);
    }
  };

  const columns: ColumnDef<TRestockItem>[] = [
    {
      accessorKey: "product.name",
      header: "Product Name",
      cell: ({ row }) => (
        <div className="font-medium">{row.original.product.name}</div>
      ),
    },
    {
      accessorKey: "product.category.name",
      header: "Category",
      cell: ({ row }) => row.original.product.category?.name || "N/A",
    },
    {
      accessorKey: "product.stockQuantity",
      header: "Current Stock",
      cell: ({ row }) => (
        <span className="font-medium">
          {row.original.product.stockQuantity}
        </span>
      ),
    },
    {
      accessorKey: "product.minStockThreshold",
      header: "Min Threshold",
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => {
        const priority = row.original.priority;
        const color =
          priority === "HIGH"
            ? "bg-red-100 text-red-800"
            : priority === "MEDIUM"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-blue-100 text-blue-800";
        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${color}`}
          >
            {priority}
          </span>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Requested At",
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="default"
            onClick={() => openRestockModal(row.original)}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Restock
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={() =>
              openDeleteModal(row.original.id, row.original.product.name)
            }
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Restock Queue</h1>
          <p className="text-muted-foreground">Manage low stock products</p>
        </div>
        <div className="text-sm text-muted-foreground">
          Total in queue: <span className="font-semibold">{stack.total}</span>
        </div>
      </div>

      {/* Stack Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold">{stack.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-red-600">High Priority</p>
            <p className="text-2xl font-bold text-red-600">{stack.high}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-yellow-600">Medium Priority</p>
            <p className="text-2xl font-bold text-yellow-600">{stack.medium}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-blue-600">Low Priority</p>
            <p className="text-2xl font-bold text-blue-600">{stack.low}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by product name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value as any)}
          className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-white"
        >
          <option value="">All Priorities</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
      </div>

      <NMTable columns={columns} data={restockItems} isLoading={loading} />

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
          pageSizeOptions={[5, 10, 20, 25]}
        />
      )}
      {/* Delete Modal */}
      <DeleteConfirmationModal
        item="Restock Request"
        name={deleteModal.productName}
        isOpen={deleteModal.isOpen}
        onOpenChange={(open) => !open && closeDeleteModal()}
        onConfirm={handleDelete}
      />

      {/* Restock Modal */}
      <RestockModal
        isOpen={restockModal.isOpen}
        item={restockModal.item}
        onClose={closeRestockModal}
        onSuccess={handleRestockSuccess}
      />
    </div>
  );
};

export default RestockManagement;
