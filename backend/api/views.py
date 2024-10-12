from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.contrib.auth.models import User
import json

from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def get_csrf_token(request):
    token = get_token(request)
    response = JsonResponse({"csrfToken": token})
    response.set_cookie("csrftoken", token)
    print("get_csrf_token", response.getvalue())
    return response


def signup(request):
    print(request.body)
    data = json.loads(request.body)
    email = data.get("email")
    password = data.get("password")
    print(email, password)
    if not email or not password:
        return JsonResponse({"error": "Email and password are required."}, status=400)

    try:
        user = User.objects.create_user(username=email, email=email, password=password)
        user.save()
        print(user)
        return JsonResponse({"message": "User created successfully!"}, status=201)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)
