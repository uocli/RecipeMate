from django.contrib import admin

from .custom_models.user_profile_models import UserProfile
from .custom_models.recipe_models import Recipe

admin.site.register(UserProfile)
admin.site.register(Recipe)
