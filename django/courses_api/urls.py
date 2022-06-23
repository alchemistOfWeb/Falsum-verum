from django.urls import path, include, re_path
from rest_framework.routers import DefaultRouter
from .views import (
    CourseReviewViewSet, csrf, current_profile,
    OrganizationViewSet, SpecializationViewSet, CourseViewSet,
    StepViewSet, StepCommentsViewSet
)


router = DefaultRouter()

router.register(r'orgs', OrganizationViewSet, basename='orgs')
router.register(r'courses/(?P<course>\d+)/reviews', CourseReviewViewSet, basename='course_reviews')
router.register(r'courses', CourseViewSet, basename='courses')
router.register(r'specializations', SpecializationViewSet, basename='specializations')

router.register(r'courses/(?P<course>\d+)/modules/(?P<module>\d+)/lessons/(?P<lesson>\d+)/steps',
                StepViewSet, basename='steps')
router.register(
    r'courses/(?P<course>\d+)/modules/(?P<module>\d+)/lessons/(?P<lesson>\d+)/steps/(?P<step>\d+)/comments',
    StepCommentsViewSet, 
    basename='step_comments'
)

urlpatterns = [
    path('profile/', current_profile, name='profile'), # get|patch|delete
    path('csrf/', csrf, name='get_csrf'),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.authtoken')),
    path('auth/', include('djoser.urls.jwt')),
    re_path(r'^_nested_admin/', include('nested_admin.urls')),
] + router.urls