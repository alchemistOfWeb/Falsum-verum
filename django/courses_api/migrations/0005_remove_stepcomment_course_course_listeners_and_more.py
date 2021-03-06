# Generated by Django 4.0.4 on 2022-05-18 13:50

from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('courses_api', '0004_course_doshow_module_doshow_module_grade'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='stepcomment',
            name='course',
        ),
        migrations.AddField(
            model_name='course',
            name='listeners',
            field=models.ManyToManyField(related_name='undergoing_courses', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='lesson',
            name='lesson_type',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='courses_api.lessontype'),
        ),
        migrations.AddField(
            model_name='stepcomment',
            name='step',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='comments', to='courses_api.step'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='course',
            name='authors',
            field=models.ManyToManyField(related_name='own_courses', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='lessontype',
            name='icon',
            field=models.ImageField(blank=True, null=True, upload_to='lessons/types/', validators=[django.core.validators.FileExtensionValidator(allowed_extensions=['svg', 'ico', 'icon'])]),
        ),
        migrations.CreateModel(
            name='StepReaction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('value', models.SmallIntegerField(choices=[(0, 'dislike'), (1, 'like')])),
                ('step', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reactions', to='courses_api.step')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='LessonReaction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('value', models.SmallIntegerField(choices=[(0, 'dislike'), (1, 'like')])),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('lesson', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reactions', to='courses_api.lesson')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
