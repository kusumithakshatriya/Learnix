from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum

class SourceType(str, Enum):
    FILE = "file"
    URL = "url"
    YOUTUBE = "youtube"
    TEXT = "text"

class DocumentStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

class DocumentBase(BaseModel):
    title: str
    source_type: SourceType
    source_url: Optional[str] = None
    extracted_text: Optional[str] = None

class DocumentCreate(DocumentBase):
    pass

class DocumentResponse(DocumentBase):
    id: int
    user_id: int
    file_name: Optional[str] = None
    file_path: Optional[str] = None
    mime_type: Optional[str] = None
    status: DocumentStatus
    created_at: datetime
    updated_at: datetime
    
    model_config = {'from_attributes': True}
