from django.contrib.auth.hashers import make_password
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from ..serializers.user_registration_serializer import UserRegistrationSerializer


class RegistrationView(APIView):
    user_registration_serializer = UserRegistrationSerializer

    def post(self, request, format=None):
        request.data["password"] = make_password(password=request.data["password"])
        request.data["username"] = request.data["email"]
        serializer = self.user_registration_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "success": True,
                    "message": "You hae been successfully registered!",
                },
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
