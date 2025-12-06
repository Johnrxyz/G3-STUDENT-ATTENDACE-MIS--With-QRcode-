from django.contrib import admin
from .models import *
# Register your models here.

admin.site.register(Department)
admin.site.register(Program)
admin.site.register(Course)
admin.site.register(Section)
admin.site.register(Day)
admin.site.register(ClassSchedule)
admin.site.register(AttendanceSession)
admin.site.register(AttendanceRecord)
