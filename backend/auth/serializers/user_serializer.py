from rest_framework import serializers
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    acronym = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["email", "first_name", "last_name", "acronym"]

    def get_acronym(self, obj):
        first_initial = obj.first_name[0].upper() if obj.first_name else ""
        last_initial = obj.last_name[0].upper() if obj.last_name else ""

        return f"{first_initial}{last_initial}"
