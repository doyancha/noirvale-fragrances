from decimal import Decimal

from django.test import TestCase
from rest_framework.test import APIClient

from apps.catalog.models import Collection, CollectionImage, CollectionProduct, Product, ProductImage, ProductVariant


class CatalogAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def product(self, slug="product", **overrides):
        values = {
            "slug": slug,
            "name": slug.replace("-", " ").title(),
            "legacy_id": f"legacy-{slug}",
            "top_notes": ["Bergamot"],
            "heart_notes": ["Iris"],
            "base_notes": ["Cedar"],
            "seasons": ["All seasons"],
            "occasions": ["Everyday"],
            "style_tags": ["Refined"],
        }
        values.update(overrides)
        return Product.objects.create(**values)

    def variant(self, product, label="50ml", **overrides):
        values = {"label": label, "ml": 50, "price": Decimal("1290.00")}
        values.update(overrides)
        return ProductVariant.objects.create(product=product, **values)

    def image(self, product, role=ProductImage.GALLERY, sort_order=0, **overrides):
        values = {
            "cloudinary_public_id": f"public/{product.slug}/{role}/{sort_order}",
            "secure_url": f"https://res.cloudinary.com/demo/{product.slug}-{sort_order}.jpg",
            "role": role,
            "sort_order": sort_order,
            "alt_text": "Catalogue image",
            "format": "jpg",
            "width": 100,
            "height": 100,
            "asset_id": "provider-asset",
            "cloudinary_version": 123,
        }
        values.update(overrides)
        return ProductImage.objects.create(product=product, **values)

    def test_empty_lists_and_missing_slugs(self):
        self.assertEqual(self.client.get("/api/v1/products/").status_code, 200)
        self.assertEqual(self.client.get("/api/v1/products/").json(), [])
        self.assertEqual(self.client.get("/api/v1/collections/").json(), [])
        self.assertEqual(self.client.get("/api/v1/products/missing/").status_code, 404)
        self.assertEqual(self.client.get("/api/v1/collections/missing/").status_code, 404)

    def test_product_publication_order_variants_decimal_images_and_allowlist(self):
        later = self.product("later", sort_order=2)
        earlier = self.product("earlier", sort_order=1)
        unpublished = self.product("hidden", is_published=False)
        self.variant(earlier, "100ml", ml=100, price=Decimal("2500.10"), sort_order=2, in_stock=False)
        self.variant(earlier, "50ml", sort_order=1)
        self.variant(earlier, "inactive", is_active=False, sort_order=0)
        self.image(earlier, role=ProductImage.GALLERY, sort_order=0)
        self.image(earlier, role=ProductImage.PRIMARY, sort_order=1)
        self.variant(unpublished)

        response = self.client.get("/api/v1/products/")
        self.assertEqual([item["slug"] for item in response.json()], ["earlier", "later"])
        data = response.json()[0]
        self.assertEqual([item["label"] for item in data["variants"]], ["50ml", "100ml"])
        self.assertEqual(data["variants"][1]["price"], "2500.10")
        self.assertFalse(data["variants"][1]["in_stock"])
        self.assertEqual(data["primary_image"]["role"], "primary")
        forbidden = {"id", "legacy_id", "legacy_collection_label", "is_published", "created_at", "updated_at"}
        self.assertTrue(forbidden.isdisjoint(data))
        self.assertTrue(forbidden.isdisjoint(data["variants"][0]))
        self.assertNotIn("storage_key", data["primary_image"])
        self.assertNotIn("cloudinary_public_id", data["primary_image"])
        self.assertNotIn("asset_id", data["primary_image"])
        self.assertNotIn("cloudinary_version", data["primary_image"])

        detail = self.client.get("/api/v1/products/earlier/").json()
        self.assertEqual([image["sort_order"] for image in detail["images"]], [0, 1])
        self.assertEqual(detail["collections"], [])
        self.assertEqual(self.client.get("/api/v1/products/hidden/").status_code, 404)

    def test_missing_primary_image_is_null(self):
        product = self.product()
        self.image(product, role=ProductImage.GALLERY)
        self.assertIsNone(self.client.get("/api/v1/products/product/").json()["primary_image"])

    def test_published_collection_without_image_returns_null_image(self):
        Collection.objects.create(slug="no-cover", name="No Cover")

        list_response = self.client.get("/api/v1/collections/")
        self.assertEqual(list_response.status_code, 200)
        self.assertEqual(list_response.json(), [{"slug": "no-cover", "name": "No Cover", "description": "", "image": None}])

        detail_response = self.client.get("/api/v1/collections/no-cover/")
        self.assertEqual(detail_response.status_code, 200)
        self.assertEqual(detail_response.json()["image"], None)

    def test_collection_publication_image_membership_order_and_legacy_label(self):
        first = self.product("first", sort_order=10, legacy_collection_label="Ignored")
        second = self.product("second", sort_order=1)
        hidden_product = self.product("hidden-product", is_published=False)
        collection = Collection.objects.create(slug="collection", name="Collection")
        hidden_collection = Collection.objects.create(slug="hidden-collection", name="Hidden", is_published=False)
        CollectionProduct.objects.create(collection=collection, product=first, sort_order=2)
        CollectionProduct.objects.create(collection=collection, product=second, sort_order=1)
        CollectionProduct.objects.create(collection=collection, product=hidden_product, sort_order=0)
        CollectionProduct.objects.create(collection=hidden_collection, product=first)
        CollectionImage.objects.create(
            collection=collection,
            cloudinary_public_id="collection/cover",
            secure_url="https://res.cloudinary.com/demo/cover.jpg",
            alt_text="Cover",
            format="jpg",
        )

        self.assertEqual([item["slug"] for item in self.client.get("/api/v1/collections/").json()], ["collection"])
        collection_data = self.client.get("/api/v1/collections/collection/").json()
        self.assertEqual(collection_data["image"]["alt_text"], "Cover")
        self.assertEqual([item["slug"] for item in collection_data["products"]], ["second", "first"])
        self.assertNotIn("collections", collection_data["products"][0])
        self.assertEqual(self.client.get("/api/v1/collections/hidden-collection/").status_code, 404)

        product_data = self.client.get("/api/v1/products/first/").json()
        self.assertEqual(product_data["collections"], [{"slug": "collection", "name": "Collection"}])

    def test_read_only_methods_and_slug_lookup(self):
        product = self.product()
        collection = Collection.objects.create(slug="collection", name="Collection")
        self.assertEqual(self.client.get(f"/api/v1/products/{product.pk}/").status_code, 404)
        self.assertEqual(self.client.post("/api/v1/products/", {}).status_code, 405)
        self.assertEqual(self.client.put("/api/v1/products/product/", {}).status_code, 405)
        self.assertEqual(self.client.patch("/api/v1/products/product/", {}).status_code, 405)
        self.assertEqual(self.client.delete("/api/v1/products/product/").status_code, 405)
        self.assertEqual(self.client.post("/api/v1/collections/", {}).status_code, 405)
        self.assertEqual(self.client.put("/api/v1/collections/collection/", {}).status_code, 405)
        self.assertEqual(self.client.patch("/api/v1/collections/collection/", {}).status_code, 405)
        self.assertEqual(self.client.delete("/api/v1/collections/collection/").status_code, 405)

    def test_product_list_query_count_does_not_grow_per_product(self):
        for index in range(4):
            product = self.product(f"product-{index}")
            self.variant(product)
            self.image(product)
        with self.assertNumQueries(3):
            response = self.client.get("/api/v1/products/")
            self.assertEqual(len(response.json()), 4)
