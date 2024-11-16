from django.urls import path

from ..custom_views.password_forgot_view import PasswordForgotView
from ..custom_views.password_reset_view import ResetPasswordView

urlpatterns = [
    path("forgot/", PasswordForgotView.as_view(), name="forgot_password"),
    path("reset/", ResetPasswordView.as_view(), name="reset_password"),
]
