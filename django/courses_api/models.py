from django.db import models
from django.contrib.auth.models import User
from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation
from imagekit.models import ProcessedImageField
from imagekit.processors import ResizeToFit


class Section(models.Model):
    title = models.CharField(max_length=255)

    def __str__(self) -> str:
        return self.title
    

class Topic(models.Model):
    title = models.CharField(max_length=255)
    section = models.ForeignKey(Section, on_delete=models.SET_NULL, related_name="topics", null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_blocked = models.BooleanField(default=False, blank=True)
    is_open = models.BooleanField(default=True, blank=True)

    def __str__(self) -> str:
        return self.title


class Profile(models.Model):    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    score = models.PositiveBigIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True)
    is_blocked = models.BooleanField(default=False, blank=True)
    image_sm = ProcessedImageField(verbose_name="avatar",
                                upload_to='images/avatars/sm/',
                                processors=[ResizeToFit(100, 100)],
                                format='JPEG',
                                options={'quality': 90},
                                blank=True,
                                null=True)
    
    def __str__(self) -> str:
        return self.user.username


class TopicComment(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, blank=True)
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE, related_name="comments")
    content = models.TextField(max_length=3000, blank=False, null=False)
    likes = models.PositiveIntegerField(default=0)
    is_blocked = models.BooleanField(default=False, blank=True)
    is_archive = models.BooleanField(default=False, blank=True)
