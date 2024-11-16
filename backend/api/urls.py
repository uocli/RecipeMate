from django.urls import path

from .custom_views.password_reset_view import PasswordResetView

urlpatterns = [
    path("password-forgot/", PasswordResetView.as_view(), name="forgot_password"),
]
