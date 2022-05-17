from multiprocessing.sharedctypes import Value
from tabnanny import verbose
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

    class Meta:
        verbose_name_plural = '     Profiles' # 5


class Organization(models.Model): 
    title = models.CharField(max_length=512)
    created_at = models.DateTimeField(auto_now_add=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True)
    users = models.ManyToManyField(
        User, 
        related_name='organizations', 
        through='courses_api.UserInOrganization',
        through_fields=('organization', 'user')
    )


    def __str__(self) -> str:
        return self.title

    class Meta:
        verbose_name_plural = '    Organizations' # 4



class UserInOrganization(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    join_at = models.DateTimeField(auto_now_add=True, blank=True)


class Specialization(models.Model): # mb another name is Specialization
    title = models.CharField(max_length=512, null=False)
    organization = models.ForeignKey(
        Organization, 
        related_name='specializations',
        null=True, blank=False,
        on_delete=models.CASCADE
    )
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

    class Meta:
        verbose_name_plural = '   Specializations' # 4


class TagForCourse(models.Model):
    title = models.CharField(max_length=512, null=False)

    def __str__(self) -> str:
        return self.title


class Course(models.Model):
    title = models.CharField(max_length=512, null=False)
    description = ckeditor.fields.RichTextField(max_length=5000, null=True, blank=True)
    duration = models.DurationField('продолжительность курса', null=True, blank=True)
    doshow = models.BooleanField(default=False, blank=True)
    authors = models.ManyToManyField(User, related_name="courses")
    specialization = models.ForeignKey(
        Specialization, 
        related_name='courses',
        on_delete=models.CASCADE, 
        null=True, blank=True
    )
    organization = models.ForeignKey(
        Organization, 
        related_name='courses',
        null=True, blank=False,
        on_delete=models.CASCADE
    )
    order_in_specialization = models.SmallIntegerField(null=False, default=0)
    tags = models.ManyToManyField(TagForCourse, related_name="courses")
    # roadmap = models.JSONField(null=False, blank=True, default=Value('null')) # in future
    # category = models.ForeignKey(CourseCategory, on_delete=models.SET_NULL, null=True, blank=False)
    created_at = models.DateTimeField(auto_now_add=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True)
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


# class CourseRoadmap(models.Model): ... # mongo?


class CourseReport(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True)
    content = ckeditor.fields.RichTextField(max_length=5000, null=False, default='', blank=True)


class Module(models.Model): 
    title = models.CharField(max_length=512, null=False)
    course = models.ForeignKey(
        Course, 
        related_name='modules',
        null=True, blank=False,
        on_delete=models.CASCADE
    )
    description = ckeditor.fields.RichTextField(max_length=1000, null=True, blank=True)
    authors = models.ManyToManyField(User, related_name="modules")
    order = models.SmallIntegerField(null=False, default=0)
    grade = models.PositiveIntegerField(null=False, default=0)
    doshow = models.BooleanField(default=False, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True)

    def __str__(self) -> str:
        return self.title


class LessonType(models.Model): 
    title = models.CharField(max_length=255, null=False)
    icon = models.ImageField(
        upload_to='lessons/types/',
        validators=[
            FileExtensionValidator(
                allowed_extensions=['svg', 'ico', 'icon']
            )
        ],
        null=True, 
        blank=True
    )

    def __str__(self):
        return self.title


class Lesson(models.Model): 
    title = models.CharField(max_length=512, null=False)
    module = models.ForeignKey(
        Module, 
        related_name='lessons',
        null=True, blank=False,
        on_delete=models.CASCADE
    )
    doshow = models.BooleanField(default=False, blank=True)
    grade = models.PositiveIntegerField(null=False, default=0)
    order = models.SmallIntegerField(null=False, default=0)
    created_at = models.DateTimeField(auto_now_add=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True)


    def __str__(self) -> str:
        return self.title


class StepType(models.IntegerChoices):
    LECTURE = 0, 'lecture'
    TEST = 1, 'test'


class Step(models.Model):
    title = models.CharField(max_length=512, null=False)
    lesson = models.ForeignKey(
        Lesson, 
        related_name='steps', 
        null=True, blank=False, 
        on_delete=models.CASCADE
    )
    step_type = models.IntegerField(choices=StepType.choices, null=False)
    content = RichTextUploadingField(max_length=4096, null=False, default='', blank=True)
    doshow = models.BooleanField(default=False, blank=True)
    grade = models.PositiveIntegerField(null=False, default=0)
    created_at = models.DateTimeField(auto_now_add=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True)
    # video = models.FileField(
    #     upload_to='lessons/videos/',
    #     validators=[
    #         FileExtensionValidator(
    #             allowed_extensions=['mp3', 'mp4', 'avi', 'ogg', 'webm']
    #         )
    #     ],
    #     null=True, 
    #     blank=True
    # )
    video = models.URLField(null=True, blank=True)
    test = models.JSONField(null=True, blank=True)
    order = models.SmallIntegerField(null=False, default=0)

    def __str__(self) -> str:
        return self.title

class StepComment(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True)
    content = ckeditor.fields.RichTextField(max_length=1000, null=True, blank=True)


    def __str__(self) -> str:
        return f'{self.author} on {self.course}'

# балы за урок
# сертификат
# дз
# календарик (план занятий)
# 
