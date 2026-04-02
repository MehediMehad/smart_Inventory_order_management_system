// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Star } from "lucide-react";
// import React from "react";
// import { FiEdit } from "react-icons/fi";
// import { Textarea } from "../../ui/textarea";
// import { toast } from "sonner";
// // import { UpdateReviewAction } from "@/services/Review";

// export function ReviewUpdateDialog({ review }: { review: any }) {
//   const [open, setOpen] = React.useState(false);

//   const [rating, setRating] = React.useState<number>(review.rating);
//   const [newReview, setNewReview] = React.useState<string>(review.comment);

//   const handleEdit = async () => {
//     if (!rating) return toast.warning("Add Rating");
//     if (!newReview.trim()) return toast.warning("Wright Review");
//     try {
//       const res = await UpdateReviewAction({
//         reviewId: review.id,
//         rating: rating.toString(),
//         comment: newReview,
//       });
//       if (res.success) {
//         toast.success(`Thanks For FeedBack`);
//         setOpen(false); // dialog
//       } else {
//         toast.error(res.message || "Failed to send invitation");
//       }
//     } catch (error) {
//       console.error("Failed to submit review");
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
//           <FiEdit size={18} />
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>Edit Reviews</DialogTitle>
//           <DialogDescription className="sr-only">
//             Make changes to your profile here. Click save when you&apos;re done.
//           </DialogDescription>
//         </DialogHeader>
//         <div className="mb-6 space-y-4">
//           <div className="flex items-center gap-2">
//             {[1, 2, 3, 4, 5].map((star) => (
//               <button key={star} onClick={() => setRating(star)}>
//                 <Star
//                   className={`h-6 w-6 ${
//                     star <= rating
//                       ? "fill-yellow-400 text-yellow-400"
//                       : "text-gray-300"
//                   }`}
//                 />
//               </button>
//             ))}
//           </div>
//           <Textarea
//             placeholder="Share your experience..."
//             value={newReview}
//             onChange={(e) => setNewReview(e.target.value)}
//             className="min-h-[100px]"
//           />
//           <Button onClick={handleEdit} disabled={!newReview.trim()}>
//             Submit Review
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }
