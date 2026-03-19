from django.shortcuts import render
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import InterviewPrepSerializer
from django.http import JsonResponse
from .models import InterviewPrep, InterviewQuestion
from django.contrib.auth.models import User


# Create your views here.
class Generate_questions(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = InterviewPrepSerializer(data=request.data)
        if serializer.is_valid():
            target_role = request.data.get('target_role')
            company_type = request.data.get('company')
            experience_level = request.data.get('experience_level')
            tech_stack = request.data.get('tech_stack')
            user_obj = User.objects.get(id=request.user)
            db_obj = InterviewPrep.objects.create(
                user=user_obj, target_role=target_role, company_type=company_type, experience_level=experience_level, tech_stack=tech_stack)
            response = requests.post("http://127.0.0.1:8001/generate_interview_questions", json={
                "target_role": target_role, "company_type": company_type, "experience_level": experience_level, "tech_stack": tech_stack})
            interview_questions_data = InterviewQuestion.objects.create(
                interview_prep=db_obj, question_answer_text=response.json())
            return JsonResponse(response.json())
        else:
            return Response(serializer.errors, status=400)
