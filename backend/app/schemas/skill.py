from pydantic import BaseModel, Field
from datetime import datetime

class SkillBase(BaseModel):
    skill_name: str
    skill_level: int = Field(default=0, ge=0, le=100)

class SkillCreate(SkillBase):
    pass

class SkillResponse(SkillBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
