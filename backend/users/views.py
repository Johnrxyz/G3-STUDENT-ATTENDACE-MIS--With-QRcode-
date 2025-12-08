from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from django.utils import timezone
from .models import StudentProfile, ProfileEditRequest
from .serializers import UserSerializer, StudentProfileSerializer, CustomTokenObtainPairSerializer, ProfileEditRequestSerializer
from .permissions import IsAdmin, IsTeacher, IsStudent, IsTeacherOrAdmin

User = get_user_model()

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def get_permissions(self):
        if self.action in ['create']:
            return [permissions.IsAuthenticated(), IsAdmin()]
        return super().get_permissions()

class StudentProfileViewSet(viewsets.ModelViewSet):
    queryset = StudentProfile.objects.all()
    serializer_class = StudentProfileSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeacherOrAdmin | IsStudent]

    def get_queryset(self):
        user = self.request.user
        queryset = StudentProfile.objects.all()
        
        if user.role == 'student':
            queryset = queryset.filter(user=user)
        
        # Filter by section if provided
        section_id = self.request.query_params.get('section')
        if section_id:
            queryset = queryset.filter(sections__id=section_id)
            
        return queryset

    @action(detail=True, methods=['post'], permission_classes=[IsAdmin])
    def regenerate_qr(self, request, pk=None):
        profile = self.get_object()
        # Logic to regenerate QR code (e.g., update qr_code_data with new encrypted string)
        # For now, just simulating a change
        import uuid
        profile.qr_code_data = f"QR-{uuid.uuid4()}" 
        profile.save()
        return Response({'status': 'QR code regenerated', 'qr_code_data': profile.qr_code_data})

class ProfileEditRequestViewSet(viewsets.ModelViewSet):
    queryset = ProfileEditRequest.objects.all()
    serializer_class = ProfileEditRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'student' and hasattr(user, 'student_profile'):
            return ProfileEditRequest.objects.filter(student=user.student_profile)
        elif user.role == 'admin':
            return ProfileEditRequest.objects.all()
        return ProfileEditRequest.objects.none()

    def perform_create(self, serializer):
        # Already handled in serializer, but good for explicit safety
        serializer.save()

    @action(detail=True, methods=['post'], permission_classes=[IsAdmin])
    def approve(self, request, pk=None):
        profile_request = self.get_object()
        if profile_request.status != 'pending':
            return Response({'error': 'Request is not pending'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Update user profile
        student_user = profile_request.student.user
        student_user.firstname = profile_request.new_firstname
        student_user.lastname = profile_request.new_lastname
        student_user.save()

        profile_request.status = 'approved'
        profile_request.reviewed_by = request.user
        profile_request.reviewed_at = timezone.now()
        profile_request.save()
        return Response({'status': 'approved'})

    @action(detail=True, methods=['post'], permission_classes=[IsAdmin])
    def deny(self, request, pk=None):
        profile_request = self.get_object()
        if profile_request.status != 'pending':
            return Response({'error': 'Request is not pending'}, status=status.HTTP_400_BAD_REQUEST)
        
        profile_request.status = 'denied'
        profile_request.admin_note = request.data.get('admin_note', '')
        profile_request.reviewed_by = request.user
        profile_request.reviewed_at = timezone.now()
        profile_request.save()
        return Response({'status': 'denied'})
