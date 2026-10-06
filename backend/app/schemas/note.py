from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class NoteBase(BaseModel):
    title: Optional[str] = None
    content: str

class NoteResponse(NoteBase):
    id: int
    document_id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    
    model_config = {'from_attributes': True}
