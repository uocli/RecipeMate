from django.contrib.auth.models import User
from django.db import models
from rest_framework.exceptions import ValidationError


class Token(models.Model):
    """
    Token model for password reset, forgot or email verification
    """

    TOKEN_TYPE_CHOICES = [
        ("password_reset", "Password Reset"),
        ("email_change", "Email Change"),
    ]

    token = models.CharField(max_length=255)
    created_at = models.DateTimeField()
    expires_at = models.DateTimeField()
    email = models.EmailField(null=True)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="tokens",
        null=True,
    )
    is_used = models.BooleanField(default=False)
    type = models.CharField(
        max_length=20,
        choices=TOKEN_TYPE_CHOICES,
        default="password_reset",
    )

    def clean(self):
        if not self.email and not self.user:
            raise ValidationError("Either email or user must be provided.")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)
