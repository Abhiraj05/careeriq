from django.http import JsonResponse
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from resume.models import UserResume, ResumeAnalysis
import uuid
from resume.serializers import ResumeUploadSerializer, ResumeDetailSerializer
from markdown_it import MarkdownIt
from django.contrib.auth.models import User
import os

def file_text_extract(file):
    temp_path = None
    text = None
    extract = MarkdownIt()
    temp_path = f"temp_{uuid.uuid4()}_{file}"
    f = open(temp_path, "wb")
    for chunk in file.chunks():
        f.write(chunk)
    f.close

    try:
        result = extract.convert(temp_path)
        text = result.text_content
    except Exception as e:
        if not isinstance(text, str):
            return None
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)
    return text

class ResumeUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ResumeUploadSerializer(data=request.data)

        if serializer.is_valid():
            resume_file = serializer.validated_data['resume_file']
            text = file_text_extract(resume_file)
            if text is None:
                return Response({'error': 'Failed to extract text from the resume.'},
                                status=status.HTTP_400_BAD_REQUEST)
            resume = userresume.objects.create(user=request.user, resume_file=resume_file , extracted_text=text)
            resume.save()
            response = requests.post("http://127.0.0.1:8001/analyze_resume",
            json={
                    "resume_text": text})
            analysis = ResumeAnalysis.objects.create(user=request.user,resume_text=text,analysis_result=response.json())

            return JsonResponse({
                "id": analysis.id,
                "resume_text": text,
                "analysis_data": response.json()
            }, safe=False)
        




