from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import StudentProfile, ProfileEditRequest

User = get_user_model()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['role'] = user.role
        token['username'] = user.username
        token['email'] = user.email
        token['full_name'] = user.get_full_name()
        
        return token

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'password', 'role', 'firstname', 'lastname', 'gender', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

class StudentProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), source='user', write_only=True)
    section_names = serializers.StringRelatedField(many=True, source='sections', read_only=True)

    class Meta:
        model = StudentProfile
        fields = ['id', 'user', 'user_id', 'student_number', 'qr_code_data', 'sections', 'section_names']
        read_only_fields = ['qr_code_data']

class ProfileEditRequestSerializer(serializers.ModelSerializer):
    student = StudentProfileSerializer(read_only=True)
    student_name = serializers.CharField(source='student.user.get_full_name', read_only=True)
    student_number = serializers.CharField(source='student.student_number', read_only=True)

    class Meta:
        model = ProfileEditRequest
        fields = ['id', 'student', 'student_name', 'student_number', 'new_firstname', 'new_lastname', 'reason', 'status', 'admin_note', 'created_at', 'updated_at', 'reviewed_by', 'reviewed_at']
        read_only_fields = ['id', 'student', 'status', 'admin_note', 'created_at', 'updated_at', 'reviewed_by', 'reviewed_at']

    def create(self, validated_data):
        user = self.context['request'].user
        if not hasattr(user, 'student_profile'):
             raise serializers.ValidationError("Only students can create edit requests.")
        validated_data['student'] = user.student_profile
        return super().create(validated_data)

class StudentRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    section_id = serializers.IntegerField(write_only=True)
    student_number = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'password', 'firstname', 'lastname', 'gender', 'section_id', 'student_number']

    def create(self, validated_data):
        section_id = validated_data.pop('section_id')
        student_number = validated_data.pop('student_number')
        password = validated_data.pop('password')
        
        # Enforce student role
        validated_data['role'] = 'student'
        validated_data['username'] = validated_data['email'] # Use email as username

        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()

        # Create Profile
        from attendance.models import Section
        profile = StudentProfile.objects.create(user=user, student_number=student_number)
        
        try:
            section = Section.objects.get(id=section_id)
            profile.sections.add(section)
        except Section.DoesNotExist:
            pass # Or raise error

        return user
