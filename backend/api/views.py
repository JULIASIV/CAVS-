# api/views.py
from rest_framework import viewsets, status, generics, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db import IntegrityError, transaction

from .models import (
    User, DepBatch, Section, Student, Course,
    AttendanceSession, AttendanceRecord, CameraDevice,
    CameraCapture, AIRecognitionResult
)
from .serializers import (
    UserSerializer, DepBatchSerializer, SectionSerializer, StudentSerializer,
    CourseSerializer, AttendanceSessionSerializer, AttendanceRecordSerializer,
    CameraDeviceSerializer, CameraDeviceCreateSerializer, CameraCaptureSerializer,
    AIRecognitionResultSerializer, RegisterSerializer
)
from .permissions import IsTeacher, IsAdmin, IsDevice
from django.contrib.auth import get_user_model

# import your ai function - must exist
# ##from ai_engine.predictor import identify_student  # identify_student(image_path_or_bytes) -> (student_id or None, confidence)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

class MeView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


# ---------- Device views ----------
class CameraDeviceViewSet(viewsets.ModelViewSet):
    queryset = CameraDevice.objects.all().order_by("-registered_at")
    serializer_class = CameraDeviceSerializer

    def get_serializer_class(self):
        if self.action in ["create"]:
            return CameraDeviceCreateSerializer
        return CameraDeviceSerializer

    def create(self, request, *args, **kwargs):
        # only admin allowed
        if not (request.user and request.user.is_authenticated and request.user.role == "admin"):
            return Response({"detail": "Forbidden"}, status=403)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        device = serializer.save()
        # return device_key if model has it
        device_key = getattr(device, "device_key", None)
        data = CameraDeviceSerializer(device).data
        data["device_key"] = device_key
        return Response(data, status=status.HTTP_201_CREATED)

# ---------- Device command endpoint ----------
@api_view(["GET"])
def device_command(request):
    device_id = request.query_params.get("device_id")
    device_key = request.headers.get("X-Device-Key")
    if not device_id or not device_key:
        return Response({"command": "IDLE"}, status=400)

    try:
        device = CameraDevice.objects.get(device_id=device_id)
    except CameraDevice.DoesNotExist:
        return Response({"command": "IDLE"}, status=404)

    # quick device_key check if stored on model
    stored_key = getattr(device, "device_key", None)
    if stored_key and device_key != stored_key:
        return Response({"detail": "Unauthorized"}, status=401)

    # find active session for this camera
    session = AttendanceSession.objects.filter(camera=device, is_active=True).order_by("-created_at").first()
    if session:
        return Response({
            "command": "START_CAMERA",
            "session_id": str(session.id),
            "date": session.date.isoformat()
        })
    return Response({"command": "IDLE"})


# ---------- Attendance Scan (image upload) ----------
@api_view(["POST"])
@permission_classes([IsDevice])
def attendance_scan(request):
    """
    Device must send multipart/form-data:
    - device_id (form field)
    - session_id (optional; will be inferred from active session otherwise)
    - image (file)
    Header: X-Device-Key
    """
    parser_classes = (MultiPartParser, FormParser)
    device_id = request.data.get("device_id")
    session_id = request.data.get("session_id")
    image = request.FILES.get("image")
    if not device_id or not image:
        return Response({"error": "device_id and image required"}, status=400)

    device = get_object_or_404(CameraDevice, device_id=device_id)

    # find session: prefer provided session_id, else active session by camera
    session = None
    if session_id:
        session = get_object_or_404(AttendanceSession, id=session_id)
    else:
        session = AttendanceSession.objects.filter(camera=device, is_active=True).order_by("-created_at").first()
    if not session:
        return Response({"error": "No active session found"}, status=403)

    # Save raw capture
    capture = CameraCapture.objects.create(session=session, camera=device, image=image)

    # Run custom AI synchronously; your function must accept file path or bytes
    try:
        # prefer to pass path if available (Pillow storage path)
        image_path = capture.image.path
    except Exception:
        # fallback: read bytes
        image_path = None

    try:
        student_id, confidence = identify_student(image_path or capture.image.read())
    except Exception as exc:
        # mark processed = False and return error
        capture.processed = False
        capture.save(update_fields=["processed"])
        return Response({"error": "AI processing error", "detail": str(exc)}, status=500)

    # Save AI result
    if student_id:
        try:
            student = Student.objects.get(id=student_id)
        except Student.DoesNotExist:
            student = None
    else:
        student = None

    ai_result = AIRecognitionResult.objects.create(
        capture=capture,
        student=student,
        confidence=confidence or 0.0,
        is_identified=bool(student)
    )
    capture.processed = True
    capture.save(update_fields=["processed"])

    # If identified -> create AttendanceRecord if not exists
    if student:
        try:
            with transaction.atomic():
                # duplicate prevention
                ar, created = AttendanceRecord.objects.get_or_create(
                    session=session,
                    student=student,
                    defaults={
                        "status": "present",
                        "timestamp": timezone.now(),
                        "confirmation_method": "ai_camera"
                    }
                )
                if not created:
                    return Response({"message": "Already scanned", "student": student.student_code, "confidence": confidence})
        except IntegrityError:
            return Response({"error": "DB integrity error"}, status=500)

        return Response({"message": "Attendance marked", "student": student.student_code, "confidence": confidence})
    else:
        # unknown face
        return Response({"message": "Unknown face", "confidence": confidence}, status=404)


