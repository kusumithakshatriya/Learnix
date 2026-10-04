from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.user import User
from app.schemas.ai_mentor import ChatRequest, ChatResponse
from app.services.auth_service import get_current_active_user
from app.services import ai_mentor_service

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
def chat_endpoint(
    request: ChatRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Send a message to the AI Mentor."""
    return ai_mentor_service.handle_chat(db, current_user, request)
