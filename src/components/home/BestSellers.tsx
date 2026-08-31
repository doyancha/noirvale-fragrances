import { getBestSellers } from '@/data/products';
import ProductCard from '@/components/product/ProductCard';

export function BestSellers() {
  const bestSellers = getBestSellers();

  return (
    <section className="bg-noir-900 py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="font-serif text-3xl md:text-5xl text-ivory mb-4">Best Sellers</h2>
          <div className="h-px w-24 bg-gold/50 mx-auto" />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 lg:[&>*:nth-child(4)]:col-start-2 lg:[&>*:nth-child(5)]:col-start-3 md:[&>*:nth-child(5)]:col-span-2 md:[&>*:nth-child(5)]:justify-self-center md:[&>*:nth-child(5)]:max-w-md">
          {bestSellers.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
