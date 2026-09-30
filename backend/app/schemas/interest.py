from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class InterestBase(BaseModel):
    name: str
    category: Optional[str] = None

class InterestCreate(InterestBase):
    pass

class InterestResponse(InterestBase):
    id: int
    user_id: int
    created_at: datetime
    
    model_config = {'from_attributes': True}
