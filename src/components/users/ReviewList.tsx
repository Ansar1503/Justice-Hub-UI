import type { Review } from "@/types/types/Review";
import { Star, MoreVertical, Edit, Flag, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { store } from "@/store/redux/store";
import { useState } from "react";
import { toast } from "sonner";
import {
  useDeleteReview,
  useReportReview,
  useUpdateReview,
} from "@/store/tanstack/mutations";

type ReviewWithReporter = Review & {
  reviewedBy?: {
    user_id: string;
    name?: string | null;
    profile_image?: string | null;
  };
};

type reviews = ReviewWithReporter[] | undefined;

type Props = {
  reviews: reviews;
};

export default function ReviewList({ reviews }: Props) {
  const { user } = store.getState().Auth;
  const currentUserId = user?.user_id;
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReportReviewId, setSelectedReportReviewId] =
    useState<string>("");
  const [reportReason, setReportReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editableReviewId, setEditableReviewId] = useState<string>("");
  const [editHeading, setEditHeading] = useState("");
  const [editComment, setEditComment] = useState("");
  const [editRating, setEditRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [reportedBy, setRepotedBy] = useState("");
  const [reportedUser, setReportedUser] = useState("");

  const { mutateAsync: updateReviewAsync } = useUpdateReview();
  const { mutateAsync: deleteReviewAsync } = useDeleteReview();
  const { mutateAsync: reportReviewAsync } = useReportReview();

  // console.log('review',reviews)
  const handleEditClick = (reviewId: string) => {
    const reviewToEdit = reviews?.find((r) => r.id === reviewId);
    if (reviewToEdit) {
      setTimeout(() => {
        setEditableReviewId(reviewId);
        setEditHeading(reviewToEdit.heading);
        setEditComment(reviewToEdit.review);
        setEditRating(reviewToEdit.rating);
      }, 0);
    }
  };

  const handleEditCancel = () => {
    setEditableReviewId("");
    setEditHeading("");
    setEditComment("");
    setEditRating(0);
    setHoveredRating(0);
  };

  const handleDeleteClick = (reviewId: string) => {
    setReviewToDelete(reviewId);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!reviewToDelete) return;

    setIsDeleting(true);
    try {
      await deleteReviewAsync({ review_id: reviewToDelete });
      setShowDeleteConfirm(false);
      setReviewToDelete("");
    } catch (error: any) {
      toast.error("Failed to delete review", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setReviewToDelete("");
  };

  const handleEditSubmit = async (reviewId: string) => {
    if (!editHeading.trim() || !editComment.trim() || editRating === 0) {
      toast.error("Please fill all fields");
      return;
    }

    setIsEditSubmitting(true);
    try {
      await updateReviewAsync({
        id: reviewId,
        heading: editHeading,
        review: editComment,
        rating: editRating,
      });
      toast.success("Review updated successfully");
      handleEditCancel();
    } catch (error: any) {
      toast.error("Failed to update review", error);
    } finally {
      setIsEditSubmitting(false);
    }
  };

  const handleReportClick = (
    reviewId: string,
    reportedBy: string,
    reportedUser: string
  ) => {
    setTimeout(() => {
      setRepotedBy(reportedBy);
      setReportedUser(reportedUser);
      setSelectedReportReviewId(reviewId);
      setShowReportModal(true);
    }, 0);
  };

  const handleReportSubmit = async () => {
    if (!reportReason) {
      toast.error("Please select a reason for reporting");
      return;
    }
    setIsSubmitting(true);
    try {
      console.log("reporteduser", reportedUser);
      await reportReviewAsync({
        review_id: selectedReportReviewId,
        reason: reportReason,
        reportedBy: reportedBy,
        reportedUser: reportedUser,
      });
    } catch (error) {
      console.log("error reporting", error);
    } finally {
      setIsSubmitting(false);
      setRepotedBy("");
      setReportReason("");
      setReportedUser("");
      setShowReportModal(false);
    }
  };
  return (
    <>
      <div className="space-y-6">
        {reviews && reviews.length > 0 ? (
          reviews.map((review) => (
            <div
              key={review.id}
              className="border-b pb-4 last:border-0 dark:border-gray-700"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={review.reviewedBy?.profile_image || ""}
                        alt={
                          currentUserId === review.client_id
                            ? "Your profile"
                            : review.reviewedBy?.name || "Anonymous"
                        }
                      />
                      <AvatarFallback className="bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 text-sm">
                        {currentUserId === review.client_id
                          ? user?.name?.substring(0, 2)?.toUpperCase() || "ME"
                          : review.reviewedBy?.name
                              ?.substring(0, 2)
                              ?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {currentUserId === review.client_id
                            ? "Me"
                            : review.reviewedBy?.name || "Anonymous"}
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(review.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {currentUserId === review.client_id ? (
                                <>
                                  <DropdownMenuItem
                                    onClick={() => handleEditClick(review.id)}
                                  >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Review
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteClick(review.id)}
                                    className="text-red-600 focus:text-red-600"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Review
                                  </DropdownMenuItem>
                                </>
                              ) : (
                                <DropdownMenuItem
                                  onClick={() => {
                                    handleReportClick(
                                      review.id,
                                      currentUserId || "",
                                      review.reviewedBy?.user_id || ""
                                    );
                                  }}
                                >
                                  <Flag className="mr-2 h-4 w-4" />
                                  Report Review
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <div className="flex mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Number(review.rating)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300 dark:text-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  {editableReviewId === review.id ? (
                    <div className="space-y-3">
                      <div>
                        <Label
                          htmlFor={`edit-heading-${review.id}`}
                          className="text-sm font-medium"
                        >
                          Heading
                        </Label>
                        <input
                          id={`edit-heading-${review.id}`}
                          type="text"
                          value={editHeading}
                          onChange={(e) => setEditHeading(e.target.value)}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          placeholder="Enter review heading"
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Rating</Label>
                        <div className="flex gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-5 w-5 cursor-pointer transition-colors ${
                                hoveredRating >= star || editRating >= star
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300 dark:text-gray-500"
                              }`}
                              onClick={() => setEditRating(star)}
                              onMouseEnter={() => setHoveredRating(star)}
                              onMouseLeave={() => setHoveredRating(0)}
                            />
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label
                          htmlFor={`edit-comment-${review.id}`}
                          className="text-sm font-medium"
                        >
                          Review
                        </Label>
                        <Textarea
                          id={`edit-comment-${review.id}`}
                          value={editComment}
                          onChange={(e) => setEditComment(e.target.value)}
                          className="mt-1"
                          rows={3}
                          placeholder="Share your experience..."
                        />
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          onClick={() => handleEditSubmit(review.id)}
                          disabled={isEditSubmitting}
                          className="bg-emerald-600 hover:bg-emerald-700"
                        >
                          {isEditSubmitting ? "Saving..." : "Save Changes"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleEditCancel}
                          disabled={isEditSubmitting}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="font-medium dark:text-white mb-2">
                        {review.heading}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {review.review}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No reviews yet. Be the first to leave a review!
          </div>
        )}
      </div>

      {/* Report Modal */}
      <Dialog open={showReportModal} onOpenChange={setShowReportModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Report Review</DialogTitle>
            <DialogDescription>
              Please select a reason for reporting this review. This will help
              us maintain quality standards.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">
                Reason for reporting
              </Label>
              <Textarea
                id="details"
                placeholder="Please provide more details about why you're reporting this review..."
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="mt-1"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowReportModal(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleReportSubmit}
              disabled={!reportReason || isSubmitting}
            >
              {isSubmitting ? "Reporting..." : "Submit Report"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Review</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this review? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleDeleteCancel}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Review"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
