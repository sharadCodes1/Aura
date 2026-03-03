import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.urls import path

# Ensure settings are loaded before importing consumers
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'aura_backend.settings')

import django
django.setup()

from chat.consumers import ChatConsumer

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter([
            path("ws/chat/<str:conversation_id>/", ChatConsumer.as_asgi()),
        ])
    ),
})
