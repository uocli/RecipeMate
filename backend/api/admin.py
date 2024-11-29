from django.contrib import admin
from .custom_models.favorites_model import Favorite  # Import the Favorite model

from .custom_admin_registration.public_recipe_admin_registration import (
    PublicRecipeAdmin,
)
from .custom_admin_registration.ingredient_admin_registration import IngredientAdmin
from .custom_models.user_profile_models import UserProfile

admin.site.register(UserProfile)


@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'name', 'added_at')  # Customize columns shown in the admin list view
    search_fields = ('name', 'user__username')  # Add search functionality by recipe name or user
    list_filter = ('added_at',)  # Add a filter for the date added
    ordering = ('-added_at',)  # Order by most recently added by default