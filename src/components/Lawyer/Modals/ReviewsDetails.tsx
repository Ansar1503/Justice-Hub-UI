import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useFetchReviewsBySession } from "@/store/tanstack/queries";
import ReviewList from "../../users/ReviewList";
import { Skeleton } from "@/components/ui/skeleton";

const TextSkeleton = ({ width }: { width: string }) => (
  <Skeleton className={`h-5 ${width} rounded`} />
);

export function ReviewsDetailsModal({
  open,
  onClose,
  session_id,
}: {
  open: boolean;
  onClose: () => void;
  session_id: string;
}) {
  const { data: ReviewDataBySession, isLoading } =
    useFetchReviewsBySession(session_id);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl dark:bg-gray-800 dark:border-gray-700">
        <DialogHeader className="flex flex-row items-start justify-between">
          <div>
            <DialogTitle className="dark:text-white">
              {isLoading ? <TextSkeleton width="w-32" /> : "Client Reviews"}
            </DialogTitle>
            <DialogDescription className="dark:text-gray-300">
              {isLoading ? (
                <TextSkeleton width="w-64" />
              ) : (
                "See what others are saying about this lawyer"
              )}
            </DialogDescription>
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-6">
            {Array(3)
              .fill(null)
              .map((_, idx) => (
                <div
                  key={idx}
                  className="border p-4 rounded-lg dark:border-gray-700"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="space-y-1">
                      <TextSkeleton width="w-24" />
                      <div className="flex">
                        {Array(5)
                          .fill(null)
                          .map((_, starIdx) => (
                            <Skeleton key={starIdx} className="w-4 h-4 mr-1" />
                          ))}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <TextSkeleton width="w-full" />
                    <TextSkeleton width="w-3/4" />
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <ReviewList reviews={ReviewDataBySession} />
        )}
      </DialogContent>
    </Dialog>
  );
}
