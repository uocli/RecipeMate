from django.urls import path

from .custom_views.password_forgot_view import PasswordForgotView

urlpatterns = [
    path("password-forgot/", PasswordForgotView.as_view(), name="forgot_password"),
]
