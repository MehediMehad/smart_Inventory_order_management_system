"use client";

import { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { NMTable } from "@/components/shared/core/NMTable";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { getAllCategories, deleteCategory } from "@/services/Category";
import dynamic from "next/dynamic";

export interface TCategory {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    products: number;
  };
}

// Lazy load Confirm Delete Modal
const DeleteConfirmationModal = dynamic(
  () => import("@/components/shared/core/NMModal/DeleteConfirmationModal"),
  { ssr: false },
);

const CategoriesManagement = () => {
  const [categories, setCategories] = useState<TCategory[]>([]);
  const [loading, setLoading] = useState(true); // better default

  // Delete Modal State
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    categoryId: "",
    categoryName: "",
  });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const result = await getAllCategories();
      setCategories(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      toast.error("Failed to load categories");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openDeleteModal = (id: string, name: string) => {
    setDeleteModal({ isOpen: true, categoryId: id, categoryName: name });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, categoryId: "", categoryName: "" });
  };

  const handleDelete = async () => {
    if (!deleteModal.categoryId) return;

    try {
      const res = await deleteCategory(deleteModal.categoryId);

      if (res?.success) {
        toast.success(res.message || "Category deleted successfully");
        fetchCategories(); // refresh list
      } else {
        toast.error(res?.message || "Failed to delete category");
      }
    } catch (error) {
      toast.error("Something went wrong while deleting the category");
    } finally {
      closeDeleteModal();
    }
  };

  const columns: ColumnDef<TCategory>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
    },
    {
      accessorKey: "products",
      header: "Products",
      cell: ({ row }) => (
        <div className="font-medium">{row.original._count?.products ?? 0}</div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => (
        <div>
          {new Date(row.original.createdAt).toISOString().split("T")[0]}
        </div>
      ),
    },
    {
      accessorKey: "updatedAt",
      header: "Updated At",
      cell: ({ row }) => (
        <div>
          {new Date(row.original.updatedAt).toISOString().split("T")[0]}
        </div>
      ),
    },
    {
      id: "details",
      header: "Details",
      cell: ({ row }) => (
        <Link
          href={`/dashboard/categories/details/${row.original.id}`}
          className="inline-flex items-center justify-center p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
          title="View Details"
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
            href={`/dashboard/products/create/${row.original.id}`}
            className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors"
            title="Add New Product"
          >
            <Plus size={18} />
          </Link>

          <Link
            href={`/dashboard/categories/edit/${row.original.id}`}
            className="p-2 text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
            title="Edit Category"
          >
            <Edit size={18} />
          </Link>

          <button
            onClick={() => openDeleteModal(row.original.id, row.original.name)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Delete Category"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Categories Management</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your categories create, edit or remove them here
          </p>
        </div>

        <Link
          href="/dashboard/categories/create"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
        >
          <Plus size={18} />
          Add New Category
        </Link>
      </div>

      {/* Table */}
      <NMTable columns={columns} data={categories} isLoading={loading} />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        item="Category"
        name={deleteModal.categoryName}
        isOpen={deleteModal.isOpen}
        onOpenChange={(open) => !open && closeDeleteModal()}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default CategoriesManagement;
