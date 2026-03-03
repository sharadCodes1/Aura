from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer

class ChatInitialView(APIView):
    def post(self, request):
        content = request.data.get('content')
        if not content:
            return Response({"error": "Content is required"}, status=status.HTTP_400_BAD_REQUEST)

        # 1. Create or get active conversation
        # In a real app we might check for an existing ID
        conversation = Conversation.objects.create(user=request.user)
        
        # 2. Save User Message
        Message.objects.create(
            conversation=conversation,
            role='user',
            content=content
        )

        # 3. Handle specific triggers (e.g. "execute") for Task Flow
        requires_confirmation = False
        execution_plan = None
        
        if "delete" in content.lower() or "execute" in content.lower():
            requires_confirmation = True
            execution_plan = [
                {"id": "step-1", "step": "Analyze request context", "status": "pending", "tool": "think"},
                {"id": "step-2", "step": "Confirm specific parameters", "status": "pending", "tool": "auth"},
                {"id": "step-3", "step": "Finalize operation", "status": "pending", "tool": "executor"}
            ]

        return Response({
            "conversation_id": str(conversation.id),
            "requires_confirmation": requires_confirmation,
            "execution_plan": execution_plan,
        }, status=status.HTTP_201_CREATED)

class TaskExecuteView(APIView):
    def post(self, request):
        # Trigger real background task (Celery)
        message_id = request.data.get('message_id')
        return Response({"status": "Task triggered"}, status=status.HTTP_200_OK)
