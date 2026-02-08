"use client";

import { useCartStore } from "@/store/useCartStore";
import { Product } from "@/services/product-service";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useShallow } from "zustand/react/shallow";

interface WishlistButtonProps {
  product: Product;
}

export const WishlistButton = ({ product }: WishlistButtonProps) => {
  const { wishlist, addToWishlist, removeFromWishlist } = useCartStore(
    useShallow((state) => ({
      wishlist: state.wishlist,
      addToWishlist: state.addToWishlist,
      removeFromWishlist: state.removeFromWishlist,
    })),
  );

  const isInWishlist = wishlist.some((item) => item.id === product.id);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to product details if inside a link
    e.stopPropagation();

    if (isInWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`rounded-full hover:bg-red-50 ${isInWishlist ? "text-red-500" : "text-gray-400 hover:text-red-500"}`}
      onClick={toggleWishlist}
      aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart className={`h-5 w-5 ${isInWishlist ? "fill-current" : ""}`} />
    </Button>
  );
};
