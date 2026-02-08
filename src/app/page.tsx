import { getProducts } from "@/services/product-service";
import { ProductListing } from "@/components/ProductListing";

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Our Products</h1>
      <ProductListing initialProducts={products} />
    </main>
  );
}
