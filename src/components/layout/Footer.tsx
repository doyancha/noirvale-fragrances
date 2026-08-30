import Link from 'next/link';
import { Phone, Mail, Clock, MapPin, ArrowUpRight } from 'lucide-react';
import { siteConfig } from '@/lib/config';

export function Footer() {
  const hasBusinessDetails =
    Boolean(siteConfig.contact.phone) ||
    Boolean(siteConfig.contact.email) ||
    Boolean(siteConfig.business.hours);

  return (
    <footer className="bg-[#0a0a0a] text-[#faf7f4] border-t border-white/5 pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand Column */}
          <div className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-[#faf7f4] tracking-widest">
              {siteConfig.brand.shortName}
            </h2>
            <p className="text-[#faf7f4]/70 font-sans text-sm leading-relaxed max-w-sm">
              {siteConfig.brand.description}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              {siteConfig.social.facebook && (
                <a
                  href={siteConfig.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#faf7f4]/70 hover:text-[#c9a96e] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a96e] rounded-sm"
                >
                  Facebook <ArrowUpRight size={14} />
                </a>
              )}
              {siteConfig.social.instagram && (
                <a
                  href={siteConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#faf7f4]/70 hover:text-[#c9a96e] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a96e] rounded-sm"
                >
                  Instagram <ArrowUpRight size={14} />
                </a>
              )}
            </div>
            {!hasBusinessDetails && (
              <p className="max-w-sm text-xs leading-relaxed text-[#faf7f4]/45">
                Direct business contact details are published once they are configured.
              </p>
            )}
          </div>

          {/* Shop Column */}
          <div>
            <h3 className="font-serif text-[#c9a96e] text-lg mb-6">Shop</h3>
            <ul className="space-y-3">
              {siteConfig.navigation.footer.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#faf7f4]/70 hover:text-[#c9a96e] text-sm font-sans transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a96e] rounded-sm px-1 -ml-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="font-serif text-[#c9a96e] text-lg mb-6">Company</h3>
            <ul className="space-y-3">
              {siteConfig.navigation.footer.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#faf7f4]/70 hover:text-[#c9a96e] text-sm font-sans transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a96e] rounded-sm px-1 -ml-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="font-serif text-[#c9a96e] text-lg mb-6">Contact</h3>
            {hasBusinessDetails ? (
              <ul className="space-y-4 text-sm font-sans text-[#faf7f4]/70">
                {siteConfig.contact.phone && (
                  <li className="flex items-start space-x-3">
                    <Phone size={18} className="text-[#c9a96e] shrink-0 mt-0.5" />
                    <span>{siteConfig.contact.phone}</span>
                  </li>
                )}
                {siteConfig.contact.email && (
                  <li className="flex items-start space-x-3">
                    <Mail size={18} className="text-[#c9a96e] shrink-0 mt-0.5" />
                    <a
                      href={`mailto:${siteConfig.contact.email}`}
                      className="hover:text-[#c9a96e] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a96e] rounded-sm px-1 -ml-1"
                    >
                      {siteConfig.contact.email}
                    </a>
                  </li>
                )}
                {siteConfig.business.hours && (
                  <li className="flex items-start space-x-3">
                    <Clock size={18} className="text-[#c9a96e] shrink-0 mt-0.5" />
                    <span>{siteConfig.business.hours}</span>
                  </li>
                )}
                {siteConfig.business.location && (
                  <li className="flex items-start space-x-3">
                    <MapPin size={18} className="text-[#c9a96e] shrink-0 mt-0.5" />
                    <span>{siteConfig.business.location}</span>
                  </li>
                )}
                {siteConfig.business.serviceArea && (
                  <li className="flex items-start space-x-3">
                    <span className="mt-0.5 text-[#c9a96e]">•</span>
                    <span>{siteConfig.business.serviceArea}</span>
                  </li>
                )}
              </ul>
            ) : (
              <p className="text-sm font-sans text-[#faf7f4]/50">
                Business contact details are not configured yet.
              </p>
            )}
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-[#faf7f4]/50 text-xs font-sans">
            &copy; {new Date().getFullYear()} {siteConfig.brand.shortName}. All rights reserved.
          </p>
          <div className="flex space-x-6 text-[#faf7f4]/50 text-xs font-sans">
            <Link
              href="/privacy"
              className="hover:text-[#c9a96e] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a96e] rounded-sm px-1 -ml-1"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-[#c9a96e] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a96e] rounded-sm px-1 -ml-1"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}