import { Button } from '@/components/ui/Button';
import { generateWhatsAppInquiryUrl } from '@/lib/whatsapp';

export function FinalCTA() {
  return (
    <section className="bg-noir-950 py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-gold/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative z-10 text-center">
        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-ivory mb-6">
          Ready to Find Your Signature Scent?
        </h2>
        <p className="text-ivory/70 text-lg md:text-xl mb-12 max-w-2xl mx-auto">
          Explore our collection of premium masculine fragrances or reach out to our concierge for personalized recommendations.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            href={generateWhatsAppInquiryUrl(
              'Hello NOIRVALE,\n\nI would like a personalized fragrance recommendation.\n\nThank you.'
            )}
            size="lg"
            className="w-full sm:w-auto text-base"
          >
            Chat with Concierge
          </Button>
          <Button
            href="/shop"
            variant="outline"
            size="lg"
            className="w-full sm:w-auto text-base border-gold/30 text-gold hover:bg-gold/10"
          >
            Explore Collection
          </Button>
        </div>
      </div>
    </section>
  );
}