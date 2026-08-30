'use client';

import type { Product } from '@/lib/types';
import { formatPrice, cn } from '@/lib/utils';
import { generateWhatsAppOrderUrl } from '@/lib/whatsapp';
import Image from 'next/image';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const startingSize = product.sizes[0];
  const startingPrice = startingSize?.price ?? 0;

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = generateWhatsAppOrderUrl({
      productName: product.name,
      size: startingSize?.label,
      price: formatPrice(startingSize?.price ?? 0),
      productUrl: `${window.location.origin}/products/${product.slug}`,
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col gap-4 border border-transparent p-2 transition-all duration-300 hover:border-[#c9a96e]/20"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#1a1a1a]">
        <Image
          src={product.images.main}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/20" />

        {/* View Details Text on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="border border-[#faf7f4]/10 bg-[#0a0a0a]/80 px-6 py-3 font-sans text-sm uppercase tracking-widest text-[#faf7f4] backdrop-blur-sm">
            View Details
          </span>
        </div>

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {product.isBestseller && (
            <Badge variant="gold">Best Seller</Badge>
          )}
          {product.isNew && (
            <Badge variant="outline">New</Badge>
          )}
        </div>

        {/* WhatsApp Quick Order Button */}
        <button
          onClick={handleWhatsAppClick}
          className={cn(
            'absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all duration-300 hover:bg-[#128C7E]',
            'translate-y-0 opacity-100 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100'
          )}
          aria-label={`Order ${product.name} via WhatsApp`}
        >
          <MessageCircle className="h-5 w-5" />
        </button>
      </div>

      <div className="flex flex-col gap-1 px-2">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-xl text-[#faf7f4] transition-colors group-hover:text-[#c9a96e]">
            {product.name}
          </h3>
          <span className="font-sans text-sm text-[#faf7f4]">
            {formatPrice(startingPrice)}
          </span>
        </div>
        <p className="font-sans text-sm text-[#faf7f4]/60">
          {product.scentFamily}
        </p>
        {startingSize && (
          <p className="font-sans text-xs uppercase tracking-[0.25em] text-[#faf7f4]/45">
            From {startingSize.label}
          </p>
        )}
      </div>
    </Link>
  );
}