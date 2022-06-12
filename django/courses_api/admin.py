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
    PolymorphicChildModelFilter,
    PolymorphicInlineSupportMixin, 
    StackedPolymorphicInline
)

from .jsonfield_schemes import TEST_DATA_SCHEMA


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


class TestTaskInline(nested_admin.NestedStackedInline):
    model = TestTask
    sortable_field_name = 'order'
    extra = 0

    # def get_form(self, request, obj=None, **kwargs):
    #     widget = JSONEditorWidget(TEST_DATA_SCHEMA, collapsed=True, sceditor=True)
    #     form = super().get_form(request, obj, widgets={'answers': widget}, **kwargs)
    #     return form


class VideoQeustionInline(nested_admin.NestedStackedInline):
    model = VideoQuestion
    extra = 0

# class StepInLine(nested_admin.NestedStackedInline):
#     model = Step
#     verbose_name = "Шаг"
#     verbose_name_plural = "Шаги"
class StepInLine(nested_admin.NestedStackedPolymorphicInline):
    model = Step
    verbose_name = "Шаг"
    verbose_name_plural = "Шаги"    
    sortable_field_name = 'order'
    extra = 0

    class TestInline(nested_admin.NestedStackedPolymorphicInline.Child):
        model = Test
        inlines = [TestTaskInline]

    class VideoLectureInline(nested_admin.NestedStackedPolymorphicInline.Child):
        model = VideoLecture
        inlines = [VideoQeustionInline]

    class TextLectureInline(nested_admin.NestedStackedPolymorphicInline.Child):
        model = TextLecture

    child_inlines = (VideoLectureInline, TextLectureInline, TestInline)


class LessonInLine(nested_admin.NestedStackedInline):
    model = Lesson
    verbose_name = "Урок"
    verbose_name_plural = "Уроки"
    sortable_field_name = 'order'
    extra = 0


class ModuleInLine(nested_admin.NestedStackedInline):
    model = Module
    verbose_name = "Модуль"
    verbose_name_plural = "Модули"
    sortable_field_name = 'order'
    inlines = [LessonInLine]
    extra = 0


class CourseAdmin(nested_admin.NestedModelAdmin):
    list_display = ['title', 'specialization', 'order_in_specialization', 'doshow']
    inlines = [ModuleInLine]
    # list_filter = ['category',]

class ModuleAdmin(admin.ModelAdmin):
    list_display = ['title', 'course', 'grade', 'order', 'doshow']
    inlines = [LessonInLine]

class LessonAdmin(nested_admin.NestedPolymorphicModelAdmin):
    list_display = ['title', 'module', 'grade', 'order', 'doshow']
    sortable_field_name = 'order'
    inlines = [StepInLine]


class LessonTypeAdmin(admin.ModelAdmin):
    list_display = ['title', 'icon_preview']

    def icon_preview(self, obj):
        return mark_safe(f"<img src='/media/{obj.icon}' width='30' />")
    icon_preview.short_description = 'Icon'
    icon_preview.allow_tags = True


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
    # base_form = ...
    # base_fieldsets = (
    #     ...
    # )


class TasksInline(admin.StackedInline):
    model = TestTask
    extra = 0


class VideoQuestionsInline(admin.StackedInline):
    model = VideoQuestion
    extra = 0


class TestAdmin(StepChildAdmin):
    base_model = Test
    show_in_index = True

    inlines = (TasksInline,)


class VideoLectureAdmin(StepChildAdmin):
    base_model = VideoLecture
    show_in_index = True 

    inlines = (VideoQuestionsInline,)


class TextLectureAdmin(StepChildAdmin):
    base_model = TextLecture
    show_in_index = True


class StepCommentInline(admin.StackedInline):
    model = StepComment
    extra = 0


class StepParentAdmin(PolymorphicParentModelAdmin):
    """ The parent model admin """
    base_model = Step
    child_models = (Test, TextLecture, VideoLecture)
    # list_filter = (PolymorphicChildModelFilter,)  # This is optional.
    list_display = ['title', 'lesson', 'grade', 'order', 'doshow']
    inlines = (StepCommentInline,)
    polymorphic_list = False


class TestTaskAdmin(admin.ModelAdmin):
    model = TestTask
    # def get_form(self, request, obj=None, **kwargs):
    #     widget = JSONEditorWidget(TEST_DATA_SCHEMA, collapsed=False, sceditor=True)
    #     form = super().get_form(request, obj, widgets={'answers': widget}, **kwargs)
    #     return form


class VideoQuestionAdmin(admin.ModelAdmin):
    model = VideoQuestion
    # def get_form(self, request, obj=None, **kwargs):
    #     widget = JSONEditorWidget(TEST_DATA_SCHEMA, collapsed=False, sceditor=True)
    #     form = super().get_form(request, obj, widgets={'answers': widget}, **kwargs)
    #     return form

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

admin.site.register(Test, TestAdmin)
admin.site.register(TextLecture, TextLectureAdmin)
admin.site.register(VideoLecture, VideoLectureAdmin)
admin.site.register(Step, StepParentAdmin)
admin.site.register(TestTask, TestTaskAdmin)
admin.site.register(StepComment, StepCommentAdmin)
