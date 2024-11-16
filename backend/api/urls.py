from django.urls import path, include

urlpatterns = [
    path("password/", include("api.custom_urls.password_urls"), name="password"),
]
