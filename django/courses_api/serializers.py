from rest_framework import serializers
from .models import (
    Profile, Specialization, Organization, 
    Course, CourseReport, Module,
    Lesson, LessonType, Step, 
    StepComment, StepType, LessonReactionType,
    StepReactionType
)
from django.db.models import Count
from django.contrib.auth.models import User

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
        model = Lesson
        fields = '__all__'


class StepShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Step
        fields = 'title', 'step_type', 'doshow', 'grade', 'created_at', 'updated_at', 'order'


class LessonShortSerializer(serializers.ModelSerializer):
    steps = StepShortSerializer(read_only=True)
    lesson_type = LessonTypeSerializer(read_only=True)

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep["likes"] = instance.reactions.filter(value=StepReactionType.LIKE).count()
        rep["dislikes"] = instance.reactions.filter(value=StepReactionType.DISLIKE).count()
        return rep

    class Meta:
        model = Lesson
        fields = '__all__', 


class ModuleSerializer(serializers.ModelSerializer):
    lessons = LessonShortSerializer(read_only=True)

    class Meta:
        model = Lesson
        fields = '__all__'


class CourseFullSerializer(serializers.ModelSerializer):
    modules = ModuleSerializer(read_only=True)

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


class StepSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep["likes"] = instance.reactions.filter(value=StepReactionType.LIKE).count()
        rep["dislikes"] = instance.reactions.filter(value=StepReactionType.DISLIKE).count()
        return rep

    class Meta:
        model = Step
        fields = '__all__'
# <------------------------------------/>
