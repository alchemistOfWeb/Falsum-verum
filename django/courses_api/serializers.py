from multiprocessing import context
from rest_framework import serializers
from .models import (
    AuthorsInCourse, Profile, Specialization, Organization, 
    Course, CourseReview, Module,
    Lesson, LessonType, Step, 
    StepComment, LessonReactionType,
    StepReactionType, Test, TestTask, TextLecture, VideoLecture, VideoQuestion
)
from django.db.models import Count
from django.contrib.auth.models import User
from rest_polymorphic.serializers import PolymorphicSerializer


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = '__all__'


# ON MAIN PAGE
# <------------------------------------>
class SpecializationSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep["total_courses"] = instance.courses.count()
            
        return rep

    

    class Meta:
        model = Specialization
        fields = '__all__'


class AuthorsInCourseSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)

    class Meta:
        model = AuthorsInCourse
        fields = '__all__'


class CourseReviewSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)

    def create(self, validated_data):
        # return super().create(validated_data)
        return CourseReview.objects.create(**validated_data)

    class Meta:
        model = CourseReview
        fields = '__all__'


class CourseSerializer(serializers.ModelSerializer):
    authors = AuthorsInCourseSerializer(many=True, source="authors_in_course") # todo: create, update

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep["total_listeners"] = instance.listeners.count()
        return rep

    class Meta:
        model = Course
        fields = '__all__'


class OrganizationSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep["total_courses"] = instance.courses.count()
        return rep


    class Meta:
        model = Organization
        fields = '__all__'

# <------------------------------------/>

# ON COURSE PAGE
# <------------------------------------>
class LessonTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonType
        fields = '__all__'


class StepShortSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep["step_type"] = instance._meta.object_name
        return rep

    class Meta:
        model = Step
        fields = 'id', 'title', 'doshow', 'grade', 'created_at', 'updated_at', 'order'


class LessonShortSerializer(serializers.ModelSerializer):
    steps = serializers.SerializerMethodField()
    lesson_type = LessonTypeSerializer(read_only=True)

    def get_steps(self, obj):
        steps = obj.steps.filter(doshow=True)
        return StepShortSerializer(steps, read_only=True, many=True).data

    class Meta:
        model = Lesson
        fields = '__all__' 


class ModuleSerializer(serializers.ModelSerializer):
    lessons = serializers.SerializerMethodField()

    def get_lessons(self, obj):
        lessons = obj.lessons.filter(doshow=True)
        return LessonShortSerializer(lessons, read_only=True, many=True).data
    
    class Meta:
        model = Module
        fields = '__all__'


class CourseFullSerializer(serializers.ModelSerializer):
    modules = serializers.SerializerMethodField()

    def get_modules(self, obj):
        modules = obj.modules.filter(doshow=True)
        return ModuleSerializer(modules, read_only=True, many=True).data

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep["total_listeners"] = instance.listeners.count()
        return rep

    class Meta:
        model = Course
        fields = '__all__'

# <------------------------------------/>

# ON LESSON|STEP PAGES
# <------------------------------------>
# class LessonSerializer(serializers.ModelSerializer):
#     steps = StepShortSerializer(read_only=True, many=True)
#     lesson_type = LessonTypeSerializer(read_only=True)

#     def to_representation(self, instance):
#         instance = instance.filter(doshow=True)
#         rep = super().to_representation(instance)
#         return rep

#     class Meta:
#         model = Lesson
#         fields = '__all__'


class TextLectureSerializer(serializers.ModelSerializer):
    class Meta:
        model = TextLecture
        fields = '__all__'


class VideoQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = VideoQuestion
        fields = '__all__'


class VideoLectureSerializer(serializers.ModelSerializer):
    questions = VideoQuestionSerializer(many=True, read_only=True)

    class Meta:
        model = VideoLecture
        fields = '__all__'


class TestTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestTask
        fields = '__all__'


class TestSerializer(serializers.ModelSerializer):
    tasks = TestTaskSerializer(many=True, read_only=True)

    class Meta:
        model = Test
        fields = '__all__'


class FilterCommentListSerializer(serializers.ListSerializer):
    def to_representation(self, data):
        data = data.filter(parent=None)
        return super().to_representation(data)


class RecursiveSerializer(serializers.Serializer):
    def to_representation(self, instance):
        serializer = self.parent.parent.__class__(instance, context=self.context)
        return serializer.data


class StepCommentSerializer(serializers.ModelSerializer):
    children = RecursiveSerializer(many=True)

    class Meta:
        list_serializer_class = FilterCommentListSerializer
        model=StepComment
        fields='__all__'


class PolymorphicStepSerializer(PolymorphicSerializer):
    resource_type_field_name = 'step_type'
    comments = StepCommentSerializer(many=True, read_only=True) # todo: comment it and add pagination

    model_serializer_mapping = {
        TextLecture: TextLectureSerializer,
        VideoLecture: VideoLectureSerializer,
        Test: TestSerializer
    }

    def to_representation(self, instance):
        # instance.filter(doshow=True)
        rep = super().to_representation(instance)
        rep["likes"] = instance.reactions.filter(value=StepReactionType.LIKE).count()
        rep["dislikes"] = instance.reactions.filter(value=StepReactionType.DISLIKE).count()
        return rep

    # class Meta:
    #     model = Step
    #     fields = '__all__'
# <------------------------------------/>
