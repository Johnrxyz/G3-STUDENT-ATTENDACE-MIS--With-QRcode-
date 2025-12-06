from django.contrib import admin
from .models import CustomUser, StudentProfile

# Register your models here.
admin.site.register(CustomUser)
admin.site.register(StudentProfile)

