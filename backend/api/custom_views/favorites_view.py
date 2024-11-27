from rest_framework import generics, permissions
from ..custom_models.favorites_model import Favorite
from ..custom_models.shopping_list_models import ShoppingListItem
from ..serializers.favorites_serializer import FavoriteSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import json

class FavoriteListView(generics.ListCreateAPIView):
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class FavoriteDeleteView(generics.DestroyAPIView):
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)


class AddToShoppingListView(APIView):
    def post(self, request, pk):
        try:
            # Get the favorite recipe
            favorite = Favorite.objects.get(pk=pk, user=request.user)
            
            # Parse the JSON string to get all the ingredient names
            ingredients_data = json.loads(favorite.ingredients)
            ingredients = [ingredient['ingredient'] for ingredient in ingredients_data]

            # Fetch existing shopping list items for the user
            existing_items = ShoppingListItem.objects.filter(user=request.user)

            added_ingredients = []  # Track successfully added ingredients
            for ingredient in ingredients:
                ingredient_name = ingredient.strip()  # Remove extra spaces
                
                # Get the object with the same name as ingredient_name from existing_ingredients
                existing_item = existing_items.filter(ingredient__iexact=ingredient_name).first()
    
                if not existing_item:
                    # Add to the shopping list if not already present
                    ShoppingListItem.objects.create(
                        user=request.user,
                        ingredient=ingredient_name,
                        quantity=0,  # Fixed quantity
                        is_owned=False,  # Default to False
                    )
                    added_ingredients.append(ingredient_name)
                elif existing_item.is_owned:
                    # Reset the is_owned status and quantity if the item is already marked is_owned in the shopping list
                    existing_item.quantity = 0
                    existing_item.is_owned = False
                    existing_item.save()
                    added_ingredients.append(ingredient_name)

            if added_ingredients:
                return Response({"message": f"Added {', '.join(added_ingredients)} to shopping list."}, status=status.HTTP_201_CREATED)
            else:
                return Response({"message": "No new ingredients were added. All are already in the shopping list."}, status=status.HTTP_200_OK)
        except Favorite.DoesNotExist:
            return Response({"error": "Favorite recipe not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class AddToFavoritesView(APIView):

    def post(self, request):
        try:
            favorite = Favorite.objects.create(
                user=request.user,
                name=request.data.get('name'),
                ingredients=request.data.get('ingredients'),
                recipe=request.data.get('recipe')
            )
            return Response({
                'success': True,
                'message': 'Added to favorites'
            })
        except Exception as e:
            return Response({
                'success': False,
                'message': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)