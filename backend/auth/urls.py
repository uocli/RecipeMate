from django.urls import path, include

from .custom_views.login_view import LoginView
from .custom_views.logout_view import LogoutView
from .custom_views.registration_view import RegistrationView
from .custom_views.csrf_token_view import CSRFTokenView

urlpatterns = [
    path("csrf-token/", CSRFTokenView.as_view(), name="csrf-token"),
    path("token/", include("auth.custom_urls.token_urls")),
    path("signup/", RegistrationView.as_view(), name="signup"),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
]
