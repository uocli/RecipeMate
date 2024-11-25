# backend/api/models/recipe_models.py
from django.db import models
from django.contrib.auth.models import User

class Recipe(models.Model):
    DIFFICULTY_CHOICES = (
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard')
    )

    title = models.CharField(max_length=200)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="recipes")
    ingredients = models.JSONField(default=list)  # Store as JSON array
    instructions = models.JSONField(default=list)  # Store as JSON array
    cooking_time = models.CharField(
        max_length=20,
        choices=(
            ("limited", "Limited"),
            ("medium", "Medium"),
            ("Extended", "Extended"),
        ),
    )
    difficulty = models.CharField(
        max_length=10,
        choices=DIFFICULTY_CHOICES,
        default='medium'
    )
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
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title