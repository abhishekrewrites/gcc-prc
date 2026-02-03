import { apiClient } from '@/lib/api-client'

export interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating?: {
        rate: number;
        count: number;
    };
}



export const getProducts = async (): Promise<Product[]> => {
    return apiClient.get<Product[]>('frontend-take-home-test-data/products.json');
};
