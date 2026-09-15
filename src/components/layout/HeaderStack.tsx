'use client';

import { useEffect, useRef } from 'react';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import type { BusinessSettings } from '@/lib/business/types';

export function HeaderStack({ settings }: { settings: BusinessSettings }) {
  const stackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const element = stackRef.current;

    if (!element) return;

    const updateHeight = () => {
      const height = element.getBoundingClientRect().height;
      root.style.setProperty('--noirvale-header-stack-height', `${height}px`);
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(element);

    window.addEventListener('resize', updateHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateHeight);
    };
  }, []);

  return (
    <div ref={stackRef} className="sticky top-0 z-50 w-full">
      <AnnouncementBar settings={settings} />
      <Header />
    </div>
  );
}
