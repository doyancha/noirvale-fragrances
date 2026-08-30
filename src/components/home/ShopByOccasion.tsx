import Link from 'next/link';
import { slugify } from '@/lib/utils';

const occasions = [
  { name: 'Everyday', desc: 'Versatile and fresh', icon: 'M12 3v2m0 14v2m9-9h-2M5 12H3m14.485-7.071l-1.414 1.414M6.343 17.657l-1.414 1.414m12.728 0l-1.414-1.414M6.343 6.343L4.929 4.929' },
  { name: 'Office', desc: 'Professional and subtle', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { name: 'Evening', desc: 'Bold and captivating', icon: 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z' },
  { name: 'Date Night', desc: 'Intimate and alluring', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
  { name: 'Formal', desc: 'Elegant and refined', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
  { name: 'Gifting', desc: 'Universally appreciated', icon: 'M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7' },
];

export function ShopByOccasion() {
  return (
    <section className="bg-noir-950 py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="font-serif text-3xl md:text-5xl text-ivory mb-4">Shop by Occasion</h2>
          <div className="h-px w-24 bg-gold/50 mx-auto" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {occasions.map((occasion) => (
            <Link
              key={occasion.name}
              href={`/shop?occasion=${slugify(occasion.name)}`}
              className="bg-noir-900 border border-noir-800 p-8 text-center group hover:border-gold/30 transition-colors"
            >
              <div className="w-12 h-12 mx-auto mb-6 rounded-full bg-noir-800 flex items-center justify-center text-gold group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={occasion.icon} />
                </svg>
              </div>
              <h3 className="font-serif text-2xl text-ivory mb-2">{occasion.name}</h3>
              <p className="text-ivory/60 text-sm">{occasion.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}