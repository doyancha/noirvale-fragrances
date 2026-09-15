// ============================================================================
// NOIRVALE Fragrances — FAQ Data
// ============================================================================

import { getStaticBusinessSettings } from '@/lib/business/static';
import type { BusinessSettings } from '@/lib/business/types';
import type { FAQItem } from '@/lib/types';

export function buildFaqItems(settings: BusinessSettings): FAQItem[] {
  const { customerCare } = settings;
  return [
  {
    question: 'How do I place an order?',
    answer:
      'Browse the collection, open a fragrance page, choose your preferred size, and tap Order on WhatsApp. Your message opens with the fragrance, size, and price already prepared so we can confirm the order directly.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'Cash on Delivery is available. For selected orders, especially higher-value or specially requested items, advance payment may be required. Final payment details are confirmed through WhatsApp.',
  },
  {
    question: 'How long does delivery take?',
    answer:
      `Inside Dhaka, delivery is estimated within ${customerCare.delivery.insideDhaka.estimate.toLowerCase()} with a ${customerCare.delivery.insideDhaka.charge} charge. Outside Dhaka, delivery is estimated within ${customerCare.delivery.outsideDhaka.estimate.toLowerCase()} with a ${customerCare.delivery.outsideDhaka.charge} charge. ${customerCare.delivery.timingNote}`,
  },
  {
    question: 'How do fragrance performance notes work?',
    answer:
      customerCare.fragranceGuidance.performance,
  },
  {
    question: 'Can I return a fragrance?',
    answer:
      `An unopened, unused, and factory-sealed product may be reported for a return request within ${customerCare.returns.requestWindow}. Return acceptance remains subject to order verification and product condition. ${customerCare.returns.notes}`,
  },
  {
    question: 'Can I exchange a fragrance?',
    answer:
      `Exchange requests must be made within ${customerCare.exchanges.requestWindow}. Eligible products should normally be ${customerCare.exchanges.eligible}. ${customerCare.exchanges.notes}`,
  },
  {
    question: 'What if I receive the wrong or a damaged product?',
    answer:
      `Please contact us through WhatsApp within ${customerCare.damagedOrWrongProduct.contactWindow}. Share your order information and clear photos of the product and packaging where practical. ${customerCare.damagedOrWrongProduct.preferredResolution} ${customerCare.damagedOrWrongProduct.fallback}`,
  },
  {
    question: 'How should I store my fragrance?',
    answer: customerCare.fragranceGuidance.storage,
  },
  ];
}

export const faqItems: FAQItem[] = buildFaqItems(getStaticBusinessSettings());
