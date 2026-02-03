import { create } from 'zustand';
import { Product } from '@/services/product-service';

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
}

export const useCartStore = create<CartState>((set) => ({
    cart: [],
    addToCart: (product) => set((state) => {
        const existingItem = state.cart.find(item => item.product.id === product.id);
        if (existingItem) {
            return {
                cart: state.cart.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            };
        }
        return { cart: [...state.cart, { product, quantity: 1 }] };
    }),
    removeFromCart: (productId) => set((state) => ({
        cart: state.cart.filter(item => item.product.id !== productId)
    })),
    updateQuantity: (productId, quantity) => set((state) => ({
        cart: state.cart.map(item =>
            item.product.id === productId
                ? { ...item, quantity: Math.max(0, quantity) }
                : item
        ).filter(item => item.quantity > 0)
    })),
    clearCart: () => set({ cart: [] }),
}));
