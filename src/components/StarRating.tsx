"use client";

import { Star, StarHalf } from "lucide-react";

interface StarRatingProps {
  rating: number; // 0 to 5
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  size?: "sm" | "md" | "lg";
  className?: string;
  showCount?: number;
}

export const StarRating = ({
  rating,
  interactive = false,
  onRatingChange,
  size = "md",
  className = "",
  showCount,
}: StarRatingProps) => {
  const stars = [];
  const iconSize = size === "sm" ? 16 : size === "md" ? 20 : 24;

  for (let i = 1; i <= 5; i++) {
    const isFilled = i <= Math.floor(rating);
    const isHalf = !isFilled && i === Math.ceil(rating) && rating % 1 >= 0.5;
    const Wrapper = interactive ? "button" : "span";

    stars.push(
      <Wrapper
        key={i}
        type={interactive ? "button" : undefined}
        onClick={() => interactive && onRatingChange?.(i)}
        className={`${interactive ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default"} focus:outline-none`}
        aria-label={interactive ? `Rate ${i} stars` : undefined}
      >
        {isFilled ? (
          <Star
            size={iconSize}
            className="fill-yellow-400 text-yellow-400"
            strokeWidth={0}
          />
        ) : isHalf ? (
          <div className="relative">
            <Star size={iconSize} className="text-gray-300" strokeWidth={2} />
            <StarHalf
              size={iconSize}
              className="absolute top-0 left-0 fill-yellow-400 text-yellow-400"
              strokeWidth={0}
            />
          </div>
        ) : (
          <Star size={iconSize} className="text-gray-300" strokeWidth={2} />
        )}
      </Wrapper>,
    );
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex">{stars}</div>
      {(showCount !== undefined || !interactive) && (
        <span className="text-sm text-gray-500 ml-1">
          {rating.toFixed(1)} {showCount !== undefined ? `(${showCount})` : ""}
        </span>
      )}
    </div>
  );
};
