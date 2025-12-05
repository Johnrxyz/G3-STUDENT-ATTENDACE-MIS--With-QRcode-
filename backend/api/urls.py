from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenBlacklistView,
)
from users.views import UserViewSet, StudentProfileViewSet
from attendance.views import (
    DepartmentViewSet, ProgramViewSet, CourseViewSet, SectionViewSet, 
    DayViewSet, ClassScheduleViewSet, AttendanceSessionViewSet, 
    AttendanceRecordViewSet, ScanViewSet
)
from qr.views import ScanDeviceViewSet, AuditLogViewSet, SystemSettingsViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'student-profiles', StudentProfileViewSet)
router.register(r'departments', DepartmentViewSet)
router.register(r'programs', ProgramViewSet)
router.register(r'courses', CourseViewSet)
router.register(r'sections', SectionViewSet)
router.register(r'days', DayViewSet)
router.register(r'schedules', ClassScheduleViewSet)
router.register(r'attendance/sessions', AttendanceSessionViewSet)
router.register(r'attendance/records', AttendanceRecordViewSet)
router.register(r'attendance/scan', ScanViewSet, basename='scan')
router.register(r'qr/devices', ScanDeviceViewSet)
router.register(r'qr/logs', AuditLogViewSet)
router.register(r'qr/settings', SystemSettingsViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),    
    path('auth/logout/', TokenBlacklistView.as_view(), name='token_blacklist'),
]