from unicodedata import name
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    csrf, current_profile,
    OrganizationViewSet, SpecializationViewSet, CourseViewSet,
    ModuleViewSet, LessonViewSet, StepViewSet
)


router = DefaultRouter()

router.register(r'orgs', OrganizationViewSet, basename='org_list')
router.register(r'courses', CourseViewSet, basename='course_list')
router.register(r'specializations', SpecializationViewSet, basename='specialization_list')

# router.register(r'orgs/(?P<org_pk>\d+)/course',
#                 CourseFullViewSet, basename='detail_course')

router.register(r'courses/(?P<course>\d+)/modules',
                ModuleViewSet, basename='module_list')

router.register(r'courses/(?P<course>\d+)/modules/(?P<module>\d+)/lessons',
                LessonViewSet, basename='lesson_list')

router.register(r'courses/(?P<course>\d+)/modules/(?P<module>\d+)/lessons/(?P<lesson>\d+)/steps',
                StepViewSet, basename='step_list')

urlpatterns = [
    # path('profile/', current_profile, name='profile'), # get|patch|delete
    path('csrf/', csrf, name='get_csrf'),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.authtoken')),
    path('auth/', include('djoser.urls.jwt')),
] + router.urls