"use client";
import { useCallback, useRef } from "react";

interface InfiniteScrollProps {
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading?: boolean;
  threshold?: number;
  className?: string;
}

export const InfiniteScroll = ({
  onLoadMore,
  hasMore,
  isLoading = false,
  threshold = 1.0,
  className = "",
}: InfiniteScrollProps) => {
  const observer = useRef<IntersectionObserver | null>(null);

  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            onLoadMore();
          }
        },
        { threshold },
      );

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore],
  );

  return (
    <div ref={lastElementRef} className={`w-full h-10 ${className}`}>
      {isLoading && (
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
        </div>
      )}
    </div>
  );
};
