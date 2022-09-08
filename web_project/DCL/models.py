from django.db import models
from usercontrol.models import Teacher, Student
import os

def get_upload_path(instance, filename):
    return os.path.join("assignment/%s" % instance.teacher.user.username, filename)

# Create your models here.
class Assignment(models.Model):
    name = models.CharField(max_length=200, null=True, blank=True)
    description = models.CharField(max_length=500, null=True, blank=True)

    level = models.IntegerField(blank=True, null=True)
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    dcl_json = models.JSONField()
    photo = models.ImageField(upload_to=get_upload_path, blank=True, null=True)

    def __str__(self):
        return str(self.dcl_json)

class Solution(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE)

    dcl_json_par1 = models.JSONField()
    dcl_json_par2 = models.JSONField()
    eq_x = models.JSONField()

    def __str__(self):
        return str(self.dcl_json)