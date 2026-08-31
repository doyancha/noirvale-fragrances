import { getFeaturedProducts } from '@/data/products';
import ProductCard from '@/components/product/ProductCard';
import { Button } from '@/components/ui/Button';

export function FeaturedProducts() {
  const featuredProducts = getFeaturedProducts();

  return (
    <section className="bg-noir-950 py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="font-serif text-3xl md:text-5xl text-ivory mb-4">Featured Fragrances</h2>
          <div className="h-px w-24 bg-gold/50 mx-auto" />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 mb-16">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center">
          <Button href="/shop" variant="outline" className="border-gold/30 text-gold hover:bg-gold/10">
            View All Fragrances
          </Button>
        </div>
      </div>
    </section>
  );
}
