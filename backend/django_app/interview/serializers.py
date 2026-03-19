from rest_framework import serializers
from .models import InterviewPrep, InterviewQuestion


class InterviewPrepSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterviewPrep
        fields = ['target_role', 'company', 'experience_level', 'tech_stack']
