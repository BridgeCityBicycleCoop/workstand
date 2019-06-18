from django.apps import AppConfig


class BikeConfig(AppConfig):
    name = "bike"

    def ready(self):
        import bike.signals  # noqa
