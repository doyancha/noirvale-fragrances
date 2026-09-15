from django.urls import path

from .views import BusinessSettingsView

app_name = "business_api"

urlpatterns = [
    path("business-settings/", BusinessSettingsView.as_view(), name="business-settings"),
]
