from openai import OpenAI
from django.conf import settings
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from typing import List, Dict
from ..custom_models.recipe_models import Recipe
import json

class RecipeGeneratorView(APIView):
    def __init__(self):
        super().__init__()
        try:
            self.client = OpenAI(
                api_key=settings.OPENAI_API_KEY,
                base_url="https://chatapi.littlewheat.com/v1/",
            )
        except Exception as e:
            print(f"Error initializing OpenAI client: {str(e)}")
    
    permission_classes = [IsAuthenticated]

    def validate_ingredients(self, ingredients: List[str]) -> bool:
        """Validate that ingredients are non-empty strings"""
        return all(isinstance(item, str) and item.strip() for item in ingredients)

    
    def create_prompt(self, ingredients: List[str], preferences: Dict) -> str:
        ingredients_list = ", ".join(ingredients)

        dietary_pref = preferences.get('dietary_preference', '')
        cooking_time = preferences.get('cooking_time', '')

        dietary_instructions = {
            '': "No dietary restrictions",  # Added None option
            'gluten_free': "Ensure no gluten-containing ingredients",
            'dairy_free': "Exclude all dairy and lactose",
            'vegetarian': "No meat products",
            'vegan': "No animal products",
            'paleo': "Follow paleo diet guidelines",
            'fodmap': "Use only low FODMAP ingredients",
            'nut_free': "No tree nuts or peanuts",
            'fish_free': "No fish or shellfish",
            'keto': "High fat, low carb ingredients only"
        }

        dietary_instruction = dietary_instructions.get(dietary_pref, "")

        return f"""Create a recipe using these ingredients: {ingredients_list}.
        Dietary restriction: {dietary_pref if dietary_pref else 'None'} - {dietary_instruction}
        Cooking time preference: {cooking_time}
        
       Format the response EXACTLY as this JSON object example:
        {{
            "title": "Herb-Roasted Garlic Potatoes",
            "ingredients": [
                {{
                    "ingredient": "Potatoes",
                    "quantity": "2 pounds"
                }},
                {{
                    "ingredient": "Olive oil",
                    "quantity": "3 tablespoons"
                }}
            ],
            "instructions": [
                "Preheat your oven to 425°F (220°C).",
                "Wash and peel the potatoes, then cut them into 1-inch cubes.",
                "In a large bowl, combine all ingredients and toss well."
            ],
            "cooking_time": "40 minutes",
            "difficulty": "easy"
        }}

        Ensure:
        - All ingredients have quantity measurements
        - Instructions are clear, numbered steps
        - Cooking time includes units (minutes/hours)
        - Difficulty is one of: easy/medium/hard
        """


    def generate_recipe(self, ingredients: List[str], preferences: Dict) -> Dict:
        try:
            prompt = self.create_prompt(ingredients, preferences)
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a professional chef creating recipes."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=500
            )
            
            # Parse and validate the response
            recipe_text = response.choices[0].message.content
            # print(f"Raw OpenAI response: {recipe_text}")
            recipe = json.loads(recipe_text)
            return recipe
            
        
        except Exception as e:
            print(f"OpenAI API Error: {str(e)}")
            raise Exception("Failed to generate recipe")
        
    def save_recipe(self, recipe_data: Dict, user: User, preferences: Dict) -> Recipe:
        """Save generated recipe to database"""
        try:
            cooking_time = self._convert_cooking_time(recipe_data.get('cooking_time', ''))
            print(f"Converting cooking time from {recipe_data.get('cooking_time')} to {cooking_time}")
        
            recipe = Recipe.objects.create(
                title=recipe_data['title'],
                user=user,
                ingredients=recipe_data['ingredients'],
                instructions=recipe_data['instructions'],
                cooking_time=cooking_time,
                difficulty=recipe_data.get('difficulty', 'medium'),
                dietary_preference=preferences.get('dietary_preference', '')
            )
            return recipe
        except Exception as e:
            print(f"Error saving recipe: {str(e)}")
            raise Exception("Failed to save recipe")
        
    def get_user_preferences(self, user: User) -> Dict:
        """Fetch user preferences from profile"""
        try:
            profile = user.profile
            return {
                'dietary_preference': profile.dietary_preference or '',
                'cooking_time': profile.cooking_time or ''
            }
        except Exception as e:
            print(f"Error fetching user preferences: {str(e)}")
            return {'dietary_preference': '', 'cooking_time': ''}


    def post(self, request):
        try:
            ingredients = request.data.get('ingredients', [])
            user = request.user
            preferences = request.data.get('preferences', {})
            # print(f"User preferences from front: {preferences}")

            if not self.validate_ingredients(ingredients):
                return Response(
                    {"success": False, "message": "Invalid ingredients"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Generate recipe logic here
            recipe_data = self.generate_recipe(ingredients, preferences)
            # print(f"recipe_data: {recipe_data}")
            # Check if generation was successful
            if recipe_data.get('title') == "Recipe Generation Error":
                return Response(
                    {
                        "success": False,
                        "message": "Failed to generate recipe. Please try again.",
                        "error_details": recipe_data
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            saved_recipe = self.save_recipe(recipe_data, user, preferences)
            return Response({
                "success": True,
                "message": "Recipe generated and saved successfully",
                "data": {
                    "id": saved_recipe.id,
                    "title": saved_recipe.title,
                    "ingredients": saved_recipe.ingredients,
                    "instructions": saved_recipe.instructions,
                    "cooking_time": saved_recipe.cooking_time,
                    "difficulty": saved_recipe.difficulty,
                    "dietary_preference": saved_recipe.dietary_preference
                }
            })

        except Exception as e:
            return Response(
                {"success": False, "message": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
    def _convert_cooking_time(self, time_str: str) -> str:
        """Convert cooking time string to model choice"""
        try:
            # Extract number and unit from string like "40 minutes" or "1.5 hours"
            import re
            match = re.search(r'(\d+(?:\.\d+)?)\s*(minute|hour|min|hr)s?', time_str.lower())
            if not match:
                return 'medium'
                
            amount = float(match.group(1))
            unit = match.group(2)
            
            # Convert to minutes if necessary
            if unit.startswith('hour'):
                minutes = amount * 60
            else:
                minutes = amount
                
            # Map to choices
            if minutes <= 30:
                return 'limited'
            elif minutes <= 60:
                return 'medium'
            else:
                return 'Extended'
                
        except Exception as e:
            print(f"Error converting cooking time: {str(e)}")
            return 'medium'