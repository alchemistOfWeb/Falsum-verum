from django.contrib import admin
from .models import Topic, Section, Profile, TopicComment

# Register your models here.
admin.site.register(Topic)
admin.site.register(Section)
admin.site.register(Profile)
admin.site.register(TopicComment)
