from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database.connection import get_db
from app.models.user import User
from app.schemas.interest import InterestCreate, InterestResponse
from app.services.auth_service import get_current_active_user
from app.services import student_dna_service

router = APIRouter()

@router.get("", response_model=List[InterestResponse])
def get_interests_endpoint(
    current_user: User = Depends(get_current_active_user), 
    db: Session = Depends(get_db)
):
    """Get all interests for the current user."""
    return student_dna_service.get_interests(db, current_user.id)

@router.post("", response_model=InterestResponse, status_code=status.HTTP_201_CREATED)
def add_interest_endpoint(
    data: InterestCreate, 
    current_user: User = Depends(get_current_active_user), 
    db: Session = Depends(get_db)
):
    """Add a new interest for the current user."""
    return student_dna_service.add_interest(db, current_user.id, data)

@router.delete("/{interest_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_interest_endpoint(
    interest_id: int, 
    current_user: User = Depends(get_current_active_user), 
    db: Session = Depends(get_db)
):
    """Delete an interest for the current user."""
    student_dna_service.delete_interest(db, current_user.id, interest_id)
    return
