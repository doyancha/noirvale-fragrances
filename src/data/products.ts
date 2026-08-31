// ============================================================================
// NOIRVALE Fragrances — Product Catalogue
// ============================================================================
// To add a new fragrance, add a new Product object to the `products` array.
// Ensure the slug is unique and follows the kebab-case convention.

import type { Product, CollectionInfo } from '@/lib/types';

// ---------------------------------------------------------------------------
// Localized NOIRVALE product imagery
// See IMAGE_SOURCES.md for asset provenance and notes
// ---------------------------------------------------------------------------

export const products: Product[] = [
  {
    id: 'nv-001',
    slug: 'noir-reserve',
    name: 'Noir Reserve',
    tagline: 'The signature of silence.',
    category: "Men's Fragrance",
    collection: 'Signature Collection',
    scentFamily: 'Spicy & Oriental',
    concentration: 'Eau de Parfum',
    currency: 'BDT',
    sizes: [
      { label: '50ml', ml: 50, price: 3490, inStock: true },
      { label: '100ml', ml: 100, price: 4990, inStock: true },
    ],
    images: {
      main: '/noirvale/products/noir-reserve/main.webp',
      gallery: ['/noirvale/products/noir-reserve/main.webp'],
    },
    shortDescription:
      'A dark, controlled composition of black pepper, dry amber, and smoky vetiver.',
    fullDescription:
      'Noir Reserve opens with a sharp crack of black pepper and cardamom, settling into a dry amber heart laced with iris and labdanum. The base is anchored by smoky vetiver and musk, creating a fragrance that commands attention without raising its voice. Built for men who understand that true presence requires restraint.',
    notes: {
      top: ['Black Pepper', 'Cardamom', 'Bergamot'],
      heart: ['Dry Amber', 'Iris', 'Labdanum'],
      base: ['Smoky Vetiver', 'Musk', 'Cedarwood'],
    },
    longevity: 'Long-lasting',
    sillage: 'Moderate',
    season: ['Fall', 'Winter'],
    occasions: ['Evening', 'Date Night', 'Formal'],
    style: ['Refined', 'Mysterious', 'Confident'],
    inStock: true,
    isFeatured: true,
    isBestseller: true,
    isNew: false,
  },
  {
    id: 'nv-002',
    slug: 'imperial-oud',
    name: 'Imperial Oud',
    tagline: 'Evenings that demand presence.',
    category: "Men's Fragrance",
    collection: 'Oud Collection',
    scentFamily: 'Oud & Amber',
    concentration: 'Eau de Parfum',
    currency: 'BDT',
    sizes: [
      { label: '50ml', ml: 50, price: 5490, inStock: true },
      { label: '100ml', ml: 100, price: 7990, inStock: true },
    ],
    images: {
      main: '/noirvale/products/imperial-oud/main.webp',
      gallery: ['/noirvale/products/imperial-oud/main.webp'],
    },
    shortDescription:
      'Smoked woods. Dry amber. A quiet trace of saffron. Built for evenings that call for presence without excess.',
    fullDescription:
      'Imperial Oud is a statement of quiet authority. Rare oud sits at the heart, surrounded by saffron threads and rose absolute. The opening is warm and resinous — frankincense meets a whisper of cinnamon — before settling into a base of sandalwood, amber, and animalic musk. This is not a fragrance you wear casually. It is an occasion in itself.',
    notes: {
      top: ['Saffron', 'Frankincense', 'Cinnamon'],
      heart: ['Oud', 'Rose Absolute', 'Geranium'],
      base: ['Sandalwood', 'Amber', 'Animalic Musk'],
    },
    longevity: 'Beast mode',
    sillage: 'Strong',
    season: ['Fall', 'Winter'],
    occasions: ['Evening', 'Formal', 'Special Occasion'],
    style: ['Bold', 'Opulent', 'Distinguished'],
    inStock: true,
    isFeatured: true,
    isBestseller: true,
    isNew: false,
  },
  {
    id: 'nv-003',
    slug: 'azure-night',
    name: 'Azure Night',
    tagline: 'Where cool air meets warm skin.',
    category: "Men's Fragrance",
    collection: 'Evening Edit',
    scentFamily: 'Fresh & Aquatic',
    concentration: 'Eau de Parfum',
    currency: 'BDT',
    sizes: [
      { label: '50ml', ml: 50, price: 3290, inStock: true },
      { label: '100ml', ml: 100, price: 4690, inStock: true },
    ],
    images: {
      main: '/noirvale/products/azure-night/main.webp',
      gallery: ['/noirvale/products/azure-night/main.webp'],
    },
    shortDescription:
      'A luminous blend of marine notes, blue lavender, and driftwood. Fresh enough for day. Deep enough for night.',
    fullDescription:
      'Azure Night captures the tension between a sunlit coast and an approaching evening. Crisp bergamot and sea salt open into a heart of blue lavender and water lily, while the base grounds everything with driftwood, white musk, and ambergris. Versatile enough for the office, compelling enough for a rooftop dinner.',
    notes: {
      top: ['Bergamot', 'Sea Salt', 'Lemon Zest'],
      heart: ['Blue Lavender', 'Water Lily', 'Geranium'],
      base: ['Driftwood', 'White Musk', 'Ambergris'],
    },
    longevity: 'Moderate',
    sillage: 'Moderate',
    season: ['Spring', 'Summer'],
    occasions: ['Everyday', 'Office', 'Date Night'],
    style: ['Fresh', 'Modern', 'Versatile'],
    inStock: true,
    isFeatured: true,
    isBestseller: true,
    isNew: true,
  },
  {
    id: 'nv-004',
    slug: 'ember-woods',
    name: 'Ember Woods',
    tagline: 'The warmth that stays.',
    category: "Men's Fragrance",
    collection: 'Signature Collection',
    scentFamily: 'Woody & Earthy',
    concentration: 'Eau de Parfum',
    currency: 'BDT',
    sizes: [
      { label: '50ml', ml: 50, price: 3690, inStock: true },
      { label: '100ml', ml: 100, price: 5290, inStock: true },
    ],
    images: {
      main: '/noirvale/products/ember-woods/main.webp',
      gallery: ['/noirvale/products/ember-woods/main.webp'],
    },
    shortDescription:
      'Slow-burning cedar, patchouli, and guaiac wood wrapped in a veil of warm tonka.',
    fullDescription:
      'Ember Woods is a study in warmth. It begins with a brush of pink pepper and nutmeg, then settles into a slow-burning heart of cedar, patchouli, and guaiac wood. The dry-down reveals tonka bean, benzoin, and a thread of leather — like an old fireside chair in a room lined with wood. A fragrance for men who value depth over volume.',
    notes: {
      top: ['Pink Pepper', 'Nutmeg', 'Elemi'],
      heart: ['Cedar', 'Patchouli', 'Guaiac Wood'],
      base: ['Tonka Bean', 'Benzoin', 'Leather'],
    },
    longevity: 'Long-lasting',
    sillage: 'Moderate',
    season: ['Fall', 'Winter'],
    occasions: ['Evening', 'Date Night', 'Weekend'],
    style: ['Warm', 'Grounded', 'Masculine'],
    inStock: true,
    isFeatured: false,
    isBestseller: true,
    isNew: false,
  },
  {
    id: 'nv-005',
    slug: 'atlas-noir',
    name: 'Atlas Noir',
    tagline: 'Carved from stone and spice.',
    category: "Men's Fragrance",
    collection: 'Signature Collection',
    scentFamily: 'Spicy & Oriental',
    concentration: 'Eau de Parfum',
    currency: 'BDT',
    sizes: [
      { label: '50ml', ml: 50, price: 3990, inStock: true },
      { label: '100ml', ml: 100, price: 5690, inStock: true },
    ],
    images: {
      main: '/noirvale/products/atlas-noir/main.webp',
      gallery: ['/noirvale/products/atlas-noir/main.webp'],
    },
    shortDescription:
      'Raw cumin, weathered leather, and sun-dried spice over a mineral base. Adventure, distilled.',
    fullDescription:
      'Atlas Noir draws from the scent of Moroccan markets and mountain trails. Raw cumin and ginger open the fragrance with a jolt, before settling into weathered leather and styrax. The base is mineral and dry — vetiver, patchouli, and a hint of labdanum — like dust settling after a long journey. This is a fragrance for men who move with purpose.',
    notes: {
      top: ['Cumin', 'Ginger', 'Black Pepper'],
      heart: ['Leather', 'Styrax', 'Clary Sage'],
      base: ['Vetiver', 'Patchouli', 'Labdanum'],
    },
    longevity: 'Long-lasting',
    sillage: 'Strong',
    season: ['Fall', 'Winter', 'Spring'],
    occasions: ['Evening', 'Weekend', 'Special Occasion'],
    style: ['Adventurous', 'Raw', 'Earthy'],
    inStock: true,
    isFeatured: false,
    isBestseller: false,
    isNew: false,
  },
  {
    id: 'nv-006',
    slug: 'royal-vetiver',
    name: 'Royal Vetiver',
    tagline: 'Clean authority.',
    category: "Men's Fragrance",
    collection: 'Signature Collection',
    scentFamily: 'Aromatic & Herbal',
    concentration: 'Eau de Parfum',
    currency: 'BDT',
    sizes: [
      { label: '50ml', ml: 50, price: 3290, inStock: true },
      { label: '100ml', ml: 100, price: 4790, inStock: true },
    ],
    images: {
      main: '/noirvale/products/royal-vetiver/main.webp',
      gallery: ['/noirvale/products/royal-vetiver/main.webp'],
    },
    shortDescription:
      'Haitian vetiver. Italian bergamot. Clean lines and quiet confidence.',
    fullDescription:
      'Royal Vetiver is a masterclass in refinement. The opening is bright and clean — Italian bergamot, grapefruit, and a flash of green violet leaf. The heart reveals Haitian vetiver in its purest form, supported by a whisper of iris and nutmeg. The base is dry and transparent: white cedar, musk, and a trace of incense. For the man whose wardrobe is always pressed.',
    notes: {
      top: ['Bergamot', 'Grapefruit', 'Violet Leaf'],
      heart: ['Haitian Vetiver', 'Iris', 'Nutmeg'],
      base: ['White Cedar', 'Musk', 'Incense'],
    },
    longevity: 'Moderate',
    sillage: 'Moderate',
    season: ['Spring', 'Summer', 'Fall'],
    occasions: ['Office', 'Everyday', 'Formal'],
    style: ['Clean', 'Refined', 'Professional'],
    inStock: true,
    isFeatured: false,
    isBestseller: true,
    isNew: false,
  },
  {
    id: 'nv-007',
    slug: 'midnight-saffron',
    name: 'Midnight Saffron',
    tagline: 'Red threads on black velvet.',
    category: "Men's Fragrance",
    collection: 'Oud Collection',
    scentFamily: 'Oud & Amber',
    concentration: 'Extrait de Parfum',
    currency: 'BDT',
    sizes: [
      { label: '30ml', ml: 30, price: 4990, inStock: true },
      { label: '50ml', ml: 50, price: 6990, inStock: true },
    ],
    images: {
      main: '/noirvale/products/midnight-saffron/main.webp',
      gallery: ['/noirvale/products/midnight-saffron/main.webp'],
    },
    shortDescription:
      'Iranian saffron, dark rose, and amber resin. A fragrance woven from warmth and shadow.',
    fullDescription:
      'Midnight Saffron is built on contrast — the warmth of Iranian saffron against the coolness of dark rose, bound together by amber resin and a vein of oud. The opening is rich and textured: saffron, cinnamon bark, and a drop of blood orange. The heart deepens with Turkish rose and cypriol, while the base settles into amber, oud, and animalic civet accord. This is concentrated luxury, designed to linger.',
    notes: {
      top: ['Saffron', 'Cinnamon Bark', 'Blood Orange'],
      heart: ['Turkish Rose', 'Cypriol', 'Oud'],
      base: ['Amber Resin', 'Civet Accord', 'Sandalwood'],
    },
    longevity: 'Beast mode',
    sillage: 'Enormous',
    season: ['Fall', 'Winter'],
    occasions: ['Evening', 'Special Occasion', 'Date Night'],
    style: ['Opulent', 'Intense', 'Exotic'],
    inStock: true,
    isFeatured: true,
    isBestseller: false,
    isNew: true,
  },
  {
    id: 'nv-008',
    slug: 'silver-coast',
    name: 'Silver Coast',
    tagline: 'Salt, sun, and wind.',
    category: "Men's Fragrance",
    collection: 'Aqua Line',
    scentFamily: 'Fresh & Aquatic',
    concentration: 'Eau de Toilette',
    currency: 'BDT',
    sizes: [
      { label: '50ml', ml: 50, price: 2490, inStock: true },
      { label: '100ml', ml: 100, price: 3490, inStock: true },
      { label: '150ml', ml: 150, price: 4290, inStock: true },
    ],
    images: {
      main: '/noirvale/products/silver-coast/main.webp',
      gallery: ['/noirvale/products/silver-coast/main.webp'],
    },
    shortDescription:
      'Coastal air, juniper, and sun-warmed driftwood. An everyday fragrance that feels like a day off.',
    fullDescription:
      'Silver Coast captures a stretch of empty coastline — salt-kissed wind, weathered wood, and the green bite of crushed juniper. Lime and petitgrain open clean and immediate, giving way to a heart of sea breeze accord and rosemary. The base is light but lasting: white driftwood, musk, and a trace of coconut. Simple. Unforced. The kind of scent that makes people ask what you\'re wearing.',
    notes: {
      top: ['Lime', 'Petitgrain', 'Juniper'],
      heart: ['Sea Breeze Accord', 'Rosemary', 'Mint'],
      base: ['White Driftwood', 'Musk', 'Coconut'],
    },
    longevity: 'Moderate',
    sillage: 'Intimate',
    season: ['Spring', 'Summer'],
    occasions: ['Everyday', 'Weekend', 'Office'],
    style: ['Casual', 'Fresh', 'Effortless'],
    inStock: true,
    isFeatured: false,
    isBestseller: true,
    isNew: false,
  },
  {
    id: 'nv-009',
    slug: 'cedar-dominion',
    name: 'Cedar Dominion',
    tagline: 'Rooted strength.',
    category: "Men's Fragrance",
    collection: 'Signature Collection',
    scentFamily: 'Woody & Earthy',
    concentration: 'Eau de Parfum',
    currency: 'BDT',
    sizes: [
      { label: '50ml', ml: 50, price: 3490, inStock: true },
      { label: '100ml', ml: 100, price: 4990, inStock: true },
    ],
    images: {
      main: '/noirvale/products/cedar-dominion/main.webp',
      gallery: ['/noirvale/products/cedar-dominion/main.webp'],
    },
    shortDescription:
      'Atlas cedar, Virginia cedar, and Texas cedar — three expressions of one noble wood.',
    fullDescription:
      'Cedar Dominion is a fragrance about conviction. Three distinct cedarwoods — Atlas, Virginia, and Texas — form the structural core, each contributing a different texture: dry, creamy, and smoky. The opening is clean and decisive: lemon, bergamot, and a crisp green apple note. Midway, the cedarwoods emerge alongside orris root and a touch of suede. The base is quiet and resolved: vetiver, oakmoss, and a fine thread of musk.',
    notes: {
      top: ['Lemon', 'Bergamot', 'Green Apple'],
      heart: ['Atlas Cedar', 'Virginia Cedar', 'Orris Root'],
      base: ['Vetiver', 'Oakmoss', 'Musk'],
    },
    longevity: 'Long-lasting',
    sillage: 'Moderate',
    season: ['All seasons'],
    occasions: ['Office', 'Everyday', 'Formal'],
    style: ['Steady', 'Reliable', 'Masculine'],
    inStock: true,
    isFeatured: false,
    isBestseller: false,
    isNew: false,
  },
  {
    id: 'nv-010',
    slug: 'amber-code',
    name: 'Amber Code',
    tagline: 'The language of warmth.',
    category: "Men's Fragrance",
    collection: 'Evening Edit',
    scentFamily: 'Spicy & Oriental',
    concentration: 'Eau de Parfum',
    currency: 'BDT',
    sizes: [
      { label: '50ml', ml: 50, price: 3790, inStock: true },
      { label: '100ml', ml: 100, price: 5390, inStock: true },
    ],
    images: {
      main: '/noirvale/products/amber-code/main.webp',
      gallery: ['/noirvale/products/amber-code/main.webp'],
    },
    shortDescription:
      'Liquid amber, vanilla absolute, and a twist of dark rum. Sophisticated warmth for winter evenings.',
    fullDescription:
      'Amber Code speaks in a low register. The opening is deceptively bright — mandarin orange and pink pepper — before the fragrance reveals its true nature: a dense, golden amber flanked by vanilla absolute and dark rum accord. Cinnamon and clove add spice without sweetness, while the base of benzoin, musk, and a trace of smoky incense gives it gravity. Wear this when the temperature drops and the evening begins.',
    notes: {
      top: ['Mandarin Orange', 'Pink Pepper', 'Cardamom'],
      heart: ['Amber', 'Vanilla Absolute', 'Dark Rum Accord'],
      base: ['Benzoin', 'Musk', 'Smoky Incense'],
    },
    longevity: 'Long-lasting',
    sillage: 'Strong',
    season: ['Fall', 'Winter'],
    occasions: ['Evening', 'Date Night', 'Gifting'],
    style: ['Warm', 'Sensual', 'Sophisticated'],
    inStock: true,
    isFeatured: true,
    isBestseller: false,
    isNew: false,
  },
  {
    id: 'nv-011',
    slug: 'black-cypress',
    name: 'Black Cypress',
    tagline: 'Green darkness.',
    category: "Men's Fragrance",
    collection: 'Noir Reserve',
    scentFamily: 'Aromatic & Herbal',
    concentration: 'Eau de Parfum',
    currency: 'BDT',
    sizes: [
      { label: '50ml', ml: 50, price: 3390, inStock: true },
      { label: '100ml', ml: 100, price: 4890, inStock: true },
    ],
    images: {
      main: '/noirvale/products/black-cypress/main.webp',
      gallery: ['/noirvale/products/black-cypress/main.webp'],
    },
    shortDescription:
      'Mediterranean cypress, dark fig, and black tea. A green fragrance with unexpected depth.',
    fullDescription:
      'Black Cypress begins where most green fragrances end. Cypress oil and crushed basil create an aromatic opening with real bite, sharpened by a flash of black pepper. The heart introduces dark fig and black tea — rich, slightly tannic, and unexpectedly complex. The base is dry and woody: cedar, vetiver, and a hint of smoke. This fragrance sits at the intersection of freshness and depth, making it a distinctive choice for men who find most green scents too simple.',
    notes: {
      top: ['Cypress', 'Basil', 'Black Pepper'],
      heart: ['Dark Fig', 'Black Tea', 'Clary Sage'],
      base: ['Cedar', 'Vetiver', 'Smoky Birch'],
    },
    longevity: 'Moderate',
    sillage: 'Moderate',
    season: ['Spring', 'Summer', 'Fall'],
    occasions: ['Everyday', 'Office', 'Weekend'],
    style: ['Sharp', 'Green', 'Intellectual'],
    inStock: true,
    isFeatured: false,
    isBestseller: false,
    isNew: true,
  },
  {
    id: 'nv-012',
    slug: 'velvet-smoke',
    name: 'Velvet Smoke',
    tagline: 'Leather, tobacco, and low light.',
    category: "Men's Fragrance",
    collection: 'Evening Edit',
    scentFamily: 'Leather & Tobacco',
    concentration: 'Eau de Parfum',
    currency: 'BDT',
    sizes: [
      { label: '50ml', ml: 50, price: 4290, inStock: true },
      { label: '100ml', ml: 100, price: 6190, inStock: true },
    ],
    images: {
      main: '/noirvale/products/velvet-smoke/main.webp',
      gallery: ['/noirvale/products/velvet-smoke/main.webp'],
    },
    shortDescription:
      'Pipe tobacco, Italian leather, and dark honey over a bed of smoked oud. The last word in evening fragrance.',
    fullDescription:
      'Velvet Smoke occupies the space between a dimly lit bar and a private library. The opening is immediately distinctive: pipe tobacco absolute and Italian leather, softened by a drizzle of dark honey. The heart reveals a smoky oud and bourbon vanilla, adding richness without sweetness. The base lingers with cashmeran, musk, and a dry woody accord that stays close to the skin for hours. This is a fragrance with a narrative — meant for evenings that are meant to be remembered.',
    notes: {
      top: ['Pipe Tobacco', 'Italian Leather', 'Dark Honey'],
      heart: ['Smoky Oud', 'Bourbon Vanilla', 'Cinnamon'],
      base: ['Cashmeran', 'Musk', 'Dry Wood Accord'],
    },
    longevity: 'Beast mode',
    sillage: 'Strong',
    season: ['Fall', 'Winter'],
    occasions: ['Evening', 'Date Night', 'Special Occasion'],
    style: ['Dramatic', 'Sensual', 'Complex'],
    inStock: true,
    isFeatured: true,
    isBestseller: false,
    isNew: false,
  },
];

