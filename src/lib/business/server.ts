import { unstable_rethrow } from 'next/navigation';
import { getCatalogApiBaseUrl, getCatalogSource } from '@/lib/catalog/config';
import { adaptBusinessSettings } from './adapters';
import { getStaticBusinessSettings } from './static';
import type { BusinessSettings } from './types';

export class BusinessSettingsRequestError extends Error {}

async function getApiBusinessSettings(): Promise<BusinessSettings> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(`${getCatalogApiBaseUrl()}/business-settings/`, { cache: 'no-store', signal: controller.signal });
    if (!response.ok) throw new BusinessSettingsRequestError(`Business settings request failed with HTTP ${response.status}.`);
    return adaptBusinessSettings(await response.json());
  } catch (error) {
    unstable_rethrow(error);
    if (error instanceof BusinessSettingsRequestError) throw error;
    const reason = error instanceof Error ? ` (${error.name}: ${error.message})` : '';
    throw new BusinessSettingsRequestError(`Business settings could not be loaded${reason}.`);
  } finally {
    clearTimeout(timeout);
  }
}

export async function getBusinessSettings(): Promise<BusinessSettings> {
  return getCatalogSource() === 'static' ? getStaticBusinessSettings() : getApiBusinessSettings();
}
