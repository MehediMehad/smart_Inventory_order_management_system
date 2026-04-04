// src/components/modules/dashboard/Restock/RestockModal.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { restockProduct } from "@/services/Restock";
import { toast } from "sonner";

type RestockModalProps = {
  isOpen: boolean;
  item: any | null;
  onClose: () => void;
  onSuccess: () => void;
};

export default function RestockModal({
  isOpen,
  item,
  onClose,
  onSuccess,
}: RestockModalProps) {
  const [addedQuantity, setAddedQuantity] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!item) return null;

  const handleRestock = async () => {
    if (addedQuantity && addedQuantity <= 0) {
      toast.error("Quantity must be greater than 0");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await restockProduct({
        productId: item.productId,
        addedQuantity: addedQuantity || 0,
      });

      if (res.success) {
        toast.success(
          `Successfully restocked ${addedQuantity} units of ${item.product.name}`,
        );
        onSuccess();
      } else {
        toast.error(res.message || "Failed to restock");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Restock Product</DialogTitle>
          <DialogDescription>
            Add stock to{" "}
            <span className="font-medium">{item.product.name}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label>Current Stock</Label>
            <p className="text-lg font-semibold">
              {item.product.stockQuantity} units
            </p>
          </div>

          <div>
            <Label htmlFor="quantity">Quantity to Add</Label>
            <Input
              id="quantity"
              type="number"
              value={addedQuantity || ""}
              onChange={(e) => setAddedQuantity(Number(e.target.value))}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Suggested: {item.product.minStockThreshold + 50} (to go above
              threshold)
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleRestock}
            disabled={isSubmitting || !addedQuantity || addedQuantity <= 0}
          >
            {isSubmitting ? "Restocking..." : "Confirm Restock"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
