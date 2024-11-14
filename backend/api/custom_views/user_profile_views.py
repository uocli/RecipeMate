from django.http import JsonResponse
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

from ..serializers.user_serializers import UserSerializer


class UserProfileView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    user_serializer_class = UserSerializer

    def get(self, request):
        user_with_profile = self.user_serializer_class(request.user)
        return Response({"user": user_with_profile.data}, status.HTTP_200_OK)

    def post(self, request):
        return JsonResponse({"message": "POST request received"})
