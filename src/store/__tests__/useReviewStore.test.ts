import { describe, it, expect, beforeEach } from "vitest";
import { useReviewStore } from "@/store/useReviewStore";

describe("useReviewStore", () => {
  beforeEach(() => {
    useReviewStore.setState({ reviews: {} });
    localStorage.clear();
  });

  it("adds a review", () => {
    const review = {
      productId: 1,
      rating: 5,
      text: "Great product!",
      userName: "John Doe",
    };

    useReviewStore.getState().addReview(review);

    const reviews = useReviewStore.getState().getReviewsByProduct(1);
    expect(reviews).toHaveLength(1);
    expect(reviews[0]).toMatchObject({
      productId: 1,
      rating: 5,
      text: "Great product!",
      userName: "John Doe",
    });
    expect(reviews[0].id).toBeDefined();
    expect(reviews[0].date).toBeDefined();
  });

  it("persists reviews", () => {
    const review = {
      productId: 1,
      rating: 5,
      text: "Great product!",
      userName: "John Doe",
    };

    useReviewStore.getState().addReview(review);

    // Simulate page reload by re-reading from localStorage
    // access store storage directly if possible, or check localStorage
    const stored = JSON.parse(localStorage.getItem("review-storage") || "{}");
    expect(stored.state.reviews[1]).toHaveLength(1);
  });

  it("retrieves reviews by product id", () => {
    useReviewStore.setState({
      reviews: {
        1: [
          {
            id: "1",
            productId: 1,
            rating: 5,
            text: "A",
            userName: "A",
            date: "2023-01-01",
          },
        ],
        2: [
          {
            id: "2",
            productId: 2,
            rating: 4,
            text: "B",
            userName: "B",
            date: "2023-01-01",
          },
        ],
      },
    });

    const items1 = useReviewStore.getState().getReviewsByProduct(1);
    expect(items1).toHaveLength(1);
    expect(items1[0].text).toBe("A");

    const items2 = useReviewStore.getState().getReviewsByProduct(2);
    expect(items2).toHaveLength(1);
    expect(items2[0].text).toBe("B");

    const items3 = useReviewStore.getState().getReviewsByProduct(3);
    expect(items3).toHaveLength(0);
  });
});
