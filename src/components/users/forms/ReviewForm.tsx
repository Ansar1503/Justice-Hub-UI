import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input"; // added Input
import { Star } from "lucide-react";
import { useAddReview } from "@/store/tanstack/mutations";

export default function ReviewForm({ id }: { id: string }) {
  const [heading, setHeading] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [errors, setErrors] = useState({
    heading: "",
    comment: "",
    rating: "",
  });
  const { mutateAsync } = useAddReview();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;
    setErrors({ heading: "", comment: "", rating: "" });

    if (!heading.trim()) {
      setErrors((prev) => ({ ...prev, heading: "Please enter a heading" }));
      hasError = true;
    }
    if (!comment.trim()) {
      setErrors((prev) => ({ ...prev, comment: "Please write some comment" }));
      hasError = true;
    }
    if (rating < 1) {
      setErrors((prev) => ({ ...prev, rating: "Please provide a rating" }));
      hasError = true;
    }
    if (hasError || !id) return;

    await mutateAsync({ rating, review: comment, heading, lawyerId: id });
    setHeading("");
    setComment("");
    setRating(0);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-4 dark:text-white">
          Write a Review
        </h3>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="heading" className="dark:text-gray-200">
          Heading
        </Label>
        <Input
          id="heading"
          value={heading}
          onChange={(e) => setHeading(e.target.value)}
          placeholder="Enter a title for your review"
          className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
          required
        />
        <span className="text-red-600">{errors.heading}</span>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="rating" className="dark:text-gray-200">
          Rating
        </Label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-6 w-6 cursor-pointer ${
                hoveredRating >= star || rating >= star
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300 dark:text-gray-500"
              }`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
            />
          ))}
          <span className="text-red-600">{errors.rating}</span>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="comment" className="dark:text-gray-200">
          Your Review
        </Label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this lawyer"
          className="resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
          required
        />
        <span className="text-red-600">{errors.comment}</span>
      </div>

      <Button
        type="submit"
        className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:text-white"
        disabled={!heading || !comment || rating === 0 || !id}
      >
        Submit Review
      </Button>
    </form>
  );
}
