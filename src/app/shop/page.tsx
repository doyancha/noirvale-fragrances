import type { Metadata } from 'next';
import ShopContent from '@/components/shop/ShopContent';
import { siteConfig } from '@/lib/config';
import { getStorefrontProducts } from '@/lib/catalog/server';

export const metadata: Metadata = {
  title: 'Shop All Fragrances',
  description:
    'Explore our complete collection of sophisticated men\'s fragrances. From bold ouds to fresh aquatics — find your signature scent at NOIRVALE.',
};

export default async function ShopPage() {
  const products = await getStorefrontProducts();
  return (
    <main className="min-h-screen bg-[#0a0a0a] pb-16 pt-10 text-[#faf7f4] md:pt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mx-auto mb-12 max-w-3xl text-center">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-[#c9a96e]">
            {siteConfig.brand.shortName}
          </p>
          <h1 className="mb-4 font-serif text-4xl md:text-5xl">Our Collection</h1>
          <p className="text-lg text-[#faf7f4]/60">
            Discover our complete range of meticulously crafted fragrances.
            From fresh citrus to deep woods, find your perfect signature scent.
          </p>
        </header>

        <ShopContent initialProducts={products} />
      </div>
    </main>
  );
}
