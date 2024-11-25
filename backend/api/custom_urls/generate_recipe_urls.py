# backend/api/urls/custom_urls/recipe_urls.py

from django.urls import path
from ..custom_views.generate_recipe_views import RecipeGeneratorView

urlpatterns = [
    path("generate/", 
         RecipeGeneratorView.as_view(), 
         name="recipe_generate"),
]