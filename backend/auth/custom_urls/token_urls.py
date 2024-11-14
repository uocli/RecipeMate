from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from ..custom_views.token_views import VerifyTokenView

urlpatterns = [
    path("", TokenObtainPairView.as_view(), name="token_obtain"),
    path("verify/", VerifyTokenView.as_view(), name="token_verify"),
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
