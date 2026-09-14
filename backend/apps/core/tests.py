from django.test import TestCase


class HealthEndpointTests(TestCase):
    def test_health_endpoint_returns_expected_json(self):
        response = self.client.get("/health/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response["Content-Type"], "application/json")
        self.assertEqual(response.json(), {"status": "ok", "service": "noirvale-backend"})

    def test_admin_route_is_registered(self):
        response = self.client.get("/admin/")

        self.assertIn(response.status_code, {200, 301, 302})
