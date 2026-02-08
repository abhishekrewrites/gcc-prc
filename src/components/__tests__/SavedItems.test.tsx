import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { SavedItems } from "../SavedItems";
import { useCartStore } from "@/store/useCartStore";

// Mock the store
vi.mock("@/store/useCartStore", () => ({
  useCartStore: vi.fn(),
}));

vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
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

describe("SavedItems", () => {
  const mockAddToCart = vi.fn();
  const mockRemoveFromWishlist = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders nothing when wishlist is empty", () => {
    (useCartStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      wishlist: [],
      addToCart: mockAddToCart,
      removeFromWishlist: mockRemoveFromWishlist,
    });

    const { container } = render(<SavedItems />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders saved items correctly", () => {
    (useCartStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      wishlist: [mockProduct],
      addToCart: mockAddToCart,
      removeFromWishlist: mockRemoveFromWishlist,
    });

    render(<SavedItems />);

    expect(screen.getByText("Saved for Later")).toBeInTheDocument();
    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("$99.99")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /remove from wishlist/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /move to cart/i }),
    ).toBeInTheDocument();
  });

  it("moves item to cart when clicked", () => {
    (useCartStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      wishlist: [mockProduct],
      addToCart: mockAddToCart,
      removeFromWishlist: mockRemoveFromWishlist,
    });

    render(<SavedItems />);

    fireEvent.click(screen.getByRole("button", { name: /move to cart/i }));

    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct);
    expect(mockRemoveFromWishlist).toHaveBeenCalledWith(mockProduct.id);
  });

  it("removes item from wishlist when trash icon clicked", () => {
    (useCartStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      wishlist: [mockProduct],
      addToCart: mockAddToCart,
      removeFromWishlist: mockRemoveFromWishlist,
    });

    render(<SavedItems />);

    fireEvent.click(
      screen.getByRole("button", { name: /remove from wishlist/i }),
    );

    expect(mockRemoveFromWishlist).toHaveBeenCalledWith(mockProduct.id);
    expect(mockAddToCart).not.toHaveBeenCalled();
  });
});
