// ============================================================================
// NOIRVALE Fragrances — WhatsApp Commerce Utility
// ============================================================================

import { siteConfig } from './config';

interface WhatsAppOrderParams {
  productName: string;
  size?: string;
  price?: string;
  productUrl?: string;
}

/**
 * Generate a WhatsApp order URL with a pre-filled message
 */
export function generateWhatsAppOrderUrl({
  productName,
  size,
  price,
  productUrl,
}: WhatsAppOrderParams): string {
  const number = siteConfig.contact.whatsapp;
  if (!number) return '';

  const lines = [
    `Hello NOIRVALE,`,
    ``,
    `I would like to order:`,
    ``,
    `Product: ${productName}`,
  ];

  if (size) lines.push(`Size: ${size}`);
  if (price) lines.push(`Price: ${price}`);
  if (productUrl) lines.push(`Product page: ${productUrl}`);

  lines.push(``);
  lines.push(`Please confirm availability and delivery details.`);
  lines.push(``);
  lines.push(`Thank you.`);

  const message = encodeURIComponent(lines.join('\n'));
  return `https://wa.me/${number}?text=${message}`;
}

/**
 * Generate a general WhatsApp inquiry URL
 */
export function generateWhatsAppInquiryUrl(message?: string): string {
  const number = siteConfig.contact.whatsapp;
  if (!number) return '';
  const defaultMessage = `Hello NOIRVALE,\n\nI have a question about your fragrances.\n\nThank you.`;
  const text = encodeURIComponent(message || defaultMessage);
  return `https://wa.me/${number}?text=${text}`;
}

/**
 * Backwards-compatible alias for existing call sites.
 */
export function generateWhatsAppLink(message?: string): string {
  return generateWhatsAppInquiryUrl(message);
}

/**
 * Generate a WhatsApp URL for contacting the business
 */
export function getWhatsAppUrl(): string {
  if (!siteConfig.contact.whatsapp) return '';
  return `https://wa.me/${siteConfig.contact.whatsapp}`;
}