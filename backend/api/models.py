# import uuid
# from django.contrib.auth.models import (
#                                         AbstractBaseUser,
#                                         BaseUserManager,
#                                         PermissionsMixin
#                                        )
# from django.db import models


# class CustomUserManager(BaseUserManager):

#     def create_user(self, email, password=None, **extra_fields):
#         if not email:
#             raise ValueError("Users must have an email address")

#         email = self.normalize_email(email)
#         user = self.model(email=email, **extra_fields)
#         user.set_password(password)
#         user.save(using=self._db)
#         return user

#     def create_superuser(self, email, password=None, **extra_fields):
#         extra_fields.setdefault("role", "admin")
#         extra_fields.setdefault("is_staff", True)
#         extra_fields.setdefault("is_superuser", True)
#         return self.create_user(email, password, **extra_fields)


# class User(AbstractBaseUser, PermissionsMixin):

#     ROLE_CHOICES = (
#         ("admin", "Admin"),
#         ("teacher", "Teacher"),
#     )

#     id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
#     email = models.EmailField(unique=True)

#     role = models.CharField(max_length=10, choices=ROLE_CHOICES)

#     teacher_code = models.CharField(
#         max_length=20,
#         unique=True,
#         null=True,
#         blank=True
#     )

#     first_name = models.CharField(max_length=50)
#     last_name = models.CharField(max_length=50)

#     is_active = models.BooleanField(default=True)
#     is_staff = models.BooleanField(default=False)

#     objects = CustomUserManager()

#     USERNAME_FIELD = "email"
#     REQUIRED_FIELDS = []

#     def __str__(self):
#         return f"{self.first_name} {self.last_name}"
    

# class DepBatch(models.Model):
#     dep = models.CharField(max_length=100)
#     batch = models.CharField(max_length=50)

    
#     class Meta:
#         constraints = [
#             models.UniqueConstraint(
#                 fields=["dep", "batch"],
#                 name="unique_dep_batch"
#             )
#         ]

#     def __str__(self):
#         return f"{self.dep} - {self.batch}"


# class Section(models.Model):
#     name = models.CharField(max_length=50)
#     dep_batch = models.ForeignKey(
#         DepBatch,
#         on_delete=models.CASCADE,
#         related_name="sections"
#     )

#     class Meta:
#         constraints = [
#             models.UniqueConstraint(
#                 fields=["name", "dep_batch"],
#                 name="unique_name_dep_batch"
#             )
#         ]

#     def __str__(self):
#         return self.name


# class Student(models.Model):
#     student_code = models.CharField(max_length=20, unique=True)
#     first_name = models.CharField(max_length=100)
#     last_name = models.CharField(max_length=100)
#     section = models.ForeignKey(
#         Section,
#         on_delete=models.CASCADE,
#         related_name="students"
#     )

#     def __str__(self):
#         return f"{self.student_code} - {self.first_name}"


# class Course(models.Model):
#     name = models.CharField(max_length=150)
#     code = models.CharField(max_length=20, unique=True)
#     teacher = models.ForeignKey(
#         User,
#         on_delete=models.CASCADE,
#         related_name="courses"
#     )

#     def __str__(self):
#         return f"{self.code} - {self.name}"


# class AttendanceSession(models.Model):
#     course = models.ForeignKey(
#         Course,
#         on_delete=models.CASCADE,
#         related_name="sessions"
#     )
#     date = models.DateField()
#     created_by = models.ForeignKey(
#         User,
#         on_delete=models.CASCADE,
#         related_name="attendance_sessions"
#     )
#     created_at = models.DateTimeField(auto_now_add=True)
#     device_id = models.CharField(max_length=100, db_index=True)
#     is_active = models.BooleanField(default=True)

#     def __str__(self):
#         return f"{self.course.code} - {self.date}"


# class AttendanceRecord(models.Model):

#     STATUS_CHOICES = (
#         ("present", "Present"),
#         ("absent", "Absent"),
#         ("permission", "Permission"),
#     )

#     session = models.ForeignKey(
#         AttendanceSession,
#         on_delete=models.CASCADE,
#         related_name="attendance_records"
#     )
#     student = models.ForeignKey(
#         Student,
#         on_delete=models.CASCADE,
#         related_name="attendance_records"
#     )
#     status = models.CharField(
#         max_length=20,
#         choices=STATUS_CHOICES
#     )
#     timestamp = models.DateTimeField()

#     class Meta:
#         constraints = [
#             models.UniqueConstraint(
#                 fields=["session", "student"],
#                 name="unique_session_student"
#             )
#         ]


