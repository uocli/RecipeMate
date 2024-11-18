from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView


class VerifyTokenView(APIView):
    permission_classes = [
        IsAuthenticated,  # Ensures the token is valid and the user is authenticated
    ]

    def post(self, request, *args, **kwargs):
        user = request.user  # The authenticated user
        if user.is_authenticated:
            return Response(
                {"success": True},
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"success": False},
                status=status.HTTP_401_UNAUTHORIZED,
            )
