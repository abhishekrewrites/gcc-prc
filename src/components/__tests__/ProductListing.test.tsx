import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProductListing } from "../ProductListing";
import { useProductStore } from "@/store/useProductStore";
import { Product } from "@/services/product-service";

// Mock dependencies
vi.mock("@/store/useProductStore");
vi.mock("@/components/ProductCard", () => ({
  ProductCard: ({ product }: { product: Product }) => (
    <div data-testid="product-card">{product.title}</div>
  ),
}));
vi.mock("@/components/Pagination", () => ({
  Pagination: ({ onPageChange }: any) => (
    <button onClick={() => onPageChange(2)} data-testid="next-page">
      Next
    </button>
  ),
}));

vi.mock("@/components/InfiniteScroll", () => ({
  InfiniteScroll: () => <div data-testid="infinite-scroll" />,
}));

vi.mock("zustand/react/shallow", () => ({
  useShallow: (selector: any) => selector,
}));

describe("ProductListing", () => {
  const mockProducts: Product[] = [
    {
      id: 1,
      title: "Product 1",
      price: 10,
      description: "desc1",
      category: "cat1",
      image: "img1",
    },
    {
      id: 2,
      title: "Product 2",
      price: 20,
      description: "desc2",
      category: "cat2",
      image: "img2",
    },
  ];

  const setStateMock = vi.fn();
  const setSearchQueryMock = vi.fn();
  const setSelectedCategoryMock = vi.fn();
  const setSortOptionMock = vi.fn();
  const setCurrentPageMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock the store hook implementation
    (useProductStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (selector) => {
        const state = {
          products: mockProducts,
          searchQuery: "",
          selectedCategory: "all",
          sortOption: "",
          currentPage: 1,
          itemsPerPage: 8,
          setSearchQuery: setSearchQueryMock,
          setSelectedCategory: setSelectedCategoryMock,
          setSortOption: setSortOptionMock,
          setCurrentPage: setCurrentPageMock,
          setProducts: setStateMock, // Add this
        };

        // Check if selector is one of our exported selectors
        if (typeof selector === "function") {
          if (
            selector.name === "selectPaginatedProducts" ||
            selector.name === "selectInfiniteScrollProducts"
          )
            return mockProducts;
          if (selector.name === "selectTotalPages") return 1;
          if (selector.name === "selectCategories")
            return ["all", "cat1", "cat2"];
          try {
            return selector(state);
          } catch (e) {
            return state;
          }
        }

        // Default return for direct store access
        return state;
      },
    );

    // Mock static setState
    useProductStore.setState = setStateMock;
  });

  it("should initialize store with products on mount", () => {
    render(<ProductListing initialProducts={mockProducts} />);
    expect(setStateMock).toHaveBeenCalledWith({ products: mockProducts });
  });

  it("should render products", () => {
    render(<ProductListing initialProducts={mockProducts} />);
    expect(screen.getAllByTestId("product-card")).toHaveLength(2);
    expect(screen.getByText("Product 1")).toBeInTheDocument();
  });

  it("should handle search input", () => {
    render(<ProductListing initialProducts={mockProducts} />);
    const searchInput = screen.getByPlaceholderText("Search products");
    fireEvent.change(searchInput, { target: { value: "test" } });
    expect(setSearchQueryMock).toHaveBeenCalledWith("test");
  });

  it("should handle category selection", () => {
    render(<ProductListing initialProducts={mockProducts} />);
    const categorySelect = screen.getByDisplayValue("all"); // Assuming 'all' is default
    fireEvent.change(categorySelect, { target: { value: "cat1" } });
    expect(setSelectedCategoryMock).toHaveBeenCalledWith("cat1");
  });
});
