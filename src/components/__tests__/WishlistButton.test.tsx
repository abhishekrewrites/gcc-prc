import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { WishlistButton } from "../WishlistButton";
import { useCartStore } from "@/store/useCartStore";

// Mock the store
vi.mock("@/store/useCartStore", () => ({
  useCartStore: vi.fn(),
}));

// Mock Lucide React
vi.mock("lucide-react", () => ({
  Heart: ({ className }: { className: string }) => (
    <div data-testid="heart-icon" className={className} />
  ),
}));

const mockProduct = {
  id: 1,
  title: "Test Product",
  price: 99.99,
  description: "Test Description",
  category: "test",
  image: "https://example.com/test.jpg",
  rating: { rate: 4.5, count: 10 },
};

describe("WishlistButton", () => {
  const mockAddToWishlist = vi.fn();
  const mockRemoveFromWishlist = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly when not in wishlist", () => {
    (useCartStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (selector) =>
        selector({
          wishlist: [],
          addToWishlist: mockAddToWishlist,
          removeFromWishlist: mockRemoveFromWishlist,
        }),
    );

    render(<WishlistButton product={mockProduct} />);

    const button = screen.getByRole("button", { name: /add to wishlist/i });
    expect(button).toBeInTheDocument();

    // Check styling for inactive state
    expect(button).toHaveClass("text-gray-400");
    const icon = screen.getByTestId("heart-icon");
    expect(icon).not.toHaveClass("fill-current");
  });

  it("renders correctly when in wishlist", () => {
    (useCartStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (selector) =>
        selector({
          wishlist: [mockProduct],
          addToWishlist: mockAddToWishlist,
          removeFromWishlist: mockRemoveFromWishlist,
        }),
    );

    render(<WishlistButton product={mockProduct} />);

    const button = screen.getByRole("button", {
      name: /remove from wishlist/i,
    });
    expect(button).toBeInTheDocument();

    // Check styling for active state
    expect(button).toHaveClass("text-red-500");
    const icon = screen.getByTestId("heart-icon");
    expect(icon).toHaveClass("fill-current");
  });

  it("adds to wishlist when clicked and not present", () => {
    (useCartStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (selector) =>
        selector({
          wishlist: [],
          addToWishlist: mockAddToWishlist,
          removeFromWishlist: mockRemoveFromWishlist,
        }),
    );

    render(<WishlistButton product={mockProduct} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(mockAddToWishlist).toHaveBeenCalledWith(mockProduct);
    expect(mockRemoveFromWishlist).not.toHaveBeenCalled();
  });

  it("removes from wishlist when clicked and present", () => {
    (useCartStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (selector) =>
        selector({
          wishlist: [mockProduct],
          addToWishlist: mockAddToWishlist,
          removeFromWishlist: mockRemoveFromWishlist,
        }),
    );

    render(<WishlistButton product={mockProduct} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(mockRemoveFromWishlist).toHaveBeenCalledWith(mockProduct.id);
    expect(mockAddToWishlist).not.toHaveBeenCalled();
  });
});
