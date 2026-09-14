# NOIRVALE Django Backend

## Purpose

This is the Django backend and administration foundation for NOIRVALE Fragrances.
The customer-facing storefront remains the existing Next.js application.

## Current phase

Phase 1 — Django Backend Foundation.

The locked roadmap is:

- PostgreSQL: Phase 2
- Django Admin configuration: Phase 3
- Cloudinary media: Phase 4
- Django REST Framework: Phase 5
- Railway deployment: Phase 10

No catalogue models, API resources, Cloudinary integration, or deployment configuration
are included in this phase.

## Local setup (PowerShell)

From the repository root:

```powershell
py -3.11 -m venv backend/.venv
& backend/.venv/Scripts/Activate.ps1
python -m pip install -r backend/requirements.txt
Set-Location backend
python manage.py check
python manage.py migrate
python manage.py test
python manage.py runserver 127.0.0.1:8000
```

If Python 3.11 is unavailable, use another supported existing Python runtime. Do not
install or replace system Python automatically.

## Development URLs

- Backend: http://127.0.0.1:8000
- Health: http://127.0.0.1:8000/health/
- Admin route: http://127.0.0.1:8000/admin/

## Temporary database warning

SQLite is temporary Phase-1-only local verification storage. PostgreSQL replaces the
temporary local SQLite configuration in Phase 2. `backend/db.sqlite3` must never be
committed.

## Environment variables

Names only; never commit secret values:

- `DJANGO_SECRET_KEY`
- `DJANGO_ALLOWED_HOSTS` (comma-separated in production)
- `DJANGO_SETTINGS_MODULE`

Development defaults to `noirvale_backend.settings.development`. Deployment must
explicitly select `noirvale_backend.settings.production` and provide a real secret and
explicit allowed hosts.
