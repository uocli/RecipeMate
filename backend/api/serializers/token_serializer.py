from rest_framework import serializers

from ..custom_models.token_model import Token


class TokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Token
        fields = [
            "token",
            "created_at",
            "expires_at",
            "user",
            "is_used",
        ]
