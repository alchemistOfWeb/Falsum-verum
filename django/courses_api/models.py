from django.db import models
from django.contrib.auth.models import User
from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation
from imagekit.models import ProcessedImageField
from imagekit.processors import ResizeToFit
from django.core.validators import FileExtensionValidator
from polymorphic import models as poly_models
from ckeditor_uploader.fields import RichTextUploadingField
import ckeditor


class Profile(models.Model):    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    score = models.PositiveBigIntegerField(default=0, null=False, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True)
    is_blocked = models.BooleanField(default=False, null=False, blank=True)
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
    is_active = models.BooleanField(null=False, default=True)
    image_sm = ProcessedImageField(
        verbose_name="image(sm)",
        upload_to='images/organizations/logos/sm/',
        processors=[ResizeToFit(100, 100)],
        format='JPEG',
        options={'quality': 90},
        blank=True,
        null=True
    )
    users = models.ManyToManyField(
        User, 
        related_name='organizations', 
        through='courses_api.UserInOrganization',
        through_fields=('organization', 'user')
    )


    def __str__(self) -> str:
        return self.title

    class Meta:
        verbose_name = '??????????????????????'
        verbose_name_plural = '    ??????????????????????' # 4



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
    created_at = models.DateTimeField(auto_now_add=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True)
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
        verbose_name = "??????????????????????????"
        # verbose_name_plural = '   Specializations' # 4
        verbose_name_plural = '   ??????????????????????????' # 4


class TagForCourse(models.Model):
    title = models.CharField(max_length=512, null=False)

    def __str__(self) -> str:
        return self.title
    
    class Meta:
        verbose_name = '?????? ?????? ??????????'
        verbose_name_plural = '???????? ?????? ??????????'



class Course(models.Model):
    title = models.CharField(
        verbose_name="????????????????",
        max_length=128, null=False
    )
    
    short_description = models.CharField(
        verbose_name="???????????????? ????????????????",
        max_length=255, 
        null=False, 
        default="", blank=True)

    description = ckeditor.fields.RichTextField(
        verbose_name="?????????????????? ????????????????", 
        max_length=5000, 
        null=True, blank=True
    )

    duration = models.DurationField(
        verbose_name='?????????????????????????????????? ??????????', 
        null=True, blank=True
    )

    doshow = models.BooleanField(
        verbose_name="???????????????????? ???????????????????? ??????????", 
        default=False, 
        blank=True
    )

    # authors = models.ManyToManyField(
    #     User, 
    #     verbose_name="??????????????", 
    #     related_name="own_courses"
    # )

    listeners = models.ManyToManyField(
        User, 
        verbose_name="??????????????????",  
        related_name="undergoing_courses",
        blank=True
    ) 

    specialization = models.ForeignKey(
        Specialization, 
        verbose_name="??????????????????????????", 
        related_name='courses',
        on_delete=models.CASCADE, 
        null=True, blank=True
    )

    organization = models.ForeignKey(
        Organization, 
        verbose_name="??????????????????????",
        related_name='courses',
        null=True, blank=False,
        on_delete=models.CASCADE
    )

    order_in_specialization = models.SmallIntegerField(
        verbose_name="???????????????????? ??????????", 
        null=False, 
        default=0
    )

    tags = models.ManyToManyField(
        TagForCourse, 
        verbose_name="????????", 
        related_name="courses")

    created_at = models.DateTimeField(
        verbose_name="???????? ????????????????", 
        auto_now_add=True, blank=True
    )
    updated_at = models.DateTimeField(
        verbose_name="?????????????????? ????????????????????", 
        auto_now=True, blank=True
    )
    image_sm = ProcessedImageField(
        verbose_name="image(sm)",
        upload_to='images/avatars/sm/',
        processors=[ResizeToFit(200, 200)],
        format='JPEG',
        options={'quality': 90},
        blank=True,
        null=True
    )
    banner_lg = ProcessedImageField(
        verbose_name="banner(lg)",
        upload_to='images/avatars/sm/',
        processors=[ResizeToFit(1000, 300)],
        format='JPEG',
        options={'quality': 90},
        blank=True,
        null=True
    )

    def __str__(self) -> str:
        return self.title

    class Meta:
        verbose_name = '????????'
        verbose_name_plural = '??????????'


class AuthorsInCourse(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="authors_in_course")
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="authors_in_course")
    description = models.CharField(max_length=512, null=False, default="")


# class CourseRoadmap(models.Model): ... # mongo?


class CourseReview(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reviews")
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="reviews")
    created_at = models.DateTimeField(auto_now_add=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True)
    content = ckeditor.fields.RichTextField(max_length=2000, null=False, default='', blank=True)

    class Meta:
        verbose_name = '?????????? ???? ????????'
        verbose_name_plural = '???????????? ???? ????????'


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
    
    class Meta:
        verbose_name = '????????????'
        verbose_name_plural = '????????????'


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

    class Meta:
        verbose_name = '?????? ??????????'
        verbose_name_plural = '???????? ????????????'


