from rest_framework import serializers
from attendance.models import Department, Program, Course, Section, Day, ClassSchedule, AttendanceSession, AttendanceRecord
from users.serializers import StudentProfileSerializer, UserSerializer
from qr.models import ScanDevice, AuditLog, SystemSettings

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'

class ProgramSerializer(serializers.ModelSerializer):
    department_name = serializers.ReadOnlyField(source='department.name')

    class Meta:
        model = Program
        fields = ['id', 'department', 'department_name', 'name', 'code']

class CourseSerializer(serializers.ModelSerializer):
    department_name = serializers.ReadOnlyField(source='department.name')

    class Meta:
        model = Course
        fields = ['id', 'department', 'department_name', 'name', 'code', 'units']

class SectionSerializer(serializers.ModelSerializer):
    program_name = serializers.ReadOnlyField(source='program.name')
    instructor_name = serializers.ReadOnlyField(source='instructor.get_full_name')

    class Meta:
        model = Section
        fields = ['id', 'program', 'program_name', 'instructor', 'instructor_name', 'year_level', 'section_name']
        read_only_fields = ['section_name']

class DaySerializer(serializers.ModelSerializer):
    class Meta:
        model = Day
        fields = '__all__'

class ClassScheduleSerializer(serializers.ModelSerializer):
    course_name = serializers.ReadOnlyField(source='course.name')
    section_name = serializers.ReadOnlyField(source='section.section_name')
    day_names = serializers.StringRelatedField(many=True, source='days', read_only=True)

    class Meta:
        model = ClassSchedule
        fields = ['id', 'course', 'course_name', 'section', 'section_name', 'days', 'day_names', 'start_time', 'end_time', 'room']

class AttendanceSessionSerializer(serializers.ModelSerializer):
    schedule_info = serializers.StringRelatedField(source='schedule', read_only=True)

    class Meta:
        model = AttendanceSession
        fields = ['id', 'schedule', 'schedule_info', 'date', 'started_at', 'closed_at', 'qr_token', 'qr_expires_at']
        read_only_fields = ['qr_token', 'started_at']

class AttendanceRecordSerializer(serializers.ModelSerializer):
    student_name = serializers.ReadOnlyField(source='student.user.get_full_name')
    student_number = serializers.ReadOnlyField(source='student.student_number')

    class Meta:
        model = AttendanceRecord
        fields = ['id', 'session', 'student', 'student_name', 'student_number', 'status', 'timestamp', 'override_by', 'override_at']
        read_only_fields = ['timestamp']

class ScanDeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScanDevice
        fields = '__all__'

class AuditLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditLog
        fields = '__all__'

class SystemSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemSettings
        fields = '__all__'