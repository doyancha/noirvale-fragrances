import type { Metadata } from 'next';
import { getBusinessSettings } from '@/lib/business/server';

export const metadata: Metadata = {
  title: 'Terms & Conditions | NOIRVALE',
  description: 'Terms and operational conditions for NOIRVALE Fragrances.',
};

export default async function TermsPage() {
  const settings = await getBusinessSettings();
  const { delivery, returns, exchanges, damagedOrWrongProduct, fragranceGuidance } = settings.customerCare;

  return (
    <div className="bg-[#0a0a0a] text-[#faf7f4] min-h-screen pt-10 pb-16 md:pt-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-6 font-serif text-4xl text-[#c9a96e] md:text-5xl">
          Terms & Conditions
        </h1>
        <p className="mb-10 text-sm text-gray-500">Last Updated: August 31, 2026</p>

        <div className="space-y-8 text-gray-300 prose prose-invert prose-p:leading-relaxed max-w-none">
          <section>
            <h2 className="mb-4 text-2xl font-serif text-white">1. Agreement to Terms</h2>
            <p>
              By browsing this website or placing an order with NOIRVALE Fragrances, you agree to
              these operational terms. Please review them before placing an order.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-serif text-white">2. WhatsApp Ordering</h2>
            <p>
              NOIRVALE is WhatsApp-first. An order is only confirmed once we explicitly confirm it
              in chat after reviewing fragrance, size, availability, delivery location, and payment
              arrangement.
            </p>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>Order details are finalized manually through WhatsApp.</li>
              <li>Cash on Delivery is available.</li>
              <li>{delivery.advancePayment}</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-serif text-white">3. Delivery Policy</h2>
            <p>
              Inside Dhaka, delivery is estimated within {delivery.insideDhaka.estimate.toLowerCase()} with a {delivery.insideDhaka.charge} charge.
              Outside Dhaka, delivery is estimated within {delivery.outsideDhaka.estimate.toLowerCase()} with a {delivery.outsideDhaka.charge} charge.
            </p>
            <p className="mt-3">{delivery.timingNote}</p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-serif text-white">4. Returns and Exchanges</h2>
            <p>
              An unopened, unused, and factory-sealed product may be reported for a return request
              within {returns.requestWindow}. Eligible products must be in resalable condition and
              returned with original packaging. {returns.notes}
            </p>
            <p className="mt-3">
              Exchange requests must be made within {exchanges.requestWindow}. Eligible products
              should normally be {exchanges.eligible}. {exchanges.notes}
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-serif text-white">5. Damaged or Wrong Product</h2>
            <p>
              If you receive the wrong perfume, wrong size, a broken bottle, a leaking bottle, or
              another verified fulfilment error, contact us through WhatsApp within{' '}
              {damagedOrWrongProduct.contactWindow}. Share order details and clear photos where
              practical. {damagedOrWrongProduct.evidence}
            </p>
            <p className="mt-3">{damagedOrWrongProduct.preferredResolution}</p>
            <p className="mt-3">{damagedOrWrongProduct.fallback}</p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-serif text-white">
              6. Fragrance Guidance and Storage
            </h2>
            <p>{fragranceGuidance.performance}</p>
            <p className="mt-3">{fragranceGuidance.storage}</p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-serif text-white">7. Product Information</h2>
            <p>
              Product details are presented as accurately as possible based on the catalog
              information available on this website. Fragrance formulations, packaging, and
              performance can vary over time, so please confirm any important details before
              placing an order.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-serif text-white">8. Contact</h2>
            <p>
              If you need help, please reach out through the Contact page or via WhatsApp. We use
              the information you share only to process orders and support customer service.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
