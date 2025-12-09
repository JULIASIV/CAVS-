# api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    StudentViewSet, CourseViewSet, DepBatchViewSet, SectionViewSet,
    AttendanceSessionViewSet, AttendanceRecordViewSet, RegisterView, MeView, TeacherViewSet,
    CustomTokenObtainPairView
)
from rest_framework_simplejwt.views import  TokenRefreshView

router = DefaultRouter()
router.register(r"teachers", TeacherViewSet, basename="teacher")
router.register(r"students", StudentViewSet, basename="students")
router.register(r"courses", CourseViewSet, basename="courses")
router.register(r"dep-batch", DepBatchViewSet, basename="dep-batch")
router.register(r"sections", SectionViewSet, basename="sections")
router.register(r"sessions", AttendanceSessionViewSet, basename="sessions")
router.register(r"attendance", AttendanceRecordViewSet, basename="attendance-records")

urlpatterns = [
    # ---------- AUTH ----------
    path("auth/register/", RegisterView.as_view(), name="register"),
    path("auth/login/", CustomTokenObtainPairView.as_view(), name="login"),
    path("auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("auth/me/", MeView.as_view(), name="me"),

    path("", include(router.urls)),
]

