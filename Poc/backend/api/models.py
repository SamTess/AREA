from django.db import models
from django.utils import timezone


class User(models.Model):
    """User model equivalent to Spring's User entity"""
    username = models.CharField(max_length=100, unique=True, null=False)
    email = models.EmailField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = 'users'

    def __str__(self):
        return self.username


class Todo(models.Model):
    """Todo model equivalent to Spring's Todo entity"""
    title = models.CharField(max_length=255, null=False)
    completed = models.BooleanField(default=False, null=True)
    order = models.IntegerField(null=True, blank=True, db_column='todo_order')
    user_id = models.BigIntegerField(null=True, blank=True)
    due_date = models.DateTimeField(null=True, blank=True)
    tags = models.TextField(null=True, blank=True)  # comma-separated tags
    created_at = models.DateTimeField(default=timezone.now, null=False)
    updated_at = models.DateTimeField(null=True, blank=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'todos'
        indexes = [
            models.Index(fields=['user_id', 'completed'], name='idx_todos_user_completed'),
        ]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if self.pk:  # If this is an update
            self.updated_at = timezone.now()
        super().save(*args, **kwargs)


class OAuthAccount(models.Model):
    """OAuth account model equivalent to Spring's OAuthAccount entity"""
    user_id = models.BigIntegerField(null=False)
    provider = models.CharField(max_length=100, null=False)  # e.g. 'github'
    provider_user_id = models.CharField(max_length=255, null=False)
    access_token = models.TextField(null=True, blank=True)
    refresh_token = models.TextField(null=True, blank=True)
    token_expires_at = models.DateTimeField(null=True, blank=True)
    scope = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now, null=False)
    updated_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'oauth_accounts'
        unique_together = ['provider', 'provider_user_id']
        indexes = [
            models.Index(fields=['user_id'], name='idx_oauth_accounts_user_id'),
        ]

    def __str__(self):
        return f"{self.provider}:{self.provider_user_id}"

    def save(self, *args, **kwargs):
        if self.pk:  # If this is an update
            self.updated_at = timezone.now()
        super().save(*args, **kwargs)