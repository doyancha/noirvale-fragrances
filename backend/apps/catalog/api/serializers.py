from rest_framework import serializers

from apps.catalog.models import CollectionImage, ProductImage, ProductVariant


class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = ("label", "ml", "price", "compare_at_price", "in_stock")


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ("role", "secure_url", "alt_text", "sort_order", "format", "width", "height")


class CollectionImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollectionImage
        fields = ("secure_url", "alt_text", "format", "width", "height")


class CollectionReferenceSerializer(serializers.Serializer):
    slug = serializers.CharField()
    name = serializers.CharField()


class ProductSummarySerializer(serializers.Serializer):
    slug = serializers.CharField()
    name = serializers.CharField()
    tagline = serializers.CharField()
    category = serializers.CharField()
    scent_family = serializers.CharField()
    concentration = serializers.CharField()
    currency = serializers.CharField()
    short_description = serializers.CharField()
    longevity = serializers.CharField()
    sillage = serializers.CharField()
    seasons = serializers.ListField(child=serializers.CharField())
    occasions = serializers.ListField(child=serializers.CharField())
    style_tags = serializers.ListField(child=serializers.CharField())
    in_stock = serializers.BooleanField()
    is_featured = serializers.BooleanField()
    is_bestseller = serializers.BooleanField()
    is_new = serializers.BooleanField()
    variants = serializers.SerializerMethodField()
    primary_image = serializers.SerializerMethodField()

    def get_variants(self, obj):
        return ProductVariantSerializer(getattr(obj, "active_variants", ()), many=True).data

    def get_primary_image(self, obj):
        image = next(
            (image for image in getattr(obj, "public_images", ()) if image.role == ProductImage.PRIMARY),
            None,
        )
        return ProductImageSerializer(image).data if image else None


class ProductListSerializer(ProductSummarySerializer):
    pass


class ProductDetailSerializer(ProductSummarySerializer):
    full_description = serializers.CharField()
    top_notes = serializers.ListField(child=serializers.CharField())
    heart_notes = serializers.ListField(child=serializers.CharField())
    base_notes = serializers.ListField(child=serializers.CharField())
    images = serializers.SerializerMethodField()
    collections = serializers.SerializerMethodField()

    def get_images(self, obj):
        return ProductImageSerializer(getattr(obj, "public_images", ()), many=True).data

    def get_collections(self, obj):
        memberships = getattr(obj, "public_memberships", ())
        return CollectionReferenceSerializer([membership.collection for membership in memberships], many=True).data


class CollectionListSerializer(serializers.Serializer):
    slug = serializers.CharField()
    name = serializers.CharField()
    description = serializers.CharField()
    image = serializers.SerializerMethodField()

    def get_image(self, obj):
        image = getattr(obj, "image", None)
        return CollectionImageSerializer(image).data if image else None


class CollectionDetailSerializer(CollectionListSerializer):
    products = serializers.SerializerMethodField()

    def get_products(self, obj):
        memberships = getattr(obj, "public_memberships", ())
        return ProductSummarySerializer([membership.product for membership in memberships], many=True).data
