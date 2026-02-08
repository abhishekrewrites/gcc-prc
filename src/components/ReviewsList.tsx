"use client";

import { useReviewStore } from "@/store/useReviewStore";
import { StarRating } from "@/components/StarRating";
import { formatDistanceToNow } from "date-fns";

interface ReviewsListProps {
  productId: number;
}

export const ReviewsList = ({ productId }: ReviewsListProps) => {
  const reviewsMap = useReviewStore((state) => state.reviews);
  const reviews = reviewsMap[productId] || [];

  if (reviews.length === 0) {
    return (
      <p className="text-gray-500 text-center py-4">
        No reviews yet. Be the first to review!
      </p>
    );
  }

  return (
    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
      {reviews.map((review) => (
        <div key={review.id} className="border-b pb-4 last:border-0">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="font-semibold text-sm">{review.userName}</p>
              <StarRating rating={review.rating} size="sm" />
            </div>
            <span className="text-xs text-gray-400">
              {formatDistanceToNow(new Date(review.date), { addSuffix: true })}
            </span>
          </div>
          <p className="text-gray-700 text-sm">{review.text}</p>
        </div>
      ))}
    </div>
  );
};
