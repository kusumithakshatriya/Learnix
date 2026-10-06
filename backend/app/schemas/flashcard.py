from pydantic import BaseModel
from datetime import datetime

class FlashcardBase(BaseModel):
    question: str
    answer: str

class FlashcardResponse(FlashcardBase):
    id: int
    document_id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    
    model_config = {'from_attributes': True}
