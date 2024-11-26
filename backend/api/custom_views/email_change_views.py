from datetime import timedelta
from urllib.parse import urljoin
import hashlib
import uuid

from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.utils.timezone import now
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from backend import settings
from ..custom_models.token_model import Token
from ..utils.email_utils import send_email


class EmailChangeView(APIView):
    def post(self, request):
        user = request.user
        new_email = request.data.get("new_email")

        # Validate email format
        try:
            validate_email(new_email)
        except ValidationError:
            return Response(
                {"success": False, "message": "Invalid email format!"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Check if the new email is the same as the current one
        if new_email == user.email:
            return Response(
                {
                    "success": False,
                    "message": "The new email cannot be the same as the current one!",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Check if the new email is already in use
        if User.objects.filter(email=new_email).exists():
            return Response(
                {
                    "success": False,
                    "message": "Bad request! Contact support for assistance.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Create a new email change token
        created_at = now()
        expires_at = created_at + timedelta(hours=1)
        salt = uuid.uuid4().hex
        token = hashlib.sha512(
            (str(user.id) + user.password + created_at.isoformat() + salt).encode(
                "utf-8"
            )
        ).hexdigest()
        token_obj = Token.objects.create(
            user=user,
            token=token,
            created_at=created_at,
            expires_at=expires_at,
            email=new_email,
        )

        # Send confirmation emails
        self.send_confirmation_emails(user, new_email, token_obj.token)

        return Response(
            {
                "success": True,
                "message": "The email change request is received, check your email to complete the process!",
            },
            status=status.HTTP_200_OK,
        )

    def send_confirmation_emails(self, user, new_email, token):
        context = {
            "url": urljoin(settings.BASE_URL, f"/complete-email-change?token={token}"),
            "old_email": user.email,
            "new_email": new_email,
        }

        # Email to the old email address
        send_email(
            "Confirm Email Change",
            user.email,
            "confirm_email_change",
            context,
        )

        # Email to the new email address
        send_email(
            "Email Change Request",
            new_email,
            "email_change_request",
            context,
        )