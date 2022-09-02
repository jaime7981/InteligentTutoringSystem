from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save

# Create your models here.

class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, blank=True, null=True)
    first_name = models.CharField(max_length=200, null=True, blank=True)
    last_name = models.CharField(max_length=200, null=True, blank=True)

    def __str__(self):
        return str(self.user)

class Teacher(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, blank=True, null=True)
    first_name = models.CharField(max_length=200, null=True, blank=True)
    last_name = models.CharField(max_length=200, null=True, blank=True)

    def __str__(self):
        return str(self.user)

class Assignment(models.Model):
    name = models.CharField(max_length=200, null=True, blank=True)
    dcl_json = models.JSONField()

    def __str__(self):
        return str("Assignment model")

def create_student(sender, instance, created, **kargs):
    if created:
        Student.objects.create(user=instance)
        print('Student Created')

def create_teacher(sender, instance, created, **kargs):
    if created:
        Teacher.objects.create(user=instance)
        print('Teacher Created')

def update_student(sender, instance, created, **kargs):
    if created == False:
        instance.student.save()

def update_teacher(sender, instance, created, **kargs):
    if created == False:
        instance.student.save()

