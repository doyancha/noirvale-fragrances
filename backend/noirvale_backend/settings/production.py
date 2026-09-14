import os

from django.core.exceptions import ImproperlyConfigured

from .base import *  # noqa: F403


DEBUG = False

SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", "").strip()
if not SECRET_KEY or SECRET_KEY == "django-insecure-noirvale-local-development-only":
    raise ImproperlyConfigured("DJANGO_SECRET_KEY must be set to a real production secret.")

_configured_hosts = os.environ.get("DJANGO_ALLOWED_HOSTS", "")
ALLOWED_HOSTS = [host.strip() for host in _configured_hosts.split(",") if host.strip()]
if not ALLOWED_HOSTS or "*" in ALLOWED_HOSTS:
    raise ImproperlyConfigured("DJANGO_ALLOWED_HOSTS must contain explicit production hosts.")

_database_env_names = (
    "NOIRVALE_DB_NAME",
    "NOIRVALE_DB_USER",
    "NOIRVALE_DB_PASSWORD",
    "NOIRVALE_DB_HOST",
    "NOIRVALE_DB_PORT",
)
_missing_database_values = [name for name in _database_env_names if not os.environ.get(name, "").strip()]
if _missing_database_values:
    raise ImproperlyConfigured(
        "Production PostgreSQL configuration is incomplete: "
        + ", ".join(_missing_database_values)
    )

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.environ["NOIRVALE_DB_NAME"],
        "USER": os.environ["NOIRVALE_DB_USER"],
        "PASSWORD": os.environ["NOIRVALE_DB_PASSWORD"],
        "HOST": os.environ["NOIRVALE_DB_HOST"],
        "PORT": os.environ["NOIRVALE_DB_PORT"],
    }
}
