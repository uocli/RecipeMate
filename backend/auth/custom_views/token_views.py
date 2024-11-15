from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView


class VerifyTokenView(APIView):
    permission_classes = [
        IsAuthenticated,  # Ensures the token is valid and the user is authenticated
    ]

    def post(self, request, *args, **kwargs):
        # If the token is valid, the request will be authenticated
        user = request.user  # The authenticated user

        return Response({"valid": True, "user_id": user.id, "username": user.username})

