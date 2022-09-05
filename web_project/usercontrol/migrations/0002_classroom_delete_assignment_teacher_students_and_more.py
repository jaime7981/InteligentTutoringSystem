# Generated by Django 4.1 on 2022-09-04 15:25

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('usercontrol', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Classroom',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=200, null=True)),
                ('date_joined', models.DateField()),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='usercontrol.student')),
            ],
        ),
        migrations.DeleteModel(
            name='Assignment',
        ),
        migrations.AddField(
            model_name='teacher',
            name='students',
            field=models.ManyToManyField(through='usercontrol.Classroom', to='usercontrol.student'),
        ),
        migrations.AddField(
            model_name='classroom',
            name='teacher',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='usercontrol.teacher'),
        ),
    ]