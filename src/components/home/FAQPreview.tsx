'use client';

import { useState } from 'react';
import type { FAQItem } from '@/lib/types';

export function FAQPreview({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const previewItems = items.slice(0, 4);

  return (
    <section className="bg-noir-900 py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-5xl text-ivory mb-4">Common Questions</h2>
          <div className="h-px w-24 bg-gold/50 mx-auto" />
        </div>

        <div className="space-y-4">
          {previewItems.map((faq, index) => (
            <div
              key={index}
              className="border border-noir-800 bg-noir-950 overflow-hidden"
            >
              <button
                type="button"
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-gold motion-safe:transition-colors"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                aria-expanded={openIndex === index}
                aria-controls={`faq-preview-${index}`}
              >
                <span className="font-medium text-ivory text-lg">{faq.question}</span>
                <span className="text-gold ml-4 flex-shrink-0">
                  {openIndex === index ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  )}
                </span>
              </button>

              <div
                id={`faq-preview-${index}`}
                className={`motion-safe:transition-[max-height,opacity] duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-6 pt-0 text-ivory/70 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
