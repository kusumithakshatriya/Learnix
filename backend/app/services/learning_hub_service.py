from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.models.document import Document
from app.schemas.document import DocumentCreate, DocumentStatus

def create_document(db: Session, user: User, data: DocumentCreate) -> Document:
    # Basic creation for phase 5
    new_doc = Document(
        user_id=user.id,
        title=data.title,
        source_type=data.source_type.value,
        source_url=data.source_url,
        extracted_text=data.extracted_text,
        status=DocumentStatus.PENDING.value
    )
    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)
    return new_doc

def get_documents(db: Session, user: User):
    return db.query(Document).filter(Document.user_id == user.id).all()

def get_document(db: Session, user: User, document_id: int) -> Document:
    doc = db.query(Document).filter(Document.id == document_id, Document.user_id == user.id).first()
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
    return doc

def delete_document(db: Session, user: User, document_id: int):
    doc = get_document(db, user, document_id)
    db.delete(doc)
    db.commit()
    return {"message": "Document deleted successfully"}
