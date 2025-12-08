# api/serializers.py
from rest_framework import serializers
from .models import (
    User, DepBatch, Section, Student, Course,
    AttendanceSession, AttendanceRecord
)

# ---------- Users ----------
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "first_name", "last_name", "role", "teacher_code"]

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ["id", "email", "password", "first_name", "last_name", "role", "teacher_code"]

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user
# ---------- DepBatch & Section ----------
class DepBatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = DepBatch
        fields = ["id", "dep", "batch"]

class SectionSerializer(serializers.ModelSerializer):
    dep_batch = DepBatchSerializer(read_only=True)
    dep_batch_id = serializers.PrimaryKeyRelatedField(
        queryset=DepBatch.objects.all(), source="dep_batch", write_only=True
    )

    class Meta:
        model = Section
        fields = ["id", "name", "dep_batch", "dep_batch_id"]

# ---------- Student ----------
class StudentSerializer(serializers.ModelSerializer):
    section = SectionSerializer(read_only=True)
    section_id = serializers.PrimaryKeyRelatedField(
        queryset=Section.objects.all(), source="section", write_only=True
    )

    class Meta:
        model = Student
        fields = ["id", "student_code", "first_name", "last_name", "section", "section_id"]

# ---------- Course ----------
class CourseSerializer(serializers.ModelSerializer):
    teacher = UserSerializer(read_only=True)
    teacher_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role="teacher"), source="teacher", write_only=True
    )

    class Meta:
        model = Course
        fields = ["id", "name", "code", "teacher", "teacher_id"]

# ---------- CameraDevice ----------
# class CameraDeviceSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = CameraDevice
#         fields = ["id", "device_id", "name", "location", "ip_address", "mac_address", "status", "last_seen", "registered_at"]

# create serializer for admin to create device with device_key
# class CameraDeviceCreateSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = CameraDevice
#         fields = ["device_id", "name", "location", "ip_address", "mac_address"]

#     def create(self, validated_data):
#         import secrets
#         device_key = secrets.token_urlsafe(32)
#         device = CameraDevice.objects.create(**validated_data)
#         # attach device_key attribute (persist as field if present)
#         if hasattr(device, "device_key"):
#             device.device_key = device_key
#             device.save(update_fields=["device_key"])
#         else:
#             # if model doesn't have device_key field, set attr for admin usage (not persisted)
#             device.device_key = device_key
#         # return device (with device_key accessible server-side)
#         return device

# ---------- Attendance Session ----------
class AttendanceSessionSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)
    course_id = serializers.PrimaryKeyRelatedField(queryset=Course.objects.all(), source="course", write_only=True)
    created_by = UserSerializer(read_only=True)
    # camera = CameraDeviceSerializer(read_only=True)
    # camera_id = serializers.PrimaryKeyRelatedField(queryset=CameraDevice.objects.all(), source="camera", write_only=True)

    class Meta:
        model = AttendanceSession
        fields = ["id", "course", "course_id", "date", "created_by", "section", "created_at", "is_active"]

# ---------- CameraCapture ----------
# class CameraCaptureSerializer(serializers.ModelSerializer):
#     camera = CameraDeviceSerializer(read_only=True)
#     session = AttendanceSessionSerializer(read_only=True)
#     image = serializers.ImageField()

#     class Meta:
#         model = CameraCapture
#         fields = ["id", "session", "camera", "image", "captured_at", "processed"]

# ---------- AIRecognitionResult ----------
# class AIRecognitionResultSerializer(serializers.ModelSerializer):
#     capture = CameraCaptureSerializer(read_only=True)
#     student = StudentSerializer(read_only=True)

#     class Meta:
#         model = AIRecognitionResult
#         fields = ["id", "capture", "student", "confidence", "is_identified", "processed_at"]

# ---------- AttendanceRecord ----------
class AttendanceRecordSerializer(serializers.ModelSerializer):
    session = AttendanceSessionSerializer(read_only=True)
    student = StudentSerializer(read_only=True)

    class Meta:
        model = AttendanceRecord
        fields = ["id", "session", "student", "status", "timestamp", "confirmation_method"]

