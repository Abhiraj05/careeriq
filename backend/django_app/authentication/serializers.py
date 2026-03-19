from rest_framework import serializers
from user.models import UserProfile


class UserSignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['name', 'email', 'password']


class UserLoginSerializer(serializers.Serializer):
    class Meta:
        model = UserProfile
        fields = ['email', 'password']
