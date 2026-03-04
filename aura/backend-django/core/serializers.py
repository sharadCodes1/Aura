from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Profile, Memory

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['avatar', 'bio', 'created_at']

class UserSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='username')
    avatarUrl = serializers.CharField(source='profile.avatar', allow_null=True, required=False)
    id = serializers.CharField(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'avatarUrl']

class MemorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Memory
        fields = ['id', 'content', 'metadata', 'created_at']
