import type { Metadata } from 'next';
import { getBusinessSettings } from '@/lib/business/server';

export const metadata: Metadata = {
  title: 'Delivery Information | NOIRVALE',
  description: 'Learn about NOIRVALE delivery timelines, charges, COD, and order confirmation.',
};

export default async function DeliveryPage() {
  const settings = await getBusinessSettings();
  const { delivery } = settings.customerCare;

  return (
    <div className="bg-[#0a0a0a] text-[#faf7f4] min-h-screen pt-10 pb-16 md:pt-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-4 text-center font-serif text-4xl text-[#c9a96e] md:text-5xl">
          Delivery Information
        </h1>
        <p className="mx-auto mb-12 max-w-2xl text-center text-gray-400">
          {settings.business.location} serves as our operating base for a {settings.business.serviceArea.toLowerCase()}
          delivery workflow handled directly through WhatsApp.
        </p>

        <div className="space-y-8 text-gray-300">
          <section className="rounded-xl border border-[#c9a96e]/20 bg-white/5 p-8">
            <h2 className="mb-4 font-serif text-2xl text-white">How Ordering Works</h2>
            <ol className="mt-4 space-y-3 pl-5 text-gray-400">
              <li>Choose a fragrance and size on the website.</li>
              <li>Tap Order on WhatsApp to open a pre-filled message.</li>
              <li>We confirm availability, delivery location, and final arrangement in chat.</li>
              <li>Your parcel is prepared and dispatched after confirmation.</li>
            </ol>
          </section>

          <section>
            <h2 className="mb-4 font-serif text-2xl text-[#c9a96e]">Delivery Summary</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-lg border border-white/10 p-6">
                <h3 className="mb-2 text-xl font-medium text-white">Inside Dhaka</h3>
                <p className="mb-2 text-sm text-gray-400">
                  Estimated delivery: {delivery.insideDhaka.estimate}
                </p>
                <p className="text-sm">
                  Delivery charge: {delivery.insideDhaka.charge}
                </p>
              </div>
              <div className="rounded-lg border border-white/10 p-6">
                <h3 className="mb-2 text-xl font-medium text-white">Outside Dhaka</h3>
                <p className="mb-2 text-sm text-gray-400">
                  Estimated delivery: {delivery.outsideDhaka.estimate}
                </p>
                <p className="text-sm">
                  Delivery charge: {delivery.outsideDhaka.charge}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-white/10 bg-white/5 p-8">
            <h2 className="mb-4 font-serif text-2xl text-[#c9a96e]">Payment and Confirmation</h2>
            <div className="space-y-3 text-gray-300">
              <p>{delivery.cod === 'Available' ? 'Cash on Delivery is available.' : delivery.cod}</p>
              <p>{delivery.advancePayment}</p>
              <p>{delivery.confirmation}</p>
              <p>{delivery.summary}</p>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-white/10 p-6">
              <h2 className="mb-3 font-serif text-xl text-[#c9a96e]">Delivery Timing Note</h2>
              <p className="text-sm leading-relaxed text-gray-300">{delivery.timingNote}</p>
            </div>
            <div className="rounded-lg border border-white/10 p-6">
              <h2 className="mb-3 font-serif text-xl text-[#c9a96e]">Order Details</h2>
              <p className="text-sm leading-relaxed text-gray-300">
                Final confirmation can cover {settings.customerCare.orderConfirmationFields.join(', ')}.
              </p>
            </div>
          </section>

          <section className="rounded-xl border border-white/10 bg-[#111111]/70 p-8">
            <h2 className="mb-4 font-serif text-2xl text-white">Storage and Delivery Care</h2>
            <p className="text-gray-300">{settings.customerCare.fragranceGuidance.storage}</p>
          </section>
        </div>
      </div>
    </div>
  );
}
