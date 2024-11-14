from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    dietary_preference = models.CharField(
        max_length=20,
        choices=(
            ("Vegetarian", "Vegetarian"),
            ("Vegan", "Vegan"),
            ("Gluten Free", "Gluten Free"),
        ),
        blank=True,
        null=True,
    )
    cooking_time_in_min = models.PositiveIntegerField(blank=True, null=True)

    # Add more fields as needed

    def __str__(self):
        return self.user.username
