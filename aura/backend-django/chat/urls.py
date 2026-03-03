from django.urls import path
from .views import ChatInitialView, TaskExecuteView

urlpatterns = [
    path('', ChatInitialView.as_view(), name='chat-initial'),
    path('execute/', TaskExecuteView.as_view(), name='task-execute'),
]
