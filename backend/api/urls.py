from rest_framework import routers
from django.urls import path, include
from .views import (
                    UserViewSet, 
                    StudentProfileViewSet, 
                    CourseViewSet, 
                    SectionViewSet, 
                    ProgramViewSet, 
                    DepartmentViewSet, 
                    ClassScheduleViewSet, 
                    AttendanceSessionViewSet, 
                    AttendanceRecordViewSet
                )

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'student-profiles', StudentProfileViewSet)
router.register(r'courses', CourseViewSet)
router.register(r'sections', SectionViewSet)
router.register(r'programs', ProgramViewSet)
router.register(r'departments', DepartmentViewSet)
router.register(r'schedules', ClassScheduleViewSet)
router.register(r'attendance-sessions', AttendanceSessionViewSet)
router.register(r'attendance-records', AttendanceRecordViewSet)

urlpatterns = [
    path('', include(router.urls))
]