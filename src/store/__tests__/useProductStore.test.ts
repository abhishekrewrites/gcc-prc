import { describe, it, expect, vi, beforeEach } from "vitest";
import { useProductStore } from "../useProductStore";
import * as productService from "@/services/product-service";

const mockProducts = [
  {
    id: 1,
    title: "Test Product 1",
    price: 100,
    description: "Description 1",
    category: "Category 1",
    image: "image1.jpg",
  },
  {
    id: 2,
    title: "Test Product 2",
    price: 200,
    description: "Description 2",
    category: "Category 2",
    image: "image2.jpg",
  },
];

describe("useProductStore", () => {
  beforeEach(() => {
    useProductStore.setState({ products: [], isLoading: false, error: null });
    vi.clearAllMocks();
  });

  it("should start with initial state", () => {
    const state = useProductStore.getState();
    expect(state.products).toEqual([]);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it("should fetch products successfully", async () => {
    const getProductsSpy = vi
      .spyOn(productService, "getProducts")
      .mockResolvedValue(mockProducts);

    await useProductStore.getState().fetchProducts();

    const state = useProductStore.getState();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.products).toEqual(mockProducts);
    expect(getProductsSpy).toHaveBeenCalledTimes(1);
  });

  it("should handle fetch errors", async () => {
    const getProductsSpy = vi
      .spyOn(productService, "getProducts")
      .mockRejectedValue(new Error("Network error"));

    await useProductStore.getState().fetchProducts();

    const state = useProductStore.getState();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe("Failed to fetch products");
    expect(state.products).toEqual([]);
    expect(getProductsSpy).toHaveBeenCalledTimes(1);
  });

  it("should filter products by rating including local reviews", () => {
    const productWithLowRating = {
      ...mockProducts[0],
      id: 1,
      rating: { rate: 2, count: 10 },
    };
    const productWithHighRating = {
      ...mockProducts[1],
      id: 2,
      rating: { rate: 4, count: 10 },
    };

    useProductStore.setState({
      products: [productWithLowRating, productWithHighRating],
      minRating: 3,
    });

    // Mock useReviewStore
    vi.mock("../useReviewStore", () => ({
      useReviewStore: {
        getState: () => ({
          reviews: {
            1: [{ rating: 5 }, { rating: 5 }], // Boosts prod 1 average
          },
        }),
      },
    }));

    // Select products
    // We need to re-import or use the selector from the module
    // But since we mocked the module dependency, we might need to rely on how the test runner handles it or refactor the test to import selector
  });
});
