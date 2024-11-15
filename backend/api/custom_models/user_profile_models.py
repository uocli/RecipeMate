from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    dietary_preference = models.CharField(
        max_length=20,
        choices=(
            ("vegetarian", "Vegetarian"),
            ("vegan", "Vegan"),
            ("glutenFree", "Gluten Free"),
        ),
        blank=True,
        null=True,
    )
    cooking_time = models.CharField(
        max_length=8,
        choices=(
            ("limited", "Limited"),
            ("medium", "Medium"),
            ("Extended", "Extended"),
        ),
        blank=True,
        null=True,
    )
    cooking_time = models.CharField(
        max_length=8,
        choices=(
            ("Limited", "Limited"),
            ("Medium", "Medium"),
            ("Extended", "Extended"),
        ),
        blank=True,
        null=True,
    )

    # Add more fields as needed

    def __str__(self):
        return self.user.username
