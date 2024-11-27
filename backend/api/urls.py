from django.urls import path, include

from .custom_views.recipe_views import RecipeListView, RecipeDetailView, RecipeRateView
from .custom_views.user_profile_views import UserProfileView
from .custom_views.generate_recipe_views import RecipeGeneratorView
from .custom_views.favorites_view import FavoriteListView, FavoriteDeleteView
from .custom_views.shopping_list_views import ShoppingListView
from api.custom_views.favorites_view import AddToShoppingListView
from .custom_views.generate_recipe_views import RecipeGeneratorView
from .custom_views.favorites_view import AddToFavoritesView


urlpatterns = [
    path("user-profile/", UserProfileView.as_view(), name="csrf-token"),
    path("password/", include("api.custom_urls.password_urls"), name="password"),
    path("email/", include("api.custom_urls.email_request_urls"), name="email-requests"),
    path('favorites/', FavoriteListView.as_view(), name='favorites-list'),
    path('favorites/<int:pk>/', FavoriteDeleteView.as_view(), name='favorite-delete'),
    path('shopping-list/', ShoppingListView.as_view(), name='shopping-list'),
    path("favorites/<int:pk>/add-to-shopping-list/", AddToShoppingListView.as_view(), name="add-to-shopping-list"),
    path("generate/", RecipeGeneratorView.as_view(), name="recipe_generate"),
    path('favorites/add/', AddToFavoritesView.as_view(), name='add-favorite'),
    path("recipes/", RecipeListView.as_view(), name="recipe-list"),
    path("recipe/<str:uuid>/", RecipeDetailView.as_view(), name="recipe-detail"),
    path("recipe/<str:uuid>/rate/", RecipeRateView.as_view(), name="recipe-detail"),
]
