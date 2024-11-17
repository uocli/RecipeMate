from rest_framework import serializers

from ..custom_models.user_profile_models import UserProfile


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = [
            "dietary_preference",
            "cooking_time",
        ]
