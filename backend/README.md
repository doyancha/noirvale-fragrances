# NOIRVALE Django Backend

## Purpose

This is the Django backend and administration foundation for NOIRVALE Fragrances.
The customer-facing storefront remains the existing Next.js application.

## Current phase

Phase 5 — Django REST API.

The locked roadmap is:

- PostgreSQL: Phase 2 (complete)
- Django Admin configuration: Phase 3 (complete)
- Cloudinary media: Phase 4 (current)
- Django REST Framework: Phase 5
- Railway deployment: Phase 10

The catalogue schema, administration interface, media persistence layer, and public
read-only catalogue API are included in the completed phases. Catalogue content and
its existing static images are not migrated until Phase 6.

## Phase 6 catalogue bootstrap

The Phase 6 bootstrap snapshot is stored in
`apps/catalog/import_data/noirvale_catalog.json` and is guarded by the SHA-256 of
`src/data/products.ts`. Run validation without side effects with:

```powershell
python manage.py import_noirvale_catalog --dry-run
```

After configuring the server-side `CLOUDINARY_URL`, run
`python manage.py import_noirvale_catalog` to import the 12 Products, 25 variants,
6 canonical Collections, 18 memberships, 12 deduplicated ProductImages, and 6
CollectionImages. The command uses deterministic bootstrap media identities,
detects conflicts instead of overwriting Django Admin edits, and is safe to rerun
after an interrupted media upload. It is bootstrap tooling, not an ongoing Admin
synchronization engine. Phase 7 frontend integration has not started; the Next.js
storefront remains static.

## Public catalogue API

The API uses Django REST Framework 3.18.1 and exposes these public, read-only routes:

- `GET /api/v1/products/`
- `GET /api/v1/products/<slug>/`
- `GET /api/v1/collections/`
- `GET /api/v1/collections/<slug>/`

Only published products and collections are visible. Only active variants are
returned; active out-of-stock variants remain visible with their stock status. The
normal local database is currently empty until Phase 6, so the list routes return
`[]` until catalogue data is migrated. The Next.js frontend remains static until
Phase 7. CORS is not configured in this phase. Phase 6 migration is next, followed
later by Phase 7 frontend integration.

## Local setup (PowerShell)

From the repository root:

```powershell
py -3.14 -m venv backend/.venv
& backend/.venv/Scripts/Activate.ps1
python -m pip install -r backend/requirements.txt
Set-Location backend
docker compose up -d
```

The local PostgreSQL service uses the official `postgres:18.6-alpine` image and binds
only to `127.0.0.1:5433`. Its credentials are intentionally public, local-only Docker
development defaults and must never be reused in deployed environments.

```powershell
Set-Location backend
python manage.py check
python manage.py migrate
python manage.py test
python manage.py runserver 127.0.0.1:8000
```

## Django Admin

Open http://127.0.0.1:8000/admin/ after creating a local administrator with
`python manage.py createsuperuser`. The current admin manages Products, Variants,
public Collection memberships, publication flags, merchandising flags, ordering,
Product primary/gallery images, and Collection cover images. Media metadata is
provider-owned and read-only.

The public API is Phase 5 and existing catalogue/media import is Phase 6.

If Python 3.11 is unavailable, use another supported existing Python runtime. Do not
install or replace system Python automatically.

## Development URLs

- Backend: http://127.0.0.1:8000
- Health: http://127.0.0.1:8000/health/
- Admin route: http://127.0.0.1:8000/admin/

## PostgreSQL and database workflow

PostgreSQL 18.6 is now required for development and is the active Django database.
SQLite is no longer an active configuration. The named Docker volume is preserved by
the ordinary shutdown command:

```powershell
docker compose down
```

Do not use `docker compose down -v` unless intentionally destroying local database data.

The catalogue tables are schema-only in Phase 2. The 12 products, 25 variants, and six
collections are not migrated until Phase 6.

## Cloudinary Media

Phase 4 uses the official Cloudinary Python SDK for server-side Django Admin media
operations. Configure the `CLOUDINARY_URL` environment variable as a server-side
secret; never commit or print its value. Product media supports one primary image and
ordered gallery images. Collections support one cover image. Admin supports upload,
replacement, removal, safe previews, alt text, and ordering.

The backend can start and run non-media checks without `CLOUDINARY_URL`. Real media
uploads require it and fail cleanly when it is absent. Existing static storefront
images are not uploaded or imported in Phase 4; that is Phase 6. API exposure and
frontend consumption occur in later phases.

## Database environment variables

Development defaults are available for the local Compose service:

- `NOIRVALE_DB_NAME` = `noirvale`
- `NOIRVALE_DB_USER` = `noirvale`
- `NOIRVALE_DB_PASSWORD` = local-only development value
- `NOIRVALE_DB_HOST` = `127.0.0.1`
- `NOIRVALE_DB_PORT` = `5433`

Production must provide all five values explicitly. Production settings reject missing
database configuration and never fall back to SQLite or local defaults.

## Migration workflow

```powershell
python manage.py makemigrations --check --dry-run
python manage.py migrate
python manage.py showmigrations catalog
python manage.py test
```

## Environment variables

Names only; never commit secret values:

- `DJANGO_SECRET_KEY`
- `DJANGO_ALLOWED_HOSTS` (comma-separated in production)
- `DJANGO_SETTINGS_MODULE`

Development defaults to `noirvale_backend.settings.development`. Deployment must
explicitly select `noirvale_backend.settings.production` and provide a real secret and
explicit allowed hosts.
