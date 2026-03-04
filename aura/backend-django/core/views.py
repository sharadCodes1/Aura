from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Memory
from .serializers import MemorySerializer, UserSerializer
from .tasks import process_document

class AuraLoginView(APIView):
    permission_classes = [] # Allow unauthenticated access to login

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({"message": "Email and password are required"}, status=status.HTTP_400_BAD_REQUEST)

        # Authenticate user. We assume email is used as username for simplicity here, 
        # but we also check by email filter if it fails.
        user = authenticate(username=email, password=password)
        
        if not user:
            # Fallback: find user by email
            from django.contrib.auth.models import User
            try:
                user_obj = User.objects.get(email=email)
                if user_obj.check_password(password):
                    user = user_obj
            except User.DoesNotExist:
                pass

        if user:
            if not user.is_active:
                return Response({"message": "User account is disabled"}, status=status.HTTP_403_FORBIDDEN)
                
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': UserSerializer(user).data
            }, status=status.HTTP_200_OK)

        return Response({"message": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

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
