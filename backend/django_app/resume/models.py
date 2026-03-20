from django.db import models
from user.models import UserProfile
# Create your models here.
class UserResume(models.Model):
    user_id = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    resume_file = models.FileField(upload_to='resumes_files/')
    extracted_text = models.TextField()
    uploaded_at = models.DateTimeField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)

class ResumeAnalysis(models.Model): 
    user_id = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    analysis_result = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)