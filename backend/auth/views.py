from datetime import datetime
from django.shortcuts import render
from django.contrib.auth.models import User
from django.http import JsonResponse
import json

from django.utils.timezone import make_aware
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth import authenticate
from django.db.utils import IntegrityError


@api_view(["POST"])
def signup_view(request):
    data = json.loads(request.body)
    email = data.get("email")
    password = data.get("password")
    if not email or not password:
        return JsonResponse({"error": "Email and password are required."}, status=400)

    try:
        user = User.objects.create_user(username=email, email=email, password=password)
        user.save()
        return JsonResponse({"message": "User created successfully!"}, status=201)
    except IntegrityError as e:
        return JsonResponse(
            {"message": "User with this email already exists."}, status=400
        )
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


@api_view(["POST"])
def login_view(request):
    email = request.data.get("email")
    password = request.data.get("password")

    user = authenticate(username=email, password=password)
    if user is not None:
        token, _ = Token.objects.get_or_create(user=user)
        user.last_login = make_aware(datetime.now())
        user.save(update_fields=["last_login"])
        return Response({"token": token.key, "message": "Login successful"}, status=200)
    else:
        return Response({"error": "Invalid credentials"}, status=400)


@api_view(["POST"])
def verify_token_view(request):
    try:
        token = request.headers.get("Authorization").split(" ")[1]
        user = Token.objects.get(key=token).user
        return JsonResponse({"email": user.email}, status=200)
    except Exception as e:
        return JsonResponse({"message": "Invalid token"}, status=400)
