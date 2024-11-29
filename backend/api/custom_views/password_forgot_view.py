from datetime import timedelta
import hashlib
from urllib.parse import urljoin
import uuid

from django.conf import settings
from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from ..custom_models.token_model import Token
from ..serializers.token_serializer import TokenSerializer
from ..utils.email_utils import send_email


class PasswordForgotView(APIView):
    def get(self, request, format=None):
        return Response(
            {
                "success": False,
                "message": "Method not allowed.",
            },
            status=status.HTTP_405_METHOD_NOT_ALLOWED,
        )

    def post(self, request, format=None):
        email = request.data["email"]
        user = User.objects.filter(email=email).first()
        if user is None:
            return Response(
                {
                    "success": False,
                    "message": "User with this email does not exist.",
                },
                status=status.HTTP_200_OK,
            )

        created_at = timezone.now()
        expires_at = timezone.now() + timedelta(days=1)
        salt = uuid.uuid4().hex
        token = hashlib.sha512(
            (str(user.id) + user.password + created_at.isoformat() + salt).encode(
                "utf-8"
            )
        ).hexdigest()
        token_obj = {
            "token": token,
            "created_at": created_at,
            "expires_at": expires_at,
            "user": user.id,
            "type": Token.TYPE_PASSWORD_RESET,
        }

        serializer = TokenSerializer(data=token_obj)
        if serializer.is_valid():
            serializer.save()
            # Send email
            subject = "Password Reset Request Received!"
            url = urljoin(
                settings.BASE_URL, f"/password-reset?id={user.id}&token={token}"
            )
            context = {
                "url": url,
                "support_email": settings.EMAIL_HOST_USER,
            }
            send_email(subject, email, "password_forgot", context)
            return Response(
                {
                    "success": True,
                    "message": "A password reset link has been sent to your email.",
                },
                status=status.HTTP_200_OK,
            )
        else:
            error_msg = ""
            for key in serializer.errors:
                error_msg += serializer.errors[key][0]
            return Response(
                {
                    "success": False,
                    "message": error_msg,
                },
                status=status.HTTP_200_OK,
            )