class Lesson(models.Model): 
    title = models.CharField(max_length=512, null=False)
    lesson_type = models.ForeignKey(LessonType, on_delete=models.SET_NULL, null=True, blank=True)
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

    class Meta:
        verbose_name = '????????'
        verbose_name_plural = '??????????'



class LessonReactionType(models.IntegerChoices):
    DISLIKE = 0, 'dislike'
    LIKE = 1, 'like'

class LessonReaction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    lesson = models.ForeignKey(Lesson, related_name='reactions', on_delete=models.CASCADE)
    value = models.SmallIntegerField(choices=LessonReactionType.choices, null=False)
    created_at = models.DateTimeField(auto_now_add=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True)


# class StepType(models.IntegerChoices):
#     LECTURE = 0, 'lecture'
#     TEST = 1, 'test'

class Step(poly_models.PolymorphicModel):
    title = models.CharField(max_length=512, null=False)
    lesson = models.ForeignKey(
        Lesson, 
        related_name='steps', 
        null=True, blank=False, 
        on_delete=models.CASCADE
    )
    doshow = models.BooleanField(null=False, default=False, blank=True)
    grade = models.PositiveIntegerField(null=False, default=0)
    created_at = models.DateTimeField(auto_now_add=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True)
    order = models.SmallIntegerField(null=False, default=0)

    def __str__(self) -> str:
        return self.title

    class Meta:
        verbose_name = '?????? ?? ??????????'
        verbose_name_plural = '???????? ?? ??????????'


class StepComment(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    step = models.ForeignKey(Step, related_name='comments', on_delete=models.CASCADE)
    parent = models.ForeignKey('self', related_name="children", null=True, blank=True, on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True)
    content = ckeditor.fields.RichTextField(max_length=1000, null=True, blank=True)


    def __str__(self) -> str:
        return f'{self.author} on {self.course}'
    
    class Meta:
        verbose_name = '?????????????????????? ???? ??????'
        verbose_name_plural = '?????????????????????? ???? ??????'


class StepReactionType(models.IntegerChoices):
    DISLIKE = 0, 'dislike'
    LIKE = 1, 'like'

class StepReaction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    step = models.ForeignKey(Step, related_name='reactions', on_delete=models.CASCADE)
    value = models.SmallIntegerField(choices=StepReactionType.choices, null=False)

class StepCommentReaction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    comment = models.ForeignKey(StepComment, related_name='reactions', on_delete=models.CASCADE)
    value = models.SmallIntegerField(choices=StepReactionType.choices, null=False)


class TextLecture(Step):
    content = RichTextUploadingField(max_length=8192, null=False, default='', blank=True)

    class Meta:
        verbose_name = '?????????????????? ????????????'
        verbose_name_plural = '?????????????????? ????????????'


class VideoLecture(Step):
    content = ckeditor.fields.RichTextField(max_length=2048, null=False, default='', blank=True)
    video = models.URLField(null=True, blank=True)
    # questions (implemented by fk in VideoQeustion)
    
    class Meta:
        verbose_name = '??????????????????????'
        verbose_name_plural = '??????????????????????'


class Test(Step):
    content = ckeditor.fields.RichTextField(max_length=2048, null=False, default='', blank=True)
    # tasks (implemented by fk in TestTask)
    
    class Meta:
        verbose_name = '????????'
        verbose_name_plural = '??????????'


class TestTask(models.Model):
    description = models.TextField(max_length=512, null=False, default='', blank=True)
    order = models.SmallIntegerField(null=False, default=0)
    # task_type = models.IntegerField(choices=StepType.choices, null=False)
    structure = models.JSONField(null=True, blank=True)
    grade = models.PositiveSmallIntegerField(null=False, default=0, blank=True)
    doshow = models.BooleanField(null=False, default=False, blank=True)
    test = models.ForeignKey(Test, related_name="tasks", null=False, on_delete=models.CASCADE)

    
    class Meta:
        verbose_name = '???????????? ?? ??????????'
        verbose_name_plural = '?????????????? ?? ????????????'


class VideoQuestion(models.Model):
    description = models.TextField(max_length=512, null=False, default='', blank=True)
    structure = models.JSONField(null=True, blank=True)
    timing = models.TimeField(null=False)
    grade = models.PositiveSmallIntegerField(null=False, default=0, blank=True)
    doshow = models.BooleanField(null=False, default=False, blank=True)
    lecture = models.ForeignKey(VideoLecture, related_name="questions", null=False, on_delete=models.CASCADE)


# grade per lesson
# certificate
# homework
# calendare (or|and lessons schedule)
# terms in TextLecture.content
