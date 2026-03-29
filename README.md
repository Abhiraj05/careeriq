# CareerIQ - AI Career Intelligence Platform

An intelligent application designed to help students and professionals improve their career preparation using AI. The platform provides tools for generating career roadmaps, practicing interviews, building resumes, and solving aptitude tests. Built with a modern full-stack architecture using React, Django, FastAPI, and LangChain.

---

## Features

* AI Career Roadmaps: Generate personalized learning paths based on career goals
* Mock Interviews: Practice interview questions with AI-based feedback
* Resume Builder: Create ATS-friendly resumes
* Aptitude Tests: Solve role-based and difficulty-based questions
* Progress Tracking: Monitor performance and improvement areas
* User Authentication: Secure login and registration system
* Responsive UI: Built using React and Tailwind CSS

---

## Architecture

### Tech Stack

#### Frontend:

* React
* Tailwind CSS
* Framer Motion

#### Backend:

* Django with Django REST Framework
* FastAPI (for AI operations)
* JWT Authentication

#### AI/ML:

* Groq API
* LangChain

#### Database:

* SQLite / PostgreSQL

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/careeriq.git
cd careeriq
```

---

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on http://localhost:5173

---

### 3. Backend Setup - Django

```bash
cd backend/django_app

# create environment
python -m venv env

# Windows
env\Scripts\activate

# macOS / Linux
source env/bin/activate

pip install -r requirements.txt

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Start Django server
python manage.py runserver
```

Django runs on http://127.0.0.1:8000

---

### 4. Backend Setup - FastAPI

```bash
cd backend/fastapi_app

# create environment
python -m venv env

# Windows
env\Scripts\activate

# macOS / Linux
source env/bin/activate

# Create .env file
echo "GROQ_API_KEY=your_groq_api_key_here" > .env

pip install -r requirements.txt

# Start FastAPI server
uvicorn main:app --reload --port 8001
```

FastAPI runs on http://127.0.0.1:8001

---

## Configuration

### Environment Variables

#### FastAPI

Create `.env` file in `backend/fastapi_app/`

```bash
GROQ_API_KEY=your_groq_api_key
```

---

## Screenshots

### Home
![image](assets/screencapture-localhost-5173-2026-03-28-23_19_16.png)

---

### User Authentication
![image](assets/screencapture-localhost-5173-login-2026-03-28-23_21_53.png)

---
![image](assets/screencapture-localhost-5173-register-2026-03-28-23_21_29.png)

---

### Password Reset
![Forgot Password](assets\screencapture-localhost-5173-forgot-password-2026-03-29-11_33_47.png)

---
![Password Reset](assets\screencapture-localhost-5173-setnewpassword-2026-03-29-11_34_04.png)

---
### DashBoard :- 
### Overview
![image](assets/screencapture-localhost-5173-dashboard-2026-03-28-23_22_46.png)

---
### Generate Roadmap
![image](assets/screencapture-localhost-5173-dashboard-roadmap-2026-03-28-23_24_07.png)

---
### Interview Preparation
![image](assets/screencapture-localhost-5173-dashboard-interview-2026-03-28-23_25_40.png)

---
### Resume Analyzer
![image](assets/screencapture-localhost-5173-dashboard-resume-2026-03-28-23_26_18.png)

---
### Aptitude Practice
![image](assets/screencapture-localhost-5173-dashboard-aptitude-2026-03-28-23_26_40.png)

---
### Progress Tracker
![image](assets/screencapture-localhost-5173-dashboard-aptitude-2026-03-28-23_27_31.png)

---
![image](assets/screencapture-localhost-5173-dashboard-progress-2026-03-28-23_27_50.png)

---
### Settings
![image](assets/screencapture-localhost-5173-dashboard-settings-2026-03-28-23_28_09.png)

