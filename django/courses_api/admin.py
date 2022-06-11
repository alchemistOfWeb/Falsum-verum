from django import forms
from django.contrib import admin
from django.utils.safestring import mark_safe
from .models import (
    Profile, Organization, Course, 
    CourseReport, TagForCourse, StepComment,
    Lesson, Step, LessonType,
    Module, Specialization, TextLecture,
    VideoLecture, Test, TestTask,
    VideoQuestion
)
import nested_admin
from django_admin_json_editor import JSONEditorWidget
from polymorphic.admin import (
    PolymorphicParentModelAdmin, 
    PolymorphicChildModelAdmin, 
    PolymorphicChildModelFilter
)

admin.site.site_title = "Stepo - образовательная платформа"
admin.site.site_header = "Stepo - образовательная платформа"

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


class StepInLine(nested_admin.NestedStackedInline):
    model = Step
    verbose_name = "Шаг"
    verbose_name_plural = "Шаги"


class LessonInLine(nested_admin.NestedStackedInline):
    model = Lesson
    verbose_name = "Урок"
    verbose_name_plural = "Уроки"


class ModuleInLine(nested_admin.NestedStackedInline):
    model = Module
    verbose_name = "Модуль"
    verbose_name_plural = "Модули"
    inlines = [LessonInLine]


class CourseAdmin(nested_admin.NestedModelAdmin):
    list_display = ['title', 'specialization', 'order_in_specialization', 'doshow']
    inlines = [ModuleInLine]
    # list_filter = ['category',]

class ModuleAdmin(admin.ModelAdmin):
    list_display = ['title', 'course', 'grade', 'order', 'doshow']
    inlines = [LessonInLine]

class LessonAdmin(nested_admin.NestedModelAdmin):
    list_display = ['title', 'module', 'grade', 'order', 'doshow']
    inlines = [StepInLine]

class LessonTypeAdmin(admin.ModelAdmin):
    list_display = ['title', 'icon_preview']

    def icon_preview(self, obj):
        return mark_safe(f"<img src='/media/{obj.icon}' width='30' />")
    icon_preview.short_description = 'Icon'
    icon_preview.allow_tags = True


TEST_DATA_SCHEMA = {
    "title": "Задача",
    "type": "object",
    "options": {
        "class": "bg-dark"
    },
    "oneOf": [
        {
            "title": "Choose correct answers",
            "properties": {
                "type": {
                    "type": "string",
                    "default": "Choose correct answers",
                    "options": {
                    "hidden": "true"
                    }
                },
                "answers": {
                    "type": "array",
                    "title": "answers",
                    "format": "table",
                    "items": {
                        "type": "object",
                        "title": "answer",
                        "properties": {
                            "text": {
                                "type": "string",
                                "minLength": 1
                            },
                            "is_correct": {
                                "type": "boolean"
                            }
                        }
                    }
                }
            }
        },
        {
            "title": "Correct mistakes in the text",
            "properties": {
                "type": {
                    "type": "string",
                    "default": "Correct mistakes in text",
                    "options": {
                    "hidden": "true"
                    }
                },
                "answers": {
                    "type": "array",
                    "title": "answers",
                    "format": "table",
                    "items": {
                        "type": "object",
                        "title": "answer",
                        "properties": {
                            "position": {
                                "type": "integer"
                            },
                            "correct": {
                                "type": "string"
                            }
                        }
                    }
                }
            }
        },
        {
            "title": "Short text answer",
            "properties": {
                "type": {
                    "type": "string",
                    "default": "Short text answer",
                    "options": {
                    "hidden": "true"
                    }
                },
                "answers": {
                    "type": "array",
                    "title": "correct answers",
                    "format": "table",
                    "items": {
                        "title": "correct answer",
                        "type": "string"
                    }
                }
            }
        },
        {
            "title": "Longer text answer",
            "properties": {
                "type": {
                    "type": "string",
                    "default": "Longer text answer",
                    "options": {
                        "hidden": "true"
                    }
                }
            }
        }
    ]
}



# class JSONModelAdminForm(forms.ModelForm):
#     class Meta:
#         model = Step
#         fields = 'test'
#         widgets = {
#             'test': JSONEditorWidget(DATA_SCHEMA, collapsed=False),
#         }


class StepChildAdmin(PolymorphicChildModelAdmin):
    """ Base admin class for all child models """
    base_model = Step  # Optional, explicitly set here.

    # By using these `base_...` attributes instead of the regular ModelAdmin `form` and `fieldsets`,
    # the additional fields of the child models are automatically added to the admin form.
    base_form = ...
    base_fieldsets = (
        ...
    )


@admin.register(Test)
class TestAdmin(StepChildAdmin):
    base_model = Test


@admin.register(VideoLecture)
class VideoLectureAdmin(TestAdmin):
    base_model = VideoLecture
    show_in_index = True 


@admin.register(TextLecture)
class TextLectureAdmin(TestAdmin):
    base_model = TextLecture
    show_in_index = True


@admin.register(Step)
class StepParentAdmin(PolymorphicParentModelAdmin):
    """ The parent model admin """
    base_model = Step  # Optional, explicitly set here.
    child_models = (Test, VideoLecture, VideoLecture)
    # list_filter = (PolymorphicChildModelFilter,)  # This is optional.
    # list_display = ['title', 'lesson', 'step_type', 'grade', 'order', 'doshow']
    list_display = "__all__"
    

@admin.register(TestTask)
class TestTaskAdmin():
    def get_form(self, request, obj=None, **kwargs):
        widget = JSONEditorWidget(TEST_DATA_SCHEMA, collapsed=False, sceditor=True)
        form = super().get_form(request, obj, widgets={'task': widget}, **kwargs)
        return form


class VideoQuestionAdmin():
    def get_form(self, request, obj=None, **kwargs):
        widget = JSONEditorWidget(TEST_DATA_SCHEMA, collapsed=False, sceditor=True)
        form = super().get_form(request, obj, widgets={'task': widget}, **kwargs)
        return form

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
