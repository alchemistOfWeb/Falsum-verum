from multiprocessing.sharedctypes import Value
from django.db import models
from django.contrib.auth.models import User
from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation
from imagekit.models import ProcessedImageField
from imagekit.processors import ResizeToFit
from django.core.validators import FileExtensionValidator
from ckeditor_uploader.fields import RichTextUploadingField
import ckeditor


class Profile(models.Model):    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    score = models.PositiveBigIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True)
    is_blocked = models.BooleanField(default=False, blank=True)
    image_sm = ProcessedImageField(verbose_name="avatar(sm)",
                                upload_to='images/avatars/sm/',
                                processors=[ResizeToFit(100, 100)],
                                format='JPEG',
                                options={'quality': 90},
                                blank=True,
                                null=True)
    image_md = ProcessedImageField(verbose_name="avatar(md)",
                                upload_to='images/avatars/md/',
                                processors=[ResizeToFit(300, 400)],
                                format='JPEG',
                                options={'quality': 90},
                                blank=True,
                                null=True)


class Organization(models.Model): 
    title = models.CharField(max_length=512)

    def __str__(self) -> str:
        return self.title


class UserInOrganization(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)


class Specialization(models.Model): # mb another name is Specialization
    title = models.CharField(max_length=512, null=False)
    description = ckeditor.fields.RichTextField(max_length=5000, null=True, blank=True)
    image_sm = ProcessedImageField(verbose_name="image(sm)",
                                upload_to='images/avatars/sm/',
                                processors=[ResizeToFit(100, 100)],
                                format='JPEG',
                                options={'quality': 90},
                                blank=True,
                                null=True)
    banner_lg = ProcessedImageField(verbose_name="banner(lg)",
                                upload_to='images/avatars/sm/',
                                processors=[ResizeToFit(1000, 300)],
                                format='JPEG',
                                options={'quality': 90},
                                blank=True,
                                null=True)

    def __str__(self) -> str:
        return self.title


class TagForCourse(models.Model):
    title = models.CharField(max_length=512, null=False)


class Course(models.Model):
    title = models.CharField(max_length=512, null=False)
    description = ckeditor.fields.RichTextField(max_length=5000, null=True, blank=True)
    duration = models.DurationField('продолжительность курса', null=True, blank=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    specialization = models.ForeignKey(Specialization, on_delete=models.CASCADE, null=True, blank=True)
    tags = models.ManyToManyField(TagForCourse, related_name="courses")
    # roadmap = models.JSONField(null=False, blank=True, default=Value('null')) # in future
    # category = models.ForeignKey(CourseCategory, on_delete=models.SET_NULL, null=True, blank=False)
    image_sm = ProcessedImageField(verbose_name="image(sm)",
                                upload_to='images/avatars/sm/',
                                processors=[ResizeToFit(100, 100)],
                                format='JPEG',
                                options={'quality': 90},
                                blank=True,
                                null=True)
    banner_lg = ProcessedImageField(verbose_name="banner(lg)",
                                upload_to='images/avatars/sm/',
                                processors=[ResizeToFit(1000, 300)],
                                format='JPEG',
                                options={'quality': 90},
                                blank=True,
                                null=True)


# class CourseRoadmap(models.Model): ... # mongo?


class CourseReport(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    content = ckeditor.fields.RichTextField(max_length=5000, null=True, blank=True)


class CourseSection(models.Model): 
    title = models.CharField(max_length=512, null=False)
    

    def __str__(self) -> str:
        return self.title

class LessonType(models.Model): 
    title = models.CharField(max_length=255, null=False)
    icon = models.ImageField(
        upload_to='lessons/types/',
        validators=[
            FileExtensionValidator(
                allowed_extensions=['svg', 'icon']
            )
        ],
        null=True, 
        blank=True
    )


class Lesson(models.Model): 
    title = models.CharField(max_length=512, null=False)
    section = models.ForeignKey(CourseSection, 
                                on_delete=models.CASCADE, 
                                related_name='lessons')
    doshow = models.BooleanField(default=False, blank=True)


    def __str__(self) -> str:
        return self.title


class StepType(models.IntegerChoices):
    LECTURE = 0, 'lecture'
    TEST = 1, 'test'


class Step(models.Model):
    title = models.CharField(max_length=512, null=False)
    step_type = models.CharField(choices=StepType.choices, null=False)
    content = RichTextUploadingField(max_length=4096, null=True, blank=True)
    doshow = models.BooleanField(default=False, blank=True)
    video = models.FileField(
        upload_to='lessons/videos/',
        validators=[
            FileExtensionValidator(
                allowed_extensions=['mp3', 'mp4', 'avi', 'ogg', 'webm']
            )
        ],
        null=True, 
        blank=True
    )
    test = models.JSONField(null=True, blank=True)
    order = models.SmallIntegerField(null=True, blank=True)

    def __str__(self) -> str:
        return self.title

# балы за урок
# сертификат
# дз

    

# class Topic(models.Model):
#     title = models.CharField(max_length=255)
#     section = models.ForeignKey(Section, on_delete=models.SET_NULL, related_name="topics", null=True)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)
#     is_blocked = models.BooleanField(default=False, blank=True)
#     is_open = models.BooleanField(default=True, blank=True)

#     def __str__(self) -> str:
#         return self.title



    
#     def __str__(self) -> str:
#         return self.user.username


# class TopicComment(models.Model):
#     author = models.ForeignKey(User, on_delete=models.CASCADE, blank=True)
#     topic = models.ForeignKey(Topic, on_delete=models.CASCADE, related_name="comments")
#     content = models.TextField(max_length=3000, blank=False, null=False)
#     likes = models.PositiveIntegerField(default=0)
#     is_blocked = models.BooleanField(default=False, blank=True)
#     is_archive = models.BooleanField(default=False, blank=True)
