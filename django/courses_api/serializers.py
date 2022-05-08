from rest_framework import serializers
from .models import Topic, TopicComment, Section, Profile
from django.db.models import Count
from django.contrib.auth.models import User

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'

class SectionSerializer(serializers.ModelSerializer):

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep["total_topics"] = instance.topics.count()
        return rep

    class Meta:
        model = Section
        fields = 'id', 'title'


class TopicSerializer(serializers.ModelSerializer): 

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep["total_comments"] = instance.comments.count()
        return rep

    class Meta:
        model = Topic
        fields = '__all__'


class ProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = Profile
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)
    class Meta:
        model = User
        fields = '__all__'

class TopicCommentSerializer(serializers.ModelSerializer):
    # author = serializers.PrimaryKeyRelatedField(queryset=User.objects, read_only=True)
    # author = serializers.RelatedField(read_only=True)
    author = UserSerializer(read_only=True)
    # tracks = serializers.PrimaryKeyRelatedField(read_only=True)

    # def to_representation(self, instance):
    #     rep = super().to_representation(instance)
    #     # rep["total_likes"] = instance.likes.count()
    #     rep["author"] = instance.author
    #     return rep

    class Meta:
        model = TopicComment
        fields = '__all__'