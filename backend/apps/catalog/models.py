from django.core.validators import MinValueValidator
from django.db import models
from django.db.models import F, Q

from .validators import validate_string_list


class Product(models.Model):
    legacy_id = models.CharField(max_length=32, unique=True, null=True, blank=True)
    slug = models.SlugField(max_length=160, unique=True)
    name = models.CharField(max_length=255)
    tagline = models.CharField(max_length=255, blank=True, default="")
    category = models.CharField(max_length=160, blank=True, default="")
    legacy_collection_label = models.CharField(max_length=160, blank=True, default="")
    scent_family = models.CharField(max_length=160, blank=True, default="")
    concentration = models.CharField(max_length=160, blank=True, default="")
    currency = models.CharField(max_length=3, default="BDT")
    short_description = models.TextField(blank=True, default="")
    full_description = models.TextField(blank=True, default="")
    top_notes = models.JSONField(default=list, validators=[validate_string_list])
    heart_notes = models.JSONField(default=list, validators=[validate_string_list])
    base_notes = models.JSONField(default=list, validators=[validate_string_list])
    longevity = models.CharField(max_length=80, blank=True, default="")
    sillage = models.CharField(max_length=80, blank=True, default="")
    seasons = models.JSONField(default=list, validators=[validate_string_list])
    occasions = models.JSONField(default=list, validators=[validate_string_list])
    style_tags = models.JSONField(default=list, validators=[validate_string_list])
    in_stock = models.BooleanField(default=True)
    is_published = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    is_bestseller = models.BooleanField(default=False)
    is_new = models.BooleanField(default=False)
    sort_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["sort_order", "id"]
        indexes = [
            models.Index(fields=["is_published", "sort_order"], name="catalog_prod_pub_order_idx"),
            models.Index(
                fields=["is_featured", "is_published", "sort_order"],
                name="catalog_prod_feat_idx",
            ),
            models.Index(
                fields=["is_bestseller", "is_published", "sort_order"],
                name="catalog_prod_best_idx",
            ),
            models.Index(fields=["is_new", "is_published", "sort_order"], name="catalog_prod_new_idx"),
            models.Index(
                fields=["scent_family", "is_published", "sort_order"],
                name="catalog_prod_family_idx",
            ),
        ]

    def __str__(self):
        return self.name


class ProductVariant(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="variants")
    label = models.CharField(max_length=32)
    ml = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    compare_at_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(0)],
    )
    in_stock = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["product_id", "sort_order", "id"]
        constraints = [
            models.CheckConstraint(condition=Q(ml__gt=0), name="catalog_variant_ml_positive"),
            models.CheckConstraint(condition=Q(price__gte=0), name="catalog_variant_price_nonnegative"),
            models.CheckConstraint(
                condition=Q(compare_at_price__isnull=True) | Q(compare_at_price__gte=F("price")),
                name="catalog_variant_compare_gte_price",
            ),
            models.UniqueConstraint(fields=["product", "label"], name="catalog_variant_product_label_uniq"),
        ]
        indexes = [
            models.Index(fields=["product", "is_active", "sort_order"], name="catalog_variant_active_idx")
        ]


class Collection(models.Model):
    slug = models.SlugField(max_length=160, unique=True)
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, default="")
    is_published = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)
    products = models.ManyToManyField(
        Product,
        through="CollectionProduct",
        related_name="collections",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["sort_order", "id"]
        indexes = [
            models.Index(fields=["is_published", "sort_order"], name="catalog_coll_pub_order_idx")
        ]

    def __str__(self):
        return self.name


class CollectionProduct(models.Model):
    collection = models.ForeignKey(Collection, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["collection_id", "sort_order", "id"]
        constraints = [
            models.UniqueConstraint(
                fields=["collection", "product"],
                name="catalog_collection_product_uniq",
            )
        ]
        indexes = [
            models.Index(fields=["collection", "sort_order"], name="catalog_coll_prod_order_idx")
        ]
