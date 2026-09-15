import type { CollectionInfo, Product, ProductSize } from '@/lib/types';
import type { ApiCollectionDto, ApiProductDto, ApiProductImageDto, ApiVariantDto } from './api-types';
import { getStaticCollectionBySlug, getStaticProductBySlug } from './static';

export class CatalogDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CatalogDataError';
  }
}

function requiredString(value: unknown, field: string): string {
  if (typeof value !== 'string' || !value.trim()) throw new CatalogDataError(`Catalogue field ${field} must be a non-empty string.`);
  return value;
}

function stringArray(value: unknown, field: string): string[] {
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string')) {
    throw new CatalogDataError(`Catalogue field ${field} must be an array of strings.`);
  }
  return value;
}

function booleanField(value: unknown, field: string): boolean {
  if (typeof value !== 'boolean') throw new CatalogDataError(`Catalogue field ${field} must be boolean.`);
  return value;
}

function imageUrl(value: unknown, field: string): string {
  const url = requiredString(value, field);
  let parsed: URL;
  try { parsed = new URL(url); } catch { throw new CatalogDataError(`Catalogue field ${field} must be a valid URL.`); }
  if (parsed.protocol !== 'https:') throw new CatalogDataError(`Catalogue field ${field} must use HTTPS.`);
  return url;
}

function price(value: unknown, field: string): number {
  if (typeof value !== 'string' || !/^\d+(\.\d{1,2})?$/.test(value)) throw new CatalogDataError(`Catalogue field ${field} must be a decimal string.`);
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) throw new CatalogDataError(`Catalogue field ${field} must be a finite nonnegative number.`);
  return parsed;
}

function adaptVariant(dto: ApiVariantDto, index: number): ProductSize {
  requiredString(dto.label, `variants[${index}].label`);
  if (!Number.isInteger(dto.ml) || dto.ml <= 0) throw new CatalogDataError(`Catalogue variant ${dto.label} has invalid ml.`);
  return {
    label: dto.label,
    ml: dto.ml,
    price: price(dto.price, `variants[${index}].price`),
    ...(dto.compare_at_price === null ? {} : { compareAtPrice: price(dto.compare_at_price, `variants[${index}].compare_at_price`) }),
    inStock: booleanField(dto.in_stock, `variants[${index}].in_stock`),
  };
}

function adaptImage(dto: ApiProductImageDto, field: string) {
  return {
    role: requiredString(dto.role, `${field}.role`),
    secureUrl: imageUrl(dto.secure_url, `${field}.secure_url`),
    altText: requiredString(dto.alt_text, `${field}.alt_text`),
    sortOrder: dto.sort_order,
  };
}

export function adaptApiProduct(dto: ApiProductDto): Product {
  const slug = requiredString(dto.slug, 'slug');
  const compatibility = getStaticProductBySlug(slug);
  const variants = Array.isArray(dto.variants) ? dto.variants.map(adaptVariant) : (() => { throw new CatalogDataError(`Product ${slug} variants must be an array.`); })();
  const primary = dto.primary_image ? adaptImage(dto.primary_image, 'primary_image') : undefined;
  const detailImages = Array.isArray(dto.images) ? dto.images.map((image, index) => adaptImage(image, `images[${index}]`)).sort((a, b) => a.sortOrder - b.sortOrder) : [];
  const imageUrls = Array.from(new Set([primary?.secureUrl, ...detailImages.map((image) => image.secureUrl)].filter((url): url is string => Boolean(url))));
  const canonicalCollections = Array.isArray(dto.collections) ? dto.collections : [];
  const collection = compatibility?.collection ?? canonicalCollections[0]?.name ?? dto.scent_family;

  return {
    id: compatibility?.id ?? slug,
    slug,
    name: requiredString(dto.name, `${slug}.name`),
    tagline: requiredString(dto.tagline, `${slug}.tagline`),
    category: requiredString(dto.category, `${slug}.category`),
    collection: collection as Product['collection'],
    scentFamily: requiredString(dto.scent_family, `${slug}.scent_family`) as Product['scentFamily'],
    concentration: requiredString(dto.concentration, `${slug}.concentration`) as Product['concentration'],
    currency: requiredString(dto.currency, `${slug}.currency`),
    sizes: variants,
    images: { main: primary?.secureUrl ?? '', gallery: imageUrls },
    shortDescription: requiredString(dto.short_description, `${slug}.short_description`),
    fullDescription: requiredString(dto.full_description ?? dto.short_description, `${slug}.full_description`),
    notes: {
      top: stringArray(dto.top_notes ?? [], `${slug}.top_notes`),
      heart: stringArray(dto.heart_notes ?? [], `${slug}.heart_notes`),
      base: stringArray(dto.base_notes ?? [], `${slug}.base_notes`),
    },
    longevity: requiredString(dto.longevity, `${slug}.longevity`) as Product['longevity'],
    sillage: requiredString(dto.sillage, `${slug}.sillage`) as Product['sillage'],
    season: stringArray(dto.seasons, `${slug}.seasons`) as Product['season'],
    occasions: stringArray(dto.occasions, `${slug}.occasions`) as Product['occasions'],
    style: stringArray(dto.style_tags, `${slug}.style_tags`),
    inStock: booleanField(dto.in_stock, `${slug}.in_stock`),
    isFeatured: booleanField(dto.is_featured, `${slug}.is_featured`),
    isBestseller: booleanField(dto.is_bestseller, `${slug}.is_bestseller`),
    isNew: booleanField(dto.is_new, `${slug}.is_new`),
  };
}

export function adaptApiCollection(dto: ApiCollectionDto): CollectionInfo {
  const slug = requiredString(dto.slug, 'collection.slug');
  const compatibility = getStaticCollectionBySlug(slug);
  return {
    slug,
    name: requiredString(dto.name, `${slug}.name`),
    description: requiredString(dto.description, `${slug}.description`),
    image: dto.image ? imageUrl(dto.image.secure_url, `${slug}.image.secure_url`) : '',
    scentFamilies: compatibility?.scentFamilies ?? [],
  };
}
