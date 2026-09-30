from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime
from app.schemas.education import EducationResponse
from app.schemas.goal import GoalResponse
from app.schemas.skill import SkillResponse
from app.schemas.interest import InterestResponse

class DashboardUser(BaseModel):
    name: Optional[str] = None
    email: EmailStr

class DashboardHighlights(BaseModel):
    strengths: List[str] = Field(default_factory=list)
    focus_areas: List[str] = Field(default_factory=list)
    missing_information: List[str] = Field(default_factory=list)

class DashboardQuickAction(BaseModel):
    key: str
    title: str
    reason: str

class DashboardMeta(BaseModel):
    generated_at: datetime
    version: str

class DashboardResponse(BaseModel):
    user: DashboardUser
    profile_completion: int
    education: Optional[EducationResponse] = None
    career_goal: Optional[GoalResponse] = None
    skills: List[SkillResponse] = Field(default_factory=list)
    interests: List[InterestResponse] = Field(default_factory=list)
    highlights: DashboardHighlights
    quick_actions: List[DashboardQuickAction]
    meta: DashboardMeta
