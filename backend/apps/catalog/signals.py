from django.db.models.signals import pre_delete
from django.dispatch import receiver

from .media import schedule_image_cleanup
from .models import CollectionImage, ProductImage


@receiver(pre_delete, sender=ProductImage)
def schedule_product_image_cleanup(sender, instance, **kwargs):
    if instance.cloudinary_public_id:
        schedule_image_cleanup(instance.cloudinary_public_id, "ProductImage", instance.pk)


@receiver(pre_delete, sender=CollectionImage)
def schedule_collection_image_cleanup(sender, instance, **kwargs):
    if instance.cloudinary_public_id:
        schedule_image_cleanup(instance.cloudinary_public_id, "CollectionImage", instance.pk)
