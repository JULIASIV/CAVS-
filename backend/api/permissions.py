# api/permissions.py
from rest_framework import permissions
from .models import CameraDevice
from django.conf import settings

class IsTeacher(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == "teacher")

class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == "admin")

class IsDevice(permissions.BasePermission):
    """
    Device authorizes using X-Device-Key header and device_id (query param or form).
    """
    def has_permission(self, request, view):
        device_key = request.headers.get("X-Device-Key")
        device_id = request.query_params.get("device_id") or request.data.get("device_id")
        if not device_key or not device_id:
            return False
        try:
            device = CameraDevice.objects.get(device_id=device_id)
        except CameraDevice.DoesNotExist:
            return False
        # simple check; in production store secret+hash and use constant time compare
        return device and device.status != "blocked" and device.ip_address is not None and device_key and device_key == getattr(device, "device_key", device_key)
