# Django Backend (Python port of Spring Backend)

This is a Django REST Framework implementation that replicates the functionality of the Spring Boot backend.

## Features

- **User Management**: User registration and management
- **Todo Management**: CRUD operations for todos with ordering and completion tracking
- **OAuth2 Authentication**: GitHub OAuth integration with JWT tokens
- **RESTful API**: Full REST API compatible with the frontend
- **Database**: PostgreSQL with migrations matching the Spring schema
- **Redis Caching**: Redis integration for session management
- **Docker Support**: Complete containerization with docker-compose

## API Routes

The Django backend provides the exact same API endpoints as the Spring backend:

### Authentication (`/api/auth/`)
- `POST /api/auth/{provider}/exchange` - OAuth2 token exchange (GitHub)
- `GET /api/auth/me` - Get current authenticated user
- `POST /api/auth/logout` - Logout and clear session

### Todos (`/api/todos/`)
- `GET /api/todos/` - List all todos
- `POST /api/todos/` - Create a new todo
- `GET /api/todos/{id}` - Get a specific todo by ID
- `PATCH /api/todos/{id}` - Update a specific todo
- `DELETE /api/todos/{id}` - Delete a specific todo
- `PATCH /api/todos/order` - Reorder todos
- `POST /api/todos/clear-completed` - Clear all completed todos

### Users (`/api/users/`)
- `GET /api/users/` - List all users
- `POST /api/users/` - Create a new user

### Service Info
- `GET /about.json` - Get service information

## Database Schema

The Django models replicate the exact same database schema as the Spring backend:

- **users**: id, username (unique), email
- **todos**: id, title, completed, todo_order, user_id, due_date, tags, created_at, updated_at, deleted_at
- **oauth_accounts**: id, user_id (FK), provider, provider_user_id, access_token, refresh_token, token_expires_at, scope, created_at, updated_at

## Setup

### Using Docker (Recommended)

1. Copy the environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your GitHub OAuth credentials:
   ```
   GITHUB_APP_CLIENT_ID=your_github_client_id
   GITHUB_APP_CLIENT_SECRET=your_github_client_secret
   ```

3. Start the services:
   ```bash
   docker-compose up -d
   ```

The backend will be available at `http://localhost:8000`

### Local Development

1. Install Python 3.11+

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables (copy from `.env.example`)

4. Run migrations:
   ```bash
   python manage.py migrate
   ```

5. Start the development server:
   ```bash
   python manage.py runserver
   ```

## Project Structure

```
backend_django/
├── area_backend/          # Django project settings
│   ├── __init__.py
│   ├── settings.py        # Django settings with environment configuration
│   ├── urls.py           # Main URL routing
│   ├── wsgi.py           # WSGI configuration
│   └── asgi.py           # ASGI configuration
├── api/                   # Main Django app
│   ├── migrations/        # Database migrations
│   ├── __init__.py
│   ├── models.py         # Django models (User, Todo, OAuthAccount)
│   ├── views.py          # API views and endpoints
│   ├── serializers.py    # DRF serializers
│   ├── urls.py           # API URL routing
│   ├── services.py       # JWT and business logic services
│   ├── middleware.py     # JWT authentication middleware
│   ├── apps.py           # App configuration
│   ├── admin.py          # Django admin configuration
│   └── tests.py          # Unit tests
├── requirements.txt       # Python dependencies
├── manage.py             # Django management script
├── Dockerfile            # Docker container configuration
├── docker-compose.yml    # Docker services orchestration
├── .env.example          # Environment variables template
└── README.md             # This file
```

## Key Features Implemented

### 1. OAuth2 GitHub Authentication
- Complete GitHub OAuth flow
- JWT token generation and validation
- Cookie-based session management
- User creation from OAuth data

### 2. Todo Management
- Full CRUD operations
- Soft deletion (deleted_at timestamp)
- Todo ordering and reordering
- Bulk operations (clear completed)
- User association

### 3. Security
- JWT middleware for authentication
- CORS configuration for frontend integration
- Environment-based configuration
- Secure cookie handling

### 4. Database Compatibility
- PostgreSQL integration
- Migrations that match Spring schema exactly
- Proper indexing for performance
- Support for soft deletes and timestamps

## Environment Variables

See `.env.example` for all available configuration options:

- `SECRET_KEY`: Django secret key
- `DEBUG`: Debug mode (True/False)
- `DB_*`: Database connection settings
- `GITHUB_APP_*`: GitHub OAuth credentials
- `JWT_SECRET_KEY`: JWT signing key
- `REDIS_*`: Redis connection settings

## Differences from Spring Backend

While functionally identical, there are some implementation differences:

1. **Framework**: Django REST Framework instead of Spring Boot
2. **Language**: Python instead of Java
3. **ORM**: Django ORM instead of JPA/Hibernate
4. **Migrations**: Django migrations instead of Flyway
5. **Dependency Injection**: Django's built-in DI instead of Spring's

The API contracts, database schema, and behavior are identical to ensure frontend compatibility.