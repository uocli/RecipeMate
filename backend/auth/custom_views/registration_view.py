import hashlib
import uuid
from datetime import timedelta
from urllib.parse import urljoin

from django.contrib.auth.models import User
from django.utils import timezone
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from api.custom_models.token_model import Token
from backend import settings
from api.serializers.token_serializer import TokenSerializer
from api.utils.email_utils import send_email


@method_decorator(csrf_exempt, name="dispatch")
class SendInviteView(APIView):
    permission_classes = [AllowAny]

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
        if email is None or email.strip() == "":
            return Response(
                {
                    "success": False,
                    "message": "Email is required!",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        email = email.strip().lower()
        user = User.objects.filter(email=email).first()
        if user is not None:
            return Response(
                {
                    "success": False,
                    "message": "A user with this email already exists!",
                },
                status=status.HTTP_409_CONFLICT,
            )

        created_at = timezone.now()
        expires_at = created_at + timedelta(days=1)
        salt = uuid.uuid4().hex
        token = hashlib.sha512(
            (email + created_at.isoformat() + salt).encode("utf-8")
        ).hexdigest()
        token_obj = {
            "token": token,
            "created_at": created_at,
            "expires_at": expires_at,
            "email": email,
            "type": Token.TYPE_REGISTRATION,
        }

        serializer = TokenSerializer(data=token_obj)
        if serializer.is_valid():
            try:
                serializer.save()
            except Exception as e:
                return Response(
                    {
                        "success": False,
                        "message": str(e),
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
            # Send email
            subject = "Welcome to Recipe Mate!"
            url = urljoin(settings.BASE_URL, f"/complete-signup?token={token}")
            context = {
                "url": url,
                "support_email": settings.EMAIL_HOST_USER,
            }
            send_email(subject, email, "invite_email", context)
            return Response(
                {
                    "success": True,
                    "message": "An invite link has been sent to your email!",
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
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class CompleteSignupView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, format=None):
        return Response(
            {
                "success": False,
                "message": "Method not allowed.",
            },
            status=status.HTTP_405_METHOD_NOT_ALLOWED,
        )

    def post(self, request, format=None):
        token = request.data.get("token")
        password = request.data.get("password")
        token_obj = Token.objects.filter(token=token).first()
        if token_obj is None or token_obj.email is None:
            return Response(
                {
                    "success": False,
                    "message": "Invalid token!",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if timezone.now() > token_obj.expires_at:
            return Response(
                {
                    "success": False,
                    "message": "Token has expired!",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        email = token_obj.email
        try:
            user = User.objects.create_user(
                username=email, email=email, password=password
            )
            user.save()
            token_obj.user_id = user.id
            token_obj.is_used = True
            token_obj.save(
                update_fields=[
                    "user_id",
                    "is_used",
                ]
            )
        except Exception as e:
            return Response(
                {
                    "success": False,
                    "message": str(e),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        context = {
            "support_email": settings.EMAIL_HOST_USER,
        }

        send_email(
            "Welcome to Recipe Mate!",
            email,
            "registration_success",
            context,
        )
        return Response(
            {
                "success": True,
                "message": "Registration completed successfully.",
            },
            status=status.HTTP_200_OK,
        )
