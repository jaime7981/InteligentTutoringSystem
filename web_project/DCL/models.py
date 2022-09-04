from statistics import mode
from django.db import models
from usercontrol.models import Teacher, Student
# Create your models here.
class Assignment(models.Model):
    name = models.CharField(max_length=200, null=True, blank=True)
    level = models.IntegerField(blank=True, null=True)
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    dcl_json = models.JSONField()

    def __str__(self):
        return str(self.dcl_json)