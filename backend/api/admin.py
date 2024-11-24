from django.contrib import admin

from .custom_admin_registration.public_recipe_admin_registrtion import PublicRecipeAdmin
from .custom_models.user_profile_models import UserProfile

admin.site.register(UserProfile)
