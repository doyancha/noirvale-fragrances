// ============================================================================
// NOIRVALE Fragrances — FAQ Data
// ============================================================================

import { siteConfig } from '@/lib/config';
import type { FAQItem } from '@/lib/types';

export const faqItems: FAQItem[] = [
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
      `Inside Dhaka, delivery is estimated within ${siteConfig.customerCare.delivery.insideDhaka.estimate.toLowerCase()} with a ${siteConfig.customerCare.delivery.insideDhaka.charge} charge. Outside Dhaka, delivery is estimated within ${siteConfig.customerCare.delivery.outsideDhaka.estimate.toLowerCase()} with a ${siteConfig.customerCare.delivery.outsideDhaka.charge} charge. Delivery may take longer during public holidays, extreme weather, courier disruption, unusually high order volume, or remote-area delivery.`,
  },
  {
    question: 'How do fragrance performance notes work?',
    answer:
      siteConfig.customerCare.fragranceGuidance.performance,
  },
  {
    question: 'Can I return a fragrance?',
    answer:
      `An unopened, unused, and factory-sealed product may be reported for a return request within ${siteConfig.customerCare.returns.requestWindow}. Return acceptance remains subject to order verification and product condition. ${siteConfig.customerCare.returns.notes}`,
  },
  {
    question: 'Can I exchange a fragrance?',
    answer:
      `Exchange requests must be made within ${siteConfig.customerCare.exchanges.requestWindow}. Eligible products should normally be ${siteConfig.customerCare.exchanges.eligible}. ${siteConfig.customerCare.exchanges.notes}`,
  },
  {
    question: 'What if I receive the wrong or a damaged product?',
    answer:
      `Please contact us through WhatsApp within ${siteConfig.customerCare.damagedOrWrongProduct.contactWindow}. Share your order information and clear photos of the product and packaging where practical. ${siteConfig.customerCare.damagedOrWrongProduct.preferredResolution} ${siteConfig.customerCare.damagedOrWrongProduct.fallback}`,
  },
  {
    question: 'How should I store my fragrance?',
    answer: siteConfig.customerCare.fragranceGuidance.storage,
  },
];