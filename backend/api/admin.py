from django.contrib import admin

from .custom_models.user_profile_models import UserProfile

admin.site.register(UserProfile)
