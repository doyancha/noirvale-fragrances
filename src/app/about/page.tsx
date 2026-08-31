import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About NOIRVALE',
  description: 'Our story and vision for curated masculine fragrances.',
};

export default function AboutPage() {
  return (
    <div className="bg-[#0a0a0a] text-[#faf7f4] min-h-screen pt-10 pb-16 md:pt-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-serif mb-8 text-center text-[#c9a96e]">Our Story</h1>

        <div className="space-y-12 text-lg text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-serif mb-4 text-[#faf7f4]">The NOIRVALE Vision</h2>
            <p className="mb-4">
              NOIRVALE Fragrances was born from a singular passion: curating the most exceptional masculine scents for the modern gentleman. We believe that a fragrance is more than just a scent—it is an invisible signature, a statement of character, and a lasting impression.
            </p>
            <p>
              Our carefully selected collection cuts through the noise of the crowded perfume market, offering only those fragrances that meet our uncompromising standards for quality, longevity, and distinctiveness.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif mb-4 text-[#faf7f4]">What Makes Us Different</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
              <div className="border border-[#c9a96e]/30 p-6 rounded-lg bg-white/5">
                <h3 className="text-xl font-medium text-[#c9a96e] mb-2">Curated Selection</h3>
              <p className="text-sm">We don&apos;t offer everything. We offer the best. Each fragrance in our catalog has been carefully selected for its distinctive profile.</p>
              </div>
              <div className="border border-[#c9a96e]/30 p-6 rounded-lg bg-white/5">
                <h3 className="text-xl font-medium text-[#c9a96e] mb-2">Transparent Information</h3>
                <p className="text-sm">We provide detailed notes, performance metrics, and honest descriptions to help you find your perfect signature scent without the marketing fluff.</p>
              </div>
              <div className="border border-[#c9a96e]/30 p-6 rounded-lg bg-white/5">
                <h3 className="text-xl font-medium text-[#c9a96e] mb-2">Personal Service</h3>
                <p className="text-sm">Through our WhatsApp-first ordering system, we provide a personalized concierge experience, answering your questions and guiding your selection.</p>
              </div>
              <div className="border border-[#c9a96e]/30 p-6 rounded-lg bg-white/5">
                <h3 className="text-xl font-medium text-[#c9a96e] mb-2">Authentic Product Information</h3>
                <p className="text-sm">Each listing is written to mirror the product details we provide in the catalog, with concentration, size, and note information kept easy to review before ordering.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-serif mb-4 text-[#faf7f4]">Our Mission</h2>
            <p className="text-xl italic text-gray-400 border-l-4 border-[#c9a96e] pl-6 py-2">
              &ldquo;To elevate the personal grooming experience by providing access to world-class masculine fragrances, paired with careful service and expertise.&rdquo;
            </p>
          </section>

          <div className="mt-16 text-center">
            <Link
              href="/shop"
              className="inline-block bg-[#c9a96e] text-black px-8 py-4 rounded-md font-medium hover:bg-[#d4b782] transition-colors"
            >
              Explore the Collection
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
