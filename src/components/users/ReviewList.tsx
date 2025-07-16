"use client";

import type { Review } from "@/types/types/Review";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { store } from "@/store/redux/store";
type ReviewWithReporter = Review & {
  reviewedBy?: {
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
  return (
    <div className="space-y-6">
      {reviews && reviews.length > 0 ? (
        reviews.map((review) => (
          <div
            key={review._id}
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
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {currentUserId === review.client_id
                        ? "Me"
                        : review.reviewedBy?.name || "Anonymous"}
                    </p>
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
                <h3 className="font-medium dark:text-white mb-2">
                  {review.heading}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {review.review}
                </p>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 ml-4">
                {new Date(review.createdAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
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
  );
}
