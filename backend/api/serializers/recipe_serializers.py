from rest_framework import serializers
from ..custom_models.recipe_models import Recipe, Ingredient


class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ["name"]


class RecipeSerializer(serializers.ModelSerializer):
    ingredients = IngredientSerializer(many=True)

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
