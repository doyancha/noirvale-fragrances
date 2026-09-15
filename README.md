# NOIRVALE Fragrances

WhatsApp-first premium men's fragrance storefront.

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000` during local development.

## Environment

Configure public values in `.env.local` or via your hosting environment.

Required public variables:

- `NEXT_PUBLIC_WHATSAPP_NUMBER`
- `NEXT_PUBLIC_SITE_URL`

Optional public variables:

- `NEXT_PUBLIC_PUBLIC_PHONE`
- `NEXT_PUBLIC_BUSINESS_EMAIL`
- `NEXT_PUBLIC_FACEBOOK_URL`
- `NEXT_PUBLIC_INSTAGRAM_URL`
- `NEXT_PUBLIC_PINTEREST_URL`
- `NEXT_PUBLIC_BUSINESS_HOURS`
- `NEXT_PUBLIC_CLOSED_DAY`
- `NEXT_PUBLIC_BUSINESS_LOCATION`
- `NEXT_PUBLIC_SERVICE_AREA`
- `NEXT_PUBLIC_DELIVERY_TEXT`

## WhatsApp

WhatsApp numbers must use international format without `+` or punctuation.

## Business Configuration

Centralized business settings live in:

- `src/lib/config.ts`

That file controls brand text, contact details, business hours, service area, delivery copy, and policy text.

## Products

Catalogue data is stored in:

- `src/data/products.ts`

Add or update fragrances there. Each product maps to its own route and WhatsApp order flow.

## Phase 7 catalogue sources

The storefront has an explicit dual-source catalogue boundary under `src/lib/catalog/`:

- `static` is the default and uses the existing `src/data/products.ts` catalogue. It does not require Django.
- `api` fetches the Django REST API from server-side Next.js code and requires both API environment variables below.

For local API integration only, configure:

```text
NOIRVALE_CATALOG_SOURCE=api
NOIRVALE_CATALOG_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

`NOIRVALE_CATALOG_SOURCE` may be `static` or `api`; an omitted value means `static`. The API base URL is server-only and must not use a `NEXT_PUBLIC_` prefix. API mode fails visibly when Django is unavailable or returns invalid data; it does not silently fall back to static data. Django is fetched from Server Components, so browser CORS is not required.

API mode renders the migrated Cloudinary HTTPS delivery URLs. Static mode remains the safety source until the later Phase 15 production cutover. Phase 7 does not configure Railway or Vercel environment variables.

## Phase 8 business settings

Business operations and customer-care copy are managed through the Django singleton
`BusinessSettings` record and Admin. The public read-only endpoint is
`GET /api/v1/business-settings/`. The Next.js server-side business boundary reuses
the Phase 7 source selector and API base URL: `static` reads `siteConfig` without
requiring Django, while `api` reads Django with uncached server requests and fails
visibly if the endpoint is unavailable. Static remains the default safety source.

The WhatsApp destination, brand identity, navigation, and SEO configuration remain
static by design; WhatsApp management is reserved for Phase 9. No browser CORS,
Railway deployment, Vercel environment integration, or production cutover is part
of this phase. Phase 15 remains the final source-of-truth cutover gate.

## Images

Local product imagery lives in:

- `public/noirvale/products`

Local collection imagery lives in:

- `public/noirvale/collections`

Image provenance is recorded in:

- `IMAGE_SOURCES.md`

## Deployment

The app currently uses the local development URL as the default canonical fallback.
When a real production URL exists, set `NEXT_PUBLIC_SITE_URL` in your deployment environment.

Validation:

```bash
npm run lint
npm run build
```
