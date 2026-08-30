'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { siteConfig } from '@/lib/config';

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-[#c9a96e] text-[#0a0a0a] py-2 px-4 relative z-50 flex items-center justify-center">
      <div className="text-sm font-medium font-sans text-center px-8">
        {siteConfig.business.serviceArea} • Order via WhatsApp • COD available
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-black/10 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
        aria-label="Dismiss announcement"
      >
        <X size={16} />
      </button>
    </div>
  );
}