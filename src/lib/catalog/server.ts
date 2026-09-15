import { adaptApiCollection, adaptApiProduct, CatalogDataError } from './adapters';
import { unstable_rethrow } from 'next/navigation';
import type { ApiCollectionDto, ApiProductDto } from './api-types';
import { getCatalogApiBaseUrl, getCatalogSource } from './config';
import { getStaticCollectionDetail, getStaticCollectionBySlug, getStaticCollections, getStaticProductBySlug, getStaticProducts } from './static';
import type { CollectionInfo, Product } from '@/lib/types';

export class CatalogRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CatalogRequestError';
  }
}

async function apiJson<T>(path: string, purpose: string): Promise<T> {
  const endpoint = `${getCatalogApiBaseUrl()}${path}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(endpoint, {
      cache: 'no-store',
      signal: controller.signal,
    });
    if (!response.ok) throw new CatalogRequestError(`Catalogue ${purpose} failed with HTTP ${response.status}.`);
    try { return (await response.json()) as T; } catch { throw new CatalogRequestError(`Catalogue ${purpose} returned invalid JSON.`); }
  } catch (error) {
    unstable_rethrow(error);
    if (error instanceof CatalogRequestError) throw error;
    const reason = error instanceof Error ? ` (${error.name}: ${error.message})` : '';
    throw new CatalogRequestError(`Catalogue ${purpose} could not be reached${reason}.`);
  } finally { clearTimeout(timeout); }
}

function apiList<T>(value: unknown, purpose: string): T[] {
  if (!Array.isArray(value)) throw new CatalogDataError(`Catalogue ${purpose} response must be an array.`);
  return value as T[];
}

export async function getStorefrontProducts(): Promise<Product[]> {
  if (getCatalogSource() === 'static') return getStaticProducts();
  const payload = await apiJson<unknown>('/products/', 'product list request');
  return apiList<ApiProductDto>(payload, 'product list').map(adaptApiProduct);
}

export function getStorefrontProductStaticParams(): { slug: string }[] {
  if (getCatalogSource() === 'api') return [];
  return getStaticProducts().map((product) => ({ slug: product.slug }));
}

export async function getStorefrontProductBySlug(slug: string): Promise<Product | undefined> {
  if (getCatalogSource() === 'static') return getStaticProductBySlug(slug);
  try {
    return adaptApiProduct(await apiJson<ApiProductDto>(`/products/${encodeURIComponent(slug)}/`, `product ${slug} request`));
  } catch (error) {
    if (error instanceof CatalogRequestError && error.message.includes('HTTP 404')) return undefined;
    throw error;
  }
}

export async function getStorefrontCollections(): Promise<CollectionInfo[]> {
  if (getCatalogSource() === 'static') return getStaticCollections();
  const payload = await apiJson<unknown>('/collections/', 'collection list request');
  return apiList<ApiCollectionDto>(payload, 'collection list').map(adaptApiCollection);
}

export function getStorefrontCollectionStaticParams(): { slug: string }[] {
  if (getCatalogSource() === 'api') return [];
  return getStaticCollections().map((collection) => ({ slug: collection.slug }));
}

export async function getStorefrontCollectionBySlug(slug: string): Promise<CollectionInfo | undefined> {
  if (getCatalogSource() === 'static') return getStaticCollectionBySlug(slug);
  const detail = await getStorefrontCollectionDetail(slug);
  return detail?.collection;
}

export async function getStorefrontCollectionDetail(slug: string) {
  if (getCatalogSource() === 'static') return getStaticCollectionDetail(slug);
  try {
    const dto = await apiJson<ApiCollectionDto>(`/collections/${encodeURIComponent(slug)}/`, `collection ${slug} request`);
    if (!Array.isArray(dto.products)) throw new CatalogDataError(`Collection ${slug} products must be an array.`);
    return { collection: adaptApiCollection(dto), products: dto.products.map(adaptApiProduct) };
  } catch (error) {
    if (error instanceof CatalogRequestError && error.message.includes('HTTP 404')) return undefined;
    throw error;
  }
}
