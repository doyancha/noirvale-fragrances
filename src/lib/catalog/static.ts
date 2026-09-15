import {
  collections,
  getCollectionBySlug,
  getProductBySlug,
  getProductsForCollection,
  products,
} from '@/data/products';
import type { CollectionInfo, Product } from '@/lib/types';

export function getStaticProducts(): Product[] {
  return products;
}

export function getStaticProductBySlug(slug: string): Product | undefined {
  return getProductBySlug(slug);
}

export function getStaticCollections(): CollectionInfo[] {
  return collections;
}

export function getStaticCollectionBySlug(slug: string): CollectionInfo | undefined {
  return getCollectionBySlug(slug);
}

export function getStaticCollectionDetail(slug: string) {
  const collection = getStaticCollectionBySlug(slug);
  if (!collection) return undefined;
  return { collection, products: getProductsForCollection(slug) };
}

export function getFeaturedProducts(productsToUse: Product[]): Product[] {
  return productsToUse.filter((product) => product.isFeatured);
}

export function getBestSellers(productsToUse: Product[]): Product[] {
  return productsToUse.filter((product) => product.isBestseller);
}

export function getNewArrivals(productsToUse: Product[]): Product[] {
  return productsToUse.filter((product) => product.isNew);
}

export function getRelatedProducts(product: Product, productsToUse: Product[], limit = 4): Product[] {
  const related = new Map<string, Product>();
  const add = (candidate: Product) => {
    if (related.size < limit && candidate.id !== product.id) related.set(candidate.id, candidate);
  };

  productsToUse.filter((candidate) => candidate.scentFamily === product.scentFamily).forEach(add);
  productsToUse.filter((candidate) => candidate.collection === product.collection).forEach(add);
  productsToUse.forEach(add);
  return Array.from(related.values());
}

export function getAllScentFamilies(productsToUse: Product[]): string[] {
  return Array.from(new Set(productsToUse.map((product) => product.scentFamily))).sort();
}

export function getAllOccasions(productsToUse: Product[]): string[] {
  return Array.from(new Set(productsToUse.flatMap((product) => product.occasions))).sort();
}

export function getAllConcentrations(productsToUse: Product[]): string[] {
  return Array.from(new Set(productsToUse.map((product) => product.concentration))).sort();
}
