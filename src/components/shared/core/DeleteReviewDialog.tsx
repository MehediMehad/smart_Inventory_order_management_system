import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
// import { deleteReview } from "@/services/Review";
import { toast } from "sonner";

const DeleteReviewDialog = ({ review }: { review: any }) => {
  const router = useRouter();

  const handleDeleteReview = async (reviewId: string) => {
    // const result = await deleteReview(reviewId);
    const result = { success: true, message: "Review deleted successfully" };

    if (result.success) {
      toast.success(result.message);
      router.refresh(); // 👈 This will refetch the page data
    } else {
      toast.error(result.message);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Trash className="h-4 w-4 text-red-500" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Review</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this review? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => handleDeleteReview(review.id)}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteReviewDialog;
