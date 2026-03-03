from django.urls import path
from .views import AuraLoginView, UploadView, MemoryListView, MemoryDeleteView

urlpatterns = [
    path('auth/login/', AuraLoginView.as_view(), name='aura-login'),
    path('upload/', UploadView.as_view(), name='aura-upload'),
    path('memory/', MemoryListView.as_view(), name='aura-memory-list'),
    path('memory/<int:pk>/', MemoryDeleteView.as_view(), name='aura-memory-delete'),
]
