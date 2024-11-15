from django.urls import path
from .custom_views.user_profile_views import UserProfileView

urlpatterns = [
    path("user-profile/", UserProfileView.as_view(), name="csrf-token"),
]
