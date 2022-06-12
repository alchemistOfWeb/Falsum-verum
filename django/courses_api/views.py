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
from .models import (
    Specialization, Organization, Course, 
    Module, Lesson, Step, CourseReport, StepComment
)
from .serializers import ( 
    CourseFullSerializer, ModuleSerializer, ProfileSerializer, 
    UserSerializer, SpecializationSerializer, OrganizationSerializer, 
    CourseSerializer, PolymorphicStepSerializer
)
from .filters import OrganizationFilter, SpecializationFilter, CourseFilter
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from django.middleware.csrf import get_token
from django.contrib.auth.models import User

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



# Courses + Specializations + Organizations) with filters
# @api_view(['GET'])
# def specialization_list(request):
#     specializations = Specialization.objects.all()
#     serializer = SpecializationSerializer(specializations, many=True)
#     return Response({'specializations': serializer.data})

# @api_view(['GET'])
# def course_list(request):
#     courses = Course.objects.all()
#     serializer = CourseSerializer(courses, many=True)
#     return Response({'courses': serializer.data})

# @api_view(['GET'])
# def organization_list(request):
#     organizations = Organization.objects.all()
#     serializer = OrganizationSerializer(organizations, many=True)
#     return Response({'organizations': serializer.data})



# detail Specialization description (with authors, courses)
# detail Specialization update (for owners|authors)
# Specialization create (in Organization)


# ON MAIN PAGE
# <------------------------------------>
class OrganizationViewSet(viewsets.ViewSet):
    queryset = Organization.objects
    serializer_class = OrganizationSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_class = OrganizationFilter
    ordering_fields = ['created_at', 'updated_at']
    search_fields = ['title']
    ordering = ['updated_at']
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    # swagger_schema = CustomAutoSchema
    # my_tags = ['Tasks']

    def filter_queryset(self, queryset):
        for backend in self.filter_backends:
            queryset = backend().filter_queryset(self.request, queryset, view=self)

        return queryset

    def list(self, request):
        """ 
        for all
        """
        serializer = self.serializer_class(self.filter_queryset(self.queryset), many=True)
        ctx = {'organizations': serializer.data}
        return Response(data=ctx, status=status.HTTP_200_OK)

    def create(self, request):
        """ 
        For authorized user
        """
        # data = {**request.data, '': section_pk}
        data = request.data
        serializer = self.serializer_class(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def retrieve(self, request, pk=None):
        obj = get_object_or_404(self.queryset, pk=pk)
        serializer = self.serializer_class(obj)
        ctx = {'organization': serializer.data}
        return Response(data=ctx, status=status.HTTP_200_OK)

    def update(self, request, pk=None):
        """ 
        For owner|author
        """
        obj = get_object_or_404(self.queryset, pk=pk)
        serializer = self.serializer_class(obj, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_205_RESET_CONTENT)

    def partial_update(self, request, pk=None):
        """ 
        For owner|author
        """
        obj = get_object_or_404(self.queryset, pk=pk)
        serializer = self.serializer_class(obj, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_205_RESET_CONTENT)

    def delete(self, request, pk=None):
        """ 
        For owner|author
        """
        obj = get_object_or_404(self.queryset, pk=pk)
        obj.is_active = False
        obj.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['patch'])
    def attach_user(self, request, pk=None):
        """ 
        For owner|author
        """
        obj = get_object_or_404(self.queryset, pk=pk)
        obj.user = get_object_or_404(User.objects, pk=request.data.get('user_pk'))
        obj.save()
        return Response(status=status.HTTP_205_RESET_CONTENT)


