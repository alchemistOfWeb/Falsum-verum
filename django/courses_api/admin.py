from django.contrib import admin
from django.utils.safestring import mark_safe
from .models import (
    Profile, Organization, Course, 
    CourseReport, TagForCourse, StepComment,
    Lesson, Step, LessonType,
    Module, Specialization
)

class ProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'image_preview', 'score', 'is_blocked']

    def image_preview(self, obj):
        return mark_safe(f"<img src='/media/{obj.image_sm}' width='30' style='border-radius: 20px' />")
    image_preview.short_description = 'Аватар'
    image_preview.allow_tags = True

class SpecializationAdmin(admin.ModelAdmin):
    list_display = ['title', 'organization']


class CourseReportAdmin(admin.ModelAdmin):
    list_display = ['author', 'course']

class CourseAdmin(admin.ModelAdmin):
    list_display = ['title', 'specialization', 'order_in_specialization', 'doshow']
    # list_filter = ['category',]

class ModuleAdmin(admin.ModelAdmin):
    list_display = ['title', 'course', 'grade', 'order', 'doshow']

class LessonAdmin(admin.ModelAdmin):
    list_display = ['title', 'module', 'grade', 'order', 'doshow']

class LessonTypeAdmin(admin.ModelAdmin):
    list_display = ['title', 'icon_preview']

    def icon_preview(self, obj):
        return mark_safe(f"<img src='/media/{obj.icon}' width='30' />")
    icon_preview.short_description = 'Icon'
    icon_preview.allow_tags = True

class StepAdmin(admin.ModelAdmin):
    list_display = ['title', 'lesson', 'step_type', 'grade', 'order', 'doshow']

class StepCommentAdmin(admin.ModelAdmin):
    list_display = ['author', 'step', 'updated_at']


# Register your models here.
admin.site.register(Profile, ProfileAdmin)
admin.site.register(Organization)
admin.site.register(Specialization, SpecializationAdmin)

admin.site.register(Course, CourseAdmin)
admin.site.register(CourseReport, CourseReportAdmin)
admin.site.register(TagForCourse)

admin.site.register(Module, ModuleAdmin)

admin.site.register(Lesson, LessonAdmin)
admin.site.register(LessonType, LessonTypeAdmin)

admin.site.register(Step, StepAdmin)
admin.site.register(StepComment, StepCommentAdmin)
