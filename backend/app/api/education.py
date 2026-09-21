from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.user import User
from app.models.education import Education
from app.schemas.education import EducationResponse, EducationCreate
from app.services.auth_service import get_current_active_user

router = APIRouter()

@router.get("", response_model=List[EducationResponse])
def get_education(current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    education = db.query(Education).filter(Education.user_id == current_user.id).all()
    return education

@router.post("", response_model=EducationResponse, status_code=status.HTTP_201_CREATED)
def create_education(
    education_data: EducationCreate, 
    current_user: User = Depends(get_current_active_user), 
    db: Session = Depends(get_db)
):
    new_education = Education(
        user_id=current_user.id,
        **education_data.model_dump()
    )
    db.add(new_education)
    db.commit()
    db.refresh(new_education)
    return new_education
