from django.db import models
from users.models import StudentProfile, ClassSchedule, CustomUser

ATTENDANCE_STATUS = [
    ('present', 'Present'),
    ('late', 'Late'),
    ('absent', 'Absent'),
    ('excused', 'Excused'),
]


class AttendanceSession(models.Model):
    schedule = models.ForeignKey(ClassSchedule, on_delete=models.CASCADE)
    date = models.DateField()
    
    started_at = models.DateTimeField()
    closed_at = models.DateTimeField(null=True, blank=True)

    qr_token = models.CharField(max_length=255, unique=True)
    qr_expires_at = models.DateTimeField()

    def __str__(self):
        return f"Session {self.schedule} ({self.date})"


class AttendanceRecord(models.Model):
    session = models.ForeignKey(AttendanceSession, on_delete=models.CASCADE)
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=ATTENDANCE_STATUS)
    timestamp = models.DateTimeField(auto_now_add=True)

    override_by = models.ForeignKey(
        CustomUser, null=True, blank=True, on_delete=models.SET_NULL
    )
    override_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('session', 'student')

    def __str__(self):
        return f"{self.student} - {self.session}"
