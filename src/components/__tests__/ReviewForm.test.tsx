import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ReviewForm } from "../ReviewForm";
import { useReviewStore } from "@/store/useReviewStore";

// Mock the store
vi.mock("@/store/useReviewStore", () => ({
  useReviewStore: vi.fn(),
}));

// Mock StarRating to simplify interaction
vi.mock("@/components/StarRating", () => ({
  StarRating: ({ onRatingChange, rating }: any) => (
    <div data-testid="star-rating">
      <button onClick={() => onRatingChange(5)}>Rate 5</button>
      <span>Current: {rating}</span>
    </div>
  ),
}));

describe("ReviewForm", () => {
  const addReviewMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useReviewStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (selector) =>
        selector({
          addReview: addReviewMock,
        }),
    );
  });

  it("renders form fields", () => {
    render(<ReviewForm productId={1} />);

    expect(screen.getByText("Write a Review")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Your name")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("What did you like or dislike?"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /submit review/i }),
    ).toBeInTheDocument();
  });

  it("shows error if submission is empty", () => {
    render(<ReviewForm productId={1} />);

    fireEvent.click(screen.getByRole("button", { name: /submit review/i }));

    expect(screen.getByText("Please select a rating.")).toBeInTheDocument();
    expect(addReviewMock).not.toHaveBeenCalled();
  });

  it("submits valid review", () => {
    const onSuccess = vi.fn();
    render(<ReviewForm productId={1} onSuccess={onSuccess} />);

    // Set rating
    fireEvent.click(screen.getByText("Rate 5"));

    // Set text
    fireEvent.change(
      screen.getByPlaceholderText("What did you like or dislike?"),
      {
        target: { value: "Great product!" },
      },
    );

    // Set name
    fireEvent.change(screen.getByPlaceholderText("Your name"), {
      target: { value: "John Doe" },
    });

    // Submit
    fireEvent.click(screen.getByRole("button", { name: /submit review/i }));

    expect(addReviewMock).toHaveBeenCalledWith({
      productId: 1,
      rating: 5,
      text: "Great product!",
      userName: "John Doe",
    });

    expect(onSuccess).toHaveBeenCalled();

    // Form should clear
    expect(screen.getByPlaceholderText("Your name")).toHaveValue("");
  });
});
