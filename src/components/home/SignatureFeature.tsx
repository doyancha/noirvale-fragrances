import Image from 'next/image';
import { getFeaturedProducts } from '@/data/products';
import { Button } from '@/components/ui/Button';

export function SignatureFeature() {
  const products = getFeaturedProducts();
  const heroProduct = products.find(p => p.name.includes('Imperial Oud')) || products[0];

  if (!heroProduct) return null;

  return (
    <section className="bg-noir-900 overflow-hidden">
      <div className="flex flex-col lg:flex-row">
        {/* Left: Image */}
        <div className="w-full lg:w-[60%] relative aspect-square lg:aspect-auto lg:min-h-[800px]">
          <Image
            src={heroProduct.images.main || '/noirvale/products/noir-reserve/main.webp'}
            alt={heroProduct.name}
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover object-center"
          />
        </div>

        {/* Right: Content */}
        <div className="w-full lg:w-[40%] flex items-center p-8 md:p-16 lg:p-20">
          <div className="max-w-xl">
            <span className="text-gold tracking-[0.2em] uppercase text-sm font-semibold mb-4 block">
              Signature Scent
            </span>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-ivory mb-2">
              {heroProduct.name}
            </h2>
            <p className="text-ivory/60 text-lg mb-8 italic">
              &ldquo;{heroProduct.shortDescription.split('.')[0]}.&rdquo;
            </p>

            <p className="text-ivory/80 mb-10 leading-relaxed">
              {heroProduct.fullDescription}
            </p>

            <div className="mb-10">
              <h4 className="text-ivory font-semibold mb-4 text-sm uppercase tracking-wider">Key Notes</h4>
              <div className="flex flex-wrap gap-2">
                {[...heroProduct.notes.top, ...heroProduct.notes.heart].slice(0, 5).map(note => (
                  <span key={note} className="px-4 py-2 bg-noir-800 text-gold text-sm border border-gold/20 rounded-sm">
                    {note}
                  </span>
                ))}
              </div>
            </div>

            <Button href={`/products/${heroProduct.slug}`} size="lg" className="w-full sm:w-auto">
              Discover {heroProduct.name}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}