"use client";

import { useState } from "react";
import { useReviewStore } from "@/store/useReviewStore";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/StarRating";

interface ReviewFormProps {
  productId: number;
  onSuccess?: () => void;
}

export const ReviewForm = ({ productId, onSuccess }: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [userName, setUserName] = useState("");
  const [error, setError] = useState("");
  const addReview = useReviewStore((state) => state.addReview);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a rating.");
      return;
    }
    if (!text.trim()) {
      setError("Please write a review.");
      return;
    }
    if (!userName.trim()) {
      setError("Please enter your name.");
      return;
    }

    addReview({
      productId,
      rating,
      text,
      userName,
    });

    setRating(0);
    setText("");
    setUserName("");
    setError("");
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold">Write a Review</h3>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div>
        <label className="block text-sm font-medium mb-1">Rating</label>
        <StarRating
          rating={rating}
          interactive
          onRatingChange={setRating}
          size="lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="w-full border rounded-md p-2"
          placeholder="Your name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Review</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full border rounded-md p-2 h-24"
          placeholder="What did you like or dislike?"
        />
      </div>

      <Button type="submit" className="w-full">
        Submit Review
      </Button>
    </form>
  );
};
