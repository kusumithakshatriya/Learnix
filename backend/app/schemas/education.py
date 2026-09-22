from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class EducationBase(BaseModel):
    education_level: str
    branch: Optional[str] = None
    group_name: Optional[str] = None
    year: Optional[int] = None
    semester: Optional[int] = None
    institution: Optional[str] = None

class EducationCreate(EducationBase):
    pass

class EducationResponse(EducationBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    
    model_config = {'from_attributes': True}
