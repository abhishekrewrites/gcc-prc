import { create } from "zustand";
import { Product, getProducts } from "@/services/product-service";

interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  selectedCategory: string;
  sortOption: string;
  minRating: number;
  fetchProducts: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setSortOption: (option: string) => void;
  setMinRating: (rating: number) => void;
  currentPage: number;
  itemsPerPage: number;
  setCurrentPage: (page: number) => void;
  setProducts: (products: Product[]) => void;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  isLoading: false,
  error: null,
  searchQuery: "",
  selectedCategory: "",
  sortOption: "",
  minRating: 0,
  currentPage: 1,
  itemsPerPage: 8,
  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const products = await getProducts();
      set({ products, isLoading: false });
    } catch (error) {
      set({ error: "Failed to fetch products", isLoading: false });
    }
  },
  setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }),
  setSelectedCategory: (category) =>
    set({ selectedCategory: category, currentPage: 1 }),
  setSortOption: (option) => set({ sortOption: option, currentPage: 1 }),
  setMinRating: (rating) => set({ minRating: rating, currentPage: 1 }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setProducts: (products) => set({ products }),
}));

export const selectCategories = (state: ProductState) => {
  return ["all", ...Array.from(new Set(state.products.map((p) => p.category)))];
};

export const selectFilteredAndSortedProducts = (state: ProductState) => {
  const { products, searchQuery, selectedCategory, sortOption, minRating } =
    state;

  return products
    .filter((product) => {
      const matchesSearch = product.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "" ||
        selectedCategory === "all" ||
        product.category === selectedCategory;

      const apiRate = product.rating?.rate || 0;
      const matchesRating = minRating === 0 || apiRate >= minRating;

      return matchesSearch && matchesCategory && matchesRating;
    })
    .sort((a, b) => {
      if (sortOption === "price-asc") return a.price - b.price;
      if (sortOption === "price-desc") return b.price - a.price;
      return 0;
    });
};

export const selectPaginatedProducts = (state: ProductState) => {
  const filtered = selectFilteredAndSortedProducts(state);
  const { currentPage, itemsPerPage } = state;
  const startIndex = (currentPage - 1) * itemsPerPage;
  return filtered.slice(startIndex, startIndex + itemsPerPage);
};

export const selectTotalPages = (state: ProductState) => {
  const filtered = selectFilteredAndSortedProducts(state);
  return Math.ceil(filtered.length / state.itemsPerPage);
};

export const selectInfiniteScrollProducts = (state: ProductState) => {
  const filtered = selectFilteredAndSortedProducts(state);
  const { currentPage, itemsPerPage } = state;
  // Return everything from start up to current page * itemsPerPage
  return filtered.slice(0, currentPage * itemsPerPage);
};
