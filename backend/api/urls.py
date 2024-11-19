from django.urls import path, include

from .custom_views.user_profile_views import UserProfileView
from .custom_views.shopping_list_views import ShoppingListView

urlpatterns = [
    path("user-profile/", UserProfileView.as_view(), name="csrf-token"),
    path("password/", include("api.custom_urls.password_urls"), name="password"),
    path('shopping-list/', ShoppingListView.as_view(), name='shopping-list'),
]