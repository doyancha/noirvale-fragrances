import Image from 'next/image';

export function EditorialBanner() {
  return (
    <section className="relative py-32 lg:py-48 flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/noirvale/products/velvet-smoke/main.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-noir-950/80" />
      </div>

      <div className="relative z-10 container mx-auto px-4 max-w-4xl text-center">
        <blockquote className="font-serif italic text-3xl md:text-5xl lg:text-6xl text-ivory leading-tight mb-8">
          &ldquo;A fragrance should arrive before you do &mdash; and linger after you leave.&rdquo;
        </blockquote>
        <p className="text-gold tracking-[0.2em] uppercase font-semibold">
          — NOIRVALE
        </p>
      </div>
    </section>
  );
}