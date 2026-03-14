from django.db import models
from user.models import UserProfile
# Create your models here.
class company_type(models.TextChoices):
    STARTUP = 'Startup Company'
    MID_SIZE = 'Mid-size Company'
    FAANG = 'FAANG Company'
    FORTUNE500 = 'Fortune 500 Company'
    CONSULTING = 'Consulting Firm'
    DEVOPS = 'DevOps Engineer'

class Experience(models.TextChoices):
    ZERO_TO_ONE = '0-1 years'
    ONE_TO_THREE = '1-3 years'
    THREE_TO_FIVE = '3-5 years'
    FIVE_PLUS = '5+ years'


class InterviewPrep(models.Model):
    user_id = models.ForeignKey(UserProfile , on_delete=models.CASCADE)
    target_role = models.CharField(max_length=100 , choices=company_type.choices)
    experience_level = models.CharField(max_length=50 , choices=Experience.choices)
    tech_stack = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class InterviewQuestion(models.Model):
    interview_prep = models.ForeignKey(InterviewPrep, on_delete=models.CASCADE)
    question_text = models.TextField()
    answer_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)