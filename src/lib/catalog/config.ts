export type CatalogSource = 'static' | 'api';

export class CatalogConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CatalogConfigurationError';
  }
}

export function getCatalogSource(): CatalogSource {
  const source = process.env.NOIRVALE_CATALOG_SOURCE?.trim().toLowerCase();
  if (!source || source === 'static') return 'static';
  if (source === 'api') return 'api';
  throw new CatalogConfigurationError(
    `Unsupported NOIRVALE_CATALOG_SOURCE "${source}". Use "static" or "api".`
  );
}

export function getCatalogApiBaseUrl(): string {
  if (getCatalogSource() !== 'api') {
    throw new CatalogConfigurationError('The catalogue API URL is only required in API source mode.');
  }

  const rawUrl = process.env.NOIRVALE_CATALOG_API_BASE_URL?.trim();
  if (!rawUrl) {
    throw new CatalogConfigurationError(
      'NOIRVALE_CATALOG_API_BASE_URL is required when NOIRVALE_CATALOG_SOURCE=api.'
    );
  }

  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new CatalogConfigurationError('NOIRVALE_CATALOG_API_BASE_URL must be a valid absolute URL.');
  }

  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new CatalogConfigurationError('NOIRVALE_CATALOG_API_BASE_URL must use HTTP or HTTPS.');
  }

  return url.toString().replace(/\/+$/, '');
}
