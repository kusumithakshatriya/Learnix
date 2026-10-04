from pydantic import BaseModel, Field, constr
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

class MentorMode(str, Enum):
    TEACHER = "teacher"
    CAREER_MENTOR = "career_mentor"
    STUDY_COACH = "study_coach"
    MOTIVATION = "motivation"
    INTERVIEW_COACH = "interview_coach"
    PROJECT_MENTOR = "project_mentor"
    EXAM_COACH = "exam_coach"

class ChatRequest(BaseModel):
    message: constr(min_length=1, max_length=2000, strip_whitespace=True)
    mode: MentorMode
    conversation_id: Optional[int] = None

class AIMessageSchema(BaseModel):
    role: str
    content: str

    model_config = {'from_attributes': True}

class ChatResponse(BaseModel):
    conversation_id: int
    mode: MentorMode
    message: AIMessageSchema
    context: Dict[str, Any]

    model_config = {'from_attributes': True}
