'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionItem {
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
}

export default function Accordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className="border border-[#c9a96e]/20 rounded-lg overflow-hidden bg-white/5"
          >
            <button
              type="button"
              className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a96e] motion-safe:transition-colors"
              onClick={() => toggleItem(index)}
              aria-expanded={isOpen}
              aria-controls={`accordion-item-${index}`}
            >
              <span className="font-medium text-lg pr-4">{item.question}</span>
              <ChevronDown
                className={`w-5 h-5 text-[#c9a96e] transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>

            <div
              id={`accordion-item-${index}`}
              className={`motion-safe:transition-[max-height,opacity] duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
              style={{ overflow: 'hidden' }}
            >
              <div className="px-6 pb-5 text-gray-300">
                {item.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}