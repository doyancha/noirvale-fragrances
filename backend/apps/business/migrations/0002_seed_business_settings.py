from django.db import migrations


def seed_business_settings(apps, schema_editor):
    BusinessSettings = apps.get_model("business", "BusinessSettings")
    BusinessSettings.objects.get_or_create(
        singleton_key=1,
        defaults={
            "public_phone": "8801XXXXXXXXX",
            "business_email": "contact@yourdomain.com",
            "website_url": "https://noirvale-fragrances-store.vercel.app",
            "facebook_url": "https://www.facebook.com/login/",
            "instagram_url": "https://www.instagram.com/accounts/login/",
            "pinterest_url": "https://www.pinterest.com/login/",
            "business_hours": "Saturday–Thursday, 10:00 AM–8:00 PM",
            "closed_day": "Friday",
            "business_location": "Dhaka, Bangladesh",
            "service_area": "Nationwide Bangladesh",
            "delivery_text": "Inside Dhaka: estimated delivery within 2 days after order confirmation (৳70). Outside Dhaka: estimated delivery within 4 days after order confirmation (৳120). Delivery may take longer during public holidays, extreme weather, courier disruption, unusually high order volume, or remote-area delivery.",
            "inside_dhaka_estimate": "2 days after order confirmation",
            "inside_dhaka_charge": "৳70",
            "outside_dhaka_estimate": "4 days after order confirmation",
            "outside_dhaka_charge": "৳120",
            "delivery_timing_note": "Delivery may take longer during public holidays, extreme weather, courier disruption, unusually high order volume, or remote-area delivery.",
            "cod_status": "Available",
            "advance_payment_note": "Advance payment may be required for selected orders.",
            "order_confirmation_note": "Final confirmation takes place through WhatsApp.",
            "delivery_summary": "Inside Dhaka: within 2 days after order confirmation (৳70). Outside Dhaka: within 4 days after order confirmation (৳120). Cash on Delivery is available.",
            "return_request_window": "3 days of delivery",
            "return_eligible": "unopened, unused, factory-sealed product returned with original packaging in resalable condition",
            "return_notes": "Change of fragrance preference after opening is not normally eligible for return.",
            "exchange_request_window": "3 days of delivery",
            "exchange_eligible": "unused, unopened, factory-sealed products returned with original packaging in resalable condition",
            "exchange_notes": "Exchange requests may be declined for customer-caused damage or opened fragrance unless the issue is a verified defect or incorrect product.",
            "damaged_contact_window": "24 hours of receiving the parcel",
            "damaged_evidence": "Share order information and clear photographs; a photo of the shipping packaging and an unboxing video help when available, but a video is not the only proof we consider.",
            "damaged_preferred_resolution": "Replacement without another delivery fee where the incorrect or damaged item is verified.",
            "damaged_fallback": "If replacement is unavailable, we will offer an appropriate refund or a mutually agreed alternative.",
            "fragrance_performance_guidance": "Longevity, projection, and intensity can vary with skin chemistry, temperature, humidity, application amount, application location, storage, and surrounding conditions. Descriptions are guidance, not guarantees.",
            "fragrance_storage_guidance": "Store fragrance away from direct sunlight and excessive heat in a cool, dry place with the cap closed.",
            "order_confirmation_fields": ["fragrance", "bottle size", "price", "delivery charge", "delivery location", "customer contact details", "payment / COD arrangement"],
        },
    )


class Migration(migrations.Migration):
    dependencies = [("business", "0001_businesssettings")]
    operations = [migrations.RunPython(seed_business_settings, migrations.RunPython.noop)]
