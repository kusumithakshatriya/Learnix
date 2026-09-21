from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date

class GoalBase(BaseModel):
    career_goal: str
    target_date: Optional[date] = None

class GoalCreate(GoalBase):
    pass

class GoalResponse(GoalBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
