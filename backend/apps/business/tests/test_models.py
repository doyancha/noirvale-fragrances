from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.test import TestCase

from apps.business.models import BusinessSettings


class BusinessSettingsModelTests(TestCase):
    def test_seeded_singleton_exists(self):
        settings = BusinessSettings.objects.get()
        self.assertEqual(BusinessSettings.objects.count(), 1)
        self.assertEqual(settings.singleton_key, 1)
        self.assertEqual(settings.service_area, "Nationwide Bangladesh")

    def test_second_row_is_rejected(self):
        with self.assertRaises(IntegrityError):
            BusinessSettings.objects.bulk_create([BusinessSettings(public_phone="another")])

    def test_invalid_order_confirmation_fields_are_rejected(self):
        settings = BusinessSettings.objects.get()
        settings.order_confirmation_fields = {"field": "value"}
        with self.assertRaises(ValidationError):
            settings.full_clean()

    def test_invalid_email_and_url_are_rejected(self):
        settings = BusinessSettings.objects.get()
        settings.business_email = "not-an-email"
        settings.website_url = "not-a-url"
        with self.assertRaises(ValidationError) as error:
            settings.full_clean()
        self.assertIn("business_email", error.exception.message_dict)
        self.assertIn("website_url", error.exception.message_dict)

    def test_delete_is_denied(self):
        with self.assertRaises(ValidationError):
            BusinessSettings.objects.get().delete()

    def test_string_representation(self):
        self.assertEqual(str(BusinessSettings.objects.get()), "Business Settings")
