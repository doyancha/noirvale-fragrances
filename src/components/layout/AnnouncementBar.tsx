'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { siteConfig } from '@/lib/config';

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative z-50 flex items-center justify-center bg-[#c9a96e] px-4 py-2 text-[#0a0a0a]">
      <div className="px-10 text-center font-sans text-xs font-medium leading-tight sm:px-8 sm:text-sm">
        {siteConfig.business.serviceArea} • Order via WhatsApp • COD available
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 transition-colors hover:bg-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
        aria-label="Dismiss announcement"
      >
        <X size={16} />
      </button>
    </div>
  );
}
