from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView

from ..custom_views.token_views import VerifyTokenView, CustomTokenRefreshView

urlpatterns = [
    path("", TokenObtainPairView.as_view(), name="token_obtain"),
    path("verify/", VerifyTokenView.as_view(), name="token_verify"),
    path("refresh/", CustomTokenRefreshView.as_view(), name="token_refresh"),
]
