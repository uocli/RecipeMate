from django.urls import path

from ..custom_views.token_views import VerifyTokenView, CustomTokenRefreshView

urlpatterns = [
    path("", CustomTokenRefreshView.as_view(), name="token_obtain"),
    path("verify/", VerifyTokenView.as_view(), name="token_verify"),
    path("refresh/", CustomTokenRefreshView.as_view(), name="token_refresh"),
]
