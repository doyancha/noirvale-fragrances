import { Hero } from '@/components/home/Hero';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { BestSellers } from '@/components/home/BestSellers';
import { CollectionShowcase } from '@/components/home/CollectionShowcase';
import { SignatureFeature } from '@/components/home/SignatureFeature';
import { ShopByOccasion } from '@/components/home/ShopByOccasion';
import { WhyNoirvale } from '@/components/home/WhyNoirvale';
import { EditorialBanner } from '@/components/home/EditorialBanner';
import { FAQPreview } from '@/components/home/FAQPreview';
import { FinalCTA } from '@/components/home/FinalCTA';
import { siteConfig } from '@/lib/config';
import { getStorefrontCollections, getStorefrontProductBySlug, getStorefrontProducts } from '@/lib/catalog/server';
import { getBusinessSettings } from '@/lib/business/server';
import { buildFaqItems } from '@/data/faq';

export default async function HomePage() {
  const [products, collections, settings] = await Promise.all([
    getStorefrontProducts(),
    getStorefrontCollections(),
    getBusinessSettings(),
  ]);
  const signatureProduct = await getStorefrontProductBySlug(
    products.find((product) => product.name.includes('Imperial Oud'))?.slug ?? 'imperial-oud'
  );
  const hasSiteUrl = Boolean(siteConfig.seo.siteUrl);
  const contactPoint =
    settings.contact.email || settings.contact.phone || siteConfig.contact.whatsapp
      ? {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          ...(settings.contact.email ? { email: settings.contact.email } : {}),
          ...(settings.contact.phone ? { telephone: settings.contact.phone } : {}),
      }
      : undefined;

  return (
    <>
      <main>
        <Hero />
        <FeaturedProducts products={products} />
        <CollectionShowcase collections={collections} />
        <BestSellers products={products} />
        <SignatureFeature products={products} signatureProduct={signatureProduct} />
        <ShopByOccasion />
        <WhyNoirvale />
        <EditorialBanner />
        <FAQPreview items={buildFaqItems(settings)} />
        <FinalCTA />
      </main>

      {/* Structured Data — Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: siteConfig.brand.displayName,
            description: siteConfig.brand.description,
            ...(hasSiteUrl ? { url: siteConfig.seo.siteUrl } : {}),
            ...(contactPoint ? { contactPoint } : {}),
          }),
        }}
      />

      {/* Structured Data — WebSite */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: siteConfig.brand.displayName,
            ...(hasSiteUrl ? { url: siteConfig.seo.siteUrl } : {}),
          }),
        }}
      />
    </>
  );
}
