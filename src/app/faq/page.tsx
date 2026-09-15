import Accordion from '@/components/ui/Accordion';
import { buildFaqItems } from '@/data/faq';
import { getBusinessSettings } from '@/lib/business/server';
import Link from 'next/link';

export default async function FAQPage() {
  const faqItems = buildFaqItems(await getBusinessSettings());
  return (
    <div className="bg-[#0a0a0a] text-[#faf7f4] min-h-screen pt-10 pb-16 md:pt-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-serif mb-4 text-center text-[#c9a96e]">Frequently Asked Questions</h1>
        <p className="text-center text-gray-400 mb-12">
          Find answers to common questions about our products, ordering, and delivery.
        </p>

        <Accordion items={faqItems} />

        <div className="mt-16 text-center border-t border-white/10 pt-10">
          <h2 className="text-2xl font-serif mb-4">Still have questions?</h2>
          <p className="text-gray-400 mb-6">We&apos;re always here to help you make the perfect choice.</p>
          <Link
            href="/contact"
            className="inline-block border border-[#c9a96e] text-[#c9a96e] px-8 py-3 rounded-md font-medium hover:bg-[#c9a96e]/10 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
