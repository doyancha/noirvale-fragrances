from decimal import Decimal

from django.contrib import admin
from django.contrib.auth import get_user_model
from django.urls import reverse
from django.test import RequestFactory, TestCase

from apps.catalog.admin import CollectionMembershipInline, ProductAdmin, PublicCollectionInline, ProductVariantInline
from apps.catalog.forms import ProductAdminForm
from apps.catalog.models import Collection, CollectionProduct, Product, ProductVariant


class AdminTestDataMixin:
    def make_product(self, **overrides):
        values = {"slug": "admin-product", "name": "Admin Product", "currency": "BDT"}
        values.update(overrides)
        return Product.objects.create(**values)

    def make_collection(self, **overrides):
        values = {"slug": "admin-collection", "name": "Admin Collection"}
        values.update(overrides)
        return Collection.objects.create(**values)


class CatalogAdminTests(AdminTestDataMixin, TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = get_user_model().objects.create_superuser(
            username="admin-test",
            email="admin-test@example.com",
            password="admin-test-password",
        )

    def setUp(self):
        self.client.force_login(self.user)
        self.request = RequestFactory().get("/admin/")
        self.request.user = self.user

    def test_all_catalog_models_are_registered(self):
        for model in (Product, ProductVariant, Collection, CollectionProduct):
            self.assertIn(model, admin.site._registry)

    def test_anonymous_admin_request_redirects_to_login(self):
        self.client.logout()
        response = self.client.get(reverse("admin:index"))

        self.assertEqual(response.status_code, 302)
        self.assertIn("/admin/login/", response["Location"])

    def test_authenticated_admin_index_and_product_pages_load(self):
        product = self.make_product()

        self.assertEqual(self.client.get(reverse("admin:index")).status_code, 200)
        self.assertEqual(self.client.get(reverse("admin:catalog_product_changelist")).status_code, 200)
        self.assertEqual(self.client.get(reverse("admin:catalog_product_add")).status_code, 200)
        self.assertEqual(
            self.client.get(reverse("admin:catalog_product_change", args=[product.pk])).status_code,
            200,
        )

    def test_product_search_and_filters_work(self):
        product = self.make_product(slug="searchable-product", name="Searchable Product", is_published=False)

        search = self.client.get(reverse("admin:catalog_product_changelist"), {"q": "Searchable"})
        filtered = self.client.get(
            reverse("admin:catalog_product_changelist"), {"is_published__exact": "0"}
        )

        self.assertEqual(search.status_code, 200)
        self.assertContains(search, product.name)
        self.assertEqual(filtered.status_code, 200)
        self.assertContains(filtered, product.name)

    def test_product_admin_has_safe_inline_editing_and_slug_prepopulation(self):
        self.assertEqual(ProductAdmin.list_editable, ("is_published", "in_stock", "is_featured", "is_bestseller", "is_new", "sort_order"))
        self.assertEqual(ProductAdmin.prepopulated_fields, {"slug": ("name",)})
        self.assertEqual(ProductAdmin.readonly_fields, ("created_at", "updated_at"))
        self.assertEqual(ProductAdmin.inlines, (ProductVariantInline, PublicCollectionInline))

    def test_product_json_lists_use_multiline_admin_fields(self):
        product = self.make_product(top_notes=["Bergamot", "Sea Salt"])
        form = ProductAdminForm(instance=product)

        self.assertEqual(form["top_notes"].value(), "Bergamot\nSea Salt")
        self.assertEqual(form.fields["top_notes"].clean(" Bergamot \n\n Sea Salt "), ["Bergamot", "Sea Salt"])

    def test_product_actions_change_queryset_values(self):
        product = self.make_product(is_published=True, is_featured=False)
        changelist = reverse("admin:catalog_product_changelist")

        response = self.client.post(
            changelist,
            {"action": "unpublish_selected", "_selected_action": [str(product.pk)]},
            follow=True,
        )
        product.refresh_from_db()
        self.assertEqual(response.status_code, 200)
        self.assertFalse(product.is_published)

        self.client.post(
            changelist,
            {"action": "mark_featured", "_selected_action": [str(product.pk)]},
            follow=True,
        )
        product.refresh_from_db()
        self.assertTrue(product.is_featured)

    def test_product_variant_inline_saves_valid_variant(self):
        product = self.make_product()
        inline = ProductVariantInline(Product, admin.site)
        formset_class = inline.get_formset(self.request, product)
        formset = formset_class(
            data={
                "variants-TOTAL_FORMS": "1",
                "variants-INITIAL_FORMS": "0",
                "variants-MIN_NUM_FORMS": "0",
                "variants-MAX_NUM_FORMS": "1000",
                "variants-0-label": "50ml",
                "variants-0-ml": "50",
                "variants-0-price": "34.90",
                "variants-0-compare_at_price": "",
                "variants-0-in_stock": "on",
                "variants-0-is_active": "on",
                "variants-0-sort_order": "1",
            },
            instance=product,
        )

        self.assertTrue(formset.is_valid(), formset.errors)
        formset.save()
        self.assertEqual(product.variants.count(), 1)

    def test_collection_membership_inline_saves_and_orders(self):
        product = self.make_product()
        collection = self.make_collection()
        inline = PublicCollectionInline(Product, admin.site)
        formset_class = inline.get_formset(self.request, product)
        formset = formset_class(
            data={
                "collectionproduct_set-TOTAL_FORMS": "1",
                "collectionproduct_set-INITIAL_FORMS": "0",
                "collectionproduct_set-MIN_NUM_FORMS": "0",
                "collectionproduct_set-MAX_NUM_FORMS": "1000",
                "collectionproduct_set-0-collection": str(collection.pk),
                "collectionproduct_set-0-sort_order": "3",
            },
            instance=product,
        )

        self.assertTrue(formset.is_valid(), formset.errors)
        formset.save()
        membership = CollectionProduct.objects.get(product=product, collection=collection)
        self.assertEqual(membership.sort_order, 3)

    def test_duplicate_public_membership_is_a_formset_validation_error(self):
        product = self.make_product()
        collection = self.make_collection()
        membership = CollectionProduct.objects.create(product=product, collection=collection)
        inline = PublicCollectionInline(Product, admin.site)
        formset_class = inline.get_formset(self.request, product)
        formset = formset_class(
            data={
                "collectionproduct_set-TOTAL_FORMS": "2",
                "collectionproduct_set-INITIAL_FORMS": "1",
                "collectionproduct_set-MIN_NUM_FORMS": "0",
                "collectionproduct_set-MAX_NUM_FORMS": "1000",
                "collectionproduct_set-0-id": str(membership.pk),
                "collectionproduct_set-0-collection": str(collection.pk),
                "collectionproduct_set-0-sort_order": "0",
                "collectionproduct_set-1-collection": str(collection.pk),
                "collectionproduct_set-1-sort_order": "1",
            },
            instance=product,
        )

        self.assertFalse(formset.is_valid())
        self.assertIn("duplicate", str(formset.errors).lower() + str(formset.non_form_errors()).lower())

    def test_collection_admin_pages_and_configuration_work(self):
        collection = self.make_collection()
        self.assertEqual(self.client.get(reverse("admin:catalog_collection_changelist")).status_code, 200)
        self.assertEqual(self.client.get(reverse("admin:catalog_collection_add")).status_code, 200)
        self.assertEqual(
            self.client.get(reverse("admin:catalog_collection_change", args=[collection.pk])).status_code,
            200,
        )
        self.assertEqual(CollectionMembershipInline.fk_name, "collection")

    def test_standalone_variant_and_membership_admin_pages_load(self):
        product = self.make_product()
        variant = ProductVariant.objects.create(product=product, label="50ml", ml=50, price=Decimal("34.90"))
        collection = self.make_collection()
        membership = CollectionProduct.objects.create(collection=collection, product=product)

        self.assertEqual(
            self.client.get(reverse("admin:catalog_productvariant_change", args=[variant.pk])).status_code,
            200,
        )
        self.assertEqual(
            self.client.get(reverse("admin:catalog_collectionproduct_change", args=[membership.pk])).status_code,
            200,
        )
