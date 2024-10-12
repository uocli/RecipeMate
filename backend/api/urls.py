from django.urls import path
from .views import signup, get_csrf_token

urlpatterns = [
    path("auth/signup/", signup, name="signup"),
    path("csrf-token/", get_csrf_token, name="csrf-token"),
]
