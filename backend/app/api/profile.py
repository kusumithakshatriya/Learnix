from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.user import User
from app.models.profile import Profile
from app.schemas.profile import ProfileResponse, ProfileUpdate
from app.services.auth_service import get_current_active_user

router = APIRouter()

@router.get("", response_model=ProfileResponse)
def get_profile(current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@router.put("", response_model=ProfileResponse)
def update_profile(
    profile_data: ProfileUpdate, 
    current_user: User = Depends(get_current_active_user), 
    db: Session = Depends(get_db)
):
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    if profile_data.name is not None:
        profile.name = profile_data.name
    if profile_data.phone is not None:
        profile.phone = profile_data.phone
    if profile_data.student_type is not None:
        profile.student_type = profile_data.student_type
        
    db.commit()
    db.refresh(profile)
    return profile
