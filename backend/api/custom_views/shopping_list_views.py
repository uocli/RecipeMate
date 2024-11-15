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
        shopping_list = ShoppingListItem.objects.filter(user=user).order_by('is_owned')
        data = [{"id": item.id, "ingredient": item.ingredient, "quantity": item.quantity, "unit": item.unit, "is_owned": item.is_owned} for item in shopping_list]
        print(f"User {user.username} retrieved their shopping list.")
        print(data)
        return JsonResponse(data, safe=False)
    
    def post(self, request):
        user = request.user
        data = json.loads(request.body)
        items = data.get('items')

        if items:
            for item_data in items:
                item_id = item_data.get('id')
                new_quantity = item_data.get('quantity')
                is_owned = item_data.get('is_owned')
                if item_id and new_quantity is not None and is_owned is not None:
                    try:
                        item = ShoppingListItem.objects.get(id=item_id, user=user)
                        if new_quantity == 0:
                            item.delete()
                        else:
                            item.quantity = new_quantity
                            item.is_owned = is_owned
                            item.save()
                    except ShoppingListItem.DoesNotExist:
                        return JsonResponse({"error": f"Item with id {item_id} not found"}, status=404)
            return JsonResponse({"success": True})
        return JsonResponse({"error": "Invalid data"}, status=400)