from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
import json
from django.http import JsonResponse

from ..custom_models.shopping_list_models import ShoppingListItem


class ShoppingListView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        print(f"Authenticated user: {user.username} (ID: {user.id})")  # Debug statement
        shopping_list = ShoppingListItem.objects.filter(user_id=user.id).order_by('is_owned')
        print (shopping_list)
        data = [{"id": item.id, "ingredient": item.ingredient, "quantity": item.quantity, "unit": item.unit, "is_owned": item.is_owned} for item in shopping_list]
        print(f"User {user.username} retrieved their shopping list.")
        print(data)
        return JsonResponse(data, safe=False, status=200)
    
    def post(self, request):
        user = request.user
        data = json.loads(request.body)
        print(data)
        items = data.get('items')

        if items:
            for item_data in items:
                item_id = item_data.get('id')
                ingredient = item_data.get('ingredient')
                new_quantity = item_data.get('quantity')
                unit = item_data.get('unit')
                is_owned = item_data.get('is_owned')
                
                if item_id:
                    try:
                        item = ShoppingListItem.objects.get(id=item_id, user=user)
                        if new_quantity == -1:
                            item.delete()
                        else:
                            item.quantity = new_quantity
                            item.unit = unit
                            item.is_owned = is_owned
                            item.save()
                    except ShoppingListItem.DoesNotExist:
                        return JsonResponse({"error": f"Item with id {item_id} not found"}, status=404)
                else:
                    # Check if the item already exists by ingredient and user
                    item, created = ShoppingListItem.objects.get_or_create(
                        user=user,
                        ingredient=ingredient,
                        defaults={'quantity': new_quantity, 'unit': unit, 'is_owned': is_owned}
                    )
                    if not created:
                        # If the item already exists, update its quantity, unit, and is_owned status
                        item.quantity = new_quantity
                        item.unit = unit
                        item.is_owned = is_owned
                        item.save()
            return JsonResponse({"success": True})
        return JsonResponse({"error": "Invalid data"}, status=400)