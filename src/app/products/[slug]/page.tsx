import { products, getProductBySlug, getRelatedProducts } from '@/data/products';
import { siteConfig } from '@/lib/config';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ProductDetail from '@/components/product/ProductDetail';
import ProductCard from '@/components/product/ProductCard';

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return { title: 'Product Not Found' };
  }

  return {
    title: `${product.name} — ${product.scentFamily}`,
    description: product.shortDescription,
    openGraph: {
      title: `${product.name} | ${siteConfig.brand.displayName}`,
      description: product.shortDescription,
      url: `${siteConfig.seo.siteUrl}/products/${product.slug}`,
      siteName: siteConfig.brand.displayName,
      images: [
        {
          url: product.images.main,
          width: 800,
          height: 1067,
          alt: product.name,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.shortDescription,
      images: [product.images.main],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = getRelatedProducts(product, 4);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: [product.images.main, ...product.images.gallery],
    description: product.shortDescription,
    brand: {
      '@type': 'Brand',
      name: siteConfig.brand.displayName,
    },
    offers: {
      '@type': 'AggregateOffer',
      url: `${siteConfig.seo.siteUrl}/products/${product.slug}`,
      priceCurrency: 'BDT',
      lowPrice: product.sizes[0]?.price,
      highPrice: product.sizes[product.sizes.length - 1]?.price,
      offerCount: product.sizes.length,
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.seo.siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Shop', item: `${siteConfig.seo.siteUrl}/shop` },
      { '@type': 'ListItem', position: 3, name: product.name, item: `${siteConfig.seo.siteUrl}/products/${product.slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <main className="bg-[#0a0a0a] pt-10 md:pt-12">
        <ProductDetail key={product.slug} product={product} siteUrl={siteConfig.seo.siteUrl} />

        {relatedProducts.length > 0 && (
          <section className="border-t border-[#2a2a2a] bg-[#0a0a0a] py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className="mb-8 text-center font-serif text-2xl text-[#faf7f4] md:text-3xl">
                You May Also Like
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {relatedProducts.map((rp) => (
                  <ProductCard key={rp.id} product={rp} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
