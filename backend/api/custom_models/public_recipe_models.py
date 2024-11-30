import uuid

from django.contrib.auth.models import User
from django.db import models

from .favorites_model import Favorite
from ..utils.unsplash import UnsplashAPI


class Ingredient(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def save(self, *args, **kwargs):
        self.name = self.name.lower()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class PublicRecipe(models.Model):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    name = models.CharField(max_length=255)
    favorite = models.OneToOneField(
        Favorite,
        on_delete=models.CASCADE,
        related_name="public_recipe",
        null=True,
    )
    image_url = models.URLField(max_length=500, blank=True)
    description = models.TextField()
    ingredients = models.ManyToManyField(Ingredient, related_name="ingredients")
    instructions = models.TextField()

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Public Recipes"

    def save(self, *args, **kwargs):
        if not self.image_url:
            self.image_url = UnsplashAPI.search_photos(self.name)
        super().save(*args, **kwargs)


class Rating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    recipe = models.ForeignKey(
        PublicRecipe, on_delete=models.CASCADE, related_name="ratings"
    )
    rating = models.IntegerField()

    class Meta:
        unique_together = ("user", "recipe")
