'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/useCartStore';
import { useEffect, useState } from 'react';

export const Navbar = () => {
    const { cart } = useCartStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <nav className="flex items-center justify-between px-6 py-4 sticky top-0 z-50 bg-[var(--navbar-bg)] text-white">
            <div className="flex items-center">
                <Link href="/">
                    <Image
                        src="https://www.equalexperts.com/wp-content/uploads/2024/10/2024-Logo.svg"
                        alt="Equal Experts Logo"
                        width={150}
                        height={40}
                        className="cursor-pointer"
                        priority
                    />
                </Link>
            </div>
            <div className="flex items-center gap-4">
                <Link href="/cart">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative hover:bg-white/10 text-white rounded-full cursor-pointer"
                        aria-label="View cart"
                    >
                        <ShoppingCart size={24} />
                        {mounted && itemCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                {itemCount}
                            </span>
                        )}
                    </Button>
                </Link>
            </div>
        </nav>
    );
};