// ---------------------------------------------------------------------------
// Collections
// ---------------------------------------------------------------------------

export const collections: CollectionInfo[] = [
  {
    slug: 'oud-amber',
    name: 'Oud & Amber',
    description:
      'Rich, resinous, and deeply masculine. The rarest ingredients, the longest-lasting impressions.',
    image: '/noirvale/collections/oud-amber.webp',
    scentFamilies: ['Oud & Amber'],
  },
  {
    slug: 'fresh-aquatic',
    name: 'Fresh & Aquatic',
    description:
      'Coastal air, crisp citrus, and ocean-inspired compositions for effortless everyday wear.',
    image: '/noirvale/collections/fresh-aquatic.webp',
    scentFamilies: ['Fresh & Aquatic', 'Citrus & Aromatic'],
  },
  {
    slug: 'woody-earthy',
    name: 'Woods & Earth',
    description:
      'Cedarwood, vetiver, and patchouli. Grounded compositions for men of substance.',
    image: '/noirvale/collections/woody-earthy.webp',
    scentFamilies: ['Woody & Earthy'],
  },
  {
    slug: 'spicy-oriental',
    name: 'Spice & Oriental',
    description:
      'Warm, spiced, and layered. From saffron to cardamom, built for presence.',
    image: '/noirvale/collections/spicy-oriental.webp',
    scentFamilies: ['Spicy & Oriental'],
  },
  {
    slug: 'evening-intense',
    name: 'Evening Intense',
    description:
      'Concentrated, long-lasting compositions crafted for after-dark occasions.',
    image: '/noirvale/collections/evening-intense.webp',
    scentFamilies: ['Leather & Tobacco', 'Oud & Amber'],
  },
  {
    slug: 'office-everyday',
    name: 'Office & Everyday',
    description:
      'Polished, versatile compositions for the workday, the commute, and the easy transition into evening.',
    image: '/noirvale/products/royal-vetiver/main.webp',
    scentFamilies: ['Fresh & Aquatic', 'Aromatic & Herbal', 'Woody & Earthy'],
  },
];

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCollection(collection: string): Product[] {
  return products.filter((p) => p.collection === collection);
}

