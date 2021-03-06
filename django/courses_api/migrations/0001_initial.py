# Generated by Django 4.0.4 on 2022-05-17 13:16

import ckeditor.fields
import ckeditor_uploader.fields
from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion
import imagekit.models.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='Course',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=512)),
                ('description', ckeditor.fields.RichTextField(blank=True, max_length=5000, null=True)),
                ('duration', models.DurationField(blank=True, null=True, verbose_name='продолжительность курса')),
                ('image_sm', imagekit.models.fields.ProcessedImageField(blank=True, null=True, upload_to='images/avatars/sm/', verbose_name='image(sm)')),
                ('banner_lg', imagekit.models.fields.ProcessedImageField(blank=True, null=True, upload_to='images/avatars/sm/', verbose_name='banner(lg)')),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='LessonType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('icon', models.ImageField(blank=True, null=True, upload_to='lessons/types/', validators=[django.core.validators.FileExtensionValidator(allowed_extensions=['svg', 'icon'])])),
            ],
        ),
        migrations.CreateModel(
            name='Organization',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=512)),
            ],
        ),
        migrations.CreateModel(
            name='Specialization',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=512)),
                ('description', ckeditor.fields.RichTextField(blank=True, max_length=5000, null=True)),
                ('image_sm', imagekit.models.fields.ProcessedImageField(blank=True, null=True, upload_to='images/avatars/sm/', verbose_name='image(sm)')),
                ('banner_lg', imagekit.models.fields.ProcessedImageField(blank=True, null=True, upload_to='images/avatars/sm/', verbose_name='banner(lg)')),
            ],
        ),
        migrations.CreateModel(
            name='Step',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=512)),
                ('step_type', models.IntegerField(choices=[(0, 'lecture'), (1, 'test')])),
                ('content', ckeditor_uploader.fields.RichTextUploadingField(blank=True, max_length=4096, null=True)),
                ('doshow', models.BooleanField(blank=True, default=False)),
                ('video', models.URLField(blank=True, null=True)),
                ('test', models.JSONField(blank=True, null=True)),
                ('order', models.SmallIntegerField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='TagForCourse',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=512)),
            ],
        ),
        migrations.CreateModel(
            name='UserInOrganization',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('organization', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='courses_api.organization')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='StepComment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', ckeditor.fields.RichTextField(blank=True, max_length=1000, null=True)),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('course', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='courses_api.course')),
            ],
        ),
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('score', models.PositiveBigIntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('is_blocked', models.BooleanField(blank=True, default=False)),
                ('image_sm', imagekit.models.fields.ProcessedImageField(blank=True, null=True, upload_to='images/avatars/sm/', verbose_name='avatar(sm)')),
                ('image_md', imagekit.models.fields.ProcessedImageField(blank=True, null=True, upload_to='images/avatars/md/', verbose_name='avatar(md)')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='profile', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='organization',
            name='users',
            field=models.ManyToManyField(related_name='organization', through='courses_api.UserInOrganization', to=settings.AUTH_USER_MODEL),
        ),
        migrations.CreateModel(
            name='Module',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=512)),
                ('description', ckeditor.fields.RichTextField(blank=True, max_length=1000, null=True)),
                ('authors', models.ManyToManyField(related_name='modules', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Lesson',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=512)),
                ('doshow', models.BooleanField(blank=True, default=False)),
                ('section', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='lessons', to='courses_api.module')),
            ],
        ),
        migrations.CreateModel(
            name='CourseReport',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', ckeditor.fields.RichTextField(blank=True, max_length=5000, null=True)),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('course', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='courses_api.course')),
            ],
        ),
        migrations.AddField(
            model_name='course',
            name='specialization',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='courses_api.specialization'),
        ),
        migrations.AddField(
            model_name='course',
            name='tags',
            field=models.ManyToManyField(related_name='courses', to='courses_api.tagforcourse'),
        ),
    ]
