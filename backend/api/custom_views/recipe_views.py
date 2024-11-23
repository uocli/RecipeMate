from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from ..custom_models.recipe_models import Recipe
from ..serializers.recipe_serializers import RecipeSerializer


class RecipeListView(APIView):
    def get(self, request):
        recipes = Recipe.objects.all()
        serializer = RecipeSerializer(recipes, many=True)
        return Response(serializer.data)


class RecipeDetailView(APIView):
    def get(self, request, uuid):
        try:
            recipe = Recipe.objects.get(uuid=uuid)
            serializer = RecipeSerializer(recipe)
            return Response(serializer.data)
        except Recipe.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
