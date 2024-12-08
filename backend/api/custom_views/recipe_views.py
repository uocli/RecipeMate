import json

from django.db.models import Avg, Value, FloatField
from django.db.models.functions import Coalesce
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response

from ..custom_models.favorites_model import Favorite
from ..custom_models.public_recipe_models import PublicRecipe, Rating, Ingredient
from ..serializers.recipe_serializers import RecipeSerializer


class RecipeListView(APIView):
    authentication_classes = []  # No authentication required
    permission_classes = []  # No permissions required

    def get(self, request):
        recipes = PublicRecipe.objects.annotate(
            average_rating=Coalesce(
                Avg("ratings__rating"),
                Value(0),
                output_field=FloatField(),
            )
        ).order_by("-average_rating")
        serializer = RecipeSerializer(recipes, many=True)
        return Response(serializer.data)


class RecipeDetailView(APIView):
    authentication_classes = []  # No authentication required
    permission_classes = []  # No permissions required

    def get(self, request, uuid):
        try:
            recipe = PublicRecipe.objects.get(uuid=uuid)
            serializer = RecipeSerializer(recipe)
            return Response(serializer.data)
        except PublicRecipe.DoesNotExist:
            return Response(
                {"message": "Recipe could not be found!"},
                status=status.HTTP_404_NOT_FOUND,
            )


class RecipeRateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, uuid):
        try:
            recipe = PublicRecipe.objects.get(uuid=uuid)
            rating_value = request.data.get("rating")
            user = request.user

            rating, created = Rating.objects.update_or_create(
                user=user,
                recipe=recipe,
                defaults={"rating": rating_value},
            )

            # Reuse RecipeListView to get the updated list of recipes
            recipes_view = RecipeListView()
            response = recipes_view.get(request)
            updated_recipes = response.data

            return Response(
                {
                    "success": True,
                    "message": "Rating updated successfully",
                    "recipes": updated_recipes,
                },
                status=status.HTTP_200_OK,
            )
        except PublicRecipe.DoesNotExist:
            return Response(
                {"message": "Recipe could not be found!"},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            return Response(
                {"message": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )


class RecipeCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        user = request.user
        is_shared = request.data.get("is_shared", False)

        try:
            favorite = Favorite.objects.get(user=user, id=pk)
        except Favorite.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": "Favorite recipe not found.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        if not is_shared:
            # Unshare
            if hasattr(favorite, "public_recipe"):
                # Delete the public recipe if it exists and is_shared is False
                favorite.public_recipe.delete()
                return Response(
                    {
                        "success": True,
                        "message": "Public recipe deleted successfully.",
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {
                        "success": False,
                        "message": "Public recipe does not exist for this favorite.",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
        else:
            # Share
            if hasattr(favorite, "public_recipe"):
                return Response(
                    {
                        "success": False,
                        "message": "Public recipe already exists for this favorite.",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
            else:
                # Create the public recipe if it does not exist
                ingredients = favorite.ingredients
                recipe_steps = favorite.recipe

                if ingredients:
                    ingredients_data = json.loads(ingredients)
                    ingredient_names = [
                        ingredient["ingredient"].lower()
                        for ingredient in ingredients_data
                    ]

                    # Create or get ingredients
                    ingredient_objects = []
                    for name in ingredient_names:
                        ingredient, created = Ingredient.objects.get_or_create(
                            name=name
                        )
                        ingredient_objects.append(ingredient)

                instructions = ""
                if recipe_steps:
                    instructions = "\n".join(json.loads(recipe_steps))

                # Create the public recipe
                public_recipe = PublicRecipe.objects.create(
                    favorite=favorite,
                    name=favorite.name,
                    description=favorite.name,
                    instructions=instructions,
                )

                # Add ingredients to the public recipe
                public_recipe.ingredients.set(ingredient_objects)

                return Response(
                    {
                        "success": True,
                        "message": "Public recipe created successfully.",
                    },
                    status=status.HTTP_201_CREATED,
                )
