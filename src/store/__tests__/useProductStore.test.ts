import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useProductStore } from '../useProductStore';
import * as productService from '@/services/product-service';

const mockProducts = [
    {
        id: 1,
        title: 'Test Product 1',
        price: 100,
        description: 'Description 1',
        category: 'Category 1',
        image: 'image1.jpg'
    },
    {
        id: 2,
        title: 'Test Product 2',
        price: 200,
        description: 'Description 2',
        category: 'Category 2',
        image: 'image2.jpg'
    }
];

describe('useProductStore', () => {
    beforeEach(() => {
        useProductStore.setState({ products: [], isLoading: false, error: null });
        vi.clearAllMocks();
    });

    it('should start with initial state', () => {
        const state = useProductStore.getState();
        expect(state.products).toEqual([]);
        expect(state.isLoading).toBe(false);
        expect(state.error).toBeNull();
    });

    it('should fetch products successfully', async () => {
        const getProductsSpy = vi.spyOn(productService, 'getProducts').mockResolvedValue(mockProducts);

        await useProductStore.getState().fetchProducts();

        const state = useProductStore.getState();
        expect(state.isLoading).toBe(false);
        expect(state.error).toBeNull();
        expect(state.products).toEqual(mockProducts);
        expect(getProductsSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle fetch errors', async () => {
        const getProductsSpy = vi.spyOn(productService, 'getProducts').mockRejectedValue(new Error('Network error'));

        await useProductStore.getState().fetchProducts();

        const state = useProductStore.getState();
        expect(state.isLoading).toBe(false);
        expect(state.error).toBe('Failed to fetch products');
        expect(state.products).toEqual([]);
        expect(getProductsSpy).toHaveBeenCalledTimes(1);
    });
});
