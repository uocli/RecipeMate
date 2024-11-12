from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from .models import ShoppingListItem
from django.views.decorators.http import require_POST
import json

@csrf_exempt
def get_csrf_token(request):
    token = get_token(request)
    response = JsonResponse({"csrfToken": token})
    response.set_cookie("csrftoken", token)
    return response

@login_required
def get_shopping_list(request):
    user = request.user
    shopping_list = ShoppingListItem.objects.filter(user=user).order_by('is_owned')
    data = [{"ingredient": item.ingredient, "quantity": item.quantity, "is_owned": item.is_owned} for item in shopping_list]
    print(f"User {user.username} retrieved their shopping list.")
    print(data)
    return JsonResponse(data, safe=False)

@login_required
@require_POST
@csrf_exempt
def update_shopping_list(request):
    user = request.user
    data = json.loads(request.body)
    items = data.get('items')

    if items:
        for item_data in items:
            item_name = item_data.get('ingredient')
            new_quantity = item_data.get('quantity')
            is_owned = item_data.get('is_owned')
            if item_name and new_quantity and is_owned is not None:
                try:
                    item = ShoppingListItem.objects.get(ingredient=item_name, user=user)
                    item.quantity = new_quantity
                    item.is_owned = is_owned
                    item.save()
                except ShoppingListItem.DoesNotExist:
                    return JsonResponse({"error": f"Item with id {item_name} not found"}, status=404)
        return JsonResponse({"success": True})
    return JsonResponse({"error": "Invalid data"}, status=400)