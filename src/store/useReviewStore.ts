import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface Review {
  id: string;
  productId: number;
  rating: number;
  text: string;
  date: string;
  userName: string;
}

interface ReviewState {
  reviews: Record<number, Review[]>;
  addReview: (review: Omit<Review, "id" | "date">) => void;
  getReviewsByProduct: (productId: number) => Review[];
}

export const useReviewStore = create<ReviewState>()(
  persist(
    (set, get) => ({
      reviews: {},
      addReview: (review) =>
        set((state) => {
          const newReview: Review = {
            ...review,
            id: crypto.randomUUID(),
            date: new Date().toISOString(),
          };
          const productReviews = state.reviews[review.productId] || [];
          return {
            reviews: {
              ...state.reviews,
              [review.productId]: [newReview, ...productReviews],
            },
          };
        }),
      getReviewsByProduct: (productId) => get().reviews[productId] || [],
    }),
    {
      name: "review-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
