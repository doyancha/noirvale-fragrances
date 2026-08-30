'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { generateWhatsAppInquiryUrl } from '@/lib/whatsapp';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/noirvale/products/noir-reserve/main.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-noir-950/80 bg-gradient-to-t from-noir-950 via-noir-950/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex flex-col items-center text-center">
        <div className="animate-fade-in-up motion-reduce:animate-none">
          <p className="text-gold tracking-[0.3em] uppercase text-sm md:text-base font-semibold mb-6">
            NOIRVALE FRAGRANCES
          </p>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-ivory mb-6 leading-tight">
            Make Your Presence<br />Unforgettable
          </h1>
          <p className="text-ivory/70 max-w-xl mx-auto text-lg md:text-xl mb-10">
            Sophisticated men&apos;s fragrances crafted for those who understand that true presence requires no announcement.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button href="/shop" size="lg" className="w-full sm:w-auto text-base">
              Shop Fragrances
            </Button>
            <Button
              href={generateWhatsAppInquiryUrl(
                'Hello NOIRVALE,\n\nI am interested in exploring your fragrances.\n\nThank you.'
              )}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto text-base border-gold/30 text-gold hover:bg-gold/10"
            >
              Order on WhatsApp
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-fade-in motion-reduce:animate-none">
        <div className="motion-safe:animate-bounce-subtle text-gold">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </div>
    </section>
  );
}