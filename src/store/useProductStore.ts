import { create } from 'zustand';
import { Product, getProducts } from '@/services/product-service';

interface ProductState {
    products: Product[];
    isLoading: boolean;
    error: string | null;
    fetchProducts: () => Promise<void>;
}

export const useProductStore = create<ProductState>((set) => ({
    products: [],
    isLoading: false,
    error: null,
    fetchProducts: async () => {
        set({ isLoading: true, error: null });
        try {
            const products = await getProducts();
            set({ products, isLoading: false });
        } catch (error) {
            set({ error: 'Failed to fetch products', isLoading: false });
        }
    },
}));
