import type { Metadata } from 'next';
import { siteConfig } from '@/lib/config';
import { generateWhatsAppInquiryUrl } from '@/lib/whatsapp';
import { MessageCircle, Phone, Mail, Clock, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us | NOIRVALE',
  description: 'Get in touch with NOIRVALE Fragrances.',
};

export default function ContactPage() {
  const whatsappUrl = generateWhatsAppInquiryUrl(
    'Hello NOIRVALE,\n\nI have a general inquiry from the website.\n\nThank you.'
  );
  const hasWhatsApp = Boolean(siteConfig.contact.whatsapp);

  return (
    <div className="bg-[#0a0a0a] text-[#faf7f4] min-h-screen pt-10 pb-16 md:pt-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-serif mb-4 text-center text-[#c9a96e]">Contact Us</h1>
        <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
          We&apos;re here to help you find your signature scent. Reach out to us directly for
          personalized recommendations, order inquiries, or any other questions.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Main CTA */}
          <div className="bg-white/5 border border-[#c9a96e]/30 rounded-xl p-8 flex flex-col items-center text-center justify-center">
            <MessageCircle className="w-16 h-16 text-[#c9a96e] mb-6" />
            <h2 className="text-2xl font-serif mb-4">Chat with Us</h2>
            <p className="text-gray-400 mb-8">
              For the fastest response, send us a message on WhatsApp. Our fragrance concierges
              are ready to assist you.
            </p>
            {hasWhatsApp ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] text-white px-6 py-4 rounded-md font-medium hover:bg-[#20bd5a] transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Message on WhatsApp
              </a>
            ) : (
              <div className="w-full rounded-md border border-white/10 bg-white/5 px-6 py-4 text-center text-sm text-gray-400">
                WhatsApp number is not configured yet.
              </div>
            )}
          </div>

          {/* Contact Details */}
          <div className="space-y-8">
            {siteConfig.contact.phone && (
              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-[#c9a96e] mt-1 shrink-0" />
                <div>
                  <h3 className="text-lg font-medium mb-1">Phone</h3>
                  <p className="text-gray-400">{siteConfig.contact.phone}</p>
                </div>
              </div>
            )}

            {siteConfig.contact.email && (
              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-[#c9a96e] mt-1 shrink-0" />
                <div>
                  <h3 className="text-lg font-medium mb-1">Email</h3>
                  <p className="text-gray-400">{siteConfig.contact.email}</p>
                </div>
              </div>
            )}

            {siteConfig.business.hours && (
              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-[#c9a96e] mt-1 shrink-0" />
                <div>
                  <h3 className="text-lg font-medium mb-1">Business Hours</h3>
                  <p className="text-gray-400">{siteConfig.business.hours}</p>
                  {siteConfig.business.closedDay && (
                    <p className="text-gray-400">Closed on {siteConfig.business.closedDay}</p>
                  )}
                </div>
              </div>
            )}

            {siteConfig.business.location && (
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-[#c9a96e] mt-1 shrink-0" />
                <div>
                  <h3 className="text-lg font-medium mb-1">Operating Location</h3>
                  <p className="text-gray-400">{siteConfig.business.location}</p>
                  {siteConfig.business.serviceArea && (
                    <p className="text-sm text-gray-500 mt-1">{siteConfig.business.serviceArea}</p>
                  )}
                  {siteConfig.business.deliveryText && (
                    <p className="text-sm text-gray-500 mt-2">{siteConfig.business.deliveryText}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
