import { useInfiniteFetchReviews } from "@/store/tanstack/infiniteQuery";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import ReviewList from "./ReviewList";

type Props = {
  user_id: string;
};
const TextSkeleton = ({ width }: { width: string }) => (
  <Skeleton className={`h-5 ${width} rounded`} />
);

export default function Reviews({ user_id }: Props) {
  //   console.log("usersid", user_id);
  const { isLoading, data: ReviewsData } = useInfiniteFetchReviews(user_id);
  const Reviews = ReviewsData?.pages.flatMap((page) => page?.data) || [];

  return (
    <div className="mt-8">
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-white">
            {isLoading ? <TextSkeleton width="w-32" /> : "Client Reviews"}
          </CardTitle>
          <CardDescription className="dark:text-gray-300">
            {isLoading ? (
              <TextSkeleton width="w-64" />
            ) : (
              "See what others are saying about this lawyer"
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="gap-6">
            <div className="lg:col-span-2">
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
                                  <Skeleton
                                    key={starIdx}
                                    className="w-4 h-4 mr-1"
                                  />
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
                <ReviewList reviews={Reviews} />
              )}
            </div>
            {/* <div>
              {isLoading ? (
                <div className="border p-4 rounded-lg dark:border-gray-700 space-y-4">
                  <TextSkeleton width="w-32" />
                  <div className="space-y-2">
                    <TextSkeleton width="w-full" />
                    <TextSkeleton width="w-full" />
                    <TextSkeleton width="w-3/4" />
                  </div>
                  <div className="h-8 w-full">
                    <Skeleton className="h-full w-full rounded" />
                  </div>
                </div>
              ) : (
                <ReviewForm id={user_id} />
              )}
            </div> */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
