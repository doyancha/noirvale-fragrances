'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MessageCircle, ChevronRight } from 'lucide-react';
import { formatPrice, cn } from '@/lib/utils';
import { generateWhatsAppOrderUrl } from '@/lib/whatsapp';
import type { Product, ProductSize } from '@/lib/types';
import type { BusinessSettings } from '@/lib/business/types';

interface ProductDetailProps {
  product: Product;
  siteUrl: string;
  businessSettings: BusinessSettings;
}

const longevityLevels = { 'Light': 25, 'Moderate': 50, 'Long-lasting': 75, 'Beast mode': 100 };
const sillageLevels = { 'Intimate': 25, 'Moderate': 50, 'Strong': 75, 'Enormous': 100 };

function getDefaultSize(product: Product): ProductSize | null {
  return product.sizes.find((size) => size.inStock) ?? product.sizes[0] ?? null;
}

export default function ProductDetail({ product, siteUrl, businessSettings }: ProductDetailProps) {
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(() => getDefaultSize(product));
  const [mainImage, setMainImage] = useState<string>(product.images.main);
  const [showStickyCta, setShowStickyCta] = useState(false);
  const mainCtaRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyCta(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    const currentRef = mainCtaRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const productUrl = `${siteUrl}/products/${product.slug}`;

  const whatsappUrl = generateWhatsAppOrderUrl({
    productName: product.name,
    size: selectedSize?.label,
    price: selectedSize ? formatPrice(selectedSize.price) : undefined,
    productUrl,
  });

  return (
    <div className="bg-[#0a0a0a] text-[#faf7f4]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-[#faf7f4]/50">
            <li>
              <Link href="/" className="transition-colors hover:text-[#c9a96e]">
                Home
              </Link>
            </li>
            <ChevronRight className="h-3 w-3" />
            <li>
              <Link href="/shop" className="transition-colors hover:text-[#c9a96e]">
                Shop
              </Link>
            </li>
            <ChevronRight className="h-3 w-3" />
            <li className="text-[#faf7f4]">{product.name}</li>
          </ol>
        </nav>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          {/* Left — Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#1a1a1a]">
              {mainImage ? (
                <Image
                  src={mainImage}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full bg-[#1a1a1a]" aria-label={`${product.name} image unavailable`} />
              )}
            </div>
            {product.images.gallery.length > 1 && (
              <div className="flex gap-3">
                {product.images.gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setMainImage(img)}
                    className={cn(
                      'relative aspect-square w-20 overflow-hidden border-2 transition-colors',
                      mainImage === img
                        ? 'border-[#c9a96e]'
                        : 'border-transparent hover:border-[#c9a96e]/50'
                    )}
                    aria-label={`View image ${i + 1}`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} view ${i + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right — Product Info */}
          <div className="flex flex-col gap-6">
            {/* Header */}
            <div>
              <p className="mb-2 text-sm uppercase tracking-widest text-[#c9a96e]">
                {product.scentFamily}
              </p>
              <h1 className="font-serif text-3xl font-medium md:text-4xl lg:text-5xl">
                {product.name}
              </h1>
              <p className="mt-2 font-serif text-lg italic text-[#faf7f4]/60">
                {product.tagline}
              </p>
            </div>

            {/* Concentration & Collection */}
            <div className="flex flex-wrap gap-3 text-sm text-[#faf7f4]/50">
              <span className="border border-[#2a2a2a] px-3 py-1">{product.concentration}</span>
              <span className="border border-[#2a2a2a] px-3 py-1">{product.collection}</span>
            </div>

            {/* Price */}
            <div className="text-2xl font-sans">
              {selectedSize ? formatPrice(selectedSize.price) : 'Contact for price'}
              {selectedSize?.compareAtPrice && (
                <span className="ml-3 text-base text-[#faf7f4]/40 line-through">
                  {formatPrice(selectedSize.compareAtPrice)}
                </span>
              )}
            </div>

            {/* Size Selector */}
            <div>
              <p className="mb-3 text-sm uppercase tracking-wider text-[#faf7f4]/50">
                Select Size
              </p>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size.label}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    disabled={!size.inStock}
                    className={cn(
                      'border px-6 py-3 text-sm transition-all',
                      selectedSize?.label === size.label
                        ? 'border-[#c9a96e] bg-[#c9a96e]/10 text-[#c9a96e]'
                        : 'border-[#2a2a2a] text-[#faf7f4]/70 hover:border-[#c9a96e]/50',
                      !size.inStock && 'cursor-not-allowed opacity-40'
                    )}
                    aria-label={`Select ${size.label} size`}
                    aria-pressed={selectedSize?.label === size.label}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability */}
            <p className={cn(
              'text-sm',
              product.inStock ? 'text-green-400' : 'text-red-400'
            )}>
              {product.inStock ? '● In Stock' : '● Out of Stock'}
            </p>

            {/* Order on WhatsApp CTA */}
            <a
              ref={mainCtaRef}
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={!selectedSize}
              className={cn(
                'flex w-full items-center justify-center gap-3 px-8 py-4 text-center font-sans text-base font-medium uppercase tracking-wider text-white transition-colors',
                selectedSize ? 'bg-[#25D366] hover:bg-[#128C7E]' : 'cursor-not-allowed bg-[#25D366]/40 pointer-events-none'
              )}
            >
              <MessageCircle className="h-5 w-5" />
              Order on WhatsApp
            </a>

            {/* Short Description */}
            <p className="text-[#faf7f4]/70 leading-relaxed">
              {product.shortDescription}
            </p>

            {/* Divider */}
            <div className="border-t border-[#2a2a2a]" />

            {/* Fragrance Notes */}
            <div>
              <h2 className="mb-4 font-serif text-xl text-[#c9a96e]">Fragrance Notes</h2>
              <div className="grid grid-cols-3 gap-4">
                {(['top', 'heart', 'base'] as const).map((level) => (
                  <div key={level}>
                    <p className="mb-2 text-xs uppercase tracking-wider text-[#faf7f4]/40">
                      {level === 'top' ? 'Top Notes' : level === 'heart' ? 'Heart Notes' : 'Base Notes'}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {product.notes[level].map((note) => (
                        <span
                          key={note}
                          className="border border-[#c9a96e]/30 bg-[#c9a96e]/5 px-2 py-1 text-xs text-[#faf7f4]/80"
                        >
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[#2a2a2a]" />

            {/* Character */}
            <div>
              <h2 className="mb-4 font-serif text-xl text-[#c9a96e]">Character</h2>
              <div className="space-y-4">
                {/* Longevity */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[#faf7f4]/50">Longevity</span>
                    <span>{product.longevity}</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#1a1a1a] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#c9a96e] rounded-full transition-all"
                      style={{ width: `${longevityLevels[product.longevity]}%` }}
                    />
                  </div>
                </div>

                {/* Sillage */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[#faf7f4]/50">Sillage</span>
                    <span>{product.sillage}</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#1a1a1a] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#c9a96e] rounded-full transition-all"
                      style={{ width: `${sillageLevels[product.sillage]}%` }}
                    />
                  </div>
                </div>

                {/* Seasons */}
                <div>
                  <p className="mb-2 text-sm text-[#faf7f4]/50">Seasons</p>
                  <div className="flex flex-wrap gap-2">
                    {product.season.map((s) => (
                      <span key={s} className="bg-[#1a1a1a] px-3 py-1 text-xs text-[#faf7f4]/70">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Occasions */}
                <div>
                  <p className="mb-2 text-sm text-[#faf7f4]/50">Best For</p>
                  <div className="flex flex-wrap gap-2">
                    {product.occasions.map((o) => (
                      <span key={o} className="bg-[#1a1a1a] px-3 py-1 text-xs text-[#faf7f4]/70">
                        {o}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Style */}
                <div>
                  <p className="mb-2 text-sm text-[#faf7f4]/50">Style</p>
                  <div className="flex flex-wrap gap-2">
                    {product.style.map((s) => (
                      <span key={s} className="border border-[#c9a96e]/20 px-3 py-1 text-xs text-[#c9a96e]">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[#2a2a2a]" />

            {/* Full Description */}
            <div>
              <h2 className="mb-3 font-serif text-xl text-[#c9a96e]">About This Fragrance</h2>
              <p className="leading-relaxed text-[#faf7f4]/70">
                {product.fullDescription}
              </p>
            </div>

            {/* Delivery Info */}
            <div className="bg-[#111111] border border-[#2a2a2a] p-5">
              <h3 className="mb-2 font-sans text-sm font-medium uppercase tracking-wider">
                Delivery & Ordering
              </h3>
              <p className="text-sm text-[#faf7f4]/60 leading-relaxed">
                Orders are confirmed via WhatsApp. Tap the order button above to start a
                conversation with our team. {businessSettings.customerCare.delivery.summary} {' '}
                {businessSettings.customerCare.delivery.advancePayment}
              </p>
              <p className="mt-3 text-sm text-[#faf7f4]/45 leading-relaxed">
                {businessSettings.customerCare.delivery.confirmation}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky CTA */}
      <div
        className={cn(
          'fixed inset-x-0 bottom-0 z-40 border-t border-[#2a2a2a] bg-[#0a0a0a]/95 px-4 py-3 backdrop-blur-md transition-transform duration-300 lg:hidden',
          showStickyCta ? 'translate-y-0' : 'translate-y-full'
        )}
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-serif text-sm">{product.name}</p>
            <p className="text-xs uppercase tracking-[0.25em] text-[#faf7f4]/45">
              {selectedSize?.label ?? 'Size unavailable'}
            </p>
            <p className="text-lg font-medium">
              {selectedSize ? formatPrice(selectedSize.price) : 'Contact for price'}
            </p>
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={!selectedSize}
            className={cn(
              'flex items-center gap-2 px-6 py-3 text-sm font-medium uppercase tracking-wider text-white transition-colors',
              selectedSize ? 'bg-[#25D366] hover:bg-[#128C7E]' : 'cursor-not-allowed bg-[#25D366]/40 pointer-events-none'
            )}
          >
            <MessageCircle className="h-4 w-4" />
            Order
          </a>
        </div>
      </div>
    </div>
  );
}
