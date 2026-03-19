from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from schemas.requestSchema import ResumeAnalysisRequest, InterviewQuestionsRequest, Roadmap , AptitudeTestRequest
from langchain_groq import ChatGroq
from prompt.system_prompt import resume_prompt, roadmap_prompt, interview_questions_prompt , aptitude_test_prompt
from dotenv import load_dotenv
import os
import json


# fastapi app initialize
app = FastAPI()

# allowed origins
origins = [
    "http://localhost:8000",
    "http://localhost:5173"
]

# middlewares
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# load the api key
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
os.environ["GROQ_API_KEY"] = GROQ_API_KEY


# resume analysis and return a json response with insights and suggestions
@app.post("/analyze_resume")
async def analyze_resume(request: ResumeAnalysisRequest):
    resume_text = request.resume_text

    # initializing groq model
    groq_llm = ChatGroq(model="qwen/qwen3-32b",
                        temperature=0,
                        max_retries=2,
                        max_tokens=None,
                        timeout=30,
                        reasoning_format="parsed"
                        )
    # llm model request & response prompt
    messages = [
        ("system", resume_prompt),
        (
            "human",
            f"""
        Analyze the following resume carefully.

        Resume Content:
        ----------------
        {resume_text}
        ----------------

        Instructions:
        - Perform detailed ATS-style evaluation.
        - Be strict but fair in scoring.
        - Penalize missing metrics, vague descriptions, and lack of measurable impact.
        - Check for keyword alignment and clarity.
        - Ensure section scores logically align with overall score.
        - Provide realistic and actionable improvements.

        Remember:
        - Return ONLY valid JSON.
        - Follow the exact structure defined in the system instructions.
        """
        ),
    ]

    llm_model_response = groq_llm.invoke(messages)
    json_data_file = json.loads(llm_model_response.content)
    return {"analysis_result": json_data_file}




# generates a roadmap based on career role selected by user
@app.post("/generate_roadmap")
def generate_roadmap(request: Roadmap):
    career_role = request.career_role

    # initializing groq model
    groq_llm = ChatGroq(model="qwen/qwen3-32b",
                        temperature=0,
                        max_retries=2,
                        max_tokens=None,
                        timeout=30,
                        reasoning_format="parsed"
                        )
    # llm model request & response prompt
    messages = [
        ("system", roadmap_prompt),
        (
            "human",
            f"""
        Generate a detailed roadmap for {career_role} using a structured, phase-based format.
        
        
        Instructions:
        - Break the roadmap into progressive levels (e.g., Fundamentals → Intermediate → Advanced → Expert).
        - Ensure each level reflects real-world industry expectations and hiring standards.
        - Include clearly defined, skill-specific modules (avoid vague or generic topics).
        - Cover technical skills, tools, best practices, and relevant soft skills.
        - Maintain logical skill progression between levels.
        - Align modules with current market demand and ATS-relevant keywords.
        - Keep module names concise, practical, and outcome-driven.
        - Ensure the structure is clean, consistent, and scalable across different career roles.
        - Focus on career readiness, employability, and measurable competency development.

        Remember:
        - Return ONLY valid JSON.
        - Follow the exact structure defined in the system instructions.
        """
        ),
    ]
    llm_model_response = groq_llm.invoke(messages)
    json_data_file = json.loads(llm_model_response.content)
    return {"roadmap": json_data_file}



