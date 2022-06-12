from rest_framework import serializers
from .models import (
    Profile, Specialization, Organization, 
    Course, CourseReport, Module,
    Lesson, LessonType, Step, 
    StepComment, LessonReactionType,
    StepReactionType, Test, TextLecture, VideoLecture
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


class CourseSerializer(serializers.ModelSerializer):
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
    steps = StepShortSerializer(read_only=True, many=True)
    lesson_type = LessonTypeSerializer(read_only=True)

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep["likes"] = instance.reactions.filter(value=StepReactionType.LIKE).count()
        rep["dislikes"] = instance.reactions.filter(value=StepReactionType.DISLIKE).count()
        return rep

    class Meta:
        model = Lesson
        fields = '__all__' 


class ModuleSerializer(serializers.ModelSerializer):
    lessons = LessonShortSerializer(read_only=True, many=True)

    class Meta:
        model = Module
        fields = '__all__'


class CourseFullSerializer(serializers.ModelSerializer):
    modules = ModuleSerializer(read_only=True, many=True)

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
class LessonSerializer(serializers.ModelSerializer):
    steps = StepShortSerializer(read_only=True)
    lesson_type = LessonTypeSerializer()

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep["likes"] = instance.reactions.filter(value=StepReactionType.LIKE).count()
        rep["dislikes"] = instance.reactions.filter(value=StepReactionType.DISLIKE).count()
        return rep

    class Meta:
        model = Step
        fields = '__all__'


class TextLectureSerializer(serializers.ModelSerializer):
    class Meta:
        model = TextLecture
        fields = '__all__'


class VideoLectureSerializer(serializers.ModelSerializer):
    class Meta:
        model = VideoLecture
        fields = '__all__'


class TestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Test
        fields = '__all__'


class PolymorphicStepSerializer(PolymorphicSerializer):
    resource_type_field_name = 'step_type'

    model_serializer_mapping = {
        TextLecture: TextLectureSerializer,
        VideoLecture: VideoLectureSerializer,
        Test: TestSerializer
    }

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep["likes"] = instance.reactions.filter(value=StepReactionType.LIKE).count()
        rep["dislikes"] = instance.reactions.filter(value=StepReactionType.DISLIKE).count()
        return rep

    # class Meta:
    #     model = Step
    #     fields = '__all__'
# <------------------------------------/>
