from django.db.models import Prefetch
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.permissions import AllowAny

from apps.catalog.models import Collection, CollectionProduct, Product, ProductImage, ProductVariant

from .serializers import (
    CollectionDetailSerializer,
    CollectionListSerializer,
    ProductDetailSerializer,
    ProductListSerializer,
)


def active_variants_prefetch():
    return Prefetch(
        "variants",
        queryset=ProductVariant.objects.filter(is_active=True).order_by("sort_order", "id"),
        to_attr="active_variants",
    )


def product_images_prefetch():
    return Prefetch(
        "images",
        queryset=ProductImage.objects.order_by("sort_order", "id"),
        to_attr="public_images",
    )


def product_prefetches():
    return (active_variants_prefetch(), product_images_prefetch())


def membership_product_prefetches():
    return (
        Prefetch(
            "product__variants",
            queryset=ProductVariant.objects.filter(is_active=True).order_by("sort_order", "id"),
            to_attr="active_variants",
        ),
        Prefetch(
            "product__images",
            queryset=ProductImage.objects.order_by("sort_order", "id"),
            to_attr="public_images",
        ),
    )


class ProductListView(ListAPIView):
    permission_classes = (AllowAny,)
    serializer_class = ProductListSerializer

    def get_queryset(self):
        return Product.objects.filter(is_published=True).order_by("sort_order", "id").prefetch_related(
            *product_prefetches()
        )


class ProductDetailView(RetrieveAPIView):
    permission_classes = (AllowAny,)
    serializer_class = ProductDetailSerializer
    lookup_field = "slug"

    def get_queryset(self):
        public_memberships = CollectionProduct.objects.filter(
            collection__is_published=True
        ).select_related("collection").order_by("sort_order", "collection__sort_order", "collection_id", "id")
        return Product.objects.filter(is_published=True).order_by("sort_order", "id").prefetch_related(
            *product_prefetches(),
            Prefetch("collectionproduct_set", queryset=public_memberships, to_attr="public_memberships"),
        )


class CollectionListView(ListAPIView):
    permission_classes = (AllowAny,)
    serializer_class = CollectionListSerializer

    def get_queryset(self):
        return Collection.objects.filter(is_published=True).order_by("sort_order", "id").select_related("image")


class CollectionDetailView(RetrieveAPIView):
    permission_classes = (AllowAny,)
    serializer_class = CollectionDetailSerializer
    lookup_field = "slug"

    def get_queryset(self):
        public_memberships = CollectionProduct.objects.filter(
            product__is_published=True
        ).select_related("product").prefetch_related(*membership_product_prefetches()).order_by(
            "sort_order", "product__sort_order", "product_id", "id"
        )
        return Collection.objects.filter(is_published=True).order_by("sort_order", "id").select_related(
            "image"
        ).prefetch_related(Prefetch("collectionproduct_set", queryset=public_memberships, to_attr="public_memberships"))
