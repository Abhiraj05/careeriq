from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import AptitudeTest, AptitudeQuestions
from .serializers import StartTestSerializer, QuestionSerializer, SubmitAnswerSerializer, TestResultSerializer
import requests
from django.http import JsonResponse
import json

# Generating Aptitude Test
class StartTestView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        print(request)
        serializer = StartTestSerializer(data=request.data)
        
        if serializer.is_valid():
            test_mode = serializer.validated_data.get('test_mode')
            category = serializer.validated_data.get('category')
            subtopic = serializer.validated_data.get('subtopic')
            difficulty_level = serializer.validated_data.get('difficulty_level')
            no_of_questions = serializer.validated_data.get('no_of_questions') 
            user_profile = request.user

            aptitude_test = AptitudeTest.objects.create(user_id=user_profile, test_mode=test_mode, category=category, subtopic=subtopic, difficulty_level=difficulty_level, no_of_questions=no_of_questions)
            aptitude_test.save()
            
            if aptitude_test.category == "All Categories" or aptitude_test.test_mode == "Full Developer Mock":
                all_category = "Quantitative Aptitude, Logical Reasoning, Verbal Ability, Data Interpretation, Technical Aptitude"
                response = requests.post("http://127.0.0.1:8001/generate_aptitude_test", json={
                "test_mode": test_mode, "category": all_category, "subtopic": "None", "difficulty_level": difficulty_level , "no_of_questions": no_of_questions})
            else:
                response = requests.post("http://127.0.0.1:8001/generate_aptitude_test", json={
                "test_mode": test_mode, "category": category, "subtopic": subtopic, "difficulty_level": difficulty_level, "no_of_questions": no_of_questions})
            
            if response.status_code != 200:
                aptitude_test.delete()
                return JsonResponse({"error": "Failed to generate aptitude test from AI.", "details": response.text}, status=response.status_code)
                
            try:
                response_data = response.json()
            except ValueError:
                aptitude_test.delete()
                return JsonResponse({"error": "Invalid JSON received from AI service.", "details": response.text}, status=500)

            created_questions = []
            for q in response_data.get("questions", []):
                options = q.get("options", [])
                ans_idx = q.get("answer_index", 0)
                
                correct_ans_text = ""
                if options and ans_idx < len(options):
                    correct_ans_text = str(options[ans_idx])

                question_obj = AptitudeQuestions.objects.create(
                    test=aptitude_test, 
                    category=category, 
                    subtopic=subtopic, 
                    question_text=q.get("text", ""), 
                    options=options,
                    correct_answer=correct_ans_text, 
                    difficulty_level=difficulty_level
                )
                
                created_questions.append({
                    "id": question_obj.id,
                    "text": question_obj.question_text,
                    "options": question_obj.options,
                    "answer_index": ans_idx
                })

            return JsonResponse({
                "id": aptitude_test.id,
                "test_mode": test_mode,
                "category": category,
                "subtopic": subtopic,
                "difficulty_level": difficulty_level,
                "question": created_questions
            }, safe=False)
        return Response(serializer.errors, status=400)
        
# Checks Users Answer and Update the Score
class SubmitAnswerView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        serializer = SubmitAnswerSerializer(data=request.data)
        if serializer.is_valid():
            question_id = serializer.validated_data.get('id')
            user_answer = serializer.validated_data.get('user_answer')
            try:
                question = AptitudeQuestions.objects.get(id=question_id)
            except AptitudeQuestions.DoesNotExist:
                return JsonResponse({"error": "Question not found."}, status=404)
            
            question.user_answer = user_answer
            question.is_correct = (str(user_answer).strip().lower() == str(question.correct_answer).strip().lower())
            question.save()
            
            test = question.test
            correct_count = AptitudeQuestions.objects.filter(test=test, is_correct=True).count()
            answered_count = AptitudeQuestions.objects.filter(test=test).exclude(user_answer=None).exclude(user_answer='').count()
            test.no_of_correct_answers = correct_count
            test.no_of_attempts = answered_count
            if test.no_of_questions > 0:
                test.score = (correct_count / test.no_of_questions) * 100
            test.save()
            
            return JsonResponse({
                "id": question.id,
                "user_answer": user_answer,
                "is_correct": question.is_correct
            }, safe=False)
        return Response(serializer.errors, status=400)
        
# Fetch the Users Aptitude History
class Test_History_View(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        tests = AptitudeTest.objects.filter(user_id=request.user).order_by('-created_at')
        serializer = TestResultSerializer(tests, many=True)
        return Response(serializer.data)

# Fetch detailed results and question for each Aptitude Test
class GetTestDetailView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, test_id):
        try:
            test = AptitudeTest.objects.get(id=test_id, user_id=request.user)
        except AptitudeTest.DoesNotExist:
            return JsonResponse({"error": "Test not found."}, status=404)
        questions = list(AptitudeQuestions.objects.filter(test=test).order_by('id').values(
            'id', 'question_text', 'options', 'correct_answer', 'user_answer', 'is_correct', 'difficulty_level'
        ))
        formatted = [{"id": q["id"], "q": q["question_text"], "opts": q["options"],
                      "ans": q["options"].index(q["correct_answer"]) if q["correct_answer"] in (q["options"] or []) else 0,
                      "user_answer": q["user_answer"], "is_correct": q["is_correct"]} for q in questions]
        return JsonResponse({
            "id": test.id, "test_mode": test.test_mode, "category": test.category,
            "difficulty_level": test.difficulty_level, "score": test.score,
            "no_of_questions": test.no_of_questions, "no_of_correct_answers": test.no_of_correct_answers,
            "created_at": test.created_at.strftime("%b %d, %Y"), "questions": formatted
        })
