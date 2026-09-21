from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.user import User
from app.models.goal import Goal
from app.schemas.goal import GoalResponse, GoalCreate
from app.services.auth_service import get_current_active_user

router = APIRouter()

@router.get("", response_model=List[GoalResponse])
def get_goals(current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    goals = db.query(Goal).filter(Goal.user_id == current_user.id).all()
    return goals

@router.post("", response_model=GoalResponse, status_code=status.HTTP_201_CREATED)
def create_goal(
    goal_data: GoalCreate, 
    current_user: User = Depends(get_current_active_user), 
    db: Session = Depends(get_db)
):
    new_goal = Goal(
        user_id=current_user.id,
        **goal_data.model_dump()
    )
    db.add(new_goal)
    db.commit()
    db.refresh(new_goal)
    return new_goal
