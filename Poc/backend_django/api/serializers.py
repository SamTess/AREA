from rest_framework import serializers
from .models import User, Todo, OAuthAccount


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model, equivalent to Spring's UserDto"""

    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class TodoSerializer(serializers.ModelSerializer):
    """Serializer for Todo model, equivalent to Spring's TodoDto"""

    class Meta:
        model = Todo
        fields = [
            'id', 'title', 'completed', 'order', 'user_id',
            'due_date', 'tags', 'created_at', 'updated_at', 'deleted_at'
        ]

    def validate_title(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Title cannot be empty")
        return value


class OAuthAccountSerializer(serializers.ModelSerializer):
    """Serializer for OAuthAccount model, equivalent to Spring's OAuthAccountDto"""

    class Meta:
        model = OAuthAccount
        fields = [
            'id', 'user_id', 'provider', 'provider_user_id',
            'access_token', 'refresh_token', 'token_expires_at',
            'scope', 'created_at', 'updated_at'
        ]
        extra_kwargs = {
            'access_token': {'write_only': True},
            'refresh_token': {'write_only': True},
        }