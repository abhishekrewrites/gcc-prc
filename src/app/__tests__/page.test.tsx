import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Home from '../page';
import { useProductStore } from '@/store/useProductStore';

vi.mock('@/store/useProductStore', () => ({
    useProductStore: vi.fn(),
}));

vi.mock('@/components/ProductCard', () => ({
    ProductCard: ({ product }: any) => <div data-testid="product-card">{product.title}</div>,
}));

vi.mock('@/components/skeletons/ProductSkeleton', () => ({
    ProductSkeleton: () => <div data-testid="product-skeleton">Skeleton</div>,
}));

describe('Home Page', () => {
    const fetchProductsMock = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should fetch products on mount', () => {
        (useProductStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
            products: [],
            isLoading: true,
            error: null,
            fetchProducts: fetchProductsMock,
        });

        render(<Home />);
        expect(fetchProductsMock).toHaveBeenCalledTimes(1);
    });

    it('should render loading skeletons when loading', () => {
        (useProductStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
            products: [],
            isLoading: true,
            error: null,
            fetchProducts: fetchProductsMock,
        });

        render(<Home />);
        expect(screen.getAllByTestId('product-skeleton')).toHaveLength(8);
        expect(screen.queryByTestId('product-card')).not.toBeInTheDocument();
    });

    it('should render error message when error occurs', () => {
        (useProductStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
            products: [],
            isLoading: false,
            error: 'Failed to fetch',
            fetchProducts: fetchProductsMock,
        });

        render(<Home />);
        expect(screen.getByText('Failed to fetch')).toBeInTheDocument();
    });

    it('should render products when loaded', () => {
        const mockProducts = [
            { id: 1, title: 'Product 1' },
            { id: 2, title: 'Product 2' },
        ];

        (useProductStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
            products: mockProducts,
            isLoading: false,
            error: null,
            fetchProducts: fetchProductsMock,
        });

        render(<Home />);
        expect(screen.getAllByTestId('product-card')).toHaveLength(2);
        expect(screen.getByText('Product 1')).toBeInTheDocument();
        expect(screen.getByText('Product 2')).toBeInTheDocument();
        expect(screen.queryByTestId('product-skeleton')).not.toBeInTheDocument();
    });
});
