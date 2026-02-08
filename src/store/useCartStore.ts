import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Product } from "@/services/product-service";
import { DISCOUNTS } from "@/config/discounts";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  discount: { code: string; amount: number } | null;
  applyDiscount: (code: string) => boolean;
  removeDiscount: () => void;
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: [],
      addToCart: (product) =>
        set((state) => {
          const existingItem = state.cart.find(
            (item) => item.product.id === product.id,
          );
          if (existingItem) {
            return {
              cart: state.cart.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item,
              ),
            };
          }
          return { cart: [...state.cart, { product, quantity: 1 }] };
        }),
      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.product.id !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          cart: state.cart
            .map((item) =>
              item.product.id === productId
                ? { ...item, quantity: Math.max(0, quantity) }
                : item,
            )
            .filter((item) => item.quantity > 0),
        })),
      clearCart: () => set({ cart: [], discount: null }),
      discount: null,
      applyDiscount: (code) => {
        const discountRule = DISCOUNTS[code as keyof typeof DISCOUNTS];

        if (discountRule) {
          set({ discount: { code, amount: discountRule.amount } });
          return true;
        }

        set({ discount: null });
        return false;
      },
      removeDiscount: () => set({ discount: null }),
      wishlist: [],
      addToWishlist: (product) =>
        set((state) => {
          if (state.wishlist.some((item) => item.id === product.id)) {
            return state;
          }
          return { wishlist: [...state.wishlist, product] };
        }),
      removeFromWishlist: (productId) =>
        set((state) => ({
          wishlist: state.wishlist.filter((item) => item.id !== productId),
        })),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
