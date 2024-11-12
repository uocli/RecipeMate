from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from .models import ShoppingListItem

@csrf_exempt
def get_csrf_token(request):
    token = get_token(request)
    response = JsonResponse({"csrfToken": token})
    response.set_cookie("csrftoken", token)
    return response

@login_required
def get_shopping_list(request):
    user = request.user
    shopping_list = ShoppingListItem.objects.filter(user=user)
    data = [{"ingredient": item.ingredient, "quantity": item.quantity} for item in shopping_list]
    print(f"User {user.username} retrieved their shopping list.")
    print(data)
    return JsonResponse(data, safe=False)