import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.utils import timezone

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('teacher', 'Teacher'),
        ('student', 'Student'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(_('email address'), unique=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='student')
    firstname = models.CharField(max_length=50)
    lastname = models.CharField(max_length=50)
    gender = models.CharField(max_length=10, choices=[('Male', 'Male'), ('Female', 'Female')], blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'firstname', 'lastname']

    def get_full_name(self):
        return f"{self.firstname} {self.lastname}"

    def __str__(self):
        return self.email

class StudentProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='student_profile', limit_choices_to={'role': 'student'})
    student_number = models.CharField(max_length=20, unique=True)
    qr_code_data = models.TextField(blank=True, null=True)
    sections = models.ManyToManyField('attendance.Section', related_name='students', blank=True)

    def __str__(self):
        return f"{self.student_number} - {self.user.email}"

class ProfileEditRequest(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('denied', 'Denied'),
    )

    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name='edit_requests')
    new_firstname = models.CharField(max_length=50)
    new_lastname = models.CharField(max_length=50)
    reason = models.TextField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    admin_note = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    reviewed_by = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True, related_name='reviewed_requests', limit_choices_to={'role': 'admin'})
    reviewed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Request by {self.student.user.get_full_name()} - {self.status}"
