import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ProductReviews } from "../ProductReviews";

// Mock child components
vi.mock("@/components/ReviewForm", () => ({
  ReviewForm: () => <div data-testid="review-form">Review Form</div>,
}));

vi.mock("@/components/ReviewsList", () => ({
  ReviewsList: () => <div data-testid="reviews-list">Reviews List</div>,
}));

// Mock Dialog components (since they use Portals which can be tricky in tests)
vi.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children, open }: any) => (
    <div data-testid="dialog" data-state={open ? "open" : "closed"}>
      {children}
    </div>
  ),
  DialogTrigger: ({ children, asChild }: any) =>
    asChild ? (
      <div data-testid="dialog-trigger" onClick={() => {}}>
        {children}
      </div>
    ) : (
      <button data-testid="dialog-trigger">{children}</button>
    ),
  DialogContent: ({ children }: any) => (
    <div data-testid="dialog-content">{children}</div>
  ),
  DialogHeader: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children }: any) => <div>{children}</div>,
}));

describe("ProductReviews", () => {
  // Basic rendering test
  it("renders rating and count on trigger", () => {
    render(
      <ProductReviews
        productId={1}
        productTitle="Test Product"
        initialRating={{ rate: 4.5, count: 10 }}
      />,
    );

    expect(screen.getByText("(10)")).toBeInTheDocument();
  });
});
