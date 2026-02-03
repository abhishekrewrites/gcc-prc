import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Navbar } from '../Navbar';
import { useCartStore } from '@/store/useCartStore';

vi.mock('@/store/useCartStore', () => ({
    useCartStore: vi.fn(),
}));


vi.mock('next/image', () => ({
    default: (props: any) => <img {...props} />,
}));


vi.mock('next/link', () => ({
    default: ({ children }: any) => <div>{children}</div>,
}));

describe('Navbar', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render logo', () => {
        (useCartStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
            cart: [],
        });

        render(<Navbar />);
        expect(screen.getByAltText('Equal Experts Logo')).toBeInTheDocument();
    });

    it('should show simplified cart icon when cart is empty', () => {
        (useCartStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
            cart: [],
        });

        render(<Navbar />);

        const cartButton = screen.getByLabelText('View cart');
        expect(cartButton).toBeInTheDocument();

        const badge = screen.queryByText(/[0-9]+/);
        expect(badge).not.toBeInTheDocument();
    });

    it('should show cart count when items exist', () => {
        (useCartStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
            cart: [
                { product: { id: 1, price: 10 }, quantity: 2 },
                { product: { id: 2, price: 20 }, quantity: 1 }
            ],
        });

        render(<Navbar />);
        const badge = screen.getByText('3');
        expect(badge).toBeInTheDocument();
    });
});
