from pydantic import BaseModel
from datetime import datetime

class SummaryBase(BaseModel):
    content: str

class SummaryResponse(SummaryBase):
    id: int
    document_id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    
    model_config = {'from_attributes': True}
