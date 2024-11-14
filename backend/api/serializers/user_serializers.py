from rest_framework import serializers
from django.contrib.auth.models import User

from .user_profile_serializers import UserProfileSerializer


class UserSerializer(serializers.ModelSerializer):
    # Nested ProfileSerializer to include profile information
    profile = UserProfileSerializer()

    class Meta:
        model = User
        fields = ["email", "profile"]
