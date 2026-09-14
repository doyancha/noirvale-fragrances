from django.contrib import admin, messages
from django.core.exceptions import ValidationError
from django.db.models import Count
from django.forms.models import BaseInlineFormSet

from .forms import ProductAdminForm
from .models import Collection, CollectionProduct, Product, ProductVariant


class PublicCollectionMembershipFormSet(BaseInlineFormSet):
    def clean(self):
        super().clean()
        seen = set()
        for form in self.forms:
            if not hasattr(form, "cleaned_data") or not form.cleaned_data or form.cleaned_data.get("DELETE"):
                continue
            collection = form.cleaned_data.get("collection")
            if collection and collection.pk in seen:
                raise ValidationError("A product can appear only once in each public collection.")
            if collection:
                seen.add(collection.pk)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    form = ProductAdminForm
    list_display = (
        "name",
        "slug",
        "is_published",
        "in_stock",
        "is_featured",
        "is_bestseller",
        "is_new",
        "variant_count",
        "public_collection_count",
        "sort_order",
        "updated_at",
    )
    list_editable = ("is_published", "in_stock", "is_featured", "is_bestseller", "is_new", "sort_order")
    list_filter = (
        "is_published",
        "in_stock",
        "is_featured",
        "is_bestseller",
        "is_new",
        "scent_family",
        "concentration",
        "currency",
    )
    search_fields = (
        "name",
        "slug",
        "legacy_id",
        "tagline",
        "category",
        "scent_family",
        "concentration",
        "legacy_collection_label",
    )
    ordering = ("sort_order", "id")
    list_per_page = 50
    prepopulated_fields = {"slug": ("name",)}
    readonly_fields = ("created_at", "updated_at")

    fieldsets = (
        ("Identity", {"fields": ("name", "slug", "tagline", "category")} ),
        (
            "Fragrance Profile",
            {
                "fields": (
                    "scent_family",
                    "concentration",
                    "longevity",
                    "sillage",
                    "top_notes",
                    "heart_notes",
                    "base_notes",
                    "seasons",
                    "occasions",
                    "style_tags",
                )
            },
        ),
        ("Description", {"fields": ("short_description", "full_description")} ),
        ("Commerce", {"fields": ("currency", "in_stock")} ),
        (
            "Merchandising & Publication",
            {"fields": ("is_published", "is_featured", "is_bestseller", "is_new", "sort_order")},
        ),
        (
            "Legacy / Migration Metadata",
            {
                "fields": ("legacy_id", "legacy_collection_label"),
                "description": (
                    "Legacy collection label is compatibility metadata only. "
                    "Use the Public Collections inline below for canonical storefront membership."
                ),
            },
        ),
        ("Audit", {"fields": ("created_at", "updated_at")} ),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).annotate(
            _variant_count=Count("variants", distinct=True),
            _public_collection_count=Count("collections", distinct=True),
        )

    @admin.display(description="Variants", ordering="_variant_count")
    def variant_count(self, obj):
        return obj._variant_count

    @admin.display(description="Public collections", ordering="_public_collection_count")
    def public_collection_count(self, obj):
        return obj._public_collection_count

    @admin.action(description="Publish selected products")
    def publish_selected(self, request, queryset):
        updated = queryset.update(is_published=True)
        self.message_user(request, f"{updated} product(s) published.", messages.SUCCESS)

    @admin.action(description="Unpublish selected products")
    def unpublish_selected(self, request, queryset):
        updated = queryset.update(is_published=False)
        self.message_user(request, f"{updated} product(s) unpublished.", messages.SUCCESS)

    @admin.action(description="Mark selected as featured")
    def mark_featured(self, request, queryset):
        updated = queryset.update(is_featured=True)
        self.message_user(request, f"{updated} product(s) marked as featured.", messages.SUCCESS)

    @admin.action(description="Remove featured status")
    def unmark_featured(self, request, queryset):
        updated = queryset.update(is_featured=False)
        self.message_user(request, f"{updated} product(s) removed from featured.", messages.SUCCESS)

    @admin.action(description="Mark selected as best sellers")
    def mark_bestseller(self, request, queryset):
        updated = queryset.update(is_bestseller=True)
        self.message_user(request, f"{updated} product(s) marked as best sellers.", messages.SUCCESS)

    @admin.action(description="Remove best-seller status")
    def unmark_bestseller(self, request, queryset):
        updated = queryset.update(is_bestseller=False)
        self.message_user(request, f"{updated} product(s) removed from best sellers.", messages.SUCCESS)

    @admin.action(description="Mark selected as new arrivals")
    def mark_new(self, request, queryset):
        updated = queryset.update(is_new=True)
        self.message_user(request, f"{updated} product(s) marked as new arrivals.", messages.SUCCESS)

    @admin.action(description="Remove new-arrival status")
    def unmark_new(self, request, queryset):
        updated = queryset.update(is_new=False)
        self.message_user(request, f"{updated} product(s) removed from new arrivals.", messages.SUCCESS)

    actions = (
        "publish_selected",
        "unpublish_selected",
        "mark_featured",
        "unmark_featured",
        "mark_bestseller",
        "unmark_bestseller",
        "mark_new",
        "unmark_new",
    )


