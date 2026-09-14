from decimal import Decimal

from django.db import IntegrityError, transaction
from django.test import TestCase

from apps.catalog.models import Collection, CollectionProduct, Product, ProductVariant


class DatabaseConstraintTests(TestCase):
    def setUp(self):
        self.product = Product.objects.create(slug="constraint-product", name="Constraint Product")
        self.collection = Collection.objects.create(slug="constraint-collection", name="Constraint")

    def variant(self, **overrides):
        values = {
            "product": self.product,
            "label": "50ml",
            "ml": 50,
            "price": Decimal("10.00"),
        }
        values.update(overrides)
        return ProductVariant.objects.create(**values)

    def assert_integrity_error(self, **values):
        with self.assertRaises(IntegrityError):
            with transaction.atomic():
                self.variant(**values)

    def test_variant_product_label_is_unique(self):
        self.variant()
        self.assert_integrity_error(label="50ml")

    def test_variant_milliliters_must_be_positive(self):
        self.assert_integrity_error(ml=0)

    def test_variant_price_must_be_nonnegative(self):
        self.assert_integrity_error(price=Decimal("-0.01"))

    def test_compare_at_price_cannot_be_below_price(self):
        self.assert_integrity_error(price=Decimal("10.00"), compare_at_price=Decimal("9.99"))

    def test_collection_product_membership_is_unique(self):
        CollectionProduct.objects.create(collection=self.collection, product=self.product)

        with self.assertRaises(IntegrityError):
            with transaction.atomic():
                CollectionProduct.objects.create(
                    collection=self.collection,
                    product=self.product,
                )

    def test_collection_product_ordering_is_deterministic(self):
        second = Collection.objects.create(slug="second-collection", name="Second Collection")
        later = CollectionProduct.objects.create(
            collection=self.collection,
            product=self.product,
            sort_order=2,
        )
        earlier_product = Product.objects.create(slug="earlier-product", name="Earlier Product")
        earlier = CollectionProduct.objects.create(
            collection=self.collection,
            product=earlier_product,
            sort_order=1,
        )
        CollectionProduct.objects.create(collection=second, product=self.product, sort_order=1)

        self.assertEqual(list(CollectionProduct.objects.filter(collection=self.collection)), [earlier, later])
