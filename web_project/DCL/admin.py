from django.contrib import admin

# Register your models here.
from .models import Assignment, Solution

# Register your models here.
admin.site.register(Assignment)
admin.site.register(Solution)
