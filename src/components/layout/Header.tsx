'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, MessageCircle, Search } from 'lucide-react';
import { siteConfig } from '@/lib/config';
import { generateWhatsAppInquiryUrl } from '@/lib/whatsapp';
import { cn } from '@/lib/utils';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const [mobileMenuOrigin, setMobileMenuOrigin] = useState<string | null>(null);
  const isMobileMenuOpen = mobileMenuOrigin === pathname;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOrigin(null);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const waUrl = generateWhatsAppInquiryUrl('General Inquiry');

  const toggleMobileMenu = () => {
    setMobileMenuOrigin((current) => (current === pathname ? null : pathname));
  };

  return (
    <header
      className={cn(
        "relative z-40 w-full transition-colors duration-300",
        isScrolled || isMobileMenuOpen ? "bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/5" : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Mobile menu button */}
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden p-2 text-[#faf7f4] hover:text-[#c9a96e] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a96e] rounded-md"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-serif font-bold text-[#faf7f4] tracking-widest absolute left-1/2 -translate-x-1/2 lg:static lg:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a96e] rounded-sm px-1"
        >
          {siteConfig.brand.shortName}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8 absolute left-1/2 -translate-x-1/2">
          {siteConfig.navigation.main.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "font-sans text-sm tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a96e] rounded-sm px-1 py-0.5",
                pathname === item.href ? "text-[#c9a96e]" : "text-[#faf7f4] hover:text-[#c9a96e]"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <Link
            href="/shop"
            className="p-2 text-[#faf7f4] hover:text-[#c9a96e] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a96e] rounded-full"
            aria-label="Browse fragrances"
          >
            <Search size={20} />
          </Link>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-[#faf7f4] hover:text-[#c9a96e] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a96e] rounded-full hidden sm:block"
            aria-label="Contact us on WhatsApp"
          >
            <MessageCircle size={20} />
          </a>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 bg-[#0a0a0a] z-30 lg:hidden transition-all duration-300 ease-in-out overflow-y-auto",
          isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
        )}
        style={{ top: 'var(--noirvale-header-stack-height, 0px)' }}
      >
        <div className="flex flex-col h-full p-6">
          <nav className="flex flex-col space-y-6 flex-grow">
            {siteConfig.navigation.main.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "font-sans text-xl font-medium tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a96e] rounded-sm px-1",
                  pathname === item.href ? "text-[#c9a96e]" : "text-[#faf7f4] active:text-[#c9a96e]"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-8 pt-8 border-t border-white/10">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-6 py-3 rounded-md font-sans font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
            >
              <MessageCircle size={20} />
              <span>Message on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
