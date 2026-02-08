"use client";

import { useCartStore } from "@/store/useCartStore";
import { Product } from "@/services/product-service";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2 } from "lucide-react";

export const SavedItems = () => {
  const { wishlist, addToCart, removeFromWishlist } = useCartStore();

  if (wishlist.length === 0) {
    return null;
  }

  const handleMoveToCart = (product: Product) => {
    addToCart(product);
    removeFromWishlist(product.id);
  };

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Saved for Later</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.map((product) => (
          <div
            key={product.id}
            className="border cursor-pointer rounded-lg p-4 bg-white flex flex-col gap-4 relative group"
          >
            <button
              onClick={() => removeFromWishlist(product.id)}
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Remove from wishlist"
            >
              <Trash2 size={20} />
            </button>
            <div className="relative h-40 w-full mb-2">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-contain"
              />
            </div>
            <div className="grow">
              <h3 className="font-semibold text-sm line-clamp-2 mb-1">
                {product.title}
              </h3>
              <p className="font-bold text-lg">${product.price.toFixed(2)}</p>
            </div>
            <Button
              className="w-full"
              variant="secondary"
              onClick={() => handleMoveToCart(product)}
            >
              <ShoppingCart className="mr-2 h-4 w-4" /> Move to Cart
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
