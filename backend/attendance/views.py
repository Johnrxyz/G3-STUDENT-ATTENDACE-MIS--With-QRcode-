from rest_framework import viewsets, permissions, status, mixins
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from .models import Department, Program, Course, Section, Day, ClassSchedule, AttendanceSession, AttendanceRecord
from api.serializers import (
    DepartmentSerializer, ProgramSerializer, CourseSerializer, SectionSerializer, 
    DaySerializer, ClassScheduleSerializer, AttendanceSessionSerializer, AttendanceRecordSerializer
)
from users.permissions import IsAdmin, IsTeacher, IsStudent, IsTeacherOrAdmin, IsAdminOrReadOnly
from users.models import StudentProfile

User = get_user_model()

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAdminOrReadOnly]

class ProgramViewSet(viewsets.ModelViewSet):
    queryset = Program.objects.all()
    serializer_class = ProgramSerializer
    permission_classes = [IsAdminOrReadOnly]

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAdminOrReadOnly]

class SectionViewSet(viewsets.ModelViewSet):
    queryset = Section.objects.all()
    serializer_class = SectionSerializer
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
             return [permissions.AllowAny()]
        return [permissions.IsAuthenticated(), IsTeacherOrAdmin()]

    def get_queryset(self):
        # Allow unrestricted access for list calls (for registration)
        # But for specific user views, we could filter.
        # Given the requirements, public list is acceptable.
        if self.request.user.is_authenticated and self.request.user.role == 'teacher':
             return Section.objects.filter(instructor=self.request.user)
        return Section.objects.all()

    def perform_create(self, serializer):
        if self.request.user.role == 'teacher':
            serializer.save(instructor=self.request.user)
        else:
            serializer.save()

class DayViewSet(viewsets.ModelViewSet):
    queryset = Day.objects.all()
    serializer_class = DaySerializer
    permission_classes = [IsAdminOrReadOnly]

class ClassScheduleViewSet(viewsets.ModelViewSet):
    queryset = ClassSchedule.objects.all()
    serializer_class = ClassScheduleSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeacherOrAdmin | IsStudent]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'teacher':
            return ClassSchedule.objects.filter(section__instructor=user)
        if user.role == 'student':
            # Filter schedules where the section has this student
            return ClassSchedule.objects.filter(section__students__user=user)
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

    @action(detail=False, methods=['post'], permission_classes=[IsTeacherOrAdmin])
    def open(self, request):
        schedule_id = request.data.get('schedule_id')
        schedule = get_object_or_404(ClassSchedule, id=schedule_id)
        
        # Check if teacher owns this schedule (or is admin)
        if request.user.role == 'teacher' and schedule.section.instructor != request.user:
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

    @action(detail=True, methods=['post'], permission_classes=[IsTeacherOrAdmin])
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

    @action(detail=True, methods=['get'], permission_classes=[IsTeacherOrAdmin])
    def monitoring(self, request, pk=None):
        session = self.get_object()
        records = session.records.all().select_related('student__user')
        
        data = []
        for record in records:
            data.append({
                'student_name': record.student.user.get_full_name(),
                'student_number': record.student.student_number,
                'status': record.status,
                'timestamp': record.timestamp,
                'is_duplicate': False # Logic for duplicate handling in scan? Validation happens before creation.
            })
        
        return Response({
            'session_status': 'open' if not session.closed_at else 'closed',
            'expires_at': session.qr_expires_at,
            'total_present': records.filter(status='present').count(),
            'total_late': records.filter(status='late').count(),
            'records': data
        })

class AttendanceRecordViewSet(viewsets.ModelViewSet):
    queryset = AttendanceRecord.objects.all()
    serializer_class = AttendanceRecordSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeacherOrAdmin | IsStudent]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'teacher':
             return AttendanceRecord.objects.filter(session__schedule__section__instructor=user)
        if user.role == 'student':
             # Students only see their own records
             return AttendanceRecord.objects.filter(student__user=user)
        return AttendanceRecord.objects.all()

    @action(detail=False, methods=['get'], permission_classes=[IsStudent])
    def calendar(self, request):
        user = request.user
        if not hasattr(user, 'student_profile'):
            return Response({'error': 'Student profile not found'}, status=status.HTTP_404_NOT_FOUND)
            
        student = user.student_profile
        # Get all records for this student
        records = AttendanceRecord.objects.filter(student=student).select_related('session', 'session__schedule', 'session__schedule__course')
        
        data = []
        for record in records:
            data.append({
                'id': record.id,
                'day_number': record.session.date.day,
                'date': record.session.date,
                'status': record.status,
                'subject_code': record.session.schedule.course.code,
                'subject_name': record.session.schedule.course.name,
                'session_id': record.session.id
            })
            
        return Response(data)

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

        # SECURITY: Log the scan attempt (rudimentary audit)
        #Ideally use ScanDevice logic here to validate device_uid if sent
        ip_addr = request.META.get('REMOTE_ADDR')
        user_agent = request.META.get('HTTP_USER_AGENT', '')
        # print(f"Scan attempt by {student_profile.student_number} from {ip_addr}")
        
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

class AnalyticsViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    @action(detail=False, methods=['get'])
    def summary(self, request):
        total_students = StudentProfile.objects.count()
        total_teachers = User.objects.filter(role='teacher').count()
        total_sessions = AttendanceSession.objects.count()
        recent_attendance = AttendanceRecord.objects.order_by('-timestamp')[:5]
        
        return Response({
            'total_students': total_students,
            'total_teachers': total_teachers,
            'total_sessions': total_sessions,
            'recent_activity': AttendanceRecordSerializer(recent_attendance, many=True).data
        })
