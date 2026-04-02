"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { deleteProduct } from "@/services/Product";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";

const DeleteConfirmationModal = dynamic(
  () => import("@/components/shared/core/NMModal/DeleteConfirmationModal"),
  { ssr: false },
);

interface TProductDetails {
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

export default function ProductDetails({
  product,
}: {
  product: TProductDetails;
}) {
  const router = useRouter();
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    productId: "",
    productName: "",
  });

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
        router.push("/dashboard/products");
      } else {
        toast.error(res?.message || "Failed to delete product");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      closeDeleteModal();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">{product.name}</h1>
          <p className="text-muted-foreground mt-2">
            {product.category.name} • Created on{" "}
            {format(new Date(product.createdAt), "MMMM dd, yyyy")}
          </p>
        </div>

        <div className="flex gap-3">
          <Link href={`/dashboard/products/edit/${product.id}`}>
            <Button variant="default">
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Button>
          </Link>
          <Button
            variant="destructive"
            onClick={() => openDeleteModal(product.id, product.name)}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
          <Link href="/dashboard/products">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Price</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold">${product.price}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold">{product.stockQuantity}</p>
            <p className="text-sm text-muted-foreground">units</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Min Threshold</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold">
              {product.minStockThreshold}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Status</CardTitle>
        </CardHeader>
        <CardContent>
          <Badge
            variant={product.status === "ACTIVE" ? "default" : "destructive"}
          >
            {product.status}
          </Badge>
        </CardContent>
      </Card>

      {/* Delete Modal */}
      <DeleteConfirmationModal
        item="Product"
        name={deleteModal.productName}
        isOpen={deleteModal.isOpen}
        onOpenChange={(open) => !open && closeDeleteModal()}
        onConfirm={handleDelete}
      />
    </div>
  );
}
