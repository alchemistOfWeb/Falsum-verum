from django.apps import AppConfig


class CoursesApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'courses_api'

    def ready(self) -> None:
        import courses_api.signals
