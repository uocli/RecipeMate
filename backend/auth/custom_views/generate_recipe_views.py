
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from typing import List, Dict

class RecipeGeneratorView(APIView):
    """
    API view for generating recipes based on ingredients and preferences.
    Requires authentication.
    """
    permission_classes = [IsAuthenticated]

    def validate_ingredients(self, ingredients: List[str]) -> bool:
        """Validate that ingredients are non-empty strings"""
        return all(isinstance(item, str) and item.strip() for item in ingredients)

    def validate_preferences(self, preferences: List[int]) -> bool:
        """Validate that preferences are valid integers"""
        return all(isinstance(item, int) for item in preferences)

    def generate_recipe(self, ingredients: List[str], preferences: List[int]) -> Dict:
        """Generate recipe based on ingredients and preferences"""
        # TODO: Implement actual recipe generation logic
        return {
            "title": "Sample Recipe",
            "ingredients": ingredients,
            "instructions": ["Step 1: Mix ingredients", "Step 2: Cook"],
            "cooking_time": "30 mins",
            "difficulty": "medium",
            "preferences_applied": preferences
        }

    def post(self, request):
        """Handle POST request for recipe generation"""
        try:
            ingredients = request.data.get('ingredients', [])
            preferences = request.data.get('preferences', [])

            # Validation
            if not ingredients:
                return Response(
                    {"success": False, "message": "No ingredients provided"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if not self.validate_ingredients(ingredients):
                return Response(
                    {"success": False, "message": "Invalid ingredients format"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if preferences and not self.validate_preferences(preferences):
                return Response(
                    {"success": False, "message": "Invalid preferences format"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Generate recipe
            recipe = self.generate_recipe(ingredients, preferences)

            return Response({
                "success": True,
                "message": "Recipe generated successfully",
                "data": recipe
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                "success": False,
                "message": f"Error generating recipe: {str(e)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)