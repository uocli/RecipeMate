from django.urls import path

from ..custom_views.email_change_views import EmailChangeView

urlpatterns = [
    path("change/", EmailChangeView.as_view(), name="change-email"),
]
