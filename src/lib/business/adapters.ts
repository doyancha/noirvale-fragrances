import type { BusinessSettings } from './types';

function object(value: unknown, path: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`Business settings ${path} must be an object.`);
  return value as Record<string, unknown>;
}
function text(value: unknown, path: string): string {
  if (typeof value !== 'string') throw new Error(`Business settings ${path} must be a string.`);
  return value;
}
function list(value: unknown, path: string): string[] {
  if (!Array.isArray(value) || !value.every((item) => typeof item === 'string')) throw new Error(`Business settings ${path} must be a string list.`);
  return [...value];
}

export function adaptBusinessSettings(value: unknown): BusinessSettings {
  const root = object(value, 'response');
  const contact = object(root.contact, 'contact');
  const social = object(root.social, 'social');
  const business = object(root.business, 'business');
  const care = object(root.customer_care, 'customer_care');
  const delivery = object(care.delivery, 'customer_care.delivery');
  const inside = object(delivery.inside_dhaka, 'customer_care.delivery.inside_dhaka');
  const outside = object(delivery.outside_dhaka, 'customer_care.delivery.outside_dhaka');
  const returns = object(care.returns, 'customer_care.returns');
  const exchanges = object(care.exchanges, 'customer_care.exchanges');
  const damaged = object(care.damaged_or_wrong_product, 'customer_care.damaged_or_wrong_product');
  const guidance = object(care.fragrance_guidance, 'customer_care.fragrance_guidance');
  return {
    contact: { phone: text(contact.phone, 'contact.phone'), email: text(contact.email, 'contact.email'), website: text(contact.website, 'contact.website') },
    social: { facebook: text(social.facebook, 'social.facebook'), instagram: text(social.instagram, 'social.instagram'), pinterest: text(social.pinterest, 'social.pinterest') },
    business: { hours: text(business.hours, 'business.hours'), closedDay: text(business.closed_day, 'business.closed_day'), location: text(business.location, 'business.location'), serviceArea: text(business.service_area, 'business.service_area'), deliveryText: text(business.delivery_text, 'business.delivery_text') },
    customerCare: {
      delivery: { insideDhaka: { estimate: text(inside.estimate, 'inside_dhaka.estimate'), charge: text(inside.charge, 'inside_dhaka.charge') }, outsideDhaka: { estimate: text(outside.estimate, 'outside_dhaka.estimate'), charge: text(outside.charge, 'outside_dhaka.charge') }, timingNote: text(delivery.timing_note, 'timing_note'), cod: text(delivery.cod, 'cod'), advancePayment: text(delivery.advance_payment, 'advance_payment'), confirmation: text(delivery.confirmation, 'confirmation'), summary: text(delivery.summary, 'summary') },
      returns: { requestWindow: text(returns.request_window, 'returns.request_window'), eligible: text(returns.eligible, 'returns.eligible'), notes: text(returns.notes, 'returns.notes') },
      exchanges: { requestWindow: text(exchanges.request_window, 'exchanges.request_window'), eligible: text(exchanges.eligible, 'exchanges.eligible'), notes: text(exchanges.notes, 'exchanges.notes') },
      damagedOrWrongProduct: { contactWindow: text(damaged.contact_window, 'damaged.contact_window'), evidence: text(damaged.evidence, 'damaged.evidence'), preferredResolution: text(damaged.preferred_resolution, 'damaged.preferred_resolution'), fallback: text(damaged.fallback, 'damaged.fallback') },
      fragranceGuidance: { performance: text(guidance.performance, 'fragrance_guidance.performance'), storage: text(guidance.storage, 'fragrance_guidance.storage') },
      orderConfirmationFields: list(care.order_confirmation_fields, 'order_confirmation_fields'),
    },
  };
}
