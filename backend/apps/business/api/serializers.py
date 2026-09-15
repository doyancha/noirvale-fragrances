from rest_framework import serializers

class BusinessSettingsSerializer(serializers.Serializer):
    contact = serializers.SerializerMethodField()
    social = serializers.SerializerMethodField()
    business = serializers.SerializerMethodField()
    customer_care = serializers.SerializerMethodField()

    def get_contact(self, obj):
        return {"phone": obj.public_phone, "email": obj.business_email, "website": obj.website_url}

    def get_social(self, obj):
        return {"facebook": obj.facebook_url, "instagram": obj.instagram_url, "pinterest": obj.pinterest_url}

    def get_business(self, obj):
        return {
            "hours": obj.business_hours,
            "closed_day": obj.closed_day,
            "location": obj.business_location,
            "service_area": obj.service_area,
            "delivery_text": obj.delivery_text,
        }

    def get_customer_care(self, obj):
        return {
            "delivery": {
                "inside_dhaka": {"estimate": obj.inside_dhaka_estimate, "charge": obj.inside_dhaka_charge},
                "outside_dhaka": {"estimate": obj.outside_dhaka_estimate, "charge": obj.outside_dhaka_charge},
                "timing_note": obj.delivery_timing_note,
                "cod": obj.cod_status,
                "advance_payment": obj.advance_payment_note,
                "confirmation": obj.order_confirmation_note,
                "summary": obj.delivery_summary,
            },
            "returns": {"request_window": obj.return_request_window, "eligible": obj.return_eligible, "notes": obj.return_notes},
            "exchanges": {"request_window": obj.exchange_request_window, "eligible": obj.exchange_eligible, "notes": obj.exchange_notes},
            "damaged_or_wrong_product": {
                "contact_window": obj.damaged_contact_window,
                "evidence": obj.damaged_evidence,
                "preferred_resolution": obj.damaged_preferred_resolution,
                "fallback": obj.damaged_fallback,
            },
            "fragrance_guidance": {"performance": obj.fragrance_performance_guidance, "storage": obj.fragrance_storage_guidance},
            "order_confirmation_fields": obj.order_confirmation_fields,
        }
