from rest_framework import serializers
from ..custom_models.favorites_model import Favorite


class FavoriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorite
        fields = ['id', 'user', 'recipe_id', 'name', 'ingredients', 'recipe', 'added_at']
        read_only_fields = ['id', 'user', 'added_at']