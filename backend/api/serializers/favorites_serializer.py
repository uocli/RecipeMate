from rest_framework import serializers
from ..custom_models.favorites_model import Favorite


class FavoriteSerializer(serializers.ModelSerializer):
    is_shared = serializers.SerializerMethodField()

    class Meta:
        model = Favorite
        fields = ['id', 'user', 'name', 'ingredients', 'recipe', 'added_at',
            "is_shared",
        ]
        read_only_fields = ['id', 'user', 'added_at',
            "is_shared",
        ]

    def get_is_shared(self, obj):
        return hasattr(obj, "public_recipe")