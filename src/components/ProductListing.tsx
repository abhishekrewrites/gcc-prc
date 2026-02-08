"use client";
import {
  useProductStore,
  selectCategories,
  selectPaginatedProducts,
  selectInfiniteScrollProducts,
  selectTotalPages,
} from "@/store/useProductStore";
import { useShallow } from "zustand/react/shallow";
import { ProductCard } from "@/components/ProductCard";
import { Pagination } from "@/components/Pagination";
import { InfiniteScroll } from "@/components/InfiniteScroll";
import { Product } from "@/services/product-service";
import { useRef, useEffect } from "react";

interface ProductListingProps {
  initialProducts: Product[];
}

export const ProductListing = ({ initialProducts }: ProductListingProps) => {
  const initialized = useRef(false);
  const {
    products,
    setProducts,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortOption,
    setSortOption,
    currentPage,
    setCurrentPage,
  } = useProductStore();

  if (!initialized.current) {
    useProductStore.setState({ products: initialProducts });
    initialized.current = true;
  }

  const categories = useProductStore(useShallow(selectCategories));
  const paginatedProducts = useProductStore(
    useShallow(selectInfiniteScrollProducts),
  );

  //  const paginatedProducts = useProductStore(
  //   useShallow(selectPaginatedProducts),
  // );

  const totalPages = useProductStore(selectTotalPages);

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <input
          type="text"
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded-md px-2 py-1 w-full md:w-[400px]"
          placeholder="Search products"
          value={searchQuery}
        />
        <div className="flex gap-4 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-md px-2 py-1 w-full md:w-[200px] capitalize"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border border-gray-300 rounded-md px-2 py-1 w-full md:w-[200px]"
          >
            <option value="">Sort by</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {paginatedProducts.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            priority={index < 4}
          />
        ))}
      </div>

      {/* <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      /> */}

      <InfiniteScroll
        onLoadMore={() => setCurrentPage(currentPage + 1)}
        hasMore={currentPage < totalPages}
        isLoading={false}
      />
    </>
  );
};
