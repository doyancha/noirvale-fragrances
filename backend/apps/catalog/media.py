"""Server-side Cloudinary integration for catalogue media."""

import logging
import os
from pathlib import Path

import cloudinary
from cloudinary import uploader


logger = logging.getLogger(__name__)

MAX_IMAGE_SIZE = 10 * 1024 * 1024
ALLOWED_EXTENSIONS = {".avif", ".jpeg", ".jpg", ".png", ".webp"}
ALLOWED_CONTENT_TYPES = {"image/avif", "image/jpeg", "image/png", "image/webp"}


class MediaProviderError(Exception):
    """Controlled error raised when Cloudinary cannot complete an operation."""


def _configure_cloudinary():
    cloudinary_url = os.environ.get("CLOUDINARY_URL", "").strip()
    if not cloudinary_url:
        raise MediaProviderError("Cloudinary media storage is not configured.")
    cloudinary.config(cloudinary_url=cloudinary_url, secure=True)


def _read_header(uploaded_file):
    position = uploaded_file.tell()
    header = uploaded_file.read(32)
    uploaded_file.seek(position)
    return header


def validate_image_upload(uploaded_file):
    """Validate a bounded raster upload using extension, type, and file signature."""
    if not uploaded_file:
        return
    if uploaded_file.size > MAX_IMAGE_SIZE:
        raise ValueError("Images must be 10 MB or smaller.")

    extension = Path(uploaded_file.name or "").suffix.lower()
    content_type = (getattr(uploaded_file, "content_type", "") or "").lower()
    if extension not in ALLOWED_EXTENSIONS or content_type not in ALLOWED_CONTENT_TYPES:
        raise ValueError("Upload a JPEG, PNG, WebP, or AVIF image.")

    header = _read_header(uploaded_file)
    signatures = (
        extension in {".jpg", ".jpeg"} and header.startswith(b"\xff\xd8\xff"),
        extension == ".png" and header.startswith(b"\x89PNG\r\n\x1a\n"),
        extension == ".webp" and header.startswith(b"RIFF") and header[8:12] == b"WEBP",
        extension == ".avif" and len(header) >= 12 and header[4:8] == b"ftyp" and header[8:12] in {b"avif", b"avis"},
    )
    if not any(signatures):
        raise ValueError("The uploaded file is not a valid supported raster image.")


def upload_image(uploaded_file, public_id):
    """Upload or replace an image at its stable Cloudinary public ID."""
    _configure_cloudinary()
    try:
        response = uploader.upload(
            uploaded_file,
            public_id=public_id,
            resource_type="image",
            overwrite=True,
            invalidate=True,
        )
    except Exception as exc:  # SDK exceptions vary by transport/configuration.
        raise MediaProviderError("Cloudinary image upload failed.") from exc
    if response.get("resource_type", "image") != "image":
        raise MediaProviderError("Cloudinary returned an incompatible media type.")
    if response.get("public_id") != public_id:
        raise MediaProviderError("Cloudinary returned an unexpected media identity.")
    if not str(response.get("secure_url", "")).startswith("https://"):
        raise MediaProviderError("Cloudinary returned an insecure media URL.")
    return response


def destroy_image(public_id):
    """Destroy an image by public ID; provider not-found is idempotent success."""
    _configure_cloudinary()
    try:
        response = uploader.destroy(
            public_id,
            resource_type="image",
            invalidate=True,
        )
    except Exception as exc:  # Cleanup must be best effort after DB commit.
        raise MediaProviderError("Cloudinary image cleanup failed.") from exc
    if response.get("result") not in {None, "ok", "not found"}:
        raise MediaProviderError("Cloudinary image cleanup was not confirmed.")
    return response


def schedule_image_cleanup(public_id, model_name, object_id):
    """Schedule best-effort provider cleanup without logging credentials."""
    from django.db import transaction

    def cleanup():
        try:
            destroy_image(public_id)
        except MediaProviderError:
            logger.exception(
                "Cloudinary cleanup failed for %s id=%s public_id=%s",
                model_name,
                object_id,
                public_id,
            )

    transaction.on_commit(cleanup)


def apply_upload_metadata(instance, response):
    """Copy only supported, non-sensitive Cloudinary response metadata."""
    instance.cloudinary_public_id = response.get("public_id", instance.cloudinary_public_id)
    instance.secure_url = response.get("secure_url", "")
    instance.asset_id = response.get("asset_id", "") or ""
    instance.format = response.get("format", "") or ""
    instance.width = response.get("width")
    instance.height = response.get("height")
    instance.byte_size = response.get("bytes")
    instance.cloudinary_version = response.get("version")
