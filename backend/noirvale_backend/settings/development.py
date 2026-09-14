from .base import *  # noqa: F403


DEBUG = True
SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", "django-insecure-noirvale-local-development-only")

_configured_hosts = os.environ.get("DJANGO_ALLOWED_HOSTS", "")
ALLOWED_HOSTS = [host.strip() for host in _configured_hosts.split(",") if host.strip()]
ALLOWED_HOSTS = sorted(set(ALLOWED_HOSTS + ["localhost", "127.0.0.1"]))
