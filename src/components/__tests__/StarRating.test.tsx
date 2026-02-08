import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { StarRating } from "../StarRating";

// Mock Lucide React
vi.mock("lucide-react", () => ({
  Star: ({ className }: { className: string }) => (
    <div data-testid="star-icon" className={className} />
  ),
  StarHalf: ({ className }: { className: string }) => (
    <div data-testid="star-half-icon" className={className} />
  ),
}));

describe("StarRating", () => {
  it("renders correct number of stars", () => {
    render(<StarRating rating={3} />);
    // When not interactive, they are spans, not buttons. Using generic selector or testId would be better but icon check works.
    const starIcons = screen.getAllByTestId(/star(-half)?-icon/);
    expect(starIcons).toHaveLength(5);
  });

  it("renders filled stars correctly", () => {
    render(<StarRating rating={3} />);
    const filledStars = screen
      .getAllByTestId("star-icon")
      .filter((icon) => icon.className.includes("fill-yellow-400"));
    expect(filledStars).toHaveLength(3);
  });

  it("renders half star correctly", () => {
    render(<StarRating rating={3.5} />);
    expect(screen.getByTestId("star-half-icon")).toBeInTheDocument();
  });

  it("is interactive when interactive prop is true", () => {
    const handleChange = vi.fn();
    render(<StarRating rating={0} interactive onRatingChange={handleChange} />);

    const stars = screen.getAllByRole("button");
    fireEvent.click(stars[3]); // Click 4th star (index 3)

    expect(handleChange).toHaveBeenCalledWith(4);
  });

  it("is not interactive by default", () => {
    const handleChange = vi.fn();
    render(<StarRating rating={0} onRatingChange={handleChange} />);

    const buttons = screen.queryAllByRole("button");
    expect(buttons).toHaveLength(0);

    // items should still exist but be spans (we can check via test-id parent or just absence of buttons is enough for this specific test req)
  });
});
