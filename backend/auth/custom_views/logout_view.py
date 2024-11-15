from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView


class LogoutView(APIView):
    def post(self, request):
        response = Response(
            {"message": "Logged out successfully"}, status=status.HTTP_200_OK
        )
        response.delete_cookie("access_token")  # Delete JWT token cookie on logout
        return response
