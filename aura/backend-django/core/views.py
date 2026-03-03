from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Memory
from .serializers import MemorySerializer
from .tasks import process_document

class UploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)

        # Trigger background task
        process_document.delay(
            user_id=request.user.id,
            file_name=file_obj.name,
            content=file_obj.read().decode('utf-8', errors='ignore')
        )

        return Response({"message": "Upload successful, processing started"}, status=status.HTTP_202_ACCEPTED)

class MemoryListView(APIView):
    def get(self, request):
        memories = Memory.objects.filter(user=request.user)
        serializer = MemorySerializer(memories, many=True)
        return Response(serializer.data)

class MemoryDeleteView(APIView):
    def delete(self, request, pk):
        try:
            memory = Memory.objects.get(pk=pk, user=request.user)
            memory.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Memory.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
