import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProductCard } from "../ProductCard";
import { useCartStore } from "@/store/useCartStore";

vi.mock("@/store/useCartStore", () => ({
  useCartStore: vi.fn(),
}));

vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

vi.mock("@/components/WishlistButton", () => ({
  WishlistButton: () => <button>Wishlist</button>,
}));

vi.mock("@/components/ProductReviews", () => ({
  ProductReviews: () => <div>Reviews</div>,
}));

const mockProduct = {
  id: 1,
  title: "Test Product",
  price: 100,
  description: "Short description",
  category: "test",
  image: "https://example.com/test.jpg",
  rating: { rate: 4.5, count: 10 },
};

const longDescriptionProduct = {
  ...mockProduct,
  description: "A".repeat(150),
};

describe("ProductCard", () => {
  const addToCartMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useCartStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      addToCartMock,
    );
  });

  it("should render product details", () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("$100.00")).toBeInTheDocument();
    expect(screen.getByText("Short description")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute(
      "src",
      "https://example.com/test.jpg",
    );
  });

  it("should call addToCart when button is clicked", () => {
    render(<ProductCard product={mockProduct} />);

    const button = screen.getByRole("button", { name: /add to cart/i });
    fireEvent.click(button);

    expect(addToCartMock).toHaveBeenCalledWith(mockProduct);
  });

  it("should toggle description visibility for long descriptions", () => {
    render(<ProductCard product={longDescriptionProduct} />);

    expect(screen.getByText("See More")).toBeInTheDocument();

    const toggleButton = screen.getByText("See More");
    fireEvent.click(toggleButton);

    expect(screen.getByText("See Less")).toBeInTheDocument();

    fireEvent.click(screen.getByText("See Less"));
    expect(screen.getByText("See More")).toBeInTheDocument();
  });

  it("should not show See More button for short descriptions", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.queryByText("See More")).not.toBeInTheDocument();
  });
});
