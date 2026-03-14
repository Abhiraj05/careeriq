from django.db import models
from user.models import userprofile
# Create your models here.

class roles(models.TextChoices):
    FRONTEND = 'Frontend Developer'
    BACKEND = 'Backend Developer'
    FULLSTACK = 'Full Stack Developer'
    MOBILEDEVELOPER = 'Mobile Developer'
    DATASCIENTIST = 'Data Scientist'
    DEVOPS = 'DevOps Engineer'

class ExperienceLevel(models.TextChoices):
    BEGINNER = 'Beginner'
    INTERMEDIATE = 'Intermediate'
    ADVANCED = 'Advanced'


class CareerRole(models.Model):
    user = models.ForeignKey(userprofile, on_delete=models.CASCADE)
    role_name = models.CharField(max_length=100, choices=roles.choices)
    experience_level = models.CharField(max_length=50,choices=roles.choices)
    current_skills = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class RoadMap(models.Model):
    role = models.ForeignKey(CareerRole, on_delete=models.CASCADE)
    roadmap=models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
    

# class RoadMapLevels(models.Model):
#     user_id = models.ForeignKey(userprofile, on_delete=models.CASCADE)
#     roadmap = models.ForeignKey(Roadmap, on_delete=models.CASCADE)
#     level_no = models.IntegerField()
#     level_name = models.CharField(max_length=100)

# class RoadMapSkills(models.Model):
#     user_id = models.ForeignKey(userprofile, on_delete=models.CASCADE)
#     roadmap_level = models.ForeignKey(RoadMapLevels, on_delete=models.CASCADE)
#     skill_name = models.CharField(max_length=100)
#     skill_description = models.TextField()
#     esimated_time = models.CharField(max_length=50)