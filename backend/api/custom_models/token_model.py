from django.contrib.auth.models import User
from django.db import models
from rest_framework.exceptions import ValidationError


class Token(models.Model):
    """
    Token model for password reset, forgot or email verification
    """

    token = models.CharField(max_length=255)
    created_at = models.DateTimeField()
    expires_at = models.DateTimeField()
    email = models.EmailField(null=True, blank=True)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="tokens",
        null=True,
        blank=True,
    )
    is_used = models.BooleanField(default=False)

    def clean(self):
        if not self.email and not self.user:
            raise ValidationError("Either email or user must be provided.")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)
