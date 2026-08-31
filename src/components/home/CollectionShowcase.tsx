import Link from 'next/link';
import { collections } from '@/data/products';

export function CollectionShowcase() {
  return (
    <section className="bg-noir-950 py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="font-serif text-3xl md:text-5xl text-ivory mb-4">Shop by Collection</h2>
          <div className="h-px w-24 bg-gold/50 mx-auto" />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 lg:[&>*:nth-child(4)]:col-start-2 lg:[&>*:nth-child(5)]:col-start-3 md:[&>*:nth-child(5)]:col-span-2 md:[&>*:nth-child(5)]:justify-self-center md:[&>*:nth-child(5)]:max-w-lg">
          {collections.map(collection => (
            <Link
              key={collection.slug}
              href={`/collections/${collection.slug}`}
              className="group relative overflow-hidden aspect-[4/3] flex flex-col justify-end"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-in-out group-hover:scale-105"
                style={{ backgroundImage: `url(${collection.image})` }}
              />
              <div className="absolute inset-0 bg-noir-950/60 transition-colors duration-500 group-hover:bg-noir-950/40" />

              <div className="relative z-10 p-8 md:p-12">
                <h3 className="font-serif text-3xl md:text-4xl text-ivory mb-3">{collection.name}</h3>
                <p className="text-ivory/80 max-w-md mb-6">{collection.description}</p>
                <span className="inline-block text-gold uppercase tracking-widest text-sm font-medium transition-transform group-hover:translate-x-2">
                  Explore Collection &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
