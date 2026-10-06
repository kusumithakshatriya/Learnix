from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List

from app.database.connection import get_db
from app.models.user import User
from app.schemas.document import DocumentCreate, DocumentResponse
from app.services.auth_service import get_current_active_user
from app.services import learning_hub_service

router = APIRouter()

@router.post("/documents", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
def create_document_endpoint(
    data: DocumentCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Upload or create a new document in the Learning Hub."""
    return learning_hub_service.create_document(db, current_user, data)

from fastapi import UploadFile, File

@router.post("/documents/upload", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
def upload_document_endpoint(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Upload a physical document file."""
    return learning_hub_service.upload_document(db, current_user, file)

@router.get("/documents", response_model=List[DocumentResponse])
def get_documents_endpoint(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get all documents for the current user."""
    return learning_hub_service.get_documents(db, current_user)

@router.get("/documents/{document_id}", response_model=DocumentResponse)
def get_document_endpoint(
    document_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get a specific document."""
    return learning_hub_service.get_document(db, current_user, document_id)

@router.delete("/documents/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_document_endpoint(
    document_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete a document."""
    learning_hub_service.delete_document(db, current_user, document_id)
    return
