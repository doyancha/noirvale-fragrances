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

export default function HomePage() {
  const hasSiteUrl = Boolean(siteConfig.seo.siteUrl);
  const contactPoint =
    siteConfig.contact.email || siteConfig.contact.phone || siteConfig.contact.whatsapp
      ? {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          ...(siteConfig.contact.email ? { email: siteConfig.contact.email } : {}),
          ...(siteConfig.contact.phone ? { telephone: siteConfig.contact.phone } : {}),
        }
      : undefined;
  const sameAs = [
    siteConfig.social.facebook,
    siteConfig.social.instagram,
    siteConfig.social.pinterest,
  ].filter(Boolean);

  return (
    <>
      <main>
        <Hero />
        <FeaturedProducts />
        <CollectionShowcase />
        <BestSellers />
        <SignatureFeature />
        <ShopByOccasion />
        <WhyNoirvale />
        <EditorialBanner />
        <FAQPreview />
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
            ...(sameAs.length ? { sameAs } : {}),
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