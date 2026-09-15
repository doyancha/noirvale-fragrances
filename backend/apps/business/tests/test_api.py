from django.test import TestCase
from django.urls import reverse

from apps.business.models import BusinessSettings


class BusinessSettingsApiTests(TestCase):
    def test_get_has_exact_public_nested_contract(self):
        response = self.client.get(reverse("business_api:business-settings"))
        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertEqual(set(payload), {"contact", "social", "business", "customer_care"})
        self.assertNotIn("id", payload)
        self.assertNotIn("whatsapp", payload)
        self.assertNotIn("whatsapp", payload["contact"])
        self.assertEqual(payload["contact"]["email"], "contact@yourdomain.com")
        self.assertEqual(payload["customer_care"]["order_confirmation_fields"], [
            "fragrance", "bottle size", "price", "delivery charge", "delivery location",
            "customer contact details", "payment / COD arrangement",
        ])

    def test_endpoint_is_read_only(self):
        url = reverse("business_api:business-settings")
        for method in ("post", "put", "patch", "delete"):
            response = getattr(self.client, method)(url, data={})
            self.assertEqual(response.status_code, 405, method)

    def test_missing_singleton_is_controlled_error(self):
        settings = BusinessSettings.objects.get()
        BusinessSettings.objects.filter(pk=settings.pk)._raw_delete(using="default")
        response = self.client.get(reverse("business_api:business-settings"))
        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.json(), {"detail": "Business settings are temporarily unavailable."})

    def test_query_count_is_one(self):
        with self.assertNumQueries(1):
            response = self.client.get(reverse("business_api:business-settings"))
        self.assertEqual(response.status_code, 200)
