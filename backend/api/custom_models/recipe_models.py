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
            ('gluten_free', 'Gluten Free & Coeliac'),
            ('dairy_free', 'Dairy Free & Lactose Free'),
            ('vegetarian', 'Vegetarian'),
            ('vegan', 'Vegan'),
            ('paleo', 'Paleo'),
            ('fodmap', 'FODMAP'),
            ('nut_free', 'Tree Nut & Peanut Free'),
            ('fish_free', 'Fish & Shellfish Free'),
            ('keto', 'Ketogenic'),
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