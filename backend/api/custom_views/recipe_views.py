from django.db.models import Avg, Value, FloatField
from django.db.models.functions import Coalesce
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from ..custom_models.public_recipe_models import PublicRecipe, Rating
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

            return Response({"message": "Rating updated successfully"})
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
