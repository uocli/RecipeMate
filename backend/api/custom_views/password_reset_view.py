import pytz

from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from ..custom_models.token_model import Token


class ResetPasswordView(APIView):
    def post(self, request, format=None):
        user_id = request.data["id"]
        token = request.data["token"]
        password = request.data["password"]
        # Invalid token
        token_obj = (
            Token.objects.filter(user_id=user_id).order_by("-created_at").first()
        )
        if token_obj is None or token != token_obj.token or token_obj.is_used:
            return Response(
                {
                    "success": False,
                    "message": "Reset Password link is invalid!",
                },
                status=status.HTTP_200_OK,
            )
        # Expired token
        expires_at_aware = token_obj.expires_at.replace(tzinfo=pytz.UTC)
        if expires_at_aware < timezone.now():
            return Response(
                {
                    "success": False,
                    "message": "Password Reset Link has expired!",
                },
                status=status.HTTP_200_OK,
            )
        # Valid token
        else:
            token_obj.is_used = True
            hashed_password = make_password(password=password)
            User.objects.filter(id=user_id).update(password=hashed_password)
            token_obj.save()

            return Response(
                {
                    "success": True,
                    "message": "Your password reset was successfully!",
                },
                status=status.HTTP_200_OK,
            )
