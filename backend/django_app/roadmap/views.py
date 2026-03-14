from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
import requests
from roadmap.serializers import RoadMapSerializer, CareerRoleSerializer
from roadmap.models import CareerRole, RoadMap
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response

# Create your views here.
class GenerateRoadmapView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        career_serializer = CareerRoleSerializer(data=request.data)
        if career_serializer.is_valid():
            role_name = request.data.get("role_name")
            experience_level = request.data.get("experience_level")
            current_skills = request.data.get("current_skills")
            user_obj = User.objects.get(id=request.user)
           
            role_obj = CareerRole.objects.create(
                user=user_obj, role_name=role_name, experience_level=experience_level, current_skills=current_skills)
            response = requests.post("http://127.0.0.1:8001/generate_roadmap", json={
                                     "role_name": role_name, "experience_level": experience_level, "current_skills": current_skills})
            data=response.json()
            roadmap_serializer = RoadMapSerializer(data=data["roadmap"])
            
            if roadmap_serializer.is_valid():
                RoadMap.objects.create(role=role_obj, roadmap=response.json())
            else:
                return Response(roadmap_serializer.errors, status=400)
        else:
            return Response(career_serializer.errors, status=400)
