# Generated by Django 4.1 on 2022-09-04 20:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('usercontrol', '0002_classroom_delete_assignment_teacher_students_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='classroom',
            name='date_joined',
            field=models.DateField(blank=True, null=True),
        ),
    ]
