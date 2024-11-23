import uuid
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
