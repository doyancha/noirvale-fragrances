from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.business.models import BusinessSettings

from .serializers import BusinessSettingsSerializer


class BusinessSettingsView(APIView):
    permission_classes = (AllowAny,)

    def get(self, request):
        settings = BusinessSettings.objects.filter(singleton_key=1).first()
        if settings is None:
            return Response({"detail": "Business settings are temporarily unavailable."}, status=500)
        return Response(BusinessSettingsSerializer(settings).data)
