// src/components/modules/dashboard/ProductManagement/ProductManagement.tsx
"use client";

import { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { NMTable } from "@/components/shared/core/NMTable";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { getAllProducts, deleteProduct } from "@/services/Product";
import dynamic from "next/dynamic";

const DeleteConfirmationModal = dynamic(
  () => import("@/components/shared/core/NMModal/DeleteConfirmationModal"),
  { ssr: false },
);

export interface TProduct {
  id: string;
  name: string;
  price: number;
  stockQuantity: number;
  minStockThreshold: number;
  status: "ACTIVE" | "OUT_OF_STOCK";
  category: { name: string };
  createdAt: string;
  updatedAt: string;
}

const ProductManagement = () => {
  const [products, setProducts] = useState<TProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    productId: "",
    productName: "",
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const result = await getAllProducts();
      setProducts(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openDeleteModal = (id: string, name: string) => {
    setDeleteModal({ isOpen: true, productId: id, productName: name });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, productId: "", productName: "" });
  };

  const handleDelete = async () => {
    if (!deleteModal.productId) return;

    try {
      const res = await deleteProduct(deleteModal.productId);
      if (res?.success) {
        toast.success(res.message || "Product deleted successfully");
        fetchProducts();
      } else {
        toast.error(res?.message || "Failed to delete product");
      }
    } catch (error) {
      toast.error("Something went wrong while deleting the product");
    } finally {
      closeDeleteModal();
    }
  };

  const columns: ColumnDef<TProduct>[] = [
    {
      accessorKey: "name",
      header: "Product Name",
      cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => <div>{row.original.category?.name || "N/A"}</div>,
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => (
        <div className="font-medium">${row.original.price}</div>
      ),
    },
    {
      accessorKey: "stockQuantity",
      header: "Stock",
      cell: ({ row }) => (
        <div className="font-medium">{row.original.stockQuantity}</div>
      ),
    },
    {
      accessorKey: "minStockThreshold",
      header: "Min Threshold",
      cell: ({ row }) => <div>{row.original.minStockThreshold}</div>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <span
            className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
              status === "ACTIVE"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {status}
          </span>
        );
      },
    },
    {
      id: "details",
      header: "Details",
      cell: ({ row }) => (
        <Link
          href={`/dashboard/products/details/${row.original.id}`}
          className="inline-flex items-center justify-center p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
        >
          <Eye size={18} />
        </Link>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/products/edit/${row.original.id}`}
            className="p-2 text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
            title="Edit Product"
          >
            <Edit size={18} />
          </Link>

          <button
            onClick={() => openDeleteModal(row.original.id, row.original.name)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Delete Product"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Product Management</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your products — create, edit or remove
          </p>
        </div>

        <Link
          href="/dashboard/products/create"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
        >
          <Plus size={18} />
          Add New Product
        </Link>
      </div>

      <NMTable columns={columns} data={products} isLoading={loading} />

      <DeleteConfirmationModal
        item="Product"
        name={deleteModal.productName}
        isOpen={deleteModal.isOpen}
        onOpenChange={(open) => !open && closeDeleteModal()}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default ProductManagement;
