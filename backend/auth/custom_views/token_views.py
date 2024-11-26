from datetime import datetime, timezone

from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView

from api.serializers.user_serializers import UserSerializer


def add_token_expiry_and_user_data(response, request):
    if response.status_code == status.HTTP_200_OK:
        refresh = RefreshToken(response.data["refresh"])
        access_expiry = datetime.fromtimestamp(
            refresh.access_token["exp"], timezone.utc
        )
        response.data["access_expiry"] = access_expiry.isoformat()
        # Add user data to the response
        user = request.user
        if user.is_authenticated:
            user_data = UserSerializer(user).data
            response.data["user"] = user_data
    return response


class VerifyTokenView(APIView):
    permission_classes = [
        IsAuthenticated,  # Ensures the token is valid and the user is authenticated
    ]

    def post(self, request, *args, **kwargs):
        user = request.user  # The authenticated user
        if user.is_authenticated:
            user_data = UserSerializer(user).data
            return Response(
                {
                    "success": True,
                    "user": user_data,
                },
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"success": False},
                status=status.HTTP_401_UNAUTHORIZED,
            )


class CustomTokenRefreshView(TokenRefreshView):
    permission_classes = [AllowAny]
    _serializer_class = api_settings.TOKEN_REFRESH_SERIALIZER

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        return add_token_expiry_and_user_data(response, request)


class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        return add_token_expiry_and_user_data(response, request)
