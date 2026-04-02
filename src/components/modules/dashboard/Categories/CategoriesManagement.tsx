"use client";

import { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { NMTable } from "@/components/shared/core/NMTable";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { getAllCategories, deleteCategory } from "@/services/Category";

import dynamic from "next/dynamic";

// Lazy load components
const CategoryForm = dynamic(() => import("./CategoryForm"), { ssr: false });
const DeleteConfirmationModal = dynamic(
  () => import("@/components/shared/core/NMModal/DeleteConfirmationModal"),
  { ssr: false },
);

export interface TCategory {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    products: number;
  };
}

const CategoriesManagement = () => {
  const [categories, setCategories] = useState<TCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [openCreateCategory, setOpenCreateCategory] = useState(false);
  const [openEditCategory, setOpenEditCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<TCategory | null>(
    null,
  );

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
        fetchCategories(); // Refresh list
      } else {
        toast.error(res?.message || "Failed to delete category");
      }
    } catch (error) {
      toast.error("Something went wrong while deleting the category");
    } finally {
      closeDeleteModal();
    }
  };

  // Handle Create / Update Success
  const onCategoryCreatedOrUpdated = (
    newOrUpdated: TCategory,
    isUpdate = false,
  ) => {
    if (isUpdate) {
      setCategories((prev) =>
        prev.map((cat) => (cat.id === newOrUpdated.id ? newOrUpdated : cat)),
      );
    } else {
      setCategories((prev) => [...prev, newOrUpdated]);
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
        <div>{new Date(row.original.createdAt).toLocaleDateString()}</div>
      ),
    },
    {
      accessorKey: "updatedAt",
      header: "Updated At",
      cell: ({ row }) => (
        <div>{new Date(row.original.updatedAt).toLocaleDateString()}</div>
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

          <button
            onClick={() => {
              setSelectedCategory(row.original);
              setOpenEditCategory(true);
            }}
            className="p-2 text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
            title="Edit Category"
          >
            <Edit size={18} />
          </button>

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
            Manage your product categories.
          </p>
        </div>

        <Button onClick={() => setOpenCreateCategory(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add New Category
        </Button>
      </div>

      {/* Table */}
      <NMTable columns={columns} data={categories} isLoading={loading} />

      {/* === Modals === */}

      {/* Create Category Modal */}
      <Dialog open={openCreateCategory} onOpenChange={setOpenCreateCategory}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>
              Create a new category for your products.
            </DialogDescription>
          </DialogHeader>
          <CategoryForm
            mode="create"
            onSuccess={(created) => {
              onCategoryCreatedOrUpdated(created);
              setOpenCreateCategory(false);
            }}
            onCancel={() => setOpenCreateCategory(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Category Modal */}
      <Dialog open={openEditCategory} onOpenChange={setOpenEditCategory}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update category information.</DialogDescription>
          </DialogHeader>
          {selectedCategory && (
            <CategoryForm
              mode="edit"
              defaultValues={{ name: selectedCategory.name }}
              categoryId={selectedCategory.id}
              onSuccess={(updated) => {
                onCategoryCreatedOrUpdated(updated, true);
                setOpenEditCategory(false);
                setSelectedCategory(null);
              }}
              onCancel={() => {
                setOpenEditCategory(false);
                setSelectedCategory(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

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
