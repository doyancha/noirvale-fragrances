// ============================================================================
// NOIRVALE Fragrances — Utility Functions
// ============================================================================

import { siteConfig } from './config';

/**
 * Format price in BDT with the ৳ symbol
 */
export function formatPrice(amount: number): string {
  return `${siteConfig.business.currencySymbol}${amount.toLocaleString('en-IN')}`;
}

/**
 * Generate a price range string from product sizes
 */
export function formatPriceRange(prices: number[]): string {
  if (prices.length === 0) return '';
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  if (min === max) return formatPrice(min);
  return `${formatPrice(min)} – ${formatPrice(max)}`;
}

/**
 * Combine class names, filtering falsy values.
 * Supports strings, false/undefined/null, and Record<string, boolean> objects.
 */
export function cn(
  ...inputs: (string | false | undefined | null | Record<string, boolean | undefined>)[]
): string {
  const classes: string[] = [];

  for (const input of inputs) {
    if (!input) continue;

    if (typeof input === 'string') {
      classes.push(input);
    } else if (typeof input === 'object') {
      for (const [key, value] of Object.entries(input)) {
        if (value) {
          classes.push(key);
        }
      }
    }
  }

  return classes.join(' ');
}

/**
 * Slugify a string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Truncate text to a maximum length
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).replace(/\s+\S*$/, '') + '…';
}