class SpecializationViewSet(viewsets.ViewSet):
    queryset = Specialization.objects
    serializer_class = SpecializationSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_class = SpecializationFilter
    ordering_fields = ['created_at', 'updated_at']
    search_fields = ['title']
    ordering = ['updated_at']
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    # swagger_schema = CustomAutoSchema
    # my_tags = ['Tasks']

    def filter_queryset(self, queryset):
        for backend in self.filter_backends:
            queryset = backend().filter_queryset(self.request, queryset, view=self)

        return queryset

    def list(self, request):
        """ 
        for all
        """
        serializer = self.serializer_class(self.filter_queryset(self.queryset), many=True)
        ctx = {'specializations': serializer.data}
        return Response(data=ctx, status=status.HTTP_200_OK)

    def create(self, request):
        """ 
        For authorized user
        """
        # data = {**request.data, '': section_pk}
        data = request.data
        serializer = self.serializer_class(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def retrieve(self, request, pk=None):
        obj = get_object_or_404(self.queryset, pk=pk)
        serializer = self.serializer_class(obj)
        ctx = {'specialization': serializer.data}
        return Response(data=ctx, status=status.HTTP_200_OK)

    def update(self, request, pk=None):
        """ 
        For owner|author
        """
        obj = get_object_or_404(self.queryset, pk=pk)
        serializer = self.serializer_class(obj, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_205_RESET_CONTENT)

    def partial_update(self, request, pk=None):
        """ 
        For owner|author
        """
        obj = get_object_or_404(self.queryset, pk=pk)
        serializer = self.serializer_class(obj, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_205_RESET_CONTENT)

    def delete(self, request, pk=None):
        """ 
        For owner|author
        """
        obj = get_object_or_404(self.queryset, pk=pk)
        obj.is_active = False
        obj.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['patch'])
    def attach_user(self, request, pk=None):
        """ 
        For owner|author
        """
        obj = get_object_or_404(self.queryset, pk=pk)
        obj.user = get_object_or_404(User.objects, pk=request.data.get('user_pk'))
        obj.save()
        return Response(status=status.HTTP_205_RESET_CONTENT)


class CourseViewSet(viewsets.ViewSet):
    queryset = Course.objects
    serializer_class = CourseSerializer
    full_course_serializer_class = CourseFullSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_class = CourseFilter
    ordering_fields = ['created_at', 'updated_at']
    search_fields = ['title']
    ordering = ['updated_at']
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    # swagger_schema = CustomAutoSchema
    # my_tags = ['Tasks']

    def filter_queryset(self, queryset):
        for backend in self.filter_backends:
            queryset = backend().filter_queryset(self.request, queryset, view=self)

        return queryset

    def list(self, request):
        """ 
        for all
        """
        serializer = self.serializer_class(self.filter_queryset(self.queryset), many=True)
        ctx = {'courses': serializer.data}
        return Response(data=ctx, status=status.HTTP_200_OK)

    def create(self, request):
        """ 
        For authorized user
        """
        # data = {**request.data, '': section_pk}
        data = request.data
        serializer = self.serializer_class(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def retrieve(self, request, pk=None):
        obj = get_object_or_404(self.queryset, pk=pk)

        
        is_full = request.query_params.get('full')
        
        if is_full:
            obj_serializer = self.full_course_serializer_class(obj)
        else:
            obj_serializer = self.serializer_class(obj)
        
        ctx = {'course': obj_serializer.data}

        return Response(data=ctx, status=status.HTTP_200_OK)

    def update(self, request, pk=None):
        """ 
        For owner|author
        """
        obj = get_object_or_404(self.queryset, pk=pk)
        serializer = self.serializer_class(obj, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_205_RESET_CONTENT)

    def partial_update(self, request, pk=None):
        """ 
        For owner|author
        """
        obj = get_object_or_404(self.queryset, pk=pk)
        serializer = self.serializer_class(obj, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_205_RESET_CONTENT)

    def delete(self, request, pk=None):
        """ 
        For owner|author
        """
        obj = get_object_or_404(self.queryset, pk=pk)
        obj.is_active = False
        obj.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['patch'])
    def attach_user(self, request, pk=None):
        """ 
        For owner|author
        """
        obj = get_object_or_404(self.queryset, pk=pk)
        obj.user = get_object_or_404(User.objects, pk=request.data.get('user_pk'))
        obj.save()
        return Response(status=status.HTTP_205_RESET_CONTENT)
        

