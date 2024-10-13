from django.urls import path
from .views import signup_view, login_view, verify_token_view

urlpatterns = [
    path("signup/", signup_view, name="signup"),
    path("login/", login_view, name="login"),
    path("verify-token/", verify_token_view, name="verify-token"),
]
