import uuid

from django.contrib.auth.models import User
from django.db import models


class Ingredient(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Recipe(models.Model):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    name = models.CharField(max_length=255)
    image_url = models.URLField(max_length=200)
    description = models.TextField()
    ingredients = models.ManyToManyField(Ingredient, related_name="ingredients")
    instructions = models.TextField()

    def __str__(self):
        return self.name


class Rating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name="ratings")
    rating = models.IntegerField()

    class Meta:
        unique_together = ("user", "recipe")
