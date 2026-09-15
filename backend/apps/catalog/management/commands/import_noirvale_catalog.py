import hashlib
import json
import mimetypes
import uuid
from decimal import Decimal
from pathlib import Path

from django.conf import settings
from django.core.files.uploadedfile import SimpleUploadedFile
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from apps.catalog.media import MediaProviderError, _configure_cloudinary, persist_uploaded_media, validate_image_upload
from apps.catalog.models import Collection, CollectionImage, CollectionProduct, Product, ProductImage, ProductVariant


SNAPSHOT_PATH = Path(__file__).resolve().parents[2] / "import_data" / "noirvale_catalog.json"
REPOSITORY_PATH = Path(settings.BASE_DIR).parent
SOURCE_PATH = REPOSITORY_PATH / "src" / "data" / "products.ts"
PUBLIC_PATH = REPOSITORY_PATH / "public"
BOOTSTRAP_NAMESPACE = uuid.UUID("8c1a5cb5-4e6e-5b86-89f5-8d6f7c4a0c11")


def _source_digest():
    return hashlib.sha256(SOURCE_PATH.read_bytes()).hexdigest()


def _expected_media(kind, identity):
    key = uuid.uuid5(BOOTSTRAP_NAMESPACE, f"{kind}:{identity}")
    prefix = "products" if kind == "product" else "collections"
    return key, f"noirvale/{prefix}/{key}"


def _public_asset(path_string):
    if not isinstance(path_string, str) or not path_string.startswith("/"):
        raise CommandError(f"Invalid local image path: {path_string!r}")
    candidate = (PUBLIC_PATH / path_string.lstrip("/")).resolve()
    public_root = PUBLIC_PATH.resolve()
    if candidate != public_root and public_root not in candidate.parents:
        raise CommandError(f"Image path is outside public/: {path_string}")
    if not candidate.is_file():
        raise CommandError(f"Missing local image asset: {path_string}")
    content_type = mimetypes.guess_type(candidate.name)[0] or ""
    uploaded = SimpleUploadedFile(candidate.name, candidate.read_bytes(), content_type=content_type)
    try:
        validate_image_upload(uploaded)
    except (ValueError, OSError) as exc:
        raise CommandError(f"Invalid local image asset {path_string}: {exc}") from exc
    return candidate, uploaded


def _mapped_product(source, sort_order):
    return {
        "legacy_id": source["id"],
        "slug": source["slug"],
        "name": source["name"],
        "tagline": source["tagline"],
        "category": source["category"],
        "legacy_collection_label": source["collection"],
        "scent_family": source["scentFamily"],
        "concentration": source["concentration"],
        "currency": source["currency"],
        "short_description": source["shortDescription"],
        "full_description": source["fullDescription"],
        "top_notes": source["notes"]["top"],
        "heart_notes": source["notes"]["heart"],
        "base_notes": source["notes"]["base"],
        "longevity": source["longevity"],
        "sillage": source["sillage"],
        "seasons": source["season"],
        "occasions": source["occasions"],
        "style_tags": source["style"],
        "in_stock": source["inStock"],
        "is_published": True,
        "is_featured": source["isFeatured"],
        "is_bestseller": source["isBestseller"],
        "is_new": source["isNew"],
        "sort_order": sort_order,
    }


