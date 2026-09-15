export interface BusinessSettings {
  contact: { phone: string; email: string; website: string };
  social: { facebook: string; instagram: string; pinterest: string };
  business: { hours: string; closedDay: string; location: string; serviceArea: string; deliveryText: string };
  customerCare: {
    delivery: {
      insideDhaka: { estimate: string; charge: string };
      outsideDhaka: { estimate: string; charge: string };
      timingNote: string;
      cod: string;
      advancePayment: string;
      confirmation: string;
      summary: string;
    };
    returns: { requestWindow: string; eligible: string; notes: string };
    exchanges: { requestWindow: string; eligible: string; notes: string };
    damagedOrWrongProduct: { contactWindow: string; evidence: string; preferredResolution: string; fallback: string };
    fragranceGuidance: { performance: string; storage: string };
    orderConfirmationFields: string[];
  };
}
