from django.urls import path
from ..custom_views.shopping_list_views import ShoppingListView

urlpatterns = [
    path('shopping-list/', ShoppingListView.as_view(), name='shopping-list'),
]