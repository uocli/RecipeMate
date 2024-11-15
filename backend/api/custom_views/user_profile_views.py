from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

from ..custom_models.user_profile_models import UserProfile
from ..serializers.user_serializers import UserSerializer


class UserProfileView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    user_serializer_class = UserSerializer

    def get(self, request):
        user = request.user
        user_with_profile = self.user_serializer_class(
            User.objects.select_related("profile").get(id=user.id)
        )
        return Response({"user": user_with_profile.data}, status.HTTP_200_OK)

    def post(self, request):
        user = request.user
        user.email = request.data.get("email", user.email)
        user.username = request.data.get("email", user.email)
        user.first_name = request.data.get("first_name", user.first_name)
        user.last_name = request.data.get("last_name", user.last_name)
        user.save()
        return Response(
            {"user": self.user_serializer_class(user).data}, status.HTTP_200_OK
        )

    def put(self, request):
        user = request.user
        profile = UserProfile.objects.filter(user=user).first()
        if profile is None:
            profile = UserProfile.objects.create(
                user=user,
                dietary_preference=request.data.get("dietary_preference", ""),
                cooking_time=request.data.get("cooking_time", ""),
            )
            profile.save()
        else:
            profile.dietary_preference = request.data.get(
                "dietary_preference", profile.dietary_preference
            )
            profile.cooking_time = request.data.get(
                "cooking_time", profile.cooking_time
            )
            profile.save(update_fields=["dietary_preference", "cooking_time"])

        return Response(
            {"user": self.user_serializer_class(user).data}, status.HTTP_200_OK
        )
