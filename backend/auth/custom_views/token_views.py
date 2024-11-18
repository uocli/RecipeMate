from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.views import TokenRefreshView as SimpleJWTTokenRefreshView

from api.serializers.user_serializers import UserSerializer


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


class CustomTokenRefreshView(SimpleJWTTokenRefreshView):
    _serializer_class = api_settings.TOKEN_REFRESH_SERIALIZER

    def post(self, request, *args, **kwargs):
        # Custom logic before refreshing the token
        response = super().post(request, *args, **kwargs)
        # Custom logic after refreshing the token
        user = request.user
        user_data = UserSerializer(user).data
        response.data["user"] = user_data
        return response
