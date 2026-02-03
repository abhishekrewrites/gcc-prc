import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from '../useCartStore';

const mockProduct = {
    id: 1,
    title: 'Test Product',
    price: 100,
    description: 'Test Description',
    category: 'Test Category',
    image: 'test.jpg',
    rating: { rate: 4.5, count: 10 }
};

describe('useCartStore', () => {
    beforeEach(() => {
        useCartStore.getState().clearCart();
    });

    it('should start with empty cart', () => {
        const { cart } = useCartStore.getState();
        expect(cart).toEqual([]);
    });

    it('should add item to cart', () => {
        useCartStore.getState().addToCart(mockProduct);
        const { cart } = useCartStore.getState();
        expect(cart).toHaveLength(1);
        expect(cart[0].product).toEqual(mockProduct);
        expect(cart[0].quantity).toBe(1);
    });

    it('should increment quantity if item already exists', () => {
        useCartStore.getState().addToCart(mockProduct);
        useCartStore.getState().addToCart(mockProduct);
        const { cart } = useCartStore.getState();
        expect(cart).toHaveLength(1);
        expect(cart[0].quantity).toBe(2);
    });

    it('should remove item from cart', () => {
        useCartStore.getState().addToCart(mockProduct);
        useCartStore.getState().removeFromCart(mockProduct.id);
        const { cart } = useCartStore.getState();
        expect(cart).toHaveLength(0);
    });

    it('should update quantity', () => {
        useCartStore.getState().addToCart(mockProduct);
        useCartStore.getState().updateQuantity(mockProduct.id, 5);
        const { cart } = useCartStore.getState();
        expect(cart[0].quantity).toBe(5);
    });

    it('should remove item if quantity updated to 0', () => {
        useCartStore.getState().addToCart(mockProduct);
        useCartStore.getState().updateQuantity(mockProduct.id, 0);
        const { cart } = useCartStore.getState();
        expect(cart).toHaveLength(0);
    });

    it('should clear cart', () => {
        useCartStore.getState().addToCart(mockProduct);
        useCartStore.getState().clearCart();
        const { cart } = useCartStore.getState();
        expect(cart).toHaveLength(0);
    });
});
