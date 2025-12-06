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
    course_code = serializers.ReadOnlyField(source='course.code')
    section_name = serializers.ReadOnlyField(source='section.section_name')
    day_names = serializers.StringRelatedField(many=True, source='days', read_only=True)
    student_count = serializers.IntegerField(source='section.students.count', read_only=True)

    class Meta:
        model = ClassSchedule
        fields = ['id', 'course', 'course_name', 'course_code', 'section', 'section_name', 'days', 'day_names', 'start_time', 'end_time', 'room', 'student_count']

class AttendanceSessionSerializer(serializers.ModelSerializer):
    schedule_info = serializers.StringRelatedField(source='schedule', read_only=True)
    course_name = serializers.ReadOnlyField(source='schedule.course.name')
    course_code = serializers.ReadOnlyField(source='schedule.course.code')
    section_name = serializers.ReadOnlyField(source='schedule.section.section_name')
    
    total_students = serializers.SerializerMethodField()
    present_count = serializers.SerializerMethodField()
    absent_count = serializers.SerializerMethodField()

    class Meta:
        model = AttendanceSession
        fields = ['id', 'schedule', 'schedule_info', 'course_name', 'course_code', 'section_name', 
                  'date', 'started_at', 'closed_at', 'qr_token', 'qr_expires_at',
                  'total_students', 'present_count', 'absent_count']
        read_only_fields = ['qr_token', 'started_at']

    def get_total_students(self, obj):
        return obj.schedule.section.students.count()

    def get_present_count(self, obj):
        return obj.records.filter(status__in=['present', 'late']).count()

    def get_absent_count(self, obj):
        # Absent = Total - Present (assuming no record means absent)
        total = self.get_total_students(obj)
        present = self.get_present_count(obj)
        return total - present

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