def load_snapshot():
    try:
        snapshot = json.loads(SNAPSHOT_PATH.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise CommandError(f"Cannot read migration snapshot: {exc}") from exc
    if _source_digest() != snapshot.get("source_sha256"):
        raise CommandError("Static catalogue source changed after the Phase 6 migration snapshot was prepared.")
    products = snapshot.get("products")
    collections = snapshot.get("collections")
    if not isinstance(products, list) or not isinstance(collections, list):
        raise CommandError("Migration snapshot must contain product and collection arrays.")
    if len(products) != 12 or len({item.get("id") for item in products}) != 12 or len({item.get("slug") for item in products}) != 12:
        raise CommandError("Snapshot product count or uniqueness invariant failed.")
    if sum(len(item.get("sizes", [])) for item in products) != 25:
        raise CommandError("Snapshot variant count invariant failed.")
    if len(collections) != 6 or len({item.get("slug") for item in collections}) != 6:
        raise CommandError("Snapshot collection count or uniqueness invariant failed.")
    valid_families = {
        "Oud & Amber",
        "Woody & Earthy",
        "Fresh & Aquatic",
        "Spicy & Oriental",
        "Aromatic & Herbal",
        "Leather & Tobacco",
        "Citrus & Aromatic",
    }
    memberships = {}
    for collection in collections:
        unknown = set(collection.get("scentFamilies", [])) - valid_families
        if unknown:
            raise CommandError(f"Unknown scent family in {collection.get('slug')}: {sorted(unknown)}")
        members = [item for item in products if item.get("scentFamily") in collection.get("scentFamilies", [])]
        memberships[collection["slug"]] = [item["slug"] for item in members]
    if sum(len(items) for items in memberships.values()) != 18:
        raise CommandError("Snapshot membership count invariant failed.")
    for item in products:
        if not item.get("images", {}).get("main"):
            raise CommandError(f"Product {item.get('slug')} has no main image.")
        for size in item.get("sizes", []):
            if size.get("ml", 0) <= 0 or Decimal(str(size.get("price", -1))) < 0:
                raise CommandError(f"Invalid variant in {item.get('slug')}.")
        _public_asset(item["images"]["main"])
        seen = {item["images"]["main"]}
        for path in item.get("images", {}).get("gallery", []):
            if path not in seen:
                _public_asset(path)
                seen.add(path)
    for collection in collections:
        _public_asset(collection["image"])
    return snapshot, memberships


def _conflict(message):
    raise CommandError(f"Bootstrap conflict: {message}")


def _assert_equal(instance, expected, label):
    for field, value in expected.items():
        if getattr(instance, field) != value:
            _conflict(f"{label} field {field} differs from the migration snapshot.")


def inspect_relational(snapshot, memberships):
    product_map = {}
    product_creates = 0
    variant_creates = 0
    collection_creates = 0
    membership_creates = 0
    for index, source in enumerate(snapshot["products"]):
        expected = _mapped_product(source, index)
        by_id = Product.objects.filter(legacy_id=source["id"]).first()
        by_slug = Product.objects.filter(slug=source["slug"]).first()
        if by_id and by_slug and by_id.pk != by_slug.pk:
            _conflict(f"product {source['id']} and slug {source['slug']} identify different records.")
        existing = by_id or by_slug
        if existing:
            _assert_equal(existing, expected, f"Product {source['slug']}")
            product_map[source["slug"]] = existing
        else:
            product_creates += 1
    for source in snapshot["collections"]:
        expected = {"slug": source["slug"], "name": source["name"], "description": source["description"], "is_published": True, "sort_order": snapshot["collections"].index(source)}
        existing = Collection.objects.filter(slug=source["slug"]).first()
        if existing:
            _assert_equal(existing, expected, f"Collection {source['slug']}")
        else:
            collection_creates += 1
    for source in snapshot["products"]:
        product = product_map.get(source["slug"])
        if not product:
            variant_creates += len(source["sizes"])
            continue
        for index, size in enumerate(source["sizes"]):
            expected = {"product": product, "label": size["label"], "ml": size["ml"], "price": size["price"], "compare_at_price": None, "in_stock": size["inStock"], "is_active": True, "sort_order": index}
            existing = ProductVariant.objects.filter(product=product, label=size["label"]).first()
            if existing:
                _assert_equal(existing, expected, f"Variant {source['slug']} {size['label']}")
            else:
                variant_creates += 1
    for collection in snapshot["collections"]:
        db_collection = Collection.objects.filter(slug=collection["slug"]).first()
        if not db_collection:
            membership_creates += len(memberships[collection["slug"]])
            continue
        for index, slug in enumerate(memberships[collection["slug"]]):
            product = product_map.get(slug)
            if not product:
                membership_creates += 1
                continue
            existing = CollectionProduct.objects.filter(collection=db_collection, product=product).first()
            if existing:
                _assert_equal(existing, {"collection": db_collection, "product": product, "sort_order": index}, f"Membership {collection['slug']} {slug}")
            else:
                membership_creates += 1
    return product_creates, variant_creates, collection_creates, membership_creates


def create_relational(snapshot, memberships):
    with transaction.atomic():
        products = {}
        for index, source in enumerate(snapshot["products"]):
            expected = _mapped_product(source, index)
            product, created = Product.objects.get_or_create(legacy_id=source["id"], defaults=expected)
            if not created:
                _assert_equal(product, expected, f"Product {source['slug']}")
            products[source["slug"]] = product
        collections = {}
        for index, source in enumerate(snapshot["collections"]):
            expected = {"name": source["name"], "description": source["description"], "is_published": True, "sort_order": index}
            collection, created = Collection.objects.get_or_create(slug=source["slug"], defaults=expected)
            if not created:
                _assert_equal(collection, {"slug": source["slug"], **expected}, f"Collection {source['slug']}")
            collections[source["slug"]] = collection
        for source in snapshot["products"]:
            product = products[source["slug"]]
            for index, size in enumerate(source["sizes"]):
                expected = {"ml": size["ml"], "price": size["price"], "compare_at_price": None, "in_stock": size["inStock"], "is_active": True, "sort_order": index}
                variant, created = ProductVariant.objects.get_or_create(product=product, label=size["label"], defaults=expected)
                if not created:
                    _assert_equal(variant, {"product": product, "label": size["label"], **expected}, f"Variant {source['slug']} {size['label']}")
        for collection in snapshot["collections"]:
            db_collection = collections[collection["slug"]]
            for index, slug in enumerate(memberships[collection["slug"]]):
                membership, created = CollectionProduct.objects.get_or_create(collection=db_collection, product=products[slug], defaults={"sort_order": index})
                if not created:
                    _assert_equal(membership, {"collection": db_collection, "product": products[slug], "sort_order": index}, f"Membership {collection['slug']} {slug}")


def _media_rows(snapshot):
    for product in snapshot["products"]:
        main = product["images"]["main"]
        paths = [main] + [path for path in product["images"].get("gallery", []) if path != main]
        seen = set()
        for index, path in enumerate(paths):
            if path in seen:
                continue
            seen.add(path)
            yield "product", product["slug"], path, ProductImage.PRIMARY if index == 0 else ProductImage.GALLERY, 0 if index == 0 else index, product["name"]
    for collection in snapshot["collections"]:
        yield "collection", collection["slug"], collection["image"], None, None, collection["name"]


def migrate_media(snapshot, stdout):
    uploaded = 0
    existing = 0
    for kind, owner_slug, path, role, sort_order, alt_text in _media_rows(snapshot):
        key, public_id = _expected_media(kind, f"{owner_slug}:{path}")
        model = ProductImage if kind == "product" else CollectionImage
        owner = (Product.objects.get(slug=owner_slug) if kind == "product" else Collection.objects.get(slug=owner_slug))
        image = _inspect_media_row(model, owner, kind, key, public_id, role, sort_order)
        if image and image.secure_url:
            existing += 1
            continue
        _, uploaded_file = _public_asset(path)
        defaults = {"storage_key": key, "cloudinary_public_id": public_id, "secure_url": "", "alt_text": alt_text}
        if kind == "product":
            defaults.update({"product": owner, "role": role, "sort_order": sort_order})
            image, _ = ProductImage.objects.get_or_create(storage_key=key, defaults=defaults)
        else:
            defaults.update({"collection": owner})
            image, _ = CollectionImage.objects.get_or_create(storage_key=key, defaults=defaults)
        image._pending_media_is_new = True
        try:
            with transaction.atomic():
                persist_uploaded_media(image, uploaded_file)
        except Exception as exc:
            if image.pk:
                image.cloudinary_public_id = ""
                image.delete()
            raise CommandError(f"Cloudinary media migration failed for {kind} {owner_slug}: {exc}") from exc
        finally:
            if hasattr(image, "_pending_media_is_new"):
                del image._pending_media_is_new
        uploaded += 1
        stdout.write(f"Uploaded {kind} image for {owner_slug}")
    return uploaded, existing


def _inspect_media_row(model, owner, kind, key, public_id, role, sort_order):
    image = model.objects.filter(storage_key=key).first()
    by_public_id = model.objects.filter(cloudinary_public_id=public_id).first()
    if by_public_id and (not image or by_public_id.pk != image.pk):
        _conflict(f"bootstrap {kind} image {public_id} has a conflicting provider identity.")
    if not image:
        return None
    if (kind == "product" and image.product_id != owner.pk) or (kind == "collection" and image.collection_id != owner.pk):
        _conflict(f"bootstrap {kind} image {public_id} is attached to the wrong record.")
    if image.cloudinary_public_id != public_id:
        _conflict(f"bootstrap {kind} image {public_id} has a different provider identity.")
    if kind == "product" and (image.role != role or image.sort_order != sort_order):
        _conflict(f"bootstrap product image {public_id} has conflicting role or sort order.")
    return image


def inspect_media(snapshot):
    upload_counts = {"product": 0, "collection": 0}
    existing_counts = {"product": 0, "collection": 0}
    for kind, owner_slug, path, role, sort_order, _ in _media_rows(snapshot):
        key, public_id = _expected_media(kind, f"{owner_slug}:{path}")
        model = ProductImage if kind == "product" else CollectionImage
        owner = (Product.objects.filter(slug=owner_slug).first() if kind == "product" else Collection.objects.filter(slug=owner_slug).first())
        if not owner:
            upload_counts[kind] += 1
            continue
        image = _inspect_media_row(model, owner, kind, key, public_id, role, sort_order)
        if image and image.secure_url:
            existing_counts[kind] += 1
        else:
            upload_counts[kind] += 1
    return upload_counts, existing_counts


class Command(BaseCommand):
    help = "Bootstrap the static NOIRVALE catalogue into Django and Cloudinary."

    def add_arguments(self, parser):
        parser.add_argument("--dry-run", action="store_true", help="Validate and report without database/provider side effects.")

    def handle(self, *args, **options):
        snapshot, memberships = load_snapshot()
        product_creates, variant_creates, collection_creates, membership_creates = inspect_relational(snapshot, memberships)
        media_uploads, media_existing = inspect_media(snapshot)
        if options["dry_run"]:
            self.stdout.write("Dry run: no database changes or Cloudinary calls.")
            self.stdout.write(f"Products: create {product_creates} / existing {12 - product_creates}")
            self.stdout.write(f"Variants: create {variant_creates} / existing {25 - variant_creates}")
            self.stdout.write(f"Collections: create {collection_creates} / existing {6 - collection_creates}")
            self.stdout.write(f"Memberships: create {membership_creates} / existing {18 - membership_creates}")
            self.stdout.write(f"Product images: upload {media_uploads['product']} / existing {media_existing['product']}")
            self.stdout.write(f"Collection images: upload {media_uploads['collection']} / existing {media_existing['collection']}")
            return
        try:
            _configure_cloudinary()
        except MediaProviderError as exc:
            raise CommandError(str(exc)) from exc
        create_relational(snapshot, memberships)
        uploaded, existing = migrate_media(snapshot, self.stdout)
        self.stdout.write(self.style.SUCCESS("NOIRVALE catalogue import complete."))
        self.stdout.write(f"Relational creates: products {product_creates}, variants {variant_creates}, collections {collection_creates}, memberships {membership_creates}")
        self.stdout.write(f"Media: upload {uploaded} / existing {existing}")
