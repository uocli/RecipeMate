from rest_framework import serializers
from django.contrib.auth.models import User


class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    User Registration Serializer for checking the validity of the user registration data.
    """

    class Meta:
        model = User
        fields = [
            "email",
            "password",
            "username",
        ]
