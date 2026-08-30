'use client';

import { MessageCircle } from 'lucide-react';
import { generateWhatsAppInquiryUrl } from '@/lib/whatsapp';

export function FloatingWhatsApp() {
  return (
    <a
      href={generateWhatsAppInquiryUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-24 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform duration-200 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9a96e] md:bottom-8 md:right-8 md:h-16 md:w-16"
    >
      <MessageCircle className="h-7 w-7 md:h-8 md:w-8" />
    </a>
  );
}