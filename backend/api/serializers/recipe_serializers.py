from rest_framework import serializers
from ..custom_models.recipe_models import Recipe


class RecipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipe
        fields = [
            "uuid",
            "name",
            "image_url",
            "description",
            "ingredients",
            "instructions",
        ]
