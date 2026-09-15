from django.db import migrations, models
import apps.catalog.validators


class Migration(migrations.Migration):
    initial = True
    dependencies = []
    operations = [
        migrations.CreateModel(
            name="BusinessSettings",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("singleton_key", models.PositiveSmallIntegerField(default=1, editable=False, unique=True)),
                ("public_phone", models.CharField(blank=True, default="", max_length=64)),
                ("business_email", models.EmailField(blank=True, default="", max_length=254)),
                ("website_url", models.URLField(blank=True, default="")),
                ("facebook_url", models.URLField(blank=True, default="")),
                ("instagram_url", models.URLField(blank=True, default="")),
                ("pinterest_url", models.URLField(blank=True, default="")),
                ("business_hours", models.CharField(blank=True, default="", max_length=255)),
                ("closed_day", models.CharField(blank=True, default="", max_length=64)),
                ("business_location", models.CharField(blank=True, default="", max_length=255)),
                ("service_area", models.CharField(blank=True, default="", max_length=255)),
                ("delivery_text", models.TextField(blank=True, default="")),
                ("inside_dhaka_estimate", models.CharField(blank=True, default="", max_length=255)),
                ("inside_dhaka_charge", models.CharField(blank=True, default="", max_length=128)),
                ("outside_dhaka_estimate", models.CharField(blank=True, default="", max_length=255)),
                ("outside_dhaka_charge", models.CharField(blank=True, default="", max_length=128)),
                ("delivery_timing_note", models.TextField(blank=True, default="")),
                ("cod_status", models.CharField(blank=True, default="", max_length=255)),
                ("advance_payment_note", models.TextField(blank=True, default="")),
                ("order_confirmation_note", models.TextField(blank=True, default="")),
                ("delivery_summary", models.TextField(blank=True, default="")),
                ("return_request_window", models.CharField(blank=True, default="", max_length=255)),
                ("return_eligible", models.TextField(blank=True, default="")),
                ("return_notes", models.TextField(blank=True, default="")),
                ("exchange_request_window", models.CharField(blank=True, default="", max_length=255)),
                ("exchange_eligible", models.TextField(blank=True, default="")),
                ("exchange_notes", models.TextField(blank=True, default="")),
                ("damaged_contact_window", models.CharField(blank=True, default="", max_length=255)),
                ("damaged_evidence", models.TextField(blank=True, default="")),
                ("damaged_preferred_resolution", models.TextField(blank=True, default="")),
                ("damaged_fallback", models.TextField(blank=True, default="")),
                ("fragrance_performance_guidance", models.TextField(blank=True, default="")),
                ("fragrance_storage_guidance", models.TextField(blank=True, default="")),
                ("order_confirmation_fields", models.JSONField(default=list, validators=[apps.catalog.validators.validate_string_list])),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={"verbose_name": "Business Settings", "verbose_name_plural": "Business Settings"},
        ),
        migrations.AddConstraint(
            model_name="businesssettings",
            constraint=models.CheckConstraint(condition=models.Q(("singleton_key", 1)), name="business_settings_singleton_key_is_one"),
        ),
    ]
