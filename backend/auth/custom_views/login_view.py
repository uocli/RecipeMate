from django.contrib.auth.hashers import check_password
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken


class LoginView(APIView):
    def post(self, request, format=None):
        email = request.data["email"]
        password = request.data["password"]
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
                {"success": True, "message": "You are now logged in!"},
                status=status.HTTP_200_OK,
            )

            # Set Access Token Cookie
            response.set_cookie(
                "access_token",
                access_token,
                samesite="Lax",
                secure=True,
                max_age=3600,  # 1 hour
            )

            # Set Refresh Token Cookie
            response.set_cookie(
                "refresh_token",
                refresh_token,
                samesite="Lax",
                secure=True,
                max_age=86400 * 1,  # 1 day
            )

            return response
