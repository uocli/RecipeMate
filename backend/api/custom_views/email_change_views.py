import os.path
from datetime import timedelta
from urllib.parse import urljoin
import hashlib
import uuid

from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.utils.timezone import now
from rest_framework import status
from rest_framework.permissions import AllowAny
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
                status=status.HTTP_200_OK,
            )

        # Check if the new email is the same as the current one
        if new_email == user.email:
            return Response(
                {
                    "success": False,
                    "message": "The new email cannot be the same as the current one!",
                },
                status=status.HTTP_200_OK,
            )

        # Check if the new email is already in use
        if User.objects.filter(email=new_email).exists():
            return Response(
                {
                    "success": False,
                    "message": "Bad request! Contact support for assistance.",
                },
                status=status.HTTP_200_OK,
            )

        # Expire the old unused tokens
        for t in Token.objects.filter(
            user_id=user.id,
            type=Token.TYPE_EMAIL_CHANGE,
            is_used=False,
        ):
            t.is_used = True
            t.save(update_fields=["is_used"])

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
            type=Token.TYPE_EMAIL_CHANGE,
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
            "support_email": settings.EMAIL_HOST_USER,
        }

        # Email to the new email address
        send_email(
            "Confirm Email Change",
            new_email,
            "confirm_email_change",
            context,
        )

        # Email to the old email address
        send_email(
            "Email Change Request",
            user.email,
            "email_change_request",
            context,
        )


class CompleteEmailChangeView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, format=None):
        return Response(
            {
                "success": False,
                "message": "Method not allowed.",
            },
            status=status.HTTP_405_METHOD_NOT_ALLOWED,
        )

    def post(self, request):
        token = request.query_params.get("token")

        if not token:
            return Response(
                {
                    "success": False,
                    "message": "Token is required!",
                },
                status=status.HTTP_200_OK,
            )

        try:
            token_obj = Token.objects.get(
                token=token,
                type=Token.TYPE_EMAIL_CHANGE,
            )
        except Token.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": "Invalid or expired token!",
                },
                status=status.HTTP_200_OK,
            )

        if token_obj.is_used or token_obj.expires_at < now():
            return Response(
                {
                    "success": False,
                    "message": "Invalid or expired token!",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = token_obj.user
        old_email = user.email
        new_email = token_obj.email

        # Update the user's email
        user.email = new_email
        user.username = new_email
        user.save()

        # Mark the token as used
        token_obj.is_used = True
        token_obj.save(update_fields=["is_used"])

        context = {
            "new_email": new_email,
            "support_email": settings.EMAIL_HOST_USER,
            "url": os.path.join(settings.BASE_URL, f"login/?un={new_email}"),
        }

        # Notify the old email
        send_email(
            "Email Change Successful",
            old_email,
            "email_change_success_to_old",
            context,
        )

        # Notify the new email
        send_email(
            "Email Change Successful",
            new_email,
            "email_change_success_to_new",
            context,
        )

        return Response(
            {
                "success": True,
                "message": "Email address has been updated successfully!",
            },
            status=status.HTTP_200_OK,
        )
