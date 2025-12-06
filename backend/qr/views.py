from rest_framework import viewsets, permissions
from .models import ScanDevice, AuditLog, SystemSettings
from api.serializers import ScanDeviceSerializer, AuditLogSerializer, SystemSettingsSerializer
from users.permissions import IsAdmin

class ScanDeviceViewSet(viewsets.ModelViewSet):
    queryset = ScanDevice.objects.all()
    serializer_class = ScanDeviceSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

class SystemSettingsViewSet(viewsets.ModelViewSet):
    queryset = SystemSettings.objects.all()
    serializer_class = SystemSettingsSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]
