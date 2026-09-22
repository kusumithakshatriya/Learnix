from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.user import User
from app.models.skill import Skill
from app.schemas.skill import SkillResponse, SkillCreate
from app.services.auth_service import get_current_active_user

router = APIRouter()

@router.get("", response_model=List[SkillResponse])
def get_skills(current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    skills = db.query(Skill).filter(Skill.user_id == current_user.id).all()
    return skills

@router.post("", response_model=SkillResponse, status_code=status.HTTP_201_CREATED)
def create_skill(
    skill_data: SkillCreate, 
    current_user: User = Depends(get_current_active_user), 
    db: Session = Depends(get_db)
):
    new_skill = Skill(
        user_id=current_user.id,
        **skill_data.model_dump()
    )
    db.add(new_skill)
    db.commit()
    db.refresh(new_skill)
    return new_skill
