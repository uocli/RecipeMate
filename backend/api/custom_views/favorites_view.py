from rest_framework import generics, permissions
from ..custom_models.favorites_model import Favorite
from ..custom_models.shopping_list_models import ShoppingListItem
from ..serializers.favorites_serializer import FavoriteSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
# from api.custom_models.favorites_model import Favorite
# from api.custom_models.shopping_list_models import ShoppingListItem

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

# class AddToShoppingListView(APIView):
#     def post(self, request, pk):
#         try:
#             # Get the favorite recipe
#             favorite = Favorite.objects.get(pk=pk, user=request.user)
            
#             # Split ingredients into a list (assumes comma-separated string)
#             ingredients = favorite.ingredients.split(",")  
            
#             for ingredient in ingredients:
#                 # Add each ingredient with quantity=1
#                 ShoppingListItem.objects.create(
#                     user=request.user,
#                     ingredient=ingredient.strip(),
#                     quantity=1  # Fixed quantity
#                 )

#             return Response({"message": "Ingredients added to shopping list."}, status=status.HTTP_201_CREATED)
#         except Favorite.DoesNotExist:
#             return Response({"error": "Favorite recipe not found."}, status=status.HTTP_404_NOT_FOUND)
#         except Exception as e:
#             return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.custom_models.favorites_model import Favorite
from api.custom_models.shopping_list_models import ShoppingListItem

class AddToShoppingListView(APIView):
    def post(self, request, pk):
        try:
            # Get the favorite recipe
            favorite = Favorite.objects.get(pk=pk, user=request.user)
            
            # Split ingredients into a list (assuming they are comma-separated)
            ingredients = favorite.ingredients.split(",")

            # Fetch existing shopping list items for the user
            existing_items = ShoppingListItem.objects.filter(user=request.user)
            existing_ingredients = set(item.ingredient.lower() for item in existing_items)  # Normalize to lowercase for comparison

            added_ingredients = []  # Track successfully added ingredients
            for ingredient in ingredients:
                ingredient_name = ingredient.strip()  # Remove extra spaces
                if ingredient_name.lower() not in existing_ingredients:
                    # Add to the shopping list if not already present
                    ShoppingListItem.objects.create(
                        user=request.user,
                        ingredient=ingredient_name,
                        quantity=1,  # Fixed quantity
                    )
                    added_ingredients.append(ingredient_name)

            if added_ingredients:
                return Response({"message": f"Added {', '.join(added_ingredients)} to shopping list."}, status=status.HTTP_201_CREATED)
            else:
                return Response({"message": "No new ingredients were added. All are already in the shopping list."}, status=status.HTTP_200_OK)
        except Favorite.DoesNotExist:
            return Response({"error": "Favorite recipe not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
