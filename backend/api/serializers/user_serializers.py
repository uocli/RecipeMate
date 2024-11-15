from rest_framework import serializers
from django.contrib.auth.models import User

from .user_profile_serializers import UserProfileSerializer


class UserSerializer(serializers.ModelSerializer):
    # Nested ProfileSerializer to include profile information
    profile = UserProfileSerializer()
    acronym = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["email", "first_name", "last_name", "acronym", "profile"]

    def get_acronym(self, obj):
        first_initial = obj.first_name[0].upper() if obj.first_name else ""
        last_initial = obj.last_name[0].upper() if obj.last_name else ""

        return f"{first_initial}{last_initial}"
