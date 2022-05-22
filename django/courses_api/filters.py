import django_filters
from django_filters import rest_framework as filters
from .models import Course, Organization, Specialization


# class IdFilterInFilter(filters.BaseInFilter, filters.NumberFilter):
#     ...


class OrganizationFilter(filters.FilterSet):
    # format: Y-M-d[ H[:i[:s]]]
    ca_min = filters.DateTimeFilter(field_name='created_at', lookup_expr='gt')
    ca_max = filters.DateTimeFilter(field_name='created_at', lookup_expr='lt')

    # completion_min = filters.NumberFilter(field_name='completion', lookup_expr='gt')
    # completion_max = filters.NumberFilter(field_name='completion', lookup_expr='lt')

    # tags = IdFilterInFilter(field_name='tags__id', lookup_expr='in')

    class Meta:
        model = Organization
        fields = [
            'created_at',
            'updated_at'
        ]


class SpecializationFilter(filters.FilterSet):
    # format: Y-M-d[ H[:i[:s]]]
    ca_min = filters.DateTimeFilter(field_name='created_at', lookup_expr='gt')
    ca_max = filters.DateTimeFilter(field_name='created_at', lookup_expr='lt')

    # completion_min = filters.NumberFilter(field_name='completion', lookup_expr='gt')
    # completion_max = filters.NumberFilter(field_name='completion', lookup_expr='lt')

    # tags = IdFilterInFilter(field_name='tags__id', lookup_expr='in')

    class Meta:
        model = Specialization
        fields = [
            'created_at',
            'updated_at'
        ]


class CourseFilter(filters.FilterSet):
    # format: Y-M-d[ H[:i[:s]]]
    ca_min = filters.DateTimeFilter(field_name='created_at', lookup_expr='gt')
    ca_max = filters.DateTimeFilter(field_name='created_at', lookup_expr='lt')

    # completion_min = filters.NumberFilter(field_name='completion', lookup_expr='gt')
    # completion_max = filters.NumberFilter(field_name='completion', lookup_expr='lt')

    # tags = IdFilterInFilter(field_name='tags__id', lookup_expr='in')

    class Meta:
        model = Course
        fields = [
            'created_at',
            'updated_at'
        ]