export function getProductsByScentFamily(family: string): Product[] {
  return products.filter((p) => p.scentFamily === family);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.isFeatured);
}

export function getBestSellers(): Product[] {
  return products.filter((p) => p.isBestseller);
}

export function getNewArrivals(): Product[] {
  return products.filter((p) => p.isNew);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  // First try same scent family, then same collection, then random
  const sameFamilyProducts = products.filter(
    (p) => p.scentFamily === product.scentFamily && p.id !== product.id
  );
  const sameCollectionProducts = products.filter(
    (p) => p.collection === product.collection && p.id !== product.id
  );

  const related = new Map<string, Product>();

  for (const p of sameFamilyProducts) {
    if (related.size >= limit) break;
    related.set(p.id, p);
  }
  for (const p of sameCollectionProducts) {
    if (related.size >= limit) break;
    related.set(p.id, p);
  }
  // Fill remaining with other products
  for (const p of products) {
    if (related.size >= limit) break;
    if (p.id !== product.id && !related.has(p.id)) {
      related.set(p.id, p);
    }
  }

  return Array.from(related.values());
}

export function getCollectionBySlug(slug: string): CollectionInfo | undefined {
  return collections.find((c) => c.slug === slug);
}

export function getProductsForCollection(collectionSlug: string): Product[] {
  const collection = getCollectionBySlug(collectionSlug);
  if (!collection) return [];
  return products.filter((p) =>
    collection.scentFamilies.includes(p.scentFamily)
  );
}

export function getAllScentFamilies(): string[] {
  const families = new Set(products.map((p) => p.scentFamily));
  return Array.from(families).sort();
}

export function getAllOccasions(): string[] {
  const occasions = new Set(products.flatMap((p) => p.occasions));
  return Array.from(occasions).sort();
}

export function getAllConcentrations(): string[] {
  const concentrations = new Set(products.map((p) => p.concentration));
  return Array.from(concentrations).sort();
}
