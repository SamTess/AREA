import json
import requests
from datetime import datetime, timezone as dt_timezone
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.utils.decorators import method_decorator
from django.conf import settings
from rest_framework import status, generics
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import User, Todo, OAuthAccount
from .serializers import UserSerializer, TodoSerializer, OAuthAccountSerializer
from .services import JWTService


# Auth Views
@method_decorator(csrf_exempt, name='dispatch')
class OAuthExchangeView(APIView):
    """OAuth token exchange view equivalent to Spring's AuthController.exchangeToken"""

    def post(self, request, provider):
        try:
            data = json.loads(request.body)
            code = data.get('code')

            if not code:
                return JsonResponse({'error': "Missing 'code' in request body"}, status=400)

            if provider.lower() == 'github':
                return self._handle_github_oauth(code, request)
            else:
                return JsonResponse({'error': f'Unsupported provider: {provider}'}, status=400)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    def _handle_github_oauth(self, code, request):
        """Handle GitHub OAuth flow"""
        github_client_id = settings.GITHUB_CLIENT_ID
        github_client_secret = settings.GITHUB_CLIENT_SECRET

        if not github_client_id or not github_client_secret:
            return JsonResponse({'error': 'GitHub client credentials not configured'}, status=500)

        # Exchange code for access token
        token_data = {
            'client_id': github_client_id,
            'client_secret': github_client_secret,
            'code': code
        }

        headers = {'Accept': 'application/json'}

        try:
            token_response = requests.post(
                'https://github.com/login/oauth/access_token',
                json=token_data,
                headers=headers
            )
            token_json = token_response.json()
            access_token = token_json.get('access_token')

            if not access_token:
                return JsonResponse({'error': 'No access token returned by provider'}, status=502)

            # Fetch GitHub user info
            user_headers = {
                'Authorization': f'Bearer {access_token}',
                'Accept': 'application/json'
            }

            user_response = requests.get('https://api.github.com/user', headers=user_headers)
            user_json = user_response.json()

            provider_user_id = str(user_json.get('id'))
            login = user_json.get('login')
            email = user_json.get('email')

            # Try to get email if not provided
            if not email:
                emails_response = requests.get('https://api.github.com/user/emails', headers=user_headers)
                if emails_response.status_code == 200:
                    emails = emails_response.json()
                    for email_info in emails:
                        if email_info.get('primary') and email_info.get('verified'):
                            email = email_info.get('email')
                            break

            if not provider_user_id:
                return JsonResponse({'error': 'Provider did not return user id'}, status=502)

            # Find existing oauth account
            try:
                oauth_account = OAuthAccount.objects.get(
                    provider='github',
                    provider_user_id=provider_user_id
                )
                user_id = oauth_account.user_id
            except OAuthAccount.DoesNotExist:
                # Create new user
                base_username = login if login else f'github_{provider_user_id}'
                username = base_username
                attempt = 0

                while User.objects.filter(username=username).exists():
                    attempt += 1
                    username = f'{base_username}_{attempt}'

                user = User.objects.create(username=username, email=email)
                user_id = user.id

                # Create oauth account entry
                OAuthAccount.objects.create(
                    user_id=user_id,
                    provider='github',
                    provider_user_id=provider_user_id,
                    access_token=access_token,
                    created_at=datetime.now(dt_timezone.utc)
                )

            # Create JWT token
            ttl = 7 * 24 * 3600 * 1000  # 7 days in ms
            user = User.objects.get(id=user_id)
            jwt_token = JWTService.create_token(user_id, user.username, ttl)

            # Set cookie
            response = JsonResponse({'message': 'ok'})
            max_age = 7 * 24 * 3600  # 7 days in seconds
            response.set_cookie(
                'area_auth',
                jwt_token,
                max_age=max_age,
                httponly=True,
                path='/',
                samesite='Lax'
            )

            return response

        except requests.RequestException:
            return JsonResponse({'error': 'Failed to communicate with provider'}, status=502)


@api_view(['GET'])
def auth_me(request):
    """Get current authenticated user, equivalent to Spring's AuthController.me"""
    token = request.COOKIES.get('area_auth')

    if not token:
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    try:
        user = JWTService.get_user_from_token(token)
        if user:
            serializer = UserSerializer(user)
            return Response(serializer.data)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)
    except Exception:
        return Response(status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
def auth_logout(request):
    """Logout and clear session, equivalent to Spring's AuthController.logout"""
    response = Response(status=status.HTTP_200_OK)
    response.set_cookie(
        'area_auth',
        '',
        max_age=0,
        httponly=True,
        path='/',
        samesite='Lax'
    )
    return response


# Todo Views
class TodoListCreateView(generics.ListCreateAPIView):
    """Todo list and create view, equivalent to Spring's TodoController.list and create"""
    queryset = Todo.objects.filter(deleted_at__isnull=True)
    serializer_class = TodoSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        todo = serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class TodoDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Todo detail view, equivalent to Spring's TodoController get, patch, delete"""
    queryset = Todo.objects.filter(deleted_at__isnull=True)
    serializer_class = TodoSerializer

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        todo = self.get_object()
        todo.deleted_at = datetime.now(dt_timezone.utc)
        todo.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['PATCH'])
def todo_reorder(request):
    """Reorder todos, equivalent to Spring's TodoController.reorder"""
    try:
        ids = request.data  # Expecting a list of IDs

        for index, todo_id in enumerate(ids):
            Todo.objects.filter(id=todo_id).update(order=index)

        return Response(status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def todo_clear_completed(request):
    """Clear completed todos, equivalent to Spring's TodoController.clearCompleted"""
    Todo.objects.filter(completed=True).update(deleted_at=datetime.now(dt_timezone.utc))
    return Response(status=status.HTTP_204_NO_CONTENT)


# User Views
class UserListCreateView(generics.ListCreateAPIView):
    """User list and create view, equivalent to Spring's UserController"""
    queryset = User.objects.all()
    serializer_class = UserSerializer


# About View
@api_view(['GET'])
def about(request):
    """About endpoint, equivalent to Spring's AboutController.about"""
    current_time = datetime.now(dt_timezone.utc).isoformat()

    todo_service = {
        'name': 'todos',
        'actions': ['create', 'update', 'delete', 'reorder', 'clear-completed'],
        'reactions': ['sendEmail']
    }

    response_data = {
        'client': {'host': 'client_web'},
        'server': {'current_time': current_time},
        'services': [todo_service]
    }

    return Response(response_data)