from django.core.exceptions import ValidationError
from django.db import models
from django.db.models import Q

from apps.catalog.validators import validate_string_list


class BusinessSettings(models.Model):
    singleton_key = models.PositiveSmallIntegerField(default=1, unique=True, editable=False)

    public_phone = models.CharField(max_length=64, blank=True, default="")
    business_email = models.EmailField(blank=True, default="")
    website_url = models.URLField(blank=True, default="")

    facebook_url = models.URLField(blank=True, default="")
    instagram_url = models.URLField(blank=True, default="")
    pinterest_url = models.URLField(blank=True, default="")

    business_hours = models.CharField(max_length=255, blank=True, default="")
    closed_day = models.CharField(max_length=64, blank=True, default="")
    business_location = models.CharField(max_length=255, blank=True, default="")
    service_area = models.CharField(max_length=255, blank=True, default="")
    delivery_text = models.TextField(blank=True, default="")

    inside_dhaka_estimate = models.CharField(max_length=255, blank=True, default="")
    inside_dhaka_charge = models.CharField(max_length=128, blank=True, default="")
    outside_dhaka_estimate = models.CharField(max_length=255, blank=True, default="")
    outside_dhaka_charge = models.CharField(max_length=128, blank=True, default="")
    delivery_timing_note = models.TextField(blank=True, default="")
    cod_status = models.CharField(max_length=255, blank=True, default="")
    advance_payment_note = models.TextField(blank=True, default="")
    order_confirmation_note = models.TextField(blank=True, default="")
    delivery_summary = models.TextField(blank=True, default="")

    return_request_window = models.CharField(max_length=255, blank=True, default="")
    return_eligible = models.TextField(blank=True, default="")
    return_notes = models.TextField(blank=True, default="")

    exchange_request_window = models.CharField(max_length=255, blank=True, default="")
    exchange_eligible = models.TextField(blank=True, default="")
    exchange_notes = models.TextField(blank=True, default="")

    damaged_contact_window = models.CharField(max_length=255, blank=True, default="")
    damaged_evidence = models.TextField(blank=True, default="")
    damaged_preferred_resolution = models.TextField(blank=True, default="")
    damaged_fallback = models.TextField(blank=True, default="")

    fragrance_performance_guidance = models.TextField(blank=True, default="")
    fragrance_storage_guidance = models.TextField(blank=True, default="")
    order_confirmation_fields = models.JSONField(default=list, validators=[validate_string_list])

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.CheckConstraint(
                condition=Q(singleton_key=1),
                name="business_settings_singleton_key_is_one",
            )
        ]
        verbose_name = "Business Settings"
        verbose_name_plural = "Business Settings"

    def clean(self):
        super().clean()
        if self.singleton_key != 1:
            raise ValidationError({"singleton_key": "Business Settings must use singleton key 1."})

    def save(self, *args, **kwargs):
        self.singleton_key = 1
        self.full_clean()
        return super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        raise ValidationError("The canonical Business Settings record cannot be deleted.")

    def __str__(self):
        return "Business Settings"
