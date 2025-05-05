import { Star } from "lucide-react";

// Sample review data
const reviews = [
  {
    id: 1,
    name: "Rahul Sharma",
    date: "2023-10-15",
    rating: 5,
    comment:
      "Excellent lawyer who handled my divorce case with utmost professionalism. Very knowledgeable and supportive throughout the process.",
  },    
];

export default function ReviewList() {
  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="border-b pb-4 last:border-0 dark:border-gray-700"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium dark:text-white">{review.name}</h3>
              <div className="flex mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(review.date).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>
          </div>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            {review.comment}
          </p>
        </div>
      ))}
    </div>
  );
}
