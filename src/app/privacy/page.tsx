import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | NOIRVALE',
  description: 'Privacy Policy and data handling practices for NOIRVALE Fragrances.',
};

export default function PrivacyPage() {
  return (
    <div className="bg-[#0a0a0a] text-[#faf7f4] min-h-screen pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-serif mb-6 text-[#c9a96e]">Privacy Policy</h1>
        <p className="text-gray-500 mb-10 text-sm">Last Updated: August 31, 2026</p>

        <div className="space-y-8 text-gray-300 prose prose-invert prose-p:leading-relaxed max-w-none">
          <section>
            <h2 className="text-2xl font-serif mb-4 text-white">1. Introduction</h2>
            <p>
              Welcome to NOIRVALE Fragrances. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif mb-4 text-white">2. Data We Collect</h2>
            <p>
              Since our ordering process is conducted primarily through WhatsApp, the personal data we collect is minimal on the website itself, but may include:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li><strong>Contact Data:</strong> Name, delivery address, and phone number (collected via WhatsApp when you place an order).</li>
              <li><strong>Technical Data:</strong> IP address, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
              <li><strong>Usage Data:</strong> Information about how you use our website.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif mb-4 text-white">3. WhatsApp Communication</h2>
            <p>
              When you choose to contact us or place an order via WhatsApp, your communication with us is subject to WhatsApp&apos;s own privacy policy and terms of service. We use the information you provide in these chats solely for processing your orders, providing customer support, and, with your permission, notifying you about new arrivals. We do not sell or share your phone numbers with third parties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif mb-4 text-white">4. Cookies</h2>
            <p>
              Our website may use standard cookies to distinguish you from other users of our website. This helps us to provide you with a good experience when you browse our website and also allows us to improve our site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif mb-4 text-white">5. Contact Us</h2>
            <p>
              If you have any questions about this privacy policy or our privacy practices, please contact us via WhatsApp or email through our Contact page.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}