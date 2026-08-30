import ProductCard from './ProductCard';

interface ProductGridProps {
  children?: React.ReactNode;
}

export default function ProductGrid({ children }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-8">
      {children}
    </div>
  );
}

export function ProductGridWithData({ products }: { products: import('@/lib/types').Product[] }) {
  if (!products || products.length === 0) {
    return (
      <div className="py-20 text-center font-serif text-2xl text-[#faf7f4]/50">
        No fragrances found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}