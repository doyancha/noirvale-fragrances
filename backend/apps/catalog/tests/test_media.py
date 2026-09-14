import os
from decimal import Decimal
from unittest.mock import patch

from django.contrib import admin
from django.db import IntegrityError, transaction
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import RequestFactory, TestCase, override_settings
from django.urls import reverse

from apps.catalog.admin import ProductImageInline
from apps.catalog.forms import CollectionImageAdminForm, ProductImageAdminForm
from apps.catalog.media import MediaProviderError, destroy_image, schedule_image_cleanup
from apps.catalog.models import Collection, CollectionImage, Product, ProductImage


PNG_BYTES = b"\x89PNG\r\n\x1a\n" + b"phase4-test"
JPEG_BYTES = b"\xff\xd8\xff\xe0" + b"phase4-test"
WEBP_BYTES = b"RIFF\x08\x00\x00\x00WEBP" + b"phase4-test"


def upload(name="image.png", content=None, content_type="image/png"):
    return SimpleUploadedFile(name, content or PNG_BYTES, content_type=content_type)


def cloudinary_response(public_id, **overrides):
    response = {
        "resource_type": "image",
        "public_id": public_id,
        "secure_url": f"https://res.cloudinary.com/noirvale/image/upload/{public_id}.png",
        "asset_id": "asset-phase4",
        "format": "png",
        "width": 800,
        "height": 800,
        "bytes": 12345,
        "version": 100,
    }
    response.update(overrides)
    return response


