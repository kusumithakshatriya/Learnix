from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database.connection import get_db
from app.models.user import User
from app.schemas.student_dna import StudentDNAResponse, StudentDNAUpdate
from app.schemas.interest import InterestCreate, InterestResponse
from app.services.auth_service import get_current_active_user
from app.services import student_dna_service

router = APIRouter()

@router.get("", response_model=StudentDNAResponse)
def get_student_dna_endpoint(
    current_user: User = Depends(get_current_active_user), 
    db: Session = Depends(get_db)
):
    """Retrieve the current user's Student DNA."""
    return student_dna_service.get_student_dna(db, current_user)

@router.put("", response_model=StudentDNAResponse)
def update_student_dna_endpoint(
    data: StudentDNAUpdate, 
    current_user: User = Depends(get_current_active_user), 
    db: Session = Depends(get_db)
):
    """Update learning preferences in the current user's Student DNA."""
    return student_dna_service.update_student_dna(db, current_user.id, data)
