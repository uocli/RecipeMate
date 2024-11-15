from django.contrib.auth.hashers import make_password
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from auth.serializers.user_serializer import UserSerializer


class RegistrationView(APIView):
    def post(self, request, format=None):
        request.data["password"] = make_password(password=request.data["password"])
        request.data["username"] = request.data["email"]
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"success": True, "message": "You are now registered on our website!"},
                status=status.HTTP_200_OK,
            )
        else:
            error_msg = ""
            for key in serializer.errors:
                error_msg += serializer.errors[key][0]
            return Response(
                {"success": False, "message": error_msg},
                status=status.HTTP_200_OK,
            )
