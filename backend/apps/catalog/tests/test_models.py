from decimal import Decimal

from django.core.exceptions import ValidationError
from django.test import TestCase

from apps.catalog.models import Collection, CollectionProduct, Product, ProductVariant


class CatalogModelTests(TestCase):
    def product(self, **overrides):
        values = {
            "legacy_id": "nv-test-001",
            "slug": "test-product",
            "name": "Test Product",
            "currency": "BDT",
            "top_notes": ["Bergamot"],
            "heart_notes": ["Iris"],
            "base_notes": ["Cedar"],
            "seasons": ["All seasons"],
            "occasions": ["Everyday"],
            "style_tags": ["Refined"],
        }
        values.update(overrides)
        return Product.objects.create(**values)

    def test_product_creation_and_string_representation(self):
        product = self.product()

        self.assertEqual(str(product), "Test Product")
        self.assertTrue(product.is_published)
        self.assertEqual(product.currency, "BDT")

    def test_product_slug_and_legacy_id_are_unique_when_supplied(self):
        self.product()

        duplicate_slug = Product(slug="test-product", name="Another", currency="BDT")
        with self.assertRaises(ValidationError):
            duplicate_slug.full_clean()

        duplicate_legacy_id = Product(
            legacy_id="nv-test-001",
            slug="another-product",
            name="Another",
            currency="BDT",
        )
        with self.assertRaises(ValidationError):
            duplicate_legacy_id.full_clean()

    def test_json_fields_require_lists_of_strings(self):
        product = self.product(top_notes={"note": "Bergamot"})

        with self.assertRaises(ValidationError):
            product.full_clean()

    def test_product_ordering_is_sort_order_then_id(self):
        later = self.product(legacy_id="nv-test-002", slug="later", name="Later", sort_order=2)
        earlier = self.product(
            legacy_id="nv-test-003", slug="earlier", name="Earlier", sort_order=1
        )

        self.assertEqual(list(Product.objects.all()), [earlier, later])

    def test_variant_attaches_and_orders_deterministically(self):
        product = self.product()
        later = ProductVariant.objects.create(
            product=product,
            label="100ml",
            ml=100,
            price=Decimal("49.90"),
            sort_order=2,
        )
        earlier = ProductVariant.objects.create(
            product=product,
            label="50ml",
            ml=50,
            price=Decimal("34.90"),
            sort_order=1,
        )

        self.assertEqual(list(product.variants.all()), [earlier, later])

    def test_collection_can_relate_multiple_products_and_products_multiple_collections(self):
        first = self.product()
        second = self.product(legacy_id="nv-test-002", slug="second", name="Second")
        first_collection = Collection.objects.create(slug="first", name="First")
        second_collection = Collection.objects.create(slug="second", name="Second")
        CollectionProduct.objects.create(collection=first_collection, product=first, sort_order=1)
        CollectionProduct.objects.create(collection=first_collection, product=second, sort_order=2)
        CollectionProduct.objects.create(collection=second_collection, product=first, sort_order=1)

        self.assertEqual(first.collections.count(), 2)
        self.assertEqual(first_collection.products.count(), 2)
        self.assertEqual(str(first_collection), "First")