class ModuleViewSet(viewsets.ViewSet):
    queryset = Module.objects
    serializer_class = ModuleSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def create(self, request, course):
        data = request.data
        serializer = self.serializer_class(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def retrieve(self, request, course, module):
        obj = get_object_or_404(self.queryset, pk=module)
        serializer = self.serializer_class(obj)
        ctx = {'organization': serializer.data}
        return Response(data=ctx, status=status.HTTP_200_OK)

    def update(self, request, course, module):
        obj = get_object_or_404(self.queryset, pk=module)
        serializer = self.serializer_class(obj, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_205_RESET_CONTENT)

    def partial_update(self, request, course, module):
        obj = get_object_or_404(self.queryset, pk=module)
        serializer = self.serializer_class(obj, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_205_RESET_CONTENT)

    def destroy(self, course, request, module):
        obj = get_object_or_404(self.queryset, pk=module)
        obj.is_active = False
        obj.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


# class LessonViewSet(viewsets.ViewSet):
#     queryset = Lesson.objects
#     serializer_class = LessonSerializer
#     permission_classes = [permissions.IsAuthenticatedOrReadOnly]

#     def create(self, request, course, module):
#         data = request.data
#         serializer = self.serializer_class(data=data)
#         serializer.is_valid(raise_exception=True)
#         serializer.save()
#         return Response(serializer.data, status=status.HTTP_201_CREATED)

#     def retrieve(self, request, course, module, lesson):
#         obj = get_object_or_404(self.queryset, pk=lesson)
#         serializer = self.serializer_class(obj)
#         ctx = {'organization': serializer.data}
#         return Response(data=ctx, status=status.HTTP_200_OK)

#     def update(self, request, course, module, lesson):
#         obj = get_object_or_404(self.queryset, pk=lesson)
#         serializer = self.serializer_class(obj, data=request.data)
#         serializer.is_valid(raise_exception=True)
#         serializer.save()
#         return Response(status=status.HTTP_205_RESET_CONTENT)

#     def partial_update(self, request, course, module, lesson):
#         obj = get_object_or_404(self.queryset, pk=lesson)
#         serializer = self.serializer_class(obj, data=request.data, partial=True)
#         serializer.is_valid(raise_exception=True)
#         serializer.save()
#         return Response(status=status.HTTP_205_RESET_CONTENT)

#     def destroy(self, request, course, module, lesson):
#         obj = get_object_or_404(self.queryset, pk=lesson)
#         obj.is_active = False
#         obj.save()
#         return Response(status=status.HTTP_204_NO_CONTENT)


class StepViewSet(viewsets.ViewSet):
    queryset = Step.objects
    serializer_class = PolymorphicStepSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def create(self, request, course, module, lesson):
        data = request.data
        serializer = self.serializer_class(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def retrieve(self, request, course, module, lesson, pk):
        obj = get_object_or_404(self.queryset, pk=pk)
        serializer = self.serializer_class(obj)
        ctx = {'step': serializer.data}
        return Response(data=ctx, status=status.HTTP_200_OK)

    def update(self, request, course, module, lesson, pk):
        obj = get_object_or_404(self.queryset, pk=pk)
        serializer = self.serializer_class(obj, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_205_RESET_CONTENT)

    def partial_update(self, request, course, module, lesson, pk):
        obj = get_object_or_404(self.queryset, pk=pk)
        serializer = self.serializer_class(obj, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_205_RESET_CONTENT)

    def destroy(self, request, course, module, lesson, pk):
        obj = get_object_or_404(self.queryset, pk=pk)
        obj.is_active = False
        obj.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


# <------------------------------------/>