# ---------- Student ViewSet ----------
class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all().order_by("student_code")
    serializer_class = StudentSerializer

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsAdmin()]
        return [permissions.IsAuthenticated()]

# ---------- Course ViewSet ----------
class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all().order_by("code")
    serializer_class = CourseSerializer

    def get_permissions(self):
        if self.action in ["create", "update", "destroy"]:
            return [IsAdmin()]
        return [permissions.IsAuthenticated()]

# ---------- DepBatch & Section ----------
class DepBatchViewSet(viewsets.ModelViewSet):
    queryset = DepBatch.objects.all()
    serializer_class = DepBatchSerializer
    permission_classes = [IsAdmin]

class SectionViewSet(viewsets.ModelViewSet):
    queryset = Section.objects.all()
    serializer_class = SectionSerializer
    permission_classes = [IsAdmin]

# ---------- AttendanceSession ----------
class AttendanceSessionViewSet(viewsets.ModelViewSet):
    queryset = AttendanceSession.objects.all().order_by("-created_at")
    serializer_class = AttendanceSessionSerializer

    def perform_create(self, serializer):
        # set created_by from request (teacher)
        serializer.save(created_by=self.request.user)

    def get_permissions(self):
        if self.action in ["create", "close"]:
            return [IsTeacher()]
        return [permissions.IsAuthenticated()]

    @action(detail=True, methods=["post"])
    def close(self, request, pk=None):
        session = self.get_object()
        if request.user.role == "teacher" and session.created_by != request.user:
            return Response({"detail": "Forbidden"}, status=403)
        session.is_active = False
        session.save(update_fields=["is_active"])
        # mark absentees
        students_qs = Student.objects.filter(section__in=session.course.teacher.courses.all()) # alternative: students in course's sections
        # Simpler: all students in related sections (assuming course has sections via section mapping)
        # For safety, mark absent for students registered in course sections (implement proper relation if needed)
        enrolled_students = Student.objects.filter(section__dep_batch__in=[])  # placeholder
        # implement your own logic to find students in course sections
        # iterate over students and create absent AttendanceRecord when needed
        for student in Student.objects.filter(section__in=session.course.sections.all() if hasattr(session.course, "sections") else []):
            AttendanceRecord.objects.get_or_create(session=session, student=student, defaults={"status": "absent", "timestamp": timezone.now(), "confirmation_method": "auto_absent"})
        return Response({"message": "Session closed and absentees marked"})

# ---------- AttendanceRecord viewset ----------
class AttendanceRecordViewSet(viewsets.ModelViewSet):
    queryset = AttendanceRecord.objects.all().order_by("-timestamp")
    serializer_class = AttendanceRecordSerializer

    def get_permissions(self):
        if self.action in ["update", "partial_update"]:
            # teachers can edit only records for their sessions
            return [IsTeacher()]
        return [permissions.IsAuthenticated()]

    def perform_update(self, serializer):
        # ensure teachers only update their own sessions
        record = self.get_object()
        if self.request.user.role == "teacher" and record.session.created_by != self.request.user:
            raise PermissionDenied("Teachers can only edit attendance for their sessions.")
        serializer.save()
