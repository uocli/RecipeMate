from django.contrib.auth.models import User
from django.db import models

class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="favorites")
    name = models.CharField(max_length=255, default="Unnamed Recipe")  # Limited to 255 chars
    ingredients = models.TextField(default="Unnamed Recipe ingredients")  # Use TextField for larger text
    recipe = models.TextField(default="Unnamed Recipe recipe")  # Use TextField for step-by-step instructions
    added_at = models.DateTimeField(auto_now_add=True)
    
    
    def __str__(self):
        return f"{self.user.username} - {self.name}"