@override_settings(ROOT_URLCONF="noirvale_backend.urls")
class MediaTestCase(TestCase):
    def make_product(self, **overrides):
        values = {"slug": "media-product", "name": "Media Product", "currency": "BDT"}
        values.update(overrides)
        return Product.objects.create(**values)

    def make_collection(self, **overrides):
        values = {"slug": "media-collection", "name": "Media Collection"}
        values.update(overrides)
        return Collection.objects.create(**values)

    def setUp(self):
        self.cloudinary_env = patch.dict(os.environ, {"CLOUDINARY_URL": "cloudinary://key:secret@example"})
        self.cloudinary_env.start()
        self.request = RequestFactory().get("/admin/")
        self.request.user = self._create_superuser()

    def tearDown(self):
        self.cloudinary_env.stop()

    def product_image_form(self, product, image_file=None, **data):
        values = {"product": product.pk, "role": ProductImage.GALLERY, "alt_text": "Product image", "sort_order": 2}
        values.update(data)
        return ProductImageAdminForm(data=values, files={"upload": image_file} if image_file else None)

    def collection_image_form(self, collection, image_file=None, **data):
        values = {"collection": collection.pk, "alt_text": "Collection image"}
        values.update(data)
        return CollectionImageAdminForm(data=values, files={"upload": image_file} if image_file else None)

    @patch("apps.catalog.media.uploader.upload")
    def test_product_image_creation_uploads_and_persists_metadata(self, mock_upload):
        product = self.make_product()
        image = upload()
        form = self.product_image_form(product, image, role=ProductImage.PRIMARY)
        public_id = form.instance.default_cloudinary_public_id
        mock_upload.return_value = cloudinary_response(public_id)

        self.assertTrue(form.is_valid(), form.errors)
        saved = form.save()

        mock_upload.assert_called_once()
        call = mock_upload.call_args
        self.assertEqual(call.kwargs["public_id"], saved.cloudinary_public_id)
        self.assertEqual(call.kwargs["resource_type"], "image")
        self.assertTrue(call.kwargs["overwrite"])
        self.assertEqual(saved.product, product)
        self.assertEqual(saved.role, ProductImage.PRIMARY)
        self.assertEqual(saved.sort_order, 2)
        self.assertEqual(saved.width, 800)
        self.assertEqual(saved.byte_size, 12345)

    @patch("apps.catalog.media.uploader.upload")
    def test_collection_image_creation_uploads_and_persists_metadata(self, mock_upload):
        collection = self.make_collection()
        image = upload()
        form = self.collection_image_form(collection, image)
        public_id = form.instance.default_cloudinary_public_id
        mock_upload.return_value = cloudinary_response(public_id)

        self.assertTrue(form.is_valid(), form.errors)
        saved = form.save()

        mock_upload.assert_called_once()
        self.assertEqual(mock_upload.call_args.kwargs["public_id"], saved.cloudinary_public_id)
        self.assertEqual(saved.collection, collection)
        self.assertEqual(saved.secure_url, cloudinary_response(public_id)["secure_url"])

    @patch("apps.catalog.media.uploader.upload")
    def test_product_image_replacement_overwrites_same_identity(self, mock_upload):
        product = self.make_product()
        image = ProductImage.objects.create(
            product=product,
            role=ProductImage.PRIMARY,
            cloudinary_public_id="noirvale/products/stable-key",
            secure_url="https://old.example/image.png",
        )
        mock_upload.return_value = cloudinary_response(image.cloudinary_public_id, format="webp", version=101)
        form = self.product_image_form(product, upload("replacement.webp", WEBP_BYTES, "image/webp"), role=ProductImage.PRIMARY)
        form.instance = image

        self.assertTrue(form.is_valid(), form.errors)
        saved = form.save()

        self.assertEqual(saved.pk, image.pk)
        self.assertEqual(saved.storage_key, image.storage_key)
        self.assertEqual(saved.cloudinary_public_id, "noirvale/products/stable-key")
        self.assertEqual(saved.format, "webp")
        self.assertEqual(saved.cloudinary_version, 101)
        self.assertTrue(mock_upload.call_args.kwargs["overwrite"])

    @patch("apps.catalog.media.uploader.upload")
    def test_collection_image_replacement_overwrites_same_identity(self, mock_upload):
        collection = self.make_collection()
        image = CollectionImage.objects.create(
            collection=collection,
            cloudinary_public_id="noirvale/collections/stable-key",
            secure_url="https://old.example/image.png",
        )
        mock_upload.return_value = cloudinary_response(image.cloudinary_public_id, format="jpeg", version=102)
        form = self.collection_image_form(collection, upload("replacement.jpg", JPEG_BYTES, "image/jpeg"))
        form.instance = image

        self.assertTrue(form.is_valid(), form.errors)
        saved = form.save()

        self.assertEqual(saved.pk, image.pk)
        self.assertEqual(saved.storage_key, image.storage_key)
        self.assertEqual(saved.cloudinary_public_id, "noirvale/collections/stable-key")
        self.assertEqual(saved.format, "jpeg")

    @patch("apps.catalog.media.uploader.destroy")
    def test_product_image_delete_schedules_destroy_after_commit(self, mock_destroy):
        product = self.make_product()
        image = ProductImage.objects.create(product=product, cloudinary_public_id="noirvale/products/delete-me")
        mock_destroy.return_value = {"result": "ok"}

        with self.captureOnCommitCallbacks(execute=True):
            image.delete()

        self.assertFalse(ProductImage.objects.filter(pk=image.pk).exists())
        mock_destroy.assert_called_once_with("noirvale/products/delete-me", resource_type="image", invalidate=True)

    @patch("apps.catalog.media.uploader.destroy")
    def test_collection_image_delete_schedules_destroy_after_commit(self, mock_destroy):
        collection = self.make_collection()
        image = CollectionImage.objects.create(collection=collection, cloudinary_public_id="noirvale/collections/delete-me")
        mock_destroy.return_value = {"result": "not found"}

        with self.captureOnCommitCallbacks(execute=True):
            image.delete()

        self.assertFalse(CollectionImage.objects.filter(pk=image.pk).exists())
        mock_destroy.assert_called_once_with("noirvale/collections/delete-me", resource_type="image", invalidate=True)

    @patch("apps.catalog.media.uploader.destroy")
    def test_product_delete_cascades_images_and_cleans_provider_assets(self, mock_destroy):
        product = self.make_product()
        ProductImage.objects.create(product=product, cloudinary_public_id="noirvale/products/one")
        ProductImage.objects.create(product=product, cloudinary_public_id="noirvale/products/two")
        mock_destroy.return_value = {"result": "ok"}

        with self.captureOnCommitCallbacks(execute=True):
            product.delete()

        self.assertFalse(ProductImage.objects.filter(product_id=product.pk).exists())
        self.assertCountEqual(
            [call.args[0] for call in mock_destroy.call_args_list],
            ["noirvale/products/one", "noirvale/products/two"],
        )

    @patch("apps.catalog.media.uploader.destroy")
    def test_collection_delete_cascades_image_without_deleting_products(self, mock_destroy):
        collection = self.make_collection()
        product = self.make_product()
        image = CollectionImage.objects.create(collection=collection, cloudinary_public_id="noirvale/collections/cascade")
        mock_destroy.return_value = {"result": "ok"}

        with self.captureOnCommitCallbacks(execute=True):
            collection.delete()

        self.assertFalse(CollectionImage.objects.filter(pk=image.pk).exists())
        self.assertTrue(Product.objects.filter(pk=product.pk).exists())
        mock_destroy.assert_called_once_with("noirvale/collections/cascade", resource_type="image", invalidate=True)

    @patch("apps.catalog.media.uploader.destroy", side_effect=RuntimeError("provider unavailable"))
    @patch("apps.catalog.media.logger.exception")
    def test_provider_delete_failure_is_logged_after_database_delete(self, mock_log, mock_destroy):
        product = self.make_product()
        image = ProductImage.objects.create(product=product, cloudinary_public_id="noirvale/products/failure")

        with self.captureOnCommitCallbacks(execute=True):
            image.delete()

        self.assertFalse(ProductImage.objects.filter(pk=image.pk).exists())
        mock_destroy.assert_called_once()
        mock_log.assert_called_once()

    def test_supported_raster_uploads_are_accepted(self):
        product = self.make_product()
        for name, content, content_type in (
            ("image.jpg", JPEG_BYTES, "image/jpeg"),
            ("image.png", PNG_BYTES, "image/png"),
            ("image.webp", WEBP_BYTES, "image/webp"),
        ):
            form = self.product_image_form(product, upload(name, content, content_type))
            with patch("apps.catalog.forms.upload_image", return_value=cloudinary_response("test")):
                self.assertTrue(form.is_valid(), form.errors)

    def test_invalid_and_oversized_uploads_are_rejected(self):
        product = self.make_product()
        invalid = self.product_image_form(product, upload("image.png", b"not-an-image", "image/png"))
        self.assertFalse(invalid.is_valid())
        self.assertIn("valid supported raster image", str(invalid.errors))

        oversized = self.product_image_form(
            product,
            upload("image.png", b"\x89PNG\r\n\x1a\n" + b"x" * (10 * 1024 * 1024), "image/png"),
        )
        self.assertFalse(oversized.is_valid())
        self.assertIn("10 MB", str(oversized.errors))

    def test_svg_and_mismatched_extension_are_rejected(self):
        product = self.make_product()
        svg = self.product_image_form(product, upload("image.svg", b"<svg></svg>", "image/svg+xml"))
        mismatch = self.product_image_form(product, upload("image.png", JPEG_BYTES, "image/png"))

        self.assertFalse(svg.is_valid())
        self.assertFalse(mismatch.is_valid())

    def test_primary_image_formset_rejects_two_primary_images(self):
        product = self.make_product()
        first = ProductImage.objects.create(
            product=product, role=ProductImage.GALLERY, cloudinary_public_id="existing-one"
        )
        second = ProductImage.objects.create(
            product=product, role=ProductImage.GALLERY, cloudinary_public_id="existing-two"
        )
        inline = ProductImageInline(Product, admin.site)
        formset_class = inline.get_formset(self.request, product)
        formset = formset_class(
            data={
                "images-TOTAL_FORMS": "2",
                "images-INITIAL_FORMS": "2",
                "images-MIN_NUM_FORMS": "0",
                "images-MAX_NUM_FORMS": "1000",
                "images-0-id": str(first.pk),
                "images-0-role": "primary",
                "images-0-alt_text": "one",
                "images-0-sort_order": "0",
                "images-1-id": str(second.pk),
                "images-1-role": "primary",
                "images-1-alt_text": "two",
                "images-1-sort_order": "1",
            },
            instance=product,
        )

        self.assertFalse(formset.is_valid())
        self.assertIn("one primary", str(formset.non_form_errors()).lower())

    def test_database_enforces_one_primary_and_one_collection_image(self):
        product = self.make_product()
        ProductImage.objects.create(product=product, role=ProductImage.PRIMARY, cloudinary_public_id="one")
        with self.assertRaises(IntegrityError):
            with transaction.atomic():
                ProductImage.objects.create(product=product, role=ProductImage.PRIMARY, cloudinary_public_id="two")

        collection = self.make_collection()
        CollectionImage.objects.create(collection=collection, cloudinary_public_id="collection-one")
        with self.assertRaises(IntegrityError):
            with transaction.atomic():
                CollectionImage.objects.create(collection=collection, cloudinary_public_id="collection-two")

    @patch("apps.catalog.media.uploader.upload", side_effect=RuntimeError("secret should not leak"))
    def test_missing_or_failed_provider_upload_is_controlled(self, mock_upload):
        product = self.make_product()
        with patch.dict(os.environ, {}, clear=True):
            form = self.product_image_form(product, upload())
            self.assertFalse(form.is_valid())
            self.assertIn("not configured", str(form.errors).lower())
        mock_upload.assert_not_called()

    @patch("apps.catalog.media.uploader.upload", side_effect=RuntimeError("provider unavailable"))
    def test_provider_upload_failure_is_a_safe_form_error(self, mock_upload):
        product = self.make_product()
        form = self.product_image_form(product, upload())

        self.assertFalse(form.is_valid())
        self.assertIn("upload failed", str(form.errors).lower())
        self.assertNotIn("secret", str(form.errors).lower())
        mock_upload.assert_called_once()

    @patch("apps.catalog.media.uploader.destroy")
    def test_destroy_accepts_provider_not_found(self, mock_destroy):
        mock_destroy.return_value = {"result": "not found"}
        self.assertEqual(destroy_image("noirvale/products/missing")["result"], "not found")

    def test_admin_media_pages_and_safe_previews_work(self):
        self.client.force_login(self.request.user)
        product = self.make_product()
        collection = self.make_collection()
        product_image = ProductImage.objects.create(
            product=product,
            cloudinary_public_id="noirvale/products/preview",
            secure_url="https://res.cloudinary.com/example/image/upload/preview.png",
        )
        collection_image = CollectionImage.objects.create(
            collection=collection,
            cloudinary_public_id="noirvale/collections/preview",
            secure_url="https://res.cloudinary.com/example/image/upload/preview.png",
        )

        for url in (
            reverse("admin:catalog_productimage_changelist"),
            reverse("admin:catalog_productimage_add"),
            reverse("admin:catalog_productimage_change", args=[product_image.pk]),
            reverse("admin:catalog_collectionimage_changelist"),
            reverse("admin:catalog_collectionimage_add"),
            reverse("admin:catalog_collectionimage_change", args=[collection_image.pk]),
        ):
            self.assertEqual(self.client.get(url).status_code, 200)

        preview = admin.site._registry[ProductImage].preview(product_image)
        self.assertIn("https://res.cloudinary.com/example/image/upload/preview.png", str(preview))
        self.assertIn("width:100px", str(preview))

    def _create_superuser(self):
        from django.contrib.auth import get_user_model

        return get_user_model().objects.create_superuser(
            username="media-admin",
            email="media-admin@example.com",
            password="media-admin-password",
        )
