# api/views.py
from AI.attendance_session import start_session, stop_session
from rest_framework import viewsets, status, generics, permissions, serializers
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db import IntegrityError, transaction
from .models import (
    User, DepBatch, Section, Student, Course,
    AttendanceSession, AttendanceRecord, AIRecognitionResult
)
from .serializers import ( 
    UserSerializer, DepBatchSerializer, SectionSerializer, StudentSerializer,
    CourseSerializer, AttendanceSessionSerializer, AttendanceRecordSerializer, RegisterSerializer
)
from .permissions import IsTeacher, IsAdmin


from .permissions import IsTeacher, IsAdmin
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

# -------------------- Custom Token Serializer --------------------
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Custom serializer that includes user info in token response"""
    
    def validate(self, attrs):
        try:
            data = super().validate(attrs)
        except Exception as e:
            # Provide clearer error message
            raise serializers.ValidationError({
                'error': 'Invalid email or password. Please check your credentials and ensure you have registered.',
                'detail': str(e)
            })
        
        # Add user information to response
        user = self.user
        data['user'] = {
            'id': str(user.id),
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'role': user.role,
        }
        
        return data


class CustomTokenObtainPairView(TokenObtainPairView):
    """Custom login view that returns user data"""
    serializer_class = CustomTokenObtainPairSerializer


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


class TeacherViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer

    def get_queryset(self):
        return User.objects.filter(role="teacher")

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsAdmin()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        # Force role to teacher no matter what comes from frontend
        serializer.save(role="teacher")

# ---------- Student ViewSet ----------
class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all().order_by("student_code")
    serializer_class = StudentSerializer

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsAdmin()]#permissions.AllowAny()]
        return [permissions.IsAuthenticated()]#permissions.AllowAny()]

# ---------- Course ViewSet ----------
class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all().order_by("code")
    serializer_class = CourseSerializer

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsAdmin()]
        return [permissions.IsAuthenticated()]

# ---------- DepBatch & Section ----------
class DepBatchViewSet(viewsets.ModelViewSet):
    queryset = DepBatch.objects.all()
    serializer_class = DepBatchSerializer
    permission_classes = [IsAdmin]#permissions.AllowAny()]

class SectionViewSet(viewsets.ModelViewSet):
    queryset = Section.objects.all()
    serializer_class = SectionSerializer
    
    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsAdmin()]
        return [permissions.IsAuthenticated()]

# ---------- AttendanceSession ----------
class AttendanceSessionViewSet(viewsets.ModelViewSet):
    queryset = AttendanceSession.objects.all().order_by("-created_at")
    serializer_class = AttendanceSessionSerializer

    def get_permissions(self):
        if self.action in ["create", "close"]:
            return [permissions.AllowAny()]#IsTeacher()]#permissions.AllowAny()]
        return [permissions.AllowAny()]#permissions.IsAuthenticated()]#permissions.AllowAny()]
    
    def perform_create(self, serializer):
            # set created_by from request (teacher)
            serializer.save(created_by=self.request.user)
            start_session()


    @action(detail=True, methods=["post"])
    def close(self, request, pk=None):
        session = self.get_object()
        if request.user.role != "teacher" and session.created_by != request.user:
            return Response({"detail": "Forbidden"}, status=403)
        # write sosis closing logic here
        result = stop_session()
        # print(result)
        for student in result:
            # print(student)
            recognized_student = Student.objects.filter(student_code=student).first()
            if recognized_student:
                AIRecognitionResult.objects.get_or_create(session=session, student=recognized_student, timestamp=timezone.now())
        # print(session.section)
        students = Student.objects.filter(section=session.section) 
        # print(students)
        ai_students = Student.objects.filter(
                            airecognitionresult__session=session
                        ).distinct()
        for student in students:
            # print("this run")
            if student in ai_students:
                AttendanceRecord.objects.get_or_create(session=session, student=student, status="present", timestamp=timezone.now(), confirmation_method="ai_camera")
                # print(AttendanceRecord.objects.get(session=session, student=student))
            else:
                AttendanceRecord.objects.get_or_create(session=session, student=student, status="absent", timestamp=timezone.now(), confirmation_method="ai_absent")
        session.is_active = False
        session.save(update_fields=["is_active"])
        return Response({"message": "Session closed ans attendance has been marked and absentees marked"})

# ---------- AttendanceRecord viewset ----------
class AttendanceRecordViewSet(viewsets.ModelViewSet):
    queryset = AttendanceRecord.objects.all().order_by("-timestamp")
    serializer_class = AttendanceRecordSerializer

    def get_permissions(self):
        if self.action in ["update", "partial_update"]:
            # teachers can edit only records for their sessions
            return [IsTeacher()]#permissions.AllowAny()]
        return [permissions.IsAuthenticated()]#permissions.AllowAny()]

    def perform_update(self, serializer):
        # ensure teachers only update their own sessions
        record = self.get_object()
        if self.request.user.role == "teacher" and record.session.created_by != self.request.user:
            raise PermissionDenied("Teachers can only edit attendance for their sessions.")
        serializer.save()
