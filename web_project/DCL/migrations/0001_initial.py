# Generated by Django 4.1 on 2022-09-04 15:25

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('usercontrol', '0002_classroom_delete_assignment_teacher_students_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Assignment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=200, null=True)),
                ('level', models.IntegerField(blank=True, null=True)),
                ('dcl_json', models.JSONField()),
                ('teacher', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='usercontrol.teacher')),
            ],
        ),
    ]
