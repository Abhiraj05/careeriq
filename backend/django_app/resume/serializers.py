from resume.models import UserResume
from rest_framework import serializers


class ResumeUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserResume
        fields = ['resume_file']

    def validateFile(self, value):
        allowed_extensions = ['pdf', 'doc', 'docx']
        extensions = value.name.split('.')[-1].lower()

        if extensions not in allowed_extensions:
            raise serializers.ValidationError(
                "Only PDF, DOC, and DOCX files are allowed.")

        if value.size > 5*1024*1024:
            raise serializers.ValidationError("file size must be under 5mb.")

        return value
