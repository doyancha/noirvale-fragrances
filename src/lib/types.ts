// ============================================================================
// NOIRVALE Fragrances — Type Definitions
// ============================================================================

/** Product size variant with individual pricing */
export interface ProductSize {
  label: string;
  ml: number;
  price: number;
  compareAtPrice?: number;
  inStock: boolean;
}

/** Fragrance note pyramid */
export interface FragranceNotes {
  top: string[];
  heart: string[];
  base: string[];
}

/** Sillage/projection level */
export type Sillage = 'Intimate' | 'Moderate' | 'Strong' | 'Enormous';

/** Longevity descriptor */
export type Longevity = 'Light' | 'Moderate' | 'Long-lasting' | 'Beast mode';

/** Season suitability */
export type Season = 'Spring' | 'Summer' | 'Fall' | 'Winter' | 'All seasons';

/** Concentration type */
export type Concentration =
  | 'Eau de Cologne'
  | 'Eau de Toilette'
  | 'Eau de Parfum'
  | 'Parfum'
  | 'Extrait de Parfum';

/** Scent family classification */
export type ScentFamily =
  | 'Oud & Amber'
  | 'Woody & Earthy'
  | 'Fresh & Aquatic'
  | 'Spicy & Oriental'
  | 'Aromatic & Herbal'
  | 'Leather & Tobacco'
  | 'Citrus & Aromatic';

/** Product collection */
export type Collection =
  | 'Signature Collection'
  | 'Noir Reserve'
  | 'Aqua Line'
  | 'Oud Collection'
  | 'Evening Edit';

/** Product occasion tags */
export type Occasion =
  | 'Everyday'
  | 'Office'
  | 'Evening'
  | 'Date Night'
  | 'Formal'
  | 'Gifting'
  | 'Weekend'
  | 'Special Occasion';

/** Complete product definition */
export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  category: string;
  collection: Collection;
  scentFamily: ScentFamily;
  concentration: Concentration;
  currency: string;
  sizes: ProductSize[];
  images: {
    main: string;
    gallery: string[];
  };
  shortDescription: string;
  fullDescription: string;
  notes: FragranceNotes;
  longevity: Longevity;
  sillage: Sillage;
  season: Season[];
  occasions: Occasion[];
  style: string[];
  inStock: boolean;
  isFeatured: boolean;
  isBestseller: boolean;
  isNew: boolean;
}

/** Collection definition for browsing */
export interface CollectionInfo {
  slug: string;
  name: string;
  description: string;
  image: string;
  scentFamilies: ScentFamily[];
}

/** Navigation link */
export interface NavLink {
  label: string;
  href: string;
}

/** Social link */
export interface SocialLink {
  platform: string;
  url: string;
  label: string;
}

/** FAQ item */
export interface FAQItem {
  question: string;
  answer: string;
}