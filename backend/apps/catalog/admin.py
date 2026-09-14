from django.contrib import admin, messages
from django.core.exceptions import ValidationError
from django.db.models import Count
from django.forms.models import BaseInlineFormSet
from django.utils.html import format_html

from .forms import CollectionImageAdminForm, ProductAdminForm, ProductImageAdminForm
from .models import Collection, CollectionImage, CollectionProduct, Product, ProductImage, ProductVariant


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


class ProductImageFormSet(BaseInlineFormSet):
    def clean(self):
        super().clean()
        primary_count = 0
        for form in self.forms:
            if not hasattr(form, "cleaned_data") or not form.cleaned_data or form.cleaned_data.get("DELETE"):
                continue
            if form.cleaned_data.get("role") == ProductImage.PRIMARY:
                primary_count += 1
        if primary_count > 1:
            raise ValidationError("A product can have only one primary image.")


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    form = ProductImageAdminForm
    formset = ProductImageFormSet
    extra = 1
    fields = ("preview", "upload", "role", "alt_text", "sort_order")
    readonly_fields = ("preview",)
    ordering = ("sort_order", "id")
    verbose_name = "Product Image"
    verbose_name_plural = "Product Images"

    def get_formset(self, request, obj=None, **kwargs):
        kwargs["fields"] = ("product", "role", "alt_text", "sort_order")
        return super().get_formset(request, obj, **kwargs)

    @admin.display(description="Preview")
    def preview(self, obj):
        if not obj.secure_url:
            return "No image uploaded"
        return format_html(
            '<img src="{}" alt="{}" style="width:100px;height:100px;object-fit:contain;" />',
            obj.secure_url,
            obj.alt_text or obj.product.name,
        )


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


ProductAdmin.inlines = (ProductVariantInline, PublicCollectionInline, ProductImageInline)


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


class CollectionImageInline(admin.StackedInline):
    model = CollectionImage
    form = CollectionImageAdminForm
    extra = 1
    max_num = 1
    can_delete = True
    fields = ("preview", "upload", "alt_text")
    readonly_fields = ("preview",)
    verbose_name = "Collection Image"
    verbose_name_plural = "Collection Image"

    def get_formset(self, request, obj=None, **kwargs):
        kwargs["fields"] = ("collection", "alt_text")
        return super().get_formset(request, obj, **kwargs)

    @admin.display(description="Preview")
    def preview(self, obj):
        if not obj.secure_url:
            return "No image uploaded"
        return format_html(
            '<img src="{}" alt="{}" style="width:120px;height:80px;object-fit:contain;" />',
            obj.secure_url,
            obj.alt_text or obj.collection.name,
        )


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
    inlines = (CollectionMembershipInline, CollectionImageInline)
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


class ProductImageAdmin(admin.ModelAdmin):
    form = ProductImageAdminForm
    list_display = ("preview", "product", "role", "format", "dimensions", "byte_size", "sort_order", "updated_at")
    list_filter = ("role", "format")
    search_fields = ("product__name", "product__slug", "alt_text", "cloudinary_public_id")
    list_select_related = ("product",)
    autocomplete_fields = ("product",)
    ordering = ("product", "sort_order", "id")
    list_per_page = 50
    readonly_fields = (
        "preview",
        "storage_key",
        "cloudinary_public_id",
        "secure_url",
        "asset_id",
        "format",
        "width",
        "height",
        "byte_size",
        "cloudinary_version",
        "created_at",
        "updated_at",
    )
    fieldsets = (
        ("Media", {"fields": ("product", "upload", "role", "alt_text", "sort_order", "preview")} ),
        (
            "Provider Metadata",
            {
                "fields": (
                    "storage_key",
                    "cloudinary_public_id",
                    "secure_url",
                    "asset_id",
                    "format",
                    "width",
                    "height",
                    "byte_size",
                    "cloudinary_version",
                )
            },
        ),
        ("Audit", {"fields": ("created_at", "updated_at")} ),
    )

    def get_form(self, request, obj=None, change=False, **kwargs):
        kwargs["fields"] = ("product", "role", "alt_text", "sort_order")
        return super().get_form(request, obj, change=change, **kwargs)

    @admin.display(description="Preview")
    def preview(self, obj):
        if not obj.secure_url:
            return "No image uploaded"
        return format_html(
            '<img src="{}" alt="{}" style="width:100px;height:100px;object-fit:contain;" />',
            obj.secure_url,
            obj.alt_text or obj.product.name,
        )

    @admin.display(description="Dimensions")
    def dimensions(self, obj):
        if not obj.width or not obj.height:
            return "—"
        return f"{obj.width} × {obj.height}"


class CollectionImageAdmin(admin.ModelAdmin):
    form = CollectionImageAdminForm
    list_display = ("preview", "collection", "format", "dimensions", "byte_size", "updated_at")
    list_filter = ("format",)
    search_fields = ("collection__name", "collection__slug", "alt_text", "cloudinary_public_id")
    list_select_related = ("collection",)
    autocomplete_fields = ("collection",)
    ordering = ("collection", "id")
    list_per_page = 50
    readonly_fields = (
        "preview",
        "storage_key",
        "cloudinary_public_id",
        "secure_url",
        "asset_id",
        "format",
        "width",
        "height",
        "byte_size",
        "cloudinary_version",
        "created_at",
        "updated_at",
    )
    fieldsets = (
        ("Media", {"fields": ("collection", "upload", "alt_text", "preview")} ),
        (
            "Provider Metadata",
            {
                "fields": (
                    "storage_key",
                    "cloudinary_public_id",
                    "secure_url",
                    "asset_id",
                    "format",
                    "width",
                    "height",
                    "byte_size",
                    "cloudinary_version",
                )
            },
        ),
        ("Audit", {"fields": ("created_at", "updated_at")} ),
    )

    def get_form(self, request, obj=None, change=False, **kwargs):
        kwargs["fields"] = ("collection", "alt_text")
        return super().get_form(request, obj, change=change, **kwargs)

    @admin.display(description="Preview")
    def preview(self, obj):
        if not obj.secure_url:
            return "No image uploaded"
        return format_html(
            '<img src="{}" alt="{}" style="width:120px;height:80px;object-fit:contain;" />',
            obj.secure_url,
            obj.alt_text or obj.collection.name,
        )

    @admin.display(description="Dimensions")
    def dimensions(self, obj):
        if not obj.width or not obj.height:
            return "—"
        return f"{obj.width} × {obj.height}"


admin.site.register(ProductImage, ProductImageAdmin)
admin.site.register(CollectionImage, CollectionImageAdmin)


admin.site.site_header = "NOIRVALE Administration"
admin.site.site_title = "NOIRVALE Admin"
admin.site.index_title = "Catalogue Management"
