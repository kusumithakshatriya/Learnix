from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.models.ai_conversation import AIConversation
from app.models.ai_message import AIMessage
from app.schemas.ai_mentor import ChatRequest
from app.services.student_context_service import build_student_context
from app.services.ai_provider import get_ai_provider

def handle_chat(db: Session, current_user: User, request: ChatRequest) -> dict:
    conversation = None

    if request.conversation_id:
        conversation = db.query(AIConversation).filter(
            AIConversation.id == request.conversation_id,
            AIConversation.user_id == current_user.id
        ).first()

        if not conversation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found"
            )
    else:
        conversation = AIConversation(
            user_id=current_user.id,
            mode=request.mode.value,
            title=request.message[:50]
        )
        db.add(conversation)
        db.commit()
        db.refresh(conversation)

    # Save user message
    user_message = AIMessage(
        conversation_id=conversation.id,
        role="user",
        content=request.message
    )
    db.add(user_message)
    db.commit()

    # Get conversation history
    messages = db.query(AIMessage).filter(AIMessage.conversation_id == conversation.id).order_by(AIMessage.created_at).all()
    message_history = [{"role": m.role, "content": m.content} for m in messages]

    # Build context
    student_context = build_student_context(db, current_user)

    # Generate AI Response
    ai_provider = get_ai_provider()
    response_content = ai_provider.generate_response(message_history, request.mode.value, student_context)

    # Save assistant message
    assistant_message = AIMessage(
        conversation_id=conversation.id,
        role="assistant",
        content=response_content
    )
    db.add(assistant_message)
    db.commit()

    return {
        "conversation_id": conversation.id,
        "mode": request.mode,
        "message": {
            "role": assistant_message.role,
            "content": assistant_message.content
        },
        "context": student_context
    }
