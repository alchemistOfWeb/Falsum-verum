from django import forms
from django.contrib import admin
from django.utils.safestring import mark_safe
from .models import (
    Profile, Organization, Course, 
    CourseReport, TagForCourse, StepComment,
    Lesson, Step, LessonType,
    Module, Specialization
)
import nested_admin
from django_admin_json_editor import JSONEditorWidget

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




# DATA_SCHEMA = {
#     'type': 'object',
#     'title': 'Data',
#     'properties': {
#         'text': {
#             'title': 'Some text',
#             'type': 'string',
#             'format': 'textarea',
#         },
#         'status': {
#             'title': 'Status',
#             'type': 'boolean',
#         },
#     },
# }

# "name": {
#     "type": "string",
#     "description": "First and Last name",
#     "minLength": 4,
#     "default": "Jeremy Dorn"
# },
# "age": {
#     "type": "integer",
#     "default": 25,
#     "minimum": 18,
#     "maximum": 99
# },

# "default": [
#     {
#         "type": "dog",
#         "name": "Walter"
#     }
# ]

DATA_SCHEMA = {
    "title": "Data",
    "type": "object",
    "options": {
        "class": "bg-dark"
    },
    "required": [
        "tasks"
    ],
    "properties": {
        "tasks": {
            "type": "array",
            "format": "table",
            "title": "Задания",
            "uniqueItems": True,
            "items": {
                "type": "object",
                "title": "Задача",
                "properties": {
                    "type": {
                        "type": "string",
                        "enum": [
                            "Ответ текстом",
                            "Выбор одного из списка",
                            "Выбор нескольких из списка"
                        ],
                        "default": "Ответ текстом"
                    },
                    "question": {
                        "type": "string",
                        "format": "textarea"
                    },
                    "answers": {
                        "type": "array",
                        "format": "table",
                        "title": "Ответы",
                        "items": {
                            "title": "Ответ",
                            "type": "object",
                            "properties": {
                                "text": {
                                    "type": "string",
                                    "minLength": 1,
                                },
                                "is_correct": {
                                    "type": "boolean",
                                }
                            }
                        }
                    },
                }
            }
        }
    }
}

# class JSONModelAdminForm(forms.ModelForm):
#     class Meta:
#         model = Step
#         fields = 'test'
#         widgets = {
#             'test': JSONEditorWidget(DATA_SCHEMA, collapsed=False),
#         }


class StepAdmin(admin.ModelAdmin):
    def get_form(self, request, obj=None, **kwargs):
        widget = JSONEditorWidget(DATA_SCHEMA, collapsed=False, sceditor=True)
        form = super().get_form(request, obj, widgets={'test': widget}, **kwargs)
        return form

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