class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 0
    ordering = ("sort_order", "id")
    fields = ("label", "ml", "price", "compare_at_price", "in_stock", "is_active", "sort_order")
    verbose_name = "Variant"
    verbose_name_plural = "Variants"


class PublicCollectionInline(admin.TabularInline):
    model = CollectionProduct
    fk_name = "product"
    extra = 0
    ordering = ("sort_order", "id")
    fields = ("collection", "sort_order")
    autocomplete_fields = ("collection",)
    formset = PublicCollectionMembershipFormSet
    verbose_name = "Public Collection"
    verbose_name_plural = "Public Collections"


ProductAdmin.inlines = (ProductVariantInline, PublicCollectionInline)


@admin.register(ProductVariant)
class ProductVariantAdmin(admin.ModelAdmin):
    list_display = (
        "product",
        "label",
        "ml",
        "price",
        "compare_at_price",
        "in_stock",
        "is_active",
        "sort_order",
        "updated_at",
    )
    list_filter = ("is_active", "in_stock")
    search_fields = ("product__name", "product__slug", "label")
    list_select_related = ("product",)
    autocomplete_fields = ("product",)
    ordering = ("product", "sort_order", "id")
    list_per_page = 50
    readonly_fields = ("created_at", "updated_at")
    fieldsets = (
        ("Variant", {"fields": ("product", "label", "ml", "sort_order")} ),
        ("Pricing", {"fields": ("price", "compare_at_price")} ),
        ("Availability", {"fields": ("in_stock", "is_active")} ),
        ("Audit", {"fields": ("created_at", "updated_at")} ),
    )


class CollectionMembershipInline(admin.TabularInline):
    model = CollectionProduct
    fk_name = "collection"
    extra = 0
    ordering = ("sort_order", "id")
    fields = ("product", "sort_order")
    autocomplete_fields = ("product",)
    verbose_name = "Public Collection Product"
    verbose_name_plural = "Public Collection Products"


@admin.register(Collection)
class CollectionAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "is_published", "product_count", "sort_order", "updated_at")
    list_editable = ("is_published", "sort_order")
    list_filter = ("is_published",)
    search_fields = ("name", "slug", "description")
    ordering = ("sort_order", "id")
    list_per_page = 50
    prepopulated_fields = {"slug": ("name",)}
    readonly_fields = ("created_at", "updated_at")
    inlines = (CollectionMembershipInline,)
    fieldsets = (
        ("Identity", {"fields": ("name", "slug")} ),
        ("Content", {"fields": ("description",)}),
        ("Publication & Ordering", {"fields": ("is_published", "sort_order")} ),
        ("Audit", {"fields": ("created_at", "updated_at")} ),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).annotate(_product_count=Count("products", distinct=True))

    @admin.display(description="Products", ordering="_product_count")
    def product_count(self, obj):
        return obj._product_count


@admin.register(CollectionProduct)
class CollectionProductAdmin(admin.ModelAdmin):
    list_display = ("collection", "product", "sort_order")
    search_fields = ("collection__name", "collection__slug", "product__name", "product__slug")
    list_select_related = ("collection", "product")
    autocomplete_fields = ("collection", "product")
    ordering = ("collection", "sort_order", "id")
    list_per_page = 50


admin.site.site_header = "NOIRVALE Administration"
admin.site.site_title = "NOIRVALE Admin"
admin.site.index_title = "Catalogue Management"
