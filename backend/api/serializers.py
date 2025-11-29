from rest_framework import serializers
from users.models import CustomUser, StudentProfile, Course, Section, Program, Department, ClassSchedule
from attendace.models import AttendanceSession, AttendanceRecord

class AttendanceSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttendanceSession
        fields = ['id', 'schedule', 'date', 'started_at', 'closed_at', 'qr_token', 'qr_expires_at']

class AttendanceRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttendanceRecord
        fields = ['id', 'session', 'student', 'status', 'timestamp', 'override_by', 'override_at']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username','first_name', 'last_name', 'email', 'role']
        extra_kwargs = {
            'password': {'write_only': True}
        }   
    
    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user 


class StudentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentProfile
        fields = ['student_number', 'program', 'section', 'created_at']

    def create(self, validated_data):
        student_profile = StudentProfile.objects.create(**validated_data)
        return student_profile  


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['name', 'code', 'department', 'units']

    def create(self, validated_data):
        course = Course.objects.create(**validated_data)
        return course  


class SectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = ['name', 'program', 'instructor', 'year_level']

    def create(self, validated_data):
        section = Section.objects.create(**validated_data)
        return section  


class ProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = Program
        fields = ['name', 'code', 'department']

    def create(self, validated_data):
        program = Program.objects.create(**validated_data)
        return program  

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['name', 'code']

    def create(self, validated_data):
        department = Department.objects.create(**validated_data)
        return department   

class ScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClassSchedule
        fields = ['course', 'section', 'day_of_week', 'start_time', 'end_time', 'room']

    def create(self, validated_data):
        schedule = ClassSchedule.objects.create(**validated_data)
        return schedule