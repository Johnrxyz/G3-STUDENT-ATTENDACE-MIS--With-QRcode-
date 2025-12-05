from django.db import models
from django.conf import settings
from django.utils import timezone
import datetime
import uuid

class Department(models.Model):
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=20, unique=True)

    def __str__(self):
        return self.name

class Program(models.Model):
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='programs')
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20, unique=True)

    def __str__(self):
        return self.name

class Course(models.Model):
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='courses')
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20, unique=True)
    units = models.IntegerField(default=3)

    def __str__(self):
        return f"{self.code} - {self.name}"

class Section(models.Model):
    program = models.ForeignKey(Program, on_delete=models.CASCADE, related_name='sections')
    instructor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, limit_choices_to={'role': 'teacher'}, related_name='sections')
    year_level = models.IntegerField()
    section_name = models.CharField(max_length=50, blank=True) # Auto-generated

    def save(self, *args, **kwargs):
        if not self.section_name:
            # Simple auto-generation logic: Program Code + Year Level + "A" (placeholder logic)
            # In a real app, you'd check for existing sections to increment A, B, C...
            count = Section.objects.filter(program=self.program, year_level=self.year_level).count()
            suffix = chr(65 + count) # A, B, C...
            self.section_name = f"{self.program.code} {self.year_level}{suffix}"
        super().save(*args, **kwargs)

    def __str__(self):
        return self.section_name

class Day(models.Model):
    name = models.CharField(max_length=10, unique=True) # Monday, Tuesday...

    def __str__(self):
        return self.name

class ClassSchedule(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='schedules')
    section = models.ForeignKey(Section, on_delete=models.CASCADE, related_name='schedules')
    days = models.ManyToManyField(Day)
    start_time = models.TimeField()
    end_time = models.TimeField()
    room = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.course.code} - {self.section.section_name} ({self.start_time}-{self.end_time})"

class AttendanceSession(models.Model):
    schedule = models.ForeignKey(ClassSchedule, on_delete=models.CASCADE, related_name='sessions')
    date = models.DateField(default=datetime.date.today)
    started_at = models.DateTimeField(auto_now_add=True)
    closed_at = models.DateTimeField(null=True, blank=True)
    qr_token = models.CharField(max_length=100, blank=True) # Randomized token
    qr_expires_at = models.DateTimeField(null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.qr_token:
            self.qr_token = str(uuid.uuid4())
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.schedule} - {self.date}"

class AttendanceRecord(models.Model):
    STATUS_CHOICES = (
        ('present', 'Present'),
        ('absent', 'Absent'),
        ('late', 'Late'),
        ('excused', 'Excused'),
    )

    session = models.ForeignKey(AttendanceSession, on_delete=models.CASCADE, related_name='records')
    student = models.ForeignKey('users.StudentProfile', on_delete=models.CASCADE, related_name='attendance_records')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='absent')
    timestamp = models.DateTimeField(auto_now_add=True)
    override_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='overridden_attendance')
    override_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('session', 'student')

    def __str__(self):
        return f"{self.student} - {self.status}" 
