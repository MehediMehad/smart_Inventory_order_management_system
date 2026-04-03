"use client";

import { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { NMTable } from "@/components/shared/core/NMTable";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { getAllProducts, deleteProduct } from "@/services/Product";
import dynamic from "next/dynamic";
import { TProduct } from "@/types";

// Lazy load components
const ProductForm = dynamic(
  () => import("./ProductForm"), // We'll create one unified form
  { ssr: false },
);

const DeleteConfirmationModal = dynamic(
  () => import("@/components/shared/core/NMModal/DeleteConfirmationModal"),
  { ssr: false },
);

const ProductManagement = () => {
  const [products, setProducts] = useState<TProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [openCreateProduct, setOpenCreateProduct] = useState(false);
  const [openEditProduct, setOpenEditProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<TProduct | null>(null);

  // Delete Modal
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

  // Handle success after create or update
  const onProductCreatedOrUpdated = (
    newOrUpdated: TProduct,
    isUpdate = false,
  ) => {
    if (isUpdate) {
      setProducts((prev) =>
        prev.map((p) => (p.id === newOrUpdated.id ? newOrUpdated : p)),
      );
    } else {
      setProducts((prev) => [...prev, newOrUpdated]);
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
    // {
    //   id: "details",
    //   header: "Details",
    //   cell: ({ row }) => (
    //     <Link
    //       href={`/dashboard/products/details/${row.original.id}`}
    //       className="inline-flex items-center justify-center p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
    //     >
    //       <Eye size={18} />
    //     </Link>
    //   ),
    // },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedProduct(row.original);
              setOpenEditProduct(true);
            }}
            className="p-2 text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
            title="Edit Product"
          >
            <Edit size={18} />
          </button>
          {/* TODO: */}
          {/* <button
            onClick={() => openDeleteModal(row.original.id, row.original.name)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Delete Product"
          >
            <Trash2 size={18} />
          </button> */}
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Product Management</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your products create, edit or remove
          </p>
        </div>

        <Button onClick={() => setOpenCreateProduct(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add New Product
        </Button>
      </div>

      {/* Table */}
      <NMTable columns={columns} data={products} isLoading={loading} />

      {/* === Modals === */}

      {/* Create Product Modal */}
      <Dialog open={openCreateProduct} onOpenChange={setOpenCreateProduct}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Create a new product for your inventory.
            </DialogDescription>
          </DialogHeader>
          <ProductForm
            mode="create"
            onSuccess={(created) => {
              onProductCreatedOrUpdated(created);
              setOpenCreateProduct(false);
            }}
            onCancel={() => setOpenCreateProduct(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Product Modal */}
      <Dialog open={openEditProduct} onOpenChange={setOpenEditProduct}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update product information.</DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <ProductForm
              mode="edit"
              defaultValues={{
                name: selectedProduct.name,
                categoryId: selectedProduct.categoryId,
                price: selectedProduct.price,
                stockQuantity: selectedProduct.stockQuantity,
                minStockThreshold: selectedProduct.minStockThreshold,
                status: selectedProduct.status,
              }}
              productId={selectedProduct.id}
              onSuccess={(updated) => {
                onProductCreatedOrUpdated(updated, true);
                setOpenEditProduct(false);
                setSelectedProduct(null);
              }}
              onCancel={() => {
                setOpenEditProduct(false);
                setSelectedProduct(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
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
