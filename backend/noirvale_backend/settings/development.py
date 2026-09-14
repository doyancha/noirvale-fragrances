from .base import *  # noqa: F403


DEBUG = True
SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", "django-insecure-noirvale-local-development-only")

_configured_hosts = os.environ.get("DJANGO_ALLOWED_HOSTS", "")
ALLOWED_HOSTS = [host.strip() for host in _configured_hosts.split(",") if host.strip()]
ALLOWED_HOSTS = sorted(set(ALLOWED_HOSTS + ["localhost", "127.0.0.1"]))

# These are intentionally public, local-only Docker development defaults.
os.environ.setdefault("NOIRVALE_DB_NAME", "noirvale")
os.environ.setdefault("NOIRVALE_DB_USER", "noirvale")
os.environ.setdefault("NOIRVALE_DB_PASSWORD", "noirvale-local-only")
os.environ.setdefault("NOIRVALE_DB_HOST", "127.0.0.1")
os.environ.setdefault("NOIRVALE_DB_PORT", "5433")
