from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from attendance.models import Department, Program, Course, Section, Day, ClassSchedule, AttendanceSession, AttendanceRecord
from users.models import StudentProfile
import uuid
from django.utils import timezone
import datetime

User = get_user_model()

class AttendanceSystemTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        
        # Create Admin
        self.admin_user = User.objects.create_superuser(
            username='admin',
            email='admin@test.com', 
            password='password123', 
            role='admin',
            firstname='Admin',
            lastname='User'
        )
         
        # Create Teacher
        self.teacher_user = User.objects.create_user(
            username='teacher',
            email='teacher@test.com', 
            password='password123', 
            role='teacher',
            firstname='Teacher',
            lastname='User'
        )
        
        # Create Student
        self.student_user = User.objects.create_user(
            username='student',
            email='student@test.com', 
            password='password123', 
            role='student',
            firstname='Student',
            lastname='User'
        )
        self.student_profile = StudentProfile.objects.create(
            user=self.student_user,
            student_number='2023-0001'
        )

        # Setup Academic Data
        self.dept = Department.objects.create(name='IT Dept', code='IT')
        self.prog = Program.objects.create(department=self.dept, name='BSIT', code='BSIT')
        self.course = Course.objects.create(department=self.dept, name='Programming 1', code='IT101')
        self.section = Section.objects.create(
            program=self.prog, 
            instructor=self.teacher_user, 
            year_level=1
        )
        self.section.students.add(self.student_profile)
        
        self.day = Day.objects.create(name='Monday')
        self.schedule = ClassSchedule.objects.create(
            course=self.course,
            section=self.section,
            start_time='08:00',
            end_time='10:00',
            room='Lab 1'
        )
        self.schedule.days.add(self.day)

    def test_teacher_can_open_session(self):
        self.client.force_authenticate(user=self.teacher_user)
        response = self.client.post('/api/attendance/sessions/open/', {'schedule_id': self.schedule.id})
        print(response.data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(AttendanceSession.objects.exists())

    def test_student_can_scan_qr(self):
        # Open session first
        session = AttendanceSession.objects.create(schedule=self.schedule)
        
        self.client.force_authenticate(user=self.student_user)
        response = self.client.post('/api/attendance/scan/scan/', {
            'qr_token': session.qr_token,
            'student_id': self.student_profile.id
        })
        print(response.data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(AttendanceRecord.objects.filter(student=self.student_profile, session=session).exists())

    def test_student_cannot_scan_closed_session(self):
        # Open and close session
        session = AttendanceSession.objects.create(schedule=self.schedule)
        session.closed_at = timezone.now() - datetime.timedelta(hours=1)
        session.save()
        
        self.client.force_authenticate(user=self.student_user)
        response = self.client.post('/api/attendance/scan/scan/', {
            'qr_token': session.qr_token,
            'student_id': self.student_profile.id
        })
        print(response.data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_only_section_teacher_can_open_session(self):
        # Create another teacher
        other_teacher = User.objects.create_user(
            username='other_teacher',
            email='other@test.com', 
            password='password123', 
            role='teacher'
        )
        self.client.force_authenticate(user=other_teacher)
        response = self.client.post('/api/attendance/sessions/open/', {'schedule_id': self.schedule.id})
        print(response.data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_student_cannot_scan_for_others(self):
        # Open session
        session = AttendanceSession.objects.create(schedule=self.schedule)
        
        # Create another student
        other_student_user = User.objects.create_user(
            username='other_student',
            email='other_student@test.com', 
            password='password123', 
            role='student'
        )
        other_profile = StudentProfile.objects.create(user=other_student_user, student_number='2023-0002')
        self.section.students.add(other_profile)

        # Authenticate as first student but try to send other student's ID
        self.client.force_authenticate(user=self.student_user)
        response = self.client.post('/api/attendance/scan/scan/', {
            'qr_token': session.qr_token,
            'student_id': other_profile.id # Trying to scan for other student
        })
        
        # The view uses request.user.student_profile, ignoring the body student_id.
        # So this scan will register for self.student_profile, NOT other_profile.
        # We verify that other_profile does NOT have a record.
        print(response.data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertFalse(AttendanceRecord.objects.filter(session=session, student=other_profile).exists())
        self.assertTrue(AttendanceRecord.objects.filter(session=session, student=self.student_profile).exists())

    def test_teacher_can_manually_override(self):
        session = AttendanceSession.objects.create(schedule=self.schedule)
        record = AttendanceRecord.objects.create(session=session, student=self.student_profile, status='absent')
        
        self.client.force_authenticate(user=self.teacher_user)
        response = self.client.patch(f'/api/attendance/records/{record.id}/', {
            'status': 'present',
            'override_by': self.teacher_user.id
        })
        print(response.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        record.refresh_from_db()
        self.assertEqual(record.status, 'present')

    def test_qr_token_expiration(self):
        session = AttendanceSession.objects.create(schedule=self.schedule)
        session.qr_expires_at = timezone.now() - datetime.timedelta(minutes=1) # Expired
        session.save()

        self.client.force_authenticate(user=self.student_user)
        response = self.client.post('/api/attendance/scan/scan/', {
            'qr_token': session.qr_token,
            'student_id': self.student_profile.id
        })
        print(response.data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('expired', response.data['error'])

    def test_teacher_cannot_mark_attendance_for_other_section(self):
        # Create another section and schedule for another teacher
        other_teacher = User.objects.create_user(username='t2', email='t2@test.com', password='p', role='teacher')
        other_section = Section.objects.create(program=self.prog, instructor=other_teacher, year_level=2)
        other_schedule = ClassSchedule.objects.create(course=self.course, section=other_section, start_time='10:00', end_time='12:00', room='B')
        other_session = AttendanceSession.objects.create(schedule=other_schedule)
        other_record = AttendanceRecord.objects.create(session=other_session, student=self.student_profile, status='absent')

        # Current teacher tries to modify record of other teacher's section
        self.client.force_authenticate(user=self.teacher_user)
        response = self.client.patch(f'/api/attendance/records/{other_record.id}/', {'status': 'present'})
        print(response.data)
        # This should be forbidden (or not found if filtered out).
        # Since we filtered the queryset, it returns 404 Not Found.
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_multiple_sessions_per_day(self):
        # Create session 1
        session1 = AttendanceSession.objects.create(schedule=self.schedule)
        session1.closed_at = timezone.now()
        session1.save()
        
        # Create session 2
        self.client.force_authenticate(user=self.teacher_user)
        response = self.client.post('/api/attendance/sessions/open/', {'schedule_id': self.schedule.id})
        print(response.data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(AttendanceSession.objects.filter(schedule=self.schedule).count(), 2)

    def test_duplicate_scan_prevention(self):
        session = AttendanceSession.objects.create(schedule=self.schedule)
        
        self.client.force_authenticate(user=self.student_user)
        # First scan
        self.client.post('/api/attendance/scan/scan/', {'qr_token': session.qr_token})
        
        # Second scan
        response = self.client.post('/api/attendance/scan/scan/', {'qr_token': session.qr_token})
        print(response.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], 'Attendance already recorded')
        self.assertEqual(AttendanceRecord.objects.filter(session=session, student=self.student_profile).count(), 1)

    def test_attendance_summary_endpoint(self):
        session = AttendanceSession.objects.create(schedule=self.schedule)
        AttendanceRecord.objects.create(session=session, student=self.student_profile, status='present')
        
        self.client.force_authenticate(user=self.teacher_user)
        response = self.client.get(f'/api/attendance/sessions/{session.id}/records/')
        print(response.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['student_name'], 'Student User')

    def test_student_not_enrolled_cannot_scan(self):
        # Create session
        session = AttendanceSession.objects.create(schedule=self.schedule)
        
        # Create another student not in section
        other_student = User.objects.create_user(username='other', email='other@test.com', password='p', role='student')
        StudentProfile.objects.create(user=other_student, student_number='2023-9999')
        
        self.client.force_authenticate(user=other_student)
        response = self.client.post('/api/attendance/scan/scan/', {'qr_token': session.qr_token})
        print(response.data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_teacher_can_close_session(self):
        session = AttendanceSession.objects.create(schedule=self.schedule)
        self.client.force_authenticate(user=self.teacher_user)
        response = self.client.post(f'/api/attendance/sessions/{session.id}/close/')
        print(response.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        session.refresh_from_db()
        self.assertIsNotNone(session.closed_at)

    def test_non_owner_cannot_close_session(self):
        session = AttendanceSession.objects.create(schedule=self.schedule)
        
        # Other teacher
        other_teacher = User.objects.create_user(username='t3', email='t3@test.com', password='p', role='teacher')
        self.client.force_authenticate(user=other_teacher)
        
        # Depending on permission class IsTeacher, they might pass the class check but fail object level permission if implemented, 
        # or the view logic checks ownership.
        # Let's check view logic: `get_queryset` filters by instructor for teachers.
        # So `get_object()` will raise 404 if not in queryset.
        response = self.client.post(f'/api/attendance/sessions/{session.id}/close/')
        print(response.data)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_scan_invalid_qr_token(self):
        self.client.force_authenticate(user=self.student_user)
        response = self.client.post('/api/attendance/scan/scan/', {'qr_token': 'invalid-token-uuid'})
        print(response.data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_late_attendance_logic(self):
        session = AttendanceSession.objects.create(schedule=self.schedule)
        # Manually set started_at to 20 mins ago
        session.started_at = timezone.now() - datetime.timedelta(minutes=20)
        session.save()
        
        self.client.force_authenticate(user=self.student_user)
        response = self.client.post('/api/attendance/scan/scan/', {'qr_token': session.qr_token})
        print(response.data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['attendance_status'], 'late')
        
        record = AttendanceRecord.objects.get(session=session, student=self.student_profile)
        self.assertEqual(record.status, 'late')

    def test_admin_can_override_attendance(self):
        session = AttendanceSession.objects.create(schedule=self.schedule)
        record = AttendanceRecord.objects.create(session=session, student=self.student_profile, status='absent')
        
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.patch(f'/api/attendance/records/{record.id}/', {'status': 'present'})
        print(response.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        record.refresh_from_db()
        self.assertEqual(record.status, 'present')

    def test_unauthenticated_access_blocked(self):
        response = self.client.post('/api/attendance/sessions/open/', {'schedule_id': self.schedule.id})
        print(response.data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
