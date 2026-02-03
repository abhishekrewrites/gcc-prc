import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CartPage from '../page';
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

vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
    }),
}));

const mockProduct = {
    id: 1,
    title: 'Test Product',
    price: 100,
    description: 'Test Description',
    category: 'Test Category',
    image: 'test.jpg',
    rating: { rate: 4.5, count: 10 }
};

describe('CartPage', () => {
    const removeFromCartMock = vi.fn();
    const updateQuantityMock = vi.fn();
    const clearCartMock = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render empty cart state', () => {
        (useCartStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
            cart: [],
            updateQuantity: updateQuantityMock,
            removeFromCart: removeFromCartMock,
            clearCart: clearCartMock,
        });

        render(<CartPage />);
        expect(screen.getByText('Your Cart is Empty')).toBeInTheDocument();
        expect(screen.getByText('Start Shopping')).toBeInTheDocument();
    });

    it('should render cart with items', () => {
        const cartItems = [
            { product: mockProduct, quantity: 2 }
        ];

        (useCartStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
            cart: cartItems,
            updateQuantity: updateQuantityMock,
            removeFromCart: removeFromCartMock,
            clearCart: clearCartMock,
        });

        render(<CartPage />);

        expect(screen.getByText('Shopping Cart')).toBeInTheDocument();
        expect(screen.getByText('Test Product')).toBeInTheDocument();
        expect(screen.getAllByText('$200.00')[0]).toBeInTheDocument();
    });

    it('should show correct total', () => {
        const cartItems = [
            { product: mockProduct, quantity: 2 }
        ];

        (useCartStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
            cart: cartItems,
            updateQuantity: updateQuantityMock,
            removeFromCart: removeFromCartMock,
            clearCart: clearCartMock,
        });

        render(<CartPage />);


        const totals = screen.getAllByText('$200.00');
        expect(totals.length).toBeGreaterThan(0);
    });

    it('should call clearCart', () => {
        const cartItems = [
            { product: mockProduct, quantity: 1 }
        ];

        (useCartStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
            cart: cartItems,
            updateQuantity: updateQuantityMock,
            removeFromCart: removeFromCartMock,
            clearCart: clearCartMock,
        });

        render(<CartPage />);

        const clearButton = screen.getByText('Clear Cart');
        fireEvent.click(clearButton);

        expect(clearCartMock).toHaveBeenCalled();
    });
});
