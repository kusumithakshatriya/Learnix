from sqlalchemy.orm import Session
from fastapi import HTTPException, status, UploadFile
from app.models.user import User
from app.models.document import Document
from app.schemas.document import DocumentCreate, DocumentStatus
from app.services.storage_service import validate_and_save_upload, delete_stored_file
import os

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

def upload_document(db: Session, user: User, file: UploadFile) -> Document:
    file_path, file_size = validate_and_save_upload(user.id, file)

    title = os.path.splitext(file.filename)[0] if file.filename else "Untitled"

    new_doc = Document(
        user_id=user.id,
        title=title,
        source_type="file",
        file_name=file.filename,
        file_path=file_path,
        mime_type=file.content_type,
        file_size=file_size,
        status=DocumentStatus.PENDING.value
    )

    try:
        db.add(new_doc)
        db.commit()
        db.refresh(new_doc)
    except Exception as e:
        db.rollback()
        delete_stored_file(file_path)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to save document record")

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
    file_path_to_delete = doc.file_path

    try:
        db.delete(doc)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to delete document record")

    # Clean up physical file if it exists, only after successful DB deletion
    if file_path_to_delete:
        delete_stored_file(file_path_to_delete)

    return {"message": "Document deleted successfully"}
