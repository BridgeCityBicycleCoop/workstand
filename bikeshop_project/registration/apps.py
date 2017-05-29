from django.apps import AppConfig


class RegistrationConfig(AppConfig):
    name = "registration"

    def ready(self):
        import registration.handlers
