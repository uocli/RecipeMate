from django.urls import path
from .views import get_csrf_token

urlpatterns = [
    path("csrf-token/", get_csrf_token, name="csrf-token"),
]
