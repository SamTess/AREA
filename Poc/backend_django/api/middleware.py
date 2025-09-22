from django.utils.deprecation import MiddlewareMixin
from django.http import JsonResponse
from .services import JWTService


class JWTAuthenticationMiddleware(MiddlewareMixin):
    """JWT Authentication middleware equivalent to Spring's JwtAuthenticationFilter"""

    def process_request(self, request):
        # Skip authentication for certain paths
        skip_paths = ['/admin/', '/about.json', '/api/auth/']

        if any(request.path.startswith(path) for path in skip_paths):
            return None

        # Get JWT token from cookies
        token = request.COOKIES.get('area_auth')

        if token:
            try:
                user = JWTService.get_user_from_token(token)
                if user:
                    request.user = user
                    request.authenticated = True
                else:
                    request.user = None
                    request.authenticated = False
            except Exception:
                request.user = None
                request.authenticated = False
        else:
            request.user = None
            request.authenticated = False

        return None