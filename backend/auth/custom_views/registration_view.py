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
        expires_at = timezone.now() + timedelta(days=1)
        salt = uuid.uuid4().hex
        token = hashlib.sha512(
            (email + created_at.isoformat() + salt).encode("utf-8")
        ).hexdigest()
        token_obj = {
            "token": token,
            "created_at": created_at,
            "expires_at": expires_at,
            "email": email,
        }

        serializer = TokenSerializer(data=token_obj)
        if serializer.is_valid():
            serializer.save()
            # Send email
            subject = "Welcome to Recipe Mate!"
            url = urljoin(settings.BASE_URL, f"/complete-signup?token={token}")
            context = {
                "url": url,
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
