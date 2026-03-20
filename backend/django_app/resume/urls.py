from django.contrib import admin
from django.urls import path
from resume.views import ResumeUploadView
urlpatterns = [
    path('admin/', admin.site.urls),
    path('upload/', ResumeUploadView.as_view(), name='resume_upload'),
]