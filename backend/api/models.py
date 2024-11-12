from django.db import models
from django.contrib.auth.models import User

class ShoppingListItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    ingredient = models.CharField(max_length=255)
    quantity = models.IntegerField()

    def __str__(self):
        return f"{self.ingredient} - {self.quantity}"
