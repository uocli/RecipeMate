from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.exceptions import ValidationError
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
        user = User.objects.select_related("profile").get(id=user.id)
        user_with_profile = self.user_serializer_class(user)
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

        dietary_preference = request.data.get("dietary_preference", "")
        if dietary_preference == "":
            dietary_preference = None

        cooking_time = request.data.get("cooking_time", "")
        if dietary_preference == "":
            dietary_preference = None

        # Validate dietary_preference
        if dietary_preference not in ["vegetarian", "vegan", "glutenFree", None]:
            raise ValidationError("Invalid dietary preference")

        # Validate cooking_time
        if cooking_time not in ["limited", "medium", "extended", None]:
            raise ValidationError("Invalid cooking time")

        UserProfile.objects.update_or_create(
            user=user,
            defaults={
                "dietary_preference": dietary_preference,
                "cooking_time": cooking_time,
            },
        )

        return Response(
            {"user": self.user_serializer_class(user).data}, status.HTTP_200_OK
        )
