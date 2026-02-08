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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    minRating,
    setMinRating,
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

  const totalPages = useProductStore(selectTotalPages);

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <Input
          type="text"
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-[400px]"
          placeholder="Search products"
          value={searchQuery}
        />
        <div className="flex gap-4 w-full md:w-auto">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-[200px] capitalize">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Sort by</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={minRating.toString()}
            onValueChange={(value) => setMinRating(Number(value))}
          >
            <SelectTrigger className="w-full md:w-[150px]">
              <SelectValue placeholder="All Ratings" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">All Ratings</SelectItem>
              <SelectItem value="4">4★ & up</SelectItem>
              <SelectItem value="3">3★ & up</SelectItem>
              <SelectItem value="2">2★ & up</SelectItem>
              <SelectItem value="1">1★ & up</SelectItem>
            </SelectContent>
          </Select>
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

      <InfiniteScroll
        onLoadMore={() => setCurrentPage(currentPage + 1)}
        hasMore={currentPage < totalPages}
        isLoading={false}
      />
    </>
  );
};
