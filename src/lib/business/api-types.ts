export interface BusinessSettingsDto {
  contact: { phone: string; email: string; website: string };
  social: { facebook: string; instagram: string; pinterest: string };
  business: { hours: string; closed_day: string; location: string; service_area: string; delivery_text: string };
  customer_care: {
    delivery: {
      inside_dhaka: { estimate: string; charge: string };
      outside_dhaka: { estimate: string; charge: string };
      timing_note: string;
      cod: string;
      advance_payment: string;
      confirmation: string;
      summary: string;
    };
    returns: { request_window: string; eligible: string; notes: string };
    exchanges: { request_window: string; eligible: string; notes: string };
    damaged_or_wrong_product: { contact_window: string; evidence: string; preferred_resolution: string; fallback: string };
    fragrance_guidance: { performance: string; storage: string };
    order_confirmation_fields: string[];
  };
}
