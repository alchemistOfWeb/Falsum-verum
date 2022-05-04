from django.shortcuts import render
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.core import serializers
from rest_framework.decorators import api_view, action, permission_classes
from rest_framework.response import Response
from rest_framework.filters import OrderingFilter, SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, status, permissions, generics
from rest_framework.views import APIView
from .models import Topic, TopicComment, Section, Profile
from .serializers import (TopicSerializer, 
                          TopicCommentSerializer, 
                          SectionSerializer, 
                          ProfileSerializer, UserSerializer)
from .filters import TopicFilter
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from django.middleware.csrf import get_token


# class SectionListView(APIView)
# ----------- PROFILE ----------- #
# @api_view(['POST'])
# def profile_block(request, user_pk):
#     get_object_or_404(Profile.objects, user=user_pk)
#     data = {"message": "user blocked", "errors": []}
#     return Response(data, status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def csrf(request):
    return Response({'csrfToken': get_token(request)})


@api_view(['GET'])
def current_profile(request):
    print(request.COOKIES) 
    # profile = get_object_or_404(Profile.objects, request.user.id)
    serializer = UserSerializer(request.user)
    return Response({'user': serializer.data})


# ----------- SECTIONS ----------- #
@api_view(['GET'])
def section_list(request):
    sections = Section.objects.all()
    serializer = SectionSerializer(sections, many=True)
    return Response({'sections': serializer.data})


# ----------- TOPICS ----------- #
class TopicViewSet(viewsets.ViewSet):
    queryset = Topic.objects
    serializer_class = TopicSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_class = TopicFilter
    ordering_fields = ['created_at', 'updated_at']
    search_fields = ['author__username', 'title']
    ordering = ['updated_at']
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    # swagger_schema = CustomAutoSchema
    # my_tags = ['Tasks']

    def filter_queryset(self, queryset):
        for backend in self.filter_backends:
            queryset = backend().filter_queryset(self.request, queryset, view=self)

        return queryset

    def list(self, request, section_pk=None):
        topics = self.queryset.filter(section=section_pk)
        serializer = self.serializer_class(self.filter_queryset(topics), many=True)
        section = Section.objects.get(pk=section_pk)
        serialized_section = SectionSerializer(section, many=False)
        ctx = {'topics': serializer.data, 'section': serialized_section.data}
        return Response(data=ctx, status=status.HTTP_200_OK)

    def create(self, request, section_pk=None):
        data = {**request.data, 'section': section_pk}
        serializer = self.serializer_class(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    # def retrieve(self, request, section_pk=None):
    def update(self, request, section_pk=None, pk=None):
        task = get_object_or_404(self.queryset, pk=pk)
        serializer = self.serializer_class(task, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_205_RESET_CONTENT)

    def partial_update(self, request, section_pk=None, pk=None):
        task = get_object_or_404(self.queryset, pk=pk)
        serializer = self.serializer_class(task, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_205_RESET_CONTENT)

    @action(detail=True, methods=['patch'])
    def block(self, request, section_pk=None, topic_pk=None):
        topic = get_object_or_404(self.queryset, pk=topic_pk)
        topic.is_blocked = True
        topic.save()
        return Response(status=status.HTTP_205_RESET_CONTENT)

    @action(detail=True, methods=['patch'])
    def close(self, request, section_pk=None, topic_pk=None):
        topic = get_object_or_404(self.queryset, pk=topic_pk)
        topic.is_open = False
        topic.save()
        return Response(status=status.HTTP_205_RESET_CONTENT)


# ----------- COMMENTS ----------- #
class TopicCommentViewSet(viewsets.ViewSet):
    queryset = TopicComment.objects
    serializer_class = TopicCommentSerializer
    create_comment_serializer = TopicCommentSerializer
    filter_backends = [OrderingFilter]
    # filterset_class = TopicCommentFilter
    ordering_fields = ['created_at']
    ordering = ['created_at']
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    @method_decorator(ensure_csrf_cookie)
    def list(self, request, section_pk=None, topic_pk=None, pk=None):
        topic = Topic.objects.get(pk=topic_pk)
        topic_serializer = TopicSerializer(topic)
        comments = self.queryset.filter(topic_id=topic_pk)
        comment_serializer = self.serializer_class(comments, many=True)
        ctx = {"topic": topic_serializer.data, "comments": comment_serializer.data}

        return Response(data=ctx, status=status.HTTP_200_OK)

    def create(self, request, section_pk=None, topic_pk=None):
        data = request.data + {"user": request.user, "topic_id": topic_pk}
        
        serializer = self.create_comment_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def partial_update(self, request, section_pk=None, pk=None):
        task = get_object_or_404(self.queryset, pk=pk)
        if task.user == request.user:
            update_data = {"content": request.data.get("content")}
            serializer = self.serializer_class(task, data=update_data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        else:
            ctx = {
                "error": {
                    "code": 1,
                    "message": "this comment doesn't belong to this user"
                }
            }
            return Response(data=ctx, status=status.HTTP_403_FORBIDDEN)

    @action(detail=True, methods=['patch'])
    def archive(self, request, section_pk=None, topic_pk=None, pk=None):
        topic = get_object_or_404(self.queryset, pk=topic_pk)
        topic.is_archived = True
        topic.save()
        return Response(status=status.HTTP_205_RESET_CONTENT)

    @action(detail=True, methods=['patch'])
    def block(self, request, section_pk=None, topic_pk=None, pk=None):
        topic = get_object_or_404(self.queryset, pk=topic_pk)
        topic.is_blocked = True
        topic.save()
        return Response(status=status.HTTP_205_RESET_CONTENT)
