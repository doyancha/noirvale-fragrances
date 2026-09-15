import os
import tempfile
from pathlib import Path
from unittest.mock import patch
from decimal import Decimal
from io import StringIO

from django.core.management import call_command, CommandError
from django.test import TestCase
from rest_framework.test import APIClient

from apps.catalog.management.commands import import_noirvale_catalog as importer
from apps.catalog.models import Collection, CollectionImage, CollectionProduct, Product, ProductImage, ProductVariant


def provider_response(public_id):
    return {
        "resource_type": "image",
        "public_id": public_id,
        "secure_url": f"https://res.cloudinary.com/noirvale/image/upload/{public_id}.webp",
        "asset_id": f"asset-{public_id.rsplit('/', 1)[-1]}",
        "format": "webp",
        "width": 1200,
        "height": 1200,
        "bytes": 1000,
        "version": 1,
    }


class CatalogImportTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.cloudinary_env = patch.dict(os.environ, {"CLOUDINARY_URL": "cloudinary://key:secret@example"})
        self.cloudinary_env.start()
        self.cloudinary_config = patch.object(importer, "_configure_cloudinary")
        self.cloudinary_config.start()

    def tearDown(self):
        self.cloudinary_config.stop()
        self.cloudinary_env.stop()

    def test_snapshot_counts_membership_and_source_hash(self):
        snapshot, memberships = importer.load_snapshot()
        self.assertEqual(len(snapshot["products"]), 12)
        self.assertEqual(sum(len(item["sizes"]) for item in snapshot["products"]), 25)
        self.assertEqual(len(snapshot["collections"]), 6)
        self.assertEqual(sum(len(items) for items in memberships.values()), 18)
        self.assertEqual(importer._source_digest(), snapshot["source_sha256"])
        self.assertEqual(memberships["office-everyday"], ["azure-night", "ember-woods", "royal-vetiver", "silver-coast", "cedar-dominion", "black-cypress"])

    def test_source_hash_mismatch_fails_before_import(self):
        with tempfile.NamedTemporaryFile("w", suffix=".ts", delete=False) as source:
            source.write("changed")
            changed_path = Path(source.name)
        try:
            with patch.object(importer, "SOURCE_PATH", changed_path), self.assertRaisesMessage(
                CommandError, "Static catalogue source changed after the Phase 6 migration snapshot was prepared."
            ):
                importer.load_snapshot()
        finally:
            changed_path.unlink()

    @patch("apps.catalog.media.uploader.upload")
    def test_dry_run_has_zero_database_and_provider_side_effects(self, mock_upload):
        call_command("import_noirvale_catalog", dry_run=True)
        self.assertEqual(Product.objects.count(), 0)
        self.assertEqual(Collection.objects.count(), 0)
        self.assertEqual(mock_upload.call_count, 0)

    @patch("apps.catalog.media.uploader.upload")
    def test_empty_import_has_exact_counts_and_api_parity(self, mock_upload):
        mock_upload.side_effect = lambda uploaded_file, **kwargs: provider_response(kwargs["public_id"])
        call_command("import_noirvale_catalog")

        self.assertEqual(Product.objects.count(), 12)
        self.assertEqual(ProductVariant.objects.count(), 25)
        self.assertEqual(Collection.objects.count(), 6)
        self.assertEqual(CollectionProduct.objects.count(), 18)
        self.assertEqual(ProductImage.objects.count(), 12)
        self.assertEqual(CollectionImage.objects.count(), 6)
        self.assertEqual(ProductImage.objects.filter(role=ProductImage.PRIMARY, secure_url__startswith="https://").count(), 12)
        self.assertEqual(ProductImage.objects.filter(cloudinary_public_id__startswith="noirvale/products/").count(), 12)
        self.assertEqual(CollectionImage.objects.filter(secure_url__startswith="https://").count(), 6)
        self.assertEqual(CollectionImage.objects.filter(cloudinary_public_id__startswith="noirvale/collections/").count(), 6)
        self.assertEqual(ProductImage.objects.values_list("cloudinary_public_id", flat=True).distinct().count(), 12)
        self.assertEqual(CollectionImage.objects.values_list("cloudinary_public_id", flat=True).distinct().count(), 6)
        self.assertEqual([item["slug"] for item in self.client.get("/api/v1/products/").json()], [item["slug"] for item in importer.load_snapshot()[0]["products"]])
        self.assertEqual([item["slug"] for item in self.client.get("/api/v1/collections/").json()], [item["slug"] for item in importer.load_snapshot()[0]["collections"]])
        noir = self.client.get("/api/v1/products/noir-reserve/").json()
        self.assertEqual([variant["price"] for variant in noir["variants"]], ["3490.00", "4990.00"])
        self.assertEqual(noir["primary_image"]["role"], "primary")
        self.assertEqual(self.client.get("/api/v1/collections/office-everyday/").json()["image"]["secure_url"].startswith("https://"), True)

    @patch("apps.catalog.media.uploader.upload")
    def test_field_and_variant_parity_for_representative_products(self, mock_upload):
        mock_upload.side_effect = lambda uploaded_file, **kwargs: provider_response(kwargs["public_id"])
        call_command("import_noirvale_catalog")
        expected = {item["slug"]: item for item in importer.load_snapshot()[0]["products"]}
        for slug in ("noir-reserve", "silver-coast", "midnight-saffron", "velvet-smoke"):
            product = Product.objects.get(slug=slug)
            source = expected[slug]
            self.assertEqual(product.legacy_id, source["id"])
            self.assertEqual(product.full_description, source["fullDescription"])
            self.assertEqual(product.scent_family, source["scentFamily"])
            self.assertEqual(product.concentration, source["concentration"])
            self.assertEqual(product.top_notes, source["notes"]["top"])
            self.assertEqual(product.seasons, source["season"])
            self.assertEqual(product.style_tags, source["style"])
            self.assertEqual(product.is_featured, source["isFeatured"])
            self.assertEqual(product.is_bestseller, source["isBestseller"])
            self.assertEqual(product.is_new, source["isNew"])
            self.assertEqual(list(product.variants.values_list("label", "ml", "price", "in_stock")), [(size["label"], size["ml"], Decimal(str(size["price"])), size["inStock"]) for size in source["sizes"]])

    @patch("apps.catalog.media.uploader.upload")
    def test_membership_and_legacy_label_parity(self, mock_upload):
        mock_upload.side_effect = lambda uploaded_file, **kwargs: provider_response(kwargs["public_id"])
        call_command("import_noirvale_catalog")
        expected = {
            "oud-amber": ["imperial-oud", "midnight-saffron"],
            "fresh-aquatic": ["azure-night", "silver-coast"],
            "woody-earthy": ["ember-woods", "cedar-dominion"],
            "spicy-oriental": ["noir-reserve", "atlas-noir", "amber-code"],
            "evening-intense": ["imperial-oud", "midnight-saffron", "velvet-smoke"],
            "office-everyday": ["azure-night", "ember-woods", "royal-vetiver", "silver-coast", "cedar-dominion", "black-cypress"],
        }
        for slug, products in expected.items():
            collection = Collection.objects.get(slug=slug)
            self.assertEqual(list(collection.products.order_by("collectionproduct__sort_order").values_list("slug", flat=True)), products)
        self.assertEqual(Collection.objects.filter(name="Signature Collection").count(), 0)
        self.assertEqual(Product.objects.get(slug="noir-reserve").legacy_collection_label, "Signature Collection")

    @patch("apps.catalog.media.uploader.upload")
    def test_idempotent_rerun_skips_complete_media(self, mock_upload):
        mock_upload.side_effect = lambda uploaded_file, **kwargs: provider_response(kwargs["public_id"])
        call_command("import_noirvale_catalog")
        first_count = mock_upload.call_count
        call_command("import_noirvale_catalog")
        self.assertEqual(first_count, 18)
        self.assertEqual(mock_upload.call_count, first_count)
        self.assertEqual(Product.objects.count(), 12)
        self.assertEqual(CollectionProduct.objects.count(), 18)
        self.assertEqual(ProductImage.objects.values("cloudinary_public_id").distinct().count(), 12)

    @patch("apps.catalog.media.uploader.upload")
    def test_dry_run_reports_completed_media_as_existing(self, mock_upload):
        mock_upload.side_effect = lambda uploaded_file, **kwargs: provider_response(kwargs["public_id"])
        call_command("import_noirvale_catalog")
        output = StringIO()
        call_command("import_noirvale_catalog", dry_run=True, stdout=output)
        self.assertIn("Products: create 0 / existing 12", output.getvalue())
        self.assertIn("Variants: create 0 / existing 25", output.getvalue())
        self.assertIn("Collections: create 0 / existing 6", output.getvalue())
        self.assertIn("Memberships: create 0 / existing 18", output.getvalue())
        self.assertIn("Product images: upload 0 / existing 12", output.getvalue())
        self.assertIn("Collection images: upload 0 / existing 6", output.getvalue())
        self.assertEqual(mock_upload.call_count, 18)

    @patch("apps.catalog.media.uploader.destroy")
    @patch("apps.catalog.media.uploader.upload")
    def test_upload_success_metadata_save_failure_cleans_provider_and_row(self, mock_upload, mock_destroy):
        mock_upload.side_effect = lambda uploaded_file, **kwargs: provider_response(kwargs["public_id"])
        mock_destroy.return_value = {"result": "ok"}
        original_save = ProductImage.save

        def fail_metadata_save(instance, *args, **kwargs):
            if kwargs.get("update_fields"):
                raise RuntimeError("metadata database failure")
            return original_save(instance, *args, **kwargs)

        with patch.object(ProductImage, "save", new=fail_metadata_save), self.assertRaises(CommandError):
            call_command("import_noirvale_catalog")

        expected_key, expected_public_id = importer._expected_media(
            "product", "noir-reserve:/noirvale/products/noir-reserve/main.webp"
        )
        self.assertEqual(mock_upload.call_count, 1)
        mock_destroy.assert_called_once_with(expected_public_id, resource_type="image", invalidate=True)
        self.assertFalse(ProductImage.objects.filter(storage_key=expected_key).exists())
        self.assertFalse(ProductImage.objects.filter(secure_url__startswith="https://").exists())

        mock_upload.reset_mock()
        call_command("import_noirvale_catalog")
        self.assertEqual(ProductImage.objects.filter(secure_url__startswith="https://").count(), 12)

    @patch("apps.catalog.media.uploader.upload")
    def test_incomplete_media_wrong_public_id_is_a_conflict(self, mock_upload):
        snapshot, memberships = importer.load_snapshot()
        importer.create_relational(snapshot, memberships)
        product = Product.objects.get(slug="noir-reserve")
        key, _ = importer._expected_media("product", "noir-reserve:/noirvale/products/noir-reserve/main.webp")
        ProductImage.objects.create(
            product=product,
            storage_key=key,
            cloudinary_public_id="noirvale/products/wrong-identity",
            role=ProductImage.PRIMARY,
            sort_order=0,
        )
        with self.assertRaisesMessage(CommandError, "Bootstrap conflict"):
            call_command("import_noirvale_catalog")
        self.assertEqual(mock_upload.call_count, 0)
        self.assertEqual(ProductImage.objects.get(storage_key=key).cloudinary_public_id, "noirvale/products/wrong-identity")

    @patch("apps.catalog.media.uploader.upload")
    def test_media_failure_can_resume_without_duplicates(self, mock_upload):
        calls = {"count": 0}

        def fail_after_eight(uploaded_file, **kwargs):
            calls["count"] += 1
            if calls["count"] == 9:
                raise RuntimeError("temporary provider failure")
            return provider_response(kwargs["public_id"])

        mock_upload.side_effect = fail_after_eight
        with self.assertRaises(CommandError):
            call_command("import_noirvale_catalog")
        self.assertEqual(Product.objects.count(), 12)
        self.assertEqual(ProductImage.objects.filter(secure_url__startswith="https://").count(), 8)

        mock_upload.side_effect = lambda uploaded_file, **kwargs: provider_response(kwargs["public_id"])
        call_command("import_noirvale_catalog")
        self.assertEqual(ProductImage.objects.count(), 12)
        self.assertEqual(CollectionImage.objects.count(), 6)
        self.assertEqual(mock_upload.call_count, 19)

    @patch("apps.catalog.media.uploader.upload")
    def test_material_product_conflict_fails_without_overwrite(self, mock_upload):
        Product.objects.create(legacy_id="nv-001", slug="different-slug", name="Admin Product")
        with self.assertRaisesMessage(CommandError, "Bootstrap conflict"):
            call_command("import_noirvale_catalog")
        self.assertEqual(Product.objects.get(legacy_id="nv-001").name, "Admin Product")
        self.assertEqual(mock_upload.call_count, 0)
