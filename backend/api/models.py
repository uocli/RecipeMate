# backend/api/models.py
from django.db import models
from django.contrib.auth.models import User


class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="favorites")
    recipe_id = models.IntegerField(unique=True, blank=True, null=True)  # Auto-incrementing but not primary key
    name = models.CharField(max_length=255, default="Unnamed Recipe")  # Limited to 255 chars
    ingredients = models.TextField(default="Unnamed Recipe ingredients")  # Use TextField for larger text
    recipe = models.TextField(default="Unnamed Recipe recipe")  # Use TextField for step-by-step instructions
    added_at = models.DateTimeField(auto_now_add=True)
    
    def save(self, *args, **kwargs):
        if self.recipe_id is None:  # Only assign if `recipe_id` is not set
            last_recipe_id = Favorite.objects.aggregate(models.Max('recipe_id'))['recipe_id__max'] or 0
            self.recipe_id = last_recipe_id + 1
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.username} - {self.name}"