from django.urls import path

from ..custom_views.email_change_views import EmailChangeView, CompleteEmailChangeView

urlpatterns = [
    path("change/", EmailChangeView.as_view(), name="change-email"),
    path("change/complete/", CompleteEmailChangeView.as_view(), name="complete-email-change"),
]
