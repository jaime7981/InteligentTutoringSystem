from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, blank=True, null=True)
    first_name = models.CharField(max_length=200, null=True, blank=True)
    last_name = models.CharField(max_length=200, null=True, blank=True)
    bar_progress = models.IntegerField(min_value=0, max_value=20)
    support_progress = models.IntegerField(min_value=0, max_value=30)
    joint_progress = models.IntegerField(min_value=0, max_value=50)
    sliding_progress = models.IntegerField(min_value=0, max_value=30)
    fixed_progress = models.IntegerField(min_value=0, max_value=30)
    force_progress = models.IntegerField(min_value=0, max_value=40)
    momentum_progress = models.IntegerField(min_value=0, max_value=40)
    dist_force_progress = models.IntegerField(min_value=0, max_value=50)



    def __str__(self):
        return str(self.user)

class Teacher(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, blank=True, null=True)
    first_name = models.CharField(max_length=200, null=True, blank=True)
    last_name = models.CharField(max_length=200, null=True, blank=True)
    students = models.ManyToManyField(Student, through='Classroom')

    def __str__(self):
        return str(self.user)

class Classroom(models.Model):
    name = models.CharField(max_length=200, null=True, blank=True)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    date_joined = models.DateField(null=True, blank=True)

    def __str__(self):
        return str(self.name)
