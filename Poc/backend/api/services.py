import jwt
import datetime
from django.conf import settings
from .models import User


class JWTService:
    """JWT service equivalent to Spring's JwtService"""

    @staticmethod
    def create_token(user_id, username, ttl_ms):
        """Create a JWT token with the given user ID, username, and TTL"""
        payload = {
            'sub': str(user_id),
            'username': username,
            'iat': datetime.datetime.utcnow(),
            'exp': datetime.datetime.utcnow() + datetime.timedelta(milliseconds=ttl_ms)
        }

        return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm='HS256')

    @staticmethod
    def parse_token(token):
        """Parse and validate a JWT token"""
        try:
            payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=['HS256'])
            return payload
        except jwt.ExpiredSignatureError:
            raise Exception("Token has expired")
        except jwt.InvalidTokenError:
            raise Exception("Invalid token")

    @staticmethod
    def get_user_from_token(token):
        """Get user from JWT token"""
        try:
            payload = JWTService.parse_token(token)
            user_id = int(payload['sub'])
            return User.objects.get(id=user_id)
        except (User.DoesNotExist, ValueError, KeyError):
            return None