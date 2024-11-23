from django.db.models import Avg
from rest_framework import serializers
from ..custom_models.recipe_models import Ingredient, Recipe, Rating


class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ["name"]


class RecipeSerializer(serializers.ModelSerializer):
    ingredients = IngredientSerializer(many=True)
    average_rating = serializers.SerializerMethodField()

    class Meta:
        model = Recipe
        fields = [
            "uuid",
            "name",
            "image_url",
            "description",
            "ingredients",
            "instructions",
            "average_rating",
        ]

    def get_average_rating(self, obj):
        ratings = Rating.objects.filter(recipe=obj)
        if ratings.exists():
            return ratings.aggregate(Avg("rating"))["rating__avg"]
        return None