# generates a interview questions based on target role,company type,experience level,tech stack selected by user
@app.post("/generate_interview_questions")
def generate_interview_questions(request: InterviewQuestionsRequest):
    target_role = request.target_role
    company_type = request.company_type
    experience_level = request.experience_level
    tech_stack = request.tech_stack

    # initializing groq model
    groq_llm = ChatGroq(model="qwen/qwen3-32b",
                        temperature=0,
                        max_retries=2,
                        max_tokens=None,
                        timeout=30,
                        reasoning_format="parsed"
                        )
    # llm model request & response prompt
    messages = [
        ("system", interview_questions_prompt),
        (
            "human",
            f"""
        Generate interview questions strictly based on the following candidate profile:

        Target Role: {target_role}
        Company Type: {company_type}
        Experience Level: {experience_level}
        Primary Tech Stack: {(tech_stack)}

        Determine the appropriate difficulty level automatically based on experience level:
        - Entry level / 0–1 years → Easy
        - 1–3 years → Easy to Medium
        - 3–5 years → Medium
        - 5+ years → Medium to Hard
        - Senior / Lead roles → Hard

        Adapt depth based on company type:
        - FAANG / Big Tech → emphasize system design, optimization, scalability, and trade-offs.
        - Startup → emphasize practical implementation, ownership, and real-world problem solving.
        - Mid-size company → balanced theoretical + practical depth.

        Category Selection Rule:
        - If role is frontend → prioritize React, JS, performance, UI architecture.
        - If role is backend → prioritize APIs, databases, system design, scalability.
        - If role is fullstack → mix frontend + backend architecture.
        - If role is data/DSA focused → emphasize data structures & problem-solving.
        - Always align questions with provided tech stack.

        Requirements:
        - Questions must reflect real industry interview patterns.
        - Match complexity realistically with experience level.
        - Avoid vague theoretical questions.
        - For Medium: include applied debugging, performance, implementation logic.
        - For Hard: include architecture decisions, trade-offs, scalability, deep reasoning.
        - Ensure answers are concise, technically accurate, and professional.
        - Generate 5–8 well-balanced questions.
        - Return ONLY valid JSON.
        - Do NOT include explanations outside JSON.
        - Do NOT include <think>.
        - Do NOT use markdown formatting.
       """
        ),
    ]
    llm_model_response = groq_llm.invoke(messages)
    json_data_file = json.loads(llm_model_response.content)
    # print(json_data_file)
    return {"interview_questions": json_data_file}


# generates a aptitude questions based on task mode,category,difficulty level,no of questions selected by user
@app.post("/generate_aptitude_test")
async def generate_aptitude_test(request: AptitudeTestRequest):
    task_mode = request.test_mode
    category = request.category
    difficulty_level = request.difficulty_level
    no_of_questions = request.no_of_questions

    # initializing groq model
    groq_llm = ChatGroq(model="qwen/qwen3-32b",
                        temperature=0,
                        max_retries=2,
                        max_tokens=None,
                        timeout=30,
                        reasoning_format="parsed"
                        )
    # llm model request & response prompt
    messages = [
    ("system", aptitude_test_prompt),
    (
        "human",
        f"""
    Generate an aptitude test strictly based on the following configuration:

    Test Mode: {task_mode}
    Category: {category}
    Difficulty Level: {difficulty_level}
    Number of Questions: {no_of_questions}

    Test Mode Behavior Rules:
    - Practice Mode → Focus deeply on the selected category only.
    - Assessment Mode → Simulate a structured timed assessment with progressive difficulty consistency.
    - Full Developer Mock → Distribute questions across Logical Reasoning, Programming Logic, CS Fundamentals, Core Concepts, and Data Interpretation.

    Category Handling Rules:
    - If category is "All Categories":
      → Distribute questions intelligently across multiple aptitude domains.
    - Otherwise:
      → Focus strictly on the selected category.

    Difficulty Enforcement Rules:
    - Easy → Direct concept testing, simple reasoning, single-step logic.
    - Medium → Multi-step reasoning, applied problem solving, moderate complexity.
    - Hard → Advanced analytical reasoning, tricky edge cases, deeper conceptual evaluation.

    Distribution Rules:
    - Generate EXACTLY {no_of_questions} questions.
    - Ensure difficulty consistency across all generated questions.
    - Avoid repetition.
    - Avoid vague or overly theoretical questions.
    - Ensure questions resemble real company aptitude tests.
    - Include answer options (4 options per question).
    - Provide accurate correct_answer matching one of the options.

    Formatting Requirements:
    - Return ONLY valid JSON.
    - Do NOT add explanations outside JSON.
    - Do NOT include <think>.
    - Do NOT include markdown formatting.
    - Follow the predefined JSON structure strictly.
    """
        ),
    ]
    llm_model_response = groq_llm.invoke(messages)
    json_data_file = json.loads(llm_model_response.content)
    return {"aptitude_test": json_data_file}