import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import ProductCard from '@/components/product/ProductCard';
import { siteConfig } from '@/lib/config';
import { getStorefrontCollectionBySlug, getStorefrontCollectionDetail, getStorefrontCollections } from '@/lib/catalog/server';

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = true;
export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const collections = await getStorefrontCollections();
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getStorefrontCollectionBySlug(slug);
  if (!collection) return { title: 'Collection Not Found' };
  return {
    title: `${collection.name} Collection`,
    description: collection.description,
    openGraph: {
      title: `${collection.name} Collection | NOIRVALE Fragrances`,
      description: collection.description,
      url: `${siteConfig.seo.siteUrl}/collections/${collection.slug}`,
      siteName: siteConfig.brand.displayName,
      images: [
        {
          url: collection.image,
          width: 1200,
          height: 900,
          alt: collection.name,
        },
      ],
    },
  };
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;
  const detail = await getStorefrontCollectionDetail(slug);
  if (!detail) notFound();
  const { collection, products } = detail;

  return (
    <main className="min-h-screen bg-[#0a0a0a] pb-16 text-[#faf7f4]">
      <section className="relative flex h-[40vh] min-h-[400px] items-center justify-center">
        {collection.image ? (
          <Image
            src={collection.image}
            alt={collection.name}
            fill
            className="object-cover opacity-50"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-[#1a1a1a]" aria-label={`${collection.name} image unavailable`} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
        <div className="relative z-10 mx-auto mt-16 max-w-3xl px-4 text-center">
          <Link
            href="/collections/all"
            className="mb-4 inline-block text-sm font-medium uppercase tracking-widest text-[#c9a96e] hover:text-[#d4ba85]"
          >
            ← All Collections
          </Link>
          <h1 className="mb-4 font-serif text-4xl md:text-5xl">{collection.name}</h1>
          <p className="text-lg text-[#faf7f4]/60 md:text-xl">{collection.description}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-serif text-2xl">Explore the Collection</h2>
          <span className="text-sm text-[#faf7f4]/40">{products.length} Fragrances</span>
        </div>
        {products.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="border border-[#2a2a2a] bg-[#111111]/50 py-20 text-center">
            <p className="mb-2 font-serif text-xl">Coming Soon</p>
            <p className="text-[#faf7f4]/40">Products for this collection are being crafted.</p>
          </div>
        )}
      </section>
    </main>
  );
}
