from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .models import StudentProfile
from .serializers import UserSerializer, StudentProfileSerializer
from .permissions import IsAdmin, IsTeacher, IsStudent, IsTeacherOrAdmin

User = get_user_model()

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
    permission_classes = [permissions.IsAuthenticated, IsTeacherOrAdmin]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'student':
            return StudentProfile.objects.filter(user=user)
        return StudentProfile.objects.all()

    @action(detail=True, methods=['post'], permission_classes=[IsAdmin])
    def regenerate_qr(self, request, pk=None):
        profile = self.get_object()
        # Logic to regenerate QR code (e.g., update qr_code_data with new encrypted string)
        # For now, just simulating a change
        import uuid
        profile.qr_code_data = f"QR-{uuid.uuid4()}" 
        profile.save()
        return Response({'status': 'QR code regenerated', 'qr_code_data': profile.qr_code_data})
