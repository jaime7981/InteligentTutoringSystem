# Generated by Django 4.1 on 2022-09-26 00:10

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('usercontrol', '0003_alter_classroom_date_joined'),
    ]

    operations = [
        migrations.AddField(
            model_name='student',
            name='bar_progress',
            field=models.IntegerField(null=True, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(20)]),
        ),
        migrations.AddField(
            model_name='student',
            name='dist_force_progress',
            field=models.IntegerField(null=True, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(50)]),
        ),
        migrations.AddField(
            model_name='student',
            name='fixed_progress',
            field=models.IntegerField(null=True, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(30)]),
        ),
        migrations.AddField(
            model_name='student',
            name='force_progress',
            field=models.IntegerField(null=True, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(40)]),
        ),
        migrations.AddField(
            model_name='student',
            name='joint_progress',
            field=models.IntegerField(null=True, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(50)]),
        ),
        migrations.AddField(
            model_name='student',
            name='momentum_progress',
            field=models.IntegerField(null=True, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(40)]),
        ),
        migrations.AddField(
            model_name='student',
            name='sliding_progress',
            field=models.IntegerField(null=True, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(30)]),
        ),
        migrations.AddField(
            model_name='student',
            name='support_progress',
            field=models.IntegerField(null=True, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(30)]),
        ),
    ]
