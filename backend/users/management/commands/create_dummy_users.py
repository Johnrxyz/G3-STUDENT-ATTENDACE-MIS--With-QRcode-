from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from users.models import StudentProfile
import uuid

User = get_user_model()

class Command(BaseCommand):
    help = 'Creates dummy users for testing authorization'

    def handle(self, *args, **options):
        # Admin
        admin_email = 'admin@example.com'
        admin_username = 'admin'
        if not User.objects.filter(username=admin_username).exists() and not User.objects.filter(email=admin_email).exists():
            User.objects.create_superuser(
                username=admin_username,
                email=admin_email,
                password='password123',
                role='admin',
                firstname='System',
                lastname='Admin'
            )
            self.stdout.write(self.style.SUCCESS('Created Admin user: admin@example.com / password123'))
        else:
             self.stdout.write(self.style.WARNING('Admin user already exists'))

        # Teacher
        teacher_email = 'teacher@example.com'
        teacher_username = 'teacher'
        if not User.objects.filter(username=teacher_username).exists() and not User.objects.filter(email=teacher_email).exists():
            User.objects.create_user(
                username=teacher_username,
                email=teacher_email,
                password='password123',
                role='teacher',
                firstname='John',
                lastname='Teacher'
            )
            self.stdout.write(self.style.SUCCESS('Created Teacher user: teacher@example.com / password123'))
        else:
             self.stdout.write(self.style.WARNING('Teacher user already exists'))

        # Student
        student_email = 'student@example.com'
        student_username = 'student'
        if not User.objects.filter(username=student_username).exists() and not User.objects.filter(email=student_email).exists():
            student_user = User.objects.create_user(
                username=student_username,
                email=student_email,
                password='password123',
                role='student',
                firstname='Jane',
                lastname='Student'
            )
            
            StudentProfile.objects.create(
                user=student_user,
                student_number='2024-001',
                qr_code_data=f"QR-{uuid.uuid4()}"
            )
            self.stdout.write(self.style.SUCCESS('Created Student user: student@example.com / password123'))
        else:
             self.stdout.write(self.style.WARNING('Student user already exists'))
