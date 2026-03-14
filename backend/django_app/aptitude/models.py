from django.db import models
from user.models import UserProfile
# Create your models here.

# class Select_Role(models.TextChoices):
#     Backend_Developer = 'Backend Developer'
#     Frontend_Developer = 'Frontend Developer'
#     Fullstack_Developer = 'Fullstack Developer'
#     Data_Analyst = 'Data Analyst'
#     SDE1 = 'SDE1'
#     Product_Engineer = 'Product Engineer'

class Select_Test_Mode(models.TextChoices):
    Practice_Mode = 'Practice Mode'
    Timed_Assesment = 'Assessment Mode'
    Full_Developer_Mock = 'Full Developer Mock'

class Select_Category(models.TextChoices):
    Logical_Reasoning = 'Logical Reasoning'
    Programming_Logic = 'Programming Logic'
    CS_Fundamentals = 'CS Fundamentals'
    Core_Concepts = 'Core Concepts'
    Data_Interpretation = 'Data Interpretation'
    All_Categories = 'All Categories'

class Difficulty_Level(models.TextChoices):
    Easy = 'Easy'
    Medium = 'Medium'
    Hard = 'Hard'

class AptitudeQuestions(models.Model):
    test = models.ForeignKey('AptitudeTest', on_delete=models.CASCADE, related_name='questions')
    category = models.CharField(max_length=50 , choices=Select_Category.choices)
    question_text = models.JSONField()
    user_answer = models.TextField(blank=True, null=True)
    is_correct = models.BooleanField(default=False)
    correct_answer = models.JSONField()
    difficulty_level = models.CharField(max_length=20 , choices=Difficulty_Level.choices)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class AptitudeTest(models.Model):
    user_id = models.ForeignKey(UserProfile , on_delete=models.CASCADE)
    # role = models.CharField(max_length=50 , choices=Select_Role.choices)
    test_mode = models.CharField(max_length=50 , choices=Select_Test_Mode.choices)
    category = models.CharField(max_length=50 , choices=Select_Category.choices)
    difficulty_level = models.CharField(max_length=20 , choices=Difficulty_Level.choices)
    no_of_questions = models.IntegerField(default=0)    
    no_of_attempts = models.IntegerField(default=0,)
    no_of_correct_answers = models.IntegerField(default=0)
    score = models.FloatField(default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)



    
