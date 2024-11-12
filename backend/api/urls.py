from django.urls import path
from .views import get_csrf_token
from .views import get_shopping_list

urlpatterns = [
    path("csrf-token/", get_csrf_token, name="csrf-token"),
    path('shopping-list/', get_shopping_list, name='shopping-list'),
]
