import { siteConfig } from '@/lib/config';
import type { BusinessSettings } from './types';

export function getStaticBusinessSettings(): BusinessSettings {
  const { customerCare } = siteConfig;
  return {
    contact: { phone: siteConfig.contact.phone, email: siteConfig.contact.email, website: siteConfig.contact.website },
    social: { ...siteConfig.social },
    business: {
      hours: siteConfig.business.hours,
      closedDay: siteConfig.business.closedDay,
      location: siteConfig.business.location,
      serviceArea: siteConfig.business.serviceArea,
      deliveryText: siteConfig.business.deliveryText,
    },
    customerCare: {
      delivery: { ...customerCare.delivery, insideDhaka: { ...customerCare.delivery.insideDhaka }, outsideDhaka: { ...customerCare.delivery.outsideDhaka } },
      returns: { ...customerCare.returns },
      exchanges: { ...customerCare.exchanges },
      damagedOrWrongProduct: { ...customerCare.damagedOrWrongProduct },
      fragranceGuidance: { ...customerCare.fragranceGuidance },
      orderConfirmationFields: [...customerCare.orderConfirmationFields],
    },
  };
}
