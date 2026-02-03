import { Product } from '@/services/product-service';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/useCartStore';
import { useState } from 'react';

interface ProductCardProps {
    product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
    const addToCart = useCartStore((state) => state.addToCart);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleAddToCart = () => {
        addToCart(product);
    };


    return (
        <div className="flex flex-col border  rounded-lg overflow-hidden bg-white ">
            <div className="relative h-48 w-full p-4 bg-white flex items-center justify-center">
                <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-contain p-4"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>
            <div className="flex flex-col grow p-4">
                <h3 className="text-lg font-semibold line-clamp-1" title={product.title}>
                    {product.title}
                </h3>
                <p className="text-sm text-gray-500 capitalize mb-2">{product.category}</p>
                <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
                </div>
                <div className="mb-4 grow">
                    <p
                        className={`text-sm text-gray-600 ${!isExpanded ? 'line-clamp-2' : ''}`}
                        title={!isExpanded ? product.description : ''}
                    >
                        {product.description}
                    </p>
                    {product.description.length > 100 && (
                        <Button
                            variant="link"
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="h-auto p-0 text-[#1795D4] text-xs font-medium mt-1 hover:underline"
                        >
                            {isExpanded ? 'See Less' : 'See More'}
                        </Button>
                    )}
                </div>
                <Button
                    onClick={handleAddToCart}
                    className="w-full mt-auto text-[20px] font-normal leading-[30px] py-[10px] px-4"
                >
                    Add to Cart
                </Button>
            </div>
        </div>
    );
};
