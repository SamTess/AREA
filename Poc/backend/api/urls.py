from django.urls import path, include
from . import views

# Auth URLs
auth_urlpatterns = [
    path('<str:provider>/exchange', views.OAuthExchangeView.as_view(), name='oauth_exchange'),
    path('me', views.auth_me, name='auth_me'),
    path('logout', views.auth_logout, name='auth_logout'),
]

# Todo URLs
todo_urlpatterns = [
    path('', views.TodoListCreateView.as_view(), name='todo_list_create'),
    path('<int:pk>', views.TodoDetailView.as_view(), name='todo_detail'),
    path('order/', views.todo_reorder, name='todo_reorder'),
    path('order', views.todo_reorder, name='todo_reorder_no_slash'),
    path('clear-completed/', views.todo_clear_completed, name='todo_clear_completed'),
    path('clear-completed', views.todo_clear_completed, name='todo_clear_completed_no_slash'),
]

# User URLs
user_urlpatterns = [
    path('', views.UserListCreateView.as_view(), name='user_list_create'),
]

# Main URL patterns
urlpatterns = [
    path('auth/', include(auth_urlpatterns)),
    path('todos/', include(todo_urlpatterns)),
    path('users', include(user_urlpatterns)),
    path('about.json', views.about, name='about'),
]