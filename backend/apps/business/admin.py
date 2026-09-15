from django.contrib import admin

from .models import BusinessSettings


@admin.register(BusinessSettings)
class BusinessSettingsAdmin(admin.ModelAdmin):
    fieldsets = (
        ("Contact", {"fields": ("public_phone", "business_email", "website_url")} ),
        ("Social Media", {"fields": ("facebook_url", "instagram_url", "pinterest_url")} ),
        ("Business Operations", {"fields": ("business_hours", "closed_day", "business_location", "service_area", "delivery_text")} ),
        ("Delivery", {"fields": ("inside_dhaka_estimate", "inside_dhaka_charge", "outside_dhaka_estimate", "outside_dhaka_charge", "delivery_timing_note", "cod_status", "advance_payment_note", "order_confirmation_note", "delivery_summary")} ),
        ("Returns", {"fields": ("return_request_window", "return_eligible", "return_notes")} ),
        ("Exchanges", {"fields": ("exchange_request_window", "exchange_eligible", "exchange_notes")} ),
        ("Damaged / Wrong Product", {"fields": ("damaged_contact_window", "damaged_evidence", "damaged_preferred_resolution", "damaged_fallback")} ),
        ("Fragrance Guidance", {"fields": ("fragrance_performance_guidance", "fragrance_storage_guidance")} ),
        ("Order Confirmation", {"fields": ("order_confirmation_fields",)}),
        ("Audit", {"fields": ("singleton_key", "created_at", "updated_at")} ),
    )
    readonly_fields = ("singleton_key", "created_at", "updated_at")

    def has_add_permission(self, request):
        return not BusinessSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False
