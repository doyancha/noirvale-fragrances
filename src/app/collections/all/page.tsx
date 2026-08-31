import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { collections, getProductsForCollection } from '@/data/products';

export const metadata: Metadata = {
  title: 'Our Collections',
  description: 'Explore our curated collections of luxury men\'s fragrances.',
  openGraph: {
    title: 'Our Collections | NOIRVALE Fragrances',
    description: 'Explore our curated collections of luxury men\'s fragrances.',
    type: 'website',
  },
};

export default function CollectionsAllPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] pb-16 pt-10 text-[#faf7f4] md:pt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mx-auto mb-16 mt-8 max-w-3xl text-center">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-[#c9a96e]">
            Curated Scent Profiles
          </p>
          <h1 className="mb-4 font-serif text-4xl md:text-5xl">Our Collections</h1>
          <p className="text-lg text-[#faf7f4]/60">
            Curated assortments of our finest fragrances, grouped by their unique inspirations
            and scent profiles.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 lg:[&>*:nth-child(4)]:col-start-2 lg:[&>*:nth-child(5)]:col-start-3 md:[&>*:nth-child(5)]:col-span-2 md:[&>*:nth-child(5)]:justify-self-center md:[&>*:nth-child(5)]:max-w-lg">
          {collections.map((collection) => {
            const count = getProductsForCollection(collection.slug).length;
            return (
              <Link
                key={collection.slug}
                href={`/collections/${collection.slug}`}
                className="group relative block h-[400px] overflow-hidden bg-[#111111]"
              >
                <div className="absolute inset-0">
                <Image
                  src={collection.image}
                  alt={collection.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover opacity-60 transition-transform duration-700 group-hover:scale-105 group-hover:opacity-80"
                />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent opacity-80" />
                </div>
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <span className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#c9a96e]">
                    {count} {count === 1 ? 'Fragrance' : 'Fragrances'}
                  </span>
                  <h2 className="mb-2 font-serif text-2xl transition-colors group-hover:text-[#c9a96e]">
                    {collection.name}
                  </h2>
                  <p className="line-clamp-2 text-sm text-[#faf7f4]/60">{collection.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
