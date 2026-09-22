from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from app.schemas.profile import ProfileResponse
from app.schemas.education import EducationResponse
from app.schemas.skill import SkillResponse
from app.schemas.goal import GoalResponse
from app.schemas.interest import InterestResponse

class LearningPreferences(BaseModel):
    preferred_learning_style: Optional[str] = None
    available_study_hours: Optional[int] = None
    preferred_difficulty: Optional[str] = None
    preferred_content_format: Optional[str] = None

class StudentDNAUpdate(BaseModel):
    learning_preferences: Optional[LearningPreferences] = None

class StudentDNAResponse(BaseModel):
    user_id: int
    profile: Optional[ProfileResponse] = None
    education: List[EducationResponse] = []
    skills: List[SkillResponse] = []
    goals: List[GoalResponse] = []
    interests: List[InterestResponse] = []
    learning_preferences: LearningPreferences
    profile_completion: int
    created_at: datetime
    updated_at: datetime
    
    model_config = {'from_attributes': True}
