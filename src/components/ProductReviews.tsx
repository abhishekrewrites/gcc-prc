"use client";

import { useState } from "react";
import { ReviewForm } from "@/components/ReviewForm";
import { ReviewsList } from "@/components/ReviewsList";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/StarRating";

interface ProductReviewsProps {
  productId: number;
  productTitle: string;
  initialRating: { rate: number; count: number };
}

export const ProductReviews = ({
  productId,
  productTitle,
  initialRating,
}: ProductReviewsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-1 hover:bg-gray-50 rounded px-1 -ml-1 transition-colors">
          <StarRating rating={initialRating.rate} size="sm" />
          <span className="text-xs text-gray-500">({initialRating.count})</span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Reviews for {productTitle}</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <ReviewForm productId={productId} onSuccess={() => {}} />

          <div className="my-6 border-t" />

          <h4 className="font-semibold mb-3">Recent Reviews</h4>
          <ReviewsList productId={productId} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
