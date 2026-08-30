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