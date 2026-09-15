from django.contrib import admin
from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

from apps.business.admin import BusinessSettingsAdmin
from apps.business.models import BusinessSettings


class BusinessSettingsAdminTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = get_user_model().objects.create_superuser(
            username="business-admin",
            email="business-admin@example.com",
            password="business-admin-password",
        )

    def setUp(self):
        self.client.force_login(self.user)
        self.settings = BusinessSettings.objects.get()

    def test_singleton_admin_entry_and_edit_page_load(self):
        self.assertEqual(self.client.get(reverse("admin:business_businesssettings_changelist")).status_code, 200)
        self.assertEqual(self.client.get(reverse("admin:business_businesssettings_change", args=[self.settings.pk])).status_code, 200)

    def test_add_is_disabled_and_delete_is_denied(self):
        model_admin = admin.site._registry[BusinessSettings]
        self.assertFalse(model_admin.has_add_permission(None))
        self.assertFalse(model_admin.has_delete_permission(None, self.settings))
        self.assertEqual(self.client.get(reverse("admin:business_businesssettings_add")).status_code, 403)

    def test_authenticated_admin_post_updates_settings(self):
        response = self.client.post(
            reverse("admin:business_businesssettings_change", args=[self.settings.pk]),
            {
                "public_phone": self.settings.public_phone,
                "business_email": self.settings.business_email,
                "website_url": self.settings.website_url,
                "facebook_url": self.settings.facebook_url,
                "instagram_url": self.settings.instagram_url,
                "pinterest_url": self.settings.pinterest_url,
                "business_hours": "Saturday–Thursday, 11:00 AM–8:00 PM",
                "closed_day": self.settings.closed_day,
                "business_location": self.settings.business_location,
                "service_area": self.settings.service_area,
                "delivery_text": self.settings.delivery_text,
                "inside_dhaka_estimate": self.settings.inside_dhaka_estimate,
                "inside_dhaka_charge": self.settings.inside_dhaka_charge,
                "outside_dhaka_estimate": self.settings.outside_dhaka_estimate,
                "outside_dhaka_charge": self.settings.outside_dhaka_charge,
                "delivery_timing_note": self.settings.delivery_timing_note,
                "cod_status": self.settings.cod_status,
                "advance_payment_note": self.settings.advance_payment_note,
                "order_confirmation_note": self.settings.order_confirmation_note,
                "delivery_summary": self.settings.delivery_summary,
                "return_request_window": self.settings.return_request_window,
                "return_eligible": self.settings.return_eligible,
                "return_notes": self.settings.return_notes,
                "exchange_request_window": self.settings.exchange_request_window,
                "exchange_eligible": self.settings.exchange_eligible,
                "exchange_notes": self.settings.exchange_notes,
                "damaged_contact_window": self.settings.damaged_contact_window,
                "damaged_evidence": self.settings.damaged_evidence,
                "damaged_preferred_resolution": self.settings.damaged_preferred_resolution,
                "damaged_fallback": self.settings.damaged_fallback,
                "fragrance_performance_guidance": self.settings.fragrance_performance_guidance,
                "fragrance_storage_guidance": self.settings.fragrance_storage_guidance,
                "order_confirmation_fields": '["fragrance", "bottle size"]',
                "_save": "Save",
            },
        )
        self.assertEqual(response.status_code, 302)
        self.settings.refresh_from_db()
        self.assertEqual(self.settings.business_hours, "Saturday–Thursday, 11:00 AM–8:00 PM")
