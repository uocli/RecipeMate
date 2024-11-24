from django.contrib.auth.models import User
from django.db import models


class Token(models.Model):
    """
    Token model for password reset, forgot or email verification
    """

    token = models.CharField(max_length=255)
    created_at = models.DateTimeField()
    expires_at = models.DateTimeField()
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="tokens",
        null=True,
        blank=True,
    )
    is_used = models.BooleanField(default=False)
