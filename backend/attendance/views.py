from rest_framework import viewsets, permissions, status, mixins
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.shortcuts import get_object_or_404
from .models import Department, Program, Course, Section, Day, ClassSchedule, AttendanceSession, AttendanceRecord
from api.serializers import (
    DepartmentSerializer, ProgramSerializer, CourseSerializer, SectionSerializer, 
    DaySerializer, ClassScheduleSerializer, AttendanceSessionSerializer, AttendanceRecordSerializer
)
from users.permissions import IsAdmin, IsTeacher, IsStudent, IsTeacherOrAdmin
from users.models import StudentProfile

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

class ProgramViewSet(viewsets.ModelViewSet):
    queryset = Program.objects.all()
    serializer_class = ProgramSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

class SectionViewSet(viewsets.ModelViewSet):
    queryset = Section.objects.all()
    serializer_class = SectionSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeacherOrAdmin]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'teacher':
            return Section.objects.filter(instructor=user)
        return Section.objects.all()

class DayViewSet(viewsets.ModelViewSet):
    queryset = Day.objects.all()
    serializer_class = DaySerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

class ClassScheduleViewSet(viewsets.ModelViewSet):
    queryset = ClassSchedule.objects.all()
    serializer_class = ClassScheduleSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeacherOrAdmin]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'teacher':
            return ClassSchedule.objects.filter(section__instructor=user)
        return ClassSchedule.objects.all()

class AttendanceSessionViewSet(viewsets.ModelViewSet):
    queryset = AttendanceSession.objects.all()
    serializer_class = AttendanceSessionSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeacherOrAdmin]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'teacher':
            return AttendanceSession.objects.filter(schedule__section__instructor=user)
        return AttendanceSession.objects.all()

    @action(detail=False, methods=['post'], permission_classes=[IsTeacher])
    def open(self, request):
        schedule_id = request.data.get('schedule_id')
        schedule = get_object_or_404(ClassSchedule, id=schedule_id)
        
        # Check if teacher owns this schedule
        if schedule.section.instructor != request.user:
            return Response({'error': 'Not authorized for this schedule'}, status=status.HTTP_403_FORBIDDEN)

        # Check if session already open
        active_session = AttendanceSession.objects.filter(schedule=schedule, closed_at__isnull=True).first()
        if active_session:
            return Response({'error': 'Session already open', 'session_id': active_session.id}, status=status.HTTP_400_BAD_REQUEST)

        session = AttendanceSession.objects.create(schedule=schedule)
        # Set expiry if needed (e.g. 30 mins)
        session.qr_expires_at = timezone.now() + timezone.timedelta(minutes=30)
        session.save()
        
        serializer = self.get_serializer(session)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], permission_classes=[IsTeacher])
    def close(self, request, pk=None):
        session = self.get_object()
        if session.closed_at:
             return Response({'error': 'Session already closed'}, status=status.HTTP_400_BAD_REQUEST)
        
        session.closed_at = timezone.now()
        session.save()
        return Response({'status': 'Session closed'})

    @action(detail=True, methods=['get'], permission_classes=[IsTeacherOrAdmin])
    def records(self, request, pk=None):
        session = self.get_object()
        records = session.records.all()
        serializer = AttendanceRecordSerializer(records, many=True)
        return Response(serializer.data)

class AttendanceRecordViewSet(viewsets.ModelViewSet):
    queryset = AttendanceRecord.objects.all()
    serializer_class = AttendanceRecordSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeacherOrAdmin]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'teacher':
            return AttendanceRecord.objects.filter(session__schedule__section__instructor=user)
        return AttendanceRecord.objects.all()

class ScanViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated, IsStudent]

    @action(detail=False, methods=['post'])
    def scan(self, request):
        qr_token = request.data.get('qr_token')
        student_id = request.data.get('student_id') # Or get from request.user
        
        # Verify Student
        try:
            student_profile = request.user.student_profile
        except StudentProfile.DoesNotExist:
             return Response({'error': 'User is not a student'}, status=status.HTTP_403_FORBIDDEN)

        # Find Session
        session = AttendanceSession.objects.filter(qr_token=qr_token, closed_at__isnull=True).first()
        if not session:
            return Response({'error': 'Invalid or expired QR token'}, status=status.HTTP_400_BAD_REQUEST)

        # Check Expiry
        if session.qr_expires_at and timezone.now() > session.qr_expires_at:
            return Response({'error': 'QR code expired'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if student is enrolled in this section
        if not session.schedule.section.students.filter(id=student_profile.id).exists():
             return Response({'error': 'Student not enrolled in this section'}, status=status.HTTP_403_FORBIDDEN)

        # Check for duplicate
        if AttendanceRecord.objects.filter(session=session, student=student_profile).exists():
            return Response({'message': 'Attendance already recorded'}, status=status.HTTP_200_OK)

        # Determine Status (Present/Late)
        # Simple logic: if > 15 mins after start, Late.
        # Ideally use SystemSettings
        status_val = 'present'
        time_diff = timezone.now() - session.started_at
        if time_diff.total_seconds() > 900: # 15 mins
            status_val = 'late'

        record = AttendanceRecord.objects.create(
            session=session,
            student=student_profile,
            status=status_val
        )
        
        return Response({'status': 'Attendance recorded', 'attendance_status': status_val}, status=status.HTTP_201_CREATED)
