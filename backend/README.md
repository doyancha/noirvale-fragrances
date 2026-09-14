# NOIRVALE Django Backend

## Purpose

This is the Django backend and administration foundation for NOIRVALE Fragrances.
The customer-facing storefront remains the existing Next.js application.

## Current phase

Phase 3 — Django Admin Configuration.

The locked roadmap is:

- PostgreSQL: Phase 2 (complete)
- Django Admin configuration: Phase 3 (current)
- Cloudinary media: Phase 4
- Django REST Framework: Phase 5
- Railway deployment: Phase 10

The catalogue schema and administration interface are included in this phase, but
catalogue content is not migrated until Phase 6. There are no API resources or
Cloudinary integration.

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
public Collection memberships, publication flags, merchandising flags, and ordering.

Media upload arrives in Phase 4, the public API in Phase 5, and existing catalogue
import in Phase 6.

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
