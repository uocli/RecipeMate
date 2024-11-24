from django.contrib import admin

from .custom_models.user_profile_models import UserProfile
from .custom_models.public_recipe_models import PublicRecipe, Ingredient


class RecipeAdmin(admin.ModelAdmin):
    list_display = ("name", "description")
    search_fields = ("name", "description")
    filter_horizontal = ("ingredients",)


admin.site.register(UserProfile)
admin.site.register(PublicRecipe, RecipeAdmin)
admin.site.register(Ingredient)
