from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator, MinValueValidator

# Create your models here.
class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, blank=True, null=True)
    first_name = models.CharField(max_length=200, null=True, blank=True)
    last_name = models.CharField(max_length=200, null=True, blank=True)
    bar_progress = models.IntegerField(validators=[MinValueValidator(0),MaxValueValidator(20)], null=True)
    support_progress = models.IntegerField(validators=[MinValueValidator(0),MaxValueValidator(30)], null=True)
    joint_progress = models.IntegerField(validators=[MinValueValidator(0),MaxValueValidator(50)], null=True)
    sliding_progress = models.IntegerField(validators=[MinValueValidator(0),MaxValueValidator(30)], null=True)
    fixed_progress = models.IntegerField(validators=[MinValueValidator(0),MaxValueValidator(30)], null=True)
    force_progress = models.IntegerField(validators=[MinValueValidator(0),MaxValueValidator(40)], null=True)
    momentum_progress = models.IntegerField(validators=[MinValueValidator(0),MaxValueValidator(40)], null=True)
    dist_force_progress = models.IntegerField(validators=[MinValueValidator(0),MaxValueValidator(50)], null=True)



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
