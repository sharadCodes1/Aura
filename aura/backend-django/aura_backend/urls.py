from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    # Core (Auth & User)
    path('api/', include('core.urls')),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # Chat (Conversations & Streams)
    path('api/chat/', include('chat.urls')),
]
