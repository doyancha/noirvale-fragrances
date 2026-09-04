// ============================================================================
// NOIRVALE Fragrances — Business Configuration
// ============================================================================
// Update this file to change business information across the entire site.

const optionalEnv = (value: string | undefined) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

const defaultSiteUrl =
  optionalEnv(process.env.NEXT_PUBLIC_SITE_URL) ??
  'https://noirvale-fragrances-store.vercel.app';
const defaultWhatsAppNumber =
  optionalEnv(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER) ?? '8801XXXXXXXXX';
const defaultPhone = optionalEnv(process.env.NEXT_PUBLIC_PUBLIC_PHONE) ?? defaultWhatsAppNumber;
const defaultEmail = optionalEnv(process.env.NEXT_PUBLIC_BUSINESS_EMAIL) ?? 'contact@yourdomain.com';
const defaultFacebookUrl =
  optionalEnv(process.env.NEXT_PUBLIC_FACEBOOK_URL) ?? 'https://www.facebook.com/login/';
const defaultInstagramUrl =
  optionalEnv(process.env.NEXT_PUBLIC_INSTAGRAM_URL) ?? 'https://www.instagram.com/accounts/login/';
const defaultPinterestUrl =
  optionalEnv(process.env.NEXT_PUBLIC_PINTEREST_URL) ?? 'https://www.pinterest.com/login/';
const defaultHours =
  optionalEnv(process.env.NEXT_PUBLIC_BUSINESS_HOURS) ?? 'Saturday–Thursday, 10:00 AM–8:00 PM';
const defaultServiceArea =
  optionalEnv(process.env.NEXT_PUBLIC_SERVICE_AREA) ?? 'Nationwide Bangladesh';
const defaultLocation =
  optionalEnv(process.env.NEXT_PUBLIC_BUSINESS_LOCATION) ?? 'Dhaka, Bangladesh';
const defaultDeliveryText =
  optionalEnv(process.env.NEXT_PUBLIC_DELIVERY_TEXT) ??
  'Inside Dhaka: estimated delivery within 2 days after order confirmation (৳70). Outside Dhaka: estimated delivery within 4 days after order confirmation (৳120). Delivery may take longer during public holidays, extreme weather, courier disruption, unusually high order volume, or remote-area delivery.';

export const siteConfig = {
  brand: {
    name: 'NOIRVALE',
    displayName: 'NOIRVALE Fragrances',
    shortName: 'NOIRVALE',
    tagline: 'Presence, Bottled.',
    description:
      'A refined men\'s fragrance destination offering sophisticated perfumes for everyday confidence, evenings, formal occasions, gifting, and signature-scent discovery.',
  },

  contact: {
    whatsapp: defaultWhatsAppNumber,
    phone: defaultPhone,
    email: defaultEmail,
    website: defaultSiteUrl,
  },

  social: {
    facebook: defaultFacebookUrl,
    instagram: defaultInstagramUrl,
    pinterest: defaultPinterestUrl,
  },

  business: {
    hours: defaultHours,
    closedDay: optionalEnv(process.env.NEXT_PUBLIC_CLOSED_DAY) ?? 'Friday',
    location: defaultLocation,
    deliveryText: defaultDeliveryText,
    serviceArea: defaultServiceArea,
    currency: 'BDT',
    currencySymbol: '৳',
    locale: 'en-BD',
  },

  seo: {
    siteUrl: defaultSiteUrl,
    defaultTitle: 'NOIRVALE Fragrances — Presence, Bottled.',
    defaultDescription:
      'Discover sophisticated men\'s fragrances at NOIRVALE. Curated masculine scent profiles — from bold ouds to fresh aquatics. Order via WhatsApp.',
    ogImage: '/noirvale/products/imperial-oud/main.webp',
  },

  customerCare: {
    delivery: {
      insideDhaka: {
        estimate: '2 days after order confirmation',
        charge: '৳70',
      },
      outsideDhaka: {
        estimate: '4 days after order confirmation',
        charge: '৳120',
      },
      timingNote:
        'Delivery may take longer during public holidays, extreme weather, courier disruption, unusually high order volume, or remote-area delivery.',
      cod: 'Available',
      advancePayment: 'Advance payment may be required for selected orders.',
      confirmation: 'Final confirmation takes place through WhatsApp.',
      summary:
        'Inside Dhaka: within 2 days after order confirmation (৳70). Outside Dhaka: within 4 days after order confirmation (৳120). Cash on Delivery is available.',
    },
    returns: {
      requestWindow: '3 days of delivery',
      eligible:
        'unopened, unused, factory-sealed product returned with original packaging in resalable condition',
      notes:
        'Change of fragrance preference after opening is not normally eligible for return.',
    },
    exchanges: {
      requestWindow: '3 days of delivery',
      eligible:
        'unused, unopened, factory-sealed products returned with original packaging in resalable condition',
      notes:
        'Exchange requests may be declined for customer-caused damage or opened fragrance unless the issue is a verified defect or incorrect product.',
    },
    damagedOrWrongProduct: {
      contactWindow: '24 hours of receiving the parcel',
      evidence:
        'Share order information and clear photographs; a photo of the shipping packaging and an unboxing video help when available, but a video is not the only proof we consider.',
      preferredResolution:
        'Replacement without another delivery fee where the incorrect or damaged item is verified.',
      fallback:
        'If replacement is unavailable, we will offer an appropriate refund or a mutually agreed alternative.',
    },
    fragranceGuidance: {
      performance:
        'Longevity, projection, and intensity can vary with skin chemistry, temperature, humidity, application amount, application location, storage, and surrounding conditions. Descriptions are guidance, not guarantees.',
      storage:
        'Store fragrance away from direct sunlight and excessive heat in a cool, dry place with the cap closed.',
    },
    orderConfirmationFields: [
      'fragrance',
      'bottle size',
      'price',
      'delivery charge',
      'delivery location',
      'customer contact details',
      'payment / COD arrangement',
    ],
  },

  navigation: {
    main: [
      { label: 'Home', href: '/' },
      { label: 'Shop', href: '/shop' },
      { label: 'Collections', href: '/collections/all' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    footer: {
      shop: [
        { label: 'All Fragrances', href: '/shop' },
        { label: 'Best Sellers', href: '/shop?filter=bestseller' },
        { label: 'New Arrivals', href: '/shop?filter=new' },
        { label: 'Oud Collection', href: '/collections/oud-amber' },
        { label: 'Fresh & Aquatic', href: '/collections/fresh-aquatic' },
      ],
      company: [
        { label: 'About NOIRVALE', href: '/about' },
        { label: 'Contact Us', href: '/contact' },
        { label: 'FAQ', href: '/faq' },
        { label: 'Delivery Information', href: '/delivery' },
      ],
      legal: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms & Conditions', href: '/terms' },
      ],
    },
  },
} as const;

export type SiteConfig = typeof siteConfig;
