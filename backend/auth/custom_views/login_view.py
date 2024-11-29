from django.contrib.auth.hashers import check_password
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from backend import settings
from ..serializers.user_serializer import UserSerializer


class LoginView(APIView):
    is_local = settings.DEBUG

    def post(self, request, format=None):
        email = request.data["email"]
        password = request.data["password"]
        if email is None or email.strip() == "":
            return Response(
                {
                    "success": False,
                    "message": "Email is required!",
                },
                status=status.HTTP_200_OK,
            )
        if password is None or password.strip() == "":
            return Response(
                {
                    "success": False,
                    "message": "Password is required!",
                },
                status=status.HTTP_200_OK,
            )

        email = email.strip().lower()
        user = User.objects.filter(username=email).first()
        if (
            user is None
            or check_password(password=password, encoded=user.password) is False
        ):
            return Response(
                {"message": "Invalid Login Credentials!"},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        else:
            refresh = RefreshToken.for_user(user)
            access_token = refresh.access_token
            refresh_token = str(refresh)
            response = Response(
                {
                    "user": UserSerializer(user).data,
                },
                status=status.HTTP_200_OK,
            )

            # Set Access Token Cookie
            response.set_cookie(
                "access_token",
                access_token,
                samesite="Lax",
                secure=not self.is_local,  # To address the login issue in Safari
                max_age=int(
                    settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"].total_seconds()
                ),  # To make sure max_age is consistent with SIMPLE_JWT settings
            )

            # Set Refresh Token Cookie
            response.set_cookie(
                "refresh_token",
                refresh_token,
                samesite="Lax",
                secure=not self.is_local,  # To address the login issue in Safari
                max_age=int(
                    settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].total_seconds()
                ),  # To make sure max_age is consistent with SIMPLE_JWT settings
            )

            return response
