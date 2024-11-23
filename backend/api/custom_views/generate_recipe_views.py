from openai import OpenAI
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from typing import List, Dict

class RecipeGeneratorView(APIView):
    def __init__(self):
        super().__init__()
        self.client = OpenAI(
                        api_key=settings.OPENAI_API_KEY,
                        base_url="https://chatapi.littlewheat.com/v1/",
                        model="gpt-3.5-turbo-0125"
                        )
    
    permission_classes = [IsAuthenticated]

    def validate_ingredients(self, ingredients: List[str]) -> bool:
        """Validate that ingredients are non-empty strings"""
        return all(isinstance(item, str) and item.strip() for item in ingredients)

    def validate_preferences(self, preferences: List[int]) -> bool:
        """Validate that preferences are valid integers"""
        return all(isinstance(item, int) for item in preferences)
    
    def create_prompt(self, ingredients: List[str], preferences: List[int]) -> str:
        ingredients_list = ", ".join(ingredients)
        prefs = self._get_preferences_text(preferences)
        
        return f"""Create a recipe using these ingredients: {ingredients_list}.
        Dietary preferences: {prefs}
        
        Format the response as a JSON object with:
        - title: recipe name
        - ingredients: list of ingredients with quantities
        - instructions: numbered list of cooking steps
        - cooking_time: estimated time
        - difficulty: easy/medium/hard
        """

    def _get_preferences_text(self, preference_ids: List[int]) -> str:
        # Map preference IDs to text (implement based on your preference model)
        preferences_map = {
            1: "vegetarian",
            2: "vegan",
            3: "gluten-free",
            4: "dairy-free"
        }
        return ", ".join(preferences_map.get(p, "") for p in preference_ids)

    def generate_recipe(self, ingredients: List[str], preferences: List[int]) -> Dict:
        try:
            prompt = self.create_prompt(ingredients, preferences)
            
            response = self.client.chat.completions.create(
                # model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a professional chef creating recipes."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=500
            )
            
            # Parse and validate the response
            recipe_text = response.choices[0].message.content
            try:
                import json
                recipe = json.loads(recipe_text)
                return recipe
            except json.JSONDecodeError:
                return {
                    "title": "Recipe Generation Error",
                    "ingredients": ingredients,
                    "instructions": ["Could not generate recipe"],
                    "cooking_time": "N/A",
                    "difficulty": "N/A",
                    "preferences_applied": preferences
                }
        
        except Exception as e:
            print(f"OpenAI API Error: {str(e)}")
            raise Exception("Failed to generate recipe")

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