#     def __str__(self):
#         return f"{self.student.student_code} - {self.status}"


import uuid
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin
)
from django.db import models
from django.utils import timezone


# ===========================
# USER & AUTH
# ===========================

class CustomUserManager(BaseUserManager):

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Users must have an email address")

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("role", "admin")
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):

    ROLE_CHOICES = (
        ("admin", "Admin"),
        ("teacher", "Teacher"),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)

    role = models.CharField(max_length=10, choices=ROLE_CHOICES)

    teacher_code = models.CharField(
        max_length=20,
        unique=True,
        null=True,
        blank=True
    )

    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


# ===========================
# ACADEMIC STRUCTURE
# ===========================

class DepBatch(models.Model):
    dep = models.CharField(max_length=100)
    batch = models.CharField(max_length=50)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["dep", "batch"],
                name="unique_dep_batch"
            )
        ]

    def __str__(self):
        return f"{self.dep} - {self.batch}"


class Section(models.Model):
    name = models.CharField(max_length=50)
    dep_batch = models.ForeignKey(
        DepBatch,
        on_delete=models.CASCADE,
        related_name="sections"
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["name", "dep_batch"],
                name="unique_name_dep_batch"
            )
        ]

    def __str__(self):
        return self.name


class Student(models.Model):
    student_code = models.CharField(max_length=20, unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    section = models.ForeignKey(
        Section,
        on_delete=models.CASCADE,
        related_name="students"
    )

    def __str__(self):
        return f"{self.student_code} - {self.first_name}"


class Course(models.Model):
    name = models.CharField(max_length=150)
    code = models.CharField(max_length=20, unique=True)
    teacher = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="courses"
    )

    def __str__(self):
        return f"{self.code} - {self.name}"


# ===========================
# ✅ ESP32 CAMERA DEVICE MODEL
# ===========================

class CameraDevice(models.Model):
    DEVICE_STATUS = (
        ("online", "Online"),
        ("offline", "Offline"),
        ("blocked", "Blocked"),
    )

    device_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=150)
    location = models.CharField(max_length=150, blank=True, null=True)

    ip_address = models.GenericIPAddressField()
    mac_address = models.CharField(max_length=50, unique=True)

    status = models.CharField(
        max_length=20,
        choices=DEVICE_STATUS,
        default="offline"
    )

    last_seen = models.DateTimeField(null=True, blank=True)
    registered_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.device_id})"


# ===========================
# ✅ ATTENDANCE SESSION
# (Camera Controlled by Backend)
# ===========================

class AttendanceSession(models.Model):
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="sessions"
    )

    date = models.DateField(default=timezone.now)

    created_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="attendance_sessions"
    )

    camera = models.ForeignKey(
        CameraDevice,
        on_delete=models.CASCADE,
        related_name="sessions"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.course.code} - {self.date}"


# ===========================
# ✅ RAW IMAGES FROM ESP32
# ===========================

class CameraCapture(models.Model):
    session = models.ForeignKey(
        AttendanceSession,
        on_delete=models.CASCADE,
        related_name="captures"
    )

    camera = models.ForeignKey(
        CameraDevice,
        on_delete=models.CASCADE,
        related_name="captures"
    )

    image = models.ImageField(upload_to="camera_captures/")
    captured_at = models.DateTimeField(auto_now_add=True)

    processed = models.BooleanField(default=False)

    def __str__(self):
        return f"Capture {self.id} - {self.captured_at}"


# ===========================
# ✅ AI IDENTIFICATION LOG
# ===========================

class AIRecognitionResult(models.Model):
    capture = models.OneToOneField(
        CameraCapture,
        on_delete=models.CASCADE,
        related_name="ai_result"
    )

    student = models.ForeignKey(
        Student,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    confidence = models.FloatField()
    is_identified = models.BooleanField(default=False)

    processed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"AI Result - {self.capture.id}"


# ===========================
# ✅ FINAL ATTENDANCE RECORD
# ===========================

class AttendanceRecord(models.Model):

    STATUS_CHOICES = (
        ("present", "Present"),
        ("absent", "Absent"),
        ("permission", "Permission"),
    )

    session = models.ForeignKey(
        AttendanceSession,
        on_delete=models.CASCADE,
        related_name="attendance_records"
    )

    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name="attendance_records"
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES
    )

    timestamp = models.DateTimeField(auto_now_add=True)

    confirmation_method = models.CharField(
        max_length=50,
        default="ai_camera"
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["session", "student"],
                name="unique_session_student"
            )
        ]

    def __str__(self):
        return f"{self.student.student_code} - {self.